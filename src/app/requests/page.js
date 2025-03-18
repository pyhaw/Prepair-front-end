"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

export default function Requests() {
  // Sample repair requests (replace with API later)
  const [requests] = useState([
    { id: 1, category: "Plumbing", location: "Central", urgency: "High", budget: "$100 - $300", description: "Leaky pipe in kitchen." },
    { id: 2, category: "Electrical", location: "East", urgency: "Medium", budget: "$50 - $200", description: "Installing new light fixtures." },
    { id: 3, category: "Structural", location: "West", urgency: "Low", budget: "$500 - $1000", description: "Crack in ceiling needs fixing." },
    { id: 4, category: "Plumbing", location: "North", urgency: "High", budget: "$80 - $250", description: "Clogged drain in bathroom." },
    { id: 5, category: "Carpentry", location: "Northeast", status: "In Progress", budget: "$300 - $700", description: "Built-in wardrobe repair." },
    { id: 6, category: "Roofing", location: "West", status: "Completed", budget: "$1000 - $3000", description: "Leaky roof during rain." },
  ]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold mb-6">🔧 Open Repair Requests</h2>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="border p-4 rounded shadow-md bg-gray-100">
              <h3 className="text-xl font-bold">{request.category}</h3>
              <p className="text-gray-600">{request.description}</p>
              <p><strong>📍 Location:</strong> {request.location}</p>
              <p><strong>⚡ Urgency:</strong> {request.urgency}</p>
              <p><strong>💰 Budget:</strong> {request.budget}</p>
              {/* ✅ Clicking View Details navigates to /requests/[id] */}
              <Link href={`/requests/${request.id}`} className="mt-2 bg-orange-500 text-white px-4 py-2 rounded w-full block text-center">
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

