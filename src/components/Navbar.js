"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/Admin/AdminNavBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null); // ✅ Track user ID

  // ✅ Check login and admin status
  useEffect(() => {
    const verifyLoginAndAdmin = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userId");

      if (id) setUserId(parseInt(id));
      if (!token) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      try {
        const loginResponse = await fetch("http://localhost:5001/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (loginResponse.ok) {
          setIsLoggedIn(true);

          const adminResponse = await fetch("http://localhost:5001/api/admin/verify", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          setIsAdmin(adminResponse.ok);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error verifying token or admin:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };
    verifyLoginAndAdmin();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      window.location.href = "/LoginPage";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAdmin) return <AdminNavbar />;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-lg px-5 py-2.5">
            <Link href="/activeJobs">Active Jobs</Link>
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-lg px-5 py-2.5">
            <Link href="/discussion">Discussion</Link>
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-lg px-5 py-2.5">
            <Link href="/requests">View Requests</Link>
          </Button>

          {/* ✅ Chat Button */}
          {isLoggedIn && userId && (
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-lg px-5 py-2.5 flex items-center gap-2"
            >
              <Link href={`/chatPage?me=${userId}`}>💬 Chat</Link>
            </Button>
          )}

          {isLoggedIn ? (
            <>
              <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-lg px-5 py-2.5">
                <Link href="/profilePage">View Profile</Link>
              </Button>
              <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 text-lg px-5 py-2.5">
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-lg px-5 py-2.5">
              <Link href="/SignUpPage">Register</Link>
            </Button>
          )}

          <Button className="bg-green-500 text-white hover:bg-green-600 text-lg px-5 py-2.5">
            <Link href="/make-request">Make a Request</Link>
          </Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-600 text-lg px-5 py-2.5">
            <Link href="/chatbot">Ask Pairy the Chatbot</Link>
          </Button>
          {!isLoggedIn && (
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 text-lg px-5 py-2.5">
              <Link href="/LoginPage">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
          {isOpen ? <X size={36} /> : <Menu size={36} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link href="/discussion" className="text-gray-700 hover:text-gray-900 text-lg" onClick={() => setIsOpen(false)}>
              Discussion
            </Link>
            <Link href="/requests" className="text-gray-700 hover:text-gray-900 text-lg" onClick={() => setIsOpen(false)}>
              View Requests
            </Link>

            {/* ✅ Mobile Chat Button */}
            {isLoggedIn && userId && (
              <Link
                href={`/chatPage?me=${userId}`}
                className="text-gray-700 hover:text-gray-900 text-lg flex items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                💬 Chat
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <Link href="/profilePage" className="text-gray-700 hover:text-gray-900 text-lg" onClick={() => setIsOpen(false)}>
                  View Profile
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-lg text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/SignUpPage" className="text-gray-700 hover:text-gray-900 text-lg" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            )}
            <Link href="/make-request" className="text-orange-500 hover:text-orange-700 text-lg" onClick={() => setIsOpen(false)}>
              Make a Request
            </Link>
            <Link href="/chatbot" className="text-blue-500 hover:text-blue-700 text-lg" onClick={() => setIsOpen(false)}>
              Ask Pairy the Chatbot
            </Link>
            {!isLoggedIn && (
              <Link href="/LoginPage" className="text-gray-700 hover:text-gray-900 text-lg" onClick={() => setIsOpen(false)}>
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
