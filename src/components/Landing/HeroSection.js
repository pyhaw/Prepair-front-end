"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-orange-100 via-white to-orange-100 py-24 px-6 md:px-12 text-center">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-orange-600 pt-10 leading-tight mb-6">
          Find Reliable Experts, Fast.
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Prepair connects you with trusted local fixers for your home, tech, or
          freelance needs.
        </p>
        <div className="flex justify-center gap-4">
          <div className="flex gap-4">
            <Link href="/SignUpPage">
              <Button
                size="lg"
                className="text-white bg-orange-600 hover:bg-orange-700"
              >
                Get Started
              </Button>
            </Link>

            <Link href="/LoginPage">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image or Illustration */}
        <div className="mt-12">
          <Image
            src="/images/PREPAIR_PICKS.png"
            alt="Platform demo"
            width={400}
            height={400}
            className="rounded-2xl shadow-xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
