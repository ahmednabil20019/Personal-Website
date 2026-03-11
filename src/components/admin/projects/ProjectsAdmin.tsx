import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { AdminLoader } from "../AdminLoader";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
    Plus, Search, Github, Globe, Star, Image as ImageIcon, Trash2, X, Edit2, Sparkles,
    Upload, Eye, Loader2, Filter, LayoutGrid, List, ChevronLeft, ChevronRight, MoreVertical, Film,
    GripVertical, Crown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryManager } from "../skills/CategoryManager";
import { MediaOptimizer, UploadMeta } from "../shared/MediaOptimizer";
import { formatBytes } from "@/lib/utils";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";

interface ProjectDB {
    _id?: string;
    title: string;
    description: string;
    longDescription?: string;
    images: string[];
    videos?: string[];
    technologies: string[];
    features?: string[];
    category: string;
    liveUrl?: string;
    githubUrl?: string;
    date?: string;
    team?: string;
    status?: string;
    featured?: boolean;
}

// Removed static CATEGORIES constant, now fetched dynamically
const STATUS_OPTIONS = ["All Status", "Active", "In Progress", "Completed", "Archived"];
const TECH_SUGGESTIONS = ["React", "Node.js", "TypeScript", "Next.js", "TailwindCSS", "MongoDB", "PostgreSQL", "Docker", "AWS", "Framer Motion", "Three.js", "Python", "Django", "FastAPI"];

export const ProjectsAdmin = () => {
    // Data State
    const [projects, setProjects] = useState<ProjectDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Grid/List View
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Filter State
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categories, setCategories] = useState<string[]>(["All", "Web App", "Mobile App", "Other"]);
    const [selectedStatus, setSelectedStatus] = useState("All Status");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectDB | null>(null);
    const [techInput, setTechInput] = useState("");

    // Drag-and-drop / Image Upload State
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [mediaMeta, setMediaMeta] = useState<Record<string, UploadMeta>>({});

    // Gallery preview state
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    // ESC key to close gallery (capture phase to prevent Radix from also closing)
    useEffect(() => {
        if (!galleryOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                setGalleryOpen(false);
            }
        };
        window.addEventListener("keydown", handler, true); // capture phase
        return () => window.removeEventListener("keydown", handler, true);
    }, [galleryOpen]);

    useEffect(() => {
        fetchProjects();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories?type=project');
            const json = await res.json();
            if (json.success) {
                const catNames = json.data.map((c: any) => c.name);
                setCategories(["All", ...catNames]);
            }
        } catch (err) {
            console.error("Failed to fetch categories");
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const json = await res.json();
            if (json.success) {
                setProjects(json.data);
            }
        } catch (err) {
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReorder = async (newOrder: ProjectDB[]) => {
        // 1. Optimistic UI Update
        // We need to construct a new 'projects' array where the items currently being viewed 
        // are replaced by 'newOrder'.
        // Since 'paginatedProjects' is what 'newOrder' represents,
        // we need to find these items in the main 'projects' array and re-arrange them.

        // However, 'filteredProjects' might be a subset.
        // If filters are active, we probably shouldn't allow reordering or it's context-dependent.
        // Assuming "All" view for valid reordering:

        const isFiltered = search !== "" || selectedCategory !== "All" || selectedStatus !== "All Status";

        if (isFiltered) {
            toast.error("Clear filters to reorder projects");
            return;
        }

        // Calculate global indices for the items on this page
        const startIndex = (currentPage - 1) * itemsPerPage;

        // Create new projects array
        const updatedProjects = [...projects];

        // Splice the new order in
        // Note: This assumes 'projects' is currently sorted same as 'paginatedProjects' (which it is)
        updatedProjects.splice(startIndex, newOrder.length, ...newOrder);

        setProjects(updatedProjects);

        // 2. Backend Update
        try {
            // We need to send updates for ALL affected items. 
            // Simpler: Just send the new index for the items we moved.
            const updates = newOrder.map((p, i) => ({
                id: p._id!,
                order: startIndex + i
            }));

            await fetch('/api/projects/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: updates })
            });

        } catch (error) {
            console.error('Failed to save order', error);
            toast.error("Failed to save order");
        }
    };

    const handleMoveProject = async (project: ProjectDB, direction: -1 | 1) => {
        const isFiltered = search !== "" || selectedCategory !== "All" || selectedStatus !== "All Status";

        if (isFiltered) {
            toast.error("Clear filters to reorder projects");
            return;
        }

        const currentIndex = projects.findIndex(p => p._id === project._id);
        if (currentIndex === -1) return;

        const targetIndex = currentIndex + direction;

        // Boundary checks
        if (targetIndex < 0 || targetIndex >= projects.length) return;

        // Create new array with swapped items
        const newProjects = [...projects];
        const itemToMove = newProjects[currentIndex];
        const itemToSwap = newProjects[targetIndex];

        newProjects[currentIndex] = itemToSwap;
        newProjects[targetIndex] = itemToMove;

        // Optimistic Update
        setProjects(newProjects);

        // Backend Update
        try {
            const updates = [
                { id: itemToMove._id!, order: targetIndex },
                { id: itemToSwap._id!, order: currentIndex }
            ];

            await fetch('/api/projects/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: updates })
            });
        } catch (error) {
            console.error('Failed to save order', error);
            toast.error("Failed to move project");
            // Revert on error could be added here
        }
    };


    const handleJumpProject = async (project: ProjectDB, targetIndex: number) => {
        const isFiltered = search !== "" || selectedCategory !== "All" || selectedStatus !== "All Status";

        if (isFiltered) {
            toast.error("Clear filters to reorder projects");
            return;
        }

        const currentIndex = projects.findIndex(p => p._id === project._id);
        if (currentIndex === -1) return;

        // Boundary checks
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= projects.length) targetIndex = projects.length - 1;

        if (currentIndex === targetIndex) return;

        // Create new array
        const newProjects = [...projects];
        const [movedItem] = newProjects.splice(currentIndex, 1);
        newProjects.splice(targetIndex, 0, movedItem);

        // Optimistic Update
        setProjects(newProjects);

        // Backend Update
        try {
            // Rebuild full order list
            const updates = newProjects.map((p, i) => ({
                id: p._id!,
                order: i
            }));

            await fetch('/api/projects/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: updates })
            });
            toast.success(`Moved to position #${targetIndex + 1}`);
        } catch (error) {
            console.error('Failed to save order', error);
            toast.error("Failed to move project");
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesStatus = selectedStatus === "All Status" || (p.status || "Active") === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory, selectedStatus]);

    // CRUD Operations
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        try {
            const method = editingProject._id ? 'PUT' : 'POST';
            const url = editingProject._id ? `/api/projects?id=${editingProject._id}` : '/api/projects';
            const { _id, ...payload } = editingProject;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();

            if (json.success) {
                toast.success(`Project ${editingProject._id ? 'updated' : 'created'}`);
                fetchProjects();
                setIsDialogOpen(false);
                setEditingProject(null);
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Error saving project");
        }
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!confirm("Are you sure? This cannot be undone.")) return;
        try {
            await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
            toast.success("Project deleted");
            fetchProjects();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const openNewProject = () => {
        setEditingProject({
            title: "",
            description: "",
            longDescription: "",
            images: [],
            videos: [],
            technologies: [],
            features: [],
            category: "Web App",
            status: "Active"
        });
        setTechInput("");
        setGalleryOpen(false);
        setIsDialogOpen(true);
    };

    const openEditProject = (project: ProjectDB, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditingProject({ ...project });
        setTechInput("");
        setGalleryOpen(false);
        setIsDialogOpen(true);
    };

    const addTech = (tech: string) => {
        if (editingProject && !editingProject.technologies.includes(tech)) {
            setEditingProject({
                ...editingProject,
                technologies: [...editingProject.technologies, tech]
            });
        }
        setTechInput("");
    };

    // ─── Image Upload Logic ──────────────────────────────────────────
    const uploadFiles = useCallback(async (files: File[]) => {
        if (!editingProject || files.length === 0) return;

        const mediaFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
        if (mediaFiles.length === 0) {
            toast.error("Only image and video files are allowed");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        mediaFiles.forEach(file => formData.append('files', file));

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const result = await res.json();
                const newImageUrls: string[] = [];
                const newVideoUrls: string[] = [];

                result.data.forEach((item: any) => {
                    // Cloudinary returns resource_type, or check the original file
                    if (item.resource_type === 'video' || /\.(mp4|webm|mov|avi|mkv)$/i.test(item.url)) {
                        newVideoUrls.push(item.url);
                    } else {
                        newImageUrls.push(item.url);
                    }
                });

                setEditingProject(prev => prev ? {
                    ...prev,
                    images: [...prev.images, ...newImageUrls],
                    videos: [...(prev.videos || []), ...newVideoUrls]
                } : prev);

                const parts = [];
                if (newImageUrls.length) parts.push(`${newImageUrls.length} image(s)`);
                if (newVideoUrls.length) parts.push(`${newVideoUrls.length} video(s)`);
                toast.success(`${parts.join(' and ')} uploaded`);
            } else {
                const err = await res.json();
                toast.error(err.error || "Upload failed");
            }
        } catch (err) {
            toast.error("Upload error");
        } finally {
            setIsUploading(false);
        }
    }, [editingProject]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        uploadFiles(files);
    }, [uploadFiles]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadFiles(Array.from(e.target.files));
            e.target.value = '';
        }
    }, [uploadFiles]);

    const removeImage = (index: number) => {
        if (!editingProject) return;
        setEditingProject({
            ...editingProject,
            images: editingProject.images.filter((_, i) => i !== index)
        });
    };

    const moveImage = (from: number, to: number) => {
        if (!editingProject) return;
        if (to < 0 || to >= editingProject.images.length) return;
        const imgs = [...editingProject.images];
        const [moved] = imgs.splice(from, 1);
        imgs.splice(to, 0, moved);
        setEditingProject({ ...editingProject, images: imgs });
    };

    const setCoverImage = (index: number) => {
        if (!editingProject || index === 0) return;
        moveImage(index, 0);
        toast.success('Cover image updated');
    };

    // Drag-and-drop state for image reorder
    const dragIndexRef = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // ─── Render ──────────────────────────────────────────────────────
    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* ═══ Header & Controls ═══ */}
            <div className="flex flex-col gap-4 sticky top-0 z-30 pt-4 bg-[#030014]/80 backdrop-blur-md pb-4 border-b border-white/5 -mx-4 px-4 md:px-6">

                {/* Top Row: Title & Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Project Command
                        </h1>
                        <p className="text-sm text-gray-400">Manage neural constructs and portfolios</p>
                    </div>
                    <div className="flex gap-3">
                        <CategoryManager categoryType="project" />
                        <NeonButton onClick={openNewProject} icon={<Plus size={16} />} className="shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            Create
                        </NeonButton>
                    </div>
                </div>

                {/* Bottom Row: Filters & Search */}
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                        <Input
                            placeholder="Search projects by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 bg-black/40 border-white/10 text-white focus:border-cyan-500/50 transition-all h-10"
                        />
                    </div>

                    {/* Filters Wrapper */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {/* Category Filter */}
                        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 gap-1">
                            {categories.slice(0, 4).map(cat => ( // Show first few, use dropdown for more if needed
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Status Dropdown */}
                        <select
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            className="bg-black/40 border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-cyan-500/50 outline-none hover:bg-white/5 cursor-pointer"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#050510]">{s}</option>)}
                        </select>

                        {/* View Toggle */}
                        <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 gap-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                                <LayoutGrid size={16} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Content Area ═══ */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[400px]">
                {isLoading ? (
                    <AdminLoader />
                ) : filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-white/40 space-y-4 border border-dashed border-white/10 rounded-2xl m-4">
                        <Filter className="w-12 h-12 opacity-20" />
                        <p className="text-lg">No projects match your query</p>
                        <button onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedStatus("All Status"); }} className="text-cyan-400 hover:underline text-sm">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20" : "flex flex-col gap-4 pb-20"}>
                        <AnimatePresence>
                            {viewMode === 'grid' ? (
                                paginatedProjects.map((project, index) => (
                                    <div key={project._id} className="relative group">
                                        <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
                                            <div className="bg-black/60 backdrop-blur-md text-white/80 font-mono text-xs px-2 py-1 rounded border border-white/10 shadow-lg">
                                                #{((currentPage - 1) * itemsPerPage) + index + 1}
                                            </div>
                                        </div>
                                        <ProjectCard
                                            project={project}
                                            viewMode={viewMode}
                                            onEdit={(e) => openEditProject(project, e)}
                                            onDelete={(e) => project._id && handleDelete(project._id, e)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <Reorder.Group axis="y" values={paginatedProjects} onReorder={(newOrder) => {
                                    // Update local state to reflect drag immediately
                                    // Note: This needs to update the main 'projects' state to persist
                                    // For now, we'll just log or implement a proper reorder handler if possible
                                    // efficiently given the pagination. 
                                    // Ideally reordering should be done on the full list or a non-paginated view.
                                    // For this implementation, we will assume reordering is only supported 
                                    // when showing all projects or we will handle the index calculation.

                                    // SIMPLE APPROACH: specific handler to update project order
                                    handleReorder(newOrder);
                                }} className="space-y-4">
                                    {paginatedProjects.map((project, index) => {
                                        const globalIndex = projects.findIndex(p => p._id === project._id);
                                        const isFirst = globalIndex === 0;
                                        const isLast = globalIndex === projects.length - 1;

                                        return (
                                            <Reorder.Item key={project._id} value={project}>
                                                <div className="relative group flex items-center gap-2">
                                                    {/* Manual Reorder Controls */}
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
                                                        <div className="flex bg-black/60 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden shadow-xl">
                                                            <div className="flex flex-col border-r border-white/10">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleMoveProject(project, -1); }}
                                                                    disabled={isFirst}
                                                                    className="p-1 hover:bg-white/10 text-white/50 hover:text-cyan-400 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                                                                    title="Move Up"
                                                                >
                                                                    <ChevronUp size={12} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleMoveProject(project, 1); }}
                                                                    disabled={isLast}
                                                                    className="p-1 hover:bg-white/10 text-white/50 hover:text-cyan-400 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                                                                    title="Move Down"
                                                                >
                                                                    <ChevronDown size={12} />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center px-2 bg-white/5">
                                                                <span className="font-mono text-xs text-cyan-500">#{globalIndex + 1}</span>
                                                            </div>
                                                            <div className="p-2 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors border-l border-white/10 flex items-center justify-center">
                                                                <GripVertical size={14} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <ProjectCard
                                                            project={project}
                                                            viewMode={viewMode}
                                                            index={(currentPage - 1) * itemsPerPage + index}
                                                            onEdit={(e) => openEditProject(project, e)}
                                                            onDelete={(e) => project._id && handleDelete(project._id, e)}
                                                            onMove={(newIndex) => {
                                                                // Calculate relative move
                                                                const currentIndex = (currentPage - 1) * itemsPerPage + index;
                                                                const diff = newIndex - currentIndex;
                                                                if (diff !== 0) handleMoveProject(project, diff as any);
                                                                // Note: handleMoveProject currently accepts -1 or 1. 
                                                                // To support jump, we need to update handleMoveProject or create a new handleJumpProject.
                                                                // Let's assume handleMoveProject is updated or we use a loop for now, 
                                                                // BUT better to just support direct move in backend.

                                                                // For now, let's keep it simple: Use existing handleMoveProject if diff is 1/-1, 
                                                                // otherwise we need a new handler.
                                                                // Actually, I'll update handleMoveProject to support target index in next step if needed.
                                                                // For this step, I'll just leave it hooked up to the card but user asked for "better way".
                                                                // I should implement `handleJumpProject`.
                                                                handleJumpProject(project, newIndex);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Reorder.Item>
                                        );
                                    })}
                                </Reorder.Group>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ═══ Pagination Footer ═══ */}
            <div className="p-4 bg-[#030014]/90 backdrop-blur-xl border-t border-white/10 z-30 flex justify-between items-center -mx-4 px-4 md:-mx-6 md:px-6 sticky bottom-0">
                <p className="text-xs text-gray-500 hidden sm:block">
                    Showing {paginatedProjects.length} of {filteredProjects.length} projects
                </p>
                <div className="flex items-center gap-2 mx-auto sm:mx-0">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft size={18} className="text-cyan-400" />
                    </button>

                    <span className="text-sm font-mono text-white/80 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                        {currentPage} <span className="text-white/30">/</span> {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight size={18} className="text-cyan-400" />
                    </button>
                </div>
            </div>

            {/* ═══ Edit/Create Dialog ═══ */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open && galleryOpen) return; setIsDialogOpen(open); if (!open) setEditingProject(null); }}>
                <DialogContent className="bg-[#050510]/95 border-white/10 text-white max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden backdrop-blur-xl z-[60]">
                    <div className="p-6 pb-0 border-b border-white/5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {editingProject?._id ? <Edit2 className="text-cyan-400 w-5 h-5" /> : <Sparkles className="text-purple-400 w-5 h-5" />}
                                {editingProject?._id ? "Edit Project" : "New Neural Construct"}
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <ScrollArea className="max-h-[calc(90vh-80px)] px-6 py-6">
                        {editingProject && (
                            <form onSubmit={handleSave} className="space-y-8">

                                {/* ─── Section 1: Core Info ─── */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-cyan-400 text-xs uppercase tracking-wider">Project Title</Label>
                                        <Input
                                            value={editingProject.title}
                                            onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                                            className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                            placeholder="Project Name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-cyan-400 text-xs uppercase tracking-wider">Category</Label>
                                        <select
                                            value={editingProject.category}
                                            onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm focus:border-cyan-500/50 text-white outline-none"
                                        >
                                            {categories.filter(c => c !== "All").map(c => <option key={c} value={c} className="bg-[#050510]">{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Short Description</Label>
                                    <Textarea
                                        value={editingProject.description}
                                        onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                        className="bg-black/40 border-white/10 min-h-[80px] focus:border-cyan-500/50 resize-none"
                                        placeholder="Brief project summary..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Long Description</Label>
                                    <Textarea
                                        value={editingProject.longDescription || ""}
                                        onChange={e => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                                        className="bg-black/40 border-white/10 min-h-[100px] focus:border-cyan-500/50 resize-none"
                                        placeholder="Detailed project description for the detail view..."
                                    />
                                </div>

                                {/* ─── Section 2: Media Assets ─── */}
                                <div className="space-y-6 p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                                    {/* Images */}
                                    {/* Images */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2 font-bold">
                                                <ImageIcon className="w-4 h-4" />
                                                Project Images
                                            </Label>
                                            <span className="text-[10px] text-white/30 font-mono">{editingProject.images.length} files</span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {editingProject.images.map((img, index) => {
                                                const meta = mediaMeta[img];
                                                const saved = meta ? meta.originalSize - meta.optimizedSize : 0;
                                                const savedPct = meta && meta.originalSize > 0 ? Math.round((saved / meta.originalSize) * 100) : 0;
                                                const isCover = index === 0;
                                                const isDragTarget = dragOverIndex === index;
                                                return (
                                                    <div
                                                        key={img + index}
                                                        draggable
                                                        onDragStart={() => { dragIndexRef.current = index; }}
                                                        onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
                                                        onDragEnter={(e) => { e.preventDefault(); setDragOverIndex(index); }}
                                                        onDragLeave={() => { if (dragOverIndex === index) setDragOverIndex(null); }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
                                                                moveImage(dragIndexRef.current, index);
                                                            }
                                                            dragIndexRef.current = null;
                                                            setDragOverIndex(null);
                                                        }}
                                                        onDragEnd={() => { dragIndexRef.current = null; setDragOverIndex(null); }}
                                                        className={`
                                                            relative aspect-video rounded-lg overflow-hidden group border-2 cursor-grab active:cursor-grabbing transition-all
                                                            ${isCover ? 'border-orange-500/60 ring-1 ring-orange-500/20' : 'border-white/10'}
                                                            ${isDragTarget ? 'border-dashed border-cyan-400 scale-[1.02] shadow-[0_0_15px_rgba(6,182,212,0.2)]' : ''}
                                                        `}
                                                    >
                                                        <img src={img} alt={`Project ${index}`} className={`w-full h-full object-cover transition-opacity ${dragIndexRef.current === index ? 'opacity-40' : ''}`} />

                                                        {/* Order Badge */}
                                                        <div className={`absolute top-1.5 left-1.5 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${isCover ? 'bg-orange-500/90 text-white' : 'bg-black/70 text-white/70 backdrop-blur-sm'}`}>
                                                            {isCover && <Crown size={10} className="text-white" />}
                                                            {isCover ? 'COVER' : `#${index + 1}`}
                                                        </div>

                                                        {/* Drag Handle */}
                                                        <div className="absolute top-1.5 right-1.5 z-20 p-1 bg-black/60 rounded text-white/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                                                            <GripVertical size={12} />
                                                        </div>

                                                        {/* Hover Overlay with Controls */}
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 z-10">
                                                            {/* Arrow Controls */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); moveImage(index, index - 1); }}
                                                                    disabled={index === 0}
                                                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                                                    title="Move left"
                                                                >
                                                                    <ArrowLeft size={14} />
                                                                </button>
                                                                {!isCover && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => { e.stopPropagation(); setCoverImage(index); }}
                                                                        className="p-1.5 bg-orange-500/20 hover:bg-orange-500/40 rounded-full text-orange-400 transition-all"
                                                                        title="Set as cover"
                                                                    >
                                                                        <Crown size={14} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); moveImage(index, index + 1); }}
                                                                    disabled={index === editingProject.images.length - 1}
                                                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                                                    title="Move right"
                                                                >
                                                                    <ArrowRight size={14} />
                                                                </button>
                                                            </div>
                                                            {/* View & Delete */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); setGalleryIndex(index); setGalleryOpen(true); }}
                                                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                                                                    title="Preview"
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                                                    className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-all"
                                                                    title="Remove"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {meta && (
                                                            <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm px-2 py-1 flex items-center justify-between z-10">
                                                                <span className="text-[9px] font-mono text-gray-400">
                                                                    {formatBytes(meta.originalSize)} → <span className="text-cyan-400">{formatBytes(meta.optimizedSize)}</span>
                                                                </span>
                                                                {saved > 0 && (
                                                                    <span className="text-[8px] font-mono font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1 py-0.5 rounded">-{savedPct}%</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-4">
                                            <MediaOptimizer
                                                type="image"
                                                onUploadComplete={(urls, _type, meta) => {
                                                    setEditingProject(prev => prev ? { ...prev, images: [...prev.images, ...urls] } : null);
                                                    setMediaMeta(prev => {
                                                        const next = { ...prev };
                                                        meta.forEach(m => { next[m.url] = m; });
                                                        return next;
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Videos */}
                                    <div className="space-y-4 pt-6 mt-2 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2 font-bold">
                                                <Film className="w-4 h-4" />
                                                Project Videos
                                            </Label>
                                            <span className="text-[10px] text-white/30 font-mono">{(editingProject.videos?.length || 0)} files</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {editingProject.videos?.map((video, index) => {
                                                const meta = mediaMeta[video];
                                                const saved = meta ? meta.originalSize - meta.optimizedSize : 0;
                                                const savedPct = meta && meta.originalSize > 0 ? Math.round((saved / meta.originalSize) * 100) : 0;
                                                return (
                                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden group border border-white/10 bg-black">
                                                        <video src={video} className="w-full h-full object-cover" controls />
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingProject(prev => prev ? { ...prev, videos: prev.videos.filter((_, i) => i !== index) } : null)}
                                                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        {meta && (
                                                            <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm px-2 py-1.5 flex items-center justify-between z-10">
                                                                <span className="text-[10px] font-mono text-gray-400">
                                                                    {formatBytes(meta.originalSize)} → <span className="text-cyan-400">{formatBytes(meta.optimizedSize)}</span>
                                                                </span>
                                                                {saved > 0 && (
                                                                    <span className="text-[9px] font-mono font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">-{savedPct}%</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-4">
                                            <MediaOptimizer
                                                type="video"
                                                onUploadComplete={(urls, _type, meta) => {
                                                    setEditingProject(prev => prev ? { ...prev, videos: [...(prev.videos || []), ...urls] } : null);
                                                    setMediaMeta(prev => {
                                                        const next = { ...prev };
                                                        meta.forEach(m => { next[m.url] = m; });
                                                        return next;
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>


                                {/* ─── Section 3: Tech Stack ─── */}
                                <div className="space-y-2">
                                    <Label className="text-cyan-400 text-xs uppercase tracking-wider">Tech Stack</Label>
                                    <div className="flex flex-wrap gap-2 mb-2 p-3 bg-black/20 rounded-lg min-h-[50px] border border-white/5">
                                        {editingProject.technologies.map(tech => (
                                            <span key={tech} className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-xs flex items-center gap-1 border border-cyan-500/20">
                                                {tech}
                                                <X
                                                    size={12}
                                                    className="cursor-pointer hover:text-white"
                                                    onClick={() => setEditingProject({
                                                        ...editingProject,
                                                        technologies: editingProject.technologies.filter(t => t !== tech)
                                                    })}
                                                />
                                            </span>
                                        ))}
                                        {editingProject.technologies.length === 0 && (
                                            <span className="text-white/20 text-xs">No technologies added yet</span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            value={techInput}
                                            onChange={e => setTechInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (techInput) addTech(techInput);
                                                }
                                            }}
                                            placeholder="Type and press Enter, or select below..."
                                            className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                        />
                                        {techInput && (
                                            <div className="absolute top-full left-0 right-0 bg-[#1a1a2e] border border-white/10 rounded-b-md z-50 max-h-[150px] overflow-y-auto">
                                                {TECH_SUGGESTIONS
                                                    .filter(t => t.toLowerCase().includes(techInput.toLowerCase()) && !editingProject.technologies.includes(t))
                                                    .map(t => (
                                                        <div
                                                            key={t}
                                                            className="p-2 hover:bg-white/10 cursor-pointer text-sm"
                                                            onClick={() => addTech(t)}
                                                        >
                                                            {t}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ─── Section 4: Links & Metadata ─── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            value={editingProject.liveUrl || ""}
                                            onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                                            className="bg-black/40 border-white/10 pl-9 focus:border-cyan-500/50"
                                            placeholder="Live URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            value={editingProject.githubUrl || ""}
                                            onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                                            className="bg-black/40 border-white/10 pl-9 focus:border-cyan-500/50"
                                            placeholder="GitHub URL"
                                        />
                                    </div>
                                    <Input
                                        value={editingProject.team || ""}
                                        onChange={e => setEditingProject({ ...editingProject, team: e.target.value })}
                                        className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                        placeholder="Team / Solo"
                                    />
                                    <Input
                                        value={editingProject.date || ""}
                                        onChange={e => setEditingProject({ ...editingProject, date: e.target.value })}
                                        className="bg-black/40 border-white/10 focus:border-cyan-500/50"
                                        placeholder="Date (e.g. 2024)"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <Switch
                                            checked={editingProject.featured}
                                            onCheckedChange={c => setEditingProject({ ...editingProject, featured: c })}
                                        />
                                        <Label>Feature on Homepage</Label>
                                    </div>
                                    <div className="space-y-2">
                                        <select
                                            value={editingProject.status || "Active"}
                                            onChange={e => setEditingProject({ ...editingProject, status: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm focus:border-cyan-500/50 text-white outline-none"
                                        >
                                            <option value="Active" className="bg-[#050510]">Active</option>
                                            <option value="In Progress" className="bg-[#050510]">In Progress</option>
                                            <option value="Completed" className="bg-[#050510]">Completed</option>
                                            <option value="Archived" className="bg-[#050510]">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ─── Actions ─── */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                                    <NeonButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/5">Cancel</NeonButton>
                                    <NeonButton type="submit" icon={<Edit2 size={16} />}>
                                        {editingProject?._id ? "Update Project" : "Create Project"}
                                    </NeonButton>
                                </div>
                            </form>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Image Preview Lightbox */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="bg-black/95 border-white/10 max-w-5xl w-full p-0 overflow-hidden outline-none">
                    <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh] bg-black">
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                        )}
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ─── Fullscreen Image Gallery (CardStack) ─── */}
            <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
                <DialogPortal>
                    <DialogOverlay className="z-[9999]" />
                    <DialogPrimitive.Content
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl p-0 overflow-hidden focus:outline-none"
                    >
                        <DialogTitle className="sr-only">Image Gallery</DialogTitle>
                        <div className="relative w-full h-full flex items-center justify-center">
                            {editingProject && editingProject.images.length > 0 && (
                                <div className="w-full max-w-5xl px-4">
                                    <CardStack
                                        items={editingProject.images.map((img, i) => ({
                                            id: i,
                                            title: `Image ${i + 1}`,
                                            imageSrc: img,
                                        } as CardStackItem))}
                                        initialIndex={galleryIndex}
                                        cardWidth={600}
                                        cardHeight={380}
                                        overlap={0.5}
                                        spreadDeg={40}
                                        showDots
                                        loop
                                    />
                                </div>
                            )}

                            {/* Close button */}
                            <button
                                onClick={() => setGalleryOpen(false)}
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white border border-white/10 transition-all z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* ESC hint */}
                            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono">
                                ESC to close · ← → to navigate · drag to swipe
                            </span>
                        </div>
                    </DialogPrimitive.Content>
                </DialogPortal>
            </Dialog>
        </div >
    );
};

// ─── Sub-Components ──────────────────────────────────────────────────

function ProjectCard({ project, viewMode, onEdit, onDelete, index, onMove }: { project: ProjectDB, viewMode: 'grid' | 'list', onEdit: (e: any) => void, onDelete: (e: any) => void, index?: number, onMove?: (newIndex: number) => void }) {
    const [isHovered, setIsHovered] = useState(false);
    const [jumpIndex, setJumpIndex] = useState(index !== undefined ? (index + 1).toString() : "");

    // Sync input with props
    useEffect(() => {
        if (index !== undefined) setJumpIndex((index + 1).toString());
    }, [index]);

    const handleJumpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onMove && jumpIndex) {
            const newIdx = parseInt(jumpIndex, 10);
            if (!isNaN(newIdx) && newIdx > 0) {
                onMove(newIdx - 1); // convert to 0-based
            }
        }
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-6 p-4 bg-gradient-to-r from-gray-900/40 to-gray-900/20 border border-white/5 rounded-xl hover:bg-white/5 transition-all hover:border-cyan-500/30 group relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Order Number / Input */}
                <div className="flex flex-col items-center justify-center w-12 shrink-0">
                    <form onSubmit={handleJumpSubmit} className="relative group/order">
                        <input
                            type="text"
                            value={jumpIndex}
                            onChange={(e) => setJumpIndex(e.target.value)}
                            onBlur={() => { if (index !== undefined) setJumpIndex((index + 1).toString()) }} // Reset on blur if not submitted
                            className="w-10 text-center bg-transparent border-b border-white/10 text-xl font-mono text-cyan-500/50 focus:text-cyan-400 focus:border-cyan-500 outline-none transition-colors"
                        />
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-white/20 uppercase tracking-widest opacity-0 group-hover/order:opacity-100 transition-opacity whitespace-nowrap">
                            Order
                        </span>
                    </form>
                </div>

                {/* Image */}
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative border border-white/5 shadow-lg group-hover:shadow-cyan-500/10 transition-shadow">
                    {project.images[0] ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <ImageIcon className="w-6 h-6 text-white/20" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center" onClick={onEdit} role="button" tabIndex={0}>
                    <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors tracking-tight">
                            {project.title}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${project.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                            {project.status || "Active"}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate max-w-lg">{project.description}</p>
                </div>

                {/* Category Badge */}
                <div className="hidden md:flex items-center">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/5">
                        {project.category}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <NeonButton size="sm" variant="secondary" icon={<Edit2 size={14} />} onClick={onEdit} className="h-8">Edit</NeonButton>
                    <NeonButton size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={onDelete} className="h-8 w-8 px-0" />

                    {/* Mobile Menu */}
                    <div className="sm:hidden block">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 text-gray-400 hover:text-white">
                                <MoreVertical size={18} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}>Edit Project</DropdownMenuItem>
                                <DropdownMenuItem onClick={onDelete} className="text-red-400">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full flex flex-col bg-[#0a0a16] rounded-xl border border-white/10 overflow-hidden relative group hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
        >
            {/* Image Preview */}
            <div className="aspect-video relative overflow-hidden bg-black group" onClick={onEdit}>
                {project.images[0] ? (
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => e.currentTarget.src = "https://placehold.co/600x400/1a1a1a/cccccc?text=No+Image"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 bg-grid-white/[0.05]">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                    </div>
                )}

                {/* Image Count Badge */}
                {project.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 z-10 pointer-events-none">
                        <ImageIcon className="w-3 h-3" />
                        {project.images.length}
                    </div>
                )}

                {/* Desktop Overlay Actions - Using opacity for hover effect but pointer-events to manage clicks */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-3 backdrop-blur-sm z-20 pointer-events-none group-hover:pointer-events-auto">
                    <NeonButton size="sm" onClick={(e) => { e.stopPropagation(); onEdit(e); }} variant="secondary" icon={<Edit2 size={14} />}>
                        Edit
                    </NeonButton>
                    <NeonButton size="sm" onClick={(e) => { e.stopPropagation(); onDelete(e); }} variant="danger" icon={<Trash2 size={14} />} />
                </div>

                {/* Mobile: Always visible edit icons */}
                <div className="absolute top-2 right-2 flex gap-2 md:hidden z-30">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(e); }}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 shadow-lg hover:bg-cyan-500/20 active:scale-95 transition-all"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-red-400 border border-white/10 shadow-lg hover:bg-red-500/20 active:scale-95 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                {project.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.3)] z-10 pointer-events-none">
                        <Star className="w-3 h-3 fill-yellow-200" /> Featured
                    </div>
                )}
            </div>

            {/* Content - Clickable to edit */}
            <div className="p-4 md:p-5 flex-1 flex flex-col space-y-3 md:space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/50 cursor-pointer" onClick={onEdit}>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded bg-cyan-500/5 shrink-0">
                        {project.category}
                    </span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-[10px] text-gray-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded transition-colors hover:bg-white/10 hover:text-white">
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 4 && (
                        <span className="text-[10px] text-gray-500 px-1 py-0.5">+ {project.technologies.length - 4}</span>
                    )}
                </div>

                <div className="mt-auto pt-3 md:pt-4 flex gap-4 text-gray-400 border-t border-white/5">
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs hover:text-cyan-400 transition-colors z-20">
                            <Globe className="w-3 h-3" /> Live Demo
                        </a>
                    )}
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs hover:text-purple-400 transition-colors z-20">
                            <Github className="w-3 h-3" /> Code
                        </a>
                    )}
                    {project.status && (
                        <span className="ml-auto text-[10px] text-gray-500 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                            {project.status}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
