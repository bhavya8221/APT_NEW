import React, { useRef, useState, useEffect } from "react";
import "./ChatInput.scss";
import TemplateModal, { APTTemplate } from "./TemplateModal/TemplateModal";

/* ICON CASTING */
import { FiSend as FiSendRaw } from "react-icons/fi";
import {
  BsBuilding as BsBuildingRaw,
  BsFileText as BsFileTextRaw,
  BsCurrencyDollar as BsCurrencyDollarRaw,
  BsChevronDown as BsChevronDownRaw,
} from "react-icons/bs";

const FiSend = FiSendRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsBuilding = BsBuildingRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsFileText = BsFileTextRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsCurrencyDollar = BsCurrencyDollarRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const BsChevronDown = BsChevronDownRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

/* TYPES */
export interface Business {
  id: number;
  name: string;
  location?: string;
}

interface ChatInputProps {
  onSendMessage: (data: { text: string }) => void;
  resetTrigger: any;
  businesses?: Business[];
  onTemplateSelect?: (template: APTTemplate) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  resetTrigger,
  businesses = [],
  onTemplateSelect,
}) => {
  const [message, setMessage] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<APTTemplate | null>(
    null
  );
  const [pricingMode, setPricingMode] = useState<"auto" | "manual">("auto");
  const [manualPricing, setManualPricing] = useState("");
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);
  const [showPricingDropdown, setShowPricingDropdown] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const businessDropdownRef = useRef<HTMLDivElement | null>(null);
  const pricingDropdownRef = useRef<HTMLDivElement | null>(null);

  const dummyBusinesses: Business[] = [
    { id: 1, name: "Tech Solutions Inc", location: "New York" },
    { id: 2, name: "Marketing Pro", location: "Los Angeles" },
    { id: 3, name: "Design Studio", location: "Chicago" },
  ];

  const availableBusinesses = businesses.length ? businesses : dummyBusinesses;

  useEffect(() => {
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [resetTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        businessDropdownRef.current &&
        !businessDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBusinessDropdown(false);
      }
      if (
        pricingDropdownRef.current &&
        !pricingDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPricingDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage({ text: message });
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplatePick = (template: APTTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    if (onTemplateSelect) onTemplateSelect(template);
  };

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        {/* OPTIONS ROW (Top) */}
        <div className="options-row">
          {/* Business Dropdown */}
          <div className="option-item" ref={businessDropdownRef}>
            <button
              className={`option-btn ${selectedBusiness ? "active" : ""}`}
              onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
            >
              <BsBuilding />
              <span>
                {selectedBusiness ? selectedBusiness.name : "Business"}
              </span>
              <BsChevronDown className="chevron" />
            </button>
            {showBusinessDropdown && (
              <div className="compact-dropdown">
                {availableBusinesses.map((b) => (
                  <div
                    key={b.id}
                    className={`dropdown-option ${
                      selectedBusiness?.id === b.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedBusiness(b);
                      setShowBusinessDropdown(false);
                    }}
                  >
                    <span className="name">{b.name}</span>
                    {b.location && (
                      <span className="location">{b.location}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Template Button */}
          <button
            className={`option-btn ${selectedTemplate ? "active" : ""}`}
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <BsFileText />
            <span>{selectedTemplate ? selectedTemplate.name : "Template"}</span>
          </button>

          {/* Pricing Dropdown */}
          <div className="option-item" ref={pricingDropdownRef}>
            <button
              className={`option-btn ${
                pricingMode === "manual" ? "active" : ""
              }`}
              onClick={() => setShowPricingDropdown(!showPricingDropdown)}
            >
              <BsCurrencyDollar />
              <span>{pricingMode === "auto" ? "Auto Pricing" : "Manual"}</span>
              <BsChevronDown className="chevron" />
            </button>
            {showPricingDropdown && (
              <div className="compact-dropdown">
                <div
                  className={`dropdown-option ${
                    pricingMode === "auto" ? "selected" : ""
                  }`}
                  onClick={() => {
                    setPricingMode("auto");
                    setShowPricingDropdown(false);
                  }}
                >
                  <span className="name">Auto Fetch Pricing</span>
                </div>
                <div
                  className={`dropdown-option ${
                    pricingMode === "manual" ? "selected" : ""
                  }`}
                  onClick={() => {
                    setPricingMode("manual");
                    setShowPricingDropdown(false);
                  }}
                >
                  <span className="name">Manual Pricing</span>
                </div>
              </div>
            )}
          </div>

          {/* Manual Pricing Input */}
          {pricingMode === "manual" && (
            <input
              type="text"
              className="manual-pricing-input"
              placeholder="Enter pricing..."
              value={manualPricing}
              onChange={(e) => setManualPricing(e.target.value)}
            />
          )}
        </div>

        {/* INPUT BOX (Bottom) */}
        <div className="chat-input-box">
          <span className="char-count">{message.length}/3000</span>
          <textarea
            ref={textareaRef}
            placeholder="Ask Ceddie..."
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={3000}
          />
          <div className="input-actions">
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!message.trim()}
              title="Send message"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplatePick}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default ChatInput;
