import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, FileText, Globe, Mail, Phone, MapPin, Linkedin, Github, Twitter, Facebook, Instagram, MessageCircle, Upload, Trash2, Eye, EyeOff } from "lucide-react";
import { AdminLoader } from "../AdminLoader";

interface ContactDB {
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    twitter: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    messenger: string;
    hiddenSocials: string[];
}

interface CVDB {
    url: string;
    filename?: string;
    updatedAt: string;
}

export const SettingsAdmin = () => {
    const [contact, setContact] = useState<ContactDB>({
        email: "", phone: "", location: "", website: "",
        linkedin: "", github: "", twitter: "", instagram: "", facebook: "", whatsapp: "", messenger: "",
        hiddenSocials: []
    });
    const [cv, setCv] = useState<CVDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [contactRes, cvRes] = await Promise.all([
                fetch('/api/contact'),
                fetch('/api/cv')
            ]);

            const contactJson = await contactRes.json();
            const cvJson = await cvRes.json();

            if (contactJson.success && contactJson.data) setContact(contactJson.data);
            if (cvJson.success && cvJson.data) setCv(cvJson.data);

        } catch (err) {
            toast.error("Failed to fetch settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveContact = async () => {
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            });
            const json = await res.json();
            if (json.success) {
                toast.success("Contact info updated");
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            toast.error("Failed to save contact");
        }
    };

    const handleSaveCV = async (url: string, filename?: string) => {
        try {
            const res = await fetch('/api/cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, filename: filename || '' })
            });
            const json = await res.json();
            if (json.success) {
                toast.success("CV updated");
                setCv(json.data);
            }
        } catch (err) {
            toast.error("Failed to save CV");
        }
    };

    if (isLoading) return <AdminLoader />;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Global Settings</h2>
                    <p className="text-gray-400">Manage your digital presence and global configurations.</p>
                </div>
                <Button onClick={handleSaveContact} className="bg-gradient-to-r from-purple-600 to-cyan-600">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
            </div>

            <Tabs defaultValue="contact" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="contact" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Contact & Socials</TabsTrigger>
                    <TabsTrigger value="cv" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Resume / CV</TabsTrigger>
                </TabsList>

                {/* Contact & Socials Tab */}
                <TabsContent value="contact" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primary Info */}
                        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> Primary Contact</h3>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={contact.location} onChange={e => setContact({ ...contact, location: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Personal Website</Label>
                                <Input value={contact.website} onChange={e => setContact({ ...contact, website: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                            </div>
                        </Card>

                        {/* Social Links */}
                        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" /> Social Networks</h3>
                            <p className="text-xs text-gray-500">Toggle the eye icon to show/hide a button on your public site.</p>

                            <div className="grid grid-cols-1 gap-3">
                                {([
                                    { key: "github", icon: Github, color: "text-gray-400", placeholder: "GitHub URL" },
                                    { key: "linkedin", icon: Linkedin, color: "text-blue-400", placeholder: "LinkedIn URL" },
                                    { key: "twitter", icon: Twitter, color: "text-sky-400", placeholder: "Twitter URL" },
                                    { key: "instagram", icon: Instagram, color: "text-pink-400", placeholder: "Instagram URL" },
                                    { key: "facebook", icon: Facebook, color: "text-blue-600", placeholder: "Facebook URL" },
                                ] as const).map(({ key, icon: Icon, color, placeholder }) => {
                                    const isHidden = contact.hiddenSocials.includes(key);
                                    const toggleHide = () => setContact(prev => ({
                                        ...prev,
                                        hiddenSocials: isHidden
                                            ? prev.hiddenSocials.filter(s => s !== key)
                                            : [...prev.hiddenSocials, key]
                                    }));
                                    return (
                                        <div key={key} className={`flex items-center gap-3 transition-opacity ${isHidden ? "opacity-40" : "opacity-100"}`}>
                                            <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
                                            <Input
                                                placeholder={placeholder}
                                                value={(contact as any)[key]}
                                                onChange={e => setContact({ ...contact, [key]: e.target.value })}
                                                className="bg-black/50 border-white/10 text-white flex-1"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleHide}
                                                title={isHidden ? "Show on site" : "Hide from site"}
                                                className={`p-2 rounded-lg border transition-colors flex-shrink-0 ${isHidden
                                                        ? "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                        : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                                    }`}
                                            >
                                                {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Messaging Apps */}
                        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md space-y-4 md:col-span-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-400" /> Direct Messaging</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>WhatsApp Number</Label>
                                    <Input placeholder="+1234567890" value={contact.whatsapp} onChange={e => setContact({ ...contact, whatsapp: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Messenger URL</Label>
                                    <Input placeholder="m.me/username" value={contact.messenger} onChange={e => setContact({ ...contact, messenger: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* CV Tab */}
                <TabsContent value="cv" className="mt-6">
                    <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md text-center space-y-6">
                        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20">
                            <FileText className="w-10 h-10 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Resume / CV Configuration</h3>
                            <p className="text-gray-400 mt-2 max-w-md mx-auto">
                                Manage the PDF file linked to the "Download Resume" buttons across your portfolio.
                            </p>
                        </div>

                        {/* Drag & Drop Upload Area */}
                        <div className="max-w-xl mx-auto space-y-4">
                            <CVUploadArea
                                currentUrl={cv?.url || ""}
                                currentFilename={cv?.filename || ""}
                                onUpload={(url, filename) => {
                                    setCv(prev => prev ? { ...prev, url, filename } : { url, filename, updatedAt: new Date().toISOString() });
                                    handleSaveCV(url, filename);
                                }}
                            />

                            {cv?.updatedAt && (
                                <p className="text-sm text-gray-400 pt-4 border-t border-white/10">
                                    Last Updated: {new Date(cv.updatedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

// ─── Sub-Components ──────────────────────────────────────────────────

function CVUploadArea({ currentUrl, currentFilename, onUpload }: { currentUrl: string, currentFilename?: string, onUpload: (url: string, filename?: string) => void }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [inputType, setInputType] = useState<'upload' | 'link'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Display filename: prefer stored filename, then fallback to URL basename
    const rawFileName = currentUrl ? currentUrl.split('/').pop() || "" : "No file selected";
    const fileName = currentFilename || rawFileName.replace(/^cv_\d+_/, '').replace(/^\d+_/, '');
    const isPdf = currentUrl?.toLowerCase().includes('.pdf') || currentFilename?.toLowerCase().endsWith('.pdf');

    // Fetch-blob download: reads the Content-Disposition filename set by the server
    const handleDownload = async () => {
        try {
            const response = await fetch('/api/cv/download');
            const disposition = response.headers.get('Content-Disposition');
            let name = fileName || 'resume.pdf';
            if (disposition) {
                const m = disposition.match(/filename="?([^"\n]+)"?/);
                if (m) name = m[1];
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) handleFileUpload(files[0]);
    };

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('files', file); // API expects 'files'

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const result = await res.json();
                // Expecting { data: [{ url: "...", filename: "..." }] }
                if (result.data && result.data.length > 0) {
                    const uploadedFile = result.data[0];
                    onUpload(uploadedFile.url, uploadedFile.filename || file.name);
                    toast.success("CV uploaded successfully");
                }
            } else {
                toast.error("Upload failed");
            }
        } catch (err) {
            toast.error("Error uploading file");
        } finally {
            setIsUploading(false);
        }
    };

    // If a URL is already set, show the "File Card" state
    if (currentUrl && inputType === 'upload') {
        return (
            <div className="relative group p-6 border border-white/10 bg-white/5 rounded-xl flex items-center gap-4 transition-all hover:border-purple-500/30">
                <div className="w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center border border-white/10">
                    <FileText className="text-purple-400" />
                </div>
                <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[300px]">
                        {fileName}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                        {isPdf ? "PDF Document" : "External Link"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => window.open(currentUrl, '_blank')} className="hover:bg-white/10">
                        View
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload} className="hover:bg-white/10 text-purple-400">
                        <Upload className="w-3 h-3 mr-1 rotate-180" />
                        Download
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                        onUpload("", "");
                        toast.success("CV removed");
                    }} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                    </Button>
                </div>
                <div className="absolute top-2 right-2 text-[10px] text-gray-600 cursor-pointer hover:text-purple-400" onClick={() => setInputType('link')}>
                    Switch to URL Mode
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
                <button
                    onClick={() => setInputType('upload')}
                    className={`text-sm pb-1 border-b-2 transition-colors ${inputType === 'upload' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    File Upload
                </button>
                <button
                    onClick={() => setInputType('link')}
                    className={`text-sm pb-1 border-b-2 transition-colors ${inputType === 'link' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    Direct Link
                </button>
            </div>

            {inputType === 'upload' ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 py-10
                        ${isDragOver
                            ? "border-purple-400 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                            : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                        }
                        ${isUploading ? "pointer-events-none opacity-60" : ""}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                        }}
                    />

                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2" />
                                <span className="text-purple-400 text-sm">Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <div className={`p-3 rounded-full bg-white/5 ${isDragOver ? 'scale-110' : ''} transition-transform`}>
                                    <Upload className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/80">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF, DOCX up to 10MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Input
                        placeholder="Paste direct URL to PDF..."
                        defaultValue={currentUrl} // Use defaultValue to allow type editing
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // Manual override
                                onUpload((e.target as HTMLInputElement).value);
                                toast.success("URL updated manually");
                            }
                        }}
                        className="bg-black/50 border-white/10 text-white"
                    />
                    <Button onClick={(e) => {
                        // Find the sibling input
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                        onUpload(input.value);
                        toast.success("URL updated manually");
                    }} variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                        Set URL
                    </Button>
                </div>
            )}
        </div>
    );
};

