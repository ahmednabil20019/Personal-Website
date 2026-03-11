import { motion } from 'framer-motion';
import { useState } from 'react';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

export const FlipCard = ({
  frontContent,
  backContent,
  className = '',
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`relative w-full h-64 cursor-pointer perspective ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-secondary/60 to-secondary/40 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-primary/10 shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {frontContent}
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-primary/30 shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {backContent}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
