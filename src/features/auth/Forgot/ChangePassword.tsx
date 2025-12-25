// ChangePassword.tsx
import { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import { ForgotPassword } from "@/utils/api/Api";
import OTPInput from "react-otp-input";
import "./Forgot.scss";

interface Props {
  email: string;
  onSuccess: () => void;
}

export default function ChangePassword({ email, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values: { password: string; confirm: string }) => {
    if (otp.length !== 4) {
      return message.error("Please enter a valid 4-digit OTP.");
    }
    if (values.password !== values.confirm) {
      return message.error("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await ForgotPassword(
        email,
        parseInt(otp, 10),
        values.password,
        values.confirm
      );
      Modal.success({
        title: "Password reset",
        content:
          res?.data?.message || "Your password has been reset successfully.",
      });
      onSuccess();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item label="Email">
          <Input value={email} disabled />
        </Form.Item>

        <Form.Item label="Enter OTP" required>
          <OTPInput
            value={otp}
            onChange={(val: string) => setOtp(val)}
            numInputs={4}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: "3rem",
              height: "3rem",
              fontSize: "1.2rem",
              borderRadius: 8,
              border: "2px solid var(--accent)",
              background: "#f7f9fc",
              margin: "0 0.4rem",
            }}
            renderSeparator={<span />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="New password"
          rules={[{ required: true, message: "Please enter a new password." }]}
          hasFeedback
        >
          <Input.Password placeholder="New password" size="large" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match."));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" size="large" />
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
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
