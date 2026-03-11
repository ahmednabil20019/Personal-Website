import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';

interface ProjectCardAdvancedProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  onViewDetails?: () => void;
}

export const ProjectCardAdvanced = ({
  title,
  description,
  image,
  technologies,
  liveUrl,
  githubUrl,
  featured = false,
  onViewDetails,
}: ProjectCardAdvancedProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    onViewDetails?.();
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/20 backdrop-blur-md border border-primary/10 cursor-pointer group h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
        borderColor: 'rgba(139, 92, 246, 0.5)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={image || '/api/placeholder/400/250'}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Featured Badge */}
        {featured && (
          <motion.div
            className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Featured
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tech Stack */}
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
              +{technologies.length - 3}
            </span>
          )}
        </motion.div>

        {/* Links */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {/* View Details Button */}
          {onViewDetails && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-center text-xs font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-3 h-3" />
              View Details
            </motion.button>
          )}

          {/* External Links */}
          <div className="flex gap-3">
            {liveUrl && (
              <motion.a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 px-3 py-2 rounded-lg bg-primary/20 text-primary text-center text-xs font-medium hover:bg-primary/30 transition-all flex items-center justify-center gap-2 border border-primary/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-3 h-3" />
                Live
              </motion.a>
            )}
            {githubUrl && (
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 px-3 py-2 rounded-lg border border-primary/50 text-primary text-center text-xs font-medium hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-3 h-3" />
                Code
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
