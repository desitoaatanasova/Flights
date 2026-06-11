import { ChevronUp, ChevronDown } from 'lucide-react';

export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto border border-white/10 rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-white/50 text-left">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium cursor-pointer hover:text-white" onClick={col.onSort}>
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sorted && (col.sorted === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </span>
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-t border-white/5 hover:bg-white/5 transition">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-white/70">{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-sky-500/20 text-sky-400 transition text-xs font-medium">Edit</button>
                  <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition text-xs font-medium">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
