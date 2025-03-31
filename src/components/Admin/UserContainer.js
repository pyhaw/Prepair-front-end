"use client";

import React, { useState } from "react";

// UserContainer Component
const UserContainer = ({ role, users, onDeleteSuccess }) => {
  // State to manage the confirmation popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Function to handle user deletion
  const handleDelete = async (userId) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const response = await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user.");
      }

      // Success - call the callback to refresh the user list
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Function to open the confirmation popup
  const openConfirmPopup = (user) => {
    setUserToDelete(user);
    setShowConfirmPopup(true);
  };

  // Function to close the confirmation popup
  const closeConfirmPopup = () => {
    setUserToDelete(null);
    setShowConfirmPopup(false);
  };

  // Function to handle creating a new admin account
  const handleCreateAdmin = () => {
    // Redirect to a page for creating a new admin account
    window.location.href = "/admin/create-admin"; // Adjust the route as needed
  };

  return (
    <div className="mb-8">
      {/* Role Header */}
      <div className="flex items-center justify-start space-x-2 mb-4">
        <h3 className="text-2xl font-bold text-black">
          {role === "fixer" && "🔧 Fixers"}
          {role === "client" && "💼 Clients"}
          {role === "admin" && "🔒 Admins"}
        </h3>
        {/* Add "+" Button for Admins */}
        {role === "admin" && (
          <button
            onClick={handleCreateAdmin}
            className="w-8 h-8 bg-orange-500 text-white text-xl font-bold rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-200"
          >
            +
          </button>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const loggedInUserId = localStorage.getItem("userId");
          const isCurrentUser = String(user.id) === loggedInUserId;

          return (
            <div
              key={user.id}
              className="border p-4 rounded shadow-md bg-gray-100 transition-transform duration-300 hover:scale-105 relative"
            >
              {/* User Details */}
              <h4 className="text-lg font-bold text-black">{user.username}</h4>
              <p className="text-black">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-black">
                <strong>Role:</strong> {user.role}
              </p>

              {/* Delete Button (for all users except myself) */}
              {!isCurrentUser && (
                <button
                  onClick={() => openConfirmPopup(user)}
                  className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Popup */}
      {showConfirmPopup && userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete user <strong>{userToDelete.username}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeConfirmPopup}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(userToDelete.id); // Call the delete function
                  closeConfirmPopup();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContainer;