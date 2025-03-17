import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import Link from "next/link";

const ForumPost = ({ post }) => {
  // Default placeholders for data that might be missing
  const defaultImage = "https://via.placeholder.com/300x200?text=No+Image";
  const defaultAvatar = "https://via.placeholder.com/40x40?text=User";
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Image (use placeholder if not available) */}
      <img 
        src={post.image || defaultImage} 
        alt={post.title} 
        className="w-full h-40 object-cover rounded-md mb-4" 
      />
      
      {/* Title and Description */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
      <p className="text-gray-600 text-sm mb-2 flex-grow">
        {post.description.length > 120 
          ? `${post.description.substring(0, 120)}...` 
          : post.description}
      </p>

      {/* Author Info */}
      <div className="flex items-center mt-3">
        <img 
          src={post.avatar || defaultAvatar} 
          alt={post.author || "Anonymous"} 
          className="w-8 h-8 rounded-full mr-2" 
        />
        <span className="text-gray-500 text-sm">
          {post.author || "Anonymous"} • {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Voting & Reply Count */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex space-x-2 items-center">
          <button className="text-green-500 hover:scale-110 transition-transform" disabled>
            <ArrowUp size={18} />
          </button>
          <span className="font-semibold">
            {((post.upvotes || 0) - (post.downvotes || 0))}
          </span>
          <button className="text-red-500 hover:scale-110 transition-transform" disabled>
            <ArrowDown size={18} />
          </button>
        </div>
        
        <div className="flex items-center text-blue-600">
          <MessageSquare size={18} className="mr-1" />
          <span>{post.replyCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;