"use client";
import React, { useState } from "react";

const ProfilePage = () => {
  const userId = 1;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5001/api/userProfile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
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
          className="mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-orange-600 transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default ProfilePage;
