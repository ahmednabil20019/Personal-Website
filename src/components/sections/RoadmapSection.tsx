import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const RoadmapSection = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-50%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        const data = await res.json();
        if (data.success) setSkills(data.data);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="roadmap" ref={containerRef} className="py-32 relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 z-10" />
        <img
          src="/lovable-uploads/skills_parallax_background.png"
          alt="Skills Background"
          className="w-full h-[200%] object-cover absolute -top-[50%] left-0 opacity-50"
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Development <span className="text-primary">Roadmap</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Future plans and ongoing learning.
          </p>
        </motion.div>

        <div className="relative w-full h-full min-h-[500px] bg-secondary/10 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm flex items-center justify-center">
          <div className="text-muted-foreground">
            Roadmap content coming soon...
          </div>
        </div>
      </div>
    </section>
  );
};
