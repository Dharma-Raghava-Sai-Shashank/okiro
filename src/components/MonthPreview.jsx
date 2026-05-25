import { motion } from 'framer-motion'
import { format, isSameMonth, startOfMonth } from 'date-fns'
import { keyForMonth } from '../lib/dates'
import { deepFor } from '../lib/colors'

export default function MonthPreview({ monthDate, tasks, onClick }) {
  const monthKey = keyForMonth(monthDate)
  const monthStart = startOfMonth(monthDate)
  const isCurrent = isSameMonth(monthDate, new Date())

  const monthTasks = tasks.filter(
    (t) => t.scope === 'day' && (t.bucketKey || '').startsWith(monthKey),
  )
  const total = monthTasks.length
  const done = monthTasks.filter((t) => t.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const dots = monthTasks.slice(0, 8)

  return (
    <motion.button
      type="button"
      onClick={() => onClick(monthStart)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`text-left rounded-3xl border p-5 min-h-[10rem] flex flex-col gap-3 transition relative overflow-hidden ${
        isCurrent ? 'border-blue-300/70' : 'border-white/70'
      }`}
      style={{
        background: isCurrent
          ? 'linear-gradient(170deg, rgba(255, 255, 255, 0.92) 0%, rgba(219, 234, 254, 0.72) 50%, rgba(191, 219, 254, 0.58) 100%)'
          : 'linear-gradient(170deg, rgba(255, 255, 255, 0.88) 0%, rgba(248, 250, 252, 0.68) 50%, rgba(255, 255, 255, 0.52) 100%)',
        boxShadow: isCurrent
          ? '0 14px 36px -12px rgba(59, 130, 246, 0.32), 0 4px 10px -2px rgba(96, 165, 250, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(15, 23, 42, 0.05)'
          : '0 10px 30px -12px rgba(30, 64, 175, 0.22), 0 3px 8px -2px rgba(96, 165, 250, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(15, 23, 42, 0.05)',
      }}
    >
      {isCurrent && (
        <span
          className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-md"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
            boxShadow:
              '0 4px 10px -2px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
          }}
        >
          Now
        </span>
      )}

      <div>
        <div
          className={`text-xl font-bold tracking-tight ${
            isCurrent ? 'text-blue-800' : 'text-slate-900'
          }`}
        >
          {format(monthDate, 'MMMM')}
        </div>
        <div className="text-[11px] text-slate-500 font-medium tracking-wide">
          {format(monthDate, 'yyyy')}
          {total > 0 && (
            <span className="ml-2 text-slate-400">
              · {done}/{total} {total === 1 ? 'task' : 'tasks'}
            </span>
          )}
        </div>
      </div>

      <div className="h-2 rounded-full bg-white/50 overflow-hidden shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, #93c5fd 0%, #3b82f6 60%, #1d4ed8 100%)',
            boxShadow: '0 0 12px rgba(96, 165, 250, 0.5)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="flex flex-wrap gap-1 mt-auto min-h-[1rem]">
        {dots.map((t) => (
          <span
            key={t._id}
            className="size-2.5 rounded-full border border-white/80 shadow-sm"
            style={{
              background: deepFor(t.color),
              boxShadow: `0 2px 6px -1px ${deepFor(t.color)}55, inset 0 1px 0 rgba(255,255,255,0.5)`,
            }}
            title={t.title}
          />
        ))}
        {total > dots.length && (
          <span className="text-[10px] text-slate-500 ml-1 font-medium">
            +{total - dots.length}
          </span>
        )}
      </div>
    </motion.button>
  )
}
