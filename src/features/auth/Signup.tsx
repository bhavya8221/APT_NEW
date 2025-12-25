import { useEffect, useState } from "react";
import { Form, Input, Typography, Card, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { UserRegisterAPI } from "@/utils/api/Api";
import { Button } from "@/components/ui/Button";
import SignupImage from "@/assets/Automated_Pricing_Calc.jpg";

import "./Signup.scss";

const { Title } = Typography;

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const { email } = location.state || {};
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    if (!captchaValue) {
      message.error("Please verify you're not a robot.");
      return;
    }

    const payload = {
      name: values.username,
      email,
      business_name: values.business_name,
      mobile: values.usermobile,
      password: values.password,
      confirm_password: values.confirm,
      referred_by: values.referral_name || "",
      recaptcha_token: captchaValue,
    };

    try {
      setLoading(true);
      const res = await UserRegisterAPI(payload);
      message.success(res?.data?.message || "Registration successful!");
      navigate("/signin");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      form.setFieldValue("useremail", email);
    }
  }, [email, form]);

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src={SignupImage} alt="Signup Illustration" />
      </div>

      <div className="signup-right">
        <Card className="signup-card" bordered={false}>
          <Title level={2} className="signup-title">
            Create Your Account
          </Title>

          <Form
            form={form}
            name="signupForm"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Username */}
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter your name." }]}
            >
              <Input placeholder="Enter your name" size="large" />
            </Form.Item>

            {/* Email (auto-filled from prev screen) */}
            <Form.Item
              label="User Email"
              name="useremail"
              rules={[
                { required: true, message: "Email is required." },
                { type: "email", message: "Enter a valid email." },
              ]}
            >
              <Input disabled size="large" />
            </Form.Item>

            {/* Business Name */}
            <Form.Item
              label="Business Name"
              name="business_name"
              rules={[
                { required: true, message: "Business name is required." },
              ]}
            >
              <Input placeholder="Your business name" size="large" />
            </Form.Item>

            {/* Mobile */}
            <Form.Item
              label="Mobile Number"
              name="usermobile"
              rules={[
                { required: true, message: "Mobile number is required." },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit mobile number.",
                },
              ]}
            >
              <Input
                maxLength={10}
                inputMode="numeric"
                placeholder="10-digit mobile number"
                size="large"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please set a password." }]}
              hasFeedback
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password." },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Re-enter password" size="large" />
            </Form.Item>

            {/* Referral Name */}
            <Form.Item label="Referral Name (Optional)" name="referral_name">
              <Input placeholder="Who referred you?" size="large" />
            </Form.Item>

            {/* Recaptcha */}
            <div className="captcha-box">
              <ReCAPTCHA
                sitekey="6Ld0ws4rAAAAAG2zii0g8StwTUlo1hnq0sp8i5B4"
                onChange={(val) => setCaptchaValue(val)}
              />
            </div>

            <Button
              variant="default"
              size="lg"
              className="signup-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form>

          <p className="signin-link">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
