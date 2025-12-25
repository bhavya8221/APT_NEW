import React, { useEffect, useState } from "react";
import ChatLayout from "@/features/chat/ChatLayout";

const AIProposal: React.FC = () => {
  const [loading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginTokenApt")
      : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!token) {
    return (
      <div className="unauthenticated-container">
        <div className="unauthenticated-content">
          <div className="icon-wrapper">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h1>Authentication Required</h1>
          <p>Please sign in to access the AI Proposal Generator.</p>
          <button
            className="signin-button"
            onClick={() => (window.location.href = "/signin")}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-proposal-page">
      <ChatLayout />

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Generating proposal...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProposal;
