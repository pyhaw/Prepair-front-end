"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Send, Loader2 } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        const botMessage = { sender: "chatbot", message: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("No reply received");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "chatbot", message: "⚠️ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="pt-40 px-4 md:px-8 bg-orange-50 min-h-screen flex justify-center items-start">
      <Card className="w-full max-w-3xl border border-orange-200 shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-orange-700 flex items-center gap-2">
            🛠️ Ask Our Home Repair Expert
          </h2>

          <div className="h-[500px] overflow-y-auto bg-white border border-orange-100 rounded-md p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx} // ✅ Add this line
                className={`w-fit max-w-sm px-4 py-3 rounded-2xl break-words whitespace-pre-wrap text-sm
      ${
        msg.sender === "user"
          ? "bg-orange-500 text-white rounded-tr-none ml-auto"
          : "bg-orange-50 text-gray-800 border border-orange-200 rounded-tl-none mr-auto"
      }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="whitespace-pre-wrap text-sm" {...props} />
                    ),
                  }}
                >
                  {msg.message}
                </ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-orange-500 text-sm">
                <Loader2 className="animate-spin w-4 h-4" />
                Generating response...
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Describe your issue (e.g., leaking pipe)…"
              className="flex-1 min-h-[50px] max-h-[120px] resize-none"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="shrink-0"
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
