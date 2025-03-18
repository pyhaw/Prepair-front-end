"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

const ExpertProfile = ({ user = {}, editable = true }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName || "",
        location: user.location || "",
        phone: user.phone || "",
        email: user.email || "",
        experience: user.experience || "",
        serviceArea: user.serviceArea || "",
        availability: user.availability || "",
        aboutMe: user.aboutMe || "",
        specialisations: user.specialisations?.join(", ") || "",
        certifications: user.certifications?.join(", ") || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Profile:", formData);
        // Add API call to save the updated profile data
    };

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white min-h-screen text-black mt-40">
            <Navbar />
            <h1 className="text-3xl font-bold mb-6 text-center"> My Profile</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Section */}
                <Card className="p-6 bg-gray-100 rounded-lg shadow-md">
                    <div className="relative flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                        <Edit2 className="absolute top-2 right-2 cursor-pointer" />
                    </div>
                    <CardContent className="flex flex-col gap-4 text-sm">
                        <label className="font-semibold text-orange-500">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="border p-2 rounded w-full" />

                        <label className="font-semibold text-orange-500">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="border p-2 rounded w-full" />

                        <label className="font-semibold text-orange-500">Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border p-2 rounded w-full" />

                        <label className="font-semibold text-orange-500">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded w-full" />
                    </CardContent>
                </Card>

                {/* About Me Section */}
                <Card className="p-6 bg-white rounded-lg shadow-md">
                    <label className="font-semibold text-orange-500">About Me</label>
                    <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} className="border p-2 rounded w-full h-32"></textarea>
                </Card>

                {/* Experience & Service Area */}
                <Card className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold text-orange-500">Years of Experience</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="border p-2 rounded w-full" />
                        </div>
                        <div>
                            <label className="font-semibold text-orange-500">Service Area</label>
                            <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleChange} className="border p-2 rounded w-full" />
                        </div>
                    </div>

                    <label className="font-semibold text-orange-500">Availability</label>
                    <input type="text" name="availability" value={formData.availability} onChange={handleChange} className="border p-2 rounded w-full" />
                </Card>

                {/* Specialisation & Certifications */}
                <Card className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
                    <label className="font-semibold text-orange-500">Specialisation (comma-separated)</label>
                    <input type="text" name="specialisations" value={formData.specialisations} onChange={handleChange} className="border p-2 rounded w-full" />

                    <label className="font-semibold text-orange-500">Certifications / Licenses (comma-separated)</label>
                    <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} className="border p-2 rounded w-full" />
                </Card>

                {/* Action Buttons */}
                <div className="col-span-2 flex justify-center gap-4 mt-6">
                    <Button type="submit" className="bg-green-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">Save Changes</Button>
                    <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg" onClick={() => window.history.back()}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default ExpertProfile;