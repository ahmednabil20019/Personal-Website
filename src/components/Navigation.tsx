import { useState, useEffect } from "react"
import { Menu, X, Home, User, Briefcase, Award, Settings, Mail, Map, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/context/ThemeContext"

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "about", label: "About", icon: User, path: "/#about" },
  { id: "services", label: "Services", icon: Layers, path: "/#services" },
  { id: "journey", label: "Journey", icon: Map, path: "/#journey" },
  { id: "skills", label: "Arsenal", icon: Zap, path: "/#skills" },
  { id: "projects", label: "Projects", icon: Briefcase, path: "/#projects" },
  { id: "certifications", label: "Certs", icon: Award, path: "/#certifications" },
  { id: "contact", label: "Contact", icon: Mail, path: "/#contact" },
]

export const Navigation = () => {
  const { currentSection, currentTheme, setCurrentSection } = useTheme();

  // No local activeSection state needed, standardizing on global context
  const activeSection = currentSection;

  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (path: string, sectionId: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = path;
      return;
    }

    // INSTANT FEEDBACK: Set the theme/active section immediately upon click
    setCurrentSection(sectionId);

    // Notify detection hook to pause updates during scroll
    window.dispatchEvent(new Event('manual-scroll-start'));

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Logo */}
      <div className="fixed top-6 left-6 z-50 hidden md:block">
        <button
          onClick={() => scrollToSection('/', 'home')}
          className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-3 rounded-full border border-primary/40 shadow-lg group-hover:shadow-xl group-hover:border-primary/60 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Mohamed Hegazy Logo"
                className="w-10 h-10 object-contain filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block transition-all duration-500">
        <div
          className="glass-card px-6 py-3 transition-all duration-500"
          style={{
            borderColor: `${currentTheme.primary}40`,
            backgroundColor: `rgba(0, 0, 0, 0.6)`,
          }}
        >
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.path, item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
                    activeSection === item.id
                      ? "text-white font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                  style={
                    activeSection === item.id
                      ? {
                        backgroundColor: item.id === "skills" ? "rgba(239, 68, 68, 0.2)" :
                          item.id === "services" ? "rgba(139, 92, 246, 0.2)" :
                            `${currentTheme.primary}20`,
                        color: item.id === "skills" ? "#ef4444" :
                          item.id === "services" ? "#a855f7" :
                            currentTheme.primary,
                        boxShadow: item.id === "skills" ? "0 0 15px rgba(239, 68, 68, 0.4)" :
                          item.id === "services" ? "0 0 15px rgba(139, 92, 246, 0.4)" :
                            `0 0 15px ${currentTheme.primary}40`,
                      }
                      : {}
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Premium Glass Dock) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] sm:max-w-md">
        <div className="glass-card px-2 py-2 flex items-center bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-x-auto scrollbar-hide no-scrollbar touch-pan-x snap-x snap-mandatory">
          <div className="flex gap-1 min-w-max mx-auto px-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.path, item.id)}
                  className={cn(
                    "relative flex items-center justify-center p-2.5 transition-all duration-300 rounded-full snap-center",
                    isActive ? "px-4 bg-white/10" : "text-white/50 hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full border border-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-all duration-300",
                        isActive
                          ? item.id === "skills" ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                            : item.id === "services" ? "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"
                              : item.id === "projects" ? "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                                : item.id === "certifications" ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                                  : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                          : "text-white/60"
                      )}
                    />

                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className={cn(
                            "whitespace-nowrap text-xs font-bold tracking-wide",
                            item.id === "skills" ? "text-red-400"
                              : item.id === "services" ? "text-purple-400"
                                : item.id === "projects" ? "text-orange-400"
                                  : item.id === "certifications" ? "text-yellow-400"
                                    : "text-cyan-400"
                          )}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}