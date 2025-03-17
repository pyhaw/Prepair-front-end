"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Profile() {
    const [user, setUser] = useState({
        profileImage: "https://via.placeholder.com/150", // Placeholder image
        fullName: "Zack Tan",
        location: "South-East",
        phone: "912345678",
        email: "zack@gmail.com",
        lastOnline: "34 Days ago",
        categories: ["Plumbing", "Electrical Works", "Home Renovation"],
        rating: "4.5 / 5",
    });

    const [editing, setEditing] = useState(false);
    const [editingRequests, setEditingRequests] = useState(false);

    // Handle profile image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUser({ ...user, profileImage: imageUrl });
        }
    };

    // Handle input field changes
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Toggle editing mode
    const toggleEdit = () => setEditing(!editing);
    const toggleEditRequests = () => setEditingRequests(!editingRequests);

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto mt-32 p-6">
                <h2 className="text-4xl font-bold mb-6">My Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Section */}
                    <div className="border p-4 rounded shadow-md bg-gray-100 text-center">
                        <h3 className="font-bold text-lg">Profile</h3>
                        <div className="relative mt-2">
                            <div className="w-32 h-32 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center mx-auto overflow-hidden">
                                {user.profileImage ? (
                                    <img src={user.profileImage} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span className="text-gray-500 text-sm text-center">Profile Picture</span>
                                )}
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="mt-4 text-left">
                            {editing ? (
                                <>
                                    <label className="block font-semibold">Full Name:</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={user.fullName}
                                        onChange={handleChange}
                                        className="border p-2 rounded w-full"
                                    />
                                    <label className="block font-semibold mt-2">Location:</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={user.location}
                                        onChange={handleChange}
                                        className="border p-2 rounded w-full"
                                    />
                                    <label className="block font-semibold mt-2">Phone Number:</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                        className="border p-2 rounded w-full"
                                    />
                                    <label className="block font-semibold mt-2">Email Address:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        className="border p-2 rounded w-full"
                                    />
                                    <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={toggleEdit}>
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold">
                                        <span className="text-orange-500">Full Name:</span> {user.fullName}
                                    </p>
                                    <p className="font-semibold">
                                        <span className="text-orange-500">Location:</span> {user.location}
                                    </p>
                                    <p className="font-semibold">
                                        <span className="text-orange-500">Phone Number:</span> {user.phone}
                                    </p>
                                    <p className="font-semibold">
                                        <span className="text-orange-500">Email Address:</span> {user.email}
                                    </p>
                                    <p className="text-gray-600">Last Online: {user.lastOnline}</p>
                                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={toggleEdit}>
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Requests & Rating Section */}
                    <div className="border p-4 rounded shadow-md bg-gray-100 relative">
                        <button onClick={toggleEditRequests} className="absolute top-2 right-2 text-gray-600 hover:text-black">
                            ✏️
                        </button>
                        <h3 className="font-bold text-lg">Current Number of Requests: {user.categories.length}</h3>
                        {editingRequests ? (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={user.categories.join(", ")}
                                    onChange={(e) => setUser({ ...user, categories: e.target.value.split(", ") })}
                                />
                                <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded" onClick={toggleEditRequests}>
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.categories.map((category, index) => (
                                    <span key={index} className="bg-orange-500 text-white px-3 py-1 rounded">
                                        {category}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h3 className="font-bold mt-4">Customer Rating:</h3>
                        <p>{user.rating}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button className="bg-red-600 text-white px-6 py-3 rounded">Logout</button>
                </div>
            </div>

            <Footer />
        </div>
    );
}