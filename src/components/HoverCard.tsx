import { motion } from 'framer-motion';
import { useState } from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  hoverContent: React.ReactNode;
  className?: string;
}

export const HoverCard = ({
  children,
  hoverContent,
  className = '',
}: HoverCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-secondary/90 border border-primary/30 text-xs whitespace-nowrap z-50 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {hoverContent}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary/90 border-r border-b border-primary/30 rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
};
