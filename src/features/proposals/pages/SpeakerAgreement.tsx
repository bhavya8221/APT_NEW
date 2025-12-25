import { useState, useEffect, useRef } from "react";
import { Modal, Typography, Upload, message } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/Button";
import "./SpeakingAgreement.scss";

const { Title } = Typography;

export default function SpeakerAgreement() {
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>(largeTemplate);
  const [content, setContent] = useState<string>(largeTemplate);
  const [openEditor, setOpenEditor] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isToken =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginTokenApt")
      : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // === Handle Logo Upload ================================================
  const handleLogoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCompanyLogo(url);
    return false;
  };

  // === Handle Print =======================================================
  const handlePrint = useReactToPrint({
    contentRef, // Changed from 'content: () => contentRef.current'
    documentTitle: "Speaker Agreement",
    pageStyle: `
      @page { margin: 22mm; }
      body { -webkit-print-color-adjust: exact; }
    `,
  });

  // === Handle Closing Editor =============================================
  const attemptCloseEditor = () => {
    if (unsavedChanges) {
      Modal.confirm({
        title: "Unsaved Changes",
        content: "You have unsaved edits. Discard them?",
        okText: "Discard",
        cancelText: "Cancel",
        onOk: () => {
          setContent(initialContent);
          setUnsavedChanges(false);
          setOpenEditor(false);
        },
      });
    } else {
      setOpenEditor(false);
    }
  };

  // === Save Changes =======================================================
  const handleSave = () => {
    setInitialContent(content);
    setUnsavedChanges(false);
    setOpenEditor(false);
    message.success("Template updated.");
  };

  if (!isToken) {
    return (
      <div className="unauthenticated">
        <Title>Please sign in to continue.</Title>
      </div>
    );
  }

  return (
    <div className="SpeakingAgreementPage">
      {/* Top Buttons ------------------------------------------------------ */}
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
        title="Edit Speaker Agreement"
        open={openEditor}
        onCancel={attemptCloseEditor}
        footer={null}
        centered
        width="80%"
      >
        <Editor
          apiKey="f8i59q6p88hcyvaqhicwhyjs2cqwzr8elruwyxphppvzc5yd"
          value={content}
          init={{
            height: 500,
            menubar: false,
            plugins: "table lists link",
            toolbar:
              "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | table | link",
          }}
          onEditorChange={(newContent) => {
            setContent(newContent);
            setUnsavedChanges(true);
          }}
        />
        <div className="editor-footer">
          <Button variant="outline" onClick={attemptCloseEditor}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* PRINTABLE DOCUMENT ------------------------------------------------ */}
      <div ref={contentRef} className="speaking-document">
        <div className="logo-center">
          {companyLogo ? (
            <img
              src={companyLogo}
              height={100}
              width={100}
              alt="Company Logo"
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
        <h3 className="agreement-title">Speaker Agreement</h3>
        <div
          className="agreement-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   This holds your GIANT original HTML template exactly as-is.
------------------------------------------------------------------- */

const largeTemplate = `

${`<p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US">&nbsp;</span><span lang="EN-US" style="line-height: 115%;">This Agreement is made by and between _____________________, (the &ldquo;Client&rdquo;) and _____________________ (the &ldquo;Speaker&rdquo;) on this date of __________________ .</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt;"><span style="font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">Client Billing Address_____________________<br style="mso-special-character: line-break;"></span><span lang="EN-US" style="line-height: 115%;">Client Contact:_____________________&nbsp;</span></span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt;"><span lang="EN-US" style="line-height: 115%; font-family: arial, helvetica, sans-serif;">Client Business Phone:<span style="font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">_____________________</span></span></span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt;"><span lang="EN-US" style="line-height: 115%; font-family: arial, helvetica, sans-serif;">&nbsp;</span><span lang="EN-US" style="line-height: 115%; font-family: arial, helvetica, sans-serif;">Location of Engagement:<span style="font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">_____________________</span></span></span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt;"><span lang="EN-US" style="line-height: 115%; font-family: arial, helvetica, sans-serif;">&nbsp;</span><span style="font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">Host for the Engagement:_____________________</span></span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt;"><span style="font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">For good and valuable consideration, the parties agree as follows:</span></span></span></p>
    <ol style="margin-top: 0cm; text-align: left;" start="1" type="1">
    <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">AGREEMENT. The following terms and conditions constitute the statement of understanding between the Client and Speaker with respect to the services purchased.<span style="mso-spacerun: yes;">&nbsp; </span>This Agreement may be modified pursuant to a written instrument signed by authorized representatives of both parties.</span></li>
    </ol>
    <ol style="margin-top: 0cm; text-align: left;" start="2" type="1">
    <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">PERIOD OF ENGAGEMENT and SCHEDULE<em style="mso-bidi-font-style: normal;"><span style="mso-spacerun: yes;">&nbsp;&nbsp;&nbsp; </span></em></span></li>
    </ol>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;"><span style="mso-tab-count: 1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>The Services shall commence on (date)&nbsp;</span></p>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;"><span style="mso-tab-count: 1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>and shall continue through (date)&nbsp;</span></p>
    <table class="MsoNormalTable" style="border-collapse: collapse; border: none; margin-left: 0px; margin-right: auto;" border="1" cellspacing="0" cellpadding="0">
    <tbody>
    <tr style="mso-yfti-irow: 0; mso-yfti-firstrow: yes;">
    <td style="width: 442.8pt; border: solid black 1.0pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" colspan="3" valign="top" width="590"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;">EVENT SCHEDULE</span></td>
    </tr>
    <tr style="mso-yfti-irow: 1;">
    <td style="width: 77.4pt; border: solid black 1.0pt; border-top: none; mso-border-top-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="103"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">&nbsp;</span></td>
    <td style="width: 90.0pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="120"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">DATE</span></td>
    <td style="width: 275.4pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="367"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">SPEAKER&rsquo;S ACTIVITY SCHEDULE</span></td>
    </tr>
    <tr style="mso-yfti-irow: 2;">
    <td style="width: 77.4pt; border: solid black 1.0pt; border-top: none; mso-border-top-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="103"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US">Day One</span></strong></span></td>
    <td style="width: 90.0pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="120"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">&nbsp;</span></td>
    <td style="width: 275.4pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="367"><span style="font-size: 14pt;"><span lang="EN-US" style="font-family: arial, helvetica, sans-serif;">&nbsp;</span><span lang="EN-US" style="font-family: arial, helvetica, sans-serif;">&nbsp;</span></span></td>
    </tr>
    <tr style="mso-yfti-irow: 3;">
    <td style="width: 77.4pt; border: solid black 1.0pt; border-top: none; mso-border-top-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="103"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US">Day Two</span></strong></span></td>
    <td style="width: 90.0pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="120"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">&nbsp;</span></td>
    <td style="width: 275.4pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="367"><span style="font-size: 14pt;"><span lang="EN-US" style="font-family: arial, helvetica, sans-serif;">&nbsp;</span><span lang="EN-US" style="font-family: arial, helvetica, sans-serif;">&nbsp;</span></span></td>
    </tr>
    <tr style="mso-yfti-irow: 4; mso-yfti-lastrow: yes;">
    <td style="width: 77.4pt; border: solid black 1.0pt; border-top: none; mso-border-top-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="103"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US">Day Three</span></strong></span></td>
    <td style="width: 90.0pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="120"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">&nbsp;</span></td>
    <td style="width: 275.4pt; border-top: none; border-left: none; border-bottom: solid black 1.0pt; border-right: solid black 1.0pt; mso-border-top-alt: solid black .5pt; mso-border-left-alt: solid black .5pt; mso-border-alt: solid black .5pt; padding: 0cm 5.4pt 0cm 5.4pt;" valign="top" width="367"><span style="font-size: 14pt;"><span lang="EN-US" style="font-family: arial, helvetica, sans-serif;">&nbsp;</span><span lang="EN-US" style="font-family: arial, helvetica, sans-serif;">&nbsp;</span></span></td>
    </tr>
    </tbody>
    </table>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">Additional Engagement Details:</span><span lang="EN-US"> ________________________________________________<span style="mso-tab-count: 1;"> </span></span></span></p>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">___________, with fifty (50) percent of the fee due and non-refundable upon the signing of this Agreement.<span style="mso-spacerun: yes;">&nbsp; </span>Client agrees to remit the remainder of the payment prior to the Speaker&rsquo;s travel to the engagement</span></p>
    <ol style="margin-top: 0cm; text-align: left;" start="4" type="1">
    <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">TRAVEL ARRANGEMENTS: Speaker reserves the right to make travel arrangements and will book all air travel first class. Client agrees to pay for air travel, and will provide, pay for, or reimburse the costs of lodging, meals, tips, ground transportation, and any other reasonable and customary out-of-pocket business expenses associated with the engagement.&nbsp;</span></li>
    </ol>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">&nbsp;</span><span lang="EN-US" style="line-height: 115%;">Client is obligated to inform Speaker of the amount of driving time involved from <span style="mso-tab-count: 1;">&nbsp;&nbsp; </span>the airport to the Speaker&rsquo;s lodging accommodations and to provide Speaker with a <span style="mso-tab-count: 1;"> </span>private, licensed transport company for all ground transport. In the interest of safety,Speaker requests that travel from the airport be restricted to daylight hours.</span></span></p>
    <ol style="margin-top: 0cm; text-align: left;" start="5" type="1">
    <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">TRAVEL EXPENSE REIMBURESMENT: Speaker agrees to submit an Invoice/Business Expense report, supported by receipts, for reimbursement of all expenses incurred, due and payable when received by the Client.</span></li>
    </ol>
    <ol style="margin-top: 0cm; text-align: left;" start="6" type="1">
    <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">CLIENT RESPONSIBILITIES: Client will not schedule events for the speaker after 6:00 p.m., and will not schedule dinner arrangements later than 7:00 p.m.</span></li>
    </ol>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;"><span style="mso-tab-count: 1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Client will provide all equipment needed for the speaking engagement.</span></p>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;"><span style="mso-tab-count: 1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Client will provide the Speaker with the following information <em style="mso-bidi-font-style: normal;">prior</em> to the scheduled <span style="mso-tab-count: 1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>event:</span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">The speaking event&rsquo;s theme</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">Whether or not an prior event has been hosted at the scheduled venue</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">If the selected venue is a hotel, whether or not the Speaker&rsquo;s lodging accommodations are at the same hotel</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">Names of others scheduled to speak at the event</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">If the Speaker is expected to speak at VIP break out meals for business leaders at the event</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">If the Speaker is expected to address a media event, such as a radio interview</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">What, if anything is being sold at the event; if the Speaker is expected to support the sales of said offerings; if the Speaker is expected to sell his own merchandise; if there is a commission split for sales.</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">If the occasion is being billed as a John Maxwell Training event, and if so, the Speaker is expected to generate leads that will go toward the Client&rsquo;s account, allowing the Client to earn the $1,000 Mentorship Commission on each sale. </span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><!-- [if !supportLists]--><span lang="EN-US"><span style="mso-list: Ignore;">v<span style="font-style: normal; font-variant: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-weight: normal; font-stretch: normal; line-height: normal;"> </span></span></span><!--[endif]--><span lang="EN-US">If the Speaker is expected to provide a video promotion for the event</span></span></p>
    <ol style="margin-top: 0cm; text-align: left;" start="7" type="1">
    <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="font-size: 14pt; font-family: arial, helvetica, sans-serif;">TERMINATION: If the Speaker&rsquo;s services are cancelled due to an Act of God or dangerous situation, all parties agree to reschedule the event with the same terms as stated in this Agreement. If the Client cancels the speaking engagement within 14 days of the scheduled event, the Client is responsible for reimbursing the Speaker for any airfare expenses incurred. In the event of an emergency situation (i.e., personal/family related illness, accident, death, other) that causes the Speaker to cancel, the Client may find a replacement for the speaking engagement, or the engagement may be rescheduled.<span style="mso-spacerun: yes;">&nbsp; </span>If the engagement is cancelled, the Client will not be responsible for expense reimbursements and will the reimbursed the fifty (50) percent deposit that was a condition of the signing of the Agreement.</span></li>
    </ol>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;">IN WITNESS WHEREOF, the parties have caused this Agreement to be duly executed.</span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">&nbsp;</span><span lang="EN-US" style="line-height: 115%;">Insert Client&rsquo;s Name</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">&nbsp;</span><span lang="EN-US" style="line-height: 115%;">By: ________________________________________<span style="mso-spacerun: yes;">&nbsp;&nbsp; </span>Date__________________________</span></span></p>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;">Name:<span style="mso-tab-count: 7;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Phone: </span></p>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;">Title:<span style="mso-tab-count: 7;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Email</span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">&nbsp;</span><span lang="EN-US" style="line-height: 115%;">Insert Speaker&rsquo;s Name</span></span></p>
    <p style="text-align: left; line-height: 2;"><span style="font-size: 14pt; font-family: arial, helvetica, sans-serif;"><span lang="EN-US" style="line-height: 115%;">&nbsp;</span><span lang="EN-US" style="line-height: 115%;">By: ________________________________________<span style="mso-spacerun: yes;">&nbsp;&nbsp; </span>Date__________________________</span></span></p>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;">Name:<span style="mso-tab-count: 7;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Phone: </span></p>
    <p style="text-align: left; line-height: 2;"><span lang="EN-US" style="font-size: 14pt; line-height: 115%; font-family: arial, helvetica, sans-serif;">Title:<span style="mso-tab-count: 7;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>Email:</span></p>`}
`;
