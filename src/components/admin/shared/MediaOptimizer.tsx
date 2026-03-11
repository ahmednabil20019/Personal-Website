import { useState, useRef } from "react";
import { NeonButton } from "@/components/ui/neon-button";
import { Upload, X, Film, Image as ImageIcon, CheckCircle, Loader2, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";

export interface UploadMeta {
    url: string;
    originalSize: number;
    optimizedSize: number;
}

interface MediaOptimizerProps {
    onUploadComplete: (urls: string[], type: "image" | "video", meta: UploadMeta[]) => void;
    type: "image" | "video";
}

interface UploadFile {
    file: File;
    id: string;
    originalSize: number;
    optimizedSize?: number;
    status: "pending" | "uploading" | "done" | "error";
    uploadedUrl?: string;
    progress: number;
    errorMsg?: string;
}

export const MediaOptimizer = ({ onUploadComplete, type }: MediaOptimizerProps) => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Upload one file
    const doUpload = async (fileObj: UploadFile): Promise<{ url: string; optimizedSize: number } | null> => {
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "uploading", progress: 5 } : f));

        const ticker = setInterval(() => {
            setFiles(prev => prev.map(f => {
                if (f.id !== fileObj.id || f.status !== "uploading") return f;
                return { ...f, progress: Math.min(f.progress + Math.random() * 10, 90) };
            }));
        }, 400);

        try {
            const fd = new FormData();
            fd.append("files", fileObj.file);
            console.log(`[Upload] → ${fileObj.file.name} (${formatBytes(fileObj.originalSize)})`);

            const res = await fetch("/api/upload", { method: "POST", body: fd });
            clearInterval(ticker);

            if (!res.ok) {
                const raw = await res.text();
                const m = raw.match(/"message":"([^"]+)"/);
                throw new Error(m?.[1] || `Error ${res.status}`);
            }

            const json = await res.json();
            const d = json.data?.[0];
            if (!d?.url) throw new Error("No URL from server");

            const optimizedSize = d.size ?? fileObj.originalSize;
            console.log(`[Upload] ✓ ${fileObj.file.name} — ${formatBytes(fileObj.originalSize)} → ${formatBytes(optimizedSize)}`);

            setFiles(prev => prev.map(f => f.id === fileObj.id ? {
                ...f, status: "done", progress: 100, optimizedSize, uploadedUrl: d.url,
            } : f));

            return { url: d.url, optimizedSize };
        } catch (err: any) {
            clearInterval(ticker);
            console.error(`[Upload] ✗ ${fileObj.file.name}:`, err?.message);
            setFiles(prev => prev.map(f => f.id === fileObj.id ? {
                ...f, status: "error", progress: 0, errorMsg: err?.message || "Failed",
            } : f));
            toast.error(`${fileObj.file.name}: ${err?.message}`);
            return null;
        }
    };

    // Upload all files sequentially
    const startUploads = async (uploadFiles: UploadFile[]) => {
        setIsUploading(true);
        const urls: string[] = [];
        const meta: UploadMeta[] = [];

        for (const f of uploadFiles) {
            const result = await doUpload(f);
            if (result) {
                urls.push(result.url);
                meta.push({ url: result.url, originalSize: f.originalSize, optimizedSize: result.optimizedSize });
            }
        }

        setIsUploading(false);

        if (urls.length > 0) {
            // Auto-attach after a short delay to show results
            setTimeout(() => {
                onUploadComplete(urls, type, meta);
                toast.success(`${urls.length} ${type}(s) uploaded & optimized`);
                setFiles([]);
            }, 2000);
        }
    };

    // Add files and start uploading
    const addFiles = (selected: File[]) => {
        const valid = selected.filter(f =>
            type === "image" ? f.type.startsWith("image/") : f.type.startsWith("video/")
        );
        if (valid.length !== selected.length) toast.error(`Only ${type}s are accepted`);
        if (valid.length === 0) return;

        const newFiles: UploadFile[] = valid.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            originalSize: file.size,
            status: "pending" as const,
            progress: 0,
        }));

        setFiles(newFiles);
        // Let React render the file list, then start uploading
        setTimeout(() => startUploads(newFiles), 100);
    };

    // Handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) { addFiles(Array.from(e.target.files)); e.target.value = ""; }
    };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files)); };

    // Computed
    const totalOriginal = files.reduce((s, f) => s + f.originalSize, 0);
    const totalOptimized = files.reduce((s, f) => s + (f.optimizedSize ?? f.originalSize), 0);
    const totalSaved = totalOriginal - totalOptimized;
    const savingsPct = totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0;
    const allDone = files.length > 0 && files.every(f => f.status === "done" || f.status === "error");
    const showFiles = files.length > 0;

    return (
        <div className="space-y-3">
            <input type="file" multiple accept={type === "image" ? "image/*" : "video/*"} className="hidden" ref={fileInputRef} onChange={handleFileSelect} />

            {/* Drop Zone */}
            <NeonButton
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                variant="secondary"
                icon={type === "image" ? <ImageIcon size={20} /> : <Film size={20} />}
                className={`w-full h-32 border-dashed border-2 flex-col gap-2 text-gray-400 group transition-all duration-300 relative overflow-hidden ${isDragging
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 scale-[1.02]"
                    : "border-white/10 bg-black/20 hover:bg-black/40 hover:border-cyan-500/30 hover:text-cyan-400"
                    }`}
                disabled={isUploading}
            >
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${isDragging
                    ? "from-cyan-500/10 via-cyan-500/5 to-transparent"
                    : "from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 group-hover:via-cyan-500/5 group-hover:to-cyan-500/10"
                    }`} />
                <div className={`p-2 rounded-lg border transition-all duration-300 shadow-lg z-10 ${isDragging
                    ? "bg-cyan-500/20 border-cyan-500/30"
                    : "bg-white/5 border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20"
                    }`}>
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : <Upload className={`w-5 h-5 ${isDragging ? "animate-bounce text-cyan-400" : ""}`} />}
                </div>
                <p className={`font-semibold text-sm z-10 ${isDragging ? "text-cyan-400" : "text-white/90 group-hover:text-cyan-400"}`}>
                    {isUploading ? "Uploading..." : isDragging ? "Drop to Upload" : `Upload ${type === "image" ? "Images" : "Videos"}`}
                </p>
            </NeonButton>

            {/* INLINE Progress — renders below drop zone, no nested Dialog */}
            {showFiles && (
                <div className="rounded-xl border border-white/10 bg-[#0a0a1a]/80 backdrop-blur-md overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            {allDone ? (
                                <><CheckCircle size={16} className="text-green-400" /><span className="text-green-400">Upload Complete</span></>
                            ) : (
                                <><Loader2 size={16} className="animate-spin text-cyan-400" /><span className="text-cyan-400">Uploading & Optimizing...</span></>
                            )}
                        </div>
                        {allDone && totalSaved > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                                <ArrowDown size={11} className="text-green-400" />
                                <span className="text-green-400 font-bold text-[11px] font-mono">{formatBytes(totalSaved)} saved ({savingsPct}%)</span>
                            </div>
                        )}
                    </div>

                    {/* File rows */}
                    <div className="divide-y divide-white/5 max-h-[280px] overflow-y-auto">
                        {files.map(file => {
                            const saved = file.optimizedSize ? file.originalSize - file.optimizedSize : 0;
                            const pct = file.originalSize > 0 && file.optimizedSize ? Math.round((saved / file.originalSize) * 100) : 0;

                            return (
                                <div key={file.id} className="px-4 py-3 flex items-center gap-3">
                                    {/* Status icon */}
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                        background: file.status === "done" ? "rgba(34,197,94,0.1)" :
                                            file.status === "error" ? "rgba(239,68,68,0.1)" :
                                                file.status === "uploading" ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.05)"
                                    }}>
                                        {file.status === "done" && <CheckCircle size={16} className="text-green-400" />}
                                        {file.status === "error" && <X size={16} className="text-red-400" />}
                                        {file.status === "uploading" && <Loader2 size={16} className="animate-spin text-cyan-400" />}
                                        {file.status === "pending" && (type === "image" ? <ImageIcon size={14} className="text-gray-500" /> : <Film size={14} className="text-gray-500" />)}
                                    </div>

                                    {/* File info */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className="text-xs text-white truncate font-medium">{file.file.name}</p>

                                        {/* Progress bar */}
                                        {(file.status === "uploading" || file.status === "pending") && (
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500"
                                                    style={{ width: `${file.progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Size info */}
                                    <div className="flex items-center gap-2 flex-shrink-0 text-[11px] font-mono">
                                        <span className="text-gray-500">{formatBytes(file.originalSize)}</span>

                                        {file.status === "uploading" && (
                                            <span className="text-cyan-400 w-8 text-right">{Math.round(file.progress)}%</span>
                                        )}

                                        {file.status === "done" && file.optimizedSize != null && (
                                            <>
                                                <span className="text-gray-600">→</span>
                                                <span className="text-cyan-400 font-bold">{formatBytes(file.optimizedSize)}</span>
                                                {saved > 0 && (
                                                    <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded text-[10px]">-{pct}%</span>
                                                )}
                                            </>
                                        )}

                                        {file.status === "error" && (
                                            <span className="text-red-400 text-[10px]">{file.errorMsg}</span>
                                        )}

                                        {file.status === "pending" && (
                                            <span className="text-yellow-500/50 text-[10px]">queued</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer stats */}
                    <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-white/30 font-mono">
                        <span>
                            {allDone
                                ? `✓ ${files.filter(f => f.status === "done").length} files — auto-attaching in 2s...`
                                : `Uploading ${files.filter(f => f.status === "uploading").length + files.filter(f => f.status === "done").length}/${files.length}...`
                            }
                        </span>
                        <span>{formatBytes(totalOriginal)} total</span>
                    </div>
                </div>
            )}
        </div>
    );
};
