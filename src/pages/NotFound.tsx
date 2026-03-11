import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Orbital particles configuration - matches LoadingScreen
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.12,
    duration: 3 + (i % 4) * 0.5,
    radius: 140 + (i % 3) * 30,
    size: 4 + (i % 3) * 2,
  }));

  const quickLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Projects", href: "/#projects", icon: Compass },
    { label: "Contact", href: "/#contact", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/50">
      {/* Animated Background - Matching LoadingScreen */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs following mouse */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
          animate={{
            x: mousePos.x - 300,
            y: mousePos.y - 300,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]"
          animate={{
            x: mousePos.x - 200 + 100,
            y: mousePos.y - 200 + 100,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
        />

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Floating Logo - Matches LoadingScreen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-[2px]"
              animate={{
                boxShadow: [
                  "0 0 30px hsl(271 81% 56% / 0.4)",
                  "0 0 60px hsl(271 81% 56% / 0.6)",
                  "0 0 30px hsl(271 81% 56% / 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
                  M
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* 404 Number with Portal Effect and Orbital Particles */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-8 flex justify-center"
          >
            {/* Orbital Particles container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: particle.delay,
                  }}
                  style={{
                    width: particle.radius * 2,
                    height: particle.radius * 2,
                  }}
                >
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{
                      width: particle.size,
                      height: particle.size,
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: particle.delay,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Portal glow effect behind 404 */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl" />
            </motion.div>

            {/* 404 Number */}
            <span className="relative text-[160px] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-pink-500 to-accent leading-none select-none">
              404
            </span>

            {/* Glitch effect overlay */}
            <motion.span
              className="absolute text-[160px] md:text-[220px] font-black text-accent/20 leading-none select-none"
              animate={{ x: [0, -3, 3, 0], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              404
            </motion.span>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lost in the Digital Void
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The page you're looking for seems to have drifted into another dimension. Let's get you back on track.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {quickLinks.map((link) => (
              <motion.div
                key={link.label}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/">
              <Button className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl font-semibold shadow-glow">
                <ArrowLeft className="mr-2" size={20} />
                Back to Homepage
              </Button>
            </Link>
          </motion.div>

          {/* Bouncing dots animation - matches LoadingScreen progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16"
          >
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

