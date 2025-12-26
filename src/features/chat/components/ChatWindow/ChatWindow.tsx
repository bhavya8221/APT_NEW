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
import { FaWandMagicSparkles as FaWandMagicSparklesRaw } from "react-icons/fa6";

const FaCircleInfo = FaCircleInfoRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsRobot = BsRobotRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaRegCopy = FaRegCopyRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaFileSignature = FaFileSignatureRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const AiExpand = AiExpandRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const AiShrink = AiShrinkRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsX = BsXRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const FaWandMagicSparkles = FaWandMagicSparklesRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

/* TYPES */
export interface ChatMessage {
  id: string | number;
  query?: string | null;
  message?: string | null;
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

interface MessageData {
  text: string;
  template_id?: string;
  business_id?: string;
  auto_price?: boolean;
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
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<Conversation | null>
  >,
  dispatch: any
) => {
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const typingBuffer = useRef("");
  const typingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamedReplyRef = useRef("");

  const streamMessage = async (messageData: MessageData) => {
    const token = localStorage.getItem("UserLoginTokenApt");
    const text = messageData.text;

    if (!token || !text.trim()) return;

    const isNew = currentConversation?.id ? 0 : 1;
    const titleToUse = conversationTitle || text;
    if (!conversationTitle) setConversationTitle(text);

    // Add user message and empty bot message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), query: text, message: null },
      { id: Date.now() + 1, query: null, message: "" },
    ]);

    setLoading(true);
    setIsStreaming(false);

    try {
      const response = await fetch(
        "https://node.automatedpricingtool.io:5000/api/v1/aichat/stream1",
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
            template_id: messageData?.template_id,
            business_id: messageData?.business_id,
            auto_price: messageData?.auto_price,
          }),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      streamedReplyRef.current = "";
      typingBuffer.current = "";

      if (typingInterval.current) {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }

      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          setLoading(false);
          setIsStreaming(false);
          if (typingInterval.current) {
            clearInterval(typingInterval.current);
            typingInterval.current = null;
          }
          break;
        }

        const decoded = decoder.decode(value, { stream: true });
        buffer += decoded;

        let boundary = buffer.indexOf("\n\n");
        while (boundary !== -1) {
          const fullChunk = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          if (fullChunk.startsWith("data:")) {
            const chunk = fullChunk.replace(/^data:\s*/, "");

            if (chunk === "[DONE]") {
              setLoading(false);
              setIsStreaming(false);
              if (typingInterval.current) {
                clearInterval(typingInterval.current);
                typingInterval.current = null;
              }
              if (isNew === 1) {
                dispatch(fetchAllConversations());
              }
              return;
            }

            try {
              const json = JSON.parse(chunk);

              if (json.type === "final") {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    message: json?.token?.chats?.[0]?.message || "",
                  };
                  return updated;
                });
                setCurrentConversation(json?.token);
                if (typingInterval.current) {
                  clearInterval(typingInterval.current);
                  typingInterval.current = null;
                }
                setIsStreaming(false);
              } else if (json.token) {
                setIsStreaming(true);
                const safeToken = json.token.replace(/\n/g, "<br/>");
                streamedReplyRef.current += safeToken;
                typingBuffer.current += safeToken;

                if (!typingInterval.current) {
                  typingInterval.current = setInterval(() => {
                    if (typingBuffer.current.length > 0) {
                      setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                          ...updated[updated.length - 1],
                          message:
                            (updated[updated.length - 1].message || "") +
                            typingBuffer.current,
                        };
                        return updated;
                      });
                      typingBuffer.current = "";
                    }
                  }, 50);
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
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
        typingInterval.current = null;
      }
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { streamMessage, loading, isStreaming } = useChatStream(
    currentConversation,
    conversationTitle,
    setConversationTitle,
    setMessages,
    setCurrentConversation,
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
  const handleGenerateProposal = () => {
    setProposalModalOpen(true);
  };

  const submitProposal = (proposalData: any) => {
    setProposalModalOpen(false);
    navigate("/proposal-editor", { state: proposalData });
  };

  /* Copy Message */
  const handleCopy = (htmlString: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(plainText).then(() => {
      showToast("Copied to clipboard!", "success");
    });
  };

  /* Expand / Shorten */
  const expandOrShorten = async (
    idx: number,
    content: string,
    type: "expand" | "shorten"
  ) => {
    const chat_id = currentConversation?.chats?.[0]?.id;
    // const payload = { previousProposal: content, chat_id };

    setExpandLoading((prev) => ({ ...prev, [idx]: true }));

    try {
      // let updated = "";
      // if (type === "expand") {
      //   const res = await ChatExpend(payload);
      //   updated = res?.data?.data;
      // } else {
      //   const res = await ChatShorte(payload);
      //   updated = res?.data?.data;
      // }
      // if (updated) {
      //   setMessages((prev) =>
      //     prev.map((msg, i) => (i === idx ? { ...msg, message: updated } : msg))
      //   );
      //   setExpandState((prev) => ({
      //     ...prev,
      //     [idx]: type,
      //   }));
      //   showToast(
      //     `${type === "expand" ? "Expanded" : "Shortened"} successfully`,
      //     "success"
      //   );
      // }
    } catch (err) {
      showToast(`Failed to ${type} text`, "error");
      console.error(err);
    } finally {
      setExpandLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <div className="chat-window">
      {/* HEADER */}
      <div className="chat-header">
        <div className="header-content">
          <div
            className="info-icon"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <FaCircleInfo />
          </div>
          <h2 className="conversation-title">
            {conversationTitle || "New Chat"}
          </h2>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="header-tooltip">
            <div className="tooltip-title">Welcome to Ask Ceddie</div>
            <div className="tooltip-text">
              Your AI-powered proposal generation assistant. Simply type in your
              requirements such as the event topic, audience size, and location
              and Ceddie will create a customized proposal tailored to your
              needs.
            </div>
            <div className="tooltip-example">
              <strong>Example:</strong>
              <p>
                "Create a proposal for a Financial Literacy workshop for 100
                participants in Mumbai."
              </p>
            </div>
            <div className="tooltip-tag">
              Accurate • Efficient • Professional
            </div>
          </div>
        )}
      </div>

      {/* MESSAGES */}
      <div className="chat-messages" ref={chatContainerRef}>
        {/* Empty State */}
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">
              <BsRobot />
            </div>
            <h3>Start a conversation with Ceddie</h3>
            <p>
              Ask me anything about creating proposals, pricing, or project
              details
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={msg.id} className="message-group">
            {/* User Message */}
            {msg.query && (
              <div className="chat-bubble user">
                <div className="message-content">{msg.query}</div>
              </div>
            )}

            {/* Bot Message */}
            {msg.message !== null && (
              <div className="chat-bubble bot">
                <div className="bot-avatar">
                  <FaWandMagicSparkles />
                </div>
                <div className="bot-message-wrapper">
                  <div className="message-content">
                    <span
                      dangerouslySetInnerHTML={{ __html: msg.message || "" }}
                    />
                    {i === messages.length - 1 && isStreaming && (
                      <span className="typing-cursor">▌</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {msg.message && (
                    <div className="message-actions">
                      <button
                        className="action-button"
                        onClick={() => handleCopy(msg.message!)}
                        title="Copy to Clipboard"
                      >
                        <FaRegCopy />
                        <span>Copy</span>
                      </button>

                      <button
                        className="action-button"
                        onClick={handleGenerateProposal}
                        title="Generate Proposal"
                      >
                        <FaFileSignature />
                        <span>Proposal</span>
                      </button>

                      <button
                        className="action-button"
                        disabled={expandLoading[i]}
                        onClick={() =>
                          expandOrShorten(
                            i,
                            msg.message!,
                            expandState[i] === "expand" ? "shorten" : "expand"
                          )
                        }
                        title={
                          expandState[i] === "expand"
                            ? "Shorten text"
                            : "Expand text"
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
              </div>
            )}
          </div>
        ))}

        {/* Loading State */}
        {loading && !isStreaming && (
          <div className="chat-bubble bot">
            <div className="bot-avatar">
              <FaWandMagicSparkles className="pulse-icon" />
            </div>
            <div className="bot-message-wrapper">
              <div className="message-content loading">
                <span className="loading-text">Ceddie is thinking</span>
                <span className="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* INPUT */}
      <ChatInput
        onSendMessage={streamMessage}
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
                <p>Configure your proposal details</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setProposalModalOpen(false)}
              >
                <BsX />
              </button>
            </div>
            <div className="modal-body">
              {/* <ProposalForm
                selectedProposal={currentConversation}
                onSubmit={submitProposal}
              /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
