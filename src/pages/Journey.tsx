import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { AnimatedPage } from "@/components/AnimatedPage";

interface TimelineItem {
    _id: string;
    type: "education" | "experience";
    title: string;
    organization: string;
    date: string;
    description: string;
    location?: string;
    skills?: string[];
}

export const Journey = () => {
    const [items, setItems] = useState<TimelineItem[]>([]);

    useEffect(() => {
        // Simulate fetching data or fetch from API
        const fetchJourney = async () => {
            try {
                const res = await fetch('/api/journey');
                const data = await res.json();
                if (data.success) setItems(data.data);
            } catch (error) {
                console.error("Failed to fetch journey data", error);
            }
        };
        fetchJourney();
    }, []);

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-background relative overflow-hidden">
                <Navigation />

                {/* Background Elements */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                </div>

                <main className="container mx-auto px-6 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            My <span className="text-primary">Journey</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The educational path and professional experiences that have shaped my career.
                        </p>
                    </motion.div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Center Line */}
                        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent transform md:-translate-x-1/2" />

                        {items.map((item, index) => (
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row gap-8 mb-16 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-[-5px] md:left-1/2 top-0 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transform md:-translate-x-1/2 z-10" />

                                {/* Content Card */}
                                <div className="flex-1 ml-6 md:ml-0">
                                    <div className={`p-6 rounded-2xl bg-secondary/20 backdrop-blur-md border border-white/10 hover:border-primary/30 transition-all duration-300 ${index % 2 === 0 ? "md:text-left" : "md:text-right"
                                        }`}>
                                        <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                            }`}>
                                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                                {item.type === "education" ? <GraduationCap size={20} /> : <Briefcase size={20} />}
                                            </div>
                                            <span className="text-sm font-mono text-primary/80 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                                                {item.date}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                        <h4 className="text-lg text-muted-foreground mb-4 flex items-center gap-2 md:justify-start">
                                            {item.organization}
                                            {item.location && (
                                                <span className="text-xs flex items-center gap-1 opacity-70">
                                                    <MapPin size={12} /> {item.location}
                                                </span>
                                            )}
                                        </h4>

                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            {item.description}
                                        </p>

                                        {item.skills && (
                                            <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "justify-start" : "md:justify-end"
                                                }`}>
                                                {item.skills.map((skill, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Empty Space for alignment */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </main>

                <Footer />
            </div>
        </AnimatedPage>
    );
};

export default Journey;
