"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState(""); // State for email input
  const [otp, setOtp] = useState(["", "", "", ""]); // State for OTP digits (4 inputs)
  const [password, setPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [error, setError] = useState(""); // State to manage error messages
  const [success, setSuccess] = useState(false); // State to indicate successful OTP request
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent
  const [isOtpVerified, setIsOtpVerified] = useState(false); // State to track if OTP is verified
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to show success message

  // Function to handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setSuccess(false); // Reset success state

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    console.log("Submitting to:", `${API_URL}/api/forgot-password`);

    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      const data = await response.json();
      console.log("OTP Sent Successfully:", data);

      // Indicate success and show OTP verification form
      setSuccess(true);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      setError(error.message);
    }
  };

  // Function to handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    console.log("Verifying OTP at:", `${API_URL}/api/verifyOtp`);

    try {
      const otpString = otp.join("");
      const response = await fetch(`${API_URL}/api/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      const data = await response.json();
      console.log("OTP Verified Successfully:", data);

      // Show the Change Password form
      setIsOtpVerified(true);
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setError(error.message);
    }
  };

  // Function to handle password reset
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    console.log("Resetting password at:", `${API_URL}/api/reset-password`);

    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      const data = await response.json();
      console.log("Password Reset Successfully:", data);

      // Display success message
      setShowSuccessMessage(true);

      // Redirect to LoginPage after 3 seconds
      setTimeout(() => {
        router.push("/LoginPage");
      }, 3000);
    } catch (error) {
      console.error("Error resetting password:", error.message);
      setError(error.message);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }

    setOtp(newOtp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-900 p-8 shadow-lg rounded-lg w-full max-w-md">
        {/* Dynamic Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          {isOtpVerified ? "Reset Password" : isOtpSent ? "Enter OTP" : "Forgot Password"}
        </h2>

        {/* Success Message for OTP Sent */}
        {success && !isOtpSent && (
          <p className="text-green-500 text-sm mb-4 text-center">
            OTP has been sent to your email. Please check your inbox.
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Success Message for Password Reset */}
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
            <span className="block sm:inline">Password successfully changed! Redirecting to login page...</span>
          </div>
        )}

        {/* Email Input Form */}
        {!isOtpSent && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              required
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600 py-3"
            >
              Send OTP
            </Button>
          </form>
        )}

        {/* OTP Verification Form */}
        {isOtpSent && !isOtpVerified && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-between space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-1/4 p-3 text-center border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:border-orange-500"
                  autoComplete="off"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600 py-3"
            >
              Verify OTP
            </Button>
          </form>
        )}

        {/* Change Password Form */}
        {isOtpVerified && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              required
            />

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600 py-3"
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;