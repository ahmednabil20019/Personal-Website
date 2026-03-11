import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Download, Github, Linkedin, Twitter, Instagram, Facebook,
  MapPin, ArrowRight, Award, Target, Heart, Sparkles
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { NeonOrbs } from "@/components/ui/neon-orbs";

interface Stat {
  label: string;
  value: string;
}

interface Passion {
  icon: string;
  label: string;
}

interface AboutData {
  name: string;
  title: string;
  location: string;
  content: string;
  avatar: string;
  mission: string;
  stats: Stat[];
  passions: Passion[];
  tags: string[];
  ctaTitle: string;
  ctaSubtitle: string;
}

const defaultData: AboutData = {
  name: "Your Name",
  title: "Creative Developer",
  location: "Your Location",
  content: "I am an Electronics & Telecommunications Engineer passionate about creating innovative digital solutions.",
  avatar: "",
  mission: "Building scalable products that blend technical excellence with intuitive design.",
  stats: [
    { value: "3+", label: "Years Experience" },
    { value: "20+", label: "Projects" },
    { value: "10+", label: "Clients" },
    { value: "100%", label: "Dedication" },
  ],
  passions: [
    { icon: "Code", label: "Clean Code" },
    { icon: "Palette", label: "UI/UX Design" },
    { icon: "Cpu", label: "Innovation" },
    { icon: "Heart", label: "Open Source" },
  ],
  tags: ["Full-Stack", "React", "Node.js", "TypeScript"],
  ctaTitle: "Let's Build Something Amazing",
  ctaSubtitle: "Open to collaborations and new opportunities."
};

import * as SimpleIcons from "react-icons/si";

// Helper to get icon component from string name
const getIcon = (iconName: string) => {
  // Check for Simple Icons (Si prefix)
  if (iconName.startsWith("Si")) {
    const IconComponent = (SimpleIcons as any)[iconName];
    return IconComponent || Heart;
  }

  // Check Lucide Icons
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || Heart;
};

export const AboutSection = () => {
  const [data, setData] = useState<AboutData>(defaultData);
  const [currentCV, setCurrentCV] = useState<{ url: string; filename?: string } | null>(null);
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, cvRes, contactRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/cv'),
          fetch('/api/contact'),
        ]);
        const aboutData = await aboutRes.json();
        const cvData = await cvRes.json();
        const contactData = await contactRes.json();

        if (aboutData.success && aboutData.data) {
          const d = aboutData.data;
          setData({
            name: d.name || defaultData.name,
            title: d.title || defaultData.title,
            location: d.location || defaultData.location,
            content: d.content || defaultData.content,
            avatar: d.avatar || "",
            mission: d.mission || defaultData.mission,
            stats: d.stats?.length > 0 ? d.stats : defaultData.stats,
            passions: d.passions?.length > 0 ? d.passions : defaultData.passions,
            tags: d.tags?.length > 0 ? d.tags : defaultData.tags,
            ctaTitle: d.ctaTitle || defaultData.ctaTitle,
            ctaSubtitle: d.ctaSubtitle || defaultData.ctaSubtitle,
          });
        }
        if (cvData.success && cvData.data) setCurrentCV(cvData.data);
        if (contactData.success && contactData.data) setSocialLinks(contactData.data);
      } catch (error) {
        console.error("Failed to fetch about section data", error);
      }
    };
    fetchData();
  }, []);

  const _hidden = socialLinks?.hiddenSocials ?? [];
  const socialIcons = [
    { key: 'github', icon: Github, label: 'GitHub', url: socialLinks?.github, hoverBg: 'hover:bg-[#333]' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', url: socialLinks?.linkedin, hoverBg: 'hover:bg-[#0077B5]' },
    { key: 'twitter', icon: Twitter, label: 'Twitter', url: socialLinks?.twitter, hoverBg: 'hover:bg-[#1DA1F2]' },
    { key: 'instagram', icon: Instagram, label: 'Instagram', url: socialLinks?.instagram, hoverBg: 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500' },
    { key: 'facebook', icon: Facebook, label: 'Facebook', url: socialLinks?.facebook, hoverBg: 'hover:bg-[#1877F2]' },
  ].filter(s => s.url && !_hidden.includes(s.key));


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

  return (
    <section ref={containerRef} id="about" className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Neon Orbs Background */}
      <NeonOrbs className="opacity-30" />

      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6"
        >
          <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-primary" />
          <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.15em] md:tracking-[0.2em]">About Me</span>
          <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-primary" />
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-10 md:mb-16"
        >
          Backend Developer
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-400 to-emerald-400">
            Nodejs
          </span>
        </motion.h2>

        {/* MOBILE STACKED LAYOUT (Visible on < md) */}
        <div className="md:hidden flex flex-col gap-4 pb-24">

          {/* Profile Header Card */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
              {/* Profile Image */}
              <div className="relative shrink-0">
                <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden border-2 border-cyan-500/30">
                  {data.avatar ? (
                    <img src={data.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Name & Location */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white tracking-tight truncate">
                  {data.name}
                </h3>
                <p className="text-[13px] text-gray-400 truncate">{data.title}</p>
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs mt-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{data.location}</span>
                </div>
                {/* Tags Row */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {data.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[10px] text-cyan-300 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[13px] text-gray-300 leading-relaxed line-clamp-3">
              {data.content}
            </p>
          </div>

          {/* Stats Grid — 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            {data.stats.slice(0, 4).map((stat, i) => (
              <div
                key={i}
                className="bg-gray-900/60 border border-white/5 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-400">{stat.value}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Passions Row */}
          <div className="flex justify-center gap-3">
            {data.passions.slice(0, 4).map((passion, i) => {
              const IconComp = getIcon(passion.icon);
              return (
                <div
                  key={i}
                  className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
                  title={passion.label}
                >
                  <IconComp size={18} className="text-cyan-400" />
                </div>
              );
            })}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-2">
            {socialIcons.map(({ icon: Icon, label, url, hoverBg }) => (
              url && (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/10 active:bg-white/10 transition-colors"
                  title={label}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                </a>
              )
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white min-h-[48px] rounded-xl font-semibold text-[13px]"
          >
            Let's Talk
          </Button>
        </div>

        {/* DESKTOP BENTO GRID (Visible on >= md) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="hidden md:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6"
        >
          {/* Card 1: Profile Image */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 lg:col-span-1 lg:row-span-2 group">
            <div className="relative h-full min-h-[200px] md:min-h-[400px] rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/10 border border-white/10 hover:border-white/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {data.avatar ? (
                <img src={data.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Name Badge */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-1">{data.name}</h3>
                <p className="text-gray-300 text-xs md:text-sm flex items-center gap-1 md:gap-2">
                  <MapPin size={12} className="md:w-3.5 md:h-3.5" />
                  {data.location}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bio */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="h-full p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-cyan-500/20">
                  <Sparkles size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">The Story</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">{data.content}</p>
              {data.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-gray-400">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 3: Mission */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/20">
                  <Target size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Mission</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">{data.mission}</p>
            </div>
          </motion.div>

          {/* Card 4: Stats */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
            <div className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Award size={20} className="text-yellow-400" />
                By The Numbers
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.stats.map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-400">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 5: Passions */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-4">Passionate About</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.passions.map((item, i) => {
                  const IconComp = getIcon(item.icon);
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                      <IconComp size={16} className="text-cyan-400" />
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Card 6: Social Links */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <div className="flex flex-wrap gap-3">
                {socialIcons.map(({ icon: Icon, label, url, hoverBg }) => (
                  url && (
                    <motion.a key={label} href={url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:text-white ${hoverBg}`} title={label}>
                      <Icon size={20} />
                    </motion.a>
                  )
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 7: CTA */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="h-full p-8 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-sky-500/20 border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{data.ctaTitle}</h3>
                <p className="text-gray-400">{data.ctaSubtitle}</p>
              </div>
              <div className="flex gap-4 flex-shrink-0">
                {currentCV && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/cv/download');
                          const disposition = response.headers.get('Content-Disposition');
                          let name = currentCV?.filename || 'resume.pdf';
                          if (disposition) { const m = disposition.match(/filename="?([^"\n]+)"?/); if (m) name = m[1]; }
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = name;
                          document.body.appendChild(a); a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } catch (err) { console.error('Download failed:', err); }
                      }}
                      className="bg-white text-black hover:bg-gray-100 px-6 py-5 rounded-xl font-semibold flex items-center gap-2"
                    >
                      <Download size={18} />
                      Resume
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="border-white/20 hover:bg-white/10 px-6 py-5 rounded-xl font-semibold flex items-center gap-2">
                    Contact Me
                    <ArrowRight size={18} />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};