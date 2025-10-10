interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200 shadow-sm">
      {children}
    </span>
  );
}
