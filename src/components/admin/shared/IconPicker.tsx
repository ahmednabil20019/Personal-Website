import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Search } from 'lucide-react';

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    children?: React.ReactNode;
}

// Internal Error Boundary to catch bad icons
class SafeIconWrapper extends React.Component<{ Icon: any, className?: string }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) return <div className="w-5 h-5 bg-red-500/20 rounded flex items-center justify-center text-[8px] text-red-500">!</div>;
        const { Icon, className } = this.props;
        return <Icon className={className} />;
    }
}

const POPULAR_BRANDS = [
    "SiReact", "SiVite", "SiNodedotjs", "SiTypescript", "SiJavascript",
    "SiPython", "SiDocker", "SiAmazonaws", "SiGooglecloud", "SiFirebase",
    "SiMongodb", "SiPostgresql", "SiMysql", "SiRedis", "SiGit",
    "SiGithub", "SiGitlab", "SiHtml5", "SiCss3", "SiTailwindcss",
    "SiSass", "SiFigma", "SiAdobephotoshop", "SiLinux", "SiUbuntu"
];

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, children }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"brands" | "ui" | "upload">("brands");
    const [isUploading, setIsUploading] = useState(false);

    const iconList = useMemo(() => {
        let keys: string[] = [];
        let source: any = {};
        const isSearchEmpty = search.trim().length === 0;

        if (activeTab === "ui") {
            source = (LucideIcons as any).icons || LucideIcons;
            keys = Object.keys(source).filter(key => {
                if (key === "icons" || key === "createLucideIcon" || key === "default" || key === "Icon") return false;
                if (key.charAt(0) === key.charAt(0).toLowerCase()) return false;
                if (key.endsWith("Icon") && source[key.replace("Icon", "")]) return false;
                return true;
            });
            if (isSearchEmpty) return keys.slice(0, 50);
        } else if (activeTab === "brands") {
            source = SimpleIcons;
            if (isSearchEmpty) return POPULAR_BRANDS;
            keys = Object.keys(source).filter(key => key.startsWith("Si"));
        } else {
            return [];
        }

        return keys
            .filter(key => key.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 100);
    }, [search, activeTab]);

    // Safe fallback logic validation
    const SelectedIcon = useMemo(() => {
        if (value.startsWith("http") || value.startsWith("/")) return null; // It's an image
        if (value.startsWith("Si")) {
            return (SimpleIcons as any)[value] || SimpleIcons.SiReact;
        }
        const source = (LucideIcons as any).icons || LucideIcons;
        return source[value] || source.Box;
    }, [value]);

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('files', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            if (json.success && json.data.length > 0) {
                onChange(json.data[0].url);
                setOpen(false);
            } else {
                console.error("Upload failed", json);
            }
        } catch (e) {
            console.error("Upload error", e);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children ? children : (
                    <Button variant="outline" className="w-full justify-between px-3 text-left font-normal border-white/10 bg-white/5 hover:bg-white/10 text-white group transition-all duration-300 hover:border-cyan-500/50">
                        <div className="flex items-center gap-2 overflow-hidden">
                            {(value.startsWith("http") || value.startsWith("/")) ? (
                                <img src={value} alt="icon" className="h-4 w-4 object-contain" />
                            ) : (
                                SelectedIcon ? <SafeIconWrapper Icon={SelectedIcon} className="h-4 w-4 text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all" /> : <span>?</span>
                            )}
                            <span className="truncate text-gray-300 group-hover:text-white transition-colors">{value.startsWith("http") ? "Custom" : (value || "Select")}</span>
                        </div>
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-[360px] p-0 bg-[#0c0c0c] border border-white/10 shadow-2xl backdrop-blur-xl" align="start">

                {/* Single Header for Navigation */}
                <div className="p-3 border-b border-white/10">
                    <div className="grid grid-cols-2 bg-white/5 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('brands')}
                            className={cn(
                                "text-[10px] py-1.5 rounded-md font-semibold uppercase tracking-wider transition-all",
                                activeTab === 'brands' ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            Brands
                        </button>
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={cn(
                                "text-[10px] py-1.5 rounded-md font-semibold uppercase tracking-wider transition-all",
                                activeTab === 'upload' ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            Upload
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === 'upload' ? (
                    <div className="h-[320px] flex flex-col items-center justify-center p-4">
                        <div
                            className={cn(
                                "w-full h-full border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-300 gap-4",
                                isUploading ? "opacity-50" : "hover:border-cyan-500/50 hover:bg-cyan-500/5"
                            )}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) handleFileUpload(file);
                            }}
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shadow-lg border border-white/10">
                                <Search className="w-8 h-8 text-cyan-400 opacity-50" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-white">Drag & drop logo</p>
                                <p className="text-xs text-gray-500">Supports PNG, SVG, JPG</p>
                            </div>
                            <Input
                                type="file"
                                className="hidden"
                                id="icon-upload"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                            />
                            <label
                                htmlFor="icon-upload"
                                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-xs text-white font-medium cursor-pointer transition-colors border border-white/5"
                            >
                                Browse Files
                            </label>
                            {isUploading && <p className="text-xs text-cyan-400 animate-pulse">Uploading...</p>}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-[320px]">
                        {/* Search Bar */}
                        <div className="p-3 pt-0 pb-2 z-10 bg-[#0c0c0c]">
                            <div className="relative group/search mt-3">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 group-focus-within/search:text-cyan-400 transition-colors" />
                                <Input
                                    placeholder={`Search ${activeTab === 'brands' ? 'brands...' : 'icons...'}`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-9 bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50 transition-all rounded-md"
                                    autoFocus // Keep autofocus
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <ScrollArea className="flex-1 p-3 pt-0">
                            <div className="grid grid-cols-5 gap-2">
                                {iconList.map((iconName) => {
                                    const source = activeTab === "ui" ? ((LucideIcons as any).icons || LucideIcons) : SimpleIcons;
                                    const Icon = (source as any)[iconName];
                                    if (!Icon) return null;
                                    const isSelected = value === iconName;
                                    return (
                                        <button
                                            key={iconName}
                                            onClick={() => {
                                                onChange(iconName);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "group/icon relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 border",
                                                isSelected
                                                    ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                                                    : "bg-white/[0.03] border-transparent hover:bg-white/[0.08] hover:border-white/10"
                                            )}
                                            title={iconName}
                                        >
                                            <SafeIconWrapper
                                                Icon={Icon}
                                                className={cn(
                                                    "h-5 w-5 transition-transform duration-200 group-hover/icon:scale-110",
                                                    isSelected ? "text-cyan-400" : "text-gray-400 group-hover/icon:text-gray-200"
                                                )}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            {iconList.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 py-10">
                                    <span className="text-xs opacity-50">No icons found</span>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

