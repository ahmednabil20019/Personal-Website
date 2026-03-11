import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Check, Zap, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "react-icons/si";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { cn } from "@/lib/utils";
import { IconPicker } from "../shared/IconPicker";
import { CategoryManager } from "./CategoryManager";
import { AdminLoader } from "../AdminLoader";
import { MultiSelect } from "../shared/MultiSelect";

interface SkillDB {
    _id: string;
    name: string;
    category: string;
    icon: string;
    level: string;
    projectIds?: Array<{ _id: string; title: string }>;
    certIds?: Array<{ _id: string; title: string }>;
}

interface ProjectSimple { _id: string; title: string; images?: string[]; image?: string; }
interface CertSimple { _id: string; title: string; image?: string; }

const CATEGORIES = ["Frontend", "Backend", "Data", "DevOps", "Mobile", "Tools"];

export const SkillsAdmin = () => {
    const [skills, setSkills] = useState<SkillDB[]>([]);
    const [projects, setProjects] = useState<ProjectSimple[]>([]);
    const [certs, setCerts] = useState<CertSimple[]>([]);

    // We can fetch dynamic categories too if we want, but for now we keep the hardcoded fallback or fetch them
    // Let's stick to fetching skills/projects/certs efficiently.
    // Ideally we should sync CATEGORIES from the CategoryManager's backend data if we want true dynamic categories.
    // For this step I will fetch categories too.
    const [dynamicCategories, setDynamicCategories] = useState<string[]>(CATEGORIES);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<SkillDB, "_id" | "projectIds" | "certIds"> & { projectIds: string[]; certIds: string[]; }>({
        name: "",
        category: "Frontend",
        icon: "Box",
        level: "Intermediate",
        projectIds: [],
        certIds: []
    });

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories?type=skill');
            const json = await res.json();
            if (json.success && json.data.length > 0) {
                setDynamicCategories(json.data.map((c: any) => c.name));
            }
        } catch (e) {
            // silent fail, use defaults
        }
    };

    const fetchData = async () => {
        try {
            const [skillsRes, projectsRes, certsRes] = await Promise.all([
                fetch('/api/skills'),
                fetch('/api/projects'),
                fetch('/api/certifications')
            ]);

            const [skillsJson, projectsJson, certsJson] = await Promise.all([
                skillsRes.json(),
                projectsRes.json(),
                certsRes.json()
            ]);

            if (skillsJson.success) setSkills(skillsJson.data);
            if (projectsJson.success) setProjects(projectsJson.data);
            if (certsJson.success) setCerts(certsJson.data);
        } catch (err) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name) return toast.error("Name is required");
        setIsSaving(true);
        const toastId = toast.loading("Saving configuration...");

        try {
            const method = selectedId ? 'PUT' : 'POST';
            const url = selectedId ? `/api/skills/${selectedId}` : '/api/skills';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const json = await res.json();

            if (json.success) {
                toast.success(`Skill ${selectedId ? 'updated' : 'created'} successfully`, { id: toastId });
                fetchData(); // Refetch
                if (!selectedId) {
                    setFormData({ name: "", category: "Frontend", icon: "Box", level: "Intermediate", projectIds: [], certIds: [] });
                }
            } else {
                toast.error(json.error, { id: toastId });
            }
        } catch (err) {
            toast.error("Network error while saving", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const [isMatching, setIsMatching] = useState(false);

    const handleAutoMatch = async () => {
        if (!confirm("Attempt to auto-assign brand icons based on skill names? This will overwrite current icons for matches found.")) return;
        setIsMatching(true);
        const toastId = toast.loading("Analyzing and matching icons...");
        let matchCount = 0;

        try {
            const updates = skills.map(async (skill) => {
                // Normalize name: remove spaces, dots, special chars, lowercase
                const cleanName = skill.name.toLowerCase().replace(/[^a-z0-9]/g, "");
                // Special cases could be handled here or just rely on fuzzy
                // Try to find a key in SimpleIcons that matches 'si' + cleanName
                const normalizeKey = (k: string) => k.toLowerCase();

                const targetKey = `si${cleanName}`;
                const iconKey = Object.keys(SimpleIcons).find(k => normalizeKey(k) === targetKey);

                if (iconKey && skill.icon !== iconKey) {
                    // Update this skill
                    matchCount++;
                    await fetch(`/api/skills?id=${skill._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...skill, icon: iconKey })
                    });
                }
            });

            await Promise.all(updates);

            if (matchCount > 0) {
                toast.success(`Successfully matched and updated ${matchCount} icons!`, { id: toastId });
                fetchData();
            } else {
                toast.info("No new matching icons found.", { id: toastId });
            }

        } catch (e) {
            toast.error("Error during auto-match", { id: toastId });
        } finally {
            setIsMatching(false);
        }
    };

    const handleSuggestIcon = () => {
        if (!formData.name) return toast.error("Enter a skill name first");

        const cleanName = formData.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const targetKey = `si${cleanName}`;
        const normalizeKey = (k: string) => k.toLowerCase();

        const iconKey = Object.keys(SimpleIcons).find(k => normalizeKey(k) === targetKey);

        if (iconKey) {
            setFormData({ ...formData, icon: iconKey });
            toast.success(`Found icon: ${iconKey}`);
        } else {
            toast.info("No matching brand icon found.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        const toastId = toast.loading("Deleting...");
        try {
            await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
            toast.success("Skill deleted", { id: toastId });
            fetchData();
            if (selectedId === id) {
                setSelectedId(null);
                setFormData({ name: "", category: "Frontend", icon: "Box", level: "Intermediate", projectIds: [], certIds: [] });
            }
        } catch (err) {
            toast.error("Error deleting skill", { id: toastId });
        }
    };

    const handleSelect = (skill: SkillDB) => {
        setSelectedId(skill._id);
        setFormData({
            name: skill.name,
            category: skill.category,
            icon: skill.icon,
            level: skill.level,
            projectIds: skill.projectIds?.map(p => p._id) || [],
            certIds: skill.certIds?.map(c => c._id) || []
        });
    };

    const handleNew = () => {
        setSelectedId(null);
        setFormData({ name: "", category: "Frontend", icon: "Box", level: "Intermediate", projectIds: [], certIds: [] });
    };

    const renderSkillIcon = (iconName: string, className = "w-4 h-4") => {
        const isUrl = iconName.startsWith("http") || iconName.startsWith("/");
        if (isUrl) {
            return <img src={iconName} alt="icon" className={cn("object-contain rounded-sm overflow-hidden", className)} />;
        }
        const isSimpleIcon = iconName.startsWith("Si");
        let IconInfo: any;
        if (isSimpleIcon) {
            IconInfo = (SimpleIcons as any)[iconName] || SimpleIcons.SiReact;
        } else {
            const source = (LucideIcons as any).icons || LucideIcons;
            IconInfo = (iconName !== "Icon" && source[iconName]) || source.Box;
        }
        return IconInfo ? <IconInfo className={className} /> : <div className={cn("bg-white/10 rounded-full", className)} />;
    };

    return isLoading ? <AdminLoader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            {/* List Column */}
            <GlassPanel className="flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                    <h3 className="font-bold text-white">All Skills ({skills.length})</h3>
                    <div className="flex gap-2">
                        <CategoryManager />
                        <NeonButton size="sm" onClick={handleNew} variant="secondary" icon={<Plus size={14} />}>
                            New
                        </NeonButton>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {skills.map(skill => (
                        <div
                            key={skill._id}
                            onClick={() => handleSelect(skill)}
                            className="relative group"
                        >
                            {selectedId === skill._id && (
                                <motion.div
                                    layoutId="active-skill-highlight"
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-500 rounded-lg"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className={cn(
                                "relative p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all z-10",
                                selectedId === skill._id ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center text-cyan-400">
                                        {renderSkillIcon(skill.icon, "w-5 h-5")}
                                    </div>
                                    <span className="font-medium">{skill.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] opacity-50">{skill.category}</span>
                                    {selectedId === skill._id && <ChevronRight size={14} className="text-cyan-400 animate-pulse" />}
                                </div>
                            </div>

                            {/* Visual Connection Line Start */}
                            {selectedId === skill._id && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-gradient-to-r from-cyan-500 to-transparent translate-x-4 z-50 pointer-events-none md:block hidden" />
                            )}
                        </div>
                    ))}
                </div>
            </GlassPanel>

            {/* Editor Column */}
            <GlassPanel className={cn(
                "p-6 space-y-6 h-fit overflow-y-auto max-h-full custom-scrollbar transition-all duration-500 border",
                selectedId ? "border-white/10" : "border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
            )}>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        {selectedId ? (
                            <div className="w-2 h-8 rounded-full bg-cyan-500" />
                        ) : (
                            <div className="w-2 h-8 rounded-full bg-green-500 animate-pulse" />
                        )}
                        <div>
                            <h3 className={cn("font-bold text-lg", selectedId ? "text-white" : "text-green-400")}>
                                {selectedId ? "Edit Skill Configuration" : "Initialize New Skill Module"}
                            </h3>
                            <p className="text-[10px] text-gray-500 font-mono">
                                {selectedId ? `ID: ${selectedId}` : "SYSTEM: WAITING FOR INPUT..."}
                            </p>
                        </div>
                    </div>

                    {selectedId && (
                        <NeonButton onClick={() => handleDelete(selectedId)} variant="danger" size="icon" className="w-8 h-8">
                            <Trash2 size={14} />
                        </NeonButton>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Header: Icon + Name */}
                    <div className="flex items-start gap-4">
                        {/* Interactive Icon Picker with Auto-Detect */}
                        <div className="relative group/icon pt-1">
                            <IconPicker
                                value={formData.icon}
                                onChange={icon => setFormData({ ...formData, icon })}
                            >
                                <button className={cn(
                                    "w-14 h-14 rounded-xl bg-black/40 border-2 border-dashed transition-all flex items-center justify-center relative overfllow-hidden group-hover/icon:shadow-lg",
                                    selectedId ? "border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 group-hover/icon:shadow-cyan-500/10"
                                        : "border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 group-hover/icon:shadow-green-500/10"
                                )}>
                                    {renderSkillIcon(formData.icon, cn(
                                        "w-8 h-8 transition-transform group-hover/icon:scale-110",
                                        selectedId ? "text-cyan-400" : "text-green-400"
                                    ))}
                                </button>
                            </IconPicker>

                            {/* Auto Detect Mini Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSuggestIcon();
                                }}
                                className={cn(
                                    "absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#0c0c0c] border transition-all shadow-lg z-20",
                                    selectedId ? "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                                        : "border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black"
                                )}
                                title="Auto-Detect Icon"
                            >
                                <Zap size={10} fill="currentColor" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="space-y-1.5">
                                <Label className={cn("text-xs uppercase tracking-wider font-semibold", selectedId ? "text-cyan-400" : "text-green-400")}>
                                    Skill Name
                                </Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-black/40 border-white/10 text-white focus:border-cyan-500/50 h-10 text-lg font-medium"
                                    placeholder="e.g. React"
                                    autoFocus // Focus automatically on new
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={v => setFormData({ ...formData, category: v })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10 text-white focus:border-cyan-500/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a0a16] border-white/10 text-white">
                                    {dynamicCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider">Proficiency</Label>
                            <Select
                                value={formData.level}
                                onValueChange={v => setFormData({ ...formData, level: v })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10 text-white focus:border-cyan-500/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a0a16] border-white/10 text-white">
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Validated Projects (Dependency Injection) */}
                    <div className="space-y-2">
                        <Label className="text-cyan-400 text-xs uppercase tracking-wider flex items-center justify-between">
                            <span>Linked Projects</span>
                        </Label>
                        <MultiSelect
                            options={projects.map(p => ({ label: p.title, value: p._id, image: p.images?.[0] || p.image }))}
                            selected={formData.projectIds}
                            onChange={(vals) => setFormData({ ...formData, projectIds: vals })}
                            placeholder="Select deployed projects..."
                            color="cyan"
                        />
                    </div>

                    {/* Certificates (Security Clearance) */}
                    <div className="space-y-2">
                        <Label className="text-purple-400 text-xs uppercase tracking-wider flex items-center justify-between">
                            <span>Certifications</span>
                        </Label>
                        <MultiSelect
                            options={certs.map(c => ({ label: c.title, value: c._id, image: c.image }))}
                            selected={formData.certIds}
                            onChange={(vals) => setFormData({ ...formData, certIds: vals })}
                            placeholder="Select certifications..."
                            color="purple"
                        />
                    </div>

                    <div className="pt-4">
                        <NeonButton
                            onClick={handleSave}
                            isLoading={isSaving}
                            className="w-full h-12 text-sm font-bold tracking-wider"
                            icon={<Save size={16} />}
                        >
                            COMMIT CONFIGURATION
                        </NeonButton>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};

