import React, { useEffect, useState } from "react";
import "../AdvancedPrice.scss";

import { Button, Input, Select, Modal, Form, message } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import DescriptionAlerts from "@/utils/constants/alerts";
import { getAPECalFeedback } from "@/utils/api/Api";
import BammerVideo from "@/assets/Loading_icon.gif";
import { Editor } from "@tinymce/tinymce-react";

type SoftSkillLevel = {
  participants: string;
  aup: string;
};

type SoftSkillLevels = Record<string, SoftSkillLevel>;

type SoftSkillRoot = {
  "Soft Skill": SoftSkillLevels;
};

type SoftSkillProps = {
  handleCloseBH?: () => void;
};

const SoftSkillPricing: React.FC<SoftSkillProps> = ({ handleCloseBH }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = new URLSearchParams(location.search).get("s");

  const firstSelectValue = "Soft Skill" as const;

  const levelsData: SoftSkillRoot = {
    "Soft Skill": {
      "Level 1": { participants: "1-15", aup: "100" },
      "Level 2": { participants: "16-30", aup: "90" },
      "Level 3": { participants: "31-50", aup: "80" },
      "Level 4": { participants: "51-75", aup: "70" },
      "Level 5": { participants: "76-100", aup: "60" },
      "Level 6": { participants: "100+", aup: "50" },
    },
  };

  // UI state
  const [selectedLevel, setSelectedLevel] = useState("");
  const [participantsRange, setParticipantsRange] = useState("");
  const [baseAupRange, setBaseAupRange] = useState("");

  // inputs
  const [customParticipants, setCustomParticipants] = useState<
    number | undefined
  >();
  const [customAup, setCustomAup] = useState<number | undefined>();
  const [travelCost, setTravelCost] = useState<number | undefined>();

  // outputs
  const [perNoDiscount, setPerNoDiscount] = useState<number | undefined>();
  const [discountValue, setDiscountValue] = useState<number | undefined>();
  const [discountAmount, setDiscountAmount] = useState<number | undefined>();

  // feedback / proposal
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGenerateProposalBtn, setShowGenerateProposalBtn] = useState(false);
  const [proposalContent, setProposalContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  // modal / alerts
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

  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // select level
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    const info = levelsData[firstSelectValue][value as keyof SoftSkillLevels];
    if (!info) {
      setParticipantsRange("");
      setBaseAupRange("");
      return;
    }
    setParticipantsRange(info.participants);
    setBaseAupRange(info.aup);
  };

  // calculation helpers
  const recalc = (p?: number, aup?: number, travel?: number) => {
    if (p && aup && travel !== undefined) {
      const base = p * aup + travel;
      setPerNoDiscount(base);
      if (discountValue) {
        setDiscountAmount(base * discountValue);
      }
    } else {
      setPerNoDiscount(undefined);
      setDiscountAmount(undefined);
    }
  };

  const handleParticipantsInput = (v: string) => {
    const n = Number(v);
    setCustomParticipants(Number.isFinite(n) ? n : undefined);
    setShowFeedback(false);
    recalc(Number.isFinite(n) ? n : undefined, customAup, travelCost);
  };

  const handleAupInput = (v: string) => {
    const n = Number(v);
    setCustomAup(Number.isFinite(n) ? n : undefined);
    setShowFeedback(false);
    recalc(customParticipants, Number.isFinite(n) ? n : undefined, travelCost);
  };

  const handleTravelInput = (v: string) => {
    const n = Number(v);
    setTravelCost(Number.isFinite(n) ? n : undefined);
    setShowFeedback(false);
    recalc(customParticipants, customAup, Number.isFinite(n) ? n : undefined);
  };

  const handleDiscountSelect = (val: number) => {
    setDiscountValue(val);
    if (perNoDiscount !== undefined) setDiscountAmount(perNoDiscount * val);
  };

  // API feedback
  const handleFeedbackClick = async (selectedLocation?: string) => {
    if (!selectedLocation || !selectedLocation.trim()) {
      return message.error("Enter a location.");
    }

    setShowFeedback(true);
    setLoadingFeedback(true);

    try {
      // const token = localStorage.getItem("UserLoginTokenApt");
      const payload = {
        type: "soft_skill_pricing_model",
        data: {
          "Model Type": "Soft Skill Pricing Model",
          Participants: Number(customParticipants),
          AUP: Number(customAup),
          "Travel Cost": Number(travelCost),
          Discount: Number(discountValue || 0) * 100,
        },
        location: selectedLocation,
      };

      const res = await getAPECalFeedback(payload);
      setFeedback(res?.data?.data);
      setShowGenerateProposalBtn(true);
    } catch (err) {
      setFeedback(
        "<p style='color:red'>Sorry, analysis failed. Try again later.</p>"
      );
      setShowGenerateProposalBtn(false);
    } finally {
      setLoadingFeedback(false);
      setLocationModal(false);
    }
  };

  // generate AI proposal from feedback
  const handleGenerateProposal = async () => {
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
            "x-access-token": token || "",
          },
          body: JSON.stringify({ content: feedback }),
        }
      );
      const raw = await res.json();
      setProposalContent(raw?.data || "");
      setShowEditor(true);
      setShowFeedback(false);
      setShowGenerateProposalBtn(true);
    } catch (err) {
      message.error("AI proposal generation failed.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  // download proposal PDF
  const handleDownloadProposal = async () => {
    if (!proposalContent) return message.error("No proposal content.");
    try {
      const token = localStorage.getItem("UserLoginTokenApt");
      const res = await fetch(
        "https://node.automatedpricingtool.io:5000/api/v1/ape/proposal/doc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
          body: JSON.stringify({ content: proposalContent }),
        }
      );
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "advanced_price_exhibit_proposal.pdf";
      a.click();
      a.remove();
    } catch (err) {
      message.error("Failed to download proposal.");
    }
  };

  // store data for proposal page
  const handleStoreData = () => {
    if (
      !customParticipants ||
      !customAup ||
      travelCost === undefined ||
      perNoDiscount === undefined
    ) {
      return message.error("Please fill all required fields.");
    }

    const data: any = {
      heading: "SoftSkillPricing",
      Custom_Participants: customParticipants!, // guaranteed by validation
      Custom_Aup: customAup!,
      Travel_Cost: travelCost!,
      Per_No_Discount: perNoDiscount!,
      Annual_No_Discount: (perNoDiscount! * 12).toFixed(2),

      Workbook_Print_Cost: (customParticipants! * 19).toFixed(2),

      One_Time_Cost: (
        ((customParticipants! * 19) / perNoDiscount!) *
        100
      ).toFixed(2),

      Annual_CPI_3: (perNoDiscount! * 12 * 0.03).toFixed(2),
      Annual_CPI_5: (perNoDiscount! * 12 * 0.05).toFixed(2),
    };

    if (discountValue && discountAmount !== undefined) {
      data.Discount_Value = (discountValue * 100).toFixed(2);
      data.Discount_Amount = discountAmount;
      data.After_Discount = (perNoDiscount - discountAmount).toFixed(2);
      data.Annual_After_Discount = (
        (perNoDiscount - discountAmount) *
        12
      ).toFixed(2);
    }

    localStorage.setItem("Calculation", JSON.stringify(data));
    setAlertCfg({ text: "Data Stored For Proposal.", icon: "success" });
    setAlert(true);

    setTimeout(() => {
      if (!slug) navigate("/create/leadership-workshop-proposal");
      if (handleCloseBH) handleCloseBH();
    }, 1200);
  };

  return (
    <div className="AdvancedPrice">
      {alert && <DescriptionAlerts text={alertCfg.text} icon={alertCfg.icon} />}

      <div className="Calculator_container">
        <div className="Row_1">
          <div className="Col_1 blank_input" style={{ padding: 4 }}>
            Soft Skill Pricing Model
          </div>
          <div className="Col_1">
            <Select
              value={selectedLevel}
              onChange={handleLevelChange}
              style={{ width: "100%", padding: 4 }}
              options={[
                { label: "select--", value: "" },
                ...Object.keys(levelsData["Soft Skill"]).map((k) => ({
                  label: k,
                  value: k,
                })),
              ]}
            />
          </div>
        </div>

        {selectedLevel && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Participants:
                <div className="Col_12">
                  <div className="blank_input">{participantsRange}</div>
                </div>
              </div>
            </div>

            <Form layout="vertical">
              <Form.Item label="Participants">
                <Input
                  type="number"
                  value={customParticipants as any}
                  onChange={(e) => handleParticipantsInput(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="AUP (Input)">
                <Input
                  type="number"
                  value={customAup as any}
                  onChange={(e) => handleAupInput(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Travel Cost">
                <Input
                  type="number"
                  value={travelCost as any}
                  onChange={(e) => handleTravelInput(e.target.value)}
                />
              </Form.Item>
            </Form>
          </>
        )}

        {perNoDiscount !== undefined && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Fee (Month or Session):
                <div className="Col_12 blank_input">
                  ${perNoDiscount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual Fee:
                <div className="Col_12 blank_input">
                  ${(perNoDiscount * 12).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedLevel && (
          <Select
            value={discountValue}
            onChange={handleDiscountSelect}
            style={{ width: "100%", marginTop: 12 }}
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
                Discount Amount :
                <div className="Col_12 blank_input">
                  ${discountAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Fee After Discount :
                <div className="Col_12 blank_input">
                  ${(perNoDiscount! - discountAmount).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual After Discount :
                <div className="Col_12 blank_input">
                  ${((perNoDiscount! - discountAmount) * 12).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}

        {perNoDiscount !== undefined && (
          <>
            <div className="Row_1">
              <div className="Col_1 blank_input">
                Workbook Print Cost (Fedex) $19 :
                <div className="Col_12 blank_input">
                  ${(Number(customParticipants) * 19).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Print as a % of one time cost :
                <div className="Col_12 blank_input">
                  {(
                    ((Number(customParticipants) * 19) / perNoDiscount) *
                    100
                  ).toFixed(2)}
                  %
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual CPI 3% :
                <div className="Col_12 blank_input">
                  ${(perNoDiscount * 12 * 0.03).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="Row_1">
              <div className="Col_1 blank_input">
                Annual CPI 5%:
                <div className="Col_12 blank_input">
                  ${(perNoDiscount * 12 * 0.05).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <Button className="button_theme" onClick={handleStoreData}>
        Add to proposal
      </Button>

      {discountValue !== undefined && (
        <Button className="button_theme" onClick={() => setLocationModal(true)}>
          Show Analysis
        </Button>
      )}

      {/* Location modal */}
      <Modal
        centered
        open={locationModal}
        onCancel={() => setLocationModal(false)}
        title="Enter Location"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => handleFeedbackClick(locationData)}
          >
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

      {/* Feedback */}
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

      {/* Generate proposal */}
      {showGenerateProposalBtn && (
        <Button className="button_theme" onClick={handleGenerateProposal}>
          Generate AI Proposal
        </Button>
      )}

      {/* TinyMCE Editor */}
      {showEditor && proposalContent && (
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
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default SoftSkillPricing;
