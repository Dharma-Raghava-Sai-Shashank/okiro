import { useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import {
  chipGlow,
  chipGradient,
  deepFor,
  nextColor,
} from '../lib/colors'
import Logo from './Logo'

export default function TaskChip({
  task,
  onOpen,
  onCycleColor,
  fromBucketKey,
  size = 'sm',
  showProgress = true,
  disableDrag = false,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `chip:${task._id}-${fromBucketKey || 'inbox'}`,
    data: { type: 'chip', taskId: task._id, fromBucketKey },
    disabled: disableDrag,
  })

  const baseTint = task.color || '#ede9fe'
  const deep = deepFor(baseTint)
  const gradient = chipGradient(baseTint)
  const glow = chipGlow(baseTint, task.done ? 0.55 : 0.32)

  const heights = {
    xs: 'py-1 text-[11px]',
    sm: 'py-1.5 text-xs',
    md: 'py-2 text-sm',
  }
  const padding = { xs: 'px-2', sm: 'px-3', md: 'px-3.5' }

  const handleClick = (e) => {
    if (e.defaultPrevented) return
    onOpen?.(task, fromBucketKey)
  }

  const handleColorClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onCycleColor?.(task, nextColor(baseTint))
  }

  return (
    <motion.div
      ref={setNodeRef}
      onClick={handleClick}
      className={`group relative cursor-pointer select-none rounded-full border border-white/70 backdrop-blur-md ${padding[size]} ${heights[size]} ${
        isDragging ? 'opacity-30' : ''
      }`}
      style={{
        background: gradient,
        boxShadow: glow,
        color: '#0f172a',
        position: 'relative',
        zIndex: 26,
      }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <button
          type="button"
          onClick={handleColorClick}
          onPointerDown={(e) => e.stopPropagation()}
          className="size-2.5 rounded-full border border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] shrink-0 transition hover:scale-125"
          style={{ background: deep }}
          title="Cycle color"
        />
        {task.done && (
          <span
            className="shrink-0 grid place-items-center"
            aria-label="Done"
            title="Done"
          >
            <Logo size={size === 'md' ? 16 : 14} />
          </span>
        )}
        <span
          className="truncate font-medium tracking-tight"
          title={task.title}
          style={{ color: task.done ? 'rgba(15, 23, 42, 0.65)' : '#0f172a' }}
        >
          {task.title}
        </span>
      </div>
      {showProgress && task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-1 h-1 rounded-full bg-white/50 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${task.progress || 0}%`,
              background: `linear-gradient(90deg, ${deep}, ${deep}cc)`,
            }}
          />
        </div>
      )}
    </motion.div>
  )
}
