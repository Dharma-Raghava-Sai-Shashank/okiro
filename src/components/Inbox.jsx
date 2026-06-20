import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import TaskChip from "./TaskChip";

function TrashZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: "drop:trash",
    data: { type: "trash" },
  });
  return (
    <motion.div
      ref={setNodeRef}
      animate={isOver ? { scale: 1.04 } : { scale: 1 }}
      className={`mt-2 rounded-2xl border-2 border-dashed text-center py-3 text-xs font-semibold transition-all ${
        isOver
          ? "border-rose-400/80 text-rose-700"
          : "border-white/60 text-slate-500"
      }`}
      style={{
        background: isOver
          ? "linear-gradient(135deg, rgba(254, 226, 226, 0.7) 0%, rgba(252, 165, 165, 0.5) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.35) 100%)",
      }}
    >
      <span className="mr-1" aria-hidden>
        🗑
      </span>
      Drag here to delete
    </motion.div>
  );
}

function InboxDropZone({ children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "drop:inbox",
    data: { type: "inbox" },
  });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-0 overflow-y-auto rounded-xl px-4 py-1 transition ${
        isOver ? "bg-white/40 ring-2 ring-violet-300/60" : ""
      }`}
    >
      {children}
    </div>
  );
}

function InboxTabHeader({ tab, active, count, onClick }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop:inbox-tab-${tab}`,
    data: { type: "inbox-tab", tab },
  });

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={`flex-1 relative py-2 text-xs font-bold rounded-xl transition-all duration-300 select-none cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none ${
        active
          ? "text-violet-700 bg-white shadow-sm border border-violet-100/50"
          : "text-slate-500 hover:text-slate-800 hover:bg-white/45"
      } ${
        isOver
          ? "scale-105 ring-2 ring-violet-400/50 bg-violet-50/65 text-violet-700 border-violet-200"
          : ""
      }`}
    >
      <span className="relative z-10">{tab}</span>
      {count > 0 && (
        <span
          className={`relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors duration-300 ${
            active
              ? "bg-violet-100 text-violet-700"
              : "bg-white/60 text-slate-500 border border-slate-200/20"
          }`}
        >
          {count}
        </span>
      )}
      {isOver && (
        <div className="absolute inset-0 bg-violet-200/10 rounded-xl animate-pulse pointer-events-none" />
      )}
    </button>
  );
}

export default function Inbox({
  tasks,
  onAdd,
  onOpen,
  onCycleColor,
  onClickUsername,
  activeTab = "Present",
  onTabChange,
}) {
  const [draft, setDraft] = useState("");
  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("okiro_username") || "okiro"
      : "okiro";

  const inboxTasks = tasks
    .filter((t) => {
      if (t.scope !== "inbox") return false;
      const tTab = t.bucketKey || "Present";
      return tTab === activeTab;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getTabCount = (tabName) => {
    return tasks.filter((t) => {
      if (t.scope !== "inbox") return false;
      const tTab = t.bucketKey || "Present";
      return tTab === tabName;
    }).length;
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case "Achived":
        return (
          <>
            No achived global goals yet.
            <br />
            Drag a goal here to archive it.
          </>
        );
      case "Future":
        return (
          <>
            No future goals yet.
            <br />
            Plan ahead by adding future goals here!
          </>
        );
      case "Present":
      default:
        return (
          <>
            No present globals yet.
            <br />
            Add a goal above, then drag it onto any day.
          </>
        );
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onAdd(draft.trim(), { bucketKey: activeTab });
    setDraft("");
  };

  return (
    <div
      id="okiro-flame-target"
      className="flex flex-col h-full w-full overflow-hidden rounded-3xl border border-white/70 relative"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.78) 50%, rgba(255,255,255,0.68) 100%)",
        boxShadow:
          "0 24px 64px -20px rgba(30, 64, 175, 0.32), 0 6px 18px -8px rgba(96, 165, 250, 0.22), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(15, 23, 42, 0.06)",
      }}
    >
      <div
        className="px-5 pt-5 pb-3 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(186, 230, 253, 0.30) 0%, rgba(147, 197, 253, 0.22) 50%, rgba(96, 165, 250, 0.18) 100%)",
        }}
      >
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onClickUsername?.()
                }}
                className="text-lg font-extrabold hover:text-indigo-600 transition-colors cursor-pointer group"
                title="Click to switch workspace"
              >
                @{username}
                <span className="inline-block ml-1.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">✎</span>
              </button>
            </h2>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Workspace
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 rounded-full bg-white/60 border border-white/70 shadow-sm">
            {inboxTasks.length}
          </span>
        </div>

        <form onSubmit={submit}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`+ new ${activeTab.toLowerCase()} goal…`}
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-white/70 border border-white/80 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_8px_-4px_rgba(15,23,42,0.1)] placeholder:text-slate-400 placeholder:font-normal focus:bg-white/90 focus:border-violet-300 focus:ring-2 focus:ring-violet-200/60 focus:outline-none transition"
          />
        </form>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-3 pb-4 pt-2 gap-2">
        <div className="flex p-1 gap-1 bg-slate-900/5 rounded-2xl border border-slate-950/5 mb-1">
          {["Achived", "Present", "Future"].map((tab) => (
            <InboxTabHeader
              key={tab}
              tab={tab}
              active={activeTab === tab}
              count={getTabCount(tab)}
              onClick={() => onTabChange(tab)}
            />
          ))}
        </div>

        <InboxDropZone>
          <div className="flex flex-col gap-1.5">
            {inboxTasks.length === 0 && (
              <div className="text-[12px] text-slate-400 italic px-3 py-6 text-center leading-relaxed">
                {getEmptyStateMessage()}
              </div>
            )}
            {inboxTasks.map((t) => (
              <TaskChip
                key={t._id}
                task={t}
                size="sm"
                onOpen={onOpen}
                onCycleColor={onCycleColor}
                fromBucketKey={null}
              />
            ))}
          </div>
        </InboxDropZone>

        <TrashZone />
      </div>
    </div>
  );
}
