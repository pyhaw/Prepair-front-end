import { Home, Wrench, PaintBucket, TrendingUp } from "lucide-react";

const ForumSidebar = () => {
  return (
    <aside className="w-full md:w-64 bg-white shadow-lg rounded-lg p-5">
      {/* Categories Section */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Categories</h3>
      <ul className="space-y-3">
        <li className="flex items-center text-gray-700 hover:text-orange-500 cursor-pointer">
          <Home size={20} className="mr-2 text-orange-400" /> General Discussions
        </li>
        <li className="flex items-center text-gray-700 hover:text-orange-500 cursor-pointer">
          <Wrench size={20} className="mr-2 text-orange-400" /> Plumbing & Repairs
        </li>
        <li className="flex items-center text-gray-700 hover:text-orange-500 cursor-pointer">
          <PaintBucket size={20} className="mr-2 text-orange-400" /> Interior Design
        </li>
      </ul>

      {/* Trending Discussions Section */}
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Trending Topics</h3>
      <ul className="space-y-2">
        <li className="flex items-center text-gray-700 hover:text-orange-500 cursor-pointer">
          <TrendingUp size={20} className="mr-2 text-orange-400" /> Best DIY Fixes
        </li>
        <li className="flex items-center text-gray-700 hover:text-orange-500 cursor-pointer">
          <TrendingUp size={20} className="mr-2 text-orange-400" /> Budget Renovations
        </li>
        <li className="flex items-center text-gray-700 hover:text-orange-500 cursor-pointer">
          <TrendingUp size={20} className="mr-2 text-orange-400" /> Smart Home Upgrades
        </li>
      </ul>
    </aside>
  );
};

export default ForumSidebar;
