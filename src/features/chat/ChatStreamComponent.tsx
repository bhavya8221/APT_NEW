import React, { useState } from "react";
import { Input, Button, Spin } from "antd";
import "./ChatStreamComponent.scss";

interface StreamMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatStreamProps {
  onStreamMessage?: (msg: StreamMessage) => void;
  conversationId?: string;
}

const ChatStreamComponent: React.FC<ChatStreamProps> = ({
  onStreamMessage,
  conversationId = "",
}) => {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("UserLoginTokenApt");

  const pushMessage = (msg: StreamMessage) => {
    setMessages((prev) => [...prev, msg]);
    onStreamMessage?.(msg);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    pushMessage({ role: "user", text: input });

    const userQuery = input;
    setInput("");

    setLoading(true);

    try {
      const response = await fetch(
        "https://node.automatedpricingtool.io:5000/api/v1/aichat/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
          body: JSON.stringify({
            is_new: conversationId ? 0 : 1,
            conversation_id: conversationId ?? "",
            query: userQuery,
            conversation_title: "New Conversation",
          }),
        }
      );

      if (!response.body) throw new Error("No response body from server.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let aiMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk
          .split("\n")
          .filter((line) => line.trim().startsWith("data:"));

        for (const line of lines) {
          const text = line.replace("data:", "").trim();

          try {
            const data = JSON.parse(text);

            if (data.token !== undefined) {
              aiMessage += data.token;

              setMessages((prev) => {
                const updated = [...prev];

                if (
                  updated.length === 0 ||
                  updated[updated.length - 1].role !== "assistant"
                ) {
                  updated.push({ role: "assistant", text: "" });
                }

                updated[updated.length - 1].text = aiMessage;

                return updated;
              });
            }
          } catch {
            console.warn("Non-JSON chunk:", text);
          }
        }
      }
    } catch (err) {
      console.error("Chat stream error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stream-wrapper">
      <div className="messages-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`bubble ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <b>{msg.role}:</b> {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Spin />
          </div>
        )}
      </div>

      <div className="stream-input">
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Type your message..."
        />

        <Button
          type="primary"
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          style={{ marginTop: 8 }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatStreamComponent;
