"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MakeRequest() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    urgency: "",
    date: "",
    minBudget: "",
    maxBudget: "",
    notify: false,
  });

  const [message, setMessage] = useState(""); // For user feedback
  const [error, setError] = useState(""); // Error state

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to submit request
  const submitRequest = async () => {
    setMessage("");
    setError("");
  
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  
    // ✅ Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }
  
    const requestData = {
      client_id: localStorage.getItem("userId"), // Get userId from localStorage
      title: formData.title,
      description: formData.description,
      location: formData.location,
      urgency: formData.urgency,
      date: formData.date,
      min_budget: formData.minBudget ? parseFloat(formData.minBudget) : null,
      max_budget: formData.maxBudget ? parseFloat(formData.maxBudget) : null,
      notify: formData.notify,
    };
  
    try {
      console.log("📡 Sending request with token:", token);
      console.log("📡 Request Data:", requestData);
  
      const response = await fetch(`${API_URL}/api/job-postings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Attach token here
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log("📩 Server Response:", data);
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }
  
      setMessage("✅ Job request submitted successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        urgency: "",
        date: "",
        minBudget: "",
        maxBudget: "",
        notify: false,
      });
    } catch (error) {
      console.error("❌ Submission Error:", error);
      setError(error.message);
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold flex items-center">
          <span className="mr-2">🔧</span> New Repair Request
        </h2>

        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Repair Title */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Repair Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-2 rounded"
            placeholder="Enter repair title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Issue Description */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Issue Description</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded h-24"
            placeholder="Describe your issue"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Select Location */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Select Location</label>
          <select
            name="location"
            className="w-full border p-2 rounded"
            value={formData.location}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="central">Central</option>
            <option value="north">North</option>
            <option value="northeast">North-East</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>

        {/* Urgency Level */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Urgency Level</label>
          <select
            name="urgency"
            className="w-full border p-2 rounded"
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Select Date */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Select Date</label>
          <input
            type="date"
            name="date"
            className="w-full border p-2 rounded"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* Budget Range */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Budget Range</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="minBudget"
              className="border p-2 rounded w-1/2"
              placeholder="Min. $"
              value={formData.minBudget}
              onChange={handleChange}
            />
            <input
              type="text"
              name="maxBudget"
              className="border p-2 rounded w-1/2"
              placeholder="Max. $"
              value={formData.maxBudget}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notification Toggle */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            name="notify"
            className="h-5 w-5 text-orange-500"
            checked={formData.notify}
            onChange={handleChange}
          />
          <label>Notify me when a bid is received</label>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            className="bg-orange-500 text-white px-6 py-3 rounded w-full"
            onClick={submitRequest}
          >
            Submit
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
