export default function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-xs bg-gray-200 px-2 py-0.5 rounded-full ${className}`}
    >
      {children}
    </span>
  );
}
