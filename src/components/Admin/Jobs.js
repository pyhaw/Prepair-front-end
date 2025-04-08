"use client";

import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function AllJobPostings() {
  const router = useRouter();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    urgency: "",
    minBudget: "",
    maxBudget: "",
    status: "",
  });

  // State for confirmation popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // State for success notification
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Fetch all job postings
  const fetchJobPostings = useCallback(async () => {
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch job postings.");
      }

      const data = await response.json();

      if (data.length === 0) {
        // No job postings found
        setJobPostings([]);
        setLoading(false);
        return;
      }

      // Format the data as needed
      const formattedJobPostings = data.map((job) => ({
        id: job.id,
        client_id: job.client_id,
        title: job.title,
        description: job.description,
        location: job.location,
        urgency: job.urgency,
        min_budget: job.min_budget,
        max_budget: job.max_budget,
        status: job.status,
        notify: job.notify,
        created_at: job.created_at,
        images: Array.isArray(job.images) ? job.images : [], 
      }));

      setJobPostings(formattedJobPostings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job postings:", error.message);

      // Handle empty job postings case
      if (error.message.includes("No job postings available")) {
        setError("No jobs currently available!");
      } else {
        setError(error.message);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobPostings();
  }, [fetchJobPostings]);

  // Handle filtering of job postings
  const filteredJobPostings = jobPostings.filter((job) => {
    const matchesSearch =
      (job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation =
      !filters.location || job.location?.toLowerCase() === filters.location.toLowerCase();

    const matchesUrgency =
      !filters.urgency || job.urgency?.toLowerCase() === filters.urgency.toLowerCase();

    const matchesStatus =
      !filters.status || job.status?.toLowerCase() === filters.status.toLowerCase();

    const minBudget = parseFloat(filters.minBudget);
    const maxBudget = parseFloat(filters.maxBudget);

    const matchesBudget =
      (!minBudget || job.max_budget >= minBudget) &&
      (!maxBudget || job.min_budget <= maxBudget);

    return matchesSearch && matchesLocation && matchesUrgency && matchesStatus && matchesBudget;
  });

  // Handle deleting a job posting
  const handleDelete = async (jobId) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const response = await fetch(`${API_URL}/api/admin/jobPosting/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete job posting.");
      }

      // Remove the deleted job posting from the state
      setJobPostings((prev) => prev.filter((job) => job.id !== jobId));
      setShowSuccessNotification(true); // Show success notification
      closeConfirmPopup(); // Close the confirmation popup
    } catch (error) {
      console.error("Error deleting job posting:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle viewing details of a job posting
  const handleViewDetails = (job) => {
    const queryParams = new URLSearchParams({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      urgency: job.urgency,
      min_budget: job.min_budget || "",
      max_budget: job.max_budget || "",
      status: job.status,
      notify: job.notify,
      client_id: job.client_id,
      images: encodeURIComponent(JSON.stringify(job.images || [])), 
    }).toString();
    
    console.log(job)
    router.push(`/requests/details?${queryParams}`);
  };

  // Open the confirmation popup
  const openConfirmPopup = (job) => {
    setJobToDelete(job);
    setShowConfirmPopup(true);
  };

  // Close the confirmation popup
  const closeConfirmPopup = () => {
    setJobToDelete(null);
    setShowConfirmPopup(false);
  };

  return (
    <div>
      {/* Confirmation Popup */}
      {showConfirmPopup && jobToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the job posting <strong>{jobToDelete.title}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeConfirmPopup}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(jobToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50">
          <p>Job posting deleted successfully!</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold mb-6 text-black">🔧 All Job Postings</h2>

        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search by title or description..."
            className="w-full border p-2 rounded text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="w-full border p-2 rounded text-black"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            >
              <option value="">All Urgency Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              className="w-full border p-2 rounded text-black"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min $"
                className="w-1/2 border p-2 rounded text-black"
                value={filters.minBudget}
                onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max $"
                className="w-1/2 border p-2 rounded text-black"
                value={filters.maxBudget}
                onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
              />
            </div>
          </div>
        </div>

        {loading && <p className="text-black">Loading job postings...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobPostings.length === 0 && !loading && !error ? (
            <p className="text-black col-span-full text-center">
              No matching job postings found.
            </p>
          ) : (
            filteredJobPostings.map((job) => (
              <div key={job.id} className="border p-4 rounded shadow-md bg-gray-100">
                <h3 className="text-xl font-bold text-black">{job.title}</h3>
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
                  <strong>Status:</strong> {job.status}
                </p>
                <p className="text-black">
                  <strong>Notify:</strong> {job.notify ? "Yes" : "No"}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors duration-200"
                    onClick={() => handleViewDetails(job)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                    onClick={() => openConfirmPopup(job)}
                  >
                    Delete
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