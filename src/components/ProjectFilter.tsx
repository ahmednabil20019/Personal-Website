import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Code, Cpu, Globe, Database } from "lucide-react";

const categories = [
    { id: "all", label: "All Projects", icon: Globe },
    { id: "frontend", label: "Frontend", icon: Code },
    { id: "backend", label: "Backend", icon: Database },
    { id: "fullstack", label: "Full Stack", icon: Cpu },
];

export const ProjectFilter = ({ activeCategory, onCategoryChange, onSearch }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto mb-12 relative z-20">
            <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row items-center gap-4 bg-black/40 backdrop-blur-xl border-white/10">

                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>

                {/* Categories (Desktop) */}
                <div className="hidden md:flex items-center gap-2">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}
                `}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="md:hidden p-3 rounded-xl bg-white/5 text-white border border-white/10"
                >
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Categories Dropdown */}
            <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                className="md:hidden overflow-hidden"
            >
                <div className="flex flex-wrap gap-2 mt-4 p-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => { onCategoryChange(cat.id); setIsExpanded(false); }}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium w-full
                ${activeCategory === cat.id
                                    ? "bg-primary text-white"
                                    : "bg-white/5 text-muted-foreground"}
              `}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
