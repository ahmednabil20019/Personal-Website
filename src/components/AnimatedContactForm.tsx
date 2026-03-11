import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export const AnimatedContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
    setFormData({ email: '', subject: '', message: '' });

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {isSubmitted ? (
        <motion.div
          className="flex flex-col items-center justify-center gap-4 py-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500" />
          <p className="text-xl font-bold">Message Sent!</p>
          <p className="text-muted-foreground">I'll get back to you soon.</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-primary/20 focus:border-primary/50 focus:outline-none transition-colors"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-primary/20 focus:border-primary/50 focus:outline-none transition-colors"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-primary/20 focus:border-primary/50 focus:outline-none transition-colors resize-none"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                ⏳
              </motion.div>
            ) : (
              <>
                <Mail className="w-5 h-5 inline mr-2" />
                Send Message
              </>
            )}
          </motion.button>
        </>
      )}
    </motion.form>
  );
};
