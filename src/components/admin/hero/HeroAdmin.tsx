import { useState, useEffect } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Loader2, RefreshCw, Smartphone, Laptop, Monitor } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { AdminLoader } from "../AdminLoader";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroData {
    greeting: string;
    title: string;
    subtitle: string;
    description: string;
    resumeUrl: string;
    socialLinks: boolean;
}

export const HeroAdmin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [data, setData] = useState<HeroData>({
        greeting: "",
        title: "",
        subtitle: "",
        description: "",
        resumeUrl: "",
        socialLinks: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/hero');
                const json = await res.json();
                if (json.success && json.data) {
                    const { greeting, title, subtitle, description, resumeUrl, socialLinks } = json.data;
                    setData({ greeting, title, subtitle, description, resumeUrl, socialLinks });
                }
            } catch (err) {
                toast.error("Failed to load hero data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (field: keyof HeroData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Hero section updated successfully");
            } else {
                toast.error(json.error || "Failed to update");
            }
        } catch (err) {
            toast.error("Error saving data");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <AdminLoader />;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-100px)]">

            {/* --- LEFT: EDITOR --- */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center justify-between sticky top-0 bg-void/90 backdrop-blur-md z-10 py-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Hero Editor</h2>
                    <NeonButton
                        onClick={handleSave}
                        isLoading={isSaving}
                        icon={<Save size={18} />}
                        className="bg-purple-500/10 text-purple-400 border-purple-500/50"
                    >
                        Save Changes
                    </NeonButton>
                </div>

                <GlassPanel className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Greeting & Subtitle - Row 1 */}
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Greeting Text</Label>
                            <Input
                                value={data.greeting}
                                onChange={(e) => handleChange('greeting', e.target.value)}
                                className="bg-black/40 border-white/10 text-white focus:border-cyan-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Subtitle</Label>
                            <Input
                                value={data.subtitle}
                                onChange={(e) => handleChange('subtitle', e.target.value)}
                                className="bg-black/40 border-white/10 text-white focus:border-cyan-500/50 transition-all"
                            />
                        </div>

                        {/* Title - Row 2 (Full Width) */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Main Title</Label>
                            <Input
                                value={data.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="bg-black/40 border-white/10 text-white font-bold text-lg focus:border-cyan-500/50 transition-all h-12"
                            />
                        </div>

                        {/* Description - Row 3 (Full Width) */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Description</Label>
                            <Textarea
                                value={data.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="bg-black/40 border-white/10 text-white min-h-[100px] focus:border-cyan-500/50 transition-all resize-none"
                            />
                        </div>

                        {/* Settings Divider */}
                        <div className="col-span-1 md:col-span-2 pt-4 border-t border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Resume URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={data.resumeUrl}
                                            onChange={(e) => handleChange('resumeUrl', e.target.value)}
                                            className="bg-black/40 border-white/10 text-white"
                                            placeholder="/resume.pdf"
                                        />
                                        <NeonButton variant="ghost" size="icon" className="w-10 h-10 p-0 shrink-0">
                                            <RefreshCw className="h-4 w-4" />
                                        </NeonButton>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 h-10">
                                    <Label className="text-white text-sm cursor-pointer" htmlFor="social-switch">Show Social Links</Label>
                                    <Switch
                                        id="social-switch"
                                        checked={data.socialLinks}
                                        onCheckedChange={(checked) => handleChange('socialLinks', checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* --- RIGHT: PREVIEW --- */}
            <div className="hidden xl:flex flex-col gap-4 h-full overflow-hidden">
                {/* Device Toggle Bar */}
                <div className="flex justify-center gap-4 bg-white/5 p-2 rounded-full w-fit mx-auto border border-white/10 backdrop-blur-md">
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
                            previewMode === 'desktop' ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Laptop size={16} /> Desktop
                    </button>
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
                            previewMode === 'mobile' ? "bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Smartphone size={16} /> Mobile
                    </button>
                </div>

                {/* Preview Container */}
                <div className="flex-1 bg-[#050510] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden flex justify-center items-center">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                    <motion.div
                        layout
                        initial={false}
                        animate={{
                            width: previewMode === 'mobile' ? 375 : '100%',
                            height: previewMode === 'mobile' ? 667 : '100%',
                            borderRadius: previewMode === 'mobile' ? 32 : 0,
                            borderWidth: previewMode === 'mobile' ? 8 : 0,
                            borderColor: previewMode === 'mobile' ? '#333' : 'transparent',
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="relative overflow-hidden bg-black shadow-2xl"
                    >
                        {/* Glitch Overlay on Update */}
                        <AnimatePresence>
                            <motion.div
                                key={JSON.stringify(data)} // Trigger animation on data change
                                initial={{ opacity: 0.8, x: -10 }}
                                animate={{ opacity: 0, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 z-50 pointer-events-none bg-cyan-500/10 mix-blend-screen"
                                style={{
                                    backgroundImage: "linear-gradient(transparent 50%, rgba(0, 0, 0, .5) 50%)",
                                    backgroundSize: "100% 4px"
                                }}
                            />
                        </AnimatePresence>

                        <div className="w-full h-full overflow-y-auto no-scrollbar">
                            <HeroSection previewData={data} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

