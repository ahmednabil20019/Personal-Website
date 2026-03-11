import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Send, CheckCircle2, Loader2,
  Mail, MapPin, Phone,
  Github, Linkedin, Twitter, Instagram, Facebook,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ShaderBackground } from "@/components/ui/shader-background";

interface ContactInfo {
  email?: string; phone?: string; location?: string;
  github?: string; linkedin?: string; twitter?: string;
  instagram?: string; facebook?: string;
  hiddenSocials?: string[];
}

// ─── Web Audio ────────────────────────────────────────────────────────────────
function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 0.12, 0.24].forEach((t, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = [523.25, 659.25, 783.99][i];
      gain.gain.setValueAtTime(0.25, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.35);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.4);
    });
  } catch { }
}

function playErrorSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 0.15].forEach((t) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sawtooth"; osc.frequency.value = 150;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch { }
}

// ─── Particle ─────────────────────────────────────────────────────────────────
const Particle = ({ angle, color }: { angle: number; color: string }) => {
  const rad = (angle * Math.PI) / 180;
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ backgroundColor: color, top: "50%", left: "50%", marginTop: -4, marginLeft: -4 }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: Math.cos(rad) * 100, y: Math.sin(rad) * 100, opacity: 0, scale: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    />
  );
};

// ─── Shared Feedback Overlay (used by both mobile & desktop) ─────────────────
type SendState = "idle" | "sending" | "success" | "error";

const PARTICLE_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
const SUCCESS_COLORS = ["#22c55e", "#4ade80", "#86efac", "#6ee7b7", "#34d399"];
const ERROR_COLORS = ["#ef4444", "#f87171", "#fca5a5", "#f97316", "#fb923c"];

interface FeedbackOverlayProps { state: SendState; onRetry: () => void; }

const FeedbackOverlay = ({ state, onRetry }: FeedbackOverlayProps) => (
  <AnimatePresence mode="wait">
    {state === "sending" && (
      <motion.div key="sending" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-sm rounded-inherit">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} />
          <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}>
            <Send size={32} className="text-primary" />
          </motion.div>
        </div>
        <div className="flex gap-2">
          {[0, 0.18, 0.36].map((d, i) => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: d }} />
          ))}
        </div>
        <p className="font-mono text-sm text-gray-400 tracking-widest uppercase animate-pulse">Transmitting…</p>
      </motion.div>
    )}

    {state === "success" && (
      <motion.div key="success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-background/95 backdrop-blur-sm rounded-inherit overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PARTICLE_ANGLES.map((angle, i) => <Particle key={i} angle={angle} color={SUCCESS_COLORS[i % SUCCESS_COLORS.length]} />)}
        </div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-400" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
          <h3 className="text-2xl font-bold text-white mb-1">Message Sent!</h3>
          <p className="text-green-400/80 text-sm">I'll get back to you very soon ✦</p>
        </motion.div>
        <motion.div className="w-6 h-6 rounded-full border-2 border-green-500/30 border-t-green-400"
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
        <p className="text-gray-600 text-xs">Returning to form…</p>
      </motion.div>
    )}

    {state === "error" && (
      <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1, x: [0, -10, 10, -7, 7, -3, 3, 0] }} exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-background/95 backdrop-blur-sm rounded-inherit overflow-hidden">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            {PARTICLE_ANGLES.slice(0, 8).map((angle, i) => <Particle key={i} angle={angle} color={ERROR_COLORS[i % ERROR_COLORS.length]} />)}
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
            <XCircle size={40} className="text-red-400" />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
          <h3 className="text-2xl font-bold text-white mb-1">Send Failed</h3>
          <p className="text-red-400/80 text-sm">Something went wrong. Trying again shortly…</p>
        </motion.div>
        <Button variant="outline" onClick={onRetry} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
          Try Again Now
        </Button>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [mobileState, setMobileState] = useState<SendState>("idle");
  const [desktopState, setDesktopState] = useState<SendState>("idle");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  useEffect(() => {
    fetch('/api/contact').then(r => r.json())
      .then(d => { if (d.success && d.data) setContactInfo(d.data); })
      .catch(() => { });
  }, []);

  const resetMobile = useCallback(() => {
    setMobileState("idle"); setCurrentStep(0);
    setFormData({ name: "", email: "", message: "" });
  }, []);

  const resetDesktop = useCallback(() => {
    setDesktopState("idle");
    setFormData({ name: "", email: "", message: "" });
  }, []);

  const submit = async (onSuccess: () => void, onError: () => void) => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields"); return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) { playSuccessSound(); onSuccess(); toast.success("Message sent!"); }
      else throw new Error(data.error);
    } catch {
      playErrorSound(); onError(); toast.error("Failed to send.");
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMobileState("sending");
    await submit(
      () => { setMobileState("success"); setTimeout(() => resetMobile(), 4000); },
      () => { setMobileState("error"); setTimeout(() => resetMobile(), 3500); },
    );
  };

  const handleDesktopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDesktopState("sending");
    await submit(
      () => { setDesktopState("success"); setTimeout(() => resetDesktop(), 4000); },
      () => { setDesktopState("error"); setTimeout(() => resetDesktop(), 3500); },
    );
  };

  const nextStep = () => {
    if (currentStep === 0 && !formData.name) return toast.error("Name is required");
    if (currentStep === 1 && !formData.email) return toast.error("Email is required");
    setCurrentStep(p => p + 1);
  };
  const prevStep = () => setCurrentStep(p => p - 1);

  const contactItems = [
    { icon: Mail, label: "Email", value: contactInfo.email, href: contactInfo.email ? `mailto:${contactInfo.email}` : null },
    { icon: Phone, label: "Phone", value: contactInfo.phone, href: contactInfo.phone ? `tel:${contactInfo.phone}` : null },
    { icon: MapPin, label: "Location", value: contactInfo.location, href: null },
  ].filter(i => i.value);

  const hidden = contactInfo.hiddenSocials ?? [];
  const socialLinks = [
    { key: "github", icon: Github, url: contactInfo.github, label: "GitHub" },
    { key: "linkedin", icon: Linkedin, url: contactInfo.linkedin, label: "LinkedIn" },
    { key: "twitter", icon: Twitter, url: contactInfo.twitter, label: "Twitter" },
    { key: "instagram", icon: Instagram, url: contactInfo.instagram, label: "Instagram" },
    { key: "facebook", icon: Facebook, url: contactInfo.facebook, label: "Facebook" },
  ].filter(s => s.url && !hidden.includes(s.key));

  return (
    <section id="contact" ref={containerRef}
      className="py-16 md:py-32 relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <ShaderBackground className="pointer-events-none opacity-40" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* ══════════════════════════════════════
            MOBILE  (< lg)
        ══════════════════════════════════════ */}
        <div className="lg:hidden max-w-lg mx-auto">

          {/* Section header — always visible on mobile */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
              <span className="text-primary text-xs font-medium uppercase tracking-[0.2em]">Contact</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Let's <span className="text-primary">Connect</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Have a project in mind? Drop me a message below.
            </p>
          </motion.div>

          {/* Wizard */}
          <div className="min-h-[52vh] flex flex-col justify-center">
            <AnimatePresence mode="wait">

              {mobileState === "sending" && (
                <motion.div key="m-sending" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-8 py-16">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <motion.div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} />
                    <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}>
                      <Send size={36} className="text-primary" />
                    </motion.div>
                  </div>
                  <div className="flex gap-2">
                    {[0, 0.18, 0.36].map((d, i) => (
                      <motion.div key={i} className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: d }} />
                    ))}
                  </div>
                  <p className="text-gray-400 font-mono text-sm tracking-widest uppercase animate-pulse">Transmitting message…</p>
                </motion.div>
              )}

              {mobileState === "success" && (
                <motion.div key="m-success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex flex-col items-center justify-center gap-6 py-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {PARTICLE_ANGLES.map((a, i) => <Particle key={i} angle={a} color={SUCCESS_COLORS[i % SUCCESS_COLORS.length]} />)}
                  </div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <CheckCircle2 size={48} className="text-green-400" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-3xl font-bold text-white mb-2">Message Sent!</h2>
                    <p className="text-green-400/80 text-sm">I'll get back to you very soon ✦</p>
                  </motion.div>
                  <motion.div className="w-8 h-8 rounded-full border-2 border-green-500/40 border-t-green-400"
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
                  <p className="text-gray-600 text-xs">Returning to form…</p>
                </motion.div>
              )}

              {mobileState === "error" && (
                <motion.div key="m-error" initial={{ opacity: 0 }}
                  animate={{ opacity: 1, x: [0, -12, 12, -8, 8, -4, 4, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {PARTICLE_ANGLES.slice(0, 8).map((a, i) => <Particle key={i} angle={a} color={ERROR_COLORS[i % ERROR_COLORS.length]} />)}
                    </div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                      <XCircle size={48} className="text-red-400" />
                    </motion.div>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-3xl font-bold text-white mb-2">Send Failed</h2>
                    <p className="text-red-400/80 text-sm">Something went wrong. Trying again shortly…</p>
                  </motion.div>
                  <Button variant="outline" onClick={resetMobile} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    Try Again Now
                  </Button>
                </motion.div>
              )}

              {mobileState === "idle" && (
                <motion.div key="m-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {currentStep === 0 && "What's your name?"}
                      {currentStep === 1 && "How can I reach you?"}
                      {currentStep === 2 && "What's on your mind?"}
                    </h2>
                    <p className="text-gray-400 text-sm">Step {currentStep + 1} of {totalSteps}</p>
                    <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }} className="h-full bg-primary" />
                    </div>
                  </div>

                  <form onSubmit={handleMobileSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {currentStep === 0 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                          <Input autoFocus placeholder="Your Name" value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 text-2xl h-16 focus:ring-0 focus:border-primary placeholder:text-white/20" />
                        </motion.div>
                      )}
                      {currentStep === 1 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                          <Input autoFocus type="email" placeholder="name@example.com" value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 text-2xl h-16 focus:ring-0 focus:border-primary placeholder:text-white/20" />
                        </motion.div>
                      )}
                      {currentStep === 2 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                          <Textarea autoFocus placeholder="Tell me about your project…" value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 text-xl min-h-[180px] focus:ring-0 focus:border-primary placeholder:text-white/20 resize-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-4 pt-8">
                      {currentStep > 0 && (
                        <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-14 border-white/10 hover:bg-white/10">Back</Button>
                      )}
                      {currentStep < 2 ? (
                        <Button type="button" onClick={nextStep} className="flex-1 h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg">Next</Button>
                      ) : (
                        <Button type="submit" className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg gap-2">
                          <Send size={18} /> Send Message
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-10 flex justify-center gap-6">
                    {socialLinks.map(s => (
                      <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <s.icon size={20} />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* ══════════════════════════════════════
            DESKTOP  (>= lg)
        ══════════════════════════════════════ */}
        <div className="hidden lg:block max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
              <span className="text-primary text-sm font-medium uppercase tracking-[0.2em]">Contact</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-4">
              Let's <span className="text-primary">Connect</span>
            </h2>
            <p className="text-base text-gray-400 max-w-lg mx-auto">
              Have a project in mind? Send me a message and I'll get back to you soon.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Info side */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }} className="group">
                    {item.href ? (
                      <a href={item.href} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10">
                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <item.icon size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                          <p className="text-white text-base font-medium truncate">{item.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <item.icon size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                          <p className="text-white text-base font-medium truncate">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {socialLinks.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Follow Me</p>
                  <div className="flex gap-3">
                    {socialLinks.map(s => (
                      <motion.a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/10 transition-all">
                        <s.icon size={20} className="text-gray-400 hover:text-white transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-base font-medium">Available for new opportunities</span>
                </div>
              </div>
            </motion.div>

            {/* Form side */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3">
              {/* relative wrapper so overlay is positioned */}
              <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />

                {/* Feedback overlay — sits on top of form */}
                <FeedbackOverlay state={desktopState} onRetry={resetDesktop} />

                <form onSubmit={handleDesktopSubmit} className="space-y-6 relative">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Name</label>
                      <Input placeholder="John Doe" value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} required
                        className="bg-black/30 border-white/10 focus:border-primary/50 h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <Input type="email" placeholder="john@example.com" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} required
                        className="bg-black/30 border-white/10 focus:border-primary/50 h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Message</label>
                    <Textarea placeholder="Tell me about your project…" value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })} required
                      className="min-h-[160px] bg-black/30 border-white/10 focus:border-primary/50 resize-none" />
                  </div>
                  <Button type="submit" disabled={desktopState !== "idle"}
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all gap-2">
                    {desktopState === "idle" && <><Send className="w-5 h-5" /> Send Message</>}
                    {desktopState !== "idle" && <Loader2 className="w-5 h-5 animate-spin" />}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};