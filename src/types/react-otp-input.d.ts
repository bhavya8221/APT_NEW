declare module "react-otp-input" {
  import * as React from "react";

  export interface OTPInputProps {
    value: string;
    numInputs: number;
    onChange: (otp: string) => void;
    isDisabled?: boolean;
    placeholder?: string;
    separator?: string | JSX.Element;
    shouldAutoFocus?: boolean;
    inputType?: string;
    inputStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    renderInput?: (props: any) => JSX.Element; // make OPTIONAL
    renderSeparator?: JSX.Element | null;
    skipDefaultStyles?: boolean;
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  }

  const OTPInput: React.FC<OTPInputProps>;

  export default OTPInput;
}
