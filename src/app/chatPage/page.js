"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatLayout from "@/components/Chat/chatLayout";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const currentUserId = parseInt(searchParams.get("me"));
  const partnerIdRaw = searchParams.get("partner");
  const partnerId = partnerIdRaw ? parseInt(partnerIdRaw) : null;

  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch logged-in user's username
  useEffect(() => {
    const fetchUsername = async () => {
      if (!currentUserId) return;

      try {
        const res = await fetch(`http://localhost:5001/api/users/${currentUserId}`);
        const data = await res.json();
        setUsername(data.username || `User ${currentUserId}`);
      } catch (err) {
        console.error("❌ Failed to fetch username:", err);
        setUsername(`User ${currentUserId}`); // fallback
      }
    };

    fetchUsername();
  }, [currentUserId]);

  // ✅ Fetch preselected partner user
  useEffect(() => {
    const fetchPartnerDetails = async () => {
      if (!partnerId) return;

      try {
        const res = await fetch(`http://localhost:5001/api/users/${partnerId}`);
        const data = await res.json();

        setSelectedUser({
          id: partnerId,
          name: data.username || `User ${partnerId}`,
          avatar: data.profilePicture || (data.username?.charAt(0) ?? "U"),
        });
      } catch (err) {
        console.error("❌ Failed to fetch partner user info:", err);
      }
    };

    fetchPartnerDetails();
  }, [partnerId]);

  if (!currentUserId) {
    return (
      <div className="text-orange-600 p-8 bg-white">
        Missing <code>?me=USER_ID</code> parameter.
      </div>
    );
  }

  return (
    <>
      <Navbar className="fixed top-0 left-0 w-full z-50" />
      <ChatLayout
        username={username}
        userId={currentUserId}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </>
  );
}
