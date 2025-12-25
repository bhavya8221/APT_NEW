import React, { useEffect, useRef, useState } from "react";
import { fetchAllConversations } from "@/app/store/slices/conversationSlice";
import { ChatExpend, ChatShorte, ChatPayload } from "@/utils/api/Api";
import ChatInput from "../ChatInput/ChatInput";
import ChatMessage from "../ChatInput/ChatMessage";
import ProposalForm from "./ProposalForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./ChatWindow.scss";

/* ICON CASTING */
import { FaCircleInfo as FaCircleInfoRaw } from "react-icons/fa6";
import { BsRobot as BsRobotRaw } from "react-icons/bs";
import { FaRegCopy as FaRegCopyRaw } from "react-icons/fa";
import { FaFileSignature as FaFileSignatureRaw } from "react-icons/fa";
import { AiOutlineExpandAlt as AiExpandRaw } from "react-icons/ai";
import { AiOutlineShrink as AiShrinkRaw } from "react-icons/ai";
import { BsX as BsXRaw } from "react-icons/bs";

const FaCircleInfo = FaCircleInfoRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsRobot = BsRobotRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaRegCopy = FaRegCopyRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaFileSignature = FaFileSignatureRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const AiExpand = AiExpandRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const AiShrink = AiShrinkRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsX = BsXRaw as React.FC<React.SVGProps<SVGSVGElement>>;

/* TYPES */
export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string | null;
}

export interface Conversation {
  id?: string | number;
  title?: string;
  chats?: ChatMessage[];
}

interface ChatWindowProps {
  conversation: Conversation | null;
  onNewConversation: (c: Conversation) => void;
  resetTrigger?: any;
}

/* CUSTOM TOAST */
const showToast = (message: string, type: "success" | "error" = "success") => {
  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
};

/* STREAMING HOOK */
const useChatStream = (
  currentConversation: Conversation | null,
  conversationTitle: string,
  setConversationTitle: (t: string) => void,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  dispatch: any
) => {
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const typingBuffer = useRef("");
  const typingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamedReplyRef = useRef("");

  const streamMessage = async (text: string) => {
    const token = localStorage.getItem("UserLoginTokenApt");
    if (!token || !text.trim()) return;

    const isNew = currentConversation?.id ? 0 : 1;
    const titleToUse = conversationTitle || text;
    if (!conversationTitle) setConversationTitle(text);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
    };

    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setLoading(true);
    setIsStreaming(true);

    try {
      const response = await fetch(
        "https://node.automatedpricingtool.io:5000/api/v1/aichat/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            is_new: isNew,
            conversation_id: currentConversation?.id || "",
            query: text,
            conversation_title: titleToUse,
          }),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      streamedReplyRef.current = "";
      typingBuffer.current = "";

      if (typingInterval.current) clearInterval(typingInterval.current);
      typingInterval.current = null;

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const decoded = decoder.decode(value, { stream: true });
        buffer += decoded;

        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const fullChunk = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          if (fullChunk.startsWith("data:")) {
            const chunk = fullChunk.replace("data:", "").trim();
            if (chunk === "[DONE]") {
              setLoading(false);
              setIsStreaming(false);
              if (typingInterval.current) clearInterval(typingInterval.current);
              if (isNew === 1) dispatch(fetchAllConversations());
              return;
            }

            try {
              const json = JSON.parse(chunk);
              if (json.type === "final") {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].text =
                    json?.token?.chats?.[0]?.message || "";
                  return updated;
                });
                if (typingInterval.current)
                  clearInterval(typingInterval.current);
                setIsStreaming(false);
              } else if (json.token) {
                const safeToken = json.token.replace(/\n/g, "<br/>");
                typingBuffer.current += safeToken;

                if (!typingInterval.current) {
                  typingInterval.current = setInterval(() => {
                    if (typingBuffer.current.length > 0) {
                      setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1].text =
                          (updated[updated.length - 1].text || "") +
                          typingBuffer.current;
                        return updated;
                      });
                      typingBuffer.current = "";
                    }
                  }, 30);
                }
              }
            } catch (err) {
              console.error("JSON parse err:", err);
            }
          }
          boundary = buffer.indexOf("\n\n");
        }
      }
    } catch (err) {
      showToast("Unable to stream message", "error");
      console.error(err);
    } finally {
      setLoading(false);
      setIsStreaming(false);
      if (typingInterval.current) clearInterval(typingInterval.current);
    }
  };

  return { streamMessage, loading, isStreaming };
};

/* MAIN COMPONENT */
const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  resetTrigger,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    conversation?.chats || []
  );
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(conversation);
  const [conversationTitle, setConversationTitle] = useState(
    conversation?.title || ""
  );
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [expandLoading, setExpandLoading] = useState<Record<number, boolean>>(
    {}
  );
  const [expandState, setExpandState] = useState<
    Record<number, "expand" | "shorten" | null>
  >({});
  const [showTooltip, setShowTooltip] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { streamMessage, loading, isStreaming } = useChatStream(
    currentConversation,
    conversationTitle,
    setConversationTitle,
    setMessages,
    dispatch
  );

  useEffect(() => {
    setCurrentConversation(conversation);
    setMessages(conversation?.chats || []);
    setConversationTitle(conversation?.title || "");
    setExpandState({});
  }, [conversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isStreaming]);

  /* Proposal Navigation */
  const submitProposal = (proposalData: any) => {
    setProposalModalOpen(false);
    navigate("/proposal-editor", { state: proposalData });
  };

  /* Copy Message */
  const handleCopy = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || "";
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  /* Expand / Shorten */
  const expandOrShorten = async (
    idx: number,
    content: string,
    type: "expand" | "shorten"
  ) => {
    setExpandLoading((prev) => ({ ...prev, [idx]: true }));
    try {
      const payload: ChatPayload = {
        conversation_id: currentConversation?.id,
        message: content,
      };
      const res =
        type === "expand"
          ? await ChatExpend(payload)
          : await ChatShorte(payload);
      const updated = res?.data?.data;
      if (updated) {
        setMessages((prev) =>
          prev.map((m, i) => (i === idx ? { ...m, text: updated } : m))
        );
        setExpandState((prev) => ({
          ...prev,
          [idx]: type,
        }));
      }
    } catch (err) {
      showToast("Unable to process text", "error");
    } finally {
      setExpandLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <div className="chat-window">
      {/* HEADER */}
      <div className="chat-header">
        <h1 className="conversation-title">
          {conversationTitle || "New Chat"}
        </h1>
        <div
          className="info-button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <FaCircleInfo />
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="header-tooltip">
            <div className="tooltip-title">Welcome to Ask Ceddie</div>
            <div className="tooltip-text">
              Your AI-powered proposal generation assistant. Simply type your
              requirements and Ceddie will create a customized proposal.
            </div>
            <div className="tooltip-example">
              <strong>Example:</strong> "Create a proposal for a Financial
              Literacy workshop for 100 participants in Mumbai."
            </div>
            <div className="tooltip-tag">
              Accurate • Efficient • Professional
            </div>
          </div>
        )}
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {/* Empty State */}
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">
              <BsRobot />
            </div>
            <h3>Start a conversation</h3>
            <p>Ask me anything about proposals or pricing!</p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={msg.id} className="message-wrapper">
            <ChatMessage
              sender={msg.sender}
              text={msg.text || ""}
              isStreaming={i === messages.length - 1 && isStreaming}
            />

            {/* Bot Message Actions */}
            {msg.sender === "bot" && msg.text && (
              <div className="message-actions">
                <button
                  className="action-btn"
                  onClick={() => handleCopy(msg.text!)}
                  title="Copy message"
                >
                  <FaRegCopy />
                  <span>Copy</span>
                </button>

                <button
                  className="action-btn"
                  onClick={() => setProposalModalOpen(true)}
                  title="Generate proposal"
                >
                  <FaFileSignature />
                  <span>Proposal</span>
                </button>

                <button
                  className="action-btn"
                  disabled={expandLoading[i]}
                  onClick={() =>
                    expandOrShorten(
                      i,
                      msg.text!,
                      expandState[i] === "expand" ? "shorten" : "expand"
                    )
                  }
                  title={
                    expandState[i] === "expand" ? "Shorten text" : "Expand text"
                  }
                >
                  {expandLoading[i] ? (
                    <div className="btn-spinner" />
                  ) : expandState[i] === "expand" ? (
                    <>
                      <AiShrink />
                      <span>Shorten</span>
                    </>
                  ) : (
                    <>
                      <AiExpand />
                      <span>Expand</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && !isStreaming && (
          <div className="loading-message">
            <div className="loading-avatar">
              <div className="pulse-ring" />
            </div>
            <div className="loading-content">
              <span>Ceddie is thinking</span>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* INPUT */}
      <ChatInput
        onSendMessage={({ text }) => streamMessage(text)}
        resetTrigger={resetTrigger}
        onTemplateSelect={() => {}}
      />

      {/* PROPOSAL MODAL */}
      {proposalModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setProposalModalOpen(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Generate Proposal</h2>
                <p>Customize your proposal details below</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setProposalModalOpen(false)}
              >
                <BsX />
              </button>
            </div>
            <div className="modal-body">
              <ProposalForm
                selectedProposal={currentConversation}
                onSubmit={submitProposal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
