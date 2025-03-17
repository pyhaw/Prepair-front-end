import { Home, Wrench, PaintBucket, TrendingUp, Lightbulb, Brush, Cpu } from "lucide-react";

const ForumSidebar = ({ onCategorySelect, selectedCategory = "all" }) => {
  const categories = [
    { id: "all", name: "All Categories", icon: <Home size={20} className="mr-2 text-orange-400" /> },
    { id: "general", name: "General Discussions", icon: <Lightbulb size={20} className="mr-2 text-orange-400" /> },
    { id: "plumbing", name: "Plumbing & Repairs", icon: <Wrench size={20} className="mr-2 text-orange-400" /> },
    { id: "interior", name: "Interior Design", icon: <PaintBucket size={20} className="mr-2 text-orange-400" /> },
    { id: "diy", name: "DIY Projects", icon: <Brush size={20} className="mr-2 text-orange-400" /> },
    { id: "renovations", name: "Renovations", icon: <TrendingUp size={20} className="mr-2 text-orange-400" /> },
    { id: "smart-home", name: "Smart Home", icon: <Cpu size={20} className="mr-2 text-orange-400" /> },
  ];

  const trendingTopics = [
    { id: "best-diy-fixes", name: "Best DIY Fixes" },
    { id: "budget-renovations", name: "Budget Renovations" },
    { id: "smart-home-upgrades", name: "Smart Home Upgrades" },
  ];

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg rounded-lg p-5 mb-6 md:mb-0 sticky top-32 self-start">
      {/* Categories Section */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Categories</h3>
      <ul className="space-y-3">
        {categories.map((category) => (
          <li 
            key={category.id}
            className={`flex items-center cursor-pointer transition-colors duration-200 ${
              selectedCategory === category.id 
                ? "text-orange-500 font-medium" 
                : "text-gray-700 hover:text-orange-500"
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            {category.icon}
            {category.name}
          </li>
        ))}
      </ul>

      {/* Trending Discussions Section */}
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Trending Topics</h3>
      <ul className="space-y-2">
        {trendingTopics.map((topic) => (
          <li key={topic.id} className="flex items-center text-gray-700 hover:text-orange-500 cursor-pointer">
            <TrendingUp size={18} className="mr-2 text-orange-400" /> {topic.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ForumSidebar;