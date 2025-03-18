"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirection
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // ✅ Check login status from BACKEND
  useEffect(() => {
    const verifyLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          console.warn("Invalid token. Logging out...");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsLoggedIn(false);
      }
    };

    verifyLogin();
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
  
      // Clear the token from local storage
      localStorage.removeItem("token");
  
      // Redirect to the login page
      window.location.href = "/LoginPage";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Left Section: Logo + Categories */}
        <div className="flex items-center space-x-10">
          <Link href="/">
            <Image
              src="/FIF.png"
              alt="Prepair Logo"
              width={180}
              height={60}
              priority
            />
          </Link>

          {/* Dropdown Categories */}
          <div className="hidden md:flex space-x-8 text-lg font-semibold text-gray-700">
            {["Electrical & Plumbing", "Structural", "Interior"].map(
              (category, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger className="hover:text-gray-900 transition-all">
                    {category}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white shadow-lg border rounded-md w-56 p-2 flex flex-col space-y-2">
                    <DropdownMenuItem asChild>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md"
                      >
                        Placeholder 1
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md"
                      >
                        Placeholder 2
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md"
                      >
                        Placeholder 3
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            )}
          </div>
        </div>

{/* Right Section: Navigation Buttons */}
<div className="hidden md:flex space-x-4">
  <Button variant="outline" className="text-lg px-6 py-3" asChild>
    <Link href="/discussion">Discussion</Link>
  </Button>

  {isLoggedIn ? (
    <>
      {/* ✅ Show View Profile button when logged in */}
      <Button variant="outline" className="text-lg px-6 py-3" asChild>
        <Link href="/profilePage">View Profile</Link>
      </Button>

      {/* ✅ Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="text-lg px-6 py-3 bg-red-500 text-white hover:bg-red-600"
      >
        Logout
      </Button>
    </>
  ) : (
    <>
      {/* ✅ Show Login & Register Buttons When Not Logged In */}
      <Button variant="outline" className="text-lg px-6 py-3" asChild>
        <Link href="/SignUpPage">Register</Link>
      </Button>
      <Button variant="outline" className="text-lg px-6 py-3" asChild>
        <Link href="/LoginPage">Login</Link>
      </Button>
    </>
  )}

  <Button
    className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-6 py-3"
    asChild
  >
    <Link href="#">Make a Request</Link>
  </Button>
</div>


        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={36} /> : <Menu size={36} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
