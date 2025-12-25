import React, { useEffect, useState } from "react";
import "../AdvancedPrice.scss";

import { Button, Input, Select, Modal, message, Form } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import DescriptionAlerts from "@/utils/constants/alerts";
import { getAPECalFeedback } from "@/utils/api/Api";
import BammerVideo from "@/assets/Loading_icon.gif";

import { Editor } from "@tinymce/tinymce-react";

// -----------------------------
// TYPES
// -----------------------------
type LmsLevel = {
  Max_Users: string;
  aup: string;
  ctm: string;
};

type LmsLevelsType = Record<string, LmsLevel>;

type LmsRoot = {
  Lms: LmsLevelsType;
};

type LmsProps = {
  handleCloseBH?: () => void;
};

// -----------------------------
// COMPONENT
// -----------------------------
const Lms: React.FC<LmsProps> = (handleCloseBH) => {
  // { handleCloseBH }
  const navigate = useNavigate();
  const location = useLocation();
  const slug = new URLSearchParams(location.search).get("s");

  const firstSelectValue = "Lms" as const;

  // -----------------------------
  // LEVEL DATA (TS-SAFE)
  // -----------------------------
  const levelsData: LmsRoot = {
    Lms: {
      "Level 1": { Max_Users: "1-299", aup: "3.50", ctm: "195.00" },
      "Level 2": { Max_Users: "300-500", aup: "3.48", ctm: "695.00" },
      "Level 3": { Max_Users: "501+", aup: "2.49", ctm: "995.00" },
    },
  };

  // -----------------------------
  // STATE
  // -----------------------------

  const [selectedLevel, setSelectedLevel] = useState("");
  const [participantsRange, setParticipantsRange] = useState("");
  const [baseAup, setBaseAup] = useState("");
  const [monthlyCtm, setMonthlyCtm] = useState<number>(0);

  const [customParticipants, setCustomParticipants] = useState<number>();
  const [customAup, setCustomAup] = useState<number>();

  const [monthlyRevenue, setMonthlyRevenue] = useState<number>();
  const [discountValue, setDiscountValue] = useState<number>();
  const [discountAmount, setDiscountAmount] = useState<number>();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [showParticipants, setShowParticipants] = useState(false);

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
  // HANDLERS
  // -----------------------------

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedLevel(value);

    const selected = levelsData[firstSelectValue][value as keyof LmsLevelsType];

    if (!selected) {
      setShowParticipants(false);
      setParticipantsRange("");
      setBaseAup("");
      return;
    }

    setShowParticipants(true);
    setParticipantsRange(selected.Max_Users);
    setBaseAup(selected.aup);
    setMonthlyCtm(Number(selected.ctm));
  };

  const updateMonthlyRevenue = (participants?: number, aup?: number) => {
    if (participants && aup) {
      const total = participants * aup;
      setMonthlyRevenue(total);

      if (discountValue) {
        setDiscountAmount(total * discountValue);
      }
    } else {
      setMonthlyRevenue(undefined);
      setDiscountAmount(undefined);
    }
  };

  const handleParticipantsInput = (value: string) => {
    const num = Number(value);
    setCustomParticipants(num);
    updateMonthlyRevenue(num, customAup);
  };

  const handleAupInput = (value: string) => {
    const num = Number(value);
    setCustomAup(num);
    updateMonthlyRevenue(customParticipants, num);
  };

  const handleDiscountSelect = (value: number) => {
    setDiscountValue(value);
    if (monthlyRevenue) {
      setDiscountAmount(monthlyRevenue * value);
    }
  };

  // -----------------------------
  // FEEDBACK + ANALYSIS
  // -----------------------------

  const handleFeedbackClick = async () => {
    if (!locationData.trim()) return message.error("Enter location.");

    setShowFeedback(true);
    setLoadingFeedback(true);

    // const token = localStorage.getItem("UserLoginTokenApt");

    try {
      const payload = {
        type: "lms",
        data: {
          Model_Type: "LMS",
          Participants: Number(customParticipants),
          AUP: Number(customAup),
          Discount: Number(discountValue) * 100,
        },
        location: locationData,
      };

      const res = await getAPECalFeedback(payload);
      setFeedback(res?.data?.data);
      setShowGenerateProposalBtn(true);
    } catch {
      setFeedback("<p style='color:red'>Error generating analysis</p>");
      setShowGenerateProposalBtn(false);
    } finally {
      setLocationModal(false);
      setLoadingFeedback(false);
    }
  };

  // -----------------------------
  // AI PROPOSAL
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
      setShowTinyEditor(true);
      setShowFeedback(false);
    } catch {
      message.error("AI Proposal generation failed.");
    } finally {
      setLoadingFeedback(false);
    }
  };

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
      a.download = "lms_proposal.pdf";
      a.click();
    } catch {
      message.error("Failed to download proposal.");
    }
  };

  // -----------------------------
  // STORE DATA FOR PROPOSAL PAGE
  // -----------------------------

  const handleStoreData = () => {
    if (!customParticipants || !customAup)
      return message.error("Fill all required fields.");

    const baseMonthly = monthlyRevenue || 0;
    const annual = baseMonthly * 12;

    const data: any = {
      heading: "LMS",
      Custom_Participants: customParticipants,
      Custom_Aup: customAup,
      Monthly_Revenue: baseMonthly,
      Annual_Revenue: annual.toFixed(2),
      Monthly_CTM: monthlyCtm,
      Annual_CTM: (monthlyCtm * 12).toFixed(2),
      CTM_Cost_Percentage: ((monthlyCtm * 12 * 100) / annual).toFixed(2),
      Annual_CPI_3: (annual * 0.03).toFixed(2),
      Annual_CPI_5: (annual * 0.05).toFixed(2),
    };

    if (discountValue && discountValue > 0 && discountAmount) {
      data.Discount_Amount = discountAmount;
      data.After_Discount = (baseMonthly - discountAmount).toFixed(2);
      data.Annual_After_Discount = (
        (baseMonthly - discountAmount) *
        12
      ).toFixed(2);
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

      <div className="Calculator_container">
        {/* Level selection */}
        <div className="Row_1">
          <div className="Col_1 blank_input">LMS</div>

          <div className="Col_1">
            <Select
              value={selectedLevel}
              style={{ width: "100%" }}
              onChange={handleSelectChange}
              options={[
                { label: "Select --", value: "" },
                ...Object.keys(levelsData.Lms).map((level) => ({
                  label: level,
                  value: level,
                })),
              ]}
            />
          </div>
        </div>

        {/* Participant Range */}
        {showParticipants && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Max Users:
                <div className="blank_input">{participantsRange}</div>
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

              <Form.Item label="AUP (Input)">
                <Input
                  type="number"
                  value={customAup}
                  onChange={(e) => handleAupInput(e.target.value)}
                />
              </Form.Item>
            </Form>
          </>
        )}

        {/* Monthly & Annual Revenue */}
        {monthlyRevenue !== undefined && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Monthly Revenue:
                <div className="blank_input">${monthlyRevenue.toFixed(2)}</div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual Revenue:
                <div className="blank_input">
                  ${(monthlyRevenue * 12).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Discount */}
        {showParticipants && (
          <Select
            style={{ width: "100%", marginTop: 10 }}
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
                <div className="blank_input">${discountAmount.toFixed(2)}</div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                After Discount (Monthly):
                <div className="blank_input">
                  ${(monthlyRevenue! - discountAmount).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                After Discount (Annual):
                <div className="blank_input">
                  ${((monthlyRevenue! - discountAmount) * 12).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Additional CTM Metrics */}
        {discountValue !== undefined && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Monthly CTM Cost:
                <div className="blank_input">${monthlyCtm}</div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual CTM Cost:
                <div className="blank_input">
                  ${(monthlyCtm * 12).toFixed(2)}
                </div>
              </div>
            </div>

            {monthlyRevenue && (
              <div className="Row_1">
                <div className="Col_1 blank_input">
                  CTM Cost Percentage:
                  <div className="blank_input">
                    {(
                      ((monthlyCtm * 12) / (monthlyRevenue * 12)) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              </div>
            )}

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual CPI 3%:
                <div className="blank_input">
                  ${(monthlyRevenue! * 12 * 0.03).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual CPI 5%:
                <div className="blank_input">
                  ${(monthlyRevenue! * 12 * 0.05).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Buttons */}
      <Button className="button_theme" onClick={handleStoreData}>
        Add to Proposal
      </Button>

      {discountValue !== undefined && (
        <Button className="button_theme" onClick={() => setLocationModal(true)}>
          Show Analysis
        </Button>
      )}

      {/* LOCATION MODAL */}
      <Modal
        centered
        open={locationModal}
        onCancel={() => setLocationModal(false)}
        title="Enter Location"
        footer={[
          <Button type="primary" onClick={handleFeedbackClick}>
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

      {/* GENERATE PROPOSAL */}
      {showGenerateProposalBtn && (
        <Button className="button_theme" onClick={generateProposal}>
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
            onClick={downloadProposal}
          >
            Download Proposal
          </Button>
        </div>
      )}
    </div>
  );
};

export default Lms;
