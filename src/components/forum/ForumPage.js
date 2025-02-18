"use client";

import { useState } from "react";
import ForumPost from "./ForumPost";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";
import ForumSidebar from "./ForumSidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ForumPage = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const posts = [
    {
      id: 1,
      title: "How to fix plumbing leaks?",
      description: "Looking for advice on small pipe leaks in my bathroom.",
      image: "https://source.unsplash.com/400x300/?plumbing,water",
      author: "JohnDoe",
      avatar: "https://i.pravatar.cc/50?img=1",
      timestamp: "2 hours ago",
      upvotes: 120,
      downvotes: 5,
    },
    {
      id: 2,
      title: "Best paint colors for a small room?",
      description: "Want suggestions for light colors that make a space feel bigger.",
      image: "https://source.unsplash.com/400x300/?interior,design",
      author: "DesignGuru",
      avatar: "https://i.pravatar.cc/50?img=2",
      timestamp: "5 hours ago",
      upvotes: 75,
      downvotes: 2,
    },
    {
      id: 3,
      title: "Which wood is best for furniture?",
      description: "Hardwood or softwood? Need recommendations for a DIY project.",
      image: "https://source.unsplash.com/400x300/?woodworking,furniture",
      author: "Carpenter101",
      avatar: "https://i.pravatar.cc/50?img=3",
      timestamp: "1 day ago",
      upvotes: 90,
      downvotes: 4,
    },
    {
      id: 4,
      title: "Leaky Roof Repair Tips?",
      description: "How do I fix a leaky roof without professional help?",
      image: "https://source.unsplash.com/400x300/?roof,repair",
      author: "FixItFast",
      avatar: "https://i.pravatar.cc/50?img=4",
      timestamp: "3 days ago",
      upvotes: 45,
      downvotes: 3,
    },
    {
      id: 5,
      title: "Best budget kitchen remodel?",
      description: "Looking for ways to renovate my kitchen under $5k.",
      image: "https://source.unsplash.com/400x300/?kitchen,renovation",
      author: "HomeChef",
      avatar: "https://i.pravatar.cc/50?img=5",
      timestamp: "1 week ago",
      upvotes: 110,
      downvotes: 7,
    },
  ];

  return (
    <div className="container mx-auto px-6 pt-32 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <SearchBar setSearchQuery={setSearchQuery} />
        <Link href="/discussion/new">
          <Button className="bg-orange-500 text-white hover:bg-orange-600 mt-4 md:mt-0">
            Create Post
          </Button>
        </Link>
      </div>

      {/* Sorting & Sidebar */}
      <div className="flex flex-col md:flex-row">
        <ForumSidebar />
        <div className="flex-1 md:ml-6">
          <SortOptions setSortBy={setSortBy} />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {posts.map((post) => (
              <ForumPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
