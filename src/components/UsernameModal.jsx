import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

export default function UsernameModal({
  isOpen,
  currentUsername,
  onSave,
  onClose,
}) {
  const [val, setVal] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setVal(currentUsername || '')
      setError('')
    }
  }, [isOpen, currentUsername])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = val.trim().toLowerCase()
    if (!trimmed) {
      setError('Username cannot be empty')
      return
    }
    if (!/^[a-z0-9_-]+$/.test(trimmed)) {
      setError('Use only letters, numbers, underscores, and hyphens')
      return
    }
    setError('')
    onSave(trimmed)
  }

  // Can close only if a username is already saved in localStorage
  const canClose = !!currentUsername

  return (
    <AnimatePresence>
      {isOpen && (
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
                'linear-gradient(135deg, rgba(15, 23, 42, 0.45) 0%, rgba(76, 29, 149, 0.35) 100%)',
            }}
            onClick={() => {
              if (canClose && onClose) onClose()
            }}
          />

          {/* Modal content */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-white/80 p-7 flex flex-col gap-5"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.92) 100%)',
              boxShadow:
                '0 40px 90px -20px rgba(15, 23, 42, 0.45), 0 8px 30px -8px rgba(76, 29, 149, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Top gradient border */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl"
              style={{
                background:
                  'linear-gradient(90deg, #60a5fa 0%, #8b5cf6 50%, #6366f1 100%)',
              }}
            />

            {/* Optional Close Button */}
            {canClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3.5 right-3.5 size-8 grid place-items-center rounded-full bg-white/60 hover:bg-white/90 hover:scale-110 text-slate-600 hover:text-slate-900 transition shadow-sm border border-white/80 cursor-pointer"
              >
                ×
              </button>
            )}

            {/* Header Icon + Titles */}
            <div className="flex flex-col items-center text-center gap-2 pt-2">
              <div className="size-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner mb-1">
                <Logo size={28} />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                {currentUsername ? 'Switch Workspace' : 'Welcome to Okiro'}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Enter your username to access your workspace.
              </p>
            </div>

            {/* Input & Error */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username-input" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  @
                </span>
                <input
                  id="username-input"
                  type="text"
                  autoFocus
                  placeholder="username"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  className="w-full text-sm font-semibold pl-8 pr-4 py-3 bg-white/60 border border-white/85 rounded-xl placeholder:text-slate-400 focus:bg-white/90 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/60 focus:outline-none transition shadow-sm"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-semibold text-rose-600 pl-1"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              style={{
                background:
                  'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 50%, #6366f1 100%)',
              }}
            >
              {currentUsername ? 'Save and Load' : 'Enter Workspace'}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
