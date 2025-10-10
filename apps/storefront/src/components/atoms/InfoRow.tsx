interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

export default function InfoRow({
  label,
  value,
  valueClassName,
}: InfoRowProps) {
  return (
    <p>
      <span className="font-semibold">{label}:</span>{" "}
      <span className={valueClassName}>{value}</span>
    </p>
  );
}
