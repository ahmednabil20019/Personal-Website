import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Globe, Layers, Code, Cpu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { ThumbnailCarousel, CarouselItem } from "@/components/ui/thumbnail-carousel";

interface ProjectDetailsModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {

  // Lock body scroll when modal is open

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Reset active video when modal closes


  if (!project) return null;

  // Detect videos — from `videos[]` field and also from `images[]` (legacy fallback)
  const isVideoUrl = (url: string) => /\.(mp4|webm|mov|avi|mkv)/i.test(url) || url.includes('/video/');
  const videosFromField = project.videos || [];
  const videosFromImages = (project.images || []).filter((url: string) => isVideoUrl(url));
  const allVideos: string[] = [...new Set([...videosFromField, ...videosFromImages])];
  const pureImages: string[] = (project.images || []).filter((url: string) => !isVideoUrl(url));

  // Extract filename from URL
  const getVideoName = (url: string, idx: number) => {
    try {
      const parts = url.split('/');
      const raw = parts[parts.length - 1].split('?')[0];
      const decoded = decodeURIComponent(raw);
      // Limit length
      return decoded.length > 30 ? decoded.slice(0, 27) + '...' : decoded;
    } catch {
      return `Video ${idx + 1}`;
    }
  };

  const carouselItems: CarouselItem[] = [
    // Videos first
    ...allVideos.map((url, i): CarouselItem => ({
      id: `video-${i}`,
      url: url as string,
      type: 'video',
      title: getVideoName(url as string, i)
    })),
    // Then images
    ...pureImages.map((url, i): CarouselItem => ({
      id: `image-${i}`,
      url: url as string,
      type: 'image',
      title: project.title
    }))
  ];

  // Fallback if no images found in array but project.image exists
  if (carouselItems.length === 0 && project.image) {
    carouselItems.push({
      id: 'main-image',
      url: project.image,
      type: 'image',
      title: project.title
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-none h-[90vh] p-0 bg-background/95 backdrop-blur-2xl border-white/20 overflow-hidden shadow-2xl">
        <ScrollArea className="h-full w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="relative bg-black/50 flex flex-col p-4 md:p-8 gap-4 justify-center items-center backdrop-blur-sm">
              <ThumbnailCarousel items={carouselItems} />
            </div>

            {/* Details Side */}
            <div className="h-full flex flex-col">
              <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Project Details
                </h3>
              </div>

              <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h4 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" /> Description
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" /> Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Simulated "Behind the Code" Section */}
                  <div className="p-3 md:p-4 rounded-lg bg-secondary/20 border border-white/5 font-mono text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2 border-b border-white/5 pb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="ml-2">architecture.json</span>
                    </div>
                    <pre className="text-primary/80 overflow-x-auto">
                      {`{
  "architecture": "Microservices",
  "deployment": "Vercel Edge",
  "database": "PostgreSQL",
  "status": "Production Ready"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog >
  );
};
