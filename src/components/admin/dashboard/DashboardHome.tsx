import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Zap, Clock, Sparkles, Terminal, Server, Database,
    RefreshCw, Trash2, HardDrive, CheckCircle2, Search, Plus, X,
    ChevronRight, ExternalLink, Calendar, Mail, Image, FileText,
    Check, Circle, Grip, Pencil, Save, Link2, AlertCircle, Globe,
    MessageSquare, User, Phone, Send, Archive, Star, Bookmark,
    FolderOpen, Download, Upload, Eye, EyeOff, Copy, Trash, Edit3,
    BarChart3, TrendingUp, Users, MousePointerClick
} from "lucide-react";
import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { AdminLoader } from "../AdminLoader";
import { motionVariants } from "@/styles/design-tokens";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getAnalyticsData } from "@/components/AnalyticsProvider";

interface Task {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
}

interface Note {
    id: string;
    content: string;
    updatedAt: Date;
}

interface AnalyticsData {
    totalPageViews: number;
    totalClicks: number;
    sectionPopularity: Record<string, number>;
    dailyViews: { date: string; views: number }[];
    totalEvents: number;
}

export const DashboardHome = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    // ANALYTICS STATE
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    // TASK MANAGER STATE
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('dashboard_tasks');
        return saved ? JSON.parse(saved) : [];
    });
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

    // QUICK NOTES STATE
    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem('dashboard_notes');
        return saved ? JSON.parse(saved) : [{ id: '1', content: '', updatedAt: new Date() }];
    });
    const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '1');

    // BOOKMARKS STATE
    const [bookmarks, setBookmarks] = useState<{ id: string; title: string; url: string; }[]>(() => {
        const saved = localStorage.getItem('dashboard_bookmarks');
        return saved ? JSON.parse(saved) : [
            { id: '1', title: 'Google Fonts', url: 'https://fonts.google.com' },
            { id: '2', title: 'Dribbble', url: 'https://dribbble.com' },
            { id: '3', title: 'Unsplash', url: 'https://unsplash.com' },
        ];
    });
    const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
    const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
    const [showAddBookmark, setShowAddBookmark] = useState(false);

    // SITE CONTENT STATS
    const [siteStats, setSiteStats] = useState({ projects: 0, skills: 0, milestones: 0, services: 0, certifications: 0 });

    // MESSAGES STATE
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);

    // Fetch analytics on mount
    useEffect(() => {
        setAnalytics(getAnalyticsData());
    }, []);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/messages');
                const data = await res.json();
                if (data.success) {
                    setMessages(data.data || []);
                }
            } catch (e) {
                console.error("Failed to fetch messages");
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMessages();
    }, []);

    // Save tasks to localStorage
    useEffect(() => {
        localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Save notes to localStorage
    useEffect(() => {
        localStorage.setItem('dashboard_notes', JSON.stringify(notes));
    }, [notes]);

    // Save bookmarks to localStorage
    useEffect(() => {
        localStorage.setItem('dashboard_bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Removed: Contact messages fetch - no messages API exists

    // Fetch site stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projects, skills, journey, services, certs] = await Promise.all([
                    fetch('/api/projects').then(r => r.json()),
                    fetch('/api/skills').then(r => r.json()),
                    fetch('/api/journey').then(r => r.json()),
                    fetch('/api/services').then(r => r.json()),
                    fetch('/api/certifications').then(r => r.json()),
                ]);
                setSiteStats({
                    projects: projects.data?.length || 0,
                    skills: skills.data?.length || 0,
                    milestones: journey.data?.length || 0,
                    services: services.data?.length || 0,
                    certifications: certs.data?.length || 0,
                });
            } catch (e) {
                console.error("Failed to fetch stats");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    // TASK FUNCTIONS
    const addTask = () => {
        if (!newTaskText.trim()) return;
        const newTask: Task = {
            id: Date.now().toString(),
            text: newTaskText.trim(),
            completed: false,
            priority: newTaskPriority,
            createdAt: new Date()
        };
        setTasks([newTask, ...tasks]);
        setNewTaskText('');
        toast.success('Task added!');
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
        toast.success('Task deleted');
    };

    // NOTE FUNCTIONS
    const updateNote = (id: string, content: string) => {
        setNotes(notes.map(n => n.id === id ? { ...n, content, updatedAt: new Date() } : n));
    };

    const addNote = () => {
        const newNote: Note = { id: Date.now().toString(), content: '', updatedAt: new Date() };
        setNotes([...notes, newNote]);
        setActiveNoteId(newNote.id);
    };

    const deleteNote = (id: string) => {
        if (notes.length === 1) return;
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
        if (activeNoteId === id) setActiveNoteId(newNotes[0].id);
    };

    // BOOKMARK FUNCTIONS
    const addBookmark = () => {
        if (!newBookmarkTitle.trim() || !newBookmarkUrl.trim()) return;
        setBookmarks([...bookmarks, { id: Date.now().toString(), title: newBookmarkTitle, url: newBookmarkUrl }]);
        setNewBookmarkTitle('');
        setNewBookmarkUrl('');
        setShowAddBookmark(false);
        toast.success('Bookmark added!');
    };

    const deleteBookmark = (id: string) => {
        setBookmarks(bookmarks.filter(b => b.id !== id));
    };

    const priorityColors = {
        low: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        high: 'text-red-400 bg-red-500/10 border-red-500/30'
    };

    const activeNote = notes.find(n => n.id === activeNoteId);

    return isLoading ? <AdminLoader /> : (
        <motion.div variants={motionVariants.container} initial="hidden" animate="show" className="space-y-6 relative z-10 pb-10">

            {/* BACKGROUND */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-[-2]" />

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-bold text-white">Workspace</h1>
                    <p className="text-sm text-gray-400">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {currentTime.toLocaleTimeString()}</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/" target="_blank">
                        <NeonButton variant="ghost" className="gap-2">
                            <Globe size={16} /> View Live Site
                            <ExternalLink size={12} />
                        </NeonButton>
                    </Link>
                </div>
            </header>

            {/* CONTENT STATS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                    { label: 'Projects', value: siteStats.projects, icon: Briefcase, path: '/admin/projects', color: 'purple' },
                    { label: 'Skills', value: siteStats.skills, icon: Zap, path: '/admin/skills', color: 'cyan' },
                    { label: 'Journey', value: siteStats.milestones, icon: Calendar, path: '/admin/journey', color: 'orange' },
                    { label: 'Services', value: siteStats.services, icon: Server, path: '/admin/services', color: 'emerald' },
                    { label: 'Certificates', value: siteStats.certifications, icon: FileText, path: '/admin/certifications', color: 'pink' },
                ].map((item, i) => (
                    <Link key={i} to={item.path}>
                        <GlassPanel className="p-4 hover:bg-white/10 transition-all group cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <item.icon size={18} className={`text-${item.color}-400`} />
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{item.value}</h3>
                            <p className="text-xs text-gray-400">{item.label}</p>
                        </GlassPanel>
                    </Link>
                ))}
            </div>

            {/* ANALYTICS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <GlassPanel className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                            <Eye size={18} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{analytics?.totalPageViews || 0}</h3>
                            <p className="text-xs text-gray-400">Page Views</p>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/20">
                            <MousePointerClick size={18} className="text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{analytics?.totalClicks || 0}</h3>
                            <p className="text-xs text-gray-400">Clicks</p>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20">
                            <MessageSquare size={18} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{messages.length}</h3>
                            <p className="text-xs text-gray-400">Messages</p>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4 bg-gradient-to-br from-orange-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                            <BarChart3 size={18} className="text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{analytics?.totalEvents || 0}</h3>
                            <p className="text-xs text-gray-400">Events</p>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: TASK MANAGER */}
                <GlassPanel className="p-6 lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-emerald-400" />
                            Tasks
                        </h3>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">
                            {tasks.filter(t => !t.completed).length} pending
                        </span>
                    </div>

                    {/* Add Task */}
                    <div className="flex gap-2 mb-4">
                        <input
                            value={newTaskText}
                            onChange={e => setNewTaskText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTask()}
                            placeholder="Add a task..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                        />
                        <select
                            value={newTaskPriority}
                            onChange={e => setNewTaskPriority(e.target.value as any)}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 text-xs text-gray-400 focus:outline-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Med</option>
                            <option value="high">High</option>
                        </select>
                        <button onClick={addTask} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Task List */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {tasks.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
                        ) : (
                            tasks.map(task => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${task.completed ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 hover:border-emerald-400'}`}>
                                        {task.completed && <Check size={12} className="text-white" />}
                                    </button>
                                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>{task.text}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                    <button onClick={() => deleteTask(task.id)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </GlassPanel>

                {/* MIDDLE: QUICK NOTES */}
                <GlassPanel className="p-6 lg:col-span-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Pencil size={20} className="text-yellow-400" />
                            Quick Notes
                        </h3>
                        <button onClick={addNote} className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Note Tabs */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {notes.map((note, i) => (
                            <button
                                key={note.id}
                                onClick={() => setActiveNoteId(note.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeNoteId === note.id ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                Note {i + 1}
                                {notes.length > 1 && (
                                    <span onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="hover:text-red-400">
                                        <X size={12} />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Note Editor */}
                    <textarea
                        value={activeNote?.content || ''}
                        onChange={e => updateNote(activeNoteId, e.target.value)}
                        placeholder="Start typing your notes..."
                        className="flex-1 min-h-[300px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500/50 resize-none"
                    />
                    <p className="text-[10px] text-gray-500 mt-2">Auto-saved to browser storage</p>
                </GlassPanel>

                {/* RIGHT: CONTACT MESSAGES + BOOKMARKS */}
                <div className="space-y-6">
                    {/* CONTACT MESSAGES */}
                    <GlassPanel className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquare size={20} className="text-blue-400" />
                                Messages
                            </h3>
                            <Link to="/admin/settings" className="text-xs text-gray-400 hover:text-white transition-colors">View all</Link>
                        </div>

                        {loadingMessages ? (
                            <div className="text-center py-8 text-gray-500">Loading...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Mail size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No messages yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                {messages.map(msg => (
                                    <div key={msg._id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-white">{msg.name}</span>
                                            <span className="text-[10px] text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-2">{msg.message}</p>
                                        <p className="text-[10px] text-blue-400 mt-2">{msg.email}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassPanel>

                    {/* BOOKMARKS */}
                    <GlassPanel className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Bookmark size={20} className="text-purple-400" />
                                Quick Links
                            </h3>
                            <button onClick={() => setShowAddBookmark(!showAddBookmark)} className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>

                        <AnimatePresence>
                            {showAddBookmark && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                                    <div className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/10">
                                        <input
                                            value={newBookmarkTitle}
                                            onChange={e => setNewBookmarkTitle(e.target.value)}
                                            placeholder="Title"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                                        />
                                        <input
                                            value={newBookmarkUrl}
                                            onChange={e => setNewBookmarkUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                                        />
                                        <button onClick={addBookmark} className="w-full py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                                            Add Bookmark
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            {bookmarks.map(bookmark => (
                                <div key={bookmark.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 flex-1">
                                        <Link2 size={14} className="text-purple-400" />
                                        <span className="text-sm text-white group-hover:text-purple-400 transition-colors">{bookmark.title}</span>
                                    </a>
                                    <button onClick={() => deleteBookmark(bookmark.id)} className="p-1 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>

                    {/* QUICK ACTIONS */}
                    <GlassPanel className="p-6 bg-gradient-to-br from-cyan-950/20 to-blue-950/20">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="text-cyan-400" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/projects">
                                <button className="w-full p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex flex-col items-center gap-2 group">
                                    <Briefcase size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-300">New Project</span>
                                </button>
                            </Link>
                            <Link to="/admin/skills">
                                <button className="w-full p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex flex-col items-center gap-2 group">
                                    <Zap size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-300">Add Skill</span>
                                </button>
                            </Link>
                            <Link to="/admin/about">
                                <button className="w-full p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all flex flex-col items-center gap-2 group">
                                    <User size={20} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-300">Edit Bio</span>
                                </button>
                            </Link>
                            <Link to="/admin/hero">
                                <button className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex flex-col items-center gap-2 group">
                                    <Edit3 size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-300">Edit Hero</span>
                                </button>
                            </Link>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </motion.div>
    );
};
