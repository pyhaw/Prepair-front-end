"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ActiveJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        setUserId(userId);
        setUserRole(role);

        if (!token) {
          throw new Error("User is not authenticated. Please log in.");
        }

        let endpoint = "";

        if (role === "client") {
          // Fetch job postings created by the client
          console.log("Fetching for client");
          endpoint = `${API_URL}/api/job-postings/${userId}`;
        } else if (role === "fixer") {
          // Fetch jobs the fixer has bid on
          endpoint = `${API_URL}/api/job-bids?fixer_id=${userId}`;
        }

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No active jobs.");
        }

        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        setError("No active jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search term and status filter
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  const handleMarkCompleted = async (job) => {
    const token = localStorage.getItem("token");

    if (!job.accepted_bid_id) {
      alert("No accepted bid found for this job.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/complete-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bidId: job.accepted_bid_id,
          jobId: job.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Job marked as completed!");

        const updatedJob = { ...job, status: "completed" };

        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === job.id ? updatedJob : j))
        );

        setShowModalForJob(updatedJob);
      } else {
        alert(data.error || "Failed to complete job.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  const handleViewDetails = (job) => {
    const userId = localStorage.getItem("userId");
    // Pass the ownerId along with other job details
    const queryParams = new URLSearchParams({
      id: job.id,
      client_id: job.client_id,
      title: job.title,
      description: job.description,
      location: job.location,
      urgency: job.urgency,
      min_budget: job.min_budget || "",
      max_budget: job.max_budget || "",
      ownerId: userId, // include owner id
      status: job.status,
      date: job.date,
    }).toString();

    router.push(`/requests/details?${queryParams}`);
  };

  const handleEdit = (job) => {
    const queryParams = new URLSearchParams({
      id: job.id,
      client_id: job.client_id,
      title: job.title,
      description: job.description,
      location: job.location,
      urgency: job.urgency,
      min_budget: job.min_budget || "",
      max_budget: job.max_budget || "",
      ownerId: userId, // include owner id
      status: job.status,
      date: job.date,
    }).toString();

    router.push(`/editRequest?${queryParams}`);
  };

  const handleDelete = async (id) => {
    if (confirm("Do you want to delete job request?")) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/api/job-postings/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(data.error || "Failed to submit request");
        }
      } catch (error) {
        console.log(error);
      }
    }
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold mb-6 text-black">
          {userRole === "client"
            ? "📌 Your Job Requests"
            : "🔧 Jobs You Bid For"}
        </h2>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search jobs by title, description or location..."
              className="w-full p-3 border border-gray-300 rounded-md pl-10 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3 text-gray-400">🔍</div>
          </div>

          <div className="w-full md:w-64">
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {userRole === "client" ? (
                <>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </>
              ) : (
                <>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                </>
              )}
            </select>
          </div>
        </div>

        {loading && <p className="text-black">Loading active jobs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && filteredJobs.length === 0 && (
          <p className="text-gray-600 text-center py-8">
            No jobs match your search criteria
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="border p-4 rounded shadow-md bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">{job.title}</h3>

                {userId == job.client_id ? (
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-blue-600 border border-blue-300 font-semibold hover:bg-blue-500 hover:text-white transition duration-200"
                      onClick={() => handleEdit(job)}
                    >
                      ✏️
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-red-600 font-semibold border border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                      onClick={() => handleDelete(job.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="text-black">{job.description}</p>
              <p className="text-black">
                <strong>📍 Location:</strong> {job.location}
              </p>
              <p className="text-black">
                <strong>⚡ Urgency:</strong> {job.urgency}
              </p>
              <p className="text-black">
                <strong>💰 Budget:</strong>{" "}
                {job.min_budget && job.max_budget
                  ? `$${job.min_budget} - $${job.max_budget}`
                  : "N/A"}
              </p>
              <p className="text-black">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    job.status === "completed"
                      ? "text-green-600"
                      : job.status === "in_progress" ||
                        job.status === "accepted"
                      ? "text-blue-600"
                      : "text-orange-500"
                  }`}
                >
                  {job.status === "in_progress"
                    ? "In Progress"
                    : job.status === "open"
                    ? "Open"
                    : job.status === "pending"
                    ? "Pending"
                    : job.status === "accepted"
                    ? "Accepted"
                    : "Completed"}
                </span>
              </p>
              {userRole === "client" && job.status === "in_progress" && (
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full block text-center"
                  onClick={() => handleMarkCompleted(job)}
                >
                  Mark as Completed
                </button>
              )}
              <button
                className="mt-2 bg-orange-500 text-white px-4 py-2 rounded w-full block text-center"
                onClick={() => handleViewDetails(job)}
              >
                View Details
              </button>
              {userRole === "client" && job.status === "completed" && (
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full block text-center"
                  onClick={() => setShowModalForJob(job)}
                >
                  Rate Fixer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
