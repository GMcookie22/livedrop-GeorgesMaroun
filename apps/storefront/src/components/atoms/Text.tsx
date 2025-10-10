// src/components/atoms/Text.tsx
interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Text({
  children,
  className = "",
  ...props
}: TextProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
