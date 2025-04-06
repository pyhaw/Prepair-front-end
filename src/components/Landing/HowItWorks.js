"use client";

import { Search, FileCheck, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-6 h-6 text-white" />,
    title: "Search",
    description: "Look for fixers or post a request describing your need.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-white" />,
    title: "Connect",
    description: "Chat directly with experts and compare offers.",
  },
  {
    icon: <FileCheck className="w-6 h-6 text-white" />,
    title: "Hire & Review",
    description: "Choose the best fixer, complete the task, leave feedback.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-gray-50 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10 max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="bg-orange-500 p-4 rounded-full mb-4 shadow-md">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-orange-700 mb-2">{step.title}</h3>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
