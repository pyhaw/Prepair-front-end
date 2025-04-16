import Footer from "@/components/Footer";
import AboutUs from "@/components/Landing/AboutUs";
import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <AboutUs />
      <Footer />
    </div>
  );
}
