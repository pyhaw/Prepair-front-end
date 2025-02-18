"use client"; 

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "How do I find a trusted repair expert?", answer: "Our system matches you with top-rated, verified professionals." },
  { question: "Are the professionals licensed?", answer: "Yes, we verify all professionals before they join our network." },
  { question: "What if I’m not satisfied with the repair?", answer: "You can leave a review or request a refund within 24 hours." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mt-12 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-900">Frequently Asked Questions</h2>
      <div className="mt-6 max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 py-4">
            <button 
              className="w-full flex justify-between items-center text-lg font-semibold text-gray-900 focus:outline-none" 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
              <ChevronDown size={20} className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
            </button>
            {openIndex === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
