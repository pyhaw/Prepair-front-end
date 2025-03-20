"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

        // Retrieve the token and userId from localStorage
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // Check if the user is authenticated
        if (!token || !userId) {
          throw new Error("User is not authenticated. Please log in.");
        }

        // Verify the token with the backend
        const authResponse = await fetch(`${API_URL}/api/auth/verify`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!authResponse.ok) {
          throw new Error("Invalid token. Please log in again.");
        }

        // Fetch job postings for the logged-in user
        const response = await fetch(`${API_URL}/api/job-postings/${userId}`, {
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

        // Format the job postings for display
        const formattedRequests = data.map((job) => ({
          id: job.id,
          category: job.title,
          location: job.location,
          urgency: job.urgency,
          budget: job.min_budget && job.max_budget
            ? `$${job.min_budget} - $${job.max_budget}`
            : "N/A",
          description: job.description,
        }));

        setRequests(formattedRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job postings:", error.message);

        // Redirect to login page if user is not authenticated
        if (error.message.includes("authenticated")) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          router.push("/login");
        }

        setError(error.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold mb-6 text-black">🔧 My Requests</h2>

        {loading && <p className="text-black">Loading requests...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.length === 0 && !loading && !error && (
            <p className="text-black col-span-full text-center">
              You have no open repair requests.
            </p>
          )}

          {requests.map((request) => (
            <div key={request.id} className="border p-4 rounded shadow-md bg-gray-100">
              <h3 className="text-xl font-bold text-black">{request.category}</h3>
              <p className="text-black">{request.description}</p>
              <p className="text-black">
                <strong>📍 Location:</strong> {request.location}
              </p>
              <p className="text-black">
                <strong>⚡ Urgency:</strong> {request.urgency}
              </p>
              <p className="text-black">
                <strong>💰 Budget:</strong> {request.budget}
              </p>
              <Link
                href={`/requests/${request.id}`}
                className="mt-2 bg-orange-500 text-white px-4 py-2 rounded w-full block text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}