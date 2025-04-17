"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // Track admin profile picture
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [userId, setUserId] = useState(null);

  // Check login status and fetch profile picture
  useEffect(() => {
    const verifyLoginAndFetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      setUserId(userId);
      if (!token || !userId) {
        setIsLoggedIn(false);
        return;
      }

      try {
        // Verify token
        const authResponse = await fetch(
          "http://localhost:5001/api/auth/verify",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (authResponse.ok) {
          setIsLoggedIn(true);

          // Fetch admin profile data to get profile picture
          const profileResponse = await fetch(
            `http://localhost:5001/api/userProfile/${userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (profileResponse.ok) {
            const userData = await profileResponse.json();
            setProfilePicture(userData.profilePicture || null); // Set profile picture URL
          }
        } else {
          console.warn("Invalid token. Logging out...");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying token or fetching profile:", error);
        setIsLoggedIn(false);
      }
    };

    verifyLoginAndFetchData();
  }, []);

  // Logout function
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

      // Clear the token from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      // Redirect to the login page
      window.location.href = "/LoginPage";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/FIF.jpg" // ✅ Remove "public"
              alt="Prepair Logo"
              width={60}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Right Section: Navigation Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
            asChild
          >
            <Link href="/admin/users">Users</Link>
          </Button>

          {userId && (
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-lg px-5 py-2.5 flex items-center gap-2"
              asChild
            >
              <Link href={`/chatPage?me=${userId}`}>💬 Chat</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
            asChild
          >
            <Link href="/fixers">Fixers</Link>
          </Button>

          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
            asChild
          >
            <Link href="/admin/jobs">Jobs</Link>
          </Button>

          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5 transition-all duration-200"
            asChild
          >
            <Link href="/discussion">Discussion</Link>
          </Button>

          {/* Profile Picture Dropdown */}
          {isLoggedIn && (
            <div className="relative ml-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">👤</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="py-2">
                    <Link
                      href="/profilePage"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              href="/admin/users"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Users
            </Link>
            <Link
              href="/admin/jobs"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Jobs
            </Link>
            <Link
              href="/discussion"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Discussion
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
