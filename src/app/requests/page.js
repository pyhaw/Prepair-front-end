"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Requests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    urgency: "",
    minBudget: "",
    maxBudget: "",
  });
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

        const token = localStorage.getItem("token");
        setUserToken(token);
        if (!token) {
          throw new Error("User is not authenticated. Please log in.");
        }

        const response = await fetch(`${API_URL}/api/job-postings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job postings.");
        }

        const data = await response.json();
        console.log(data);

        const formattedRequests = data.map((job) => ({
          id: job.id,
          client_id: job.client_id,
          title: job.title,
          location: job.location,
          urgency: job.urgency,
          min_budget: job.min_budget,
          max_budget: job.max_budget,
          description: job.description,
          status: job.status,
          images: Array.isArray(job.images) ? job.images : [],
          date: job.date,
        }));

        setRequests(formattedRequests);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !filters.location ||
      req.location?.toLowerCase() === filters.location.toLowerCase();

    const matchesUrgency =
      !filters.urgency ||
      req.urgency?.toLowerCase() === filters.urgency.toLowerCase();

    const minBudget = parseFloat(filters.minBudget);
    const maxBudget = parseFloat(filters.maxBudget);

    const matchesBudget =
      (!minBudget || req.max_budget >= minBudget) &&
      (!maxBudget || req.min_budget <= maxBudget);

    return matchesSearch && matchesLocation && matchesUrgency && matchesBudget;
  });

  const handleViewDetails = (request) => {
    const queryParams = new URLSearchParams({
      id: request.id,
      client_id: request.client_id,
      title: request.title,
      description: request.description,
      location: request.location,
      urgency: request.urgency,
      min_budget: request.min_budget || "",
      max_budget: request.max_budget || "",
      status: request.status,
      date: request.date,
      images: encodeURIComponent(JSON.stringify(request.images || [])), // ✅ Add this line
    }).toString();
    router.push(`/requests/details?${queryParams}`);
  };

  const handleMessageClient = async (clientId) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to message the client.");
      return;
    }

    try {
      // Decode JWT token payload safely
      const payloadBase64 = token.split(".")[1];
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decodedPayload = JSON.parse(jsonPayload);

      const senderId = decodedPayload.id || decodedPayload.userId;
      const senderUsername = decodedPayload.name;

      if (!senderId || !clientId) {
        console.error("❌ handleMessageClient error: Missing IDs");
        throw new Error("Missing sender or recipient ID.");
      }

      // Step 1: Create chat room if not exists
      const roomId = [senderId, clientId].sort().join("-");

      await fetch(`${API_URL}/api/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1_id: senderId,
          user2_id: clientId,
        }),
      });

      // Step 2: Send the prefilled message
      const prefillMessage = `Hi I am ${senderUsername} and I would like to know more about the request.`;

      await fetch(`${API_URL}/api/chat/save-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          sender_id: senderId,
          recipient_id: clientId,
          message: prefillMessage,
        }),
      });

      // Step 3: Redirect to chat page
      const chatUrl = `/chatPage?me=${senderId}&partner=${clientId}`;
      router.push(chatUrl);

      // ✅ Step 4: Delay event to ensure ChatSidebar has mounted
      setTimeout(() => {
        window.dispatchEvent(new Event("chatMessageSent"));
      }, 1000); // Delay slightly to ensure backend and frontend are ready
      console.log("📣 Dispatching chatMessageSent event");
    } catch (err) {
      console.error("❌ handleMessageClient error:", err);
      alert("Something went wrong while trying to message the client.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold mb-6 text-black">
          🔧 Open Repair Requests
        </h2>

        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search by title or description..."
            className="w-full border p-2 rounded text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="w-full border p-2 rounded text-black"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            >
              <option value="">All Locations</option>
              <option value="Central">Central</option>
              <option value="North">North</option>
              <option value="North-East">North-East</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>

            <select
              className="w-full border p-2 rounded text-black"
              value={filters.urgency}
              onChange={(e) =>
                setFilters({ ...filters, urgency: e.target.value })
              }
            >
              <option value="">All Urgency Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min $"
                className="w-1/2 border p-2 rounded text-black"
                value={filters.minBudget}
                onChange={(e) =>
                  setFilters({ ...filters, minBudget: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Max $"
                className="w-1/2 border p-2 rounded text-black"
                value={filters.maxBudget}
                onChange={(e) =>
                  setFilters({ ...filters, maxBudget: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {loading && <p className="text-black">Loading requests...</p>}
        {!userToken ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
              <span className="text-3xl">🔐</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Please log in or create an account first.
            </h3>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              onClick={() => router.push("/LoginPage")}
            >
              Go to Login Page
            </button>
          </div>
        ) : (
          error && (
            <div className="py-16 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {error}
              </h3>
            </div>
          )
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 && !loading && !error ? (
            <p className="text-black col-span-full text-center">
              No matching repair requests found.
            </p>
          ) : (
            filteredRequests.map((request) =>
              request.status === "open" ? (
                <div
                  key={request.id}
                  className="border p-4 rounded shadow-md bg-white flex flex-col"
                >
                  <div className="overflow-x-auto whitespace-nowrap flex gap-2 mb-3">
                    {request.images && request.images.length > 0 ? (
                      request.images.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`image-${index}`}
                          className="w-32 h-32 object-cover rounded border"
                        />
                      ))
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center text-gray-400 border rounded">
                        No image
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-black mb-1">
                    {request.title}
                  </h3>
                  <p className="text-black mb-2">{request.description}</p>
                  <p className="text-black text-sm">
                    <strong>📍 Location:</strong> {request.location}
                  </p>
                  <p className="text-black text-sm">
                    <strong>⚡ Urgency:</strong> {request.urgency}
                  </p>
                  <p className="text-black text-sm mb-2">
                    <strong>💰 Budget:</strong>{" "}
                    {request.min_budget && request.max_budget
                      ? `$${request.min_budget} - $${request.max_budget}`
                      : "N/A"}
                  </p>

                  {/* ⬇️ Buttons Section */}
                  <div className="mt-auto space-y-2">
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded w-full block text-center hover:bg-orange-600"
                      onClick={() => handleViewDetails(request)}
                    >
                      View Details
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded w-full block text-center hover:bg-blue-700"
                      onClick={() => handleMessageClient(request.client_id)}
                    >
                      💬 Message Client
                    </button>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
