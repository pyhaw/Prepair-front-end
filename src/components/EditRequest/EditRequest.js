"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { Upload, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function EditRequest() {
  const [message, setMessage] = useState("");
  const [errorFields, setErrorFields] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
  const [formData, setFormData] = useState({
    id: "",
    client_id: "",
    title: "N/A",
    description: "N/A",
    location: "N/A",
    urgency: "N/A",
    date: "",
    min_budget: "N/A",
    max_budget: "N/A",
    notify: false,
    jobStatus: "",
  });

  useEffect(() => {
    const dateFromParams = searchParams.get("date");
    const formattedDate = dateFromParams
      ? new Date(dateFromParams).toISOString().split("T")[0]
      : "";

    const encodedImages = searchParams.get("images");
    let parsedImages = [];

    try {
      parsedImages = encodedImages
        ? JSON.parse(decodeURIComponent(encodedImages))
        : [];
    } catch (err) {
      console.error("❌ Failed to parse images from query params", err);
    }

    // Set form data
    setFormData({
      id: searchParams.get("id") || "",
      client_id: searchParams.get("client_id"),
      title: searchParams.get("title") || "N/A",
      description: searchParams.get("description") || "N/A",
      location: searchParams.get("location") || "N/A",
      urgency: searchParams.get("urgency") || "N/A",
      date: formattedDate || "",
      min_budget: parseFloat(searchParams.get("min_budget")) || "N/A",
      max_budget: parseFloat(searchParams.get("max_budget")) || "N/A",
      notify: searchParams.get("notify") === "true",
      jobStatus: searchParams.get("status") || "",
    });

    // Set image state
    setImageFiles(parsedImages); // used when saving
    setImagePreviews(parsedImages); // used for UI preview
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrorFields({ ...errorFields, [name]: false });
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

  useEffect(() => {
    console.log(imageFiles);
  }, [imageFiles]);

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const editRequest = async () => {
    console.log("EDITING");
    const token = localStorage.getItem("token");
    const requestData = {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      urgency: formData.urgency,
      date: formData.date,
      min_budget: formData.min_budget ? parseFloat(formData.min_budget) : null,
      max_budget: formData.max_budget ? parseFloat(formData.max_budget) : null,
      notify: formData.notify,
      images: imageFiles,
    };

    console.log(imageFiles);

    try {
      const response = await fetch(`${API_URL}/api/edit-postings`, {
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
      router.push(`/activeJobs`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Fetch user data and token on component mount
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-32 p-6">
        <h2 className="text-4xl font-bold text-black text-center mb-5">
          Edit Repair Request
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
              <label
                htmlFor="uploadImage"
                className="text-orange-600 underline cursor-pointer"
              >
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

        {message && (
          <p className="text-green-600 mt-4 text-center">{message}</p>
        )}
        {/* Form Fields */}
        <div className="mt-6">
          <label className="block font-semibold mb-1 text-black">
            Repair Title
          </label>
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
          <label className="block font-semibold mb-1 text-black">
            Issue Description
          </label>
          <textarea
            name="description"
            className={`w-full border p-2 rounded h-24 text-black bg-white ${
              errorFields.description
                ? "border-red-600 border-2"
                : "border-gray-300"
            }`}
            placeholder="Describe your issue"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">
            Select Location
          </label>
          <select
            name="location"
            className={`w-full border p-2 rounded text-black bg-white ${
              errorFields.location
                ? "border-red-600 border-2"
                : "border-gray-300"
            }`}
            value={formData.location}
            onChange={handleChange}
          >
            <option value="central">Central</option>
            <option value="north">North</option>
            <option value="northeast">North-East</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">
            Urgency Level
          </label>
          <select
            name="urgency"
            className={`w-full border p-2 rounded text-black bg-white ${
              errorFields.urgency
                ? "border-red-600 border-2"
                : "border-gray-300"
            }`}
            value={formData.urgency}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1 text-black">
            Select Date
          </label>
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
          <label className="block font-semibold mb-1 text-black">
            Budget Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="min_budget"
              className={`border p-2 rounded w-1/2 text-black bg-white ${
                errorFields.minBudget
                  ? "border-red-600 border-2"
                  : "border-gray-300"
              }`}
              placeholder="Min. $"
              value={formData.min_budget}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="number"
              name="max_budget"
              className={`border p-2 rounded w-1/2 text-black bg-white ${
                errorFields.maxBudget
                  ? "border-red-600 border-2"
                  : "border-gray-300"
              }`}
              placeholder="Max. $"
              value={formData.max_budget}
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
            className="bg-orange-500 text-white px-6 py-3 rounded w-full border border-orange-500 hover:bg-orange-600"
            onClick={editRequest}
          >
            Edit
          </button>

          <button
            onClick={() => router.back()}
            className=" bg-gray-400 text-white px-6 py-3 rounded w-full border border-gray-400 hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
