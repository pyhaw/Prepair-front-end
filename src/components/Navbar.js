"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        {/* Left Section: Logo + Categories */}
        <div className="flex items-center space-x-10">
          <Link href="/">
            <Image src="/FIF.png" alt="Prepair Logo" width={180} height={60} priority />
          </Link>

          {/* Dropdown Categories */}
          <div className="hidden md:flex space-x-8 text-lg font-semibold text-gray-700">
            {["Electrical & Plumbing", "Structural", "Interior"].map((category, index) => (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger className="hover:text-gray-900 transition-all">
                  {category}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg border rounded-md w-56 p-2 flex flex-col space-y-2">
                  <DropdownMenuItem asChild>
                    <Link href="#" className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md">
                      Placeholder 1
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md">
                      Placeholder 2
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md">
                      Placeholder 3
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>

        {/* Right Section: Navigation Buttons */}
        <div className="hidden md:flex space-x-4">
          <Button variant="outline" className="text-lg px-6 py-3" aschild="true">
          <Link href="/discussion">
                Discussion
            </Link>
          </Button>
          <Button variant="outline" className="text-lg px-6 py-3" aschild="true">
            <Link href="#">Register</Link>
          </Button>
          <Button variant="outline" className="text-lg px-6 py-3" aschild="true">
            <Link href="#">Login</Link>
          </Button>
          <Button className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-6 py-3" asChild>
            <Link href="#">Make a Request</Link>
          </Button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 focus:outline-none">
          {isOpen ? <X size={36} /> : <Menu size={36} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <div className="flex flex-col items-center space-y-4">
            {["Electrical & Plumbing", "Structural", "Interior"].map((category, index) => (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger className="text-lg text-gray-700 hover:text-gray-900">
                  {category}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg border rounded-md w-56 p-2 flex flex-col space-y-2">
                  <DropdownMenuItem asChild>
                    <Link href="#" className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md">
                      Placeholder 1
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md">
                      Placeholder 2
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md">
                      Placeholder 3
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            <Button variant="outline" className="text-lg px-6 py-3 w-full" asChild>
              <Link href="#">Discussion</Link>
            </Button>
            <Button variant="outline" className="text-lg px-6 py-3 w-full" asChild>
              <Link href="#">Register</Link>
            </Button>
            <Button variant="outline" className="text-lg px-6 py-3 w-full" asChild>
              <Link href="#">Login</Link>
            </Button>
            <Button className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-6 py-3 w-full" asChild>
              <Link href="#">Make a Request</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
