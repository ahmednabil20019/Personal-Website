import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedSkillBarProps {
  name: string;
  level: number; // 0-100
  color?: string;
}

export const AnimatedSkillBar = ({ name, level, color = '#8b5cf6' }: AnimatedSkillBarProps) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{name}</span>
        <motion.span 
          className="text-xs text-muted-foreground font-bold"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="w-full h-2 bg-secondary/40 rounded-full overflow-hidden border border-primary/10">
        <motion.div
          className="h-full rounded-full transition-all duration-300"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  );
};
