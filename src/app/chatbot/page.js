import Chatbot from "@/components/Chatbot/chatbot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Chatbot />
      <Footer />
    </div>
  );
}
