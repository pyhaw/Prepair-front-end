"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FixersPage() {
    const router = useRouter();
    const [fixers, setFixers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    useEffect(() => {
        const fetchFixers = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/api/fixers`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch fixers");
                }

                const data = await response.json();
                setFixers(data);
            } catch (err) {
                console.error("Error fetching fixers:", err);
                setError("Failed to load fixers.");
            } finally {
                setLoading(false);
            }
        };

        fetchFixers();
    }, []);

    const filteredFixers = fixers.filter((fixer) =>
        (fixer.name || fixer.username || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Navbar />

            <div className="max-w-6xl mx-auto mt-32 p-6">
                <h2 className="text-4xl font-bold mb-6 text-black">🔧 Our Fixers</h2>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, username, or skills..."
                        className="w-full border p-2 rounded text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading && <p className="text-black">Loading fixers...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFixers.length === 0 && !loading && !error ? (
                        <p className="text-black col-span-full text-center">
                            No matching fixers found.
                        </p>
                    ) : (
                        filteredFixers.map((fixer) => (
                            <div
                                key={fixer.id}
                                className="border p-4 rounded shadow-md bg-gray-100"
                            >
                                <img
                                    src={fixer.profilePicture || "/default-avatar.png"}
                                    alt={fixer.name || fixer.username}
                                    className="w-24 h-24 rounded-full mx-auto object-cover"
                                />
                                <h3 className="text-xl font-bold text-center text-black mt-4">
                                    {fixer.name || fixer.username}
                                </h3>
                                <p className="text-center text-black text-sm">
                                    {fixer.jobTitle || "Fixer"}
                                </p>

                                <button
                                    className="mt-4 bg-orange-500 text-white px-4 py-2 rounded w-full block text-center hover:bg-orange-600"
                                    onClick={() => router.push(`/fixers/${fixer.id}`)}
                                >
                                    View Profile
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}