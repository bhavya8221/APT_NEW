import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { FiSend } from "react-icons/fi";
import {
  BsBuilding,
  BsFileText,
  BsCurrencyDollar,
  BsChevronDown,
} from "react-icons/bs";
import TemplateModal from "./TemplateModal/TemplateModal";
import "./ChatInput.scss";
import { GetBusiness } from "@/utils/api/Api";
// import { GetBusiness } from "../../Constants/Api/Api";

/* ===================== TYPES ===================== */

interface Business {
  id: number;
  name: string;
  location?: string;
}

interface Template {
  id: number;
  name: string;
}

interface MessagePayload {
  text: string;
  business_id?: number;
  template_id?: number;
  auto_price: string | number;
}

interface ChatInputProps {
  onSendMessage: (data: MessagePayload) => void;
  resetTrigger?: any;
  onTemplateSelect?: (template: Template) => void;
}

/* ===================== COMPONENT ===================== */

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  resetTrigger,
  onTemplateSelect,
}) => {
  const [message, setMessage] = useState<string>("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<Template | null>(null);
  const [pricingMode, setPricingMode] = useState<"auto" | "manual">("auto");
  const [manualPricing, setManualPricing] = useState<string>("");

  const [showBusinessDropdown, setShowBusinessDropdown] =
    useState<boolean>(false);
  const [showPricingDropdown, setShowPricingDropdown] =
    useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] =
    useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const businessDropdownRef = useRef<HTMLDivElement | null>(null);
  const pricingDropdownRef = useRef<HTMLDivElement | null>(null);

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    GetBusiness()
      .then((res: any) => {
        const list: Business[] = res?.data?.data || [];
        setBusinesses(list);
      })
      .catch((error: unknown) =>
        console.error("Business API error:", error)
      );
  }, []);

  useEffect(() => {
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [resetTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        businessDropdownRef.current &&
        !businessDropdownRef.current.contains(target)
      ) {
        setShowBusinessDropdown(false);
      }

      if (
        pricingDropdownRef.current &&
        !pricingDropdownRef.current.contains(target)
      ) {
        setShowPricingDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===================== HANDLERS ===================== */

  const handleSend = (): void => {
    if (!message.trim()) return;

    const messageData: MessagePayload = {
      text: message,
      business_id: selectedBusiness?.id,
      template_id: selectedTemplate?.id,
      auto_price: pricingMode === "manual" ? manualPricing : 0,
    };
console.log(messageData,"messageData")
    onSendMessage(messageData);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBusinessSelect = (business: Business): void => {
    setSelectedBusiness(business);
    setShowBusinessDropdown(false);
  };

  const handleTemplateSelect = (template: Template): void => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    onTemplateSelect?.(template);
  };

  const handlePricingModeSelect = (
    mode: "auto" | "manual"
  ): void => {
    setPricingMode(mode);
    setShowPricingDropdown(false);
  };

  /* ===================== JSX ===================== */

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container">
        {/* Input */}
        <div className="chat-input-box">
          <textarea
            ref={textareaRef}
            placeholder="Ask Ceddie..."
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={3000}
          />

          <div className="input-footer">
            <span className="char-count">
              {message.length}/3000
            </span>
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <FiSend />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="options-row">
          {/* Business */}
          <div className="option-item" ref={businessDropdownRef}>
            <button
              className={`option-btn ${
                selectedBusiness ? "active" : ""
              }`}
              onClick={() =>
                setShowBusinessDropdown((p) => !p)
              }
            >
              <BsBuilding />
              <span>
                {selectedBusiness?.name || "Business"}
              </span>
              <BsChevronDown />
            </button>

            {showBusinessDropdown && (
              <div className="compact-dropdown">
                {businesses.length ? (
                  businesses.map((business) => (
                    <div
                      key={business.id}
                      className={`dropdown-option ${
                        selectedBusiness?.id === business.id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleBusinessSelect(business)
                      }
                    >
                      <span className="name">
                        {business.name}
                      </span>
                      <span className="location">
                        {business.location}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-option empty">
                    No Businesses Found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Template */}
          <button
            className={`option-btn ${
              selectedTemplate ? "active" : ""
            }`}
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <BsFileText />
            <span>
              {selectedTemplate?.name || "Template"}
            </span>
          </button>

          {/* Pricing */}
          <div className="option-item" ref={pricingDropdownRef}>
            <button
              className={`option-btn ${
                pricingMode === "manual" ? "active" : ""
              }`}
              onClick={() =>
                setShowPricingDropdown((p) => !p)
              }
            >
              <BsCurrencyDollar />
              <span>
                {pricingMode === "auto"
                  ? "Auto Pricing"
                  : "Manual"}
              </span>
              <BsChevronDown />
            </button>

            {showPricingDropdown && (
              <div className="compact-dropdown">
                <div
                  className={`dropdown-option ${
                    pricingMode === "auto"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handlePricingModeSelect("auto")
                  }
                >
                  Auto Fetch Pricing
                </div>
                <div
                  className={`dropdown-option ${
                    pricingMode === "manual"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handlePricingModeSelect("manual")
                  }
                >
                  Manual Pricing
                </div>
              </div>
            )}
          </div>

          {/* Manual Pricing */}
          {pricingMode === "manual" && (
            <input
              type="text"
              className="manual-pricing-input"
              placeholder="Enter pricing..."
              value={manualPricing}
              onChange={(e) =>
                setManualPricing(e.target.value)
              }
            />
          )}
        </div>
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default ChatInput;
