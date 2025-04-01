"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatBar from "@/components/Chat/chatBar";
import ChatRoom from "@/components/Chat/chatRoom";
import ChatSidebar from "@/components/Chat/chatSidebar";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const currentUserId = parseInt(searchParams.get("me"));
  const partnerId = searchParams.get("partner");
  const username = `User${currentUserId}`;

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (partnerId) {
      setSelectedUser({
        id: parseInt(partnerId),
        name: `User ${partnerId}`,
        avatar: partnerId.charAt(0),
      });
    }
  }, [partnerId]);

  if (!currentUserId) {
    return (
      <div className="text-white p-8">
        Missing <code>?me=USER_ID</code> parameter.
      </div>
    );
  }

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">💬 Prepair Chat</h1>
        <p className="text-sm">
          Logged in as: <span className="font-bold">{username}</span>
        </p>
      </nav>

      {/* Layout */}
      <div className="flex h-[calc(100vh-64px)] bg-gray-900 text-white">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          {/* User Profile */}
          <div className="p-4 border-b border-gray-800 bg-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                {username.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{username}</h3>
                <p className="text-xs text-gray-400">ID: {currentUserId}</p>
              </div>
            </div>
          </div>

          {/* Chat Search Bar */}
          <ChatBar currentUserId={currentUserId} />

          {/* Sidebar List of Conversations */}
          <ChatSidebar
            currentUserId={currentUserId}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <ChatRoom
              currentUserId={currentUserId}
              targetUserId={selectedUser.id}
              username={username}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-xl font-medium mb-2">
                Select a conversation
              </h2>
              <p className="text-sm">
                Choose an existing chat or start a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
