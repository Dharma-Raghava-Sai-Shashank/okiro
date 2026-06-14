import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, isSameMonth, isWeekend } from 'date-fns'
import {
  daysOfMonthGrid,
  keyForDay,
  isToday,
  monthsOfYear,
} from '../lib/dates'
import { deepFor, midFor } from '../lib/colors'

const WEEK_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const FLAME_PATH = "M12 2c0 2 1 3.6 2 5.2c1.7 2.6 4 4.8 4 8.3a6 6 0 0 1-12 0c0-2.7 1-4.6 2-6.2c.8 1.7 1.7 1.7 1.7-.4c0-2 1.1-4.5 2.3-6.9z"
const INNER_FLAME_PATH = "M12 11c0 1 .5 1.7 1 2.5c.8 1.2 1.6 2.1 1.6 3.5a2.6 2.6 0 0 1-5.2 0c0-1.2.4-2 .9-2.8c.4.7.7.7.7-.2c0-.9.4-2 1-3z"

function MiniDayCell({ date, monthDate, dayTasks, onPickDay }) {
  const inMonth = isSameMonth(date, monthDate)
  const today = isToday(date)
  const weekend = isWeekend(date)
  const hasTasks = dayTasks.length > 0
  const total = dayTasks.length
  const clipId = `yr-flame-${date.toISOString().slice(0, 10)}`
  const stripsBottomUp = [...dayTasks].reverse()

  return (
    <motion.button
      type="button"
      onClick={() => onPickDay?.(date)}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`group/flame relative rounded-lg cursor-pointer overflow-visible ${
        inMonth ? '' : 'opacity-30'
      }`}
      style={{
        aspectRatio: '1 / 1',
        minHeight: '44px',
        background: weekend
          ? 'rgba(248, 250, 252, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        border: today
          ? '2px solid #3b82f6'
          : '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: today
          ? '0 0 0 2px rgba(59, 130, 246, 0.18), 0 4px 10px -3px rgba(59, 130, 246, 0.28)'
          : '0 1px 2px rgba(15, 23, 42, 0.06)',
      }}
      aria-label={`${format(date, 'EEE d MMM yyyy')}, ${dayTasks.length} ${
        dayTasks.length === 1 ? 'task' : 'tasks'
      }`}
    >
      {/* Day number — small, top-left corner */}
      <span
        className={`absolute top-[3px] left-[4px] text-[8px] font-bold leading-none tabular-nums z-10 ${
          today
            ? 'text-blue-600'
            : weekend
            ? 'text-slate-400'
            : 'text-slate-500'
        }`}
      >
        {format(date, 'd')}
      </span>

      {/* Flame logo — only shown when tasks exist, matches weekly TaskFlameCard colors */}
      {hasTasks && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 ease-out group-hover/flame:scale-[1.85] group-hover/flame:-translate-y-[3px]"
            style={{ width: '65%', height: '65%', overflow: 'visible' }}
          >
            <defs>
              <clipPath id={clipId}>
                <path d={FLAME_PATH} />
              </clipPath>
            </defs>

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

            {/* Inner dark flame core */}
            <path d={INNER_FLAME_PATH} fill="#0f172a" fillOpacity={0.85} />
          </svg>
        </div>
      )}
    </motion.button>
  )
}

function MonthTile({ monthDate, tasksByKey, onPickDay, onPickMonth, index }) {
  const days = daysOfMonthGrid(monthDate)
  const isCurrent = isSameMonth(monthDate, new Date())

  // Count tasks this month
  const monthTaskCount = days.reduce((sum, d) => {
    return sum + (tasksByKey.get(keyForDay(d)) || []).length
  }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 26,
        delay: index * 0.04,
      }}
      whileHover={{ y: -3, boxShadow: isCurrent
        ? '0 18px 40px -12px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
        : '0 14px 36px -10px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
      }}
      className={`rounded-2xl flex flex-col overflow-hidden ${
        isCurrent ? 'border-2 border-blue-300/80' : 'border border-slate-200/60'
      }`}
      style={{
        background: isCurrent
          ? 'linear-gradient(170deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 50%, rgba(239,246,255,0.85) 100%)'
          : 'linear-gradient(170deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.88) 50%, rgba(248,250,252,0.85) 100%)',
        backdropFilter: 'blur(20px) saturate(170%)',
        WebkitBackdropFilter: 'blur(20px) saturate(170%)',
        boxShadow: isCurrent
          ? '0 10px 28px -14px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
          : '0 6px 18px -10px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* Month header bar */}
      <button
        type="button"
        onClick={() => onPickMonth?.(monthDate)}
        className="group flex items-center justify-between px-4 py-3 cursor-pointer transition-all hover:brightness-105"
        style={{
          background: isCurrent
            ? 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(96,165,250,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(248,250,252,0.8) 0%, rgba(241,245,249,0.6) 100%)',
        }}
      >
        <span className={`text-[15px] font-bold tracking-tight ${
          isCurrent ? 'text-blue-700' : 'text-slate-800'
        } group-hover:underline decoration-2 underline-offset-2`}>
          {format(monthDate, 'MMMM')}
        </span>
        <div className="flex items-center gap-2">
          {monthTaskCount > 0 && (
            <span
              className="text-[9px] font-bold px-2 py-[2px] rounded-full"
              style={{
                background: isCurrent
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(96,165,250,0.1) 100%)'
                  : 'rgba(15,23,42,0.06)',
                color: isCurrent ? '#2563eb' : '#64748b',
              }}
            >
              {monthTaskCount} {monthTaskCount === 1 ? 'task' : 'tasks'}
            </span>
          )}
          {isCurrent && (
            <span
              className="text-[8px] font-bold uppercase tracking-wider px-2 py-[2px] rounded-full text-white"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                boxShadow: '0 2px 6px -1px rgba(59,130,246,0.4)',
              }}
            >
              Now
            </span>
          )}
        </div>
      </button>

      {/* Calendar grid */}
      <div className="px-3.5 pb-3.5 pt-2.5 flex flex-col gap-2">
        <div className="grid grid-cols-7 gap-1.5 px-0.5">
          {WEEK_HEADERS.map((h, i) => (
            <span
              key={i}
              className={`text-[9px] uppercase font-bold tracking-wider text-center leading-none ${
                i >= 5 ? 'text-slate-300' : 'text-slate-400'
              }`}
            >
              {h}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const dayTasks = tasksByKey.get(keyForDay(d)) || []
            return (
              <MiniDayCell
                key={d.toISOString()}
                date={d}
                monthDate={monthDate}
                dayTasks={dayTasks}
                onPickDay={onPickDay}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default function YearCalendar({ anchor, tasks, onPickMonth, onPickDay }) {
  const year = anchor.getFullYear()
  const months = useMemo(() => monthsOfYear(year), [year])

  const tasksByKey = useMemo(() => {
    const m = new Map()
    for (const t of tasks) {
      if (t.scope !== 'day' || !t.bucketKey) continue
      const arr = m.get(t.bucketKey) || []
      arr.push(t)
      m.set(t.bucketKey, arr)
    }
    return m
  }, [tasks])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {months.map((m, i) => (
        <MonthTile
          key={m.toISOString()}
          monthDate={m}
          tasksByKey={tasksByKey}
          onPickDay={onPickDay}
          onPickMonth={onPickMonth}
          index={i}
        />
      ))}
    </div>
  )
}
