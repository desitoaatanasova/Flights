import { motion } from 'framer-motion';

export default function GlassCard({ children, hover = true, onClick, className = '' }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      onClick={onClick}
      className={`bg-white/5 border border-white/10 hover:border-sky-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
