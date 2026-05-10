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

function bandsBackground(dayTasks) {
  if (dayTasks.length === 0) return null
  const n = dayTasks.length
  const stops = []
  dayTasks.forEach((t, i) => {
    const color = t.done ? deepFor(t.color) : midFor(t.color)
    const start = (i / n) * 100
    const end = ((i + 1) / n) * 100
    stops.push(`${color} ${start}%`)
    stops.push(`${color} ${end}%`)
  })
  return `linear-gradient(180deg, ${stops.join(', ')})`
}

function MiniDayCell({ date, monthDate, dayTasks, onPickDay }) {
  const inMonth = isSameMonth(date, monthDate)
  const today = isToday(date)
  const weekend = isWeekend(date)
  const hasTasks = dayTasks.length > 0
  const bands = bandsBackground(dayTasks)

  return (
    <motion.button
      type="button"
      onClick={() => onPickDay?.(date)}
      whileHover={{ scale: 1.06, zIndex: 5 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`relative rounded-lg cursor-pointer overflow-hidden ${
        inMonth ? '' : 'opacity-30'
      }`}
      style={{
        aspectRatio: '1 / 1',
        minHeight: '44px',
        background: hasTasks
          ? bands
          : weekend
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
      <span
        className={`absolute inset-0 grid place-items-center text-[11px] font-semibold leading-none tracking-tight tabular-nums ${
          hasTasks
            ? 'text-slate-900'
            : today
            ? 'text-blue-700'
            : weekend
            ? 'text-slate-400'
            : 'text-slate-500'
        }`}
        style={
          hasTasks
            ? {
                textShadow:
                  '0 1px 2px rgba(255, 255, 255, 0.85), 0 0 4px rgba(255, 255, 255, 0.65)',
              }
            : undefined
        }
      >
        {format(date, 'd')}
      </span>
    </motion.button>
  )
}

function MonthTile({ monthDate, tasksByKey, onPickDay, onPickMonth }) {
  const days = daysOfMonthGrid(monthDate)
  const isCurrent = isSameMonth(monthDate, new Date())

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className={`rounded-2xl p-4 flex flex-col gap-3 ${
        isCurrent ? 'border-2 border-blue-300' : 'border border-slate-200/70'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(170%)',
        WebkitBackdropFilter: 'blur(20px) saturate(170%)',
        boxShadow: isCurrent
          ? '0 10px 28px -14px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
          : '0 6px 18px -10px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
      }}
    >
      <button
        type="button"
        onClick={() => onPickMonth?.(monthDate)}
        className={`text-left text-[14px] font-bold tracking-tight px-0.5 ${
          isCurrent ? 'text-blue-700' : 'text-slate-800'
        } hover:underline decoration-2 underline-offset-2`}
      >
        {format(monthDate, 'MMMM')}
      </button>

      <div className="grid grid-cols-7 gap-1.5 px-0.5">
        {WEEK_HEADERS.map((h, i) => (
          <span
            key={i}
            className="text-[9px] uppercase font-semibold tracking-wider text-center leading-none text-slate-400"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {months.map((m) => (
        <MonthTile
          key={m.toISOString()}
          monthDate={m}
          tasksByKey={tasksByKey}
          onPickDay={onPickDay}
          onPickMonth={onPickMonth}
        />
      ))}
    </div>
  )
}
