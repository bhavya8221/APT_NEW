// ForgotSendOtp.tsx
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { ForgetSendOTPAPI } from "@/utils/api/Api";
import "./Forgot.scss";

interface Props {
  onOtpSent: (email: string) => void;
}

export default function ForgotSendOtp({ onOtpSent }: Props) {
  const [loading, setLoading] = useState(false);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const onFinish = async (values: { email: string }) => {
    const { email } = values;
    if (!validateEmail(email)) {
      message.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await ForgetSendOTPAPI(email);
      message.success(res?.data?.message || "OTP sent successfully!");
      onOtpSent(email);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-sendotp">
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ email: "" }}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: "Email is required." },
            { type: "email", message: "Please enter a valid email." },
          ]}
        >
          <Input placeholder="Enter your registered email" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="btn-theme"
            block
            size="large"
          >
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
