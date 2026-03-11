import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Save, GraduationCap, Briefcase, Code, LayoutTemplate, ChevronUp, ChevronDown, GripVertical, Loader2, Eye, Zap, BookOpen, Trophy, Star, MapPin, Clock } from "lucide-react";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { AdminLoader } from "../AdminLoader";
import { IconPicker } from "../shared/IconPicker";
import { MultiSelect } from "../shared/MultiSelect";
import { cn } from "@/lib/utils";

interface JourneyItemDB {
    _id?: string;
    type: 'work' | 'education' | 'project';
    title: string;
    company: string;
    location: string;
    year: string;
    period: string;
    description: string;
    icon: string;
    color: string;
    technologies: string[];
    techLabel: string;
    achievements: string[];
    order: number;
}

const PRESET_COLORS = [
    { name: "Cyan", value: "#06b6d4", class: "bg-cyan-500" },
    { name: "Purple", value: "#a855f7", class: "bg-purple-500" },
    { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
    { name: "Green", value: "#22c55e", class: "bg-green-500" },
    { name: "Orange", value: "#f97316", class: "bg-orange-500" },
    { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
    { name: "Crimson", value: "#ef4444", class: "bg-red-500" },
    { name: "Gold", value: "#eab308", class: "bg-yellow-500" },
];

// ─── Shared Icon Renderer ───────────────────────────────────────────────────
const RenderIcon = ({ iconName, className, itemType }: { iconName?: string; className?: string; itemType?: string }) => {
    const defaultIcon = itemType === 'education' ? 'GraduationCap' : itemType === 'project' ? 'Code' : 'Briefcase';
    let finalIconName = iconName || defaultIcon;
    if (itemType === 'education' && finalIconName === 'Briefcase') finalIconName = 'GraduationCap';
    if (finalIconName.startsWith("http") || finalIconName.startsWith("/")) {
        return <img src={finalIconName} className={cn("object-contain", className)} alt="" />;
    }
    const isSimple = finalIconName.startsWith("Si");
    const IconLib = isSimple ? SimpleIcons : LucideIcons;
    // @ts-ignore
    const IconComp = IconLib[finalIconName] || (itemType === 'education' ? LucideIcons.GraduationCap : LucideIcons.Briefcase);
    return <IconComp className={className} />;
};

// ─── PREVIEW: Work Card ─────────────────────────────────────────────────────
const PreviewWorkCard = ({ item }: { item: JourneyItemDB }) => (
    <div
        className="relative p-5 rounded-xl bg-[#080808] border overflow-hidden"
        style={{ borderColor: `${item.color}30`, boxShadow: `0 0 0 1px ${item.color}08, 0 20px 40px -12px rgba(0,0,0,0.6)` }}
    >
        {/* Grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
        {/* Corner glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ backgroundColor: item.color }} />

        {/* Status */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Active</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4 relative z-10">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 bg-black/60 shadow-xl shrink-0"
                style={{ borderColor: `${item.color}60`, color: item.color }}
            >
                <RenderIcon iconName={item.icon} itemType={item.type} className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white leading-tight mb-1 truncate">
                    {item.title || <span className="text-white/20 italic">Job Title</span>}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold" style={{ color: item.color }}>
                        {item.company || <span className="text-white/20 italic">Company</span>}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-white/40 font-mono">{item.period || item.year || '—'}</span>
                </div>
            </div>
        </div>

        {/* Description */}
        {item.description && (
            <div className="flex items-stretch gap-3 mb-4 relative z-10">
                <div className="w-0.5 rounded-full shrink-0" style={{ backgroundColor: `${item.color}40` }} />
                <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
            </div>
        )}

        {/* Tech Stack */}
        {item.technologies?.length > 0 && (
            <div className="mb-4 relative z-10">
                {item.techLabel && (
                    <span className="text-[9px] uppercase tracking-widest text-white/30 mb-1.5 block font-mono">{item.techLabel}</span>
                )}
                <div className="flex flex-wrap gap-1.5">
                    {item.technologies.slice(0, 8).map((tech, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 text-white/60 font-mono"
                            style={{ borderColor: i === 0 ? `${item.color}50` : undefined }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Achievements */}
        {item.achievements?.length > 0 && (
            <div className="pt-3 border-t border-white/5 relative z-10">
                <span className="text-[9px] uppercase tracking-widest text-white/30 mb-2 block font-mono">Key Impact</span>
                <div className="space-y-1.5">
                    {item.achievements.slice(0, 4).map((ach, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <Zap size={10} className="shrink-0 mt-0.5" style={{ color: item.color }} />
                            <span className="text-[12px] text-gray-400">{ach}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// ─── PREVIEW: Education Card ─────────────────────────────────────────────────
const PreviewEducationCard = ({ item }: { item: JourneyItemDB }) => (
    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 overflow-hidden backdrop-blur-md">
        {/* Floating cap */}
        <div className="absolute -top-6 -right-6 opacity-[0.03] pointer-events-none">
            <GraduationCap size={140} />
        </div>

        {/* Year badge */}
        <div className="absolute top-4 right-4">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-mono">
                {item.year || '—'}
            </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-xl">
                <RenderIcon iconName={item.icon} itemType="education" className="w-7 h-7" />
            </div>
            <div className="min-w-0">
                <h3 className="text-base font-serif text-white tracking-wide leading-tight mb-0.5 truncate">
                    {item.title || <span className="text-white/20 italic">Degree / Certification</span>}
                </h3>
                <p className="text-xs text-cyan-300/70 truncate">
                    {item.company || <span className="text-white/20 italic">Institution</span>}
                </p>
            </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
            {item.location && (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                        <MapPin size={12} className="text-white/40" />
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-widest text-white/30 block">Campus</span>
                        <span className="text-white/70 text-xs">{item.location}</span>
                    </div>
                </div>
            )}
            {item.period && (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                        <Clock size={12} className="text-white/40" />
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-widest text-white/30 block">Duration</span>
                        <span className="text-white/70 text-xs">{item.period}</span>
                    </div>
                </div>
            )}
        </div>

        {/* Coursework */}
        {item.technologies?.length > 0 && (
            <div className="mb-4">
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/30 mb-2">
                    <BookOpen size={10} /> {item.techLabel || "Key Coursework"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {item.technologies.slice(0, 6).map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] text-gray-300 border border-white/5 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-cyan-400" />
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Honors */}
        {item.achievements?.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent rounded-xl p-3 border-l-4 border-yellow-500/50">
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-yellow-400/80 mb-2 font-bold">
                    <Trophy size={10} /> Honors &amp; Achievements
                </span>
                <div className="space-y-1.5">
                    {item.achievements.slice(0, 4).map((ach, i) => (
                        <div key={i} className="flex items-start gap-2 text-[12px] text-white/70">
                            <Star size={10} className="shrink-0 mt-0.5 text-yellow-400/60" />
                            {ach}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// ─── PREVIEW: Project Card ───────────────────────────────────────────────────
const PreviewProjectCard = ({ item }: { item: JourneyItemDB }) => (
    <div
        className="relative p-5 rounded-xl border overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${item.color}10, transparent)`, borderColor: `${item.color}30` }}
    >
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_top_right,white,transparent_70%)]" />

        <div className="flex items-start gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 bg-black/50 shrink-0" style={{ borderColor: `${item.color}60`, color: item.color }}>
                <RenderIcon iconName={item.icon} itemType="project" className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white leading-tight truncate mb-0.5">
                    {item.title || <span className="text-white/20 italic">Project Name</span>}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: item.color }}>{item.company || 'Personal / Client'}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/30 font-mono">{item.year || '—'}</span>
                </div>
            </div>
        </div>

        {item.description && (
            <p className="text-gray-400 text-xs leading-relaxed mb-4 relative z-10">{item.description}</p>
        )}

        {item.technologies?.length > 0 && (
            <div className="mb-4 relative z-10">
                {item.techLabel && (
                    <span className="text-[9px] uppercase tracking-widest mb-1.5 block font-mono" style={{ color: `${item.color}80` }}>{item.techLabel}</span>
                )}
                <div className="flex flex-wrap gap-1.5">
                    {item.technologies.slice(0, 8).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-white/60">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {item.achievements?.length > 0 && (
            <div className="pt-3 border-t relative z-10" style={{ borderColor: `${item.color}20` }}>
                <span className="text-[9px] uppercase tracking-widest mb-2 block font-mono" style={{ color: `${item.color}80` }}>Key Features</span>
                <div className="space-y-1.5">
                    {item.achievements.slice(0, 4).map((ach, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-[12px] text-gray-400">{ach}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// ─── Timeline Node Mini (for preview context) ─────────────────────────────
const PreviewTimelineNode = ({ item }: { item: JourneyItemDB }) => {
    if (item.type === 'education') {
        return (
            <div className="w-9 h-9 rounded-full bg-[#0a0a16] border-2 border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                <GraduationCap size={16} className="text-purple-400" />
            </div>
        );
    }
    return (
        <div
            className="w-9 h-9 rounded-lg bg-[#0a0a16] border-2 flex items-center justify-center shadow-lg rotate-45"
            style={{ borderColor: `${item.color}60`, boxShadow: `0 0 15px ${item.color}20` }}
        >
            <div className="-rotate-45">
                <RenderIcon iconName={item.icon} itemType={item.type} className="w-4 h-4" style={{ color: item.color } as any} />
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const JourneyAdmin = () => {
    const [items, setItems] = useState<JourneyItemDB[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [newAchievement, setNewAchievement] = useState("");

    const [formData, setFormData] = useState<JourneyItemDB>({
        type: 'work',
        title: "",
        company: "",
        location: "",
        year: "",
        period: "",
        description: "",
        icon: "Briefcase",
        color: "#06b6d4",
        technologies: [],
        techLabel: "Tech Stack",
        achievements: [],
        order: 0
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [journeyRes, skillsRes] = await Promise.all([fetch('/api/journey'), fetch('/api/skills')]);
            const journeyJson = await journeyRes.json();
            const skillsJson = await skillsRes.json();
            if (journeyJson.success) setItems(journeyJson.data);
            if (skillsJson.success) setSkills(skillsJson.data);
        } catch (err) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const method = selectedId ? 'PUT' : 'POST';
            const url = selectedId ? `/api/journey/${selectedId}` : '/api/journey';
            const { _id, ...payload } = formData;
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const json = await res.json();
            if (json.success) {
                toast.success(`Entry ${selectedId ? 'updated' : 'created'}`);
                fetchData();
                if (!selectedId) handleNew();
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Error saving entry");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/journey/${id}`, { method: 'DELETE' });
            toast.success("Entry deleted");
            fetchData();
            if (selectedId === id) handleNew();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const handleSelect = (item: JourneyItemDB) => {
        setSelectedId(item._id || null);
        setFormData({
            ...item,
            technologies: item.technologies || [],
            techLabel: item.techLabel || (item.type === 'education' ? 'Key Coursework' : 'Tech Stack'),
            achievements: item.achievements || [],
            icon: item.icon || (item.type === 'education' ? "GraduationCap" : "Briefcase"),
            color: item.color || "#06b6d4"
        });
    };

    const handleNew = () => {
        const defaultLabel = 'Tech Stack';
        setSelectedId(null);
        setFormData({ type: 'work', title: "", company: "", location: "", year: "", period: "", description: "", icon: "Briefcase", color: "#06b6d4", technologies: [], techLabel: defaultLabel, achievements: [], order: items.length });
    };

    const moveItem = async (index: number, direction: 'up' | 'down') => {
        if (isReordering) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;
        setIsReordering(true);
        const newItems = [...items];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setItems(newItems);
        const reorderData = newItems.map((item, i) => ({ id: item._id, order: i }));
        try {
            const res = await fetch('/api/journey/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: reorderData }) });
            const json = await res.json();
            if (!json.success) { toast.error("Failed to save order"); fetchData(); }
        } catch (err) {
            toast.error("Failed to reorder"); fetchData();
        } finally {
            setIsReordering(false);
        }
    };

    const addAchievement = () => {
        if (!newAchievement.trim()) return;
        setFormData(prev => ({ ...prev, achievements: [...prev.achievements, newAchievement.trim()] }));
        setNewAchievement("");
    };

    const removeAchievement = (index: number) => {
        setFormData(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== index) }));
    };

    const renderIconPreview = (iconName: string, itemType?: string) => {
        const defaultIcon = itemType === 'education' ? 'GraduationCap' : itemType === 'project' ? 'Code' : 'Briefcase';
        let finalIconName = iconName || defaultIcon;
        if (itemType === 'education' && finalIconName === 'Briefcase') finalIconName = 'GraduationCap';
        if (finalIconName.startsWith("http") || finalIconName.startsWith("/")) return <img src={finalIconName} className="w-5 h-5 object-contain" alt="" />;
        const isSimple = finalIconName.startsWith("Si");
        const IconLib = isSimple ? SimpleIcons : LucideIcons;
        // @ts-ignore
        const DefaultIcon = itemType === 'education' ? LucideIcons.GraduationCap : itemType === 'project' ? LucideIcons.Code : LucideIcons.Briefcase;
        // @ts-ignore
        const IconComp = IconLib[finalIconName] || DefaultIcon;
        return <IconComp className="w-5 h-5" />;
    };

    const getLabels = (type: string) => {
        if (type === 'education') return { title: "Degree / Certification", company: "University / Institution", tech: "Relevant Courses / Skills", techLabelDefault: "Key Coursework", achievements: "Honors / Activities", icon: "GraduationCap" };
        if (type === 'project') return { title: "Project Name", company: "Association / Client", tech: "Technologies / Tools", techLabelDefault: "Tech Stack", achievements: "Key Features", icon: "Code" };
        return { title: "Job Title", company: "Company Name", tech: "Technologies Used", techLabelDefault: "Tech Stack", achievements: "Key Achievements", icon: "Briefcase" };
    };

    const labels = getLabels(formData.type);

    if (isLoading) return <AdminLoader />;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr_1fr] gap-6 h-[calc(100vh-140px)]">

            {/* ── Column 1: List ── */}
            <GlassPanel className="flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <LayoutTemplate size={18} className="text-cyan-400" />
                        Timeline ({items.length})
                        {isReordering && <Loader2 size={14} className="animate-spin text-cyan-400" />}
                    </h3>
                    <NeonButton size="sm" onClick={handleNew} variant="secondary" icon={<Plus size={14} />}>
                        New Entry
                    </NeonButton>
                </div>

                <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 text-xs text-cyan-400 flex items-center gap-2">
                    <GripVertical size={14} />
                    Use arrows to reorder timeline entries on the main page
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {items.length === 0 && (
                        <div className="text-center text-gray-500 py-10 italic">No entries yet. Start your journey!</div>
                    )}
                    {items.map((item, index) => (
                        <div
                            key={item._id}
                            className={cn(
                                "flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border relative group",
                                selectedId === item._id
                                    ? "bg-white/10 border-white/20 shadow-lg"
                                    : "bg-white/5 border-transparent hover:bg-white/10"
                            )}
                            style={{ borderColor: selectedId === item._id ? item.color : undefined }}
                        >
                            {/* Order Controls */}
                            <div className="flex flex-col gap-0.5 shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }} disabled={index === 0 || isReordering}
                                    className={cn("p-1 rounded transition-all", index === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/20 text-gray-400 hover:text-white")}>
                                    <ChevronUp size={14} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }} disabled={index === items.length - 1 || isReordering}
                                    className={cn("p-1 rounded transition-all", index === items.length - 1 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/20 text-gray-400 hover:text-white")}>
                                    <ChevronDown size={14} />
                                </button>
                            </div>

                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">{index + 1}</div>
                            <div className="w-1 h-12 rounded-full transition-all shrink-0" style={{ backgroundColor: item.color }} />

                            <div className="flex-1 min-w-0" onClick={() => handleSelect(item)}>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-black/40 shrink-0" style={{ color: item.color || '#06b6d4' }}>
                                        {renderIconPreview(item.icon, item.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                                        <p className="text-xs text-gray-400 truncate">{item.company} • {item.year}</p>
                                    </div>
                                </div>
                            </div>

                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border shrink-0",
                                item.type === 'education' ? "bg-purple-500/10 border-purple-500/20 text-purple-300" :
                                    item.type === 'work' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" :
                                        "bg-orange-500/10 border-orange-500/20 text-orange-300"
                            )}>
                                {item.type}
                            </span>
                        </div>
                    ))}
                </div>
            </GlassPanel>

            {/* ── Column 2: Editor ── */}
            <GlassPanel className="p-0 h-full flex flex-col overflow-hidden relative">
                {/* Visual Header */}
                <div className="relative h-28 overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-20 transition-colors duration-500" style={{ backgroundColor: formData.color }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a16]" />
                    <div className="absolute bottom-4 left-6 flex items-end gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black/50 border border-white/20 backdrop-blur-md shadow-2xl"
                            style={{ borderColor: formData.color, boxShadow: `0 0 25px ${formData.color}30` }}
                        >
                            <div style={{ color: formData.color }} className="scale-125">
                                {renderIconPreview(formData.icon)}
                            </div>
                        </div>
                        <div className="mb-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-0.5">
                                {selectedId ? "EDITING MODE" : "CREATION MODE"}
                            </span>
                            <h2 className="text-xl font-bold text-white leading-none">
                                {formData.title || "Untitled Role"}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                    {/* Type + Year */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Entry Type</Label>
                            <Select value={formData.type} onValueChange={v => {
                                const defaults: Record<string, string> = { work: 'Tech Stack', education: 'Key Coursework', project: 'Tech Stack' };
                                const isDefault = Object.values(defaults).includes(formData.techLabel);
                                setFormData({
                                    ...formData, type: v as any,
                                    techLabel: isDefault ? defaults[v] : formData.techLabel,
                                    icon: v === 'education' && formData.icon === 'Briefcase' ? 'GraduationCap' :
                                        v === 'work' && formData.icon === 'GraduationCap' ? 'Briefcase' : formData.icon
                                });
                            }}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white h-10"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-[#0a0a16] border-white/10 text-white">
                                    <SelectItem value="work"><div className="flex items-center gap-2"><Briefcase size={14} /> Work Experience</div></SelectItem>
                                    <SelectItem value="education"><div className="flex items-center gap-2"><GraduationCap size={14} /> Education</div></SelectItem>
                                    <SelectItem value="project"><div className="flex items-center gap-2"><Code size={14} /> Project / Other</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Timeline Year</Label>
                            <Input value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="bg-white/5 border-white/10 text-white font-mono" placeholder="e.g. 2024" />
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider">{labels.title}</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-black/20 border-white/10 text-white text-base font-bold h-11" placeholder={`Enter ${labels.title}...`} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider">{labels.company}</Label>
                                <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="bg-black/20 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider">Location / Duration</Label>
                                <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="e.g. New York, NY" />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider">Period</Label>
                                <Input value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="e.g. 2021 – 2024" />
                            </div>
                        </div>
                    </div>

                    {/* Visual Style */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider font-bold">Visual Style</Label>
                            <span className="text-[10px] text-gray-500">{formData.color}</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-[130px]">
                                <IconPicker value={formData.icon} onChange={icon => setFormData({ ...formData, icon })} />
                            </div>
                            <div className="flex-1 flex flex-wrap gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                {PRESET_COLORS.map(c => (
                                    <button key={c.value} onClick={() => setFormData({ ...formData, color: c.value })}
                                        className={cn("w-6 h-6 rounded-full transition-all relative flex items-center justify-center", c.class,
                                            formData.color === c.value ? "scale-110 border-2 border-white" : "opacity-40 hover:opacity-100")} title={c.name}>
                                        {formData.color === c.value && <span className="text-black text-[10px] font-bold">✓</span>}
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <Input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-8 h-8 p-0 border-0 rounded-md overflow-hidden cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Rich Details */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider shrink-0">{labels.tech}</Label>
                                <div className="flex-1 flex items-center gap-1.5 ml-auto">
                                    <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono shrink-0">Section Label:</span>
                                    <Input
                                        value={formData.techLabel}
                                        onChange={e => setFormData({ ...formData, techLabel: e.target.value })}
                                        className="h-6 text-[11px] bg-white/5 border-white/10 text-white/70 px-2 py-0 min-w-0"
                                        placeholder={labels.techLabelDefault}
                                    />
                                </div>
                            </div>
                            <MultiSelect options={skills.map(s => ({ label: s.name, value: s.name, image: s.icon }))} selected={formData.technologies} onChange={(vals) => setFormData({ ...formData, technologies: vals })} placeholder={`Type or select ${labels.tech.toLowerCase()}...`} creatable={true} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider">Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-black/20 border-white/10 text-white min-h-[90px] text-sm leading-relaxed" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider">{labels.achievements}</Label>
                            <div className="flex gap-2">
                                <Input value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAchievement()} className="bg-black/20 border-white/10 text-white" placeholder="Add detail..." />
                                <NeonButton size="sm" onClick={addAchievement} icon={<Plus size={14} />}>Add</NeonButton>
                            </div>
                            <div className="space-y-1">
                                {formData.achievements.map((ach, i) => (
                                    <div key={i} className="group flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: formData.color }} />
                                        <span className="text-sm text-gray-400 flex-1">{ach}</span>
                                        <button onClick={() => removeAchievement(i)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a16] z-20 shrink-0">
                    <NeonButton onClick={handleSave} className="w-full text-base font-bold" variant="primary" icon={isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}>
                        {isSaving ? "SAVING..." : selectedId ? "UPDATE MILESTONE" : "CREATE MILESTONE"}
                    </NeonButton>
                    {selectedId && (
                        <button onClick={() => handleDelete(selectedId)} className="w-full mt-2 text-xs text-red-500 hover:text-red-400 uppercase tracking-widest hover:underline">
                            Delete Entry
                        </button>
                    )}
                </div>
            </GlassPanel>

            {/* ── Column 3: Live Preview ── */}
            <GlassPanel className="flex flex-col overflow-hidden h-full">
                {/* Preview Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5 backdrop-blur-sm shrink-0">
                    <Eye size={16} className="text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Live Preview</h3>
                    <span className="ml-auto text-[10px] text-white/30 uppercase tracking-wider font-mono">as seen on site</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
                    {/* Timeline Context Mockup */}
                    <div className="relative pl-8">
                        {/* Spine */}
                        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        {/* Node */}
                        <div className="absolute left-0 top-3">
                            <PreviewTimelineNode item={formData} />
                        </div>
                        {/* Year label */}
                        <div className="mb-3 ml-2">
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{formData.year || 'Year'}</span>
                        </div>
                        {/* Card */}
                        {formData.type === 'education' ? (
                            <PreviewEducationCard item={formData} />
                        ) : formData.type === 'project' ? (
                            <PreviewProjectCard item={formData} />
                        ) : (
                            <PreviewWorkCard item={formData} />
                        )}
                    </div>

                    {/* All entries mini list */}
                    {items.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-px flex-1 bg-white/5" />
                                <span className="text-[9px] uppercase tracking-widest text-white/20 font-mono">All Entries</span>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                            {items.map((item, i) => (
                                <button
                                    key={item._id}
                                    onClick={() => handleSelect(item)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all border text-left",
                                        selectedId === item._id
                                            ? "bg-white/10 border-white/15"
                                            : "bg-white/[0.03] border-transparent hover:bg-white/[0.06]"
                                    )}
                                    style={{ borderColor: selectedId === item._id ? `${item.color}50` : undefined }}
                                >
                                    <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{item.company} · {item.year}</p>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0",
                                        item.type === 'education' ? "bg-purple-500/15 text-purple-400" :
                                            item.type === 'work' ? "bg-cyan-500/15 text-cyan-400" : "bg-orange-500/15 text-orange-400"
                                    )}>{item.type}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
