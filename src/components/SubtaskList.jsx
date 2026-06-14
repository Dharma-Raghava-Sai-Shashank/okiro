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
  accentColor = '#ede9fe',
  accentDeep = '#8b5cf6',
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
          <div
            className="text-[12px] text-slate-400 italic py-4 px-3 text-center rounded-xl"
            style={{
              background: 'rgba(15, 23, 42, 0.03)',
              border: '1.5px dashed rgba(15, 23, 42, 0.1)',
            }}
          >
            No subtasks yet. Add one below — they're independent and freely
            dated.
          </div>
        )}
        {groups.map(([dateKey, items]) => (
          <div key={dateKey || 'none'} className="flex flex-col gap-1.5">
            {/* Date group header as styled pill badge */}
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: `${accentColor}80`,
                  color: accentDeep,
                  letterSpacing: '0.1em',
                }}
              >
                {dateLabel(dateKey)}
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background: `linear-gradient(90deg, ${accentColor}60, transparent)`,
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              {items.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/60 transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderLeft: `3px solid ${accentDeep}55`,
                  }}
                >
                  {/* Custom styled checkbox */}
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!s.done}
                      onChange={() => onToggle(s.id)}
                      className="sr-only peer"
                    />
                    <div
                      className="size-[18px] rounded-md border-2 transition-all peer-checked:border-transparent grid place-items-center"
                      style={{
                        borderColor: s.done ? 'transparent' : `${accentDeep}50`,
                        background: s.done
                          ? `linear-gradient(135deg, ${accentDeep}, ${accentDeep}cc)`
                          : 'rgba(255,255,255,0.6)',
                        boxShadow: s.done
                          ? `0 2px 6px -1px ${accentDeep}44`
                          : 'inset 0 1px 2px rgba(0,0,0,0.06)',
                      }}
                    >
                      {s.done && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2 5L4.2 7.5L8 3"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </label>

                  <input
                    value={s.title}
                    onChange={(e) => onEdit(s.id, { title: e.target.value })}
                    className={`flex-1 bg-transparent text-sm focus:outline-none ${
                      s.done ? 'text-slate-400' : 'text-slate-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(s.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition size-6 grid place-items-center rounded-lg hover:bg-rose-50"
                    aria-label="Remove"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="flex gap-2 items-stretch pt-3"
        style={{
          borderTop: `1px solid ${accentColor}60`,
        }}
      >
        <input
          type="date"
          value={draftDate}
          onChange={(e) => setDraftDate(e.target.value)}
          className="text-xs px-2.5 py-2 rounded-xl focus:outline-none transition"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            border: `1.5px solid ${accentColor}80`,
          }}
        />
        <input
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          placeholder="+ add subtask"
          className="flex-1 text-sm px-3 py-2 rounded-xl placeholder:text-slate-400 focus:outline-none transition"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            border: `1.5px solid ${accentColor}80`,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = accentDeep + '60'
            e.target.style.boxShadow = `0 0 0 3px ${accentColor}40`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = accentColor + '80'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button
          type="submit"
          disabled={!draftTitle.trim()}
          className="text-xs font-bold px-4 text-white rounded-xl disabled:opacity-40 hover:scale-105 active:scale-95 transition shadow-md"
          style={{
            background: `linear-gradient(135deg, ${accentDeep}cc, ${accentDeep})`,
            boxShadow: `0 3px 10px -2px ${accentDeep}55`,
          }}
        >
          Add
        </button>
      </form>
    </div>
  )
}
