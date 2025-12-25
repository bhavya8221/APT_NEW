import React, { useEffect, useRef, useState } from "react";
import "./LeadershipProposal.scss";
import "@/features/calculators/components/AdvancedPrice.scss";
import { useReactToPrint } from "react-to-print";
import { Editor } from "@tinymce/tinymce-react";
import {
  DraftCalculationApi,
  ProposalViewApi,
  UpdateDraft,
} from "@/utils/api/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Signin from "@/features/auth/Signin";
import AdvancedPrice from "@/features/calculators/components/AdvancedPrice";

// Types
interface ProposalData {
  heading?: string;
  section_1?: string;
  section_2?: string;
  section_3?: string;
}

interface CalculatorData {
  heading?: string;
  Custom_Participants?: number;
  Custom_Aup?: number;
  Custom_Adu?: number;
  CustomPerHour?: number;
  Travel_Cost?: number;
  Per_No_Discount?: number;
  Annual_No_Discount?: number;
  Discount_Value?: number;
  Discount_Amount?: number;
  After_Discount?: number;
  Annual_After_Discount?: number;
  Gross_Amount?: number;
  Assessment_fee?: number;
  Net_Amount?: number;
  Monthly_Revenue?: number;
  Annual_Revenue?: number;
}

// interface AdvancedPriceProps {
//   handleCloseBH: () => void;
//   calculatordetails?: CalculatorData;
// }

interface UseData {
  id?: string;
  draft_name?: string;
  proposal_data?: ProposalData;
  calculator_data?: CalculatorData | null;
  calculator_name?: string | null;
}

interface LocationState {
  state?: UseData;
  search?: string;
}

const LeadershipProposal: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation() as LocationState;
  const [usedata, setUseData] = useState<UseData | undefined>(location?.state);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const [initialContent1, setInitialContent1] = useState<string>(
    usedata?.proposal_data?.section_1 ||
      `<h2 style="text-align: center;"><span style="color: rgb(9, 23, 153);"><strong>EXECUTIVE SUMMARY</strong></span></h2>
  <h3><strong><span style="color: rgb(9, 23, 153);">SUBHEAD (optional)</span></strong></h3>
  <p>Summarize the training to be provided, briefly reiterate why you are the best person to provide this training and explain how the company will benefit from the training.</p>
  <p>For example:</p>
  <p>We are pleased to present ABC Inc. with a proposal to train 25 managers. We will bring 25 years of Leadership training plus resources from the #1 leadership guru in the world. We will lead your staff through an in depth study of XXX. As a result of this training your company will experience increased productivity&hellip;</p>`
  );
  const [content1, setContent1] = useState<string>(initialContent1);
  const [lgShow, setLgShow] = useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const handleClose = () => {
    if (
      unsavedChanges &&
      window.confirm("You have unsaved changes. Do you want to discard them?")
    ) {
      handleCloseModal();
      return;
    }
    if (unsavedChanges) {
      return;
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setLgShow(false);
    setContent1(initialContent1);
    setUnsavedChanges(false);
  };

  const handleSave = () => {
    setInitialContent1(content1);
    setUnsavedChanges(false);
    setLgShow(false);
  };

  const [initialContent2, setInitialContent2] = useState<string>(
    usedata?.proposal_data?.section_2 ||
      `<h3><strong><span style="color: rgb(9, 23, 153);">OBJECTIVES</span></strong></h3>
  <ol>
  <li>Objectives should be a list of what you and the company had previously identified as important concepts that all attendees should grasp through the training.</li>
  <li>Participants will be able to recognize&hellip;</li>
  <li>Each team member will&hellip;</li>
  <li>Etc, etc, etc</li>
  </ol>
  <h3><strong><span style="color: rgb(9, 23, 153);">TRAINING SCHEDULE</span></strong></h3>
  <p>Provide a detailed schedule of the training to be provided.</p>
  <p>For example&hellip;</p>
  <p>April 1, 2020 - Session 1:&nbsp;<strong>Leadership is Influence</strong></p>
  <p>April 8, 2020 - Session 2:&nbsp;<strong>Leadership is Influence</strong></p>
  <h3><span style="color: rgb(9, 23, 153);"><strong>RESOURCES</strong></span></h3>
  <ul>
  <li>List any resources that you will be providing.</li>
  <li>- Books</li>
  <li>- Binder for handouts and notes</li>
  <li>- Handouts</li>
  <li>- etc.</li>
  </ul>`
  );
  const [content2, setContent2] = useState<string>(initialContent2);
  const [lgShow2, setLgShow2] = useState<boolean>(false);
  const [unsavedChanges2, setUnsavedChanges2] = useState<boolean>(false);

  const handleClose2 = () => {
    if (
      unsavedChanges2 &&
      window.confirm("You have unsaved changes. Do you want to discard them?")
    ) {
      handleCloseModal2();
      return;
    }
    if (unsavedChanges2) {
      return;
    }
    handleCloseModal2();
  };

  const handleCloseModal2 = () => {
    setLgShow2(false);
    setContent2(initialContent2);
    setUnsavedChanges2(false);
  };

  const handleSave2 = () => {
    setInitialContent2(content2);
    setUnsavedChanges2(false);
    setLgShow2(false);
  };

  const [initialContent3, setInitialContent3] = useState<string>(
    usedata?.proposal_data?.section_3 ||
      `<h4 style="text-align: center;">Workshop Agreement</h4>
  <p>This agreement is between your &nbsp;&nbsp;<span contenteditable="true">Name</span>&nbsp;, &nbsp;&nbsp;<span contenteditable="true">Company Name</span>&nbsp;&nbsp; and &nbsp;&nbsp;<span contenteditable="true">Address</span>&nbsp;&nbsp;</p>
  <p>&nbsp;&nbsp;<span contenteditable="true">Company Name</span>&nbsp;&nbsp;wishes to retain the services of ,&nbsp;&nbsp;<span contenteditable="true">Name</span>&nbsp;&nbsp;to deliver training for &nbsp;&nbsp;<span contenteditable="true">_________________</span>&nbsp;&nbsp;participants.</p>
  <p><strong>Date:&nbsp;</strong>&nbsp;&nbsp;<span contenteditable="true">_________________</span></p>
  <p><strong>Program Time:</strong>&nbsp;&nbsp;&nbsp;<span contenteditable="true">_________________</span></p>
  <p><strong>Program Location:</strong>&nbsp;&nbsp;&nbsp;<span contenteditable="true">_________________</span></p>
  <p><strong>Program Title:&nbsp;</strong>&nbsp;&nbsp;<span contenteditable="true">_________________</span></p>
  <p><strong>Number of Participants:&nbsp;</strong>&nbsp;&nbsp;<span contenteditable="true">_________________</span></p>
  <p>Provide understanding of agreement: Full Service Solutions agrees to present the information and material contained in the program described above. Full Service Solutions also agrees to coordinate the details of this program with Jane Doe (identify Point of Contact) in order to achieve the outcomes that ABC Inc has stated. ABC Inc agrees to provide the room setup and audiovisual equipment described below.</p>
  <ul>
  <li>Program Logistics (list specific requirements &ndash; things to consider are listed)</li>
  <li>When do you need access to the room?</li>
  <li>How should the room be set up?</li>
  <li>What equipment needs to be available and/or setup?</li>
  <li>Will you need technical support available?</li>
  <li>What refreshments are you expecting and who will provide them?</li>
  </ul>
  <p>In exchange for the products and services provided, ABC Inc agrees to compensate Full Service Solutions as follows:</p>
  <p><strong>Professional Fee:</strong>&nbsp;&nbsp;<span contenteditable="true">Amount</span>&nbsp;&nbsp;</p>
  <p><strong>Deposit:</strong>Describe how much and when Deposit is due &ndash; When contract is signed?</p>
  <p><strong>Balance:</strong>Describe how much and when balance is due &ndash; At completion of training?</p>
  <p>You may want to add here what happens if training is canceled for any reason. Is there a full refund? Is the refund prorated based on when canceled prior to training (ie. 30 days out)? Is the client responsible to pay costs of books, Binders, etc.? How should they notify you of cancelation?</p>
  <ul>
  <li>Other considerations:</li>
  <li style="list-style-type: none;">- Can the client record your training?</li>
  <li style="list-style-type: none;">- Can the client substitute participants?</li>
  </ul>
  <p>This constitutes the entire agreement between both parties.</p>
  <div>
  <div>
  <p>&nbsp;&nbsp;<span contenteditable="true">___Name___</span>&nbsp; &nbsp;&nbsp;<span contenteditable="true">___Date___</span>&nbsp;</p>
  </div>
  <div>
  <p>&nbsp;&nbsp;<span contenteditable="true">___Name___</span>&nbsp; &nbsp;&nbsp;<span contenteditable="true">___Date___</span>&nbsp;</p>
  </div>
  </div>`
  );
  const [content3, setContent3] = useState<string>(initialContent3);
  const [lgShow3, setLgShow3] = useState<boolean>(false);
  const [unsavedChanges3, setUnsavedChanges3] = useState<boolean>(false);

  const handleClose3 = () => {
    if (
      unsavedChanges3 &&
      window.confirm("You have unsaved changes. Do you want to discard them?")
    ) {
      handleCloseModal3();
      return;
    }
    if (unsavedChanges3) {
      return;
    }
    handleCloseModal3();
  };

  const handleCloseModal3 = () => {
    setLgShow3(false);
    setContent3(initialContent3);
    setUnsavedChanges3(false);
  };

  const handleSave3 = () => {
    setUnsavedChanges3(false);
    setInitialContent3(content3);
    setLgShow3(false);
  };

  const [initialContentheading, setInitialContentheading] = useState<string>(
    usedata?.proposal_data?.heading ||
      `
  <h1 style="text-align: center;"><span style="color: rgb(9, 94, 151);"><strong>Enter Speaker or Company</strong></span></h1>
  <h3>LEADERSHIP<br>WORKSHOP<br>PROPOSAL</h3>
  <p>&nbsp;</p>
  <h2 class="APROPOSALTO" style="text-align: left;" align="left"><span style="color: rgb(0, 0, 0); font-size: 18pt; font-family: arial, helvetica, sans-serif;"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="line-height: 120%;">Prepared for:</span></strong></span></h2>
  <h4 class="APROPOSALTO" style="text-align: left; line-height: 1;" align="left"><span style="font-family: arial, helvetica, sans-serif;"><strong><span style="color: rgb(0, 0, 0); font-size: 14pt;"><span lang="EN-US">Insert Point of Contact</span></span></strong></span></h4>
  <h4 class="APROPOSALTO" style="text-align: left; line-height: 1;" align="left"><span style="font-family: arial, helvetica, sans-serif;"><strong><span style="color: rgb(0, 0, 0); font-size: 14pt;"><span lang="EN-US">Insert Point Client Business Name</span></span></strong></span></h4>
  <h4 class="MonthDayYear01" style="text-align: left; line-height: 1;" align="left"><span style="font-family: arial, helvetica, sans-serif;"><strong><span style="color: rgb(0, 0, 0); font-size: 14pt;"><span lang="EN-US">00 / 00 / 0000</span></span></strong></span></h4>
  <p class="MonthDayYear01" style="text-align: right;" align="left">&nbsp;</p>
  <h2 class="APROPOSALTO" style="text-align: right;" align="left"><span style="color: rgb(0, 0, 0); font-size: 18pt; font-family: arial, helvetica, sans-serif;"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="line-height: 120%;">Prepared by:</span></strong></span></h2>
  <h4 class="APROPOSALTO" style="text-align:right; line-height: 1;" align="left"><span style="font-family: arial, helvetica, sans-serif;"><strong><span style="color: rgb(0, 0, 0); font-size: 14pt;"><span lang="EN-US">Insert Point of Contact</span></span></strong></span></h4>
  <h4 class="APROPOSALTO" style="text-align:right; line-height: 1;" align="left"><span style="font-family: arial, helvetica, sans-serif;"><strong><span style="color: rgb(0, 0, 0); font-size: 14pt;"><span lang="EN-US">Insert Point Client Business Name</span></span></strong></span></h4>
  <h4 class="MonthDayYear01" style="text-align:right; line-height: 1;" align="left"><span style="font-family: arial, helvetica, sans-serif;"><strong><span style="color: rgb(0, 0, 0); font-size: 18pt;"><span lang="EN-US">CERTIFIED COACH, SPEAKER AND TRAINER</span></span></strong></span></h4>
  <p class="MonthDayYear01" style="text-align: right;" align="left">&nbsp;</p>`
  );
  const [contentheading, setContentheading] = useState<string>(
    initialContentheading
  );
  const [lgShowheading, setLgShowheading] = useState<boolean>(false);
  const [unsavedChangesheading, setUnsavedChangesheading] =
    useState<boolean>(false);

  const handleCloseheading = () => {
    if (
      unsavedChangesheading &&
      window.confirm("You have unsaved changes. Do you want to discard them?")
    ) {
      handleCloseModalheading();
      return;
    }
    if (unsavedChangesheading) {
      return;
    }
    handleCloseModalheading();
  };

  const handleCloseModalheading = () => {
    setLgShowheading(false);
    setContentheading(initialContentheading);
    setUnsavedChangesheading(false);
  };

  const handleSaveheading = () => {
    setUnsavedChangesheading(false);
    setInitialContentheading(contentheading);
    setLgShowheading(false);
  };

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });

  const isToken = localStorage.getItem("UserLoginTokenApt");

  useEffect(() => {
    if (id && isToken) {
      ProposalViewApi(id)
        .then(() => {})
        .catch(() => {});
    }
  }, [id, isToken]);

  const calculatorvalue: CalculatorData = JSON.parse(
    localStorage.getItem("Calculation") || "{}"
  );

  const [showBh, setShowBh] = useState<boolean>(false);
  const handleCloseBH = () => {
    setShowBh(false);
  };

  const [oldValues] = useState<boolean>(false);
  const handleShowBH = () => setShowBh(true);

  const slug = new URLSearchParams(location?.search).get("s");

  const handleSaveAsDraftWithStatus = async (status: "save" | "saveas") => {
    let draftName = "";

    if (status === "saveas") {
      draftName = prompt("Please enter your Draft Name", "sampleDraft") || "";
      if (!draftName) return;
    }

    const updatedata = {
      draft_name: status !== "saveas" ? usedata?.draft_name : draftName,
      calculator_name: calculatorvalue.heading,
      proposal_name: "Leadership Agreement",
      proposal_data: {
        heading: initialContentheading,
        section_1: initialContent1,
        section_2: initialContent2,
        section_3: initialContent3,
      },
      calculator_data: calculatorvalue?.heading
        ? calculatorvalue
        : usedata?.calculator_data,
    };

    if (status !== "saveas" && usedata?.id) {
      UpdateDraft(usedata.id, updatedata)
        .then(() => {
          localStorage.removeItem("Calculation");
          navigate("/draft");
        })
        .catch((error) => {
          console.log(error, "error");
        });
    } else {
      DraftCalculationApi(updatedata)
        .then(() => {
          localStorage.removeItem("Calculation");
          navigate("/draft");
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  };

  const handleRemoveCalculation = async () => {
    if (calculatorvalue?.heading) {
      localStorage.removeItem("Calculation");
      window.location.reload();
    } else if (usedata?.id) {
      const updatedata = {
        draft_name: usedata?.draft_name,
        calculator_name: null,
        proposal_name: "Leadership Agreement",
        proposal_data: {
          heading: initialContentheading,
          section_1: initialContent1,
          section_2: initialContent2,
          section_3: initialContent3,
        },
        calculator_data: null,
      };
      UpdateDraft(usedata.id, updatedata)
        .then((res) => {
          setUseData(res?.data?.data);
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  };

  // Custom Modal Component
  const Modal: React.FC<{
    show: boolean;
    onHide: () => void;
    children: React.ReactNode;
    size?: "sm" | "lg" | "xl";
  }> = ({ show, onHide, children, size = "lg" }) => {
    if (!show) return null;

    return (
      <div className="modal-overlay" onClick={onHide}>
        <div
          className={`modal-content modal-${size}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  };

  const ModalBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="modal-body">{children}</div>
  );

  const ModalFooter: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <div className="modal-footer">{children}</div>;

  // Custom Button Component
  const Button: React.FC<{
    onClick?: () => void;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
  }> = ({ onClick, children, variant = "primary", className = "" }) => (
    <button onClick={onClick} className={`btn btn-${variant} ${className}`}>
      {children}
    </button>
  );

  const renderCalculatorData = (data: CalculatorData | null | undefined) => {
    if (!data) return null;

    const renderField = (
      label: string,
      value: number | string | undefined,
      isPercentage = false
    ) => {
      if (value === undefined || value === null) return null;
      return (
        <div className="Row_1">
          <div className="Col_1 blank_input">
            {label}:
            <div className="Col_12 blank_input">
              {isPercentage ? `${value}%` : `$${value}`}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="calculator_main_container">
        <div className="cal_main">
          <h3 className="heading">
            {data.heading === "SoftSkillPricing"
              ? "Soft Skill Pricing Model"
              : data.heading === "OneTime"
              ? "One Time All Day Workshop"
              : data.heading === "Assessment Programs"
              ? "Assessment Programs"
              : data.heading === "LMS"
              ? "LMS"
              : ""}
          </h3>
          <div className="Calculator_container">
            {renderField("Participants", data.Custom_Participants, false)}
            {data.heading === "LMS" &&
              renderField("AUP", data.Custom_Adu, false)}
            {renderField("Travel Cost", data.Travel_Cost, false)}
            {renderField("Fee (Month or Session)", data.Per_No_Discount, false)}
            {renderField("Annual Fee", data.Annual_No_Discount, false)}
            {data.heading === "LMS" &&
              renderField("Monthly Revenue", data.Monthly_Revenue, false)}
            {data.heading === "LMS" &&
              renderField("Annual Revenue", data.Annual_Revenue, false)}
            {data.heading === "Assessment Programs" &&
              renderField("Net Amount", data.Net_Amount, false)}
            {renderField("Select Discount", data.Discount_Value, true)}
            {renderField("Discount Amount", data.Discount_Amount, false)}
            {renderField(
              "Fee (Month or Session) After Discount",
              data.After_Discount,
              false
            )}
            {renderField(
              "Annual After Discount",
              data.Annual_After_Discount,
              false
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isToken ? (
        <Signin />
      ) : (
        <div className="leader">
          <div className="container">
            <div className="leader_button">
              <Button
                variant="secondary"
                className="button_color"
                onClick={() => handleSaveAsDraftWithStatus("saveas")}
              >
                {slug ? "Create New Draft" : "Create Draft"}
              </Button>
              &nbsp;
              {slug && (
                <Button
                  variant="secondary"
                  className="button_color"
                  onClick={() => handleSaveAsDraftWithStatus("save")}
                >
                  Update Draft
                </Button>
              )}
              &nbsp;
              <Button
                variant="secondary"
                className="button_color"
                onClick={handlePrint}
              >
                Generate PDF
              </Button>
            </div>
            <br />
            <div
              ref={contentRef}
              className="LeadershipProposal printable-content"
            >
              <div className="textimage">
                <div className="page">
                  <div className="section1button">
                    <Button
                      onClick={() => setLgShowheading(true)}
                      className="button_theme"
                    >
                      Edit Banner Section
                    </Button>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: contentheading }} />
                  <Modal
                    size="lg"
                    show={lgShowheading}
                    onHide={handleCloseheading}
                  >
                    <ModalBody>
                      <Editor
                        apiKey="f8i59q6p88hcyvaqhicwhyjs2cqwzr8elruwyxphppvzc5yd"
                        value={contentheading}
                        init={{
                          plugins: "table",
                          toolbar:
                            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                          tinycomments_mode: "embedded",
                          tinycomments_author: "Author name",
                          mergetags_list: [
                            { value: "First.Name", title: "First Name" },
                            { value: "Email", title: "Email" },
                          ],
                        }}
                        onClick={() => setUnsavedChangesheading(true)}
                        onEditorChange={(newContent) => {
                          setContentheading(newContent);
                        }}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant="secondary"
                        onClick={handleCloseModalheading}
                      >
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleSaveheading}>
                        Save Changes
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </div>

              <div className="page">
                <div className="section1button">
                  <Button
                    onClick={() => setLgShow(true)}
                    className="button_theme"
                  >
                    Edit this Section
                  </Button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: content1 }} />
                <Modal size="lg" show={lgShow} onHide={handleClose}>
                  <ModalBody>
                    <Editor
                      apiKey="f8i59q6p88hcyvaqhicwhyjs2cqwzr8elruwyxphppvzc5yd"
                      value={content1}
                      init={{
                        plugins: "table",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                        tinycomments_mode: "embedded",
                        tinycomments_author: "Author name",
                        mergetags_list: [
                          { value: "First.Name", title: "First Name" },
                          { value: "Email", title: "Email" },
                        ],
                      }}
                      onClick={() => setUnsavedChanges(true)}
                      onEditorChange={(newContent) => {
                        setContent1(newContent);
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>

              <div className="page">
                <div className="section1button">
                  <Button
                    onClick={() => setLgShow2(true)}
                    className="button_theme"
                  >
                    Edit this Section
                  </Button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: content2 }} />
                <Modal size="lg" show={lgShow2} onHide={handleClose2}>
                  <ModalBody>
                    <Editor
                      apiKey="f8i59q6p88hcyvaqhicwhyjs2cqwzr8elruwyxphppvzc5yd"
                      value={content2}
                      init={{
                        plugins: "table",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                        tinycomments_mode: "embedded",
                        tinycomments_author: "Author name",
                        mergetags_list: [
                          { value: "First.Name", title: "First Name" },
                          { value: "Email", title: "Email" },
                        ],
                      }}
                      onClick={() => setUnsavedChanges2(true)}
                      onEditorChange={(newContent) => {
                        setContent2(newContent);
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="secondary" onClick={handleCloseModal2}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSave2}>
                      Save Changes
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>

              <div className="page">
                <div className="section1button">
                  <Button
                    onClick={() => setLgShow3(true)}
                    className="button_theme"
                  >
                    Edit this Section
                  </Button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: content3 }} />
                <Modal size="lg" show={lgShow3} onHide={handleClose3}>
                  <ModalBody>
                    <Editor
                      apiKey="f8i59q6p88hcyvaqhicwhyjs2cqwzr8elruwyxphppvzc5yd"
                      value={content3}
                      init={{
                        plugins: "table",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                        tinycomments_mode: "embedded",
                        tinycomments_author: "Author name",
                        mergetags_list: [
                          { value: "First.Name", title: "First Name" },
                          { value: "Email", title: "Email" },
                        ],
                      }}
                      onClick={() => setUnsavedChanges3(true)}
                      onEditorChange={(newContent) => {
                        setContent3(newContent);
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="secondary" onClick={handleCloseModal3}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSave3}>
                      Save Changes
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>

              <div className="Calculator_data_include_for_propodal">
                <div className="Add_Calculation">
                  <Button className="button_theme" onClick={handleShowBH}>
                    {(slug && usedata?.calculator_name !== null) ||
                    calculatorvalue?.heading
                      ? "Change Calculation"
                      : "Add Calculation"}
                  </Button>
                  {((slug && usedata?.calculator_name !== null) ||
                    calculatorvalue?.heading) && (
                    <Button
                      className="button_theme"
                      onClick={handleRemoveCalculation}
                    >
                      Remove
                    </Button>
                  )}
                  <Modal show={showBh} onHide={handleCloseBH} size="lg">
                    <ModalBody>
                      <AdvancedPrice
                        handleCloseBH={handleCloseBH}
                        calculatordetails={
                          usedata?.calculator_data || undefined
                        }
                      />
                    </ModalBody>
                  </Modal>
                </div>
              </div>

              {calculatorvalue?.heading &&
                renderCalculatorData(calculatorvalue)}
              {!calculatorvalue?.heading &&
                usedata?.calculator_data &&
                !oldValues &&
                renderCalculatorData(usedata.calculator_data)}
            </div>
            <br />
          </div>
        </div>
      )}
    </>
  );
};

export default LeadershipProposal;
