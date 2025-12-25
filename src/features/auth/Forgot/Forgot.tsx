// ForgotPasswordComponent.tsx
import { useState } from "react";
import { Card, Steps, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

import ForgotSendOtp from "./ForgotSendOtp";
import ChangePassword from "./ChangePassword";

import "./Forgot.scss";

const { Title } = Typography;

export default function ForgotPasswordComponent() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const steps = [{ title: "Send OTP" }, { title: "Reset Password" }];

  const onOtpSent = (sentEmail: string) => {
    setEmail(sentEmail);
    setActiveStep(1);
  };

  const onPasswordReset = () => {
    // After successful password reset, navigate to signin
    navigate("/signin");
  };

  return (
    <div className="forgot-container">
      <Card className="forgot-card" bordered={false}>
        <Title className="forgot-title" level={3}>
          {activeStep === 0 ? "Forgot Password" : "Reset Password"}
        </Title>

        <Steps current={activeStep} size="small" className="forgot-steps">
          {steps.map((s) => (
            <Steps.Step key={s.title} title={s.title} />
          ))}
        </Steps>

        <div className="forgot-form">
          {activeStep === 0 && <ForgotSendOtp onOtpSent={onOtpSent} />}

          {activeStep === 1 && (
            <ChangePassword email={email} onSuccess={onPasswordReset} />
          )}

          <div className="helper-link" style={{ marginTop: 12 }}>
            <span>
              Remembered your password?{" "}
              <Link to="/signin" className="signin-link-text">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
