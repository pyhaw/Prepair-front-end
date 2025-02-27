"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirecting users

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Check login state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    experience: "",
    skills: "",
    degree: "",
    university: "",
    graduationYear: "",
    previousRole: "",
    duration: "",
  });

  const router = useRouter();

  // ✅ Check login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          console.warn("Invalid token. Logging out...");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // ✅ Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/userProfile/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  // ✅ Show loading message while checking authentication
  if (isLoggedIn === null) {
    return <p className="text-center text-lg mt-10">Checking authentication...</p>;
  }

  // ✅ Show login message if user is not authenticated
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">
          Please Log in first to view your profile page
        </h1>
      </div>
    );
  }

  // ✅ Render profile page when logged in
  return (
    <section className="pt-32 text-center px-6">
      <h2 className="text-4xl font-bold text-gray-900">Profile Page</h2>
      <form className="mt-8 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="profile-section">
          <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="profile-section mt-6">
          <h3 className="text-xl font-bold text-gray-800">Professional Information</h3>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience (in years)"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="profile-section mt-6">
          <h3 className="text-xl font-bold text-gray-800">Skills</h3>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="profile-section mt-6">
          <h3 className="text-xl font-bold text-gray-800">Education</h3>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Degree"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            placeholder="University"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="Graduation Year"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="profile-section mt-6">
          <h3 className="text-xl font-bold text-gray-800">Experience</h3>
          <input
            type="text"
            name="previousRole"
            value={formData.previousRole}
            onChange={handleChange}
            placeholder="Previous Role"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration"
            className="mt-4 p-3 w-full rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-orange-600 transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default ProfilePage;
