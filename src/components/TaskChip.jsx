import { useDraggable } from '@dnd-kit/core'
import { useState, useRef } from 'react'
import TaskPreviewPortal from './TaskPreviewPortal'
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

  const [showPreview, setShowPreview] = useState(false)
  const [anchorRect, setAnchorRect] = useState(null)
  const hoverTimeout = useRef(null)

  const handleMouseEnter = (e) => {
    if (isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    hoverTimeout.current = setTimeout(() => {
      setAnchorRect(rect)
      setShowPreview(true)
    }, 250)
  }

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setShowPreview(false)
  }

  const baseTint = task.color || '#ede9fe'
  const deep = deepFor(baseTint)
  
  // Punchy glassmorphic styling
  const gradient = `linear-gradient(135deg, ${baseTint}f2 0%, ${deep}40 100%)`
  const glow = `0 4px 12px -2px ${deep}50, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 ${deep}20`

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
    <>
      <motion.div
        ref={setNodeRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      className={`glass-shimmer group relative cursor-pointer select-none rounded-full overflow-hidden ${padding[size]} ${heights[size]} ${
        isDragging ? 'opacity-30' : ''
      }`}
      style={{
        background: gradient,
        boxShadow: glow,
        color: '#0f172a',
        position: 'relative',
        zIndex: 26,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${deep}44`,
      }}
      whileHover={{ 
        boxShadow: `0 4px 12px -2px ${deep}60, inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 ${deep}30`, 
        filter: 'brightness(1.05)'
      }}
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
        />
        {task.done && (
          <span
            className="shrink-0 grid place-items-center"
            aria-label="Done"
          >
            <Logo size={size === 'md' ? 16 : 14} />
          </span>
        )}
        <span
          className="truncate font-medium tracking-tight"
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
      <TaskPreviewPortal 
        task={task} 
        anchorRect={anchorRect} 
        isVisible={showPreview && !isDragging} 
      />
    </>
  )
}
