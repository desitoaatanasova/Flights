import { motion } from 'framer-motion';

const gradients = {
  sky:   'from-sky-500 to-blue-600',
  pink:  'from-pink-500 to-rose-600',
  purple:'from-purple-500 to-indigo-600',
  green: 'from-green-500 to-emerald-600',
  orange:'from-orange-500 to-red-500',
};

export default function StatsWidget({ icon: Icon, label, value, color = 'sky', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradients[color]} mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="font-display font-bold text-3xl text-white">{value}</div>
      <div className="text-white/40 text-sm mt-1">{label}</div>
    </motion.div>
  );
}
