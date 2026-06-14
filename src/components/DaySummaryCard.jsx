import { format } from 'date-fns'
import { deepFor } from '../lib/colors'

export default function DaySummaryCard({ date, dayTasks }) {
  // Extract all notes
  const tasksWithNotes = dayTasks.filter((t) => t.notes && t.notes.trim() !== '')

  // Extract next subtasks (undone ones)
  const allSubtasks = dayTasks.flatMap(t => 
    (t.subtasks || [])
      .filter(s => !s.done)
      .map(s => ({ ...s, parentTask: t }))
  )
  
  // Sort or just take all of them? The user said "all combined notes and next combines taks if any there"
  const pendingSubtasks = allSubtasks.slice(0, 5) // Show up to 5 pending subtasks

  const primaryTint = dayTasks.length > 0 ? (dayTasks[0].color || '#ede9fe') : null
  
  const baseBg = 'linear-gradient(170deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 252, 255, 0.95) 50%, rgba(255, 255, 255, 0.92) 100%)'
  
  const cardBorder = '1px solid rgba(255, 255, 255, 0.6)'

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border transition-all overflow-hidden min-h-[6rem] p-3`}
      style={{
        background: baseBg,
        border: cardBorder,
        boxShadow: '0 6px 22px -12px rgba(30, 64, 175, 0.22), 0 2px 6px -2px rgba(96, 165, 250, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(15, 23, 42, 0.05)',
      }}
    >
      <div className="flex items-start justify-between mb-2 relative z-[1]">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Summary
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto pr-0.5 relative z-[1]">
        {tasksWithNotes.length === 0 && allSubtasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
             <span className="text-[10px] text-slate-400 font-medium tracking-wide italic">
               No notes or pending subtasks
             </span>
          </div>
        )}

        {tasksWithNotes.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-0.5">Notes</span>
            {tasksWithNotes.map(t => {
              const tint = t.color || '#ede9fe'
              const deep = deepFor(tint)
              return (
                <div key={`note-${t._id}`} className="text-[11px] text-slate-600 leading-relaxed bg-white/60 p-1.5 rounded border border-slate-100" style={{ borderLeft: `2px solid ${deep}`}}>
                  {t.notes}
                </div>
              )
            })}
          </div>
        )}

        {pendingSubtasks.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-0.5">Next Subtasks</span>
            {pendingSubtasks.map(s => {
              const tint = s.parentTask.color || '#ede9fe'
              const deep = deepFor(tint)
              return (
                <div key={`sub-${s.id}`} className="flex items-center gap-1.5 text-[11px] text-slate-700 bg-white/60 p-1.5 rounded border border-slate-100">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: deep }} />
                  <div className="truncate flex-1">
                    {s.title}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Hover sheen */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'linear-gradient(125deg, transparent 35%, rgba(255, 255, 255, 0.18) 50%, transparent 65%)',
        }}
      />
    </div>
  )
}
