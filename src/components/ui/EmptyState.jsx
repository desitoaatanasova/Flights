import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {Icon && (
        <div className="p-4 rounded-full bg-white/5 mb-4">
          <Icon className="w-10 h-10 text-white/30" />
        </div>
      )}
      <h3 className="font-display font-semibold text-xl text-white mb-2">{title}</h3>
      {description && <p className="text-white/40 max-w-md mb-6">{description}</p>}
      {action}
    </motion.div>
  );
}
