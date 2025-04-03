"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
export default function RequestDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidNotes, setBidNotes] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidMessage, setBidMessage] = useState({ text: "", type: "" });
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBidSubmitted, setIsBidSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [editingBidId, setEditingBidId] = useState(null);
  const [editBidAmount, setEditBidAmount] = useState("");
  const [editBidDescription, setEditBidDescription] = useState("");

  // Get request details from search params
  const [request, setRequest] = useState({
    id: searchParams.get("id") || "",
    client_id: searchParams.get("client_id"),
    title: searchParams.get("title") || "N/A",
    description: searchParams.get("description") || "N/A",
    location: searchParams.get("location") || "N/A",
    urgency: searchParams.get("urgency") || "N/A",
    date: searchParams.get("date") || "N/A",
    min_budget: searchParams.get("min_budget") || "N/A",
    max_budget: searchParams.get("max_budget") || "N/A",
    notify: searchParams.get("notify") === "true",
    jobStatus: searchParams.get("status") || "",
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  // Fetch user data and token on component mount
  useEffect(() => {
    // Handle client-side localStorage access
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const id = localStorage.getItem("userId");
      setUserRole(role);

      if (!token) {
        setError("You must be logged in to view this page");
        return;
      }

      setUserRole(role);
      setUserId(id);
    }
  }, []);
  useEffect(() => {
    // This will run whenever userId changes
    console.log("userId:", userId, typeof userId);
    console.log(
      "request.client_id:",
      request.client_id,
      typeof request.client_id
    );
    console.log(userRole);
  }, [userId]);

  // Format date for display
  const formatDate = (dateString) => {
    if (dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Fetch bids for the job
  const fetchBids = async () => {
    if (!request.id) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/job/${request.id}/bids`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bids: ${response.status}`);
      }

      const data = await response.json();
      setBids(data);
      console.log(request.client_id);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError("Failed to load bids. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bids when component mounts or ID changes
  useEffect(() => {
    fetchBids();
  }, [request.id]);

  useEffect(() => {
    fetchBids();
  }, [isBidSubmitted]);

  useEffect(() => {
    fetchBids();
  }, [isCompleted]);

  // Check if user has already bid on this job
  const hasUserBid = bids.some(
    (bid) => String(bid.fixer_id) === String(userId)
  );

  // Handle bid submission
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBidMessage({ text: "", type: "" });

    if (!userId) {
      setBidMessage({
        text: "You must be logged in to submit a bid",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/job-bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_posting_id: request.id,
          fixer_id: userId,
          bid_amount: parseFloat(bidAmount),
          description: bidNotes,
        }),
      });

      if (response.ok) {
        setBidMessage({
          text: "Your bid was submitted successfully!",
          type: "success",
        });
        setShowBidForm(false);
        setBidAmount("");
        setBidNotes("");
        // Fetch bids again to update the list
        await fetchBids();
      } else {
        const errorData = await response.json();
        setBidMessage({
          text: errorData.error || "Failed to submit bid",
          type: "error",
        });
      }
    } catch (error) {
      setBidMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
      console.error("Bid submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptBid = async (bid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/accept-bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bidId: bid.id, jobId: bid.job_posting_id }), // Include necessary bid data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Bid accepted:", data); // Handle the response properly
      setRequest((prev) => ({ ...prev, jobStatus: "in_progress" }));
      setIsBidSubmitted(true);
    } catch (error) {
      console.error("Error accepting bid:", error); // Log errors for debugging
    }
  };

  const handleCompleteBid = async (bid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/complete-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bidId: bid.id, jobId: bid.job_posting_id }), // Include necessary bid data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Job completed:", data); // Handle the response properly
      setIsCompleted(true);
      setRequest((prev) => ({ ...prev, jobStatus: "completed" }));
    } catch (error) {
      console.error("Error completeing job:", error); // Log errors for debugging
    }
  };

  const handleEdit = (request) => {
    const queryParams = new URLSearchParams({
      id: request.id,
      client_id: request.client_id,
      title: request.title,
      description: request.description,
      location: request.location,
      urgency: request.urgency,
      min_budget: request.min_budget || "",
      max_budget: request.max_budget || "",
      ownerId: userId, // include owner id
      status: request.status,
      date: request.date,
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
    router.push(`/activeJobs`);
  };

  const handleEditBid = (bid) => {
    setEditingBidId(bid.id);
    setEditBidAmount(bid.bid_amount);
    setEditBidDescription(bid.description || "");
  };

  const handleUpdateBid = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/edit-bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingBidId,
          bid_amount: editBidAmount,
          description: editBidDescription,
        }),
      });
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBid = async (id) => {
    const token = localStorage.getItem("token");
    if (confirm("Do you want to delete job bid?")) {
      try {
        const response = await fetch(`${API_URL}/api/delete-bid/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        await response;
        if (!response.ok) {
          throw new Error(data.error || "Failed to submit request");
        }
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-400">
      <div className="flex-grow max-w-4xl mx-auto w-full mt-24 p-6">
        {error ? (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Request Details
              </h2>
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                &larr; Back
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block font-semibold mb-1 text-gray-700">
                    Request Title
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded text-gray-800 bg-gray-50"
                    value={request.title}
                    readOnly
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-1 text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded text-gray-800 bg-gray-50"
                    value={request.location}
                    readOnly
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-1 text-gray-700">
                    Urgency Level
                  </label>
                  <div
                    className={`p-3 rounded-md border ${
                      request.urgency === "High"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : request.urgency === "Medium"
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : "bg-green-50 border-green-200 text-green-700"
                    }`}
                  >
                    {request.urgency}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-1 text-gray-700">
                    Requested Date
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-3 rounded text-gray-800 bg-gray-50"
                    value={formatDate(request.date)}
                    readOnly
                  />
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block font-semibold mb-1 text-gray-700">
                    Budget Range
                  </label>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="text-sm text-gray-500">Minimum</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 p-3 rounded text-gray-800 bg-gray-50"
                        value={
                          request.min_budget !== "N/A"
                            ? `$${request.min_budget}`
                            : "N/A"
                        }
                        readOnly
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-sm text-gray-500">Maximum</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 p-3 rounded text-gray-800 bg-gray-50"
                        value={
                          request.max_budget !== "N/A"
                            ? `$${request.max_budget}`
                            : "N/A"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block font-semibold mb-1 text-gray-700">
                    Issue Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 p-3 rounded h-32 text-gray-800 bg-gray-50"
                    value={request.description}
                    readOnly
                  />
                </div>
                <div className="w-1/2 items-center justify-between">
                  <div
                    className={`w-full p-3 rounded-md text-center font-semibold border ${
                      request.jobStatus === "completed"
                        ? "bg-green-200 text-green-800 border-green-500"
                        : request.jobStatus === "in_progress"
                        ? "bg-blue-200 text-blue-800 border-blue-500"
                        : request.jobStatus === "open" ||
                          request.jobStatus === "pending"
                        ? "bg-orange-200 text-orange-800 border-orange-500"
                        : "bg-gray-200 text-gray-800 border-gray-500"
                    }`}
                  >
                    Status:{" "}
                    {request.jobStatus
                      ? request.jobStatus.replace("_", " ")
                      : "N/A"}
                  </div>

                  {userId == request.client_id ? (
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-blue-600 border border-blue-300 font-semibold hover:bg-blue-500 hover:text-white transition duration-200"
                        onClick={() => handleEdit(request)}
                      >
                        ✏️
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-red-600 font-semibold border border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                        onClick={() => handleDelete(request.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-orange-500"
                    checked={request.notify}
                    readOnly
                  />
                  <label className="text-gray-700">
                    Client will be notified when a bid is received
                  </label>
                </div>
              </div>
            </div>

            {/* Bid Job button - only visible for fixers who haven't already bid */}
            {userRole === "fixer" && !hasUserBid && (
              <div className="mt-6">
                {!showBidForm ? (
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition duration-300"
                  >
                    Bid on this Job
                  </button>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Submit Your Bid
                    </h3>

                    {bidMessage.text && (
                      <div
                        className={`p-4 mb-4 rounded-md ${
                          bidMessage.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {bidMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleSubmitBid}>
                      <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">
                          Your Bid Amount ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full border border-gray-300 p-3 rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          required
                        />
                        {request.min_budget !== "N/A" &&
                          request.max_budget !== "N/A" && (
                            <p className="text-sm text-gray-500 mt-1">
                              Client's budget range: ${request.min_budget} - $
                              {request.max_budget}
                            </p>
                          )}
                      </div>

                      <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">
                          Message to Client
                        </label>
                        <textarea
                          className="w-full border border-gray-300 p-3 rounded h-32 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={bidNotes}
                          onChange={(e) => setBidNotes(e.target.value)}
                          placeholder="Describe why you're a good fit for this job, your experience, and estimated timeline..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition duration-300 disabled:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Bid"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBidForm(false);
                            setBidMessage({ text: "", type: "" });
                          }}
                          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Message shown when a fixer has already bid */}
            {userRole === "fixer" && hasUserBid && (
              <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-800">
                You have already submitted a bid for this job. You cannot submit
                multiple bids for the same job.
              </div>
            )}

            {/* Display Bids for the Job */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Bids for this Job
              </h3>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading bids...</p>
                </div>
              ) : bids.length > 0 ? (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
                    >
                      {editingBidId === bid.id ? (
                        <form onSubmit={handleUpdateBid} className="space-y-4">
                          <div>
                            <label className="block font-semibold mb-2 text-gray-700">
                              Bid Amount ($)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full border border-gray-300 p-3 rounded text-gray-700"
                              value={editBidAmount}
                              onChange={(e) => setEditBidAmount(e.target.value)}
                              required
                            />
                          </div>

                          <div>
                            <label className="block font-semibold mb-2 text-gray-700">
                              Message to Client
                            </label>
                            <textarea
                              className="w-full border border-gray-300 p-3 text-gray-700 rounded h-32"
                              value={editBidDescription}
                              onChange={(e) =>
                                setEditBidDescription(e.target.value)
                              }
                            />
                          </div>

                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600"
                            >
                              Update Bid
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingBidId(null)}
                              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-gray-800 text-lg">
                                ${Number(bid.bid_amount).toFixed(2)}
                              </div>
                              <div className="mt-1 text-gray-600">
                                <span className="font-semibold">Bidder:</span>{" "}
                                {bid.fixer_name || "Anonymous"}
                              </div>
                              <div className="text-gray-500 text-sm">
                                Submitted:{" "}
                                {new Date(bid.created_at).toLocaleDateString()}
                              </div>
                            </div>

                            {/* Bid status badge */}
                            <div
                              className={`px-3 py-1 rounded-full text-sm ${
                                bid.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : bid.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {bid.status === "pending"
                                ? "Pending"
                                : "Accepted"}
                            </div>
                          </div>

                          {/* Bid description */}
                          {bid.description && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="text-gray-800 whitespace-pre-line">
                                {bid.description}
                              </div>
                            </div>
                          )}

                          {/* Actions for client on their own job posting */}
                          {bid.status === "pending" &&
                          String(userId) === String(request.client_id) ? (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-3">
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition duration-300"
                                onClick={() => handleAcceptBid(bid)}
                              >
                                Accept Bid
                              </button>
                              <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 transition duration-300"
                                onClick={() =>
                                  alert(
                                    "Message bidder functionality to be implemented"
                                  )
                                }
                              >
                                Message
                              </button>
                            </div>
                          ) : bid.status === "accepted" &&
                            request.jobStatus === "in_progress" ? (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-3">
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition duration-300"
                                onClick={() => handleCompleteBid(bid)}
                              >
                                Mark as Completed
                              </button>
                              <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 transition duration-300"
                                onClick={() =>
                                  alert(
                                    "Message bidder functionality to be implemented"
                                  )
                                }
                              >
                                Message
                              </button>
                            </div>
                          ) : null}
                          {bid.fixer_id == userId ? (
                            <div className="flex gap-2">
                              <button
                                className="flex items-center gap-2 px-4 py-2 rounded-md text-blue-600 border border-blue-300 font-semibold hover:bg-blue-500 hover:text-white transition duration-200"
                                onClick={() => handleEditBid(bid)}
                              >
                                ✏️
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 rounded-md text-red-600 font-semibold border border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                                onClick={() => handleDeleteBid(bid.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          ) : null}
                        </>
                      )}{" "}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <p className="mt-4 text-lg">
                    No bids have been submitted for this job yet.
                  </p>
                  {userRole === "fixer" && !hasUserBid && !showBidForm && (
                    <button
                      onClick={() => setShowBidForm(true)}
                      className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition duration-300"
                    >
                      Be the first to bid
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
