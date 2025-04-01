"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import UserContainer from "@/components/Admin/UserContainer";

export default function AllUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Memoized fetch function
  const fetchUsers = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      if (role !== "admin") {
        router.push("/");
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [router]); // Dependencies

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Helper function to group users by role
  const groupUsersByRole = () => {
    const grouped = {
      fixer: [],
      client: [],
      admin: [],
    };

    // Ensure `users` is an array before iterating
    if (Array.isArray(users)) {
      users.forEach((user) => {
        if (grouped[user.role]) {
          grouped[user.role].push(user);
        }
      });
    }

    return grouped;
  };

  const groupedUsers = groupUsersByRole();

  return (
    <div className="flex-1 max-w-6xl mx-auto mt-32 p-6">
      <h2 className="text-4xl font-bold mb-6 text-black">👥 All Users</h2>

      {loading && <p className="text-black">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <UserContainer
        role="admin"
        users={groupedUsers.admin}
        onDeleteSuccess={fetchUsers}
      />

      <UserContainer
        role="fixer"
        users={groupedUsers.fixer}
        onDeleteSuccess={fetchUsers}
      />
      <UserContainer
        role="client"
        users={groupedUsers.client}
        onDeleteSuccess={fetchUsers}
      />
    </div>
  );
}