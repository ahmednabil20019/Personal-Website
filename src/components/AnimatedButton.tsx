import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'outline' | 'hero' | 'glass';
type ButtonSize = 'default' | 'sm' | 'lg' | 'xl';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  asChild?: boolean;
}

export const AnimatedButton = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  asChild = false,
}: AnimatedButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick?.();
    setTimeout(() => setIsClicked(false), 600);
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className="relative"
    >
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled}
        className={`relative overflow-hidden ${className}`}
        asChild={asChild}
      >
        {/* Ripple effect */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-md"
            initial={{ scale: 0 }}
            animate={{ scale: 4 }}
            transition={{ duration: 0.6 }}
            style={{ pointerEvents: 'none' }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
};
