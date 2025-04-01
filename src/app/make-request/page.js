"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { Upload, X } from "lucide-react";

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

  const [message, setMessage] = useState("");
  const [errorFields, setErrorFields] = useState({});

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrorFields({ ...errorFields, [name]: false });
  };

  const validateFields = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "notify" && !formData[key].trim()) {
        errors[key] = true;
      }
    });
    setErrorFields(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    processFiles(files);
  };

  const processFiles = async (files) => {
    setUploadMessage("");
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previewUrls]);

    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await axios.post(CLOUDINARY_UPLOAD_URL, data);
        return res.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImageFiles((prev) => [...prev, ...uploadedUrls]);
      setUploadMessage("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Failed to upload one or more images.");
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submitRequest = async () => {
    setMessage("");
    if (!validateFields()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorFields({ token: true });
      return;
    }

    const requestData = {
      client_id: localStorage.getItem("userId"),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      urgency: formData.urgency,
      date: formData.date,
      min_budget: formData.minBudget ? parseFloat(formData.minBudget) : null,
      max_budget: formData.maxBudget ? parseFloat(formData.maxBudget) : null,
      notify: formData.notify,
      images: imageFiles,
    };

    try {
      const response = await fetch(`${API_URL}/api/job-postings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setMessage("Job request submitted successfully!");
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
      setImagePreviews([]);
      setImageFiles([]);
      setErrorFields({});
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold text-black text-center mb-5">
          New Repair Request
        </h2>

        {/* Upload Section */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              Drag & drop images here or{" "}
              <label htmlFor="uploadImage" className="text-orange-600 underline cursor-pointer">
                click to browse
              </label>
            </p>
            <input
              type="file"
              id="uploadImage"
              name="uploadImage"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          <div className="overflow-x-auto whitespace-nowrap flex gap-4 py-2">
            {imagePreviews.length === 0 ? (
              <div className="w-full h-32 flex items-center justify-center text-gray-400">
                <Upload className="w-6 h-6" />
              </div>
            ) : (
              imagePreviews.map((preview, index) => (
                <div key={index} className="relative inline-block">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {uploadMessage && (
            <p
              className={`text-sm mt-2 ${
                uploadMessage.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {uploadMessage}
            </p>
          )}
        </div>

        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {Object.keys(errorFields).length > 0 && (
          <p className="text-red-600 text-center mt-2">
            Please fill in all required fields.
          </p>
        )}

        {/* Form Fields */}
        <div className="mt-6">
          <label className="block font-semibold mb-1 text-black">Repair Title</label>
          <input
            type="text"
            name="title"
            className={`w-full border p-2 rounded text-black bg-white ${
              errorFields.title ? "border-red-600 border-2" : "border-gray-300"
            }`}
            placeholder="Enter repair title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">Issue Description</label>
          <textarea
            name="description"
            className={`w-full border p-2 rounded h-24 text-black bg-white ${
              errorFields.description ? "border-red-600 border-2" : "border-gray-300"
            }`}
            placeholder="Describe your issue"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">Select Location</label>
          <select
            name="location"
            className={`w-full border p-2 rounded text-black bg-white ${
              errorFields.location ? "border-red-600 border-2" : "border-gray-300"
            }`}
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

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">Urgency Level</label>
          <select
            name="urgency"
            className={`w-full border p-2 rounded text-black bg-white ${
              errorFields.urgency ? "border-red-600 border-2" : "border-gray-300"
            }`}
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">Select Date</label>
          <input
            type="date"
            name="date"
            className={`w-full border p-2 rounded text-black bg-white ${
              errorFields.date ? "border-red-600 border-2" : "border-gray-300"
            }`}
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">Budget Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minBudget"
              className={`border p-2 rounded w-1/2 text-black bg-white ${
                errorFields.minBudget ? "border-red-600 border-2" : "border-gray-300"
              }`}
              placeholder="Min. $"
              value={formData.minBudget}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="number"
              name="maxBudget"
              className={`border p-2 rounded w-1/2 text-black bg-white ${
                errorFields.maxBudget ? "border-red-600 border-2" : "border-gray-300"
              }`}
              placeholder="Max. $"
              value={formData.maxBudget}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            name="notify"
            className="h-5 w-5 text-orange-500"
            checked={formData.notify}
            onChange={handleChange}
          />
          <label className="text-black">Notify me when a bid is received</label>
        </div>

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
