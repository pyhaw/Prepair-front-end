"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ChatBar({ currentUserId, setSelectedUser }) {
  const [targetUserId, setTargetUserId] = useState("");

  const createRoom = async () => {
    const targetId = parseInt(targetUserId);

    if (!targetId || isNaN(targetId)) {
      toast.warning("Please enter a valid user ID.");
      return;
    }

    if (targetId === currentUserId) {
      toast.warning("You can't chat with yourself.");
      return;
    }

    try {
      // ✅ Use your correct validation route
      const userCheck = await fetch(
        `http://localhost:5001/api/users/validate/${targetId}?currentUserId=${currentUserId}`
      );

      if (!userCheck.ok) {
        toast.error("User not found.");
        return;
      }

      const userData = await userCheck.json();

      // ✅ Proceed to create chat room
      const response = await fetch("http://localhost:5001/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1Id: currentUserId, user2Id: targetId }),
      });

      if (response.ok) {
        toast.success(`Chat created with ${userData.username}!`);

        setSelectedUser({
          id: targetId,
          name: userData.username || `User ${targetId}`,
          avatar: userData.profilePicture || userData.username?.charAt(0) || "U",
        });

        setTargetUserId("");
      } else {
        toast.error("Failed to create chat.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="p-4 border-b border-orange-400">
        <h2 className="text-xl font-semibold mb-3 text-black">New Conversation</h2>
        <div className="flex">
          <input
            type="number"
            placeholder="User ID"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-l outline-none border border-orange-400 focus:border-blue-500 transition"
          />
          <button
            onClick={createRoom}
            className="bg-orange-600 text-white px-4 py-2 rounded-r transition"
          >
            Chat
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
