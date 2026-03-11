import { Bell, Search, Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

export const AdminHeader = () => {
    // ThemeContext currently supports section-based theming, not global toggle yet.
    // Using placeholders for now.
    const { currentTheme } = useTheme();
    const location = useLocation();

    // Generate breadcrumbs from path
    const pathSegments = location.pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
            {/* Breadcrumbs / Search */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center text-sm text-gray-400">
                    <span className="text-gray-600">/</span>
                    {pathSegments.map((segment, index) => (
                        <span key={index} className="flex items-center">
                            <span className="mx-2 text-gray-600">/</span>
                            <span className="capitalize hover:text-white transition-colors cursor-default">
                                {segment}
                            </span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle - To be implemented globally later */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={() => console.log("Theme toggle not implemented")}
                >
                    <Moon size={20} />
                </Button>

                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                    <Bell size={20} />
                </Button>

                <div className="h-6 w-px bg-white/10 mx-1" />

                <Link to="/" target="_blank">
                    <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white">
                        <Globe size={16} />
                        <span className="hidden sm:inline">View Live Site</span>
                    </Button>
                </Link>
            </div>
        </header>
    );
};
