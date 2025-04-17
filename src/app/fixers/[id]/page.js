"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FixerProfile() {
  const { id } = useParams();
  const [fixer, setFixer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const DEFAULT_PROFILE_EMOJI = "👤";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchFixer = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/fixers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch fixer profile");

        const data = await response.json();
        setFixer(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load fixer profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFixer();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto mt-32 p-6">
          {loading ? (
            <p className="text-gray-700">Loading fixer profile...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : fixer ? (
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
              <div className="flex flex-col items-center p-8 text-center">
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

                <h1 className="text-2xl font-semibold text-gray-800">
                  {fixer.name || fixer.username}
                </h1>

                {/* ⭐ Dynamic Rating */}
                {fixer.avgRating !== null ? (
                  <p className="text-sm text-yellow-500 mt-1 text-center">
                    ⭐ {parseFloat(fixer.avgRating).toFixed(1)} ·{" "}
                    {fixer.reviewCount} review{fixer.reviewCount !== 1 && "s"}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    No ratings yet
                  </p>
                )}
              </div>

              {/* Business Info Section */}
              <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-700">
                <p>
                  <strong>Company:</strong> {fixer.company || "N/A"}
                </p>
                <p>
                  <strong>Skills:</strong> {fixer.skills || "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong> {fixer.experience || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {fixer.phone || "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">Fixer not found.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
