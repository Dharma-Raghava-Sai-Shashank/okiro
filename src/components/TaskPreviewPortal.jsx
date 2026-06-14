import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { deepFor } from '../lib/colors'

export default function TaskPreviewPortal({ task, anchorRect, isVisible }) {
  const [position, setPosition] = useState(null)
  const [cachedTask, setCachedTask] = useState(null)
  const [cachedPosition, setCachedPosition] = useState(null)

  useEffect(() => {
    if (task) setCachedTask(task)
  }, [task])

  useEffect(() => {
    if (!anchorRect) return

    const cardWidth = 240
    const cardHeight = 200 // Approximate max height used for bounds check
    const gap = 12

    let x = anchorRect.right + gap
    let y = anchorRect.top + (anchorRect.height / 2) - 50 // Try to center near top

    if (x + cardWidth > window.innerWidth - 20) {
      x = anchorRect.left - cardWidth - gap
    }

    if (y < 20) y = 20
    if (y + cardHeight > window.innerHeight - 20) {
      y = window.innerHeight - cardHeight - 20
    }

    const newPos = { x, y, isRight: x > anchorRect.left }
    setPosition(newPos)
    setCachedPosition(newPos)
  }, [anchorRect])

  const renderTask = isVisible ? task : cachedTask
  const renderPos = isVisible ? position : cachedPosition

  if (!renderTask || !renderPos) return null

  const tint = renderTask.color || '#ede9fe'
  const deep = deepFor(tint)
  
  const subtasks = renderTask.subtasks || []
  const doneCount = subtasks.filter(s => s.done).length

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: renderPos.x + (renderPos.isRight ? -10 : 10), y: renderPos.y }}
          animate={{ opacity: 1, scale: 1, x: renderPos.x, y: renderPos.y }}
          exit={{ opacity: 0, scale: 0.95, x: renderPos.x + (renderPos.isRight ? -5 : 5), transition: { duration: 0.15 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed z-[9999] p-4 rounded-xl pointer-events-none flex flex-col gap-3 shadow-2xl"
          style={{
            left: 0,
            top: 0,
            width: 240,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backgroundImage: `linear-gradient(145deg, ${tint}25 0%, ${tint}45 100%)`,
            border: `1px solid ${deep}30`,
            boxShadow: `0 24px 48px -12px ${deep}50, 0 4px 12px -2px rgba(0,0,0,0.05)`,
            backdropFilter: 'blur(16px)',
            transformOrigin: renderPos.isRight ? 'left center' : 'right center'
          }}
        >
          <div className="flex items-start justify-between gap-2 border-b pb-2" style={{ borderColor: `${deep}20` }}>
            <h4 className="font-extrabold text-slate-800 text-sm leading-tight tracking-tight">
              {renderTask.title}
            </h4>
            <div 
              className="size-3 rounded-full shrink-0 border border-white shadow-sm mt-0.5"
              style={{ background: tint }}
            />
          </div>

          {renderTask.notes && (
            <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed whitespace-pre-wrap">
              {renderTask.notes}
            </p>
          )}

          {subtasks.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1 pt-3 border-t border-slate-200/60">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <span>Subtasks</span>
                <span style={{ color: deep }}>{doneCount}/{subtasks.length}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {subtasks.slice(0, 4).map(sub => (
                  <div key={sub.id} className="flex items-start gap-1.5 p-1 rounded-md transition-colors hover:bg-slate-50/50">
                    <div className={`mt-[3px] size-1.5 rounded-full shrink-0 shadow-sm ${sub.done ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    <span className={`text-[11px] leading-tight truncate ${sub.done ? 'text-slate-400' : 'text-slate-700'}`}>
                      {sub.title}
                    </span>
                  </div>
                ))}
                {subtasks.length > 4 && (
                  <span className="text-[10px] text-slate-400 italic pl-3">
                    + {subtasks.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {!renderTask.notes && subtasks.length === 0 && (
            <div className="text-[11px] text-slate-400 italic mt-1">
              No additional details
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
