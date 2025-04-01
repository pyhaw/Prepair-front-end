"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router

export default function ChatBar({ currentUserId }) {
  const [targetUserId, setTargetUserId] = useState("");
  const router = useRouter(); // ✅ App Router

  const createRoom = async () => {
    if (!targetUserId || currentUserId === targetUserId) {
      alert("Please select a different user");
      return;
    }
  
    try {
      // 🔍 Validate target user before sending request
      const validationRes = await fetch(
        `http://localhost:5001/api/users/validate/${targetUserId}?currentUserId=${currentUserId}`
      );
      const validationData = await validationRes.json();
  
      if (!validationData.valid) {
        alert(validationData.message || "You can't talk to yourself!");
        return;
      }
  
      const response = await fetch("http://localhost:5001/api/chat-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1Id: currentUserId, user2Id: targetUserId }),
      });
  
      const data = await response.json();
      if (data.success) {
        router.push(`/chatPage?me=${currentUserId}&partner=${targetUserId}`);
      } else {
        alert("Failed to create chat room");
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
      alert("Something went wrong");
    }
  };
  

  return (
    <div className="p-4 border-b border-gray-700">
      <h2 className="text-xl font-semibold mb-3 text-white">
        New Conversation
      </h2>
      <div className="flex">
        <input
          type="number"
          placeholder="User ID"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l outline-none border border-gray-700 focus:border-blue-500 transition"
        />
        <button
          onClick={createRoom}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r transition"
        >
          Chat
        </button>
      </div>
    </div>
  );
}
