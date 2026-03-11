import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { AdminLoader } from "../AdminLoader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Layers, Plus, Save, Trash2, Loader2, X, ChevronRight, Search,
    ArrowRight, Sparkles, CheckCircle2, AlertTriangle, BarChart3, ListChecks, Eye
} from "lucide-react";
import * as LucideIcons from "lucide-react";

const MAX_SERVICES = 3;

export interface ServiceDB {
    _id?: string;
    title: string;
    description: string;
    icon: string;
    highlight: string;          // e.g. "Premium quality guaranteed"
    features: string[];         // up to 4 bullets
    stats: { label: string; value: string }[]; // up to 3 stats
}

const ICON_CATEGORIES = {
    "Development": ["Code", "Terminal", "Laptop", "Monitor", "Smartphone", "Globe", "Server", "Database", "Cloud", "Cpu"],
    "Design": ["Palette", "PenTool", "Figma", "Layout", "Image", "Layers", "Brush", "Sparkles", "Wand2", "Eye"],
    "Business": ["Briefcase", "TrendingUp", "BarChart3", "PieChart", "Target", "Rocket", "Zap", "Award", "Star", "Crown"],
    "Media": ["Video", "Camera", "Music", "Mic", "Play", "Film", "Radio", "Headphones", "Volume2", "Podcast"],
};

const defaultStats = [
    { label: "Projects", value: "20+" },
    { label: "Satisfaction", value: "100%" },
    { label: "Experience", value: "3+ Yrs" },
];

const emptyService = (): ServiceDB => ({
    title: "",
    description: "",
    icon: "Code",
    highlight: "Premium quality guaranteed",
    features: ["Custom Solutions", "Modern Technologies", "Fast Delivery", "24/7 Support"],
    stats: defaultStats,
});

export const ServicesAdmin = () => {
    const [services, setServices] = useState<ServiceDB[]>([]);
    const [selected, setSelected] = useState<ServiceDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [iconSearch, setIconSearch] = useState("");
    const [newFeature, setNewFeature] = useState("");
    const [activeTab, setActiveTab] = useState<"basic" | "card" | "preview">("basic");

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const json = await res.json();
            if (json.success) setServices(json.data || []);
        } catch { toast.error("Failed to fetch services"); }
        finally { setIsLoading(false); }
    };

    const handleSave = async () => {
        if (!selected) return;
        if (!selected.title.trim()) { toast.error("Title is required"); return; }

        setIsSaving(true);
        try {
            const isNew = !selected._id;
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? '/api/services' : `/api/services/${selected._id}`;
            const { _id, ...payload } = selected;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (json.success) {
                toast.success(isNew ? "Service created" : "Service updated");
                await fetchServices();
                if (isNew) setSelected(json.data);
            } else {
                toast.error(json.error || "Failed to save");
            }
        } catch { toast.error("Error saving service"); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async () => {
        if (!selected?._id) return;
        if (!confirm("Delete this service?")) return;
        try {
            await fetch(`/api/services/${selected._id}`, { method: 'DELETE' });
            toast.success("Service deleted");
            setServices(prev => prev.filter(s => s._id !== selected._id));
            setSelected(null);
        } catch { toast.error("Error deleting service"); }
    };

    const handleNew = () => {
        if (services.length >= MAX_SERVICES) {
            toast.error(`Maximum ${MAX_SERVICES} services allowed. Delete one first.`);
            return;
        }
        setSelected(emptyService());
        setActiveTab("basic");
    };

    const update = <K extends keyof ServiceDB>(field: K, value: ServiceDB[K]) => {
        if (!selected) return;
        setSelected({ ...selected, [field]: value });
    };

    const addFeature = () => {
        if (!newFeature.trim() || !selected) return;
        if (selected.features.length >= 4) { toast.error("Max 4 feature bullets"); return; }
        update('features', [...selected.features, newFeature.trim()]);
        setNewFeature("");
    };

    const removeFeature = (i: number) => {
        if (!selected) return;
        update('features', selected.features.filter((_, idx) => idx !== i));
    };

    const updateStat = (i: number, field: 'label' | 'value', val: string) => {
        if (!selected) return;
        const stats = [...selected.stats];
        stats[i] = { ...stats[i], [field]: val };
        update('stats', stats);
    };

    const renderIcon = (iconName: string, size = 20) => {
        // @ts-ignore
        const I = LucideIcons[iconName] || LucideIcons.Zap;
        return <I size={size} />;
    };

    const getAllIcons = () => {
        const all: string[] = [];
        Object.values(ICON_CATEGORIES).forEach(icons => all.push(...icons));
        if (!iconSearch) return all;
        return all.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase()));
    };

    const atMax = services.length >= MAX_SERVICES;

    if (isLoading) return <AdminLoader />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_0.8fr] gap-6 h-[calc(100vh-140px)]">

            {/* ── Col 1: List ── */}
            <GlassPanel className="flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Layers size={18} className="text-purple-400" />
                            Services
                            <span className={cn(
                                "ml-1 px-2 py-0.5 text-xs rounded-full font-bold",
                                atMax ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"
                            )}>
                                {services.length} / {MAX_SERVICES}
                            </span>
                        </h3>
                        <NeonButton
                            size="sm"
                            onClick={handleNew}
                            disabled={atMax}
                            className={atMax ? "opacity-40 cursor-not-allowed" : ""}
                        >
                            <Plus size={14} className="mr-1" /> New
                        </NeonButton>
                    </div>

                    {/* Max warning */}
                    {atMax && (
                        <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
                            <AlertTriangle size={12} className="shrink-0" />
                            Max 3 services. Delete one to add more.
                        </div>
                    )}

                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {services.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            <Layers size={40} className="mx-auto mb-3 opacity-30" />
                            <p>{searchQuery ? "No match" : "No services yet"}</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {services
                                .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((service, idx) => (
                                    <motion.div
                                        key={service._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => { setSelected({ ...service, features: service.features || [], stats: service.stats || defaultStats }); setActiveTab("basic"); }}
                                        className={cn(
                                            "p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5",
                                            selected?._id === service._id ? "bg-purple-500/10 border-l-2 border-l-purple-500" : ""
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center text-purple-400 shrink-0 text-sm font-bold">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white truncate text-sm">{service.title}</h4>
                                                <p className="text-xs text-gray-500 truncate">{service.description}</p>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-600 shrink-0" />
                                        </div>
                                        {/* Mini feature preview */}
                                        {service.features?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1 pl-12">
                                                {service.features.slice(0, 2).map((f, i) => (
                                                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/10">{f}</span>
                                                ))}
                                                {service.features.length > 2 && <span className="text-[9px] text-gray-600">+{service.features.length - 2}</span>}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    )}
                </div>
            </GlassPanel>

            {/* ── Col 2: Editor ── */}
            <GlassPanel className="flex flex-col overflow-hidden">
                {selected ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                            <h3 className="font-bold text-white text-sm">
                                {selected._id ? "Edit Service" : "New Service"}
                            </h3>
                            <div className="flex gap-2">
                                <NeonButton size="sm" onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-purple-600 to-fuchsia-600">
                                    {isSaving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
                                    Save
                                </NeonButton>
                                {selected._id && (
                                    <NeonButton size="sm" variant="ghost" onClick={handleDelete} className="text-red-400 hover:bg-red-500/20">
                                        <Trash2 size={14} />
                                    </NeonButton>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10 shrink-0">
                            {[
                                { id: "basic", label: "Basic", icon: <Layers size={13} /> },
                                { id: "card", label: "Card Content", icon: <ListChecks size={13} /> },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2",
                                        activeTab === tab.id
                                            ? "text-purple-400 border-purple-500 bg-purple-500/5"
                                            : "text-gray-500 border-transparent hover:text-gray-300"
                                    )}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                            {activeTab === "basic" && (
                                <>
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 text-xs uppercase tracking-wider">Service Title</Label>
                                        <Input value={selected.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Web Development" className="bg-black/30 border-white/10 text-white text-base font-bold h-11" />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 text-xs uppercase tracking-wider">Description</Label>
                                        <Textarea value={selected.description} onChange={e => update('description', e.target.value)} placeholder="Brief description..." className="bg-black/30 border-white/10 text-white min-h-[100px]" />
                                    </div>

                                    {/* Highlight tagline */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 text-xs uppercase tracking-wider">Highlight Tagline <span className="normal-case text-white/30">(shown under title in expanded)</span></Label>
                                        <Input value={selected.highlight} onChange={e => update('highlight', e.target.value)} placeholder="e.g. Premium quality guaranteed" className="bg-black/30 border-white/10 text-white" />
                                    </div>

                                    {/* Icon */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 text-xs uppercase tracking-wider">Icon</Label>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
                                                {renderIcon(selected.icon, 22)}
                                            </div>
                                            <span className="text-sm text-purple-400 font-mono">{selected.icon}</span>
                                        </div>
                                        <div className="relative mb-2">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Search icons..."
                                                value={iconSearch}
                                                onChange={e => setIconSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-9 gap-1.5 max-h-[180px] overflow-y-auto p-2 bg-black/20 rounded-xl border border-white/10 custom-scrollbar">
                                            {getAllIcons().map(icon => (
                                                <button
                                                    key={icon}
                                                    onClick={() => update('icon', icon)}
                                                    className={cn(
                                                        "p-2 rounded-lg border transition-all flex items-center justify-center",
                                                        selected.icon === icon
                                                            ? "bg-purple-500/30 border-purple-500 text-purple-300"
                                                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                                    )}
                                                    title={icon}
                                                >
                                                    {renderIcon(icon, 16)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === "card" && (
                                <>
                                    {/* Features */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-purple-400 text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                                                <CheckCircle2 size={13} /> Feature Bullets
                                            </Label>
                                            <span className={cn(
                                                "text-[10px] font-mono px-2 py-0.5 rounded",
                                                selected.features.length >= 4 ? "text-red-400 bg-red-500/10" : "text-white/30 bg-white/5"
                                            )}>
                                                {selected.features.length}/4
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500">These appear as checkmark bullets in the expanded card (e.g. "Custom Solutions")</p>

                                        <div className="space-y-2">
                                            {selected.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 group">
                                                    <CheckCircle2 size={13} className="text-violet-400 shrink-0" />
                                                    <Input
                                                        value={f}
                                                        onChange={e => {
                                                            const feats = [...selected.features];
                                                            feats[i] = e.target.value;
                                                            update('features', feats);
                                                        }}
                                                        className="flex-1 h-7 bg-transparent border-0 text-white text-sm px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    />
                                                    <button onClick={() => removeFeature(i)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {selected.features.length < 4 && (
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newFeature}
                                                    onChange={e => setNewFeature(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addFeature()}
                                                    placeholder="Add feature bullet..."
                                                    className="bg-black/30 border-white/10 text-white"
                                                />
                                                <NeonButton size="sm" onClick={addFeature} icon={<Plus size={13} />}>Add</NeonButton>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-white/5" />

                                    {/* Stats */}
                                    <div className="space-y-3">
                                        <Label className="text-purple-400 text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                                            <BarChart3 size={13} /> Stats (3 fixed slots)
                                        </Label>
                                        <p className="text-[11px] text-gray-500">These appear as the 3 stat boxes (value + label) in the expanded view.</p>

                                        <div className="space-y-2">
                                            {(selected.stats?.length ? selected.stats : defaultStats).map((stat, i) => (
                                                <div key={i} className="grid grid-cols-2 gap-2 items-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono block">Value</span>
                                                        <Input
                                                            value={stat.value}
                                                            onChange={e => updateStat(i, 'value', e.target.value)}
                                                            className="h-8 bg-black/30 border-white/10 text-white font-bold text-center"
                                                            placeholder="e.g. 50+"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono block">Label</span>
                                                        <Input
                                                            value={stat.label}
                                                            onChange={e => updateStat(i, 'label', e.target.value)}
                                                            className="h-8 bg-black/30 border-white/10 text-white/70 text-center"
                                                            placeholder="e.g. Projects"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-6">
                        <div>
                            <Layers size={50} className="mx-auto mb-4 text-gray-700" />
                            <p className="text-gray-500 mb-4">Select a service to edit</p>
                            {!atMax && (
                                <NeonButton onClick={handleNew}>
                                    <Plus size={16} className="mr-2" /> Create Service
                                </NeonButton>
                            )}
                        </div>
                    </div>
                )}
            </GlassPanel>

            {/* ── Col 3: Preview ── */}
            <GlassPanel className="flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center gap-2 shrink-0">
                    <Eye size={15} className="text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Preview</h3>
                    <span className="ml-auto text-[9px] text-white/30 uppercase tracking-widest font-mono">expanded</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {selected ? (
                        <div className="space-y-4">
                            {/* Compact card (normal state) */}
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2 font-mono">Normal</p>
                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center mb-3 shadow-lg">
                                        {renderIcon(selected.icon, 20)}
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-1">{selected.title || "Service Title"}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">{selected.description || "Description..."}</p>
                                    <div className="flex items-center gap-1 text-xs text-violet-400 mt-3">
                                        <span>Explore</span><ArrowRight size={11} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded card */}
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-white/20 mb-2 font-mono">Expanded (click)</p>
                                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/20 space-y-3">
                                    {/* Header */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shrink-0 shadow-lg">
                                            {renderIcon(selected.icon, 22)}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white leading-tight">{selected.title || "Service Title"}</h3>
                                            <div className="flex items-center gap-1 text-violet-400 text-[10px] mt-0.5">
                                                <Sparkles size={10} />
                                                <span>{selected.highlight || "Tagline here"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-xs leading-relaxed">{selected.description || "Description..."}</p>

                                    {/* Feature bullets */}
                                    {selected.features?.length > 0 && (
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {selected.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                                                    <CheckCircle2 size={10} className="text-violet-400 shrink-0" />
                                                    <span>{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    {selected.stats?.length > 0 && (
                                        <div className="flex gap-2 pt-2">
                                            {selected.stats.map((s, i) => (
                                                <div key={i} className="flex-1 p-2 rounded-lg bg-violet-500/10 border border-white/10 text-center">
                                                    <div className="text-sm font-bold text-white">{s.value}</div>
                                                    <div className="text-[9px] text-gray-400">{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                            Select a service
                        </div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
