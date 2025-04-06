import Footer from "@/components/Footer";
import ForumPage from "@/components/forum/ForumPage";
import Navbar from "@/components/Navbar";

export default function DiscussionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ForumPage />
      <Footer />
    </div>
  );
}
