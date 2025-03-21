"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RequestDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const request = {
    title: searchParams.get("title") || "N/A",
    description: searchParams.get("description") || "N/A",
    location: searchParams.get("location") || "N/A",
    urgency: searchParams.get("urgency") || "N/A",
    date: searchParams.get("date") || "N/A",
    min_budget: searchParams.get("min_budget") || "N/A",
    max_budget: searchParams.get("max_budget") || "N/A",
    notify: searchParams.get("notify") === "true",
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-16 p-6">
        <h2 className="text-4xl font-bold text-black mb-6">Request Details</h2>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-black">Repair Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-black bg-white"
              value={request.title}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-black">Issue Description</label>
            <textarea
              className="w-full border p-2 rounded h-24 text-black bg-white"
              value={request.description}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-black">Select Location</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-black bg-white"
              value={request.location}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-black">Urgency Level</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-black bg-white"
              value={request.urgency}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-black">Select Date</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-black bg-white"
              value={request.date}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-black">Budget Range</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="border p-2 rounded w-1/2 text-black bg-white"
                value={request.min_budget !== "N/A" ? `$${request.min_budget}` : "N/A"}
                readOnly
              />
              <input
                type="text"
                className="border p-2 rounded w-1/2 text-black bg-white"
                value={request.max_budget !== "N/A" ? `$${request.max_budget}` : "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-5 w-5 text-orange-500"
              checked={request.notify}
              readOnly
            />
            <label className="text-black">Notify me when a bid is received</label>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
