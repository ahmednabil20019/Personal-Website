import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface StaggeredListProps {
  items: React.ReactNode[];
  staggerDelay?: number;
  containerDelay?: number;
}

export const StaggeredList = ({
  items,
  staggerDelay = 0.1,
  containerDelay = 0.3,
}: StaggeredListProps) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: containerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {items.map((item, i) => (
        <motion.div key={i} variants={itemVariants}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
};
