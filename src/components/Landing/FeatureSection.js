"use client";

import { Bolt, Wrench, Users } from "lucide-react";

const features = [
  {
    icon: <Wrench className="w-8 h-8 text-orange-600" />,
    title: "Skilled Fixers",
    description: "Access a trusted network of experts across industries.",
  },
  {
    icon: <Users className="w-8 h-8 text-orange-600" />,
    title: "Verified Reviews",
    description: "Real reviews from real customers for peace of mind.",
  },
  {
    icon: <Bolt className="w-8 h-8 text-orange-600" />,
    title: "Fast & Simple",
    description: "Connect instantly and get help within minutes.",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-20 px-6 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
        Why Use Prepair?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border border-orange-100 rounded-xl shadow-sm hover:shadow-md transition bg-orange-50"
          >
            <div className="mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-orange-700">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
