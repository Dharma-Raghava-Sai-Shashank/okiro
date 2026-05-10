import {
  format,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  getISOWeek,
} from 'date-fns'
import Logo from './Logo'

const SCOPES = [
  { key: 'year', label: 'Year' },
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
]

function buildBreadcrumb(scope, anchor) {
  const items = [{ scope: 'year', label: format(anchor, 'yyyy') }]
  if (scope !== 'year') {
    items.push({ scope: 'month', label: format(anchor, 'MMM') })
  }
  if (scope === 'week' || scope === 'day') {
    items.push({ scope: 'week', label: `Week ${getISOWeek(anchor)}` })
  }
  if (scope === 'day') {
    items.push({ scope: 'day', label: format(anchor, 'EEE d MMM') })
  }
  return items
}

function anchorLabel(scope, anchor) {
  switch (scope) {
    case 'year':
      return format(anchor, 'yyyy')
    case 'month':
      return format(anchor, 'MMMM yyyy')
    case 'week': {
      const s = startOfWeek(anchor, { weekStartsOn: 1 })
      const e = endOfWeek(anchor, { weekStartsOn: 1 })
      const range = isSameMonth(s, e)
        ? `${format(s, 'd')}–${format(e, 'd MMM yyyy')}`
        : `${format(s, 'd MMM')}–${format(e, 'd MMM yyyy')}`
      return `Week ${getISOWeek(anchor)} · ${range}`
    }
    case 'day':
      return format(anchor, 'EEEE d MMMM yyyy')
    default:
      return ''
  }
}

export default function ScopeNav({ scope, anchor, onScope, onStep, onToday }) {
  const crumbs = buildBreadcrumb(scope, anchor)
  return (
    <div className="sticky top-2 z-40 pb-3">
      <div
        className="relative rounded-2xl border border-white/80 px-4 py-3 flex flex-col gap-3"
        style={{
          background:
            'linear-gradient(170deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.6) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          boxShadow:
            '0 14px 44px -14px rgba(30, 64, 175, 0.30), 0 4px 12px -6px rgba(96, 165, 250, 0.22), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(15, 23, 42, 0.06), inset 0 22px 38px -28px rgba(255, 255, 255, 0.9)',
        }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="size-9 rounded-xl grid place-items-center shadow-md border border-white/80"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(219,234,254,0.85) 100%)',
                }}
              >
                <Logo size={22} />
              </div>
              <div className="leading-tight">
                <div className="text-[16px] font-bold tracking-tight text-slate-900">
                  Okiro
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  rise · log · done
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-2xl border border-white/70 p-1 ml-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_8px_-4px_rgba(15,23,42,0.1)]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)',
              }}
            >
              {SCOPES.map((s) => {
                const active = s.key === scope
                return (
                  <button
                    key={s.key}
                    onClick={() => onScope(s.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
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
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStep(-1)}
              className="size-9 grid place-items-center rounded-xl bg-white/60 border border-white/70 hover:bg-white/85 hover:scale-105 transition text-slate-700 shadow-sm"
              aria-label="Previous"
            >
              ‹
            </button>
            <div className="text-sm font-bold tracking-tight text-slate-900 min-w-[12rem] text-center px-2">
              {anchorLabel(scope, anchor)}
            </div>
            <button
              onClick={() => onStep(1)}
              className="size-9 grid place-items-center rounded-xl bg-white/60 border border-white/70 hover:bg-white/85 hover:scale-105 transition text-slate-700 shadow-sm"
              aria-label="Next"
            >
              ›
            </button>
            <button
              onClick={onToday}
              className="ml-2 px-3.5 py-2 text-xs font-bold rounded-xl text-white shadow-[0_4px_12px_-2px_rgba(59,130,246,0.45),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_6px_18px_-2px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.55)] hover:scale-105 transition"
              style={{
                background:
                  'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)',
              }}
            >
              Today
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          {crumbs.map((c, i) => (
            <span key={c.scope} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300" aria-hidden>›</span>}
              <button
                onClick={() => onScope(c.scope)}
                className={`hover:text-slate-900 transition ${
                  c.scope === scope ? 'text-slate-900 font-semibold' : ''
                }`}
              >
                {c.label}
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
