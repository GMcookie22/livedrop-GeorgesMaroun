import { useState } from "react";
import { findAnswer } from "../../assistant/engine";
import Card from "../atoms/Card";
import ChatInput from "../molecules/ChatInput";

export default function HelpPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { id?: string; text: string; role?: "user" | "support" }[]
  >([]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const reply = findAnswer(trimmed);

    setChatHistory((prev) => [
      ...prev,
      { text: trimmed, role: "user" },
      { text: reply.text, id: reply.qid, role: "support" },
    ]);
    setMessage("");
  };

  return (
    <>
      {/* Floating button (visible only when panel is hidden) */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 transition-all"
        >
          Help
        </button>
      )}

      {/* Chat overlay */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <div className="w-80 bg-white h-full flex flex-col p-4 shadow-2xl">
            {/* Header */}
            <header className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Support Chat</h2>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ×
              </button>
            </header>

            {/* Chat messages */}
            <section className="flex-1 overflow-y-auto flex flex-col gap-2 mb-3">
              {chatHistory.map((msg, i) => (
                <Card key={i} variant={msg.role}>
                  {msg.id ? `[${msg.id}] ${msg.text}` : msg.text}
                </Card>
              ))}
            </section>

            {/* Message input */}
            <ChatInput value={message} onChange={setMessage} onSubmit={handleSend} />
          </div>
        </div>
      )}
    </>
  );
}
