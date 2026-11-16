
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PromoBanner from "@/components/sections/PromoBanner";
import ProvidersSection from "@/components/sections/ProvidersSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import ClinicSection from "@/components/sections/ClinicSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      
      <main>
        <HeroSection />
        <StatsSection />
        <PromoBanner />
        <ServicesSection />
        <ProvidersSection />
        <DoctorsSection />
        <ClinicSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
   
    </>
  );
}
