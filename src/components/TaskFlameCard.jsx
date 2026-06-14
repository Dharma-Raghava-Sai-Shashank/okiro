import { motion } from 'framer-motion'
import { deepFor, midFor } from '../lib/colors'
import { isToday } from '../lib/dates'

const FLAME_PATH = "M12 2c0 2 1 3.6 2 5.2c1.7 2.6 4 4.8 4 8.3a6 6 0 0 1-12 0c0-2.7 1-4.6 2-6.2c.8 1.7 1.7 1.7 1.7-.4c0-2 1.1-4.5 2.3-6.9z"
const INNER_FLAME_PATH = "M12 11c0 1 .5 1.7 1 2.5c.8 1.2 1.6 2.1 1.6 3.5a2.6 2.6 0 0 1-5.2 0c0-1.2.4-2 .9-2.8c.4.7.7.7.7-.2c0-.9.4-2 1-3z"

export default function TaskFlameCard({ date, dayTasks, onClickCell }) {
  const today = isToday(date)
  const clipId = `flame-clip-${date.toISOString().slice(0, 10)}`

  const total = dayTasks.length
  const stripsBottomUp = [...dayTasks].reverse()

  return (
    <motion.div
      onClick={() => onClickCell?.(date)}
      className="flex-shrink-0 flex items-center justify-center rounded-2xl cursor-pointer self-center relative"
      style={{
        width: '6.5rem',
        height: '6.5rem',
        background: today
          ? 'linear-gradient(170deg, rgba(239,246,255,0.98) 0%, rgba(219,234,254,0.95) 100%)'
          : 'linear-gradient(170deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.95) 100%)',
        border: today ? '1px solid rgba(96,165,250,0.5)' : '1px solid rgba(255,255,255,0.7)',
        boxShadow: today
          ? '0 6px 20px -8px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.95)'
          : '0 4px 16px -8px rgba(30,64,175,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
      whileHover={{ y: -2, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      {/* Flame SVG — perfectly centered */}
      <div style={{ width: '3.8rem', height: '3.8rem' }}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.4] overflow-visible">
          <defs>
            <clipPath id={clipId}>
              <path d={FLAME_PATH} />
            </clipPath>
          </defs>

          {total === 0 ? (
            <>
              <defs>
                <linearGradient id={`${clipId}-def`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="40%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <path d={FLAME_PATH} fill={`url(#${clipId}-def)`} stroke="rgba(15,23,42,0.15)" strokeWidth="0.3" />
            </>
          ) : (
            <>
              <g clipPath={`url(#${clipId})`}>
                {stripsBottomUp.map((task, i) => {
                  const tint = task.color || '#ede9fe'
                  const deep = deepFor(tint)
                  const mid = midFor(tint)
                  const bandH = 24 / total
                  const y = 24 - (i + 1) * bandH
                  return (
                    <rect
                      key={task._id}
                      x="0"
                      y={y}
                      width="24"
                      height={bandH + 0.2}
                      fill={task.done ? mid : deep}
                      opacity={task.done ? 0.5 : 1}
                    />
                  )
                })}
              </g>
              <path d={FLAME_PATH} fill="none" stroke="rgba(15,23,42,0.2)" strokeWidth="0.35" />
            </>
          )}

          {/* Inner dark flame always on top */}
          <path d={INNER_FLAME_PATH} fill="#0f172a" fillOpacity={0.85} />
        </svg>
      </div>

      {/* Today pulse ring */}
      {today && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: '1.5px solid rgba(96,165,250,0.4)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  )
}
