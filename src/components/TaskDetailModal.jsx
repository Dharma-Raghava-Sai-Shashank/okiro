import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PALETTE, deepFor, paletteEntry } from '../lib/colors'
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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const titleTimer = useRef(null)
  const notesTimer = useRef(null)

  useEffect(() => {
    setTitle(task?.title || '')
    setNotes(task?.notes || '')
    setConfirmDelete(false)
  }, [task?._id])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
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

  const tint = task.color || '#ede9fe'
  const entry = paletteEntry(tint)
  const deep = entry.deep

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

  // Banner gradient using the task's color palette
  const bannerGradient = `linear-gradient(135deg, ${entry.tint} 0%, ${entry.mid} 40%, ${deep} 100%)`

  // Text contrast for banner
  // Text contrast for banner - force black as requested
  const bannerText = '#0f172a'
  const bannerSubtext = 'rgba(15, 23, 42, 0.65)'

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
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(76, 29, 149, 0.4) 100%)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={close}
          />

          {/* Modal panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
              boxShadow:
                '0 40px 100px -20px rgba(15, 23, 42, 0.5), 0 8px 36px -8px rgba(76, 29, 149, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* ─── Colored banner header ─── */}
            <div
              className="relative px-6 pt-6 pb-5"
              style={{ background: bannerGradient }}
            >
              {/* Decorative pattern overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 40%)',
                }}
              />

              {/* Close button */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 size-9 grid place-items-center rounded-full transition hover:scale-110"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  color: bannerText,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {/* Title on banner */}
              <input
                value={title}
                onChange={(e) => handleTitle(e.target.value)}
                placeholder="Task title"
                className="relative z-[1] w-full text-2xl font-bold tracking-tight bg-transparent border-none focus:outline-none pr-12"
                style={{
                  color: bannerText,
                  caretColor: bannerText,
                }}
              />

              {/* Done badge */}
              {task.done && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-[1] inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(4px)',
                    color: bannerText,
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.12em',
                  }}
                >
                  <Logo size={13} />
                  Completed
                </motion.div>
              )}
            </div>

            {/* ─── Body content ─── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Color picker — pill swatches */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Color
                </span>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map((p) => {
                    const active = p.tint === task.color
                    return (
                      <motion.button
                        key={p.name}
                        onClick={() => onPatch({ color: p.tint })}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border-2 transition-all"
                        style={{
                          borderColor: active ? deep : 'rgba(255,255,255,0.7)',
                          background: active
                            ? `linear-gradient(135deg, ${p.tint} 0%, ${p.mid} 100%)`
                            : `linear-gradient(135deg, ${p.tint}80 0%, ${p.mid}60 100%)`,
                          boxShadow: active
                            ? `0 4px 14px -3px ${p.deep}55, inset 0 1px 0 rgba(255,255,255,0.6)`
                            : '0 1px 4px rgba(0,0,0,0.06)',
                        }}
                      >
                        <span
                          className="size-5 rounded-full border border-white/80 shadow-sm grid place-items-center"
                          style={{
                            background: `linear-gradient(135deg, ${p.deep}cc, ${p.deep})`,
                          }}
                        >
                          {active && (
                            <motion.svg
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              width="10" height="10" viewBox="0 0 10 10"
                            >
                              <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                          )}
                        </span>
                        <span
                          className="text-[10px] font-semibold capitalize"
                          style={{
                            color: active ? '#1e293b' : '#64748b',
                          }}
                        >
                          {p.name}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* ─── Divider ─── */}
              <div
                className="h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${entry.mid}80, transparent)`,
                }}
              />

              {/* Progress + Done toggle */}
              <div className="flex items-center gap-4">
                <ProgressBar
                  value={computedProgress}
                  manual={!hasSubs}
                  onChange={(v) => onPatch({ progress: v, done: v === 100 })}
                />
                <motion.button
                  onClick={() => onPatch({ done: !task.done })}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="shrink-0 text-xs font-bold px-5 py-2.5 rounded-2xl transition-all shadow-md flex items-center gap-2"
                  style={
                    task.done
                      ? {
                          background: `linear-gradient(135deg, ${entry.tint}, ${entry.mid})`,
                          color: '#1e293b',
                          border: `1px solid ${entry.mid}`,
                          boxShadow: `0 4px 12px -3px ${deep}33`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.7)',
                          color: '#475569',
                          border: '1px solid rgba(255,255,255,0.8)',
                        }
                  }
                >
                  {task.done && <Logo size={14} />}
                  {task.done ? 'Done' : 'Mark done'}
                </motion.button>
              </div>

              {/* ─── Divider ─── */}
              <div
                className="h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${entry.mid}80, transparent)`,
                }}
              />

              {/* Subtasks section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Daily subtasks
                  </h3>
                  {subtasks.length > 0 && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${entry.tint}`,
                        color: deep,
                      }}
                    >
                      {subtasks.filter((s) => s.done).length}/{subtasks.length}
                    </span>
                  )}
                </div>
                <SubtaskList
                  subtasks={subtasks}
                  defaultDate={defaultSubtaskDate || ''}
                  onAdd={onAddSubtask}
                  onToggle={onToggleSubtask}
                  onEdit={onEditSubtask}
                  onRemove={onRemoveSubtask}
                  accentColor={tint}
                  accentDeep={deep}
                />
              </div>

              {/* ─── Divider ─── */}
              <div
                className="h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${entry.mid}80, transparent)`,
                }}
              />

              {/* Notes section */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Notes
                </h3>
                <div className="relative">
                  <textarea
                    value={notes}
                    onChange={(e) => handleNotes(e.target.value)}
                    rows={3}
                    placeholder="Anything to remember about this goal…"
                    className="w-full text-sm px-4 py-3 rounded-2xl placeholder:text-slate-400 focus:outline-none resize-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.65)',
                      border: `1.5px solid ${entry.mid}50`,
                      boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.04)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = `${entry.mid}`
                      e.target.style.background = 'rgba(255,255,255,0.85)'
                      e.target.style.boxShadow = `inset 0 1px 3px rgba(15, 23, 42, 0.04), 0 0 0 3px ${entry.tint}60`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${entry.mid}50`
                      e.target.style.background = 'rgba(255,255,255,0.65)'
                      e.target.style.boxShadow = 'inset 0 1px 3px rgba(15, 23, 42, 0.04)'
                    }}
                  />
                  {notes && (
                    <span className="absolute bottom-2 right-3 text-[9px] text-slate-400 tabular-nums">
                      {notes.length} chars
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Footer actions ─── */}
            <div
              className="px-6 py-4 flex justify-between items-center gap-3"
              style={{
                borderTop: `1px solid ${entry.mid}40`,
                background: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {/* Delete with inline confirm */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#b91c1c',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.14)'
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 3H10M4.5 5V9M7.5 5V9M3 3L3.5 10.5C3.5 11 4 11 4 11H8C8 11 8.5 11 8.5 10.5L9 3M4.5 3V1.5C4.5 1 5 1 5 1H7C7 1 7.5 1 7.5 1.5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Delete
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[11px] font-medium text-rose-700">
                    Delete this task?
                  </span>
                  <button
                    onClick={() => {
                      onDelete()
                      onClose()
                    }}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-white transition hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      boxShadow: '0 2px 8px -2px rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-lg text-slate-600 bg-white/60 border border-white/70 hover:bg-white/80 transition"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}

              <motion.button
                onClick={close}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-xs font-bold px-6 py-2.5 rounded-xl text-white shadow-lg transition"
                style={{
                  background: `linear-gradient(135deg, ${entry.mid} 0%, ${deep} 100%)`,
                  boxShadow: `0 6px 20px -4px ${deep}66, inset 0 1px 0 rgba(255,255,255,0.35)`,
                }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
