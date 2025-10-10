// src/components/atoms/Input.tsx
export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      className="flex-1 border border-gray-300 rounded px-2 py-1"
      {...props}
    />
  );
}
