// hello world
import React from "react";

interface SubmitButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
}

export function SubmitButton({
  label,
  onClick,
  disabled = false,
  type = "submit",
}: SubmitButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
