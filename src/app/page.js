import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Landing/HeroSection";
import FeatureSection from "@/components/Landing/FeatureSection";
import Testimonials from "@/components/Landing/Testimonials";
import ExpertProfiles from "@/components/Landing/ExpertProfiles";
import HowItWorks from "@/components/Landing/HowItWorks";
import FAQSection from "@/components/Landing/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <HowItWorks />
      <ExpertProfiles />
      <FAQSection />
      <Footer /> 
    </div>
  );
}
