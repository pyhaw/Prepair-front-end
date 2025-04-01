"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [error, setError] = useState(""); // State to manage error messages
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the admin token for authorization
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      const data = await response.json();
      console.log("Admin Creation Success:", data);

      // Redirect to /all-users after successful creation
      router.push("/admin/users");
    } catch (error) {
      console.error("Admin Creation Error:", error.message);
      setError(error.message); // Set the error message to display below the form
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-900 p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create New Admin
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            required
          />

          <Button
            type="submit"
            className="w-full bg-orange-500 text-white hover:bg-orange-600 py-3"
          >
            Create Admin
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;