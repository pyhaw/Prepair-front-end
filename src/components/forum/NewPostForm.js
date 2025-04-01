"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

const NewPostForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
  });

  const [imageFiles, setImageFiles] = useState([]); // Cloudinary URLs
  const [imagePreviews, setImagePreviews] = useState([]); // Local preview URLs
  const [uploadMessage, setUploadMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setError("Title and description are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post a discussion.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          images: imageFiles, // Array of Cloudinary URLs
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to create post");
      }

      router.push(`/discussion`);
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-10">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Create New Discussion
        </h1>

        {/* Dropzone with preview */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600">
              Drag & drop images here or{" "}
              <label htmlFor="postImages" className="text-orange-600 underline cursor-pointer">
                click to browse
              </label>
            </p>
            <input
              type="file"
              id="postImages"
              name="postImages"
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
        </div>

        {/* Error Box */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="What's your question or topic?"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Provide more details about your question or topic..."
              rows="5"
              required
            ></textarea>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="general">General Discussions</option>
              <option value="plumbing">Plumbing & Repairs</option>
              <option value="interior">Interior Design</option>
              <option value="diy">DIY Projects</option>
              <option value="renovations">Renovations</option>
              <option value="smart-home">Smart Home</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Creating Post..." : "Create Discussion"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewPostForm;
