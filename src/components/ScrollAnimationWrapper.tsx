import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScrollAnimationWrapper = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
}: ScrollAnimationWrapperProps) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
