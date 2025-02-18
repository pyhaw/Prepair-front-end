import { Wrench, Search, ClipboardCheck, ThumbsUp } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Describe Your Issue",
    description: "Tell us what needs fixing, and we'll find the right professionals for you.",
    icon: <ClipboardCheck size={40} className="text-orange-500" />,
  },
  {
    id: 2,
    title: "Get Matched Instantly",
    description: "Our smart system finds the best-rated contractors in your area.",
    icon: <Search size={40} className="text-orange-500" />,
  },
  {
    id: 3,
    title: "Compare & Hire",
    description: "Browse professional profiles, read reviews, and select the best fit.",
    icon: <Wrench size={40} className="text-orange-500" />,
  },
  {
    id: 4,
    title: "Job Done & Reviewed",
    description: "After the job is completed, leave a review to help others choose.",
    icon: <ThumbsUp size={40} className="text-orange-500" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="mt-12 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div key={step.id} className="bg-white p-6 shadow-md rounded-lg text-center">
            <div className="flex justify-center">{step.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
