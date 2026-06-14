import { useDroppable, useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import TaskPreviewPortal from './TaskPreviewPortal'
import TaskChip from './TaskChip'
import { deepFor, midFor } from '../lib/colors'
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

  const [hoveredTask, setHoveredTask] = useState(null)
  const [anchorRect, setAnchorRect] = useState(null)
  const hoverTimeout = useRef(null)

  const handleMouseEnterCard = (e, task) => {
    const rect = e.currentTarget.getBoundingClientRect()
    hoverTimeout.current = setTimeout(() => {
      setAnchorRect(rect)
      setHoveredTask(task)
    }, 250)
  }

  const handleMouseLeaveCard = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setHoveredTask(null)
  }

  const dayTasks = tasks
    .filter((t) => t.scope === 'day' && t.bucketKey === dayKey)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const total = dayTasks.length
  const done = dayTasks.filter((t) => t.done).length

  // 'md' size uses the glassy cards for the month view.
  const useGlassCards = size === 'md'

  const sizing = {
    sm: 'min-h-[5rem] p-1.5',
    md: 'aspect-square p-2', // Keep the neat square for month view
    week: 'min-h-[6rem] p-3', 
    lg: 'min-h-[10rem] p-3',
    xl: 'min-h-[16rem] p-4', 
  }[size]

  // If there are tasks, infuse the card background with the primary task's color
  const primaryTint = dayTasks.length > 0 ? (dayTasks[0].color || '#ede9fe') : null

  const baseBg = primaryTint
    ? `linear-gradient(160deg, rgba(255, 255, 255, 0.98) 0%, ${primaryTint}22 60%, ${primaryTint}44 100%)`
    : size === 'xl'
    ? 'rgba(255, 255, 255, 0.97)'
    : today
    ? 'linear-gradient(170deg, rgba(255, 255, 255, 0.96) 0%, rgba(229, 241, 255, 0.92) 50%, rgba(219, 234, 255, 0.88) 100%)'
    : weekend
    ? 'linear-gradient(170deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.90) 50%, rgba(245, 247, 250, 0.88) 100%)'
    : 'linear-gradient(170deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 252, 255, 0.95) 50%, rgba(255, 255, 255, 0.92) 100%)'

  const cardBorder = primaryTint
    ? `1px solid ${primaryTint}66`
    : today
    ? '1px solid rgba(96, 165, 250, 0.4)'
    : '1px solid rgba(255, 255, 255, 0.6)'

  const dimmed = !inMonth ? 'opacity-40' : ''

  /* ---------- Glassy Cards rendering (Month View) ---------- */
  const renderGlassCards = () => {
    if (dayTasks.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity w-full h-full">
          <span className="text-[10px] text-slate-400 font-medium tracking-wide italic">
            drop
          </span>
        </div>
      )
    }

    return (
      <div className="flex-1 flex flex-col gap-[1px] w-full min-h-0 overflow-y-auto z-[1] pr-0.5 pb-0.5">
        {dayTasks.map((t) => (
          <GlassyTaskCard
            key={t._id}
            t={t}
            dayKey={dayKey}
            onOpen={onOpen}
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
          />
        ))}
      </div>
    )
  }

  /* ---------- Classic chip rendering (Week & Day Views) ---------- */
  const renderChips = () => (
    <div className="flex-1 flex flex-col gap-1.5 min-h-0 overflow-y-auto pr-0.5 relative z-[1]">
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
          size={size === 'xl' || size === 'week' ? 'sm' : 'xs'}
          showProgress={false}
          onOpen={onOpen}
          onCycleColor={onCycleColor}
          fromBucketKey={dayKey}
        />
      ))}
    </div>
  )

  return (
    <motion.div
      ref={setNodeRef}
      onClick={(e) => {
        if (e.defaultPrevented) return
        onClickCell?.(date)
      }}
      className={`group relative flex flex-col rounded-2xl border cursor-pointer transition-all overflow-hidden ${sizing} ${dimmed} ${
        today ? 'today-ring' : ''
      } ${isOver ? 'ring-4 ring-blue-300/70' : ''}`}
      data-today={today ? 'true' : undefined}
      style={{
        background: baseBg,
        border: cardBorder,
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
      <div className="flex items-start justify-between mb-1.5 relative z-[1]">
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

      {useGlassCards ? renderGlassCards() : renderChips()}

      {total > 0 && !useGlassCards && (
        <div className="mt-1.5 flex items-center gap-1.5 relative z-[1]">
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
      <TaskPreviewPortal 
        task={hoveredTask} 
        anchorRect={anchorRect} 
        isVisible={!!hoveredTask} 
      />
    </motion.div>
  )
}

function GlassyTaskCard({ t, dayKey, onOpen, onMouseEnter, onMouseLeave }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `chip:${t._id}-${dayKey}`,
    data: { type: 'chip', taskId: t._id, fromBucketKey: dayKey },
  })

  const tint = t.color || '#ede9fe'
  const deep = deepFor(tint)
  const mid = midFor(tint)
  
  const FLAME_PATH = "M12 2c0 2 1 3.6 2 5.2c1.7 2.6 4 4.8 4 8.3a6 6 0 0 1-12 0c0-2.7 1-4.6 2-6.2c.8 1.7 1.7 1.7 1.7-.4c0-2 1.1-4.5 2.3-6.9z"
  const INNER_FLAME_PATH = "M12 11c0 1 .5 1.7 1 2.5c.8 1.2 1.6 2.1 1.6 3.5a2.6 2.6 0 0 1-5.2 0c0-1.2.4-2 .9-2.8c.4.7.7.7.7-.2c0-.9.4-2 1-3z"

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onOpen?.(t, dayKey)
      }}
      onMouseEnter={(e) => onMouseEnter(e, t)}
      onMouseLeave={onMouseLeave}
      className={`group/card relative flex items-center gap-1.5 w-full mb-[1px] cursor-pointer ${isDragging ? 'opacity-30' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Square Logo Card */}
      <motion.div
        className="relative shrink-0 w-4 h-4 rounded-[4px] flex items-center justify-center transition-all duration-300 ease-out group-hover/card:drop-shadow-lg group-hover/card:z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <svg viewBox="0 0 24 24" className="w-[105%] h-[105%] transition-transform duration-300 ease-out group-hover/card:scale-[1.7] group-hover/card:-translate-y-1 overflow-visible">
          <path d={FLAME_PATH} fill={t.done ? mid : deep} opacity={t.done ? 0.6 : 1} stroke="rgba(15,23,42,0.15)" strokeWidth="0.5" />
          <path d={INNER_FLAME_PATH} fill="#0f172a" fillOpacity={0.8} />
        </svg>
      </motion.div>

      {/* Rectangle Task Card */}
      <motion.div
        className="glass-shimmer relative flex-1 mr-1 flex items-center px-1.5 py-1 rounded-md transition-all overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tint}f2 0%, ${deep}40 100%)`,
          boxShadow: `0 2px 6px -1px ${deep}50, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 ${deep}20`,
          border: `1px solid ${deep}44`,
          backdropFilter: 'blur(6px)',
        }}
        whileHover={{ 
          boxShadow: `0 3px 8px -2px ${deep}40, inset 0 1px 0 rgba(255,255,255,0.9)`,
          filter: 'brightness(1.05)'
        }}
      >
        <span
          className={`text-[10px] font-bold truncate ${
            t.done ? 'opacity-70' : ''
          }`}
          style={{
            color: '#1e293b',
            textShadow: '0 1px 1px rgba(255,255,255,0.7)',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.01em',
          }}
        >
          {t.title}
        </span>
      </motion.div>
    </div>
  )
}
