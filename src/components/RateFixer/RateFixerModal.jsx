"use client";
import { useState } from "react";

export default function RateFixerModal({ fixer, jobId, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/job/${jobId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fixer_id: fixer.id,
          rating,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || "Failed to submit review.");
      } else {
        setSuccess(true);
        setTimeout(onClose, 3000);
      }
    } catch (err) {
      console.error("🔥 Failed to submit rating:", err);
      setErrorMsg("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {success ? (
          <div className="text-center text-green-600 text-xl font-semibold">
            Thank you for rating!
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Rate your Fixer</h2>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {errorMsg && (
              <div className="text-red-500 mb-2 text-sm">{errorMsg}</div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
