"use client";

import { useState, useEffect } from "react";
import ForumPost from "./ForumPost";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";
import ForumSidebar from "./ForumSidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ForumPage = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch posts from the backend API
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        console.log("Fetched posts:", data); // Debug log
        setPosts(data.posts);
        setFilteredPosts(data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load discussions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Apply filtering and sorting when dependencies change
  useEffect(() => {
    if (!posts.length) return;

    // Filter by category and search query
    let result = [...posts];
    
    // Filter by category if not "all"
    if (selectedCategory !== "all") {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    // Filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.description.toLowerCase().includes(query) ||
        (post.author && post.author.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "popular":
        result.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case "trending":
        // Sorting by reply count and recency
        result.sort((a, b) => {
          const replyDiff = (b.replyCount || 0) - (a.replyCount || 0);
          if (replyDiff !== 0) return replyDiff;
          return new Date(b.created_at) - new Date(a.created_at);
        });
        break;
      default:
        break;
    }
    
    setFilteredPosts(result);
  }, [posts, sortBy, searchQuery, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-32 pb-10">
        <div className="text-center">
          <div className="animate-pulse text-2xl">Loading discussions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-32 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>
        <Link href="/discussion/new">
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            Create Post
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Sorting & Sidebar */}
      <div className="flex flex-col md:flex-row">
        <ForumSidebar onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        <div className="flex-1 md:ml-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold mb-3 sm:mb-0">
              {selectedCategory === "all" ? "All Discussions" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Discussions`}
            </h2>
            <SortOptions setSortBy={setSortBy} sortBy={sortBy} />
          </div>

          {/* Grid Layout: Each post is clickable and links to its detail page */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/discussion/${post.id}`} className="h-full">
                  <div className="h-full">
                    <ForumPost post={post} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-lg text-gray-500">No discussions found.</p>
              {searchQuery && (
                <p className="mt-2 text-gray-500">
                  Try adjusting your search term or browse other categories.
                </p>
              )}
              {selectedCategory !== "all" && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSelectedCategory("all")}
                >
                  View All Discussions
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;