import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { AdminLoader } from "../AdminLoader";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
    Plus, Search, Award, Calendar, Trash2, X, Edit2, Sparkles,
    Upload, Eye, Loader2, Filter, LayoutGrid, List, ChevronLeft, ChevronRight, MoreVertical, ExternalLink, Link as LinkIcon
} from "lucide-react";
import { NeonButton } from "@/components/ui/neon-button";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CertificationDB {
    _id?: string;
    title: string;
    issuer: string;
    category?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    courseHours?: string;
    credentialId?: string;
    verificationUrl?: string;
    image: string;
}

const ISSUERS_SUGGESTIONS = ["Coursera", "Udemy", "edX", "Google", "AWS", "Microsoft", "Meta", "IBM", "DeepLearning.AI", "Hackerrank"];
const CATEGORY_SUGGESTIONS = ["Web Development", "Data Science", "Machine Learning", "Cloud Computing", "Cybersecurity", "Digital Marketing", "UI/UX Design", "DevOps", "Mobile Development", "Networking"];

export const CertificationsAdmin = () => {
    // Data State
    const [certs, setCerts] = useState<CertificationDB[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // View State
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter State
    const [search, setSearch] = useState("");
    const [selectedIssuer, setSelectedIssuer] = useState("All Issuers");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Modal State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<CertificationDB | null>(null);

    // Drag-and-drop / Image Upload State
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetchCerts();
    }, []);

    const fetchCerts = async () => {
        try {
            const res = await fetch('/api/certifications');
            const json = await res.json();
            if (json.success) {
                setCerts(json.data);
            }
        } catch (err) {
            toast.error("Failed to fetch certifications");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter Logic
    const filteredCerts = certs.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.issuer.toLowerCase().includes(search.toLowerCase());
        const matchesIssuer = selectedIssuer === "All Issuers" || c.issuer === selectedIssuer;
        return matchesSearch && matchesIssuer;
    });

    const uniqueIssuers = ["All Issuers", ...Array.from(new Set(certs.map(c => c.issuer))).sort()];

    // Pagination Logic
    const totalPages = Math.ceil(filteredCerts.length / itemsPerPage);
    const paginatedCerts = filteredCerts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedIssuer]);

    // CRUD Operations
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCert) return;

        try {
            const method = editingCert._id ? 'PUT' : 'POST';
            const url = editingCert._id ? `/api/certifications/${editingCert._id}` : '/api/certifications';
            const { _id, ...payload } = editingCert;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();

            if (json.success) {
                toast.success(`Certificate ${editingCert._id ? 'updated' : 'created'}`);
                fetchCerts();
                setIsDialogOpen(false);
                setEditingCert(null);
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Error saving certificate");
        }
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!confirm("Are you sure? This cannot be undone.")) return;
        try {
            await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
            toast.success("Certificate deleted");
            fetchCerts();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const openNewCert = () => {
        setEditingCert({
            title: "",
            issuer: "",
            category: "",
            startDate: "",
            endDate: "",
            courseHours: "",
            credentialId: "",
            verificationUrl: "",
            image: ""
        });
        setIsDialogOpen(true);
    };

    const openEditCert = (cert: CertificationDB, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditingCert({ ...cert });
        setIsDialogOpen(true);
    };

    // ─── Image Upload Logic ──────────────────────────────────────────
    const uploadFile = useCallback(async (files: File[]) => {
        if (!editingCert || files.length === 0) return;

        const imageFile = files[0];
        if (!imageFile.type.startsWith('image/')) {
            toast.error("Only image files are allowed");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('files', imageFile);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const result = await res.json();
                const newUrl = result.data[0]?.url;
                if (newUrl) {
                    setEditingCert(prev => prev ? { ...prev, image: newUrl } : prev);
                    toast.success("Image uploaded");
                }
            } else {
                const err = await res.json();
                toast.error(err.error || "Upload failed");
            }
        } catch (err) {
            toast.error("Upload error");
        } finally {
            setIsUploading(false);
        }
    }, [editingCert]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        uploadFile(files);
    }, [uploadFile]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            uploadFile(Array.from(e.target.files));
            e.target.value = '';
        }
    }, [uploadFile]);

    // ─── Render ──────────────────────────────────────────────────────
    return (
        <div className="space-y-6 h-full flex flex-col relative text-white">
            {/* ═══ Header & Controls ═══ */}
            <div className="flex flex-col gap-4 sticky top-0 z-30 pt-4 bg-[#030014]/80 backdrop-blur-md pb-4 border-b border-white/5 -mx-4 px-4 md:px-6">

                {/* Top Row */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-orange-400">
                            Certifications
                        </h1>
                        <p className="text-sm text-gray-400">Manage credentials and awards</p>
                    </div>
                    <NeonButton onClick={openNewCert} icon={<Plus size={16} />} className="shadow-[0_0_20px_rgba(234,179,8,0.2)] border-yellow-500/50 text-yellow-100">
                        Add Certificate
                    </NeonButton>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50 group-hover:text-yellow-400 transition-colors" />
                        <Input
                            placeholder="Search certificates..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 bg-black/40 border-white/10 text-white focus:border-yellow-500/50 transition-all h-10"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        <select
                            value={selectedIssuer}
                            onChange={e => setSelectedIssuer(e.target.value)}
                            className="bg-black/40 border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-yellow-500/50 outline-none hover:bg-white/5 cursor-pointer min-w-[140px]"
                        >
                            {uniqueIssuers.map(i => <option key={i} value={i} className="bg-[#050510]">{i}</option>)}
                        </select>

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
                ) : filteredCerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-white/40 space-y-4 border border-dashed border-white/10 rounded-2xl m-4">
                        <Filter className="w-12 h-12 opacity-20" />
                        <p className="text-lg">No certifications match your query</p>
                        <button onClick={() => { setSearch(""); setSelectedIssuer("All Issuers"); }} className="text-yellow-400 hover:underline text-sm">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20" : "flex flex-col gap-4 pb-20"}>
                        <AnimatePresence>
                            {paginatedCerts.map(cert => (
                                <CertCard
                                    key={cert._id}
                                    cert={cert}
                                    viewMode={viewMode}
                                    onEdit={(e) => openEditCert(cert, e)}
                                    onDelete={(e) => cert._id && handleDelete(cert._id, e)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ═══ Pagination Footer ═══ */}
            <div className="p-4 bg-[#030014]/90 backdrop-blur-xl border-t border-white/10 z-30 flex justify-between items-center -mx-4 px-4 md:-mx-6 md:px-6 sticky bottom-0">
                <p className="text-xs text-gray-500 hidden sm:block">
                    Showing {paginatedCerts.length} of {filteredCerts.length} certifications
                </p>
                <div className="flex items-center gap-2 mx-auto sm:mx-0">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft size={18} className="text-yellow-400" />
                    </button>

                    <span className="text-sm font-mono text-white/80 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                        {currentPage} <span className="text-white/30">/</span> {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight size={18} className="text-yellow-400" />
                    </button>
                </div>
            </div>

            {/* ═══ Edit/Create Dialog ═══ */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingCert(null); }}>
                <DialogContent className="bg-[#050510]/95 border-white/10 text-white max-w-2xl w-[95vw] max-h-[90vh] p-0 overflow-hidden backdrop-blur-xl z-[60]">
                    <div className="p-6 pb-0 border-b border-white/5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {editingCert?._id ? <Edit2 className="text-yellow-400 w-5 h-5" /> : <Award className="text-yellow-400 w-5 h-5" />}
                                {editingCert?._id ? "Edit Certificate" : "New Certification"}
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <ScrollArea className="max-h-[calc(90vh-80px)] px-6 py-6">
                        {editingCert && (
                            <form onSubmit={handleSave} className="space-y-6">

                                {/* Title & Issuer */}
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-yellow-400 text-xs uppercase tracking-wider">Certification Title</Label>
                                        <Input
                                            value={editingCert.title}
                                            onChange={e => setEditingCert({ ...editingCert, title: e.target.value })}
                                            className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                            placeholder="e.g. AWS Solutions Architect"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-yellow-400 text-xs uppercase tracking-wider">Issuer</Label>
                                            <Input
                                                value={editingCert.issuer}
                                                onChange={e => setEditingCert({ ...editingCert, issuer: e.target.value })}
                                                className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                                placeholder="e.g. Amazon Web Services"
                                                list="issuers"
                                            />
                                            <datalist id="issuers">
                                                {ISSUERS_SUGGESTIONS.map(i => <option key={i} value={i} />)}
                                            </datalist>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-yellow-400 text-xs uppercase tracking-wider">Category</Label>
                                            <Input
                                                value={editingCert.category || ""}
                                                onChange={e => setEditingCert({ ...editingCert, category: e.target.value })}
                                                className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                                placeholder="e.g. Web Development"
                                                list="categories"
                                            />
                                            <datalist id="categories">
                                                {CATEGORY_SUGGESTIONS.map(c => <option key={c} value={c} />)}
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-yellow-400 text-xs uppercase tracking-wider">Start Date</Label>
                                            <Input
                                                type="date"
                                                value={editingCert.startDate || ""}
                                                onChange={e => setEditingCert({ ...editingCert, startDate: e.target.value })}
                                                className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-yellow-400 text-xs uppercase tracking-wider">End Date</Label>
                                            <Input
                                                type="date"
                                                value={editingCert.endDate || ""}
                                                onChange={e => setEditingCert({ ...editingCert, endDate: e.target.value })}
                                                className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-yellow-400 text-xs uppercase tracking-wider">Course Hours</Label>
                                            <Input
                                                type="number"
                                                value={editingCert.courseHours || ""}
                                                onChange={e => setEditingCert({ ...editingCert, courseHours: e.target.value })}
                                                className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                                placeholder="e.g. 40"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-3 p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                                    <Label className="text-yellow-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Certificate Image
                                    </Label>

                                    {/* Drop Zone */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => !isUploading && fileInputRef.current?.click()}
                                        className={`
                                        relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 min-h-[160px] flex flex-col items-center justify-center
                                        ${isDragOver
                                                ? "border-yellow-400 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.15)]"
                                                : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                                            }
                                        ${isUploading ? "pointer-events-none opacity-60" : ""}
                                    `}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInputChange}
                                            className="hidden"
                                        />

                                        {isUploading ? (
                                            <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                                        ) : editingCert.image ? (
                                            <div className="relative w-full h-full p-2 group/preview">
                                                <img src={editingCert.image} className="w-full h-40 object-contain rounded-md" alt="Preview" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                                    <p className="text-white font-medium">Click to replace</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-6">
                                                <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                                                <p className="text-sm text-white/60">Drag & drop or click to upload</p>
                                            </div>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="Or paste image URL..."
                                        value={editingCert.image}
                                        onChange={e => setEditingCert({ ...editingCert, image: e.target.value })}
                                        className="bg-black/40 border-white/10 focus:border-yellow-500/50 text-sm"
                                    />
                                </div>

                                {/* Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-yellow-400 text-xs uppercase tracking-wider">Credential ID</Label>
                                        <Input
                                            value={editingCert.credentialId || ""}
                                            onChange={e => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                                            className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                            placeholder="Optional ID"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-yellow-400 text-xs uppercase tracking-wider">Verification URL</Label>
                                        <Input
                                            value={editingCert.verificationUrl || ""}
                                            onChange={e => setEditingCert({ ...editingCert, verificationUrl: e.target.value })}
                                            className="bg-black/40 border-white/10 focus:border-yellow-500/50"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                                    <NeonButton type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/5">Cancel</NeonButton>
                                    <NeonButton type="submit" icon={<Edit2 size={16} />} className="border-yellow-500/30 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                        {editingCert?._id ? "Update Certificate" : "Add Certificate"}
                                    </NeonButton>
                                </div>
                            </form>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Lightbox for Preview */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="bg-black/95 border-white/10 max-w-4xl w-full p-0 overflow-hidden outline-none">
                    <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh] bg-black">
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                        )}
                        <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20"><X className="w-5 h-5" /></button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ─── Sub-Components ──────────────────────────────────────────────────

function CertCard({ cert, viewMode, onEdit, onDelete }: { cert: CertificationDB, viewMode: 'grid' | 'list', onEdit: (e: any) => void, onDelete: (e: any) => void }) {
    if (viewMode === 'list') {
        return (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group">
                <div className="w-16 h-12 rounded-md overflow-hidden bg-black shrink-0 relative">
                    {cert.image ? (
                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                    ) : (
                        <Award className="w-6 h-6 text-gray-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{cert.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{[cert.issuer, cert.startDate || cert.date].filter(Boolean).join(' • ')}</p>
                </div>
                <div className="flex items-center gap-2">
                    {cert.verificationUrl && (
                        <a href={cert.verificationUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white"><ExternalLink size={16} /></a>
                    )}
                    <NeonButton size="sm" variant="secondary" icon={<Edit2 size={14} />} onClick={onEdit} className="hidden sm:flex">Edit</NeonButton>
                    <NeonButton size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={onDelete} className="hidden sm:flex" />

                    <DropdownMenu>
                        <DropdownMenuTrigger className="sm:hidden p-2 text-gray-400 hover:text-white">
                            <MoreVertical size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="text-red-400">Delete</DropdownMenuItem>
                            {cert.verificationUrl && <DropdownMenuItem onClick={() => window.open(cert.verificationUrl, '_blank')}>View Verify</DropdownMenuItem>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full flex flex-col bg-[#0a0a16] rounded-xl border border-white/10 overflow-hidden relative group hover:border-yellow-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:-translate-y-1"
        >
            {/* Image Section */}
            <div className="h-40 relative overflow-hidden bg-black/50 p-6 flex items-center justify-center group" onClick={onEdit}>
                {cert.image ? (
                    <>
                        <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-20" style={{ backgroundImage: `url(${cert.image})` }} />
                        <img
                            src={cert.image}
                            alt={cert.title}
                            className="h-full w-auto max-w-full object-contain relative z-10 shadow-lg transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => e.currentTarget.src = "https://placehold.co/600x400/1a1a1a/cccccc?text=No+Image"}
                        />
                    </>
                ) : (
                    <Award className="w-16 h-16 text-white/20" />
                )}

                {/* Desktop Overlay Actions - Using opacity/pointer-events trick */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-3 backdrop-blur-sm z-20 pointer-events-none group-hover:pointer-events-auto">
                    <NeonButton size="sm" onClick={(e) => { e.stopPropagation(); onEdit(e); }} variant="secondary" icon={<Edit2 size={14} />}>Edit</NeonButton>
                    <NeonButton size="sm" onClick={(e) => { e.stopPropagation(); onDelete(e); }} variant="danger" icon={<Trash2 size={14} />} />
                </div>

                {/* Mobile: Always visible edit icons */}
                <div className="absolute top-2 right-2 flex gap-2 md:hidden z-30">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(e); }}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 shadow-lg"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-red-400 border border-white/10 shadow-lg"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Content - Clickable */}
            <div className="p-5 flex-1 flex flex-col space-y-3 bg-gradient-to-b from-white/5 to-transparent cursor-pointer" onClick={onEdit}>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors line-clamp-2">{cert.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>{cert.issuer}</span>
                </div>

                {(cert.startDate || cert.endDate || cert.date) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{cert.startDate && cert.endDate ? `${cert.startDate} – ${cert.endDate}` : cert.startDate || cert.date}</span>
                    </div>
                )}
                {cert.courseHours && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-[10px] font-medium">{cert.courseHours}h</span>
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    {cert.credentialId && (
                        <span className="text-[10px] text-gray-600 font-mono">ID: {cert.credentialId}</span>
                    )}
                    {cert.verificationUrl && (
                        <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-yellow-400 hover:underline ml-auto z-20"
                        >
                            Verify <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
