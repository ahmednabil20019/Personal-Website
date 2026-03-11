import { motion } from 'framer-motion';

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
  skills?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline = ({ items }: TimelineProps) => {
  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Content */}
            <div className="w-1/2 px-8">
              <motion.div
                className="bg-secondary/40 backdrop-blur-md rounded-lg p-6 border border-primary/10 hover:border-primary/30 transition-colors"
                whileHover={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}
              >
                <div className="text-sm font-bold text-primary mb-2">{item.year}</div>
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{item.company}</p>
                <p className="text-sm mb-4">{item.description}</p>
                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Center dot */}
            <div className="w-0 flex justify-center">
              <motion.div
                className="w-4 h-4 rounded-full bg-primary border-4 border-background"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Empty space */}
            <div className="w-1/2" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
