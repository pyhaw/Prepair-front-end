"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FixersPage() {
  const router = useRouter();
  const [fixers, setFixers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const DEFAULT_PROFILE_EMOJI = "👤";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const handleMessageFixer = async (fixerId, fixerUsername) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to message the fixer.");
      return;
    }

    try {
      const payloadBase64 = token.split(".")[1];
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      const senderId = decoded.id || decoded.userId;
      const senderUsername = decoded.name;

      if (!senderId || !fixerId) {
        throw new Error("Missing sender or recipient ID.");
      }

      const roomId = [senderId, fixerId].sort().join("-");

      await fetch(`${API_URL}/api/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1_id: senderId, user2_id: fixerId }),
      });

      const message = `Hi I am ${senderUsername} and I saw your profile. I'd like to get in touch.`;

      await fetch(`${API_URL}/api/chat/save-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          sender_id: senderId,
          recipient_id: fixerId,
          message,
        }),
      });

      window.dispatchEvent(new Event("chatMessageSent"));
      router.push(`/chatPage?me=${senderId}&partner=${fixerId}`);
    } catch (err) {
      console.error("❌ handleMessageFixer error:", err);
      alert("Something went wrong while trying to message the fixer.");
    }
  };

  useEffect(() => {
    const fetchFixers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/fixers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch fixers");
        }

        const data = await response.json();
        setFixers(data);
      } catch (err) {
        console.error("Error fetching fixers:", err);
        setError("Failed to load fixers.");
      } finally {
        setLoading(false);
      }
    };

    fetchFixers();
  }, []);

  const filteredFixers = fixers.filter((fixer) =>
    (fixer.name || fixer.username || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold mb-6 text-black">🔧 Our Fixers</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, username, or skills..."
            className="w-full border p-2 rounded text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && <p className="text-black">Loading fixers...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFixers.length === 0 && !loading && !error ? (
            <p className="text-black col-span-full text-center">
              No matching fixers found.
            </p>
          ) : (
            filteredFixers.map((fixer) => (
              <div
                key={fixer.id}
                className="border p-4 rounded shadow-md bg-gray-100"
              >
                <div className="flex justify-center mb-4">
                  {fixer.profilePicture ? (
                    <img
                      src={fixer.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 aspect-square rounded-full object-cover bg-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 aspect-square rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                      {DEFAULT_PROFILE_EMOJI}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-center text-black">
                  {fixer.name || fixer.username}
                </h3>
                <p className="text-center text-black text-sm">
                  {fixer.jobTitle || "Fixer"}
                </p>

                <div className="mt-4 space-y-2">
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded w-full hover:bg-orange-600"
                    onClick={() => router.push(`/fixers/${fixer.id}`)}
                  >
                    View Profile
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                    onClick={() =>
                      handleMessageFixer(fixer.id, fixer.username)
                    }
                  >
                    Message Fixer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
