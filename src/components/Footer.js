import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500">Prepair</h2>
          <p className="mt-2 text-gray-400">
            Connecting homeowners with trusted repair professionals.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-orange-400">Quick Links</h3>
          <Link href="/" className="text-gray-300 hover:text-white mt-2">Home</Link>
          <Link href="/about" className="text-gray-300 hover:text-white mt-2">About</Link>
          <Link href="/contact" className="text-gray-300 hover:text-white mt-2">Contact</Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-orange-400">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-300 hover:text-white">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Prepair. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
