import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

interface AlertProps {
  text: string;
  icon: "success" | "error" | "warning" | "info" | "question";
  onClose?: () => void;
}

/**
 * A one-shot SweetAlert popup that triggers only once,
 * even if props change or parent re-renders.
 */
export default function DescriptionAlerts({ text, icon, onClose }: AlertProps) {
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return; // prevent re-triggering
    shownRef.current = true;

    Swal.fire({
      text,
      icon,
      confirmButtonText: "Ok",
      heightAuto: false,
    }).then(() => {
      if (onClose) onClose();
    });
  }, []);

  return null;
}
