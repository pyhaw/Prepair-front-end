// Updated PostDetails.jsx with full editing and viewing logic retained
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUp,
  ArrowDown,
  Send,
  Calendar,
  User,
  MessageSquare,
  Edit3,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function PostDetails() {
  const { postId } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [userVotes, setUserVotes] = useState({});

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [editPostCategory, setEditPostCategory] = useState("");

  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

  const [currentUserId, setCurrentUserId] = useState(null);
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setCurrentUserId(parseInt(storedId));
  }, []);

  useEffect(() => {
    if (!postId) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();

        setPost(data.post);
        setEditPostTitle(data.post.title);
        setEditPostContent(data.post.description);
        setEditPostCategory(data.post.category || "general");
        setEditImageFiles(data.post.images || []);
        setEditImagePreviews(data.post.images || []);

        const repliesRes = await fetch(
          `${API_URL}/api/posts/${postId}/replies`
        );
        if (repliesRes.ok) {
          const repliesData = await repliesRes.json();
          setReplies(repliesData.replies || []);
        }

        const token = localStorage.getItem("token");
        if (token) {
          const votesRes = await fetch(
            `${API_URL}/api/posts/${postId}/user-votes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (votesRes.ok) {
            const votesData = await votesRes.json();
            setUserVotes(votesData.votes || {});
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [postId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setReplyError("You must be logged in to reply");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newReply }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to submit reply");
      }

      const data = await response.json();
      setReplies([...replies, data.reply]);
      setNewReply("");
      setReplyError("");
    } catch (err) {
      setReplyError(err.message);
    }
  };

  const handleVote = async (itemId, voteType, itemType = "post") => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to vote");
      return;
    }

    try {
      const endpoint =
        itemType === "post"
          ? `${API_URL}/api/posts/${itemId}/vote`
          : `${API_URL}/api/replies/${itemId}/vote`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      const data = await response.json();

      if (itemType === "post") {
        setPost({
          ...post,
          upvotes: data.upvotes,
          downvotes: data.downvotes,
        });
      } else {
        setReplies(
          replies.map((reply) =>
            reply.id === itemId
              ? { ...reply, upvotes: data.upvotes, downvotes: data.downvotes }
              : reply
          )
        );
      }

      const voteKey = itemType === "post" ? "post" : `reply_${itemId}`;
      const currentVote = userVotes[voteKey];
      setUserVotes({
        ...userVotes,
        [voteKey]: currentVote === voteType ? null : voteType,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit post functions
  const handlePostEditToggle = () => {
    setIsEditingPost(!isEditingPost);
  };

  const handlePostDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to delete the post");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      router.push("/discussion");
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit reply functions
  const handleReplyEditToggle = (reply) => {
    setEditingReplyId(reply.id);
    setEditingReplyContent(reply.content);
  };

  const handleReplyEditSubmit = async (replyId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setReplyError("You must be logged in to edit a reply");
      return;
    }
    if (!editingReplyContent.trim()) {
      setReplyError("Reply content is required");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/posts/${postId}/replies/${replyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editingReplyContent }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to update reply");
      }
      const data = await response.json();
      setReplies(
        replies.map((reply) => (reply.id === replyId ? data.reply : reply))
      );
      setEditingReplyId(null);
      setEditingReplyContent("");
    } catch (err) {
      setReplyError(err.message);
    }
  };

  const handleReplyDelete = async (replyId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setReplyError("You must be logged in to delete a reply");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/posts/${postId}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete reply");
      }
      setReplies(replies.filter((reply) => reply.id !== replyId));
    } catch (err) {
      setReplyError(err.message);
    }
  };

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Reset any previous upload messages.
    setUploadMessage("");

    // Upload all selected files to Cloudinary.
    const uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      try {
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        // Cloudinary returns the uploaded image URL as secure_url.
        if (response.data && response.data.secure_url) {
          uploadedUrls.push(response.data.secure_url);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadMessage(
          "Error uploading one or more images. Please try again."
        );
      }
    }

    console.log(uploadedUrls);

    // Update state with the new image URLs.
    setEditImagePreviews((prev) => [...prev, ...uploadedUrls]);
    setEditImageFiles((prev) => [...prev, ...uploadedUrls]);
  };

  const removeImage = (index) => {
    setEditImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setEditImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePostEditSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setError("Authentication required");

    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editPostTitle,
          content: editPostContent,
          category: editPostCategory,
          images: editImageFiles,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      console.log(updated);
      setPost(updated.post);
      setIsEditingPost(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (error)
    return (
      <div className="pt-32 text-center text-red-600">
        Error: {error}
        <Button onClick={() => router.push("/discussion")}>Back</Button>
      </div>
    );

  return (
    <div className="container mx-auto px-6 pt-32 pb-10">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          {isEditingPost ? (
            <div className="flex-1">
              <input
                value={editPostTitle}
                onChange={(e) => setEditPostTitle(e.target.value)}
                className="w-full p-2 mb-2 border rounded text-black"
              />
              <textarea
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                rows="4"
                className="w-full p-2 mb-2 border rounded text-black"
              />
              <select
                value={editPostCategory}
                onChange={(e) => setEditPostCategory(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black"
              >
                <option value="general">General</option>
                <option value="plumbing">Plumbing</option>
                <option value="interior">Interior</option>
                <option value="diy">DIY</option>
              </select>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="mb-2"
              />
              <div className="flex gap-2 overflow-x-auto">
                {editImagePreviews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="w-32 h-32 object-cover rounded" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handlePostEditSubmit}>Save</Button>
                <Button variant="ghost" onClick={() => setIsEditingPost(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold flex-1">{post.title}</h1>
              {(currentUserId === post.client_id || role === "admin") && (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handlePostEditToggle}>
                    <Edit3 size={20} />
                  </Button>
                  <Button variant="ghost" onClick={handlePostDelete}>
                    Delete
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Post Content */}
        {!isEditingPost && (
          <div className="flex mb-6">
            {/* Voting */}
            <div className="flex flex-col items-center mr-4">
              <button
                onClick={() => handleVote(post.id, "up")}
                className={`p-1 rounded-full ${
                  userVotes.post === "up"
                    ? "bg-green-100 text-green-600"
                    : "text-gray-400 hover:text-green-500"
                }`}
              >
                <ArrowUp size={24} />
              </button>
              <span className="font-semibold my-1 text-black">
                {(post.upvotes || 0) - (post.downvotes || 0)}
              </span>
              <button
                onClick={() => handleVote(post.id, "down")}
                className={`p-1 rounded-full ${
                  userVotes.post === "down"
                    ? "bg-red-100 text-red-600"
                    : "text-gray-400 hover:text-red-500"
                }`}
              >
                <ArrowDown size={24} />
              </button>
            </div>

            {/* Post Content */}
            <div className="flex-1">
              <div className="prose max-w-none">
                <p className="text-gray-800 text-lg whitespace-pre-line">
                  {post.description}
                </p>
              </div>

              {post.images?.length > 0 && (
                <div className="overflow-x-auto whitespace-nowrap flex gap-4 mt-4 py-2">
                  {post.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Post image ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              {/* Post Metadata */}
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <User size={16} className="mr-1" />
                  <span>{post.author || "Anonymous"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Replies Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-black">
            <MessageSquare className="mr-2" />
            Replies ({replies.length})
          </h2>

          {/* Reply List */}
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex">
                    {/* Reply Voting */}
                    <div className="flex flex-col items-center mr-4">
                      <button
                        onClick={() => handleVote(reply.id, "up", "reply")}
                        className={`p-1 rounded-full ${
                          userVotes[`reply_${reply.id}`] === "up"
                            ? "bg-green-100 text-green-600"
                            : "text-gray-400 hover:text-green-500"
                        }`}
                      >
                        <ArrowUp size={18} />
                      </button>
                      <span className="font-semibold my-1 text-black">
                        {(reply.upvotes || 0) - (reply.downvotes || 0)}
                      </span>
                      <button
                        onClick={() => handleVote(reply.id, "down", "reply")}
                        className={`p-1 rounded-full ${
                          userVotes[`reply_${reply.id}`] === "down"
                            ? "bg-red-100 text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <ArrowDown size={18} />
                      </button>
                    </div>

                    {/* Reply Content */}
                    <div className="flex-1">
                      {editingReplyId === reply.id ? (
                        <div>
                          <textarea
                            value={editingReplyContent}
                            onChange={(e) =>
                              setEditingReplyContent(e.target.value)
                            }
                            className="w-full p-2 border rounded mb-2 text-black"
                            rows="3"
                          ></textarea>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleReplyEditSubmit(reply.id)}
                              className="bg-orange-500 text-white"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => setEditingReplyId(null)}
                              variant="ghost"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-800 whitespace-pre-line">
                            {reply.content}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <User size={14} className="mr-1" />
                            <span className="mr-3">
                              {reply.author || "Anonymous"}
                            </span>
                            <Calendar size={14} className="mr-1" />
                            <span>
                              {new Date(reply.created_at).toLocaleString()}
                            </span>
                          </div>
                          {currentUserId === reply.user_id && (
                            <div className="flex space-x-2 mt-2">
                              <Button
                                variant="ghost"
                                onClick={() => handleReplyEditToggle(reply)}
                              >
                                <Edit3 size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleReplyDelete(reply.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No replies yet. Be the first to reply!
            </div>
          )}

          {/* Reply Form */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-black">
              Add Your Reply
            </h3>

            {replyError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {replyError}
              </div>
            )}
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Share your thoughts or answer..."
                rows="4"
                required
              ></textarea>
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center"
                >
                  <Send size={18} className="mr-2" /> Submit Reply
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
