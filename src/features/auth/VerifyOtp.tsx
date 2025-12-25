import { useEffect, useState } from "react";
import { Form, Button, message } from "antd";
import OTPInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { SendOTPAPI, VerifyOtpAPI } from "@/utils/api/Api";

import "./VerifyOtp.scss";

interface OtpFormData {
  email: string;
  otp: string;
}

interface VerifyOtpProps {
  formData?: OtpFormData;
  setFormData?: React.Dispatch<React.SetStateAction<OtpFormData>>;
}

export default function VerifyOtp(props: VerifyOtpProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine mode (step mode vs standalone)
  const isStepMode = !!props.formData;

  const stepEmail = props.formData?.email ?? "";
  const standaloneEmail = location.state?.email ?? "";

  const email = isStepMode ? stepEmail : standaloneEmail;

  const [otp, setOtp] = useState(isStepMode ? props.formData!.otp : "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // keep OTP synced with step mode
  useEffect(() => {
    if (isStepMode && props.setFormData) {
      props.setFormData((prev) => ({ ...prev, otp }));
    }
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 4) {
      return message.error("Please enter a valid 4-digit OTP.");
    }

    try {
      setLoading(true);
      const res = await VerifyOtpAPI(email, otp);
      message.success(res?.data?.message || "OTP Verified!");

      if (isStepMode) {
        // OtpStep version → parent decides next step
        return;
      } else {
        // Standalone version → navigate forward
        navigate("/sign-up-details", { state: { email } });
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const res = await SendOTPAPI(email);
      message.success(res?.data?.message || "OTP resent successfully!");
    } catch (err) {
      message.error("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="VerifyOtp">
      <div className="verify-card">
        <h1>Verify OTP</h1>

        <p className="subtext">
          OTP has been sent to <strong>{email}</strong>
        </p>

        <Form layout="vertical" onFinish={handleVerify}>
          <Form.Item label="Enter OTP" required>
            <OTPInput
              value={otp}
              onChange={(value: string) => setOtp(value)}
              numInputs={4}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "3rem",
                height: "3rem",
                fontSize: "1.4rem",
                borderRadius: "8px",
                border: "2px solid #39a1dd",
                background: "#f7f9fc",
                color: "#10313B",
                margin: "0 0.4rem",
              }}
              renderSeparator={<span />}
            />
          </Form.Item>

          {!isStepMode && (
            <p className="resend" onClick={handleResend}>
              {resending ? "Resending..." : "Resend OTP"}
            </p>
          )}

          {!isStepMode && (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="verify-btn"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
}
