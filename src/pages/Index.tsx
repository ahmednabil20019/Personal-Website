import { Navigation } from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { AnimatedPage } from "@/components/AnimatedPage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { LivingBackground } from "@/components/3d/LivingBackground";
import { ScrollProgress } from "@/components/ScrollProgress";

const Index = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen">
        <ScrollProgress />
        <LivingBackground />
        <Navigation />
        <ThemeToggle />

        <main>
          <HeroSection />
          <AnimatedSection>
            <AboutSection />
          </AnimatedSection>
          <AnimatedSection>
            <ServicesSection />
          </AnimatedSection>
          <AnimatedSection>
            <JourneySection />
          </AnimatedSection>
          <AnimatedSection>
            <SkillsSection />
          </AnimatedSection>
          <AnimatedSection>
            <ProjectsSection />
          </AnimatedSection>
          <AnimatedSection>
            <CertificationsSection />
          </AnimatedSection>
          <AnimatedSection>
            <ContactSection />
          </AnimatedSection>
        </main>

        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Index;
