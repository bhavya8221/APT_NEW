import React, { useEffect, useRef, useState } from "react";
import { Modal, Upload, Typography, message } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/Button";
import "./CoachingAgreement.scss";

const { Title } = Typography;

const CoachingAgreement: React.FC = () => {
  const [content, setContent] = useState<string>(defaultTemplate);
  const [initialContent, setInitialContent] = useState<string>(defaultTemplate);
  const [openEditor, setOpenEditor] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  const isToken =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginTokenApt")
      : null;

  // Scroll top once
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // === Handle logo upload ============================================
  const handleLogoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCompanyLogo(url);
    return false;
  };

  // === Handle printing =================================================
  const handlePrint = useReactToPrint({
    contentRef, // Changed from 'content: () => contentRef.current'
    documentTitle: "Coaching Agreement",
    pageStyle: `
      @page { margin: 22mm; }
      body { -webkit-print-color-adjust: exact; }
    `,
  });

  // === Attempt to close editor ========================================
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

  // === Save changes ====================================================
  const handleSaveChanges = () => {
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
    <div className="CoachingAgreementPage">
      {/* Top Buttons */}
      <div className="editor-actions">
        <Button variant="default" onClick={() => setOpenEditor(true)}>
          Edit Template
        </Button>
        <Button variant="secondary" onClick={handlePrint}>
          Generate PDF
        </Button>
      </div>

      {/* EDITOR MODAL ---------------------------------------------------- */}
      <Modal
        title="Edit Coaching Agreement"
        open={openEditor}
        centered
        width="80%"
        onCancel={attemptCloseEditor}
        footer={null}
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
          onEditorChange={(newValue) => {
            setContent(newValue);
            setUnsavedChanges(true);
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

      {/* PRINTABLE CONTENT ---------------------------------------------- */}
      <div ref={contentRef} className="agreement-container">
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
        <h3 className="agreement-title">Coaching Agreement</h3>
        <div
          className="agreement-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default CoachingAgreement;

const defaultTemplate = `
${`<p><strong>Coaching Services: Description, Objectives, Options, Terms, and Agreement of Services</strong>&nbsp;</p>
<p><strong>1. Description</strong>:&nbsp;Coaching is an on-going conversation where we provide encouragement, guidance and honest feedback, as YOU pursue YOUR personal and professional goals.&nbsp;We fully expect you to grow your business, by attaining your goals!</p>
<p>In today&rsquo;s competitive environment, some of the most successful business leaders have experienced tremendous benefits from coaching.&nbsp;Results have included increased revenue and productivity, career advancement, higher employee retention, and the development of more effective business strategies.&nbsp;YOU will define the agenda.&nbsp;YOUR results will vary depending on how long we work together and what actions YOU take.</p>
<p>Our clients are expected to and have experienced measureable return on investment, increased productivity, and up to 200% revenue growth.</p>
<p><strong>2. Objectives</strong>:&nbsp;Our responsibility is to provide content, insight, tools, wisdom, framework, ideas, and feedback.&nbsp;YOUR responsibility is to move from awareness to action and accountability.&nbsp;&nbsp;&nbsp;Our coaching provides many structures for you to meet your individual and organizational goals.&nbsp;&nbsp;</p>
<p>The objectives of coaching include, but are not limited to:</p>
<p>Adding an objective and supportive third party to your leadership team</p>
<p>Increasing accountability of your personal and professional goals</p>
<p>Improving specific skills related to your role.&nbsp;Such as managerial skills, communication, conflict resolution, time management, productivity, and effectiveness</p>
<p>Sharing best practices from other organizations that have done similar work</p>
<p>Reviewing strategic business decisions related to operations, customer service, marketing, financials, and more</p>
<p>Being a sounding board</p>
<p>Preventing problems, thereby avoiding expensive, time consuming or embarrassing actions</p>
<p>Supporting your growth past your limiting beliefs</p>
<p>Relationship development</p>
<p>Conflict resolution</p>
<p>Mentoring</p>
<p>Creating a team atmosphere</p>
<p><strong>3. Options</strong>:&nbsp;All coaching programs require a minimum of one year time invested.&nbsp;Coaching is a marathon, rather than a sprint!</p>
<p><strong>Platinum Service</strong>:&nbsp;Individual one-on-one coaching with the CEO, owner, or general manager.&nbsp;This package includes two coaching sessions per month, each session lasting approximately two hours.&nbsp;Sessions can be at your office, the coaches place of business, or a mutually agreed upon location.&nbsp;Phone coaching is also an option.&nbsp;Also included in this package is two full days of shadowing, facilitation of a two meetings of your choice (up to 2 hours each), and unlimited phone calls and emails.&nbsp;In addition, you or any of your employees will benefit from a 25% discount for any [CLIENT COMPANY NAME] workshops. Your investment/tuition for this service is $__________ for one year.</p>
<p><strong>Gold Service</strong>:&nbsp;Individual one-on-one coaching with the CEO, owner, or general manager.&nbsp;This package includes two coaching sessions per month, each session lasting approximately two hours.&nbsp;Sessions can be at your office, the coaches place of business, or a mutually agreed upon location.&nbsp;Phone coaching is also an option.&nbsp;Included in this package are unlimited phone calls and emails.&nbsp;In addition, you or any of your employees will benefit from a 25% discount for any [CLIENT COMPANY NAME] workshops. Your investment/tuition for this service is $____________ for one year.</p>
<p><strong>Bronze Service</strong>:&nbsp;Individual one-on-one coaching with the CEO, owner, or general manager.&nbsp;This package includes two coaching sessions per month, each session lasting approximately one hour.&nbsp;Sessions can be at your office, the coaches place of business, or a mutually agreed upon location.&nbsp;Phone coaching is also an option.&nbsp;Included in this package are unlimited 10 minute phone calls and emails.&nbsp;Your investment is $________ for one year.</p>
<p>Other coaching services available include, but are not limited to:&nbsp;Group Coaching, Sales Coaching, Couples Coaching, Business Partner Coaching, Youth Coaching, Relationship Coaching, Phone Coaching, and more.&nbsp;Your investment for these programs will be determined on a case by case basis.</p>
<p><strong>4. Terms</strong>:&nbsp;The initial face-to-face consultation is $_________ per hour, but can be credited back to your initial coaching agreement.&nbsp;Payments are to be made before services are provided, and as agreed upon.</p>
<p>We will always begin and end our sessions or calls on time, and if we are meeting by phone you will call me.&nbsp;If you need to reschedule, 24-hours advance notice is required or one-half of the coaching session is lost.&nbsp;If for some reason our coaches need to reschedule and do not do so with 24-hour notice, you will be credited with an additional one-half coaching session, at no additional charge.</p>
<p>Our coaching relationship is completely confidential.&nbsp;We will never share your identity or any information about you with any other person or organization without your expressed consent.&nbsp;In the unlikely event that there are concerns that need to be referred to another professional, I may be able to make that suggestion to you.</p>
<p>The term of our coaching agreement will be at least one year (12 months).&nbsp;Completing our coaching relationship is a mutual decision.&nbsp;While my retention percentage is very high, there may come a time when you determine that it is time to complete our coaching relationship.&nbsp;If and when that time comes, I expect that you will provide me at least 4 weeks&rsquo; notice.&nbsp;That will give us time to summarize your growth/learning and strategize your next steps.</p>
<p>Our services are unconditionally guaranteed.&nbsp;If at any time you feel that you are not getting the support, honesty, coaching, or training that you expect, then you need to tell me.&nbsp;</p>
<p><strong>5. Agreement&nbsp;of Services</strong>:</p>
<table class="MsoNormalTable" style="margin-left: 45.7pt; border-collapse: collapse; border: none; height: 199px; width: 85.3863%;" border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr style="height: 54.4px;">
<td style="width: 59.4981%; border: 1pt solid windowtext; padding: 0cm 5.4pt; height: 54.4px;" width="151">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">Name:</span></strong></p>
</td>
<td style="width: 40.447%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; height: 54.4px;" width="462">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">&nbsp;</span></strong></p>
</td>
</tr>
<tr style="height: 54.4px;">
<td style="width: 59.4981%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; height: 54.4px;" width="151">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">Phone:</span></strong></p>
</td>
<td style="width: 40.447%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 54.4px;" width="462">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">&nbsp;</span></strong></p>
</td>
</tr>
<tr style="height: 18.4px;">
<td style="width: 59.4981%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; height: 18.4px;" width="151">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">Email Address:</span></strong></p>
</td>
<td style="width: 40.447%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 18.4px;" width="462">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">&nbsp;</span></strong></p>
</td>
</tr>
<tr style="height: 54.4px;">
<td style="width: 59.4981%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; height: 54.4px;" width="151">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">Coaching Service Level:</span></strong></p>
</td>
<td style="width: 40.447%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 54.4px;" width="462">
<p class="MsoNormal"><strong style="mso-bidi-font-weight: normal;"><span lang="EN-US" style="font-size: 12.0pt; line-height: 115%;">&nbsp;</span></strong></p>
</td>
</tr>
</tbody>
</table>
<br/>
<p>I agree to contract the services of [YOUR COMPANY NAME]&nbsp;Coaching and Consulting Group, LLC, [YOUR&nbsp;NAME] or one of [HIS/HER] associates, to provide coaching services for the purpose of addressing my business and personal projects, objectives, and goals.&nbsp;I understand that the coaching relationship is based upon my agenda and this relationship is most effective when I communicate fully.&nbsp;If at any time I feel the coaching relationship is not working as desired, I agree to work toward re-designing the relationship.&nbsp;Also, I agree that [YOUR COMPANY NAME] Coaching and Consulting Group, LLC is free from any liability or actions that may be related to any comments or suggestions made by [YOUR NAME], or any of [HIS/HER] associates.</p>
<p>_____________________________________&nbsp;&nbsp;Signature (client)</p>
<p class="ql-align-right">_____________________________________&nbsp;&nbsp;Date</p>
<p>[YOUR COMPANY]</p>
<p>[YOUR CONTACT INFORMATION]</p>
<p>[YOUR COMPANY LOGO &ndash; not the certification logo]</p>
<p>&nbsp;</p>
<p>&nbsp;</p>`}
`;
