const statusConfig = {
  active:    { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  scheduled: { bg: 'bg-sky-500/20',   text: 'text-sky-400',   dot: 'bg-sky-400' },
  landed:    { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
  delayed:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  cancelled: { bg: 'bg-red-500/20',    text: 'text-red-400',    dot: 'bg-red-400' },
};

export default function StatusBadge({ status = 'scheduled' }) {
  const cfg = statusConfig[status] || statusConfig.scheduled;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
