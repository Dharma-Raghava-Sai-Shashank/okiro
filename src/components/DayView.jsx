import { useState } from 'react'
import DayCell from './DayCell'
import Glass from './Glass'
import { keyForDay, labelDayLong, labelWeekShort } from '../lib/dates'
import { isToday } from '../lib/dates'
import { format } from 'date-fns'

export default function DayView({
  anchor,
  tasks,
  onOpen,
  onCycleColor,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
}) {
  const dayKey = keyForDay(anchor)
  const today = isToday(anchor)

  const rollup = []
  for (const task of tasks) {
    for (const sub of task.subtasks || []) {
      if (sub.date === dayKey) {
        rollup.push({ task, sub })
      }
    }
  }

  const [pickTaskId, setPickTaskId] = useState('')
  const [draftSub, setDraftSub] = useState('')

  const eligibleTasks = tasks.filter((t) => t.scope === 'day' || t.scope === 'inbox')

  const submit = (e) => {
    e.preventDefault()
    if (!pickTaskId || !draftSub.trim()) return
    onAddSubtask(pickTaskId, draftSub.trim(), dayKey)
    setDraftSub('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            {format(anchor, 'EEEE d MMMM yyyy')}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {labelWeekShort(anchor)}
            {today && (
              <span
                className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                  boxShadow:
                    '0 4px 10px -2px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
                }}
              >
                Today
              </span>
            )}
          </div>
        </div>
      </div>

      <DayCell
        date={anchor}
        tasks={tasks}
        onOpen={onOpen}
        onCycleColor={onCycleColor}
        size="xl"
        onClickCell={() => {}}
      />

      <Glass variant="panel" className="p-4 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-slate-700">
            Subtasks for this day
          </h3>
          <span className="text-[11px] text-slate-500">{rollup.length}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {rollup.length === 0 && (
            <div className="text-[11px] text-slate-400 italic px-2 py-3 text-center">
              No subtasks logged for this day yet.
            </div>
          )}
          {rollup.map(({ task, sub }) => (
            <div
              key={`${task._id}-${sub.id}`}
              className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/35 border border-white/45 hover:bg-white/50 transition"
            >
              <input
                type="checkbox"
                checked={!!sub.done}
                onChange={() => onToggleSubtask(task._id, sub.id)}
                className="size-3.5 accent-violet-500"
              />
              <span
                className="size-2 rounded-full shrink-0"
                style={{ background: task.color }}
                aria-hidden
              />
              <span className="text-[11px] text-slate-500 truncate max-w-[8rem]">
                {task.title}
              </span>
              <span className="text-slate-400 text-[11px]">·</span>
              <span
                className={`text-xs flex-1 truncate ${
                  sub.done ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {sub.title}
              </span>
              <button
                type="button"
                onClick={() => onRemoveSubtask(task._id, sub.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 text-sm transition"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="flex gap-2 pt-2 border-t border-white/40"
        >
          <select
            value={pickTaskId}
            onChange={(e) => setPickTaskId(e.target.value)}
            className="text-xs px-2 py-1.5 bg-white/40 border border-white/50 rounded-lg focus:bg-white/60 focus:outline-none max-w-[10rem] truncate"
          >
            <option value="">Pick a task…</option>
            {eligibleTasks.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
          <input
            value={draftSub}
            onChange={(e) => setDraftSub(e.target.value)}
            placeholder="+ subtask for this day"
            className="flex-1 text-xs px-2.5 py-1.5 bg-white/40 border border-white/50 rounded-lg placeholder:text-slate-500 focus:bg-white/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!pickTaskId || !draftSub.trim()}
            className="text-xs px-3 py-1.5 bg-violet-500 text-white rounded-lg disabled:opacity-40 hover:bg-violet-600 transition"
          >
            Add
          </button>
        </form>
      </Glass>
    </div>
  )
}
