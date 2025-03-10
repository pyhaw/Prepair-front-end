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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login Success:", data);

      // ✅ Store the token for future authentication
      // ✅ Ensure userId is correctly stored and retrieved
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user);
      // ✅ Retrieve it from localStorage before using it
      const userId = localStorage.getItem("userId");
      alert(`User ID from localStorage: ${userId}`);

      // ✅ Redirect to /discussion after successful login
      router.push("/discussion");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Failed to Login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-900 p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Login
        </h2>
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
