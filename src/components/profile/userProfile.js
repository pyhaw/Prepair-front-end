"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Check login status and fetch user data
  useEffect(() => {
    const checkLoginAndFetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      alert(`User ID from localStorage: ${userId}`);

      if (!token || !userId) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token
        const authResponse = await fetch(`${API_URL}/api/auth/verify`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!authResponse.ok) {
          console.warn("Invalid token. Logging out...");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        setIsLoggedIn(true);

        // Fetch user profile data
        try {
          const profileResponse = await fetch(
            `${API_URL}/api/userProfile/${userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (profileResponse.ok) {
            const userData = await profileResponse.json();

            // Update form with existing user data
            setFormData((prevData) => ({
              ...prevData,
              name: userData.name || "",
              email: userData.email || "",
              phone: userData.phone || "",
              jobTitle: userData.jobTitle || "",
              company: userData.company || "",
              experience: userData.experience || "",
              skills: userData.skills || "",
              degree: userData.degree || "",
              university: userData.university || "",
              graduationYear: userData.graduationYear || "",
              previousRole: userData.previousRole || "",
              duration: userData.duration || "",
            }));
          } else {
            console.log("No existing profile data found or not yet created");
            // Keep default empty values as placeholders
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          // Continue with empty form data as fallback
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error during authentication check:", error);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };

    checkLoginAndFetchData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const endpoint = `${API_URL}/api/userProfile/${userId}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      console.log(userId);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading message while checking authentication or loading data
  if (isLoggedIn === null || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-lg">Loading profile data...</p>
      </div>
    );
  }

  // Show login message if user is not authenticated
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please Log in first to view your profile page
          </h1>
          <button
            onClick={() => router.push("/login")}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render profile page when logged in
  return (
    <section className="pt-32 text-center px-6">
      <h2 className="text-4xl font-bold text-gray-900">Profile Page</h2>
      <form className="mt-8 max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className="profile-section">
          <h3 className="text-xl font-bold text-gray-800">
            Personal Information
          </h3>
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
          <h3 className="text-xl font-bold text-gray-800">
            Professional Information
          </h3>
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
          disabled={isLoading}
          className={`mt-6 ${
            isLoading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          } text-white py-3 px-6 rounded-lg text-lg transition`}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
};

export default ProfilePage;
