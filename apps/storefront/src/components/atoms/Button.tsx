import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  let style = "";

  switch (variant) {
    case "primary":
      style =
        "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg";
      break;
    case "secondary":
      style =
        "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow";
      break;
    case "danger":
      style =
        "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow";
      break;
  }

  return (
    <button className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
}
