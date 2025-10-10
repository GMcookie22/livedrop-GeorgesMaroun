// src/components/molecules/ChatInput.tsx
import Input from "../atoms/Input";
import Button from "../atoms/Button";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your question..."
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
