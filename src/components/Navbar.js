"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/Admin/AdminNavBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track admin status

  // ✅ Check login and admin status from BACKEND
  useEffect(() => {
    const verifyLoginAndAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setIsAdmin(false); // Ensure admin status is reset
        return;
      }

      try {
        // Verify login
        const loginResponse = await fetch(
          "http://localhost:5001/api/auth/verify",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (loginResponse.ok) {
          setIsLoggedIn(true);

          // Verify admin status
          const adminResponse = await fetch(
            "http://localhost:5001/api/admin/verify",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (adminResponse.ok) {
            setIsAdmin(true); // User is an admin
          } else {
            setIsAdmin(false); // User is not an admin
          }
        } else {
          console.warn("Invalid token. Logging out...");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setIsAdmin(false); // Reset admin status
        }
      } catch (error) {
        console.error("Error verifying token or admin status:", error);
        setIsLoggedIn(false);
        setIsAdmin(false); // Reset admin status
      }
    };
    verifyLoginAndAdmin();
  }, []);

  // ✅ Logout function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found. Already logged out.");
        return;
      }

      // Call the logout endpoint
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear the token and role from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      // Redirect to the login page
      window.location.href = "/LoginPage";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // ✅ Conditional rendering of AdminNavbar or Regular Navbar
  if (isAdmin) {
    return <AdminNavbar />;
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/FIF.png"
              alt="Prepair Logo"
              width={180}
              height={60}
              priority
            />
          </Link>
        </div>

        {/* Right Section: Navigation Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
          >
            <Link href="/activeJobs">Active Jobs</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
          >
            <Link href="/discussion">Discussion</Link>
          </Button>

          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
          >
            <Link href="/requests">View Requests</Link>
          </Button>

          {isLoggedIn ? (
            <>
              {/* ✅ Show View Profile button when logged in */}
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
              >
                <Link href="/profilePage">View Profile</Link>
              </Button>

              {/* ✅ Logout Button */}
              <Button
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-red-600 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* ✅ Register Button */}
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
              >
                <Link href="/SignUpPage">Register</Link>
              </Button>
            </>
          )}

          <Button className="bg-green-500 text-white hover:bg-green-600 rounded-lg text-lg px-5 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg">
            <Link href="/make-request">Make a Request</Link>
          </Button>

          {/* New Button: Ask Pairy the Chatbot */}
          <Button className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-lg px-5 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg">
            <Link href="/chatbot">Ask Pairy the Chatbot</Link>
          </Button>

          {!isLoggedIn && (
            <Button
              variant="outline"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
            >
              <Link href="/LoginPage">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={36} /> : <Menu size={36} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link
              href="/discussion"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Discussion
            </Link>
            <Link
              href="/requests"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              View Requests
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/profilePage"
                  className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 text-left text-lg font-medium py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/SignUpPage"
                className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            )}
            <Link
              href="/make-request"
              className="text-orange-500 hover:text-orange-700 text-lg font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Make a Request
            </Link>
            {/* Mobile menu link for Ask Pairy the Chatbot */}
            <Link
              href="/chatbot"
              className="text-blue-500 hover:text-blue-700 text-lg font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Ask Pairy the Chatbot
            </Link>
            {!isLoggedIn && (
              <Link
                href="/LoginPage"
                className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
