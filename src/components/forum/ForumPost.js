import { ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

const ForumPost = ({ post }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{post.description}</p>

      {/* Author Info */}
      <div className="flex items-center mt-3">
        <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full mr-2" />
        <span className="text-gray-500 text-sm">{post.author} • {post.timestamp}</span>
      </div>

      {/* Voting & View Discussion */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex space-x-2">
          <button className="text-green-500 hover:scale-110 transition-transform"><ArrowUp /></button>
          <span className="font-semibold">{post.upvotes - post.downvotes}</span>
          <button className="text-red-500 hover:scale-110 transition-transform"><ArrowDown /></button>
        </div>
        <Link href={`/discussion/${post.id}`} className="text-blue-600 font-semibold hover:underline">
          View Discussion
        </Link>
      </div>
    </div>
  );
};

export default ForumPost;
