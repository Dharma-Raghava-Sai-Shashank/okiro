import { motion } from 'framer-motion'
import MonthPreview from './MonthPreview'
import YearCalendar from './YearCalendar'
import { monthsOfYear } from '../lib/dates'

const MODES = [
  { key: 'cards', label: 'Cards' },
  { key: 'calendar', label: 'Calendar' },
]

function ModeIcon({ mode }) {
  if (mode === 'cards') {
    return (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
        <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
        <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
        <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="11.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <line
        x1="1.5"
        y1="6.5"
        x2="14.5"
        y2="6.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line x1="5" y1="1" x2="5" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="11" y1="1" x2="11" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="4" y="8.5" width="2" height="2" rx="0.4" fill="currentColor" />
      <rect x="7" y="8.5" width="2" height="2" rx="0.4" fill="currentColor" />
      <rect x="10" y="8.5" width="2" height="2" rx="0.4" fill="currentColor" />
      <rect x="4" y="11" width="2" height="2" rx="0.4" fill="currentColor" />
      <rect x="7" y="11" width="2" height="2" rx="0.4" fill="currentColor" />
    </svg>
  )
}

export default function YearView({
  anchor,
  tasks,
  onPickMonth,
  onPickDay,
  mode = 'cards',
  onModeChange,
}) {
  const setMode = onModeChange || (() => {})
  const months = monthsOfYear(anchor.getFullYear())

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div
          className="flex items-center gap-1 rounded-2xl border border-white/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_8px_-4px_rgba(15,23,42,0.1)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)',
          }}
        >
          {MODES.map((m) => {
            const active = m.key === mode
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  active
                    ? 'text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                style={
                  active
                    ? {
                        background:
                          'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      }
                    : undefined
                }
                aria-pressed={active}
                aria-label={`${m.label} view`}
              >
                <ModeIcon mode={m.key} />
                <span>{m.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {mode === 'cards' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((m) => (
              <MonthPreview
                key={m.toISOString()}
                monthDate={m}
                tasks={tasks}
                onClick={onPickMonth}
              />
            ))}
          </div>
        ) : (
          <YearCalendar
            anchor={anchor}
            tasks={tasks}
            onPickMonth={onPickMonth}
            onPickDay={onPickDay}
          />
        )}
      </motion.div>
    </div>
  )
}
