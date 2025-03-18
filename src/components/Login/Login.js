"use client"; // ✅ Fix: Ensure this is the first line

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Login = () => {
  const router = useRouter(); // ✅ Initialize Next.js Router

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State to manage error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    console.log("Submitting to:", `${API_URL}/api/login`);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Parse the error response from the backend
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      const data = await response.json();
      console.log("Login Success:", data);

      // ✅ Store the token for future authentication
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user);

      // ✅ Redirect to /discussion after successful login
      router.push("/discussion");
    } catch (error) {
      console.error("Login Error:", error.message);
      setError(error.message); // Set the error message to display below the form
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-900 p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Login
          </Button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link href="/SignUpPage" className="text-orange-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;