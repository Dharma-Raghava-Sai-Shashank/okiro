export default function ProgressBar({ value, manual, onChange }) {
  const v = Math.max(0, Math.min(100, value || 0))
  if (manual) {
    return (
      <div className="flex items-center gap-3 flex-1">
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="flex-1 accent-violet-500"
        />
        <span className="text-xs font-medium text-slate-600 min-w-[2.5rem] text-right">
          {v}%
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-2 rounded-full bg-white/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-pink-400 transition-all"
          style={{ width: `${v}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 min-w-[2.5rem] text-right">
        {v}%
      </span>
    </div>
  )
}
