import { useState, useRef, useEffect } from "react";
import { Modal, Typography, Upload, message } from "antd";
import { useReactToPrint } from "react-to-print";
import { Editor } from "@tinymce/tinymce-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import "./SpeakingAgreement.scss";

const { Title } = Typography;

const defaultTemplate = `
<p>This agreement is between XYZ Inc., (Consultant) and ______________________ (Company), __________________________(Address).</p>
<p>_______________________(Company) wishes to retain the services of John Doe&nbsp;to deliver a</p>
<p>presentation for&nbsp;_______________________(Event) as follows:</p>
<p><strong>Date:&nbsp;_______________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></p>
<p><strong>Program Time:&nbsp;_______________________</strong></p>
<p><strong>Program Location: _______________________</strong></p>
<p><strong>Program Title: _______________________</strong></p>
<p><strong>Number of Participants:</strong> ___________________</p>
<p>XYZ Inc. and John Doe agree to present to the best of our ability the information and material contained in the program described above.&nbsp;</p>
<p>In exchange for the products and services provided, the Client agrees to compensate XYZ Inc. as follows:</p>
<p><strong>Professional Fee:</strong> $XXXX</p>
<p><strong>Travel:</strong> All reasonable and customary travel expenses including coach airfare, lodging, meals.</p>
<p><strong>Deposit:</strong> 15% of the professional fee at signing.</p>
<p><strong>Balance:</strong> Due on event date.</p>
<p>The client agrees not to audio/video record without written agreement.</p>
<p>This constitutes the entire agreement between the parties.</p>
<p><br/></p>
<p>By: _____________</p>
<p>Co: _____________</p>
<p>Title: _____________</p>
<p>Date: _____________</p>
`;

export default function SpeakingAgreement() {
  const { id } = useParams();
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [initialContent, setInitialContent] = useState(defaultTemplate);
  const [content, setContent] = useState(defaultTemplate);
  const [openEditor, setOpenEditor] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isToken =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginTokenApt")
      : null;

  // Fetch template from API (future integration)
  useEffect(() => {
    // ProposalViewApi(id).then(...).catch(...)
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Handle logo change ---------------------------------------------------------
  const handleLogoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCompanyLogo(url);
    return false;
  };

  // Handle printing ------------------------------------------------------------
  const handlePrint = useReactToPrint({
    contentRef, // Changed from 'content' to 'contentRef'
    documentTitle: "Speaking Agreement",
    pageStyle: `
      @page { margin: 22mm; }
      body { -webkit-print-color-adjust: exact; }
    `,
  });

  // Close Editor Modal ---------------------------------------------------------
  const attemptCloseEditor = () => {
    if (unsavedChanges) {
      Modal.confirm({
        title: "Unsaved Changes",
        content: "You have unsaved edits. Discard them?",
        okText: "Discard",
        cancelText: "Cancel",
        onOk: () => {
          setContent(initialContent);
          setOpenEditor(false);
          setUnsavedChanges(false);
        },
      });
    } else {
      setOpenEditor(false);
    }
  };

  // Save the edited content ----------------------------------------------------
  const handleSaveChanges = () => {
    setInitialContent(content);
    setUnsavedChanges(false);
    setOpenEditor(false);
    message.success("Template updated");
  };

  // ---------------------------------------------------------------------------
  if (!isToken) {
    return (
      <div className="unauthenticated">
        <Title>Please sign in to continue.</Title>
      </div>
    );
  }

  return (
    <div className="SpeakingAgreementPage">
      <div className="editor-actions">
        <Button variant="default" onClick={() => setOpenEditor(true)}>
          Edit Template
        </Button>
        <Button variant="secondary" onClick={handlePrint}>
          Generate PDF
        </Button>
      </div>

      {/* EDITOR MODAL ------------------------------------------------------ */}
      <Modal
        title="Edit Speaking Agreement"
        open={openEditor}
        onCancel={attemptCloseEditor}
        footer={null}
        width="80%"
        centered
      >
        <Editor
          apiKey="f8i59q6p88hcyvaqhicwhyjs2cqwzr8elruwyxphppvzc5yd"
          value={content}
          onEditorChange={(newContent) => {
            setContent(newContent);
            setUnsavedChanges(true);
          }}
          init={{
            height: 450,
            menubar: false,
            plugins: "table lists link",
            toolbar:
              "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | table | link",
          }}
        />
        <div className="editor-footer">
          <Button variant="outline" onClick={attemptCloseEditor}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* MAIN DOCUMENT DISPLAY --------------------------------------------- */}
      <div ref={contentRef} className="speaking-document">
        <div className="logo-center">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt="Company Logo"
              height={100}
              width={100}
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <Upload
              accept="image/*"
              beforeUpload={handleLogoUpload}
              showUploadList={false}
            >
              <div className="logo-upload">Add Company Logo</div>
            </Upload>
          )}
        </div>
        <h3 className="agreement-title">Speaking Agreement</h3>
        <div
          className="agreement-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
