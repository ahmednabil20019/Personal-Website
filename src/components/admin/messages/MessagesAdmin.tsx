import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { toast } from "sonner";
import {
    Mail, Trash2, CheckCircle, Circle, RefreshCw, Loader2,
    User, Clock, Search, Filter, MailOpen, Reply, Archive
} from "lucide-react";

interface Message {
    _id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    replied: boolean;
    createdAt: string;
}

export const MessagesAdmin = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            if (data.success) {
                setMessages(data.data || []);
            }
        } catch (err) {
            toast.error("Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            });
            setMessages(msgs => msgs.map(m => m._id === id ? { ...m, read: true } : m));
            toast.success("Marked as read");
        } catch (err) {
            toast.error("Failed to update");
        }
    };

    const markAsReplied = async (id: string) => {
        try {
            await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ replied: true, read: true })
            });
            setMessages(msgs => msgs.map(m => m._id === id ? { ...m, replied: true, read: true } : m));
            toast.success("Marked as replied");
        } catch (err) {
            toast.error("Failed to update");
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("Delete this message?")) return;
        try {
            await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            setMessages(msgs => msgs.filter(m => m._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
            toast.success("Message deleted");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const filteredMessages = messages
        .filter(m => {
            if (filter === "unread") return !m.read;
            if (filter === "read") return m.read;
            return true;
        })
        .filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.message.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const unreadCount = messages.filter(m => !m.read).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            {/* Messages List */}
            <GlassPanel className="xl:col-span-1 flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Mail size={18} className="text-cyan-400" />
                            Inbox
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </h3>
                        <button onClick={fetchMessages} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <RefreshCw size={16} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex gap-2">
                        {(["all", "unread", "read"] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === f
                                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                        : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            <Mail size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No messages</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredMessages.map(msg => (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        if (!msg.read) markAsRead(msg._id);
                                    }}
                                    className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${selectedMessage?._id === msg._id ? "bg-white/10" : ""
                                        } ${!msg.read ? "border-l-2 border-l-cyan-500" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {!msg.read && <Circle size={8} className="text-cyan-400 fill-cyan-400 shrink-0" />}
                                                <span className={`font-semibold truncate ${!msg.read ? "text-white" : "text-gray-300"}`}>
                                                    {msg.name}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                                            <p className={`text-sm mt-1 line-clamp-2 ${!msg.read ? "text-gray-300" : "text-gray-500"}`}>
                                                {msg.message}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] text-gray-600">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </p>
                                            {msg.replied && (
                                                <Reply size={12} className="text-emerald-400 ml-auto mt-1" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </GlassPanel>

            {/* Message Detail */}
            <GlassPanel className="xl:col-span-2 flex flex-col overflow-hidden h-full">
                {selectedMessage ? (
                    <>
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <User size={20} className="text-cyan-400" />
                                        {selectedMessage.name}
                                    </h2>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="text-sm text-cyan-400 hover:underline"
                                    >
                                        {selectedMessage.email}
                                    </a>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(selectedMessage.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {!selectedMessage.replied && (
                                        <NeonButton
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => markAsReplied(selectedMessage._id)}
                                        >
                                            <CheckCircle size={14} className="mr-1" />
                                            Mark Replied
                                        </NeonButton>
                                    )}
                                    <NeonButton
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Your message&body=Hi ${selectedMessage.name},`)}
                                    >
                                        <Reply size={14} className="mr-1" />
                                        Reply
                                    </NeonButton>
                                    <button
                                        onClick={() => deleteMessage(selectedMessage._id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.message}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <div>
                            <MailOpen size={60} className="mx-auto mb-4 text-gray-700" />
                            <p className="text-gray-500">Select a message to view</p>
                        </div>
                    </div>
                )}
            </GlassPanel>
        </div>
    );
};
