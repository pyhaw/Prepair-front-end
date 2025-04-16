"use client";
import { useEffect, useState } from "react";
import UserCard from "./userCard";
import ChatSidebarHeader from "./chatSidebarHeader";

export default function ChatSidebar({
  currentUserId,
  selectedUser,
  setSelectedUser,
  refreshTrigger,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");

  const fetchChats = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/chat/chats/${currentUserId}`
      );
      const data = await res.json();
      console.log("✅ Fetched chats:", data);

      const formatted = data.map((chat) => ({
        id: chat.partner_id,
        name: chat.partner_name || `User ${chat.partner_id}`,
        avatar: chat.partner_picture || chat.partner_id.toString().charAt(0),
        lastMessage: chat.last_message || "No messages yet",
        lastActive: chat.last_active ? new Date(chat.last_active) : null,
      }));

      setUsers(formatted);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching chats:", err);
      setLoading(false);
    }
  };

  const fetchUsername = async () => {
    const token = localStorage.getItem("token");
    if (!currentUserId || !token) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/userProfile/${currentUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCurrentUsername(data.username || `User ${currentUserId}`);
      }
    } catch (err) {
      console.error("❌ Error fetching current username:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (currentUserId) {
      fetchChats();
      fetchUsername();
    }
  }, [currentUserId]);

  // Re-fetch when refreshTrigger changes
  useEffect(() => {
    if (currentUserId) {
      fetchChats();
      fetchUsername();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    const listener = () => fetchChats();
    window.addEventListener("chatMessageSent", listener);
    return () => window.removeEventListener("chatMessageSent", listener);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <ChatSidebarHeader userId={currentUserId} username={currentUsername} />
      <h2 className="px-4 pt-4 pb-2 text-sm font-medium text-gray-700 uppercase tracking-wide">
        Recent Conversations
      </h2>
      {loading ? (
        <div className="p-4 text-center text-gray-600">Loading...</div>
      ) : users.length === 0 ? (
        <div className="p-4 text-center text-gray-600">
          No conversations yet
        </div>
      ) : (
        users.map((user) => (
          <UserCard
            key={user.id} // ✅ Fix: should be user.id, not selectedUser.id
            user={user}
            onClick={() => setSelectedUser(user)}
            selected={selectedUser?.id === user.id}
            currentUserId={currentUserId}
          />
        ))
      )}
    </div>
  );
}
