import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SkillCard } from "./SkillCard";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { SkillRail } from "./SkillRail";

interface Skill {
    _id: string;
    name: string;
    category: string;
    level: string;
    icon: string;
}

export const SkillDeck = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/skills');
            const json = await res.json();
            if (json.success) {
                setSkills(json.data);
            }
        } catch (err) {
            console.error("Failed to fetch skills", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 1. Smart Sorting Logic
    const categoryPriority: Record<string, number> = {
        "Frontend": 1,
        "Backend": 2,
        "Mobile": 3,
        "Tools": 4,
        "Other": 5
    };

    const levelPriority: Record<string, number> = {
        "Expert": 1,
        "Advanced": 2,
        "Intermediate": 3,
        "Beginner": 4
    };

    const sortedSkills = [...skills].sort((a, b) => {
        // Sort by Category Priority
        const catA = categoryPriority[a.category] || 99;
        const catB = categoryPriority[b.category] || 99;
        if (catA !== catB) return catA - catB;

        // Sort by Level Priority (Highest first)
        const levA = levelPriority[a.level] || 99;
        const levB = levelPriority[b.level] || 99;
        return levA - levB;
    });

    // 2. Filter Logic (Search only, category handled by sections)
    const filteredSkills = sortedSkills;
    // .filter(skill => {
    //     // We only filter by search here, category filtering happens in the render loop or we show all sectors if "All" is selected
    //     return skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    // });

    // 3. Dynamic Grouping
    // Get unique categories from data
    const uniqueCategories = Array.from(new Set(filteredSkills.map(s => s.category)));

    // Sort categories (Known priority first, then others)
    const sortedCategories = uniqueCategories.sort((a, b) => {
        const priorityA = categoryPriority[a] || 99;
        const priorityB = categoryPriority[b] || 99;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return a.localeCompare(b);
    });

    // Group skills by these sorted categories
    const groupedSkills: Record<string, Skill[]> = {};
    sortedCategories.forEach(cat => {
        groupedSkills[cat] = filteredSkills.filter(s => s.category === cat);
    });

    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center">

            {/* MOBILE VIEW — Terminal Window (same as desktop, mobile-scaled) */}
            <div className="md:hidden w-full pb-20">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredSkills.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No skills found in the Arsenal.
                    </div>
                ) : (
                    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0c] shadow-2xl">
                        {/* Terminal Header */}
                        <div className="bg-[#1a1a1a] sticky top-0 z-30 px-3 py-2.5 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                                </div>
                                <div className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/20 border border-white/5">
                                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[9px] font-mono text-white/50 tracking-wider uppercase">
                                        root@arsenal:~/skills
                                    </span>
                                </div>
                            </div>
                            <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
                                BASH // ZSH
                            </div>
                        </div>

                        {/* Terminal Body */}
                        <div className="relative bg-black/40 px-3 py-4 space-y-8">
                            {/* Grid line overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                            {sortedCategories.map((category, index) => {
                                const skillsInCategory = groupedSkills[category];
                                if (!skillsInCategory || skillsInCategory.length === 0) return null;
                                return (
                                    <motion.div
                                        id={`mobile-sector-${category}`}
                                        key={category}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                        className="relative z-10"
                                    >
                                        {/* Category Header — name is the hero */}
                                        <div className="flex items-center gap-3 mb-3">
                                            {/* Prominent category name */}
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <span className="text-[10px] font-mono text-white/20 select-none">#</span>
                                                <h3 className="text-base font-bold font-mono text-white uppercase tracking-widest truncate">
                                                    {category}
                                                </h3>
                                                <span className="shrink-0 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/50">
                                                    {skillsInCategory.length}
                                                </span>
                                            </div>
                                            {/* Dim rule */}
                                            <div className="flex-1 h-px bg-white/5" />
                                        </div>
                                        {/* Secondary CLI path — smaller, dimmer */}
                                        <div className="flex items-center gap-1 mb-3 font-mono text-[9px] text-white/20 pl-4">
                                            <span className="text-green-500/60">➜</span>
                                            <span className="text-blue-400/50">~/skills/{category.toLowerCase()}</span>
                                            <span className="text-white/20">$</span>
                                            <span>./list-modules</span>
                                            <span className="animate-pulse ml-1">_</span>
                                        </div>

                                        {/* Rail output — horizontal scrolling cards with modal on tap */}
                                        <div className="border-l-2 border-white/5 ml-1">
                                            <SkillRail category={category} skills={skillsInCategory} isMobile={true} />
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Footer prompt */}
                            <div className="pt-4 font-mono text-xs flex items-center gap-2 opacity-40">
                                <span className="text-green-500">➜</span>
                                <span className="text-blue-400">~/skills</span>
                                <span className="text-white/30">$</span>
                                <span className="animate-pulse bg-white/50 w-1.5 h-3.5 block" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* DESKTOP VIEW (Terminal Style) */}
            <div className="hidden md:block w-full max-w-7xl relative pb-32 space-y-24">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredSkills.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No skills found in the Arsenal.
                    </div>
                ) : (
                    /* MASTER TERMINAL WINDOW */
                    <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0c] shadow-2xl backdrop-blur-sm z-10 relative">

                        {/* TERMINAL HEADER (Sticky) */}
                        <div className="bg-[#1a1a1a] sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5 group/traffic">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 transition-all" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 transition-all" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 transition-all" />
                                </div>
                                <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded-md bg-black/20 border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">
                                        root@arsenal:~/skills
                                    </span>
                                </div>
                            </div>
                            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase hidden sm:block">
                                BASH // ZSH // V.1.0
                            </div>
                        </div>

                        {/* TERMINAL BODY (Scrollable Content) */}
                        <div className="relative bg-black/40 p-2 sm:p-6 space-y-12">
                            {/* Grid Line overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[side:40px_40px] pointer-events-none" />

                            {sortedCategories.map((category, index) => {
                                const skillsInCategory = groupedSkills[category];
                                if (!skillsInCategory || skillsInCategory.length === 0) return null;

                                return (
                                    <motion.div
                                        id={`sector-${category}`}
                                        key={category}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="relative z-10"
                                    >
                                        {/* Category Header — name is the hero */}
                                        <div className="flex items-center gap-4 mb-4">
                                            {/* Prominent category name */}
                                            <div className="flex items-center gap-2.5 shrink-0">
                                                <span className="text-sm font-mono text-white/20 select-none">#</span>
                                                <h3 className="text-xl font-bold font-mono text-white uppercase tracking-widest">
                                                    {category}
                                                </h3>
                                                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/50">
                                                    {skillsInCategory.length} modules
                                                </span>
                                            </div>
                                            {/* Rule line */}
                                            <div className="flex-1 h-px bg-white/5" />
                                        </div>
                                        {/* Secondary CLI path — smaller, dimmer */}
                                        <div className="flex items-center gap-2 mb-4 font-mono text-xs text-white/20 pl-2">
                                            <span className="text-green-500/60">➜</span>
                                            <span className="text-blue-400/50">~/skills/{category.toLowerCase()}</span>
                                            <span>$</span>
                                            <span>./list-modules</span>
                                            <span className="text-white/20">&gt;</span>
                                            <span>FOUND {skillsInCategory.length} ACTIVE MODULES</span>
                                            <span className="animate-pulse">_</span>
                                        </div>

                                        {/* RAIL OUTPUT */}
                                        <div className="pl-0 sm:pl-4 border-l-2 border-white/5 ml-1.5">
                                            <SkillRail category={category} skills={skillsInCategory} />
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* TERMINAL FOOTER PROMPT */}
                            <div className="pt-8 font-mono text-sm flex items-center gap-2 opacity-50">
                                <span className="text-green-500">➜</span>
                                <span className="text-blue-400">~/skills</span>
                                <span className="text-white/30">$</span>
                                <span className="animate-pulse bg-white/50 w-2 h-4 block" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

