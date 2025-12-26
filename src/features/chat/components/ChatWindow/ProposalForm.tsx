import React from "react";
import { Form, Input, Button } from "antd";

/* TYPES */
interface PreparedBy {
  name: string;
  org: string;
  contact: string;
}

interface ProposalFormValues {
  preparedByName: string;
  preparedByOrg: string;
  preparedByContact: string;
}

interface ChatMessage {
  id: string;
  message?: string;
  conversation_id?: string | number;
}

interface SelectedProposal {
  chats?: ChatMessage[];
}

interface ProposalFormProps {
  onSubmit: (data: any) => void;
  selectedProposal?: SelectedProposal | null;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  onSubmit,
  selectedProposal,
}) => {
  const [form] = Form.useForm<ProposalFormValues>();

  const handleSubmit = (values: ProposalFormValues) => {
    const proposalData = {
      proposalContent: selectedProposal?.chats?.[0]?.message || "",
      conversation_id: selectedProposal?.chats?.[0]?.conversation_id,
      message_id: selectedProposal?.chats?.[0]?.id,
      preparedBy: {
        name: values.preparedByName,
        org: values.preparedByOrg,
        contact: values.preparedByContact,
      } as PreparedBy,
    };

    onSubmit(proposalData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      {/* Prepared By Section */}
      <Form.Item
        label="Your Name"
        name="preparedByName"
        rules={[{ required: true, message: "Prepared by name is required" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item
        label="Your Organization Name"
        name="preparedByOrg"
        rules={[{ required: true, message: "Organization is required" }]}
      >
        <Input placeholder="Organization" />
      </Form.Item>

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

      {/* Save Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Proposal
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProposalForm;
