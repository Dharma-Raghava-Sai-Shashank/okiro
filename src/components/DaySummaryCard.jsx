import { deepFor } from "../lib/colors";
import Logo from "./Logo";

export default function DaySummaryCard({ dayTasks, compact = false }) {
  const tasksWithNotes = dayTasks.filter((t) => t.notes && t.notes.trim());
  const tasksWithSubs = dayTasks.filter((t) => t.subtasks && t.subtasks.length > 0);
  const doneCount = dayTasks.filter((t) => t.done).length;

  const noteText = compact ? "text-[11px]" : "text-[13px]";
  const subText = compact ? "text-[11px]" : "text-[13px]";
  const taskLabel = compact ? "text-[10px]" : "text-xs";
  const logoSize = compact ? 11 : 13;
  const bodyPad = compact ? "py-3 gap-2" : "py-4 gap-3";
  const subsPad = compact ? "py-3 gap-2.5" : "py-4 gap-3.5";
  const MAX_SUBS = compact ? 3 : Infinity;

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(255,255,255,0.65)",
        boxShadow: "0 4px 16px -8px rgba(30,64,175,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-2.5"
        style={{ background: "rgba(248,250,255,0.8)", borderBottom: "1px solid rgba(15,23,42,0.05)" }}
      >
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Summary
        </span>
        <div className="flex items-center gap-1 ml-auto">
          {dayTasks.slice(0, 10).map((t) => {
            const tint = t.color || "#ede9fe";
            const deep = deepFor(tint);
            return <Logo key={t._id} size={13} tint={tint} deep={deep} title={t.title} />;
          })}
        </div>
        {dayTasks.length > 0 && (
          <span className="text-[11px] font-bold text-slate-400 tabular-nums shrink-0 ml-2">
            {doneCount}
            <span className="font-normal text-slate-300">/{dayTasks.length}</span>
          </span>
        )}
      </div>

      {/* Body — two columns */}
      <div className={`grid divide-x divide-black/[0.04] grid-cols-[3fr_2fr]`}>

        {/* Left — Notes */}
        <div className={`px-5 flex flex-col ${bodyPad}`}>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
            Notes
          </span>
          {tasksWithNotes.length === 0 && (
            <span className={`${noteText} text-slate-300 italic`}>No notes</span>
          )}
          {tasksWithNotes.map((t) => {
            const tint = t.color || "#ede9fe";
            const deep = deepFor(tint);
            return (
              <div
                key={`note-${t._id}`}
                className={`pl-3 ${noteText} text-slate-700 leading-relaxed`}
                style={{ borderLeft: `2.5px solid ${deep}` }}
              >
                {t.notes}
              </div>
            );
          })}
        </div>

        {/* Right — Subtasks grouped by task */}
        <div className={`px-5 flex flex-col ${subsPad}`}>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
            Subtasks
          </span>
          {tasksWithSubs.length === 0 && (
            <span className={`${subText} text-slate-300 italic`}>No subtasks</span>
          )}
          {tasksWithSubs.map((t) => {
            const tint = t.color || "#ede9fe";
            const deep = deepFor(tint);
            const subs = MAX_SUBS === Infinity ? t.subtasks : t.subtasks.slice(0, MAX_SUBS);
            const overflow = t.subtasks.length - subs.length;
            return (
              <div key={`group-${t._id}`} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Logo size={logoSize} tint={tint} deep={deep} />
                  <span
                    className={`${taskLabel} font-semibold tracking-tight truncate`}
                    style={{ color: deep }}
                  >
                    {t.title}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 pl-4">
                  {subs.map((s) => (
                    <div key={`sub-${s.id}`} className="flex items-start gap-2">
                      <div
                        className="mt-[4px] w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: deep, opacity: 0.6 }}
                      />
                      <span className={`${subText} text-slate-600 leading-snug`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                  {overflow > 0 && (
                    <span className="text-[10px] text-slate-300 italic pl-2.5">
                      +{overflow} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
