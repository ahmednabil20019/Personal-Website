import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, User, Plus, Trash2, Loader2, RefreshCw, Sparkles, Target, Tag, Heart } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { motion } from "framer-motion";
import { IconPicker } from "@/components/admin/shared/IconPicker";
import { AdminLoader } from "../AdminLoader";

interface Stat {
    label: string;
    value: string;
}

interface Passion {
    icon: string;
    label: string;
}

interface AboutDB {
    name: string;
    title: string;
    location: string;
    content: string;
    avatar: string;
    mission: string;
    stats: Stat[];
    passions: Passion[];
    tags: string[];
    ctaTitle: string;
    ctaSubtitle: string;
}

const defaultAbout: AboutDB = {
    name: "Your Name",
    title: "Full-Stack Developer",
    location: "Your Location",
    content: "",
    avatar: "",
    mission: "Building scalable products that blend technical excellence with intuitive design.",
    stats: [],
    passions: [],
    tags: [],
    ctaTitle: "Let's Build Something Amazing",
    ctaSubtitle: "Open to collaborations and new opportunities."
};

export const AboutAdmin = () => {
    const [data, setData] = useState<AboutDB>(defaultAbout);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'extras'>('basic');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/about');
            const json = await res.json();
            if (json.success && json.data) {
                setData({
                    name: json.data.name || defaultAbout.name,
                    title: json.data.title || defaultAbout.title,
                    location: json.data.location || defaultAbout.location,
                    content: json.data.content || "",
                    avatar: json.data.avatar || "",
                    mission: json.data.mission || defaultAbout.mission,
                    stats: json.data.stats || [],
                    passions: json.data.passions || [],
                    tags: json.data.tags || [],
                    ctaTitle: json.data.ctaTitle || defaultAbout.ctaTitle,
                    ctaSubtitle: json.data.ctaSubtitle || defaultAbout.ctaSubtitle,
                });
            }
        } catch (err) {
            toast.error("Failed to fetch about data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (files: File[]) => {
        if (files.length === 0) return;
        setIsUploading(true);
        const toastId = toast.loading("Uploading avatar...");

        const formData = new FormData();
        formData.append('files', files[0]);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            const json = await res.json();
            if (json.success && json.data?.length > 0) {
                setData(prev => ({ ...prev, avatar: json.data[0].url }));
                toast.success("Avatar uploaded!", { id: toastId });
            } else {
                toast.error(json.error || "Upload failed", { id: toastId });
            }
        } catch (err) {
            toast.error("Failed to upload image", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/about', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Profile saved successfully!");
            } else {
                toast.error(json.error || "Failed to save");
            }
        } catch (err) {
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    // Stats handlers
    const addStat = () => setData({ ...data, stats: [...data.stats, { label: "Label", value: "0" }] });
    const removeStat = (i: number) => setData({ ...data, stats: data.stats.filter((_, idx) => idx !== i) });
    const updateStat = (i: number, field: keyof Stat, value: string) => {
        const newStats = [...data.stats];
        newStats[i][field] = value;
        setData({ ...data, stats: newStats });
    };

    // Passions handlers
    const addPassion = () => setData({ ...data, passions: [...data.passions, { icon: "Heart", label: "New Passion" }] });
    const removePassion = (i: number) => setData({ ...data, passions: data.passions.filter((_, idx) => idx !== i) });
    const updatePassion = (i: number, field: keyof Passion, value: string) => {
        const newPassions = [...data.passions];
        newPassions[i][field] = value;
        setData({ ...data, passions: newPassions });
    };

    // Tags handlers
    const addTag = () => {
        if (newTag.trim() && !data.tags.includes(newTag.trim())) {
            setData({ ...data, tags: [...data.tags, newTag.trim()] });
            setNewTag("");
        }
    };
    const removeTag = (tag: string) => setData({ ...data, tags: data.tags.filter(t => t !== tag) });

    if (isLoading) {
        return <AdminLoader />;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
                <div>
                    <h2 className="text-2xl font-bold text-white">About Me Editor</h2>
                    <p className="text-gray-400 text-sm">Customize every detail of your About section</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchData} variant="outline" size="icon" className="border-white/10">
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-purple-600 to-cyan-600 min-w-[130px]">
                        {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save All</>}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
                {(['basic', 'content', 'extras'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* BASIC TAB */}
            {activeTab === 'basic' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Form */}
                    <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider">Your Name</Label>
                                <Input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="bg-black/50 border-white/10 mt-1" placeholder="John Doe" />
                            </div>
                            <div>
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider">Title / Role</Label>
                                <Input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className="bg-black/50 border-white/10 mt-1" placeholder="Full-Stack Developer" />
                            </div>
                            <div>
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider">Location</Label>
                                <Input value={data.location} onChange={e => setData({ ...data, location: e.target.value })} className="bg-black/50 border-white/10 mt-1" placeholder="New York, USA" />
                            </div>
                        </div>

                        {/* Avatar */}
                        <div>
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider mb-2 block">Profile Photo</Label>
                            <div className="relative">
                                <ImageUpload onFilesChange={handleUpload} multiple={false} />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <Input value={data.avatar} onChange={e => setData({ ...data, avatar: e.target.value })} className="bg-black/50 border-white/10 mt-3 font-mono text-xs" placeholder="Or paste image URL..." />
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="bg-black rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="relative w-40 h-40 mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-40" />
                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 bg-gray-900">
                                {data.avatar ? <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-full h-full p-8 text-gray-600" />}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{data.name || "Your Name"}</h3>
                        <p className="text-purple-400">{data.title || "Your Title"}</p>
                        <p className="text-gray-500 text-sm mt-1">📍 {data.location || "Location"}</p>
                    </div>
                </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div>
                            <Label className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-wider mb-2">
                                <Sparkles size={14} /> Bio / Story
                            </Label>
                            <Textarea value={data.content} onChange={e => setData({ ...data, content: e.target.value })} className="bg-black/50 border-white/10 min-h-[200px]" placeholder="Tell your story..." />
                        </div>
                        <div>
                            <Label className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-wider mb-2">
                                <Target size={14} /> Mission Statement
                            </Label>
                            <Textarea value={data.mission} onChange={e => setData({ ...data, mission: e.target.value })} className="bg-black/50 border-white/10 min-h-[100px]" placeholder="What drives you..." />
                        </div>
                        <div>
                            <Label className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-wider mb-2">
                                <Tag size={14} /> Skills/Tags
                            </Label>
                            <div className="flex gap-2 mb-3">
                                <Input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} className="bg-black/50 border-white/10" placeholder="Add a tag..." />
                                <Button onClick={addTag} size="icon" className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"><Plus size={18} /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-300 flex items-center gap-2">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div>
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider mb-2 block">CTA Title</Label>
                            <Input value={data.ctaTitle} onChange={e => setData({ ...data, ctaTitle: e.target.value })} className="bg-black/50 border-white/10" />
                        </div>
                        <div>
                            <Label className="text-cyan-400 text-xs uppercase tracking-wider mb-2 block">CTA Subtitle</Label>
                            <Input value={data.ctaSubtitle} onChange={e => setData({ ...data, ctaSubtitle: e.target.value })} className="bg-black/50 border-white/10" />
                        </div>
                        {/* Preview */}
                        <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 mt-6">
                            <h4 className="text-xl font-bold text-white">{data.ctaTitle}</h4>
                            <p className="text-gray-400 text-sm mt-1">{data.ctaSubtitle}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* EXTRAS TAB */}
            {activeTab === 'extras' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Stats Section */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <Label className="text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                    <Target size={14} /> Statistics
                                </Label>
                                <p className="text-gray-500 text-xs mt-1">Key metrics shown on your profile</p>
                            </div>
                            <Button size="sm" onClick={addStat} className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/50">
                                <Plus size={16} className="mr-2" /> Add Stat
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.stats.length === 0 ? (
                                <div className="col-span-full py-8 text-center border-2 border-dashed border-white/10 rounded-xl">
                                    <p className="text-gray-500 text-sm">No statistics added yet.</p>
                                </div>
                            ) : data.stats.map((stat, i) => (
                                <div key={i} className="bg-black/40 p-4 rounded-xl border border-white/5 relative group hover:border-cyan-500/30 transition-colors">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeStat(i)}
                                        className="absolute top-2 right-2 text-white/20 hover:text-red-400 hover:bg-red-500/20 w-6 h-6 z-10"
                                    >
                                        <Trash2 size={12} />
                                    </Button>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-[10px] text-gray-500 uppercase">Value</Label>
                                            <Input
                                                value={stat.value}
                                                onChange={e => updateStat(i, 'value', e.target.value)}
                                                className="bg-black/50 border-white/10 font-bold text-lg text-white"
                                                placeholder="5+"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] text-gray-500 uppercase">Label</Label>
                                            <Input
                                                value={stat.label}
                                                onChange={e => updateStat(i, 'label', e.target.value)}
                                                className="bg-black/50 border-white/10 text-sm"
                                                placeholder="Years Exp."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Passions Section */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <Label className="text-purple-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                    <Heart size={14} /> Passions
                                </Label>
                                <p className="text-gray-500 text-xs mt-1">Technologies & topics you love</p>
                            </div>
                            <Button size="sm" onClick={addPassion} className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/50">
                                <Plus size={16} className="mr-2" /> Add Passion
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {data.passions.length === 0 ? (
                                <div className="py-8 text-center border-2 border-dashed border-white/10 rounded-xl">
                                    <p className="text-gray-500 text-sm">No passions added yet.</p>
                                </div>
                            ) : data.passions.map((passion, i) => (
                                <div key={i} className="flex gap-4 items-center bg-black/40 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                    <div className="shrink-0">
                                        <IconPicker value={passion.icon} onChange={(icon) => updatePassion(i, 'icon', icon)} />
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-[10px] text-gray-500 uppercase mb-1 block">Label</Label>
                                        <Input
                                            value={passion.label}
                                            onChange={e => updatePassion(i, 'label', e.target.value)}
                                            className="bg-black/50 border-white/10"
                                            placeholder="e.g. Clean Code"
                                        />
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => removePassion(i)} className="text-white/20 hover:text-red-400 hover:bg-red-500/20 shrink-0">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
