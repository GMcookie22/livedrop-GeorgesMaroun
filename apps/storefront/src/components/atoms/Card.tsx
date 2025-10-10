interface CardProps {
  children: React.ReactNode;
  variant?: "user" | "support";
}

export default function Card({ children, variant = "support" }: CardProps) {
  const base = "p-3 rounded-lg shadow-sm";
  const style =
    variant === "user"
      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white self-end max-w-xs"
      : "bg-white border border-gray-200 text-gray-900 self-start max-w-xs";

  return <div className={`${base} ${style}`}>{children}</div>;
}
