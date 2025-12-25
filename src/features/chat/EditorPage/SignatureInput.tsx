import React, { useRef } from "react";
import { Button, Space, Modal } from "antd";
import SignaturePad from "react-signature-canvas";
import "./SignatureInput.scss";

export interface SignatureInputProps {
  label?: string;
  imageURL?: string | null;
  isOpen: boolean;
  onOpenModal: () => void;
  onCancel: () => void;
  onSave: (img: string) => void;
  onClear: () => void;
}

const SignatureInput: React.FC<SignatureInputProps> = ({
  label = "Add Signature",
  imageURL,
  isOpen,
  onOpenModal,
  onCancel,
  onSave,
  onClear,
}) => {
  const sigCanvasRef = useRef<SignaturePad | null>(null);

  const handleSave = () => {
    if (sigCanvasRef.current) {
      const trimmed = sigCanvasRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      onSave(trimmed);
    }
  };

  const handleClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      onClear();
    }
  };

  return (
    <>
      <Button type="primary" onClick={onOpenModal} className="button_theme">
        {label}
      </Button>

      {imageURL && (
        <div className="signature-preview">
          <img src={imageURL} alt="Signature" className="signature-image" />
        </div>
      )}

      <Modal
        title="Sign Here"
        open={isOpen}
        onCancel={onCancel}
        footer={null}
        className="signature-modal"
      >
        <div className="signature-pad-container">
          <SignaturePad
            ref={sigCanvasRef}
            canvasProps={{
              className: "signature-canvas",
              width: 400,
              height: 120,
            }}
          />
        </div>

        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleSave} className="button_theme">
            Save Signature
          </Button>

          <Button danger onClick={handleClear}>
            Clear
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default SignatureInput;
