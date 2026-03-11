import { motion } from 'framer-motion';

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const AnimatedBadge = ({
  children,
  variant = 'default',
  className = '',
}: AnimatedBadgeProps) => {
  const variants = {
    default: 'bg-secondary/40 text-foreground border-primary/20',
    primary: 'bg-primary/20 text-primary border-primary/50',
    secondary: 'bg-secondary/40 text-secondary-foreground border-secondary/50',
    accent: 'bg-accent/20 text-accent border-accent/50',
  };

  return (
    <motion.span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border transition-all ${variants[variant]} ${className}`}
      whileHover={{
        scale: 1.1,
        boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );
};
