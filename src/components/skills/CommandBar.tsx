import { motion } from "framer-motion";
import { Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CommandBarProps {
    activeCategory: string;
    onSelect: (category: string) => void;
    searchQuery: string;
    onSearch: (query: string) => void;
    categories: string[];
}

export const CommandBar = ({ activeCategory, onSelect, searchQuery, onSearch, categories }: CommandBarProps) => {
    return (
        <div className="w-full max-w-5xl mx-auto mb-16 relative z-30">
            <div className="flex flex-col md:flex-row items-center p-2 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl gap-4 md:gap-0">

                {/* Category Pills (The Neural Strip) */}
                <div className="flex items-center gap-1 p-1 overflow-x-auto w-full md:w-auto scrollbar-hide">
                    {["All", ...categories].map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => onSelect(cat)}
                                className={cn(
                                    "relative px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 shrink-0",
                                    isActive ? "text-white" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCommand"
                                        className="absolute inset-0 bg-white/10 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-8 bg-white/10 mx-4" />

                {/* Search Module */}
                <div className="relative w-full md:flex-1 group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <Input
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search Arsenal..."
                        className="pl-10 h-11 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 text-base"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>
        </div>
    );
};
