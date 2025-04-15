"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

export default function ChatRoom({ currentUserId, username, selectedUser }) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [targetProfilePicture, setTargetProfilePicture] = useState(null);
  const [targetUserId, setTargetUserId] = useState(selectedUser?.id);
  const [targetUsername, setTargetUsername] = useState(selectedUser?.name);
  const [targetAvatar, setTargetAvatar] = useState(selectedUser?.avatar);

  const messagesEndRef = useRef(null);

  const roomId = [currentUserId, targetUserId].sort().join("-");

  useEffect(() => {
    socket.emit("join_room", roomId);

    const handleReceive = (data) => {
      console.log("📥 Received socket message:", data);
      setMessages((prev) => [
        ...prev,
        {
          senderId: data.senderId,
          recipientId: data.recipientId,
          message: data.message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      scrollToBottom();
    };

    const fetchTargetProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/userProfile/${targetUserId}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log("🧠 Fetched target profile:", data); // ← Add thi
          setTargetProfilePicture(data.profilePicture || null);
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("chatMessageSent"));
        }
      } catch (err) {
        console.error("Failed to fetch target profile picture:", err);
      }
    };

    const handleTyping = (data) => {
      if (data.senderId === targetUserId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });
    socket.on("receive_message", handleReceive);
    socket.on("user_typing", handleTyping);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("user_typing", handleTyping);
    };
  }, [roomId, targetUserId]);

  useEffect(() => {
    setTargetUserId(selectedUser?.id)
    setTargetAvatar(selectedUser?.avatar)
    setTargetUsername(selectedUser?.name)
    console.log(selectedUser)
  }, [selectedUser])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/chat/chat-history/${roomId}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const formatted = data.map((msg) => ({
            senderId: msg.sender_id,
            recipientId: msg.recipient_id,
            message: msg.message,
            time: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: new Date(msg.created_at),
          }));
          setMessages(formatted);
          scrollToBottom();
        }
      } catch (err) {
        console.error("❌ Failed to load chat history:", err);
      }
    };

    fetchHistory();
  }, [roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      room: roomId,
      author: username,
      senderId: currentUserId,
      recipientId: targetUserId,
      message: message.trim(),
    };

    socket.emit("send_message", msgData);
    setMessage("");
    scrollToBottom();
    window.dispatchEvent(new Event("chatMessageSent"));
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", {
      room: roomId,
      senderId: currentUserId,
      recipientId: targetUserId,
    });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const dateStr = new Date(msg.timestamp).toLocaleDateString();
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-orange-500 text-white flex items-center justify-center font-semibold">
          {targetAvatar?.startsWith("http") ? (
            <img
              src={targetAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{targetAvatar || targetUsername?.charAt(0)}</span>
          )}
        </div>
        <div>
          <h2 className="font-medium text-black">
            {targetUsername || `User ${targetUserId}`}
          </h2>
          <p className="text-xs text-green-600">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex justify-center my-3">
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {msgs.map((msg, idx) => {
              const isSender = msg.senderId === currentUserId;
              return (
                <div
                  key={idx}
                  className={`mb-4 flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-xs lg:max-w-md">
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isSender
                          ? "bg-orange-600 text-white rounded-br-none"
                          : "bg-gray-500 text-white rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isSender ? "text-right" : "text-left"
                      } text-gray-700`}
                    >
                      {msg.time}
                      {isSender && <span className="ml-1">✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center text-sm text-gray-700 my-2">
            <div className="typing-animation mr-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
            typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-orange-600 border-t border-orange-400">
        <div className="flex">
          <input
            value={message}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-white rounded-l-lg px-4 py-3 text-black outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`px-6 rounded-r-lg ${
              message.trim()
                ? "bg-orange-600 hover:bg-orange-500"
                : "bg-orange-400 cursor-not-allowed"
            } text-white transition`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
