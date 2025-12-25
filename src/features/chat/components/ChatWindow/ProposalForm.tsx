import React from "react";
import { Form, Input, Button } from "antd";

interface ProposalFormProps {
  onSubmit: (data: any) => void;
  selectedProposal: {
    id?: string | number;
    chats?: {
      id: string;
      sender: "user" | "bot";
      text: string | null;
    }[];
  } | null;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  onSubmit,
  selectedProposal,
}) => {
  const [form] = Form.useForm();

  // Pick the LAST bot message (correct for new ChatWindow)
  const lastBotMessage = selectedProposal?.chats
    ?.filter((m) => m.sender === "bot")
    ?.pop();

  const handleSubmit = (values: any) => {
    const proposalData = {
      proposalContent: lastBotMessage?.text || "",
      conversation_id: selectedProposal?.id || "",
      message_id: lastBotMessage?.id || "",
      preparedBy: {
        name: values.preparedByName,
        org: values.preparedByOrg,
        contact: values.preparedByContact,
      },
    };

    onSubmit(proposalData);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Prepared By — Name */}
      <Form.Item
        label="Your Name"
        name="preparedByName"
        rules={[{ required: true, message: "Prepared by name is required" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>

      {/* Prepared By — Org */}
      <Form.Item
        label="Your Organization Name"
        name="preparedByOrg"
        rules={[{ required: true, message: "Organization is required" }]}
      >
        <Input placeholder="Organization" />
      </Form.Item>

      {/* Prepared By — Contact */}
      <Form.Item
        label="Your Contact Number"
        name="preparedByContact"
        rules={[
          { required: true, message: "Contact is required" },
          {
            pattern: /^[0-9]{10}$/,
            message: "Please enter a valid 10-digit contact number",
          },
        ]}
      >
        <Input placeholder="Contact" maxLength={10} />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="button_theme">
          Save Proposal
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProposalForm;
