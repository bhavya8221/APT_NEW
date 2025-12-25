import React from "react";
import { FaWandMagicSparkles as FaWandMagicSparklesRaw } from "react-icons/fa6";
import "./ChatMessage.scss";

// Cast icon for TypeScript compatibility
const FaWandMagicSparkles = FaWandMagicSparklesRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface ChatMessageProps {
  sender: "user" | "bot";
  text: string;
  isStreaming?: boolean;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  text,
  isStreaming = false,
  timestamp,
}) => {
  if (sender === "user") {
    return (
      <div className="message-group user-message">
        <div className="message-bubble user">
          <div className="message-text">{text}</div>
          {timestamp && <div className="message-time">{timestamp}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="message-group bot-message">
      <div className="bot-avatar">
        <FaWandMagicSparkles className="avatar-icon" />
        {isStreaming && <div className="pulse-ring" />}
      </div>

      <div className="message-content-wrapper">
        <div className="message-bubble bot">
          <div
            className="message-text"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          {isStreaming && <span className="typing-cursor">▌</span>}
        </div>
        {timestamp && <div className="message-time">{timestamp}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;
