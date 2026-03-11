import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { HeroCore3D } from "@/components/3d/HeroCore3D";
import { ArrowDown, Github, Linkedin, Instagram, Facebook } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

interface HeroData {
  greeting: string;
  title: string;
  subtitle: string;
  description: string;
  resumeUrl: string;
  socialLinks: boolean;
}

interface ContactInfo {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  hiddenSocials?: string[];
}

export const HeroSection = ({ previewData }: { previewData?: HeroData }) => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFilename, setCvFilename] = useState<string>('resume.pdf');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [isMounted, setIsMounted] = useState(false);

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        console.log("HeroSection: Fetching /api/hero...");
        const response = await fetch('/api/hero');
        console.log("HeroSection: Response status:", response.status);

        const json = await response.json();
        console.log("HeroSection: JSON data:", json);

        if (json.success && json.data) {
          setHeroData(json.data);
        } else {
          console.warn("HeroSection: No data or success=false", json);
        }
      } catch (error) {
        console.error('HeroSection: Error fetching hero data:', error);
      } finally {
        // Ensure hydration animation completes
        setTimeout(() => setIsMounted(true), 100);
      }
    };

    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact');
        const json = await response.json();
        if (json.success && json.data) {
          setContactInfo(json.data);
        }
      } catch (error) {
        console.error('HeroSection: Error fetching contact info:', error);
      }
    };

    const fetchCvData = async () => {
      try {
        const response = await fetch('/api/cv');
        const json = await response.json();
        if (json.success && json.data && json.data.url) {
          setCvUrl(json.data.url);
          if (json.data.filename) setCvFilename(json.data.filename);
        }
      } catch (error) {
        console.error('HeroSection: Error fetching CV:', error);
      }
    };

    // If preview data is provided, use it directly (Admin Mode)
    if (previewData) {
      console.log("HeroSection: Using previewData", previewData);
      setHeroData(previewData);
      setIsMounted(true);
    } else {
      console.log("HeroSection: No previewData, fetching from API...");
      fetchHeroData();
    }
    fetchContactInfo();
    fetchCvData();
  }, [previewData]);

  if (!heroData || !isMounted) { // Added !isMounted to loading condition
    // Loading state or fallback
    return (
      <section ref={containerRef} className="h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </section>
    );
  }

  return (
    <section id="home" ref={containerRef} className="relative h-screen min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Parallax Background Image - Deep Space Theme */}
      <motion.div
        className="absolute inset-0 z-0"
      >
        {/* Base dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-black" />

        {/* Parallax image layer - using space/void theme */}
        <motion.img
          src="/lovable-uploads/deep_space_parallax_background.png"
          alt="Space background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        {/* Overlay gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-black/70 to-black" />

        {/* Animated radial gradients */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Additional depth layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      </motion.div>

      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, -0.5, 6.5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <HeroCore3D />
        </Canvas>
      </div>

      {/* Content Layer */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-4 md:mb-6"
        >
          <p className="text-[10px] xs:text-xs md:text-xl text-cyan-300 font-normal tracking-[0.2em] mb-3 uppercase">
            {heroData.greeting}
          </p>
          <h1 className="text-[2rem] xs:text-[2.5rem] sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-white mix-blend-difference leading-[0.9]">
            {heroData.title}
          </h1>
          <h2 className="text-xs xs:text-sm sm:text-base md:text-2xl lg:text-3xl font-normal tracking-[0.15em] md:tracking-[0.3em] text-cyan-400 mt-2 md:mt-4 uppercase">
            {heroData.subtitle}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[11px] xs:text-xs md:text-base text-gray-400 max-w-[260px] xs:max-w-xs sm:max-w-md mx-auto leading-relaxed mb-5 md:mb-8 px-2"
        >
          {heroData.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4"
        >
          {cvUrl && (
            <motion.a
              href="/api/cv/download"
              download={cvFilename}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-3.5 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[13px] md:text-base font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all border border-white/10 text-center min-h-[48px] flex items-center justify-center"
            >
              Download CV
            </motion.a>
          )}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-3.5 md:px-8 md:py-3 rounded-full bg-white/10 backdrop-blur-md text-white text-[13px] md:text-base font-semibold border border-white/20 hover:bg-white/20 transition-all text-center min-h-[48px] flex items-center justify-center"
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Social Media Icons - Dynamic from Admin Settings */}
        {heroData.socialLinks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex gap-2.5 md:gap-4 justify-center flex-wrap"
          >
            {contactInfo.github && !(contactInfo.hiddenSocials ?? []).includes('github') && (
              <motion.a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </motion.a>
            )}
            {contactInfo.linkedin && !(contactInfo.hiddenSocials ?? []).includes('linkedin') && (
              <motion.a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </motion.a>
            )}
            {contactInfo.twitter && !(contactInfo.hiddenSocials ?? []).includes('twitter') && (
              <motion.a
                href={contactInfo.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Twitter/X"
              >
                <FaXTwitter className="w-5 h-5 text-white" />
              </motion.a>
            )}
            {contactInfo.instagram && !(contactInfo.hiddenSocials ?? []).includes('instagram') && (
              <motion.a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </motion.a>
            )}
            {contactInfo.facebook && !(contactInfo.hiddenSocials ?? []).includes('facebook') && (
              <motion.a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </motion.a>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <ArrowDown className="w-6 h-6 text-white/50 animate-bounce" />
      </motion.div>
    </section>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-secondary/50 backdrop-blur-sm rounded-full hover:bg-secondary transition-colors hover:scale-110 active:scale-95 border border-white/10"
  >
    {icon}
  </a>
);