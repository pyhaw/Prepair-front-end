"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Settings } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Append user's message
    setChatHistory((prev) => [...prev, { sender: "user", text: input }]);
    const currentInput = input; // Save the current input
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();

      // Hide typing indicator and append chatbot's reply
      setIsTyping(false);
      setChatHistory((prev) => [
        ...prev,
        { sender: "chatbot", text: data.reply || "Sorry, no response." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setChatHistory((prev) => [
        ...prev,
        { sender: "chatbot", text: "There was an error. Please try again." },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // Added mt-32 to offset the fixed navbar height
    <div className="max-w-2xl mx-auto mt-32 rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="mr-2" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-white">
              Home Repair Assistant
            </h2>
            <p className="text-green-50 text-sm">
              Ask me anything about home repairs
            </p>
          </div>
        </div>
        {/* Extra icon added for settings */}
        <button className="text-green-50 hover:text-white transition">
          <Settings size={24} />
        </button>
      </div>

      {/* Chat container */}
      <div
        ref={chatContainerRef}
        className="p-4 h-96 overflow-y-auto bg-gray-50 flex flex-col space-y-4"
      >
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-400 mt-4">
            <Bot size={48} className="mx-auto mb-2 text-green-400" />
            <p>How can I help with your home repair needs today?</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl flex items-center space-x-2
                  ${
                    msg.sender === "user"
                      ? "bg-green-500 text-white rounded-tr-none"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"
                  }`}
              >
                {msg.sender === "chatbot" && (
                  <Bot size={20} className="mt-1 text-green-500" />
                )}
                {/* Render message text as Markdown */}
                <div className="break-words">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.sender === "user" && (
                  <User size={20} className="mt-1 text-white" />
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center space-x-2">
              <Bot size={20} className="text-green-500" />
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="flex-grow py-3 px-4 bg-gray-50 border border-gray-200 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-full ${
              input.trim()
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 text-gray-400"
            } transition-colors duration-200`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
