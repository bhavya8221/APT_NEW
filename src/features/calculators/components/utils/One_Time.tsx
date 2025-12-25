import React, { useEffect, useState } from "react";
import "../AdvancedPrice.scss";

import { Button, Input, Select, Modal, Form, message } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import { getAPECalFeedback } from "@/utils/api/Api";
import DescriptionAlerts from "@/utils/constants/alerts";
import BammerVideo from "@/assets/Loading_icon.gif";

import { Editor } from "@tinymce/tinymce-react";

// -----------------------------
// Types
// -----------------------------
type LevelInfo = {
  participants: string;
  PerHourRate: string;
};

type WorkshopLevels = Record<string, LevelInfo>;

type OneTimeProps = {
  handleCloseBH?: () => void;
};

// -----------------------------
// Component
// -----------------------------
const OneTimeWorkshopComponent: React.FC<OneTimeProps> = ({
  handleCloseBH,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = new URLSearchParams(location.search).get("s");

  const firstSelectValue = "One Time All Day Workshop" as const;

  // -----------------------------
  // Level Data (TS Safe)
  // -----------------------------
  const levelsData: Record<string, WorkshopLevels> = {
    "One Time All Day Workshop": {
      "Up to 30 people": {
        participants: "Up to 30 people",
        PerHourRate: "166",
      },
      "Up to 50 people": {
        participants: "Up to 50 people",
        PerHourRate: "120",
      },
    },
  };

  // -----------------------------
  // State / UI control
  // -----------------------------
  const [selectedLevel, setSelectedLevel] = useState("");
  const [participantRange, setParticipantRange] = useState("");
  const [hourRateRange, setHourRateRange] = useState("");

  const [customParticipants, setCustomParticipants] = useState<number>();
  const [customRate, setCustomRate] = useState<number>();
  const [travelCost, setTravelCost] = useState<number>();

  const [totalFee, setTotalFee] = useState<number>();
  const [discountValue, setDiscountValue] = useState<number>();
  const [discountAmount, setDiscountAmount] = useState<number>();

  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [showGenerateProposalBtn, setShowGenerateProposalBtn] = useState(false);
  const [proposalContent, setProposalContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const [locationModal, setLocationModal] = useState(false);
  const [locationData, setLocationData] = useState("");

  const [alert, setAlert] = useState(false);
  const [alertCfg, setAlertCfg] = useState<{
    text: string;
    icon: "error" | "success" | "warning" | "info" | "question";
  }>({
    text: "",
    icon: "info",
  });

  // -----------------------------
  // Initialization
  // -----------------------------
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // -----------------------------
  // LEVEL SELECTION
  // -----------------------------
  const handleSelectChange = (value: string) => {
    setSelectedLevel(value);

    const info = levelsData[firstSelectValue][value];
    if (!info) {
      setParticipantRange("");
      setHourRateRange("");
      return;
    }

    setParticipantRange(info.participants);
    setHourRateRange(info.PerHourRate);
  };

  // -----------------------------
  // CALCULATIONS
  // -----------------------------
  const recalc = () => {
    if (!customParticipants || !customRate || travelCost === undefined) {
      setTotalFee(undefined);
      setDiscountAmount(undefined);
      return;
    }

    const base = customParticipants * customRate + travelCost;
    setTotalFee(base);

    if (discountValue) {
      setDiscountAmount(base * discountValue);
    }
  };

  const handleParticipantsInput = (v: string) => {
    setCustomParticipants(Number(v));
    setShowFeedback(false);
    recalc();
  };

  const handleRateInput = (v: string) => {
    setCustomRate(Number(v));
    setShowFeedback(false);
    recalc();
  };

  const handleTravelInput = (v: string) => {
    setTravelCost(Number(v));
    setShowFeedback(false);
    recalc();
  };

  const handleDiscountSelect = (value: number) => {
    setDiscountValue(value);
    if (totalFee) {
      setDiscountAmount(totalFee * value);
    }
  };

  // -----------------------------
  // FEEDBACK API
  // -----------------------------
  const handleFeedbackClick = async () => {
    if (!locationData.trim()) return message.error("Enter location.");

    setShowFeedback(true);
    setLoadingFeedback(true);

    try {
      // const token = localStorage.getItem("UserLoginTokenApt");

      const payload = {
        type: "one_time_all_day_workshop",
        data: {
          "Model Type": "One Time All Day Workshop",
          "Per Hour Rate": customRate,
          travelCost: travelCost,
          Discount: (discountValue || 0) * 100,
        },
        location: locationData,
      };

      const res = await getAPECalFeedback(payload);
      setFeedback(res?.data?.data);
      setShowGenerateProposalBtn(true);
    } catch (err) {
      setFeedback("<p style='color:red'>Error generating analysis.</p>");
      setShowGenerateProposalBtn(false);
    } finally {
      setLoadingFeedback(false);
      setLocationModal(false);
    }
  };

  // -----------------------------
  // AI PROPOSAL GENERATION
  // -----------------------------
  const generateProposal = async () => {
    if (!feedback) return message.error("Generate analysis first.");

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
      setShowEditor(true);
      setShowFeedback(false);
    } catch {
      message.error("Failed to generate AI proposal.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  // -----------------------------
  // DOWNLOAD PROPOSAL
  // -----------------------------
  const downloadProposal = async () => {
    if (!proposalContent) return message.error("No proposal to download.");

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
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "one_time_workshop_proposal.pdf";
      a.click();
    } catch {
      message.error("Failed to download proposal.");
    }
  };

  // -----------------------------
  // STORE DATA FOR PROPOSAL PAGE
  // -----------------------------
  const handleStoreData = () => {
    if (!customParticipants || !customRate || travelCost === undefined)
      return message.error("Please fill all fields");

    const base = totalFee || 0;
    const annual = base * 12;

    const data: any = {
      heading: "OneTime",
      Custom_Participants: customParticipants,
      CustomPerHour: customRate,
      Travel_Cost: travelCost,
      Per_No_Discount: base,
      Annual_No_Discount: annual.toFixed(2),
      Workbook_Print_Cost: (customParticipants * 19).toFixed(2),
      One_Time_Cost: (((customParticipants * 19) / base) * 100).toFixed(2),
      Annual_CPI_3: (annual * 0.03).toFixed(2),
      Annual_CPI_5: (annual * 0.05).toFixed(2),
    };

    if (discountValue && discountAmount) {
      data.Discount_Value = (discountValue * 100).toFixed(2);
      data.Discount_Amount = discountAmount.toFixed(2);
      data.After_Discount = (base - discountAmount).toFixed(2);
      data.Annual_After_Discount = ((base - discountAmount) * 12).toFixed(2);
    }

    localStorage.setItem("Calculation", JSON.stringify(data));

    setAlertCfg({
      text: "Data Stored For Proposal.",
      icon: "success",
    });
    setAlert(true);

    setTimeout(() => {
      if (!slug) navigate("/create/leadership-workshop-proposal");
      handleCloseBH?.();
    }, 1300);
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="AdvancedPrice">
      {alert && <DescriptionAlerts text={alertCfg.text} icon={alertCfg.icon} />}

      <div className="Calculator_container">
        {/* Title + Level Select */}
        <div className="Row_1">
          <div className="Col_1 blank_input">One-Time All Day Workshop</div>

          <div className="Col_1">
            <Select
              style={{ width: "100%" }}
              value={selectedLevel}
              onChange={handleSelectChange}
              options={[
                { label: "Select --", value: "" },
                ...Object.keys(levelsData[firstSelectValue]).map((level) => ({
                  label: level,
                  value: level,
                })),
              ]}
            />
          </div>
        </div>

        {/* Participant ranges */}
        {selectedLevel && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Participants:
                <div className="blank_input">{participantRange}</div>
              </div>
            </div>

            <Form layout="vertical">
              <Form.Item label="Participants">
                <Input
                  type="number"
                  value={customParticipants}
                  onChange={(e) => handleParticipantsInput(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Per Hour Rate">
                <Input
                  type="number"
                  value={customRate}
                  onChange={(e) => handleRateInput(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Travel Cost">
                <Input
                  type="number"
                  value={travelCost}
                  onChange={(e) => handleTravelInput(e.target.value)}
                />
              </Form.Item>
            </Form>
          </>
        )}

        {/* Results */}
        {totalFee !== undefined && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Fee (Month/Session):
                <div className="blank_input">${totalFee.toFixed(2)}</div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual Fee:
                <div className="blank_input">${(totalFee * 12).toFixed(2)}</div>
              </div>
            </div>
          </>
        )}

        {/* Discount */}
        {selectedLevel && (
          <Select
            value={discountValue}
            style={{ width: "100%", marginTop: 10 }}
            placeholder="Select discount"
            onChange={handleDiscountSelect}
            options={[
              { label: "No discount", value: 0 },
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

        {discountAmount !== undefined && discountValue !== 0 && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Discount Amount:
                <div className="blank_input">${discountAmount.toFixed(2)}</div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Fee After Discount:
                <div className="blank_input">
                  ${(totalFee! - discountAmount).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual After Discount:
                <div className="blank_input">
                  ${((totalFee! - discountAmount) * 12).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Workbook & CPI */}
        {totalFee !== undefined && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Workbook Print Cost ($19):
                <div className="blank_input">
                  ${(customParticipants! * 19).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Print Cost % of One-Time:
                <div className="blank_input">
                  {(((customParticipants! * 19) / totalFee) * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual CPI 3%:
                <div className="blank_input">
                  ${(totalFee * 12 * 0.03).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual CPI 5%:
                <div className="blank_input">
                  ${(totalFee * 12 * 0.05).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <Button className="button_theme" onClick={handleStoreData}>
        Add to proposal
      </Button>

      {discountValue !== undefined && (
        <Button className="button_theme" onClick={() => setLocationModal(true)}>
          Show Analysis
        </Button>
      )}

      {/* LOCATION MODAL */}
      <Modal
        open={locationModal}
        centered
        title="Enter Location"
        onCancel={() => setLocationModal(false)}
        footer={[
          <Button type="primary" onClick={handleFeedbackClick}>
            Submit
          </Button>,
        ]}
      >
        <Input
          value={locationData}
          onChange={(e) => setLocationData(e.target.value)}
          placeholder="Enter your location"
        />
      </Modal>

      {/* FEEDBACK */}
      {showFeedback && (
        <div className="feedback-container">
          {loadingFeedback ? (
            <img src={BammerVideo} />
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

      {/* AI PROPOSAL BUTTON */}
      {showGenerateProposalBtn && (
        <Button className="button_theme" onClick={generateProposal}>
          Generate AI Proposal
        </Button>
      )}

      {/* TINY MCE EDITOR */}
      {showEditor && proposalContent && (
        <div className="feedback" style={{ background: "white" }}>
          <Editor
            apiKey="no-key-needed"
            value={proposalContent}
            init={{
              height: 280,
              menubar: false,
              plugins: "lists link table",
              toolbar:
                "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist",
            }}
            onEditorChange={(content) => setProposalContent(content)}
          />

          <Button
            className="button_theme"
            style={{ marginTop: 10 }}
            onClick={downloadProposal}
          >
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default OneTimeWorkshopComponent;
