import React, { forwardRef } from "react";
import clsx from "clsx";
import "./Button.scss";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "default", size = "default", className, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "apt-button",
          `apt-button--${variant}`,
          `apt-button--${size}`,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
