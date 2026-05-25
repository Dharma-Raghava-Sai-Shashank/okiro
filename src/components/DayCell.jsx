import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import TaskChip from './TaskChip'
import { keyForDay, isToday } from '../lib/dates'
import { format, isSameMonth, isWeekend } from 'date-fns'

export default function DayCell({
  date,
  tasks,
  onOpen,
  onCycleColor,
  onClickCell,
  size = 'md',
  monthAnchor,
}) {
  const dayKey = keyForDay(date)
  const today = isToday(date)
  const inMonth = monthAnchor ? isSameMonth(date, monthAnchor) : true
  const weekend = isWeekend(date)

  const { isOver, setNodeRef } = useDroppable({
    id: `drop:day:${dayKey}`,
    data: { type: 'day', bucketKey: dayKey },
  })

  const dayTasks = tasks
    .filter((t) => t.scope === 'day' && t.bucketKey === dayKey)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const total = dayTasks.length
  const done = dayTasks.filter((t) => t.done).length

  const sizing = {
    sm: 'min-h-[5rem] p-1.5',
    md: 'min-h-[7rem] p-2.5',
    lg: 'min-h-[10rem] p-3',
    xl: 'min-h-[16rem] p-4',
  }[size]

  const baseBg = size === 'xl'
    ? 'rgba(255, 255, 255, 0.97)'
    : today
    ? 'linear-gradient(170deg, rgba(255, 255, 255, 0.96) 0%, rgba(229, 241, 255, 0.92) 50%, rgba(219, 234, 255, 0.88) 100%)'
    : weekend
    ? 'linear-gradient(170deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.90) 50%, rgba(245, 247, 250, 0.88) 100%)'
    : 'linear-gradient(170deg, rgba(255, 255, 255, 0.96) 0%, rgba(250, 252, 255, 0.93) 50%, rgba(255, 255, 255, 0.90) 100%)'

  const dimmed = !inMonth ? 'opacity-40' : ''

  return (
    <motion.div
      ref={setNodeRef}
      onClick={(e) => {
        if (e.defaultPrevented) return
        onClickCell?.(date)
      }}
      className={`group relative flex flex-col rounded-2xl border cursor-pointer transition-all overflow-hidden ${sizing} ${dimmed} ${
        today
          ? 'today-ring border-blue-300/60'
          : 'border-white/60 hover:border-white/80'
      } ${isOver ? 'ring-4 ring-blue-300/70' : ''}`}
      style={{
        background: baseBg,
        boxShadow: today
          ? '0 8px 24px -12px rgba(59, 130, 246, 0.28), 0 2px 6px -2px rgba(96, 165, 250, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(15, 23, 42, 0.06)'
          : '0 6px 22px -12px rgba(30, 64, 175, 0.22), 0 2px 6px -2px rgba(96, 165, 250, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(15, 23, 42, 0.05)',
      }}
      whileHover={{
        y: -3,
        scale: 1.015,
        boxShadow: today
          ? '0 14px 38px -10px rgba(59, 130, 246, 0.36), 0 4px 10px -2px rgba(96, 165, 250, 0.24), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(15, 23, 42, 0.06)'
          : '0 14px 36px -10px rgba(30, 64, 175, 0.32), 0 4px 10px -2px rgba(96, 165, 250, 0.22), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(15, 23, 42, 0.06)',
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <div className="flex items-start justify-between mb-2 relative z-[1]">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-lg font-bold tracking-tight leading-none ${
              today
                ? 'text-blue-700'
                : weekend
                ? 'text-slate-500'
                : 'text-slate-800'
            }`}
            style={
              today
                ? { textShadow: '0 1px 2px rgba(59, 130, 246, 0.18)' }
                : undefined
            }
          >
            {format(date, 'd')}
          </span>
          <span
            className={`text-[9px] uppercase font-bold leading-none ${
              today ? 'text-blue-500' : 'text-slate-400'
            }`}
            style={{ letterSpacing: '0.16em' }}
          >
            {format(date, 'EEE')}
          </span>
        </div>
        {today && (
          <motion.span
            className="text-[8.5px] font-bold uppercase px-2 py-[3px] rounded-full text-white"
            style={{
              background:
                'linear-gradient(135deg, #60a5fa 0%, #3b82f6 60%, #2563eb 100%)',
              letterSpacing: '0.14em',
              boxShadow:
                '0 4px 12px -2px rgba(59, 130, 246, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            Today
          </motion.span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1 min-h-0 overflow-y-auto pr-0.5 relative z-[1]">
        {dayTasks.length === 0 && size !== 'sm' && (
          <div className="flex-1 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide italic">
              drop a task
            </span>
          </div>
        )}
        {dayTasks.map((t) => (
          <TaskChip
            key={t._id}
            task={t}
            size={size === 'xl' ? 'sm' : 'xs'}
            showProgress={false}
            onOpen={onOpen}
            onCycleColor={onCycleColor}
            fromBucketKey={dayKey}
          />
        ))}
      </div>

      {total > 0 && (
        <div className="mt-2 flex items-center gap-1.5 relative z-[1]">
          <div
            className="flex-1 h-1 rounded-full overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.08)',
              boxShadow: 'inset 0 1px 1.5px rgba(15, 23, 42, 0.06)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  done === total
                    ? 'linear-gradient(90deg, #34d399 0%, #10b981 100%)'
                    : 'linear-gradient(90deg, #93c5fd 0%, #3b82f6 60%, #1d4ed8 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(done / total) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span
            className="text-[9.5px] font-bold tracking-tight tabular-nums"
            style={{
              color:
                done === total
                  ? 'rgb(5, 150, 105)'
                  : 'rgba(15, 23, 42, 0.55)',
            }}
          >
            {done}/{total}
          </span>
        </div>
      )}

      {/* Hover sheen — subtle gradient sweep across the card */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            'linear-gradient(125deg, transparent 35%, rgba(255, 255, 255, 0.18) 50%, transparent 65%)',
        }}
      />
    </motion.div>
  )
}
