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

                if (!response.ok) {
                    throw new Error("Failed to fetch fixer profile");
                }

                const data = await response.json();
                setFixer(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load fixer profile.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFixer();
        }
    }, [id]);

    return (
        <div>
            <Navbar />

            <div className="max-w-4xl mx-auto mt-32 p-6">
                {loading ? (
                    <p className="text-gray-700">Loading fixer profile...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : fixer ? (
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex flex-col items-center">
                            <img
                                src={fixer.profilePicture || "/default-avatar.png"}
                                alt={fixer.name || fixer.username}
                                className="w-28 h-28 rounded-full object-cover mb-4"
                            />
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {fixer.name || fixer.username}
                            </h2>
                            <p className="text-gray-600 mb-1">
                                <strong>Email:</strong> {fixer.email}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <strong>Role:</strong> {fixer.role}
                            </p>
                            {fixer.jobTitle && (
                                <p className="text-gray-600">
                                    <strong>Job Title:</strong> {fixer.jobTitle}
                                </p>
                            )}
                        </div>

                        {/* Additional details */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                            <p>
                                <strong>Phone:</strong> {fixer.phone || "N/A"}
                            </p>
                            <p>
                                <strong>Company:</strong> {fixer.company || "N/A"}
                            </p>
                            <p>
                                <strong>Experience:</strong> {fixer.experience || "N/A"}
                            </p>
                            <p>
                                <strong>Skills:</strong> {fixer.skills || "N/A"}
                            </p>
                            <p>
                                <strong>Degree:</strong> {fixer.degree || "N/A"}
                            </p>
                            <p>
                                <strong>University:</strong> {fixer.university || "N/A"}
                            </p>
                            <p>
                                <strong>Graduation Year:</strong>{" "}
                                {fixer.graduationYear || "N/A"}
                            </p>
                            <p>
                                <strong>Previous Role:</strong> {fixer.previousRole || "N/A"}
                            </p>
                            <p>
                                <strong>Duration:</strong> {fixer.duration || "N/A"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">Fixer not found.</p>
                )}
            </div>

            <Footer />
        </div>
    );
}