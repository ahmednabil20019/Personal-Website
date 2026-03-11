import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Zap, Users, Calendar, Smartphone, Monitor, Cpu, Code, Terminal, Film, ChevronDown, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbnailCarousel, CarouselItem } from "@/components/ui/thumbnail-carousel";
import { LiquidEffectAnimation } from "@/components/ui/liquid-effect-animation";
import { useModal } from "@/context/ModalContext";

interface Project {
  _id: string;
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

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Context Integration
  const { activeProjectId, closeProject, openProject } = useModal();
  const activeProject = useMemo(() =>
    projects.find(p => p._id === activeProjectId) || null
    , [projects, activeProjectId]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setProjects(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeProject]);



  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Smooth scroll to top of grid when page changes
  useEffect(() => {
    if (currentPage !== 1) {
      document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Get unique categories
  const categories = ["all", ...new Set(projects.map(p => p.category))];

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="text-orange-500 font-mono animate-pulse flex flex-col items-center">
          <Activity className="w-12 h-12 mb-4 animate-spin" />
          <span>INITIALIZING_SYSTEMS...</span>
        </div>
      </div>
    );
  }

  return (
    <section id="projects" className="relative min-h-screen py-20 bg-background overflow-hidden selection:bg-orange-500/30">

      {/* Liquid Effect Background */}
      <LiquidEffectAnimation className="opacity-20" />

      {/* Background Grid & Circuit Patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

        {/* Scanning Radar Line */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent h-[50%]"
          animate={{ top: ["-50%", "150%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header - HUD Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-l-4 border-orange-500 pl-6 relative"
        >
          <div className="absolute -left-1 top-0 w-2 h-2 bg-orange-500 rounded-sm" />
          <div className="absolute -left-1 bottom-0 w-2 h-2 bg-orange-500 rounded-sm" />

          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-2 uppercase tracking-tighter">
            <span className="text-orange-500">System</span>.Projects
          </h2>
          <div className="flex items-center gap-4 text-orange-500/60 font-mono text-sm">
            <span>// EXECUTE_SHOWCASE_MODULE</span>
            <span className="h-px flex-grow bg-orange-900/50" />
            <span>v2.0.4</span>
          </div>
        </motion.div>

        {/* Filters - Console Input Style */}
        <div className="flex flex-col gap-4 mb-8 md:mb-12 font-mono">
          {/* Mobile: Search on top */}
          <div className="md:hidden relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Terminal className="h-4 w-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/10 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-muted-foreground rounded"
            />
          </div>

          {/* Mobile: Categories scroll */}
          <div className="md:hidden w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-max">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 text-xs transition-all uppercase whitespace-nowrap rounded ${selectedCategory === cat
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    : "bg-secondary/20 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Unified Control Bar */}
          <div className="hidden md:flex items-center justify-between gap-4 bg-secondary/10 border border-white/10 rounded-lg p-2">
            {/* Categories */}
            <div className="flex items-center gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm transition-all uppercase rounded-md ${selectedCategory === cat
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/10" />

            {/* Search */}
            <div className="relative w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal className="h-4 w-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/10 pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-muted-foreground rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Anchor for scroll */}
        <div id="projects-grid" className="scroll-mt-32" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + selectedCategory + searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* MOBILE 2-COL GRID (Matching Certifications Style) */}
            <div className="md:hidden grid grid-cols-2 gap-3 pb-8">
              {currentProjects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  onClick={() => openProject(project._id)}
                  className="relative aspect-[4/3] cursor-pointer group rounded-xl overflow-hidden border border-white/10 bg-gray-900/50 active:scale-[0.98] transition-transform"
                >
                  {/* Image */}
                  {project.images?.[0] ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center text-orange-500/50">
                      <Cpu size={32} />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded text-[9px] text-orange-300 font-medium uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${project.status === "Active" || !project.status ? "bg-green-400" : "bg-gray-400"}`} />
                    <span className="text-[10px] text-gray-300">{project.status || "Active"}</span>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-[13px] font-semibold text-white leading-tight line-clamp-2">
                      {project.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Projects Grid (DESKTOP) */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => openProject(project._id)}
                  className="group relative cursor-pointer"
                >
                  {/* Card Container - "Sci-Fi Panel" */}
                  <div className="relative h-[450px] bg-secondary/5 border border-white/5 hover:border-orange-500/50 transition-all duration-300 overflow-hidden backdrop-blur-sm">

                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/10 group-hover:border-orange-500 transition-colors z-20" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 group-hover:border-orange-500 transition-colors z-20" />

                    {/* Image Area with "Scanner" Effect */}
                    <div className="h-[220px] w-full relative overflow-hidden bg-black/50">
                      {project.images?.[0] ? (
                        <>
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0 transition-all duration-500"
                          />
                          {/* Scanning Line Animation */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent h-[100%] w-full -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/20 font-mono">
                          <Cpu className="w-12 h-12 mb-2" />
                          NO_SIGNAL
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur border border-orange-500/30 px-2 py-1 text-[10px] font-mono text-orange-400">
                        STATUS: {project.status?.toUpperCase() || 'UNKNOWN'}
                      </div>
                    </div>

                    {/* Data Readout Area */}
                    <div className="p-6 relative flex flex-col h-[230px]">
                      {/* Technical Decor Lines */}
                      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-900 to-transparent" />

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-mono text-orange-600">ID_REF: {project._id.slice(0, 6)}</span>
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-muted-foreground">{project.category}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-orange-400 transition-colors truncate">
                        {project.title}
                      </h3>

                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 font-mono leading-relaxed">
                        {'>'} {project.description}
                      </p>

                      {/* Tech Stack Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
                        {project.technologies.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] uppercase font-bold px-2 py-1 bg-orange-900/10 text-orange-600 border border-orange-900/20">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* View Details Prompt */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between group-hover:text-orange-400 transition-colors mt-auto">
                        <span className="text-xs font-mono">VIEW_DETAILS</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Hover Action Strip */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Modern WebGL/HUD Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-20">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative flex items-center gap-2 bg-black/80 backdrop-blur-xl p-2 rounded-xl border border-white/10 ring-1 ring-white/5">

                {/* Prev Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Page Indicators */}
                <div className="flex items-center gap-1 font-mono text-sm px-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrent = currentPage === pageNum;

                    // Show ellipsis for many pages - simple logic: show 1, current, last, and neighbors
                    if (totalPages > 7) {
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        // show button
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={i} className="text-muted-foreground/30 px-1">..</span>;
                      } else {
                        return null;
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`
                            relative w-10 h-10 rounded-lg font-bold transition-all duration-300 flex items-center justify-center
                            ${isCurrent
                            ? "text-orange-500 bg-orange-500/10 border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                            : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                          }
                            `}
                      >
                        {/* Number */}
                        <span className="relative z-10">{pageNum.toString().padStart(2, '0')}</span>

                        {/* Active Indicator Bars */}
                        {isCurrent && (
                          <>
                            <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-orange-500 rounded-tr-sm" />
                            <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-orange-500 rounded-bl-sm" />
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Detailed Modal - "System Log" Style */}
      <Dialog open={!!activeProject} onOpenChange={(open) => !open && closeProject()}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-background border-2 border-orange-500/20 p-0 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(6,182,212,0.1)]">
          <VisuallyHidden>
            <DialogTitle>Project Details</DialogTitle>
          </VisuallyHidden>
          {activeProject && (
            <>
              {/* Left Side: Visuals with ImageSwiper */}
              <div className="w-full md:w-2/3 md:h-full relative bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/10 flex flex-col md:overflow-y-auto shrink-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* ─── Unified Carousel ─── */}
                <div className="w-full h-full flex flex-col justify-center p-4">
                  {(() => {
                    // Prepare Carousel Items
                    const isVideoUrl = (url: string) => /\.(mp4|webm|mov|avi|mkv)/i.test(url) || url.includes('/video/');
                    const videosFromField = activeProject.videos || [];
                    const videosFromImages = (activeProject.images || []).filter(isVideoUrl);
                    const allVideos = [...new Set([...videosFromField, ...videosFromImages])];
                    const pureImages = (activeProject.images || []).filter((url: string) => !isVideoUrl(url));

                    // Helper to get video name
                    const getVideoName = (url: string, idx: number) => {
                      try {
                        const parts = url.split('/');
                        const raw = parts[parts.length - 1].split('?')[0];
                        const decoded = decodeURIComponent(raw);
                        return decoded.length > 30 ? decoded.slice(0, 27) + '...' : decoded;
                      } catch {
                        return `Video ${idx + 1}`;
                      }
                    };

                    const carouselItems: CarouselItem[] = [
                      ...allVideos.map((url, i): CarouselItem => ({
                        id: `video-${i}`,
                        url,
                        type: 'video',
                        title: getVideoName(url, i)
                      })),
                      ...pureImages.map((url, i): CarouselItem => ({
                        id: `image-${i}`,
                        url,
                        type: 'image',
                        title: `${activeProject.title} ${i + 1}`
                      }))
                    ];

                    // Fallback for no media
                    if (carouselItems.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/50 border border-dashed border-white/10 rounded-xl">
                          <Film className="w-12 h-12 mb-2 opacity-20" />
                          <span className="font-mono text-xs">NO_MEDIA_FOUND</span>
                        </div>
                      )
                    }

                    return <ThumbnailCarousel items={carouselItems} />;
                  })()}
                </div>
              </div>

              {/* Right Side: Data Log */}
              <div className="w-full md:w-1/3 md:h-full bg-background flex flex-col shrink-0">
                <ScrollArea className="flex-1 p-6 md:p-8">
                  <div className="border-l-2 border-orange-500 pl-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase leading-tight">{activeProject.title}</h2>
                    <p className="text-orange-500/60 font-mono text-xs">PROJECT_KEY: {activeProject._id}</p>
                  </div>

                  <div className="space-y-6 font-mono text-xs md:text-sm">
                    <div className="p-4 bg-secondary/10 border border-white/5">
                      <span className="text-muted-foreground block mb-2 text-xs">// SYSTEM_DESCRIPTION</span>
                      <p className="text-foreground/80 leading-relaxed">
                        {activeProject.longDescription || activeProject.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-orange-500 block mb-3 border-b border-orange-500/30 pb-1 text-xs">// SPECIFICATIONS</span>
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="block text-foreground/60">ARCHITECTS</span>
                          {activeProject.team || 'Solo Engineer'}
                        </div>
                        <div>
                          <span className="block text-foreground/60">DEPLOY_DATE</span>
                          {activeProject.date || '2024.Q3'}
                        </div>
                        <div>
                          <span className="block text-foreground/60">SECTOR</span>
                          {activeProject.category}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-orange-500 block mb-3 border-b border-orange-500/30 pb-1 text-xs">// TECH_STACK</span>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.technologies.map(t => (
                          <span key={t} className="px-2 py-1 bg-orange-900/10 border border-orange-500/20 text-orange-600 text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {activeProject.features && (
                      <div>
                        <span className="text-orange-500 block mb-3 border-b border-orange-500/30 pb-1 text-xs">// CORE_MODULES</span>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {activeProject.features.map(f => (
                            <li key={f} className="flex gap-2">
                              <span className="text-orange-500">{'>'}</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 flex gap-4">
                  {activeProject.liveUrl && (
                    <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-mono rounded-sm border-none">
                      <a href={activeProject.liveUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" /> INITIATE
                      </a>
                    </Button>
                  )}
                  {activeProject.githubUrl && (
                    <Button asChild variant="outline" className="flex-1 border-white/20 text-foreground font-mono rounded-sm hover:bg-white/5">
                      <a href={activeProject.githubUrl} target="_blank">
                        <Code className="w-4 h-4 mr-2" /> SOURCE
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
