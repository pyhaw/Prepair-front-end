"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    if (!token || !id) {
      setIsLoggedIn(false);
      return;
    }

    const verifyLogin = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setIsLoggedIn(true);
          setUserId(id);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setIsLoggedIn(false);
      }
    };

    verifyLogin();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    localStorage.clear();
    router.push("/LoginPage");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/FIF.png" alt="Prepair Logo" width={180} height={60} priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          <NavButton href="/activeJobs" label="Active Jobs" />
          <NavButton href="/discussion" label="Discussion" />
          <NavButton href="/requests" label="View Requests" />
          {isLoggedIn && (
            <>
              <NavButton href="/profilePage" label="View Profile" />
              <NavButton href={`/chatPage?me=${userId}`} label="Chat" />
            </>
          )}
          {!isLoggedIn ? (
            <>
              <NavButton href="/SignUpPage" label="Register" />
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50" asChild>
                <Link href="/LoginPage">Login</Link>
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-600 rounded-lg text-lg px-5 py-2.5"
            >
              Logout
            </Button>
          )}
          <Button className="bg-green-500 text-white hover:bg-green-600" asChild>
            <Link href="/make-request">Make a Request</Link>
          </Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-600" asChild>
            <Link href="/chatbot">Ask Pairy the Chatbot</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
          {isOpen ? <X size={36} /> : <Menu size={36} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-inner">
          <MobileLink href="/discussion" label="Discussion" setIsOpen={setIsOpen} />
          <MobileLink href="/requests" label="View Requests" setIsOpen={setIsOpen} />
          {isLoggedIn && (
            <>
              <MobileLink href="/profilePage" label="View Profile" setIsOpen={setIsOpen} />
              <MobileLink href={`/chatPage?me=${userId}`} label="Chat" setIsOpen={setIsOpen} />
            </>
          )}
          {!isLoggedIn ? (
            <>
              <MobileLink href="/SignUpPage" label="Register" setIsOpen={setIsOpen} />
              <MobileLink href="/LoginPage" label="Login" setIsOpen={setIsOpen} />
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 text-left text-lg font-medium py-2"
            >
              Logout
            </button>
          )}
          <MobileLink href="/make-request" label="Make a Request" setIsOpen={setIsOpen} />
          <MobileLink href="/chatbot" label="Ask Pairy the Chatbot" setIsOpen={setIsOpen} />
        </div>
      )}
    </nav>
  );
};

// Shared components
const NavButton = ({ href, label }) => (
  <Button
    variant="ghost"
    className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-lg px-5 py-2.5"
    asChild
  >
    <Link href={href}>{label}</Link>
  </Button>
);

const MobileLink = ({ href, label, setIsOpen }) => (
  <Link
    href={href}
    className="text-gray-700 hover:text-gray-900 text-lg font-medium py-2"
    onClick={() => setIsOpen(false)}
  >
    {label}
  </Link>
);

export default Navbar;
