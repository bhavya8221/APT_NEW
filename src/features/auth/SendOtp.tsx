import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { SendOTPAPI } from "@/utils/api/Api";
import "./SendOtp.scss";

interface OtpFormData {
  email: string;
  otp: string;
}

interface SendOtpProps {
  formData?: OtpFormData;
  setFormData?: React.Dispatch<React.SetStateAction<OtpFormData>>;
}

export default function SendOtp(props: SendOtpProps) {
  const navigate = useNavigate();

  // Determine mode
  const isStepMode = !!props.formData;

  // Email comes from either props (step) or internal state (standalone)
  const [email, setEmail] = useState<string>(
    isStepMode ? props.formData!.email : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep OtpStep parent state updated
  useEffect(() => {
    if (isStepMode && props.setFormData) {
      props.setFormData((prev) => ({ ...prev, email }));
    }
  }, [email]);

  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    try {
      setLoading(true);
      const res = await SendOTPAPI(email);
      message.success(res?.data?.message || "OTP sent successfully!");

      if (isStepMode) {
        // OtpStep will handle moving to next step
        return;
      } else {
        navigate("/verifyotp", { state: { email } });
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SendOtp">
      <div className="sendotp-card">
        <h1>Create Your Account</h1>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email Address"
            validateStatus={error ? "error" : ""}
            help={error}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          {!isStepMode && (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="sendotp-btn"
              size="large"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          )}
        </Form>

        {!isStepMode && (
          <p className="signin-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/signin")}>Sign in</span>
          </p>
        )}
      </div>
    </div>
  );
}
