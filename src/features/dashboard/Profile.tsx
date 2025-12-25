import React, { useState, useEffect } from "react";
import "./Profile.scss";
import ProfileDummy from "@/assets/profile.png";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Space } from "antd";
import { getClientProfile } from "@/app/store/slices/getClientProfileSlice";
import {
  ChangePasswordAPI,
  GetProfile,
  UserEditProfileAPI,
} from "@/utils/api/Api";
import { Image_URL } from "@/utils/constants/host";
import DescriptionAlerts from "@/utils/constants/alerts";
import Signin from "@/features/auth/Signin";

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  attachements?: Array<{
    file_name: string;
  }>;
}

interface AlertConfig {
  text: string;
  icon: "success" | "error" | "warning" | "info";
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [value, setValue] = useState<"edit" | "change_password">("edit");
  const [old_password, setOldPassword] = useState<string>("");
  const [new_password, setNewPassword] = useState<string>("");
  const [new_c_password, setNewCPassword] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    text: "",
    icon: "info",
  });
  const [isClient, setIsClient] = useState<boolean>(false);

  const storedValue = localStorage.getItem("UserLoginTokenApt");
  const UserStatus = localStorage.getItem("UserStatus");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Fetch profile details
  useEffect(() => {
    if (storedValue && UserStatus !== "DEACTIVATE") {
      GetProfile()
        .then((data) => {
          setProfile(data);
          setName(data?.name);
          setMobile(data?.mobile);
          form.setFieldsValue({
            name: data?.name,
            email: data?.email,
            phone: data?.mobile,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedValue, UserStatus, form]);

  // Load redux profile
  useEffect(() => {
    if (storedValue) {
      dispatch(getClientProfile(storedValue) as any);
    }
  }, [dispatch, storedValue]);

  const handleValueChangeEdit = () => setValue("edit");
  const handleValueChangePassword = () => setValue("change_password");

  const handlePhoneChange = (newPhone: string | undefined) =>
    setMobile(newPhone || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleAlertSubmit1 = () => {
    const missingFields: string[] = [];
    if (!old_password) missingFields.push("Old Password");
    if (!new_password) missingFields.push("New Password");
    if (!new_c_password) missingFields.push("Confirm Password");

    if (missingFields.length > 0) {
      setAlert(true);
      setAlertConfig({
        icon: "error",
        text: `Please fill in: ${missingFields.join(", ")}.`,
      });
      setTimeout(() => setAlert(false), 7000);
    } else {
      handleChangePassword();
    }
  };

  const handleCancel = () => {
    setNewPassword("");
    setNewCPassword("");
    setOldPassword("");
    form.resetFields();
  };

  // Update profile
  const handleSubmit = () => {
    setAlert(false);

    UserEditProfileAPI(name, selectedImage, mobile)
      .then((res) => {
        if (storedValue) {
          dispatch(getClientProfile(storedValue) as any);
        }
        setProfile(res.data);

        if (res.data?.code === 200 || res.data?.status === 200) {
          setAlert(true);
          setAlertConfig({
            text: "Profile Updated Successfully",
            icon: "success",
          });

          setTimeout(() => setAlert(false), 3000);
        }
      })
      .catch((error) => console.log(error));
  };

  // Change password
  const handleChangePassword = () => {
    ChangePasswordAPI({
      old_password,
      new_password,
      confirm_password: new_c_password,
    })
      .then((res) => {
        if (res.data?.code === 200 || res.data?.status === 200) {
          setAlert(true);
          setAlertConfig({
            text: "Password changed Successfully",
            icon: "success",
          });

          setTimeout(() => navigate("/signin"), 1000);
        }
      })
      .catch((error: any) => {
        setAlert(true);
        setAlertConfig({
          text: error.response?.data?.message || "Error changing password",
          icon: "error",
        });
      });
  };

  if (!isClient || !storedValue) return <Signin />;

  return (
    <>
      {alert && (
        <DescriptionAlerts text={alertConfig.text} icon={alertConfig.icon} />
      )}

      <div className="profile">
        <div className="profile-container">
          <div className="profile_inner">
            {/* Header */}
            <div className="section1">
              <div>
                {profile?.attachements?.length ? (
                  <img
                    src={`${Image_URL}${profile.attachements[0].file_name}`}
                    width={100}
                    height={100}
                    className="Picture"
                    alt="Profile"
                  />
                ) : (
                  <img
                    src={ProfileDummy}
                    width={100}
                    height={100}
                    className="Picture"
                    alt="Default Profile"
                  />
                )}
              </div>

              <div>
                <h5 style={{ textTransform: "capitalize" }}>{profile?.name}</h5>
                <h6>Set up your Automated Price Tool 2.0 account.</h6>
              </div>
            </div>

            {/* Tabs */}
            <div className="section2">
              <div className="btn_tab">
                <button
                  className="btn_theme_div"
                  style={{
                    backgroundColor: value === "edit" ? "#174F78" : "#f0f4f7",
                    color: value === "edit" ? "white" : "unset",
                  }}
                  onClick={handleValueChangeEdit}
                >
                  Edit
                </button>

                <button
                  className="btn_theme_div"
                  style={{
                    backgroundColor:
                      value === "change_password" ? "#174F78" : "#f0f4f7",
                    color: value === "change_password" ? "white" : "unset",
                  }}
                  onClick={handleValueChangePassword}
                >
                  Change Password
                </button>
              </div>

              <div className="line"></div>

              {/* Edit section */}
              <div className="Form_ctm">
                {value === "edit" ? (
                  <div>
                    <Form form={form} layout="vertical" autoComplete="off">
                      <div className="profiletop">
                        {selectedImage ? (
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            height="50"
                            width="50"
                            style={{ borderRadius: "50px" }}
                          />
                        ) : (
                          <img
                            src={ProfileDummy}
                            height="50"
                            width="50"
                            style={{ borderRadius: "100px" }}
                          />
                        )}

                        <label className="custom_file_upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          &nbsp; Add Profile picture
                        </label>
                      </div>

                      <Form.Item name="name" label="Name">
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Item>

                      <Space>
                        <Form.Item name="email" label="E-mail">
                          <Input disabled />
                        </Form.Item>

                        <Form.Item name="phone" label="Phone Number">
                          <PhoneInput
                            defaultCountry="US"
                            value={mobile}
                            onChange={handlePhoneChange}
                          />
                        </Form.Item>
                      </Space>
                    </Form>

                    <div className="buttons">
                      <button
                        className="button_theme buttonUpdate"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  // Password section
                  <div>
                    <Form layout="vertical" autoComplete="off">
                      <Form.Item
                        label="Old Password"
                        name="oldpassword"
                        rules={[{ required: true }]}
                      >
                        <Input.Password
                          value={old_password}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </Form.Item>

                      <Form.Item
                        label="New Password"
                        name="newpassword"
                        rules={[{ required: true }]}
                      >
                        <Input.Password
                          value={new_password}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </Form.Item>

                      <Form.Item
                        name="confirmpassword"
                        label="Confirm Password"
                        dependencies={["newpassword"]}
                        hasFeedback
                        rules={[
                          { required: true },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("newpassword") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Passwords do not match!")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          onChange={(e) => setNewCPassword(e.target.value)}
                        />
                      </Form.Item>
                    </Form>

                    <div className="buttons_passwordChange">
                      <button
                        className="button_theme buttonCancel"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>

                      <button
                        className="button_theme ChangePassword"
                        onClick={handleAlertSubmit1}
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
