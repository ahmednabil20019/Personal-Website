import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X, Folder, Edit2, Trash2 } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { IconPicker } from "../shared/IconPicker";
import { NeonButton } from "@/components/ui/neon-button";

interface Category {
    _id: string;
    name: string;
    type: string;
    description: string;
    color: string;
    icon: string;
}

interface CategoryManagerProps {
    categoryType?: "skill" | "project" | "service";
}

export const CategoryManager = ({ categoryType = "skill" }: CategoryManagerProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        type: categoryType,
        description: "",
        color: "#3b82f6",
        icon: "Folder"
    });

    useEffect(() => {
        if (isOpen) fetchCategories();
    }, [isOpen]);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/categories?type=${categoryType}`);
            const json = await res.json();
            if (json.success) setCategories(json.data);
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category._id);
        setFormData({
            name: category.name,
            type: category.type,
            description: category.description || "",
            color: category.color,
            icon: category.icon
        });
    };

    const handleSave = async () => {
        if (!formData.name) return toast.error("Name is required");

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/categories?id=${editingId}` : '/api/categories';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const json = await res.json();

            if (json.success) {
                toast.success(editingId ? "Category updated" : "Category saved");
                setFormData({ name: "", type: categoryType, description: "", color: "#3b82f6", icon: "Folder" });
                setEditingId(null);
                fetchCategories();
            } else {
                toast.error(json.error);
            }
        } catch (error) {
            toast.error("Error saving category");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.success) {
                toast.success("Category deleted");
                fetchCategories();
                if (editingId === id) {
                    setEditingId(null);
                    setFormData({ name: "", type: categoryType, description: "", color: "#3b82f6", icon: "Folder" });
                }
            } else {
                toast.error(json.error);
            }
        } catch (error) {
            toast.error("Error deleting category");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <NeonButton variant="secondary" icon={<Folder size={14} />} className="hidden md:flex">
                    Manage Categories
                </NeonButton>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/10 text-white p-0 overflow-hidden">
                <div className="flex h-[500px]">
                    {/* Left: List */}
                    <div className="w-1/3 border-r border-white/10 bg-white/[0.02] p-4 flex flex-col gap-4">
                        <DialogHeader>
                            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-gray-400">Categories</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                            {categories.map(cat => (
                                <div
                                    key={cat._id}
                                    onClick={() => handleEdit(cat)}
                                    className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-all text-sm border ${editingId === cat._id ? "bg-white/10 border-cyan-500/50" : "hover:bg-white/5 border-transparent hover:border-white/5"}`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                                        <span className="truncate">{cat.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(cat._id); }}
                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-gray-400 hover:text-white"
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ name: "", type: categoryType, description: "", color: "#3b82f6", icon: "Folder" });
                            }}
                        >
                            <Plus size={12} className="mr-2" /> New Category
                        </Button>
                    </div>

                    {/* Right: Form */}
                    <div className="w-2/3 p-6 space-y-6">
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg">{editingId ? "Edit Category" : "Add New Category"}</h3>
                            <p className="text-xs text-gray-400">{editingId ? "Update existing classification." : "Define a new classification for your skills."}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-gray-500">Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Frontend"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500">Color (Hex)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="w-10 h-10 p-1 bg-white/5 border-white/10"
                                        />
                                        <Input
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="bg-white/5 border-white/10 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500">Icon</Label>
                                    <IconPicker value={formData.icon} onChange={icon => setFormData({ ...formData, icon })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-gray-500">Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description..."
                                    className="bg-white/5 border-white/10"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                {editingId && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({ name: "", type: categoryType, description: "", color: "#3b82f6", icon: "Folder" });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <NeonButton onClick={handleSave} icon={editingId ? <Edit2 size={14} /> : <Plus size={14} />}>
                                    {editingId ? "Update Category" : "Create Category"}
                                </NeonButton>

                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
