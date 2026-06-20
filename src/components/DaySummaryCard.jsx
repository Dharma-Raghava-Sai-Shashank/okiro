import { deepFor } from "../lib/colors";
import Logo from "./Logo";

export default function DaySummaryCard({ date, dayTasks }) {
  const tasksWithNotes = dayTasks.filter((t) => t.notes && t.notes.trim());
  const allSubtasks = dayTasks.flatMap((t) =>
    (t.subtasks || []).map((s) => ({ ...s, parentTask: t })),
  );
  const doneCount = dayTasks.filter((t) => t.done).length;

  const isEmpty = tasksWithNotes.length === 0 && allSubtasks.length === 0;

  return (
    <div
      className="flex flex-col rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow:
          "0 4px 16px -8px rgba(30,64,175,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {/* Single-line stat row */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Summary
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          {dayTasks.slice(0, 8).map((t) => {
            const tint = t.color || "#ede9fe";
            const deep = deepFor(tint);
            return (
              <Logo key={t._id} size={14} tint={tint} deep={deep} title={t.title} />
            );
          })}
        </div>
        {dayTasks.length > 0 && (
          <span className="text-[11px] font-bold text-slate-500 tabular-nums shrink-0">
            {doneCount}/{dayTasks.length}
          </span>
        )}
      </div>

      <div
        className="h-px mx-3"
        style={{ background: "rgba(15,23,42,0.06)" }}
      />

      {/* Body */}
      <div className="flex flex-col gap-0 px-4 py-3 min-h-[3rem]">
        {isEmpty && (
          <span className="text-[11px] text-slate-400 italic">
            No notes or subtasks
          </span>
        )}

        {/* Notes — one per task, plain text with left accent */}
        {tasksWithNotes.map((t) => {
          const tint = t.color || "#ede9fe";
          const deep = deepFor(tint);
          return (
            <div
              key={`note-${t._id}`}
              className="mb-2 pl-2.5 text-[11px] text-slate-600 leading-relaxed"
              style={{ borderLeft: `2px solid ${deep}` }}
            >
              {t.notes}
            </div>
          );
        })}

        {/* Subtasks — tight list */}
        {allSubtasks.slice(0, 5).map((s) => {
          const tint = s.parentTask.color || "#ede9fe";
          const deep = deepFor(tint);
          return (
            <div key={`sub-${s.id}`} className="flex items-center gap-2 py-0.5">
              <Logo size={11} tint={tint} deep={deep} />
              <span className="text-[11px] text-slate-600 truncate">{s.title}</span>
            </div>
          );
        })}
        {allSubtasks.length > 5 && (
          <span className="text-[10px] text-slate-400 italic mt-0.5">
            +{allSubtasks.length - 5} more
          </span>
        )}
      </div>
    </div>
  );
}
