import { useState } from "react";
import { Card, Steps, Typography, Modal, message, Flex } from "antd";
import { Link } from "react-router-dom";

import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
import CreateAccount from "./CreateAccount";

import { SendOTPAPI, VerifyOtpAPI } from "@/utils/api/Api";
import "./OtpStep.scss";

const { Title, Paragraph } = Typography;

export default function OtpStep() {
  const steps = ["Send OTP", "Verify OTP", "Create Account"];

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [key: number]: boolean }>({});
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const totalSteps = steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps;

  // Equivalent next-step logic from original file
  const handleNext = () => {
    const nextStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((_, i) => !(i in completed))
        : activeStep + 1;

    setActiveStep(nextStep);
  };

  // Equivalent send OTP logic
  const handleSendOTP = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return message.error(
        "Invalid email. Please enter a valid email address."
      );
    }

    try {
      await SendOTPAPI(formData.email);
      Modal.success({
        title: "OTP Sent",
        content: "OTP has been sent to your email.",
      });

      setTimeout(() => {
        setCompleted((prev) => ({ ...prev, [activeStep]: true }));
        handleNext();
      }, 1200);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to send OTP.");
    }
  };

  // Equivalent verify OTP logic
  const handleVerifyOTP = async () => {
    if (formData.otp.length !== 4) {
      return message.error("Please enter a valid 4-digit OTP.");
    }

    try {
      await VerifyOtpAPI(formData.email, formData.otp);

      Modal.success({
        title: "OTP Verified",
        content: "OTP verified successfully. Continue creating your account.",
      });

      setTimeout(() => {
        setCompleted((prev) => ({ ...prev, [activeStep]: true }));
        handleNext();
      }, 1200);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "OTP verification failed.");
    }
  };

  // Equivalent dynamic button selection (Send OTP / Verify OTP)
  const renderActionButton = () => {
    if (completedSteps() === totalSteps - 3) {
      return (
        <button
          className="otp-btn"
          disabled={!formData.email}
          onClick={handleSendOTP}
        >
          Send OTP
        </button>
      );
    }

    if (completedSteps() === totalSteps - 2) {
      return (
        <button
          className="otp-btn"
          disabled={!formData.otp}
          onClick={handleVerifyOTP}
        >
          Verify OTP
        </button>
      );
    }

    return null;
  };

  return (
    <div className="otp-step-page">
      <Card className="otp-card" bordered={false}>
        <Title level={3} className="otp-title">
          Signup
        </Title>

        <Steps
          current={activeStep}
          items={[
            { title: "Send OTP" },
            { title: "Verify OTP" },
            { title: "Create Account" },
          ]}
          className="otp-steps"
        />

        <div className="otp-content">
          {activeStep === 0 && (
            <SendOtp formData={formData} setFormData={setFormData} />
          )}

          {activeStep === 1 && (
            <VerifyOtp formData={formData} setFormData={setFormData} />
          )}

          {activeStep === 2 && (
            <CreateAccount formData={formData} setFormData={setFormData} />
          )}
        </div>

        {activeStep < 2 && (
          <Flex justify="center" className="otp-actions">
            {renderActionButton()}
          </Flex>
        )}

        <Paragraph className="signin-link">
          Already have an account?
          <Link to="/signin" className="signin-link-text">
            {" "}
            Sign in
          </Link>
        </Paragraph>
      </Card>
    </div>
  );
}
