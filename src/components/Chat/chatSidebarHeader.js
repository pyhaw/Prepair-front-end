"use client";

import { useEffect, useState } from "react";

export default function ChatSidebarHeader({ username, userId }) {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const token = localStorage.getItem("token");

      if (!token || !userId) return;

      try {
        const res = await fetch(`http://localhost:5001/api/userProfile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfilePicture(data.profilePicture || null);
      } catch (err) {
        console.error("Failed to fetch profile picture:", err);
      }
    };

    fetchProfilePicture();
  }, [userId]);

  return (
    <div className="p-5 border-b border-gray-200 bg-orange-100">
      <div className="flex items-center">
        {/* Profile Image */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-500 text-white flex items-center justify-center mr-4 text-xl">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            username?.charAt(0).toUpperCase()
          )}
        </div>

        {/* Username & ID */}
        <div>
          <h3 className="text-base font-semibold text-black">{username}</h3>
          <p className="text-xs text-gray-600">ID: {userId}</p>
        </div>
      </div>
    </div>
  );
}
