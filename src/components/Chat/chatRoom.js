"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

export default function ChatRoom({ currentUserId, username, selectedUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [targetUserId, setTargetUserId] = useState(selectedUser?.id);
  const [targetUsername, setTargetUsername] = useState(selectedUser?.name);
  const [targetAvatar, setTargetAvatar] = useState(selectedUser?.avatar);
  const [targetProfilePicture, setTargetProfilePicture] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const messagesEndRef = useRef(null);
  const roomId = [currentUserId, targetUserId].sort().join("-");

  useEffect(() => {
    socket.emit("join_room", roomId);

    const handleReceive = (data) => {
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
    setTargetUserId(selectedUser?.id);
    setTargetAvatar(selectedUser?.avatar);
    setTargetUsername(selectedUser?.name);
  }, [selectedUser]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/chat/chat-history/${roomId}`);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.secure_url) {
        const imgMessage = {
          room: roomId,
          author: username,
          senderId: currentUserId,
          recipientId: targetUserId,
          message: `<img src="${result.secure_url}" alt="Image" class="max-w-xs rounded-lg"/>`,
        };
        socket.emit("send_message", imgMessage);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
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
            <img src={targetAvatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{targetAvatar || targetUsername?.charAt(0)}</span>
          )}
        </div>
        <div>
          <h2 className="font-medium text-black">{targetUsername || `User ${targetUserId}`}</h2>
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
                <div key={idx} className={`mb-4 flex ${isSender ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-xs lg:max-w-md">
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isSender
                          ? "bg-orange-600 text-white rounded-br-none"
                          : "bg-gray-500 text-white rounded-bl-none"
                      }`}
                      dangerouslySetInnerHTML={{ __html: msg.message }}
                    />
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

      {/* Image Upload */}
      <div className="p-4 border-t border-b bg-white flex items-center justify-between">
        <label
          htmlFor="uploadImage"
          className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Upload Image
        </label>
        <input
          type="file"
          id="uploadImage"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {uploadingImage && <span className="text-sm text-gray-600 ml-4">Uploading...</span>}
      </div>

      {/* Input */}
      <div className="p-4 bg-orange-600 border-t border-orange-400">
        <div className="flex">
          <input
            value={message}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder={uploadingImage ? "Please wait for image upload..." : "Type a message..."}
            disabled={uploadingImage}
            className="flex-1 bg-white rounded-l-lg px-4 py-3 text-black outline-none disabled:bg-gray-100"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || uploadingImage}
            className={`px-6 rounded-r-lg ${
              message.trim() && !uploadingImage
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
