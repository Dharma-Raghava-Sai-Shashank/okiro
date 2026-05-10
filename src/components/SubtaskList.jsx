import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { dayFromKey } from '../lib/dates'

function groupByDate(subtasks) {
  const groups = new Map()
  for (const s of subtasks || []) {
    const key = s.date || ''
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(s)
  }
  const sorted = Array.from(groups.entries()).sort((a, b) => {
    if (!a[0]) return 1
    if (!b[0]) return -1
    return b[0].localeCompare(a[0])
  })
  return sorted
}

function dateLabel(key) {
  if (!key) return 'Unscheduled'
  const d = dayFromKey(key)
  if (!d) return key
  return format(d, 'EEE d MMM')
}

export default function SubtaskList({
  subtasks,
  defaultDate,
  onAdd,
  onToggle,
  onEdit,
  onRemove,
}) {
  const [draftDate, setDraftDate] = useState(defaultDate || '')
  const [draftTitle, setDraftTitle] = useState('')
  const groups = useMemo(() => groupByDate(subtasks), [subtasks])

  const submit = (e) => {
    e.preventDefault()
    if (!draftTitle.trim()) return
    onAdd(draftTitle.trim(), draftDate)
    setDraftTitle('')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1">
        {groups.length === 0 && (
          <div className="text-[12px] text-slate-400 italic py-3 px-2 text-center bg-white/30 rounded-xl border border-white/40">
            No subtasks yet. Add one below — they're independent and freely
            dated.
          </div>
        )}
        {groups.map(([dateKey, items]) => (
          <div key={dateKey || 'none'} className="flex flex-col gap-1">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium px-1">
              {dateLabel(dateKey)}
            </div>
            <div className="flex flex-col gap-1">
              {items.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/35 border border-white/45 hover:bg-white/55 transition"
                >
                  <input
                    type="checkbox"
                    checked={!!s.done}
                    onChange={() => onToggle(s.id)}
                    className="size-3.5 accent-violet-500"
                  />
                  <input
                    value={s.title}
                    onChange={(e) => onEdit(s.id, { title: e.target.value })}
                    className={`flex-1 bg-transparent text-sm focus:outline-none ${
                      s.done ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(s.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="flex gap-2 items-stretch pt-2 border-t border-white/50"
      >
        <input
          type="date"
          value={draftDate}
          onChange={(e) => setDraftDate(e.target.value)}
          className="text-xs px-2 py-2 bg-white/40 border border-white/50 rounded-lg focus:bg-white/60 focus:outline-none"
        />
        <input
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          placeholder="+ add subtask"
          className="flex-1 text-sm px-3 py-2 bg-white/40 border border-white/50 rounded-lg placeholder:text-slate-500 focus:bg-white/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!draftTitle.trim()}
          className="text-xs px-3 bg-violet-500 text-white rounded-lg disabled:opacity-40 hover:bg-violet-600 transition"
        >
          Add
        </button>
      </form>
    </div>
  )
}
