"use client";
// src/components/Chat/UserCard.js
import { useRouter } from "next/navigation";

export default function UserCard({ user, selected, currentUserId, onClick }) {
  const router = useRouter();
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  };

  // For demo purposes, randomize the status
  const statusOptions = ["online", "away", "offline"];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  const handleClick = () => {
    onClick(user);
    router.push(`/chatPage?me=${currentUserId}&partner=${user.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center p-4 cursor-pointer transition ${
        selected ? "bg-gray-700" : "hover:bg-gray-800"
      }`}
    >
      <div className="relative mr-3">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full text-xl">
          {user.avatar || user.name.charAt(0)}
        </div>
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-gray-800`}
        ></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className="font-medium truncate text-white">{user.name}</h3>
          <span className="text-xs text-gray-400">
            {user.lastActive ? new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
        <p className="truncate text-sm text-gray-400">{user.lastMessage}</p>
      </div>
    </div>
  );
}