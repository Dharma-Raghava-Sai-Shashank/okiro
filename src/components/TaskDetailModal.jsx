import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PALETTE } from '../lib/colors'
import ProgressBar from './ProgressBar'
import SubtaskList from './SubtaskList'
import Logo from './Logo'

export default function TaskDetailModal({
  task,
  defaultSubtaskDate,
  onClose,
  onPatch,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onEditSubtask,
  onRemoveSubtask,
}) {
  const open = !!task
  const [title, setTitle] = useState(task?.title || '')
  const [notes, setNotes] = useState(task?.notes || '')
  const titleTimer = useRef(null)
  const notesTimer = useRef(null)

  useEffect(() => {
    setTitle(task?.title || '')
    setNotes(task?.notes || '')
  }, [task?._id])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!task) return null

  const subtasks = task.subtasks || []
  const hasSubs = subtasks.length > 0
  const computedProgress = hasSubs
    ? Math.round((subtasks.filter((s) => s.done).length / subtasks.length) * 100)
    : task.progress || 0

  const debouncedPatch = (key, value, ref) => {
    if (ref.current) clearTimeout(ref.current)
    ref.current = setTimeout(() => onPatch({ [key]: value }), 350)
  }

  const handleTitle = (v) => {
    setTitle(v)
    debouncedPatch('title', v, titleTimer)
  }
  const handleNotes = (v) => {
    setNotes(v)
    debouncedPatch('notes', v, notesTimer)
  }

  const flushPending = () => {
    if (titleTimer.current) {
      clearTimeout(titleTimer.current)
      onPatch({ title })
    }
    if (notesTimer.current) {
      clearTimeout(notesTimer.current)
      onPatch({ notes })
    }
  }

  const close = () => {
    flushPending()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(15, 23, 42, 0.45) 0%, rgba(76, 29, 149, 0.35) 100%)',
            }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-3xl border border-white/80 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.92) 100%)',
              boxShadow:
                '0 40px 90px -20px rgba(15, 23, 42, 0.45), 0 8px 30px -8px rgba(76, 29, 149, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
            }}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
              style={{
                background:
                  'linear-gradient(90deg, #a78bfa 0%, #f472b6 50%, #fbbf24 100%)',
              }}
            />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 size-8 grid place-items-center rounded-full bg-white/60 hover:bg-white/90 hover:scale-110 text-slate-600 hover:text-slate-900 transition shadow-sm border border-white/80"
            >
              ×
            </button>

            <div className="flex items-center gap-2 flex-wrap pr-10 pt-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mr-1">
                Color
              </span>
              {PALETTE.map((p) => {
                const active = p.tint === task.color
                return (
                  <motion.button
                    key={p.name}
                    onClick={() => onPatch({ color: p.tint })}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`size-6 rounded-full border-2 shadow-md transition ${
                      active
                        ? 'border-slate-900/50 ring-2 ring-slate-900/20'
                        : 'border-white/80'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${p.tint} 0%, ${p.deep} 130%)`,
                    }}
                    title={p.name}
                  />
                )
              })}
            </div>

            <input
              value={title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Task title"
              className="text-2xl font-bold tracking-tight text-slate-900 bg-transparent border-b-2 border-white/70 focus:border-violet-400 focus:outline-none pb-1.5 transition"
            />

            <div className="flex items-center gap-3">
              <ProgressBar
                value={computedProgress}
                manual={!hasSubs}
                onChange={(v) => onPatch({ progress: v, done: v === 100 })}
              />
              <button
                onClick={() => onPatch({ done: !task.done })}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 ${
                  task.done
                    ? 'bg-white/85 text-slate-900 border border-white/90 shadow-blue-300/30'
                    : 'text-slate-700 bg-white/50 border border-white/80 hover:bg-white/80'
                }`}
              >
                {task.done && <Logo size={14} />}
                {task.done ? 'Done' : 'Mark done'}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Daily subtasks
              </h3>
              <SubtaskList
                subtasks={subtasks}
                defaultDate={defaultSubtaskDate || ''}
                onAdd={onAddSubtask}
                onToggle={onToggleSubtask}
                onEdit={onEditSubtask}
                onRemove={onRemoveSubtask}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => handleNotes(e.target.value)}
                rows={3}
                placeholder="Anything to remember about this goal…"
                className="text-sm px-3.5 py-2.5 bg-white/60 border border-white/80 rounded-xl placeholder:text-slate-400 focus:bg-white/90 focus:border-violet-300 focus:ring-2 focus:ring-violet-200/60 focus:outline-none resize-none transition"
              />
            </div>

            <div className="flex justify-between gap-2 pt-3 border-t border-white/70">
              <button
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    onDelete()
                    onClose()
                  }
                }}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-700 border border-rose-300/40 hover:bg-rose-500/20 hover:border-rose-400/60 transition"
              >
                Delete
              </button>
              <button
                onClick={close}
                className="text-xs font-bold px-5 py-2 rounded-xl text-white shadow-md hover:scale-105 transition"
                style={{
                  background:
                    'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #6366f1 100%)',
                }}
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
