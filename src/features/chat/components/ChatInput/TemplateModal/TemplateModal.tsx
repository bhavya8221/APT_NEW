import React, { useState } from "react";
import { Modal } from "antd";
import "./TemplateModal.scss";

/* ICON CASTS */
import { BsX as BsXRaw } from "react-icons/bs";
import { BsEye as BsEyeRaw } from "react-icons/bs";
import { BsCheckCircleFill as BsCheckCircleFillRaw } from "react-icons/bs";

const BsX = BsXRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsEye = BsEyeRaw as React.FC<React.SVGProps<SVGSVGElement>>;
const BsCheckCircleFill = BsCheckCircleFillRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

/* UNIFIED TEMPLATE TYPE */
export interface APTTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  preview: string;
  features: string[];
  icon: string;
  content: string; // REQUIRED FOR ChatInput
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (t: APTTemplate) => void;
  selectedTemplate?: APTTemplate | null;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedTemplate,
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<APTTemplate | null>(
    null
  );

  /* TEMPLATE LIST — Now with content */
  const templates: APTTemplate[] = [
    {
      id: 1,
      name: "Standard Proposal",
      category: "Business",
      description:
        "A comprehensive proposal template for standard business engagements",
      preview:
        "Includes: Executive Summary, Project Overview, Deliverables, Timeline, Pricing.",
      features: [
        "Executive Summary",
        "Project Scope",
        "Deliverables",
        "Timeline",
        "Budget",
      ],
      icon: "📄",
      content:
        "Executive Summary\nProject Overview\nDeliverables\nTimeline\nPricing",
    },
    {
      id: 2,
      name: "Executive Summary",
      category: "Business",
      description: "High-level overview for key decision makers",
      preview:
        "Strategic overview, ROI insights, and executive recommendations.",
      features: [
        "Strategic Overview",
        "ROI Analysis",
        "Key Metrics",
        "Recommendations",
      ],
      icon: "📊",
      content: "Strategic Overview\nROI Analysis\nKey Metrics\nRecommendations",
    },
    {
      id: 3,
      name: "Detailed Analysis",
      category: "Technical",
      description:
        "In-depth technical proposal with comprehensive specifications",
      preview:
        "Contains methodology, technical specs, risk assessment, and implementation plans.",
      features: [
        "Technical Specs",
        "Methodology",
        "Risk Assessment",
        "Implementation Plan",
      ],
      icon: "🔍",
      content:
        "Technical Specs\nMethodology\nRisk Assessment\nImplementation Plan",
    },
    {
      id: 4,
      name: "Quick Quote",
      category: "Sales",
      description: "Fast pricing proposal template",
      preview: "Simple pricing format with deliverables and timelines.",
      features: [
        "Pricing Breakdown",
        "Service Description",
        "Timeline",
        "Terms",
      ],
      icon: "⚡",
      content:
        "Pricing Breakdown\nService Description\nTimeline\nTerms & Conditions",
    },
  ];

  const handleSelect = (t: APTTemplate) => {
    onSelect(t);
    setPreviewTemplate(null);
  };

  const openPreview = (t: APTTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewTemplate(t);
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      closeIcon={<BsX />}
      className="template-modal"
    >
      <div className="modal-header">
        <h2>Select Template</h2>
        <p>Choose a template that best fits your proposal</p>
      </div>

      <div className="modal-body">
        {!previewTemplate ? (
          <div className="template-grid">
            {templates.map((t) => (
              <div
                key={t.id}
                className={`template-card ${
                  selectedTemplate?.id === t.id ? "selected" : ""
                }`}
                onClick={() => handleSelect(t)}
              >
                {selectedTemplate?.id === t.id && (
                  <div className="selected-badge">
                    <BsCheckCircleFill />
                  </div>
                )}

                <div className="template-icon">{t.icon}</div>

                <div className="template-content">
                  <h3>{t.name}</h3>
                  <span className="template-category">{t.category}</span>
                  <p>{t.description}</p>
                </div>

                <button
                  className="preview-button"
                  onClick={(e) => openPreview(t, e)}
                >
                  <BsEye /> Preview
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="template-preview">
            <button
              className="back-button"
              onClick={() => setPreviewTemplate(null)}
            >
              ← Back
            </button>

            <div className="preview-header">
              <div className="preview-icon">{previewTemplate.icon}</div>
              <div>
                <h2>{previewTemplate.name}</h2>
                <span>{previewTemplate.category}</span>
              </div>
            </div>

            <div className="preview-content">
              <h4>Description</h4>
              <p>{previewTemplate.description}</p>

              <h4>Preview</h4>
              <p>{previewTemplate.preview}</p>

              <h4>Features</h4>
              <ul>
                {previewTemplate.features.map((f, i) => (
                  <li key={i}>
                    <BsCheckCircleFill /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="preview-footer">
              <button
                className="btn-cancel"
                onClick={() => setPreviewTemplate(null)}
              >
                Back
              </button>
              <button
                className="btn-select"
                onClick={() => handleSelect(previewTemplate)}
              >
                Select Template
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TemplateModal;
