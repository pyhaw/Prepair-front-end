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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

        const token = localStorage.getItem("token");
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
    }).toString();

    router.push(`/requests/details?${queryParams}`);
  };

  return (
    <div>
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
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 && !loading && !error ? (
            <p className="text-black col-span-full text-center">
              No matching repair requests found.
            </p>
          ) : (
            filteredRequests.map((request) =>
              request.status === "open" ? (
                <div
                  key={request.id}
                  className="border p-4 rounded shadow-md bg-gray-100"
                >
                  <h3 className="text-xl font-bold text-black">
                    {request.title}
                  </h3>
                  <p className="text-black">{request.description}</p>
                  <p className="text-black">
                    <strong>📍 Location:</strong> {request.location}
                  </p>
                  <p className="text-black">
                    <strong>⚡ Urgency:</strong> {request.urgency}
                  </p>
                  <p className="text-black">
                    <strong>💰 Budget:</strong>{" "}
                    {request.min_budget && request.max_budget
                      ? `$${request.min_budget} - $${request.max_budget}`
                      : "N/A"}
                  </p>
                  <button
                    className="mt-2 bg-orange-500 text-white px-4 py-2 rounded w-full block text-center"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                  </button>
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
