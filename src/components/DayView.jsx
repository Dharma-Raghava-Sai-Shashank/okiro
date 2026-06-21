import { useState } from "react";
import DayCell from "./DayCell";
import DaySummaryCard from "./DaySummaryCard";
import Logo from "./Logo";
import { motion } from "framer-motion";
import { deepFor, midFor } from "../lib/colors";
import { keyForDay, labelWeekShort } from "../lib/dates";
import { isToday } from "../lib/dates";
import { format } from "date-fns";

export default function DayView({
  anchor,
  tasks,
  onOpen,
  onCycleColor,
  onAddTask,
}) {
  const dayKey = keyForDay(anchor);
  const today = isToday(anchor);

  const rollup = [];
  for (const task of tasks) {
    for (const sub of task.subtasks || []) {
      if (sub.date === dayKey) rollup.push({ task, sub });
    }
  }

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");

  const dayTasks = tasks
    .filter((t) => t.scope === "day" && t.bucketKey === dayKey)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleQuickAdd = async () => {
    const title = quickTitle.trim();
    if (!title) return;
    if (onAddTask) await onAddTask(title, { scope: "day", bucketKey: dayKey });
    setQuickTitle("");
    setShowQuickAdd(false);
  };

  // Progress ring arcs
  const progressData = (() => {
    const trackArcs = [];
    const arcs = [];
    const markers = [];
    if (!dayTasks || dayTasks.length === 0) return { trackArcs, arcs, markers };

    const GAP = dayTasks.length > 1 ? 3 : 0;
    let acc = 0;

    dayTasks.forEach((task) => {
      const segmentSize = 360 / dayTasks.length;
      const taskSubs = (task.subtasks || []).filter((s) => s.date === dayKey);
      const completedSubs = taskSubs.filter((s) => s.done).length;
      const taskProgress =
        taskSubs.length > 0
          ? (completedSubs / taskSubs.length) * 100
          : task.done ? 100 : 0;

      const tint = task.color || "#ede9fe";
      const deep = deepFor(tint);
      const startAngle = acc + GAP / 2;
      const endAngle = acc + segmentSize - GAP / 2;
      const segLen = endAngle - startAngle;

      const tsRad = ((startAngle - 90) * Math.PI) / 180;
      const teRad = ((endAngle - 90) * Math.PI) / 180;
      const tx1 = 80 + 70 * Math.cos(tsRad);
      const ty1 = 80 + 70 * Math.sin(tsRad);
      const tx2 = 80 + 70 * Math.cos(teRad);
      const ty2 = 80 + 70 * Math.sin(teRad);
      trackArcs.push(
        <path
          key={`track-${task._id}`}
          d={`M ${tx1} ${ty1} A 70 70 0 ${segLen > 180 ? 1 : 0} 1 ${tx2} ${ty2}`}
          fill="none"
          stroke={tint}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.4"
        />,
      );

      const filledSegment = (segLen * taskProgress) / 100;
      if (filledSegment > 0.5) {
        const psRad = ((startAngle - 90) * Math.PI) / 180;
        const peRad = ((startAngle + filledSegment - 90) * Math.PI) / 180;
        const x1 = 80 + 70 * Math.cos(psRad);
        const y1 = 80 + 70 * Math.sin(psRad);
        const x2 = 80 + 70 * Math.cos(peRad);
        const y2 = 80 + 70 * Math.sin(peRad);
        arcs.push(
          <path
            key={`arc-${task._id}`}
            d={`M ${x1} ${y1} A 70 70 0 ${filledSegment > 180 ? 1 : 0} 1 ${x2} ${y2}`}
            fill="none"
            stroke={midFor(tint)}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.95"
          />,
        );

        const midAngle = startAngle + filledSegment / 2;
        const midRad = ((midAngle - 90) * Math.PI) / 180;
        const mx = 80 + 70 * Math.cos(midRad);
        const my = 80 + 70 * Math.sin(midRad);
        markers.push({ id: task._id, left: (mx / 160) * 100, top: (my / 160) * 100, tint, deep });
      }

      acc += segmentSize;
    });
    return { trackArcs, arcs, markers };
  })();

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="rounded-2xl border border-white/60 p-4 bg-white/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-slate-900">
              {format(anchor, "EEEE d MMMM yyyy")}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {labelWeekShort(anchor)}{" "}
              {today && (
                <span
                  className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style={{
                    background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
                    boxShadow: "0 4px 10px -2px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.55)",
                  }}
                >
                  Today
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-sm">
              <div className="text-slate-600">
                Tasks: <span className="font-bold text-slate-900">{dayTasks.length}</span>
              </div>
              <div className="text-slate-600">
                Subtasks: <span className="font-bold text-slate-900">{rollup.length}</span>
              </div>
              <div className="text-slate-600">
                Done: <span className="font-bold text-emerald-600">{dayTasks.filter((t) => t.done).length}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowQuickAdd((s) => !s)}
              className="text-sm font-semibold px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-400 to-indigo-500 text-white shadow-sm hover:scale-105 transition"
            >
              {showQuickAdd ? "✕ Close" : "+ New"}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      {showQuickAdd && (
        <div
          className="rounded-2xl px-5 py-4"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 4px 20px -8px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              New Task
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuickAdd();
                if (e.key === "Escape") setShowQuickAdd(false);
              }}
              placeholder="Name your next task for today…"
              className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl placeholder:text-slate-300 text-slate-800 focus:outline-none transition-all"
              style={{
                background: "rgba(248,250,255,0.9)",
                border: "1.5px solid rgba(199,210,254,0.6)",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(199,210,254,0.6)"; e.target.style.boxShadow = "none"; }}
              autoFocus
            />
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!quickTitle.trim()}
              className="shrink-0 text-xs font-bold px-5 py-2.5 rounded-xl text-white transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                boxShadow: "0 4px 12px -3px rgba(124,58,237,0.4)",
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setShowQuickAdd(false); setQuickTitle(""); }}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 transition"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Row 1: Task list + Progress ring side by side */}
      <div className="flex gap-10 items-stretch">
        {/* Task list — half the container width */}
        <div className="w-1/2 min-w-0 shrink-0 flex flex-col">
          <DayCell
            date={anchor}
            tasks={tasks}
            onOpen={onOpen}
            onCycleColor={onCycleColor}
            size="xl"
            onClickCell={() => {}}
          />
        </div>

        {/* Progress ring — square card */}
        {dayTasks.length > 0 && (
          <div
            className="flex-1 min-w-0 rounded-2xl p-3 flex flex-col items-center justify-center overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 4px 20px -8px rgba(99,102,241,0.10), 0 1px 6px -2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Logo
                size={16}
                tint={dayTasks[0]?.color || "#ede9fe"}
                deep={deepFor(dayTasks[0]?.color || "#ede9fe")}
              />
              <h3 className="text-sm font-semibold text-slate-500 tracking-tight">
                Daily Progress
              </h3>
            </div>

            <div className="relative w-44 h-44 mb-3">
              <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                {progressData.trackArcs}
                {progressData.arcs}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Logo
                    size={44}
                    tint={dayTasks[0]?.color || "#ede9fe"}
                    deep={deepFor(dayTasks[0]?.color || "#ede9fe")}
                  />
                </motion.div>
                <div className="text-2xl font-bold text-slate-800 tabular-nums -mt-1">
                  {Math.round((dayTasks.filter((t) => t.done).length / dayTasks.length) * 100)}%
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {dayTasks.filter((t) => t.done).length}/{dayTasks.length}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {dayTasks.slice(0, 10).map((task) => {
                const tint = task.color || "#ede9fe";
                const deep = deepFor(tint);
                return (
                  <div
                    key={`leg-${task._id}`}
                    title={task.title}
                    className="flex items-center justify-center w-9 h-9 rounded-full"
                    style={{ background: `${tint}60`, border: `1px solid ${tint}` }}
                  >
                    <Logo size={18} tint={tint} deep={deep} />
                  </div>
                );
              })}
              {dayTasks.length > 10 && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 bg-white/60 border border-slate-200">
                  +{dayTasks.length - 10}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Summary — more inset, visually centered */}
      <div className="px-40">
        <DaySummaryCard date={anchor} dayTasks={dayTasks} />
      </div>
    </div>
  );
}
