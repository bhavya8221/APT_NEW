import React from "react";
import { Modal, Input, Select, TimePicker, message } from "antd";
import { Dayjs } from "dayjs";
import "./NewChatModal.scss";

/* ICON CASTING REQUIRED */
import { BsX as BsXRaw } from "react-icons/bs";
const BsX = BsXRaw as React.FC<React.SVGProps<SVGSVGElement>>;

/* TYPES */
export interface Business {
  id: number;
  name: string;
  type: string;
  location: string;
}

export interface SimpleTemplate {
  id: number;
  name: string;
  description: string;
}

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewChatForm) => void;
  businesses: Business[];
  templates: SimpleTemplate[];
}

export interface NewChatForm {
  title: string;
  numberOfDays: string;
  numberOfHours: Dayjs | null;
  business: number | null;
  template: number | null;
  pricingOption: "automatic" | "manual";
  manualPricing: string;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  businesses,
  templates,
}) => {
  const [formData, setFormData] = React.useState<NewChatForm>({
    title: "",
    numberOfDays: "",
    numberOfHours: null,
    business: null,
    template: null,
    pricingOption: "automatic",
    manualPricing: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      numberOfDays: "",
      numberOfHours: null,
      business: null,
      template: null,
      pricingOption: "automatic",
      manualPricing: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.numberOfDays) {
      message.error("Please fill in all required fields");
      return;
    }

    onSubmit(formData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={600}
      className="custom-modal new-chat-modal"
      closeIcon={<BsX className="close-icon" />}
    >
      <div className="modal-header">
        <h2>Start New Chat</h2>
        <p>Configure your chat session parameters</p>
      </div>

      <div className="modal-body">
        {/* Title */}
        <div className="form-group">
          <label>
            Title <span className="required">*</span>
          </label>
          <Input
            placeholder="Enter chat title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="custom-input"
          />
        </div>

        {/* Days + Hours */}
        <div className="form-row">
          <div className="form-group">
            <label>
              Number of Days <span className="required">*</span>
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.numberOfDays}
              onChange={(e) =>
                setFormData({ ...formData, numberOfDays: e.target.value })
              }
              className="custom-input"
            />
          </div>

          <div className="form-group">
            <label>Duration (Hours)</label>
            <TimePicker
              format="HH:mm"
              placeholder="Select time"
              value={formData.numberOfHours}
              onChange={(time) =>
                setFormData({ ...formData, numberOfHours: time })
              }
              className="custom-input"
            />
          </div>
        </div>

        {/* Business */}
        <div className="form-group">
          <label>Select Business</label>
          <Select
            placeholder="Choose a business or add manually"
            value={formData.business}
            onChange={(value) => setFormData({ ...formData, business: value })}
            className="custom-select"
            style={{ width: "100%" }}
          >
            {businesses.map((business) => (
              <Select.Option key={business.id} value={business.id}>
                <div className="business-option">
                  <span className="business-name">{business.name}</span>
                  <span className="business-type">{business.type}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Templates */}
        <div className="form-group">
          <label>Select Template</label>
          <div className="template-cards">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${
                  formData.template === template.id ? "selected" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, template: template.id })
                }
              >
                <h4>{template.name}</h4>
                <p>{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="form-group">
          <label>Pricing Options</label>
          <Select
            value={formData.pricingOption}
            onChange={(value) =>
              setFormData({
                ...formData,
                pricingOption: value as "automatic" | "manual",
              })
            }
            className="custom-select"
            style={{ width: "100%" }}
          >
            <Select.Option value="automatic">Fetch Automatically</Select.Option>
            <Select.Option value="manual">Enter Manually</Select.Option>
          </Select>

          {formData.pricingOption === "manual" && (
            <Input
              placeholder="Enter pricing details"
              value={formData.manualPricing}
              onChange={(e) =>
                setFormData({ ...formData, manualPricing: e.target.value })
              }
              className="custom-input manual-pricing-input"
            />
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn-cancel" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          Start Chat
        </button>
      </div>
    </Modal>
  );
};

export default NewChatModal;
