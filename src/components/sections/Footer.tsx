import { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, Facebook, Heart, ArrowUp, Mail, Code } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { Waves } from '@/components/ui/wave-background';

export const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    linkedin: '',
    github: '',
    twitter: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    messenger: '',
    hiddenSocials: [] as string[]
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();
        if (data.success && data.data) {
          setContactInfo(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { key: 'github', icon: Github, url: contactInfo.github, color: 'from-gray-700 to-gray-900', label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, url: contactInfo.linkedin, color: 'from-blue-600 to-blue-800', label: 'LinkedIn' },
    { key: 'twitter', icon: FaXTwitter, url: contactInfo.twitter, color: 'from-gray-800 to-black', label: 'Twitter' },
    { key: 'instagram', icon: Instagram, url: contactInfo.instagram, color: 'from-pink-500 to-purple-600', label: 'Instagram' },
    { key: 'facebook', icon: Facebook, url: contactInfo.facebook, color: 'from-blue-600 to-blue-700', label: 'Facebook' },
  ].filter(s => s.url && s.url.trim() && !contactInfo.hiddenSocials.includes(s.key));

  return (
    <footer className="relative border-t border-primary/10">
      {/* Background elements */}
      {/* Background elements - Kinetic Waves */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <Waves
          backgroundColor="#020617" // Very dark slate/blue for footer
          strokeColor="rgba(255,255,255,0.1)" // Very subtle white lines
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-12 md:py-16 pb-32 md:pb-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg"></div>
                <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm p-2 rounded-full border border-primary/40 shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-8 h-8 object-contain filter brightness-0 invert"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg">Ahmed Nabil</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground">Backend Developer(Nodejs)</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Building Apis and backend services for web and mobile applications.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-1.5 text-xs md:text-sm">
              {['Home', 'About', 'Projects', 'Certifications', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const id = item.toLowerCase();
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold text-xs md:text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs md:text-sm text-muted-foreground">Get notified about new projects and updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2.5 rounded-lg bg-secondary/40 border border-primary/20 focus:border-primary/50 outline-none transition-colors text-xs md:text-sm"
              />
              <motion.button
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-2.5 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-primary/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {socialLinks.map((link, idx) => {
            if (!link.url || !link.url.trim()) return null;
            const Icon = link.icon;
            return (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3.5 rounded-full bg-gradient-to-r ${link.color} hover:shadow-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center`}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Copyright */}
          <div className="text-center md:text-left text-xs md:text-sm text-muted-foreground">
            <p className="flex items-center justify-center md:justify-start gap-1 mb-1">
              Made with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="inline-flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.span> by Ahmed Nabil
            </p>
            <p>© {currentYear} All rights reserved.</p>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
            <Code className="w-4 h-4" />
            <span>Built with React • Vite • Tailwind • Framer Motion</span>
          </div>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40 hover:border-primary/60 transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <ArrowUp className="w-4 h-4 text-primary" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};
