import React, { useEffect, useState } from "react";
import "../AdvancedPrice.scss";

import { Button, Input, Select, Modal, message, Form } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

import { getAPECalFeedback } from "@/utils/api/Api";
import DescriptionAlerts from "@/utils/constants/alerts";
import BammerVideo from "@/assets/Loading_icon.gif";

// TinyMCE (supported in your package.json)
import { Editor } from "@tinymce/tinymce-react";

// -----------------------------
// TYPES
// -----------------------------

type AssessmentLevel = {
  participants: string;
  aup: string;
};

type AssessmentProgramsType = Record<string, AssessmentLevel>;

type LevelDataRoot = {
  AssessmentPrograms: AssessmentProgramsType;
};

type AssessmentProgramsProps = {
  handleCloseBH?: () => void;
};

// -----------------------------
// COMPONENT
// -----------------------------

const AssessmentPrograms: React.FC<AssessmentProgramsProps> = ({
  handleCloseBH,
}) => {
  // { handleCloseBH}
  const navigate = useNavigate();
  const location = useLocation();
  const slug = new URLSearchParams(location.search).get("s");

  // CONSTANT
  const firstSelectValue = "AssessmentPrograms" as const;

  // -----------------------------
  // LEVEL DATA (TS SAFE)
  // -----------------------------
  const levelsData: LevelDataRoot = {
    AssessmentPrograms: {
      "DISC & Emotional Intelligence Combo Assessment(1-200)": {
        participants: "1-200",
        aup: "$85-$149",
      },
      "DISC & Emotional Intelligence Combo Assessment(201-299)": {
        participants: "201-299",
        aup: "$75-$84.99",
      },
      "DISC & Emotional Intelligence Combo Assessment(300+)": {
        participants: "300+",
        aup: "$65-$74.99",
      },
      "Leadership 360 Assessment": { participants: "1-100", aup: "$200-$500" },
      "Group Executive Report": { participants: "1-100", aup: "$100-$500" },
      "Sales Assessment": { participants: "1-100", aup: "$85-$149" },
      "Sales Leader Assessment": { participants: "1-100", aup: "$200-$500" },
      "Organizational Assessment": {
        participants: "25-1000",
        aup: "$500-$1500",
      },
    },
  };

  // -----------------------------
  // STATE
  // -----------------------------

  const [secondSelectValue, setSecondSelectValue] = useState("");
  const [participantsValue, setParticipantsValue] = useState("");
  const [aupValue, setAupValue] = useState("");

  const [customParticipants, setCustomParticipants] = useState<number>();
  const [customAdu, setCustomAdu] = useState<number>();
  const [assessmentFee, setAssessmentFee] = useState<number>();

  const [grossAmount, setGrossAmount] = useState<number>();
  const [discountValue, setDiscountValue] = useState<number>();
  const [discountAmount, setDiscountAmount] = useState<number>();

  const [showParticipants, setShowParticipants] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [proposalContent, setProposalContent] = useState("");
  const [showTinyEditor, setShowTinyEditor] = useState(false);

  const [showGenerateProposalBtn, setShowGenerateProposalBtn] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [locationModal, setLocationModal] = useState(false);
  const [locationData, setLocationData] = useState("");

  const [alert, setAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    text: string;
    icon: "error" | "success" | "warning" | "info" | "question";
  }>({
    text: "",
    icon: "info",
  });

  // -----------------------------
  // INIT SCROLL
  // -----------------------------

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  // -----------------------------
  // HANDLERS
  // -----------------------------

  const handleSecondSelectChange = (value: string) => {
    setSecondSelectValue(value);

    const selected =
      levelsData[firstSelectValue][value as keyof AssessmentProgramsType];

    if (!selected) {
      setShowParticipants(false);
      setParticipantsValue("");
      setAupValue("");
      return;
    }

    setShowParticipants(true);
    setParticipantsValue(selected.participants);
    setAupValue(selected.aup);
  };

  const updateGrossAmount = (participants?: number, aup?: number) => {
    if (participants && aup) {
      const result = participants * aup;
      setGrossAmount(result);

      // Recalculate discount if any
      if (discountValue) {
        setDiscountAmount(result * discountValue);
      }
    } else {
      setGrossAmount(undefined);
      setDiscountAmount(undefined);
    }
  };

  const handleParticipantsInput = (value: string) => {
    const num = Number(value);
    setCustomParticipants(num);
    updateGrossAmount(num, customAdu);
  };

  const handleAduInput = (value: string) => {
    const num = Number(value);
    setCustomAdu(num);
    updateGrossAmount(customParticipants, num);
  };

  const handleDiscountSelect = (value: number) => {
    setDiscountValue(value);
    if (grossAmount) {
      setDiscountAmount(grossAmount * value);
    }
  };

  // -----------------------------
  // FEEDBACK
  // -----------------------------

  const handleFeedbackClick = async () => {
    if (!locationData.trim()) {
      return message.error("Enter a location");
    }

    setShowFeedback(true);
    setLoadingFeedback(true);

    // const token = localStorage.getItem("UserLoginTokenApt");

    try {
      const payload = {
        type: "assesment_programs",
        data: {
          "Model Type": "Assessment Programs",
          assesmentType: secondSelectValue,
          Participants: Number(customParticipants),
          "Per Assessment Fee": Number(customAdu),
          "Assessment Fee": Number(assessmentFee),
          Discount: Number(discountValue) * 100,
        },
        location: locationData,
      };

      const res = await getAPECalFeedback(payload);
      setFeedback(res?.data?.data);
      setShowGenerateProposalBtn(true);
    } catch (err) {
      setFeedback("<p style='color:red'>Error generating analysis</p>");
      setShowGenerateProposalBtn(false);
    } finally {
      setLoadingFeedback(false);
      setLocationModal(false);
    }
  };

  // -----------------------------
  // AI PROPOSAL GENERATION
  // -----------------------------

  const handleGenerateProposal = async () => {
    if (!feedback) {
      return message.error("Generate analysis first.");
    }

    setLoadingFeedback(true);

    try {
      const token = localStorage.getItem("UserLoginTokenApt");

      const res = await fetch(
        "https://node.automatedpricingtool.io:5000/api/v1/ape/proposal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token!,
          },
          body: JSON.stringify({ content: feedback }),
        }
      );

      const raw = await res.json();

      setProposalContent(raw?.data || "");
      setShowTinyEditor(true);
      setShowFeedback(false);
    } catch {
      message.error("AI Proposal generation failed");
    } finally {
      setLoadingFeedback(false);
    }
  };

  // -----------------------------
  // PROPOSAL DOWNLOAD
  // -----------------------------

  const handleDownloadProposal = async () => {
    if (!proposalContent) return message.error("No proposal content found.");

    try {
      const token = localStorage.getItem("UserLoginTokenApt");

      const res = await fetch(
        "https://node.automatedpricingtool.io:5000/api/v1/ape/proposal/doc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token!,
          },
          body: JSON.stringify({ content: proposalContent }),
        }
      );

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "advanced_price_exhibit_proposal.pdf";
      link.click();
      link.remove();
    } catch {
      message.error("Proposal download failed.");
    }
  };

  // -----------------------------
  // STORE DATA FOR PROPOSAL PAGE
  // -----------------------------

  const handleStoreData = () => {
    if (!customParticipants || !assessmentFee || !customAdu)
      return message.error("Fill all required fields");

    const netAmount = Number(
      (grossAmount! - customParticipants * assessmentFee).toFixed(2)
    );

    const data: any = {
      heading: "Assessment Programs",
      Custom_Participants: customParticipants,
      Custom_Adu: customAdu,
      Gross_Amount: grossAmount,
      Assessment_fee: assessmentFee,
      Net_Amount: netAmount,
    };

    if (discountValue && discountValue > 0 && discountAmount) {
      data.Discount_Amount = discountAmount;
      data.After_Discount = Number(
        (
          grossAmount! -
          customParticipants * assessmentFee -
          discountAmount
        ).toFixed(2)
      );
    }

    localStorage.setItem("Calculation", JSON.stringify(data));

    setAlertConfig({
      text: "Data Stored For Proposal.",
      icon: "success",
    });
    setAlert(true);

    setTimeout(() => {
      if (!slug) navigate("/create/leadership-workshop-proposal");
    }, 1500);
  };

  // -----------------------------
  // JSX
  // -----------------------------

  return (
    <div className="AdvancedPrice">
      {alert && (
        <DescriptionAlerts text={alertConfig.text} icon={alertConfig.icon} />
      )}

      {/* MAIN CONTAINER */}
      <div className="Calculator_container">
        {/* Program Select */}
        <div className="Row_1">
          <div className="Col_1 blank_input">Assessment Program:</div>
          <div className="Col_1">
            <Select
              style={{ width: "100%" }}
              value={secondSelectValue}
              onChange={handleSecondSelectChange}
              options={[
                { label: "Select --", value: "" },
                ...Object.keys(levelsData.AssessmentPrograms).map((level) => ({
                  label: level,
                  value: level,
                })),
              ]}
            />
          </div>
        </div>

        {/* Participants */}
        {showParticipants && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Participants Range:
                <div className="blank_input">{participantsValue}</div>
              </div>
            </div>

            <Form layout="vertical">
              <Form.Item label="Custom Participants">
                <Input
                  type="number"
                  value={customParticipants}
                  onChange={(e) => handleParticipantsInput(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Per Assessment Fee (AUP)">
                <Input
                  type="number"
                  value={customAdu}
                  onChange={(e) => handleAduInput(e.target.value)}
                />
              </Form.Item>
            </Form>
          </>
        )}

        {/* Gross Amount */}
        {grossAmount !== undefined && (
          <div className="Row_1">
            <div className="Col_1 blank_input">
              Gross Amount:
              <div className="blank_input">${grossAmount}</div>
            </div>
          </div>
        )}

        {/* Assessment Fee */}
        {customParticipants && (
          <Form layout="vertical">
            <Form.Item label="Assessment Fee">
              <Input
                type="number"
                value={assessmentFee}
                onChange={(e) => setAssessmentFee(Number(e.target.value))}
              />
            </Form.Item>
          </Form>
        )}

        {/* Net Amount */}
        {assessmentFee && grossAmount !== undefined && (
          <div className="Row_1">
            <div className="Col_1 blank_input">
              Net Amount:
              <div className="blank_input">
                $
                {(grossAmount - customParticipants! * assessmentFee).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Discount */}
        {showParticipants && (
          <Select
            style={{ width: "100%", marginTop: 12 }}
            placeholder="Select Discount"
            value={discountValue}
            onChange={handleDiscountSelect}
            options={[
              { label: "No Discount", value: 0 },
              { label: "2%", value: 0.02 },
              { label: "5%", value: 0.05 },
              { label: "10%", value: 0.1 },
              { label: "12%", value: 0.12 },
              { label: "15%", value: 0.15 },
              { label: "20%", value: 0.2 },
              { label: "25%", value: 0.25 },
              { label: "30%", value: 0.3 },
            ]}
          />
        )}

        {/* Discount Result */}
        {discountAmount !== undefined && discountValue !== 0 && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Discount Amount:
                <div className="blank_input">${discountAmount}</div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                After Discount:
                <div className="blank_input">
                  $
                  {(
                    grossAmount! -
                    customParticipants! * assessmentFee! -
                    discountAmount
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <Button className="button_theme" onClick={handleStoreData}>
        Add to Proposal
      </Button>

      {discountValue !== undefined && (
        <Button className="button_theme" onClick={() => setLocationModal(true)}>
          Show Analysis
        </Button>
      )}

      {/* Location Modal */}
      <Modal
        centered
        open={locationModal}
        title="Enter Location"
        onCancel={() => setLocationModal(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handleFeedbackClick}>
            Submit
          </Button>,
        ]}
      >
        <Input
          value={locationData}
          onChange={(e) => setLocationData(e.target.value)}
          placeholder="Enter location"
        />
      </Modal>

      {/* FEEDBACK */}
      {showFeedback && (
        <div className="feedback-container">
          {loadingFeedback ? (
            <div className="loading-text">
              <img src={BammerVideo} />
            </div>
          ) : (
            feedback && (
              <div
                className="feedback"
                dangerouslySetInnerHTML={{ __html: feedback }}
              />
            )
          )}
        </div>
      )}

      {/* GENERATE PROPOSAL BUTTON */}
      {showGenerateProposalBtn && (
        <Button className="button_theme" onClick={handleGenerateProposal}>
          Generate AI Proposal
        </Button>
      )}

      {/* TINYMCE EDITOR */}
      {showTinyEditor && proposalContent && (
        <div className="feedback" style={{ background: "#fff" }}>
          <Editor
            apiKey="no-api-key-needed"
            value={proposalContent}
            init={{
              height: 300,
              menubar: false,
              plugins: "lists link table",
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist",
            }}
            onEditorChange={(content) => setProposalContent(content)}
          />

          <Button
            className="button_theme"
            style={{ marginTop: 10 }}
            onClick={handleDownloadProposal}
          >
            Download Proposal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssessmentPrograms;
