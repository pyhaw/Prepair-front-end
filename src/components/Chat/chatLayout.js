"use client";
import { useEffect, useState } from "react";
import ChatBar from "./chatBar";
import ChatSidebar from "./chatSidebar";
import ChatRoom from "./chatRoom";

export default function ChatLayout({ userId, selectedUser, setSelectedUser }) {
  const [username, setUsername] = useState("");
  const [chatRefreshTrigger, setChatRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleRefresh = () => {
      setChatRefreshTrigger((prev) => prev + 1); // triggers ChatSidebar to refetch
    };
  
    window.addEventListener("chatMessageSent", handleRefresh);
  
    return () => {
      window.removeEventListener("chatMessageSent", handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      // Auto-scroll or any other setup logic here if needed
      console.log("🔁 ChatLayout received selectedUser:", selectedUser);
    }
  }, [selectedUser]);
  
  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId) return;
      try {
        const res = await fetch(
          `http://localhost:5001/api/users/profile/${userId}`
        );
        const data = await res.json();
        setUsername(data.username || `User ${userId}`);
      } catch (err) {
        console.error("❌ Failed to fetch current username:", err);
      }
    };

    fetchUsername();
  }, [userId]);

  return (
    <div className="flex pt-[105px] min-h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <ChatBar currentUserId={userId} setSelectedUser={setSelectedUser} />
        <ChatSidebar
          currentUserId={userId}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          refreshTrigger={chatRefreshTrigger}
        />
      </div>

      {/* Chat Room */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatRoom
            currentUserId={userId}
            username={username}
            selectedUser={selectedUser}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-500">
            <div className="text-5xl mb-4 text-orange-400">💬</div>
            <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
            <p className="text-sm text-gray-600">
              Choose an existing chat or start a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
