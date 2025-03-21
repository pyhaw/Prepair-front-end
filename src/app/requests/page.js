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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not authenticated. Please log in.");
        }

        const response = await fetch(`${API_URL}/api/job-postings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job postings.");
        }

        const data = await response.json();

        const formattedRequests = data.map((job) => ({
          id: job.id,
          title: job.title,
          location: job.location,
          urgency: job.urgency,
          min_budget: job.min_budget,
          max_budget: job.max_budget,
          description: job.description,
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

  const handleViewDetails = (request) => {
    const queryParams = new URLSearchParams({
      title: request.title,
      description: request.description,
      location: request.location,
      urgency: request.urgency,
      min_budget: request.min_budget || "",
      max_budget: request.max_budget || "",
    }).toString();

    router.push(`/requests/details?${queryParams}`);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold mb-6 text-black">🔧 Open Repair Requests</h2>

        {loading && <p className="text-black">Loading requests...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="border p-4 rounded shadow-md bg-gray-100">
              <h3 className="text-xl font-bold text-black">{request.title}</h3>
              <p className="text-black">{request.description}</p>
              <p className="text-black"><strong>📍 Location:</strong> {request.location}</p>
              <p className="text-black"><strong>⚡ Urgency:</strong> {request.urgency}</p>
              <p className="text-black"><strong>💰 Budget:</strong> {request.min_budget && request.max_budget ? `$${request.min_budget} - $${request.max_budget}` : "N/A"}</p>
              <button
                className="mt-2 bg-orange-500 text-white px-4 py-2 rounded w-full block text-center"
                onClick={() => handleViewDetails(request)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
