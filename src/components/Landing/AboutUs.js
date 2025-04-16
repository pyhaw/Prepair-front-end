"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div>
      {/* Title Section */}
      <section className="py-8 px-6 bg-gray-50 text-center">
        <h1 className="text-4xl font-bold text-gray-900">About</h1>
      </section>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between py-20 px-6 bg-white">
        {/* Text Section */}
        <div className="md:w-1/2 text-left mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Prepair connects millions of homeowners with trusted repair professionals.
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            The all-in-one platform for handyman services.
          </p>
          <Link href="/SignUpPage">
            <button className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 relative h-[400px] md:h-[500px] w-full">
          <Image
            src="https://voffice.com.sg/wp-content/uploads/2024/10/handyman-singapore.jpg"
            alt="Handyman at work"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Our Mission
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Making handyman services affordable, fair, and transparent for everyone.
        </p>
        <p className="text-lg text-gray-600">
          We help people and small businesses find reliable experts for their home, or freelance needs ensuring quality service at fair prices.
        </p>
      </section>
    </div>
  );
}