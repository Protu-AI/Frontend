import React, { useState } from "react";
import SettingsSection from "@/components/Settings/SettingsSection";
import SettingsHeading from "./SettingsHeading";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const AccountSecurity: React.FC = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordFocus, setCurrentPasswordFocus] = useState(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);
  const [updatePasswordFocus, setUpdatePasswordFocus] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const labelStyle = {
    color: "#A6B5BB",
    fontFamily: "Archivo",
    fontWeight: "400",
    fontSize: "18px",
    textAlign: "left",
    marginBottom: "8px",
  };

  const valueStyle = {
    color: "#0E1117",
    fontFamily: "Archivo",
    fontWeight: 600,
    fontSize: "22px",
    textAlign: "left",
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  // Input container styling with dynamic border color
  const inputContainerStyle = (isFocused: boolean) =>
    `flex items-center gap-7 px-7 py-7 rounded-[24px] border border-[#A6B5BB] shadow-[0_3px_6px_rgba(0,0,0,0.16)]`;

  // Input text styling (made !important to override defaults)
  const inputTextStyle =
    "text-[#A6B5BB] font-Archivo font-normal text-[16px] text-left !p-0 !m-0 !border-0 !shadow-none !ring-0 w-full";

  const validateCurrentPassword = () => {
    let isValid = true;
    let errorMessage = "";

    if (!currentPassword) {
      errorMessage = "Current password is required";
      isValid = false;
    } else if (currentPassword.length < 8) {
      errorMessage = "Current password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(currentPassword)) {
      errorMessage =
        "Current password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(currentPassword)) {
      errorMessage =
        "Current password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(currentPassword)) {
      errorMessage = "Current password must contain at least one number";
      isValid = false;
    } else if (!/[!@#$%^&*]/.test(currentPassword)) {
      errorMessage =
        "Current password must contain at least one special character";
      isValid = false;
    }

    setCurrentPasswordError(errorMessage);
    return isValid;
  };

  const validateNewPassword = () => {
    let isValid = true;
    let errorMessage = "";

    if (!newPassword) {
      errorMessage = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      errorMessage = "New password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
      errorMessage = "New password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(newPassword)) {
      errorMessage = "New password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(newPassword)) {
      errorMessage = "New password must contain at least one number";
      isValid = false;
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      errorMessage = "New password must contain at least one special character";
      isValid = false;
    }

    setNewPasswordError(errorMessage);
    return isValid;
  };

  const validateConfirmNewPassword = () => {
    if (!confirmNewPassword) {
      setConfirmNewPasswordError("Confirm new password is required");
      return false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("Passwords do not match");
      return false;
    }
    setConfirmNewPasswordError("");
    return true;
  };

  const handleUpdatePassword = () => {
    const isCurrentPasswordValid = validateCurrentPassword();
    const isNewPasswordValid = validateNewPassword();
    const isConfirmNewPasswordValid = validateConfirmNewPassword();

    if (
      isCurrentPasswordValid &&
      isNewPasswordValid &&
      isConfirmNewPasswordValid
    ) {
      // Perform update password logic here
      alert("Password updated successfully!");
    }
  };

  const isFormValid =
    !currentPasswordError &&
    !newPasswordError &&
    !confirmNewPasswordError &&
    currentPassword &&
    newPassword &&
    confirmNewPassword;

  return (
    <>
      <SettingsHeading>
        {isChangingPassword ? "Change Password" : "Password and security"}
      </SettingsHeading>

      {isChangingPassword ? (
        <SettingsSection>
          <div className="space-y-[32px]">
            {/* Current Password Input */}
            <div
              className={inputContainerStyle(currentPasswordFocus)}
              style={{
                borderColor: currentPasswordFocus ? "#5F24E0" : undefined,
              }}
            >
              <Lock className="h-[28px] w-[28px] text-[#A6B5BB]" />
              <div className="h-[28px] w-[1px] bg-[#A6B5BB]" />
              <Input
                type="password"
                placeholder="Current Password"
                className={inputTextStyle}
                onFocus={() => setCurrentPasswordFocus(true)}
                onBlur={() => setCurrentPasswordFocus(false)}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  validateCurrentPassword();
                }}
              />
            </div>
            {currentPasswordError && (
              <div className="text-red-500 mt-4" style={{ marginTop: "16px" }}>
                {currentPasswordError}
              </div>
            )}

            {/* New Password Input */}
            <div
              className={inputContainerStyle(newPasswordFocus)}
              style={{ borderColor: newPasswordFocus ? "#5F24E0" : undefined }}
            >
              <Lock className="h-[28px] w-[28px] text-[#A6B5BB]" />
              <div className="h-[28px] w-[1px] bg-[#A6B5BB]" />
              <Input
                type="password"
                placeholder="New Password"
                className={inputTextStyle}
                onFocus={() => setNewPasswordFocus(true)}
                onBlur={() => setNewPasswordFocus(false)}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validateNewPassword();
                }}
              />
            </div>
            {newPasswordError && (
              <div className="text-red-500 mt-4" style={{ marginTop: "16px" }}>
                {newPasswordError}
              </div>
            )}

            {/* Confirm New Password Input */}
            <div
              className={inputContainerStyle(updatePasswordFocus)}
              style={{
                borderColor: updatePasswordFocus ? "#5F24E0" : undefined,
              }}
            >
              <Lock className="h-[28px] w-[28px] text-[#A6B5BB]" />
              <div className="h-[28px] w-[1px] bg-[#A6B5BB]" />
              <Input
                type="password"
                placeholder="Update Password"
                className={inputTextStyle}
                onFocus={() => setUpdatePasswordFocus(true)}
                onBlur={() => setUpdatePasswordFocus(false)}
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  validateConfirmNewPassword();
                }}
              />
            </div>
            {confirmNewPasswordError && (
              <div className="text-red-500 mt-4" style={{ marginTop: "16px" }}>
                {confirmNewPasswordError}
              </div>
            )}

            <div className="flex items-center gap-[32px]">
              {/* Update Button - Use the new 'xl' size variant */}
              <Button
                size="xl"
                className="bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-Archivo font-semibold text-[22px] text-center rounded-[24px] py-[24px] px-[64px]"
                onClick={handleUpdatePassword}
              >
                Update
              </Button>
              {/* Cancel Button - Removed Hover Underline and padding */}
              <Button
                variant="link"
                className="text-[#5F24E0] hover:text-[#9F7CEC] font-Archivo font-semibold text-[22px] !p-0 no-underline hover:no-underline"
                onClick={toggleChangePassword}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SettingsSection>
      ) : (
        <>
          <SettingsSection>
            <div style={{ marginBottom: "32px" }}>
              <div style={labelStyle}>Email address</div>
              <div style={valueStyle}>mahmoudelkholy@protu.com</div>
            </div>

            <div>
              <div style={labelStyle}>Protu password</div>
              <div className="flex items-center">
                <div style={valueStyle}>You've set an Protu password&nbsp;</div>
                <span
                  className="font-Archivo font-semibold text-[22px] text-[#5F24E0] hover:text-[#9F7CEC] cursor-pointer text-center"
                  onClick={toggleChangePassword}
                >
                  &nbsp;Change password
                </span>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection>
            <SettingsHeading>Two-step verification</SettingsHeading>
            <div style={{ marginBottom: "32px" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={valueStyle}>SMS</div>
                  <div
                    className="text-[#A6B5BB] font-Archivo text-[18px]"
                    style={{ marginTop: "8px" }}
                  >
                    Receive verification codes via SMS
                  </div>
                </div>
                <Switch id="sms-switch" />
              </div>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={valueStyle}>Authenticator App</div>
                  <div
                    className="text-[#A6B5BB] font-Archivo text-[18px]"
                    style={{ marginTop: "8px" }}
                  >
                    Use an authenticator app for verification
                  </div>
                </div>
                <Switch id="auth-app-switch" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div style={valueStyle}>Security Key</div>
                  <div
                    className="text-[#A6B5BB] font-Archivo text-[18px]"
                    style={{ marginTop: "8px" }}
                  >
                    Use a security key for verification
                  </div>
                </div>
                <Switch id="security-key-switch" />
              </div>
            </div>
          </SettingsSection>
        </>
      )}
    </>
  );
};

export default AccountSecurity;
