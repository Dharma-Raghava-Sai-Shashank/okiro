import { useDraggable } from "@dnd-kit/core";
import { useState, useRef } from "react";
import TaskPreviewPortal from "./TaskPreviewPortal";
import { motion } from "framer-motion";
import { chipGlow, chipGradient, deepFor, nextColor } from "../lib/colors";
import Logo from "./Logo";

export default function TaskChip({
  task,
  onOpen,
  onCycleColor,
  fromBucketKey,
  size = "sm",
  showProgress = true,
  disableDrag = false,
  titleBasis,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `chip:${task._id}-${fromBucketKey || "inbox"}`,
    data: { type: "chip", taskId: task._id, fromBucketKey },
    disabled: disableDrag,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const hoverTimeout = useRef(null);

  const handleMouseEnter = (e) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimeout.current = setTimeout(() => {
      setAnchorRect(rect);
      setShowPreview(true);
    }, 250);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setShowPreview(false);
  };

  const baseTint = task.color || "#ede9fe";
  const deep = deepFor(baseTint);

  // Punchy glassmorphic styling
  const gradient = `linear-gradient(135deg, ${baseTint}f2 0%, ${deep}40 100%)`;
  const glow = `0 4px 12px -2px ${deep}50, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 ${deep}20`;

  const heights = {
    xs: "py-1 text-[11px]",
    sm: "py-1.5 text-xs",
    md: "py-2 text-sm",
  };
  const padding = { xs: "px-2", sm: "px-3", md: "px-3.5" };

  const handleClick = (e) => {
    if (e.defaultPrevented) return;
    onOpen?.(task, fromBucketKey);
  };

  const handleColorClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onCycleColor?.(task, nextColor(baseTint));
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`glass-shimmer group relative cursor-pointer select-none rounded-full overflow-hidden ${padding[size]} ${heights[size]} ${
          isDragging ? "opacity-30" : ""
        }`}
        style={{
          background: gradient,
          boxShadow: glow,
          color: "#0f172a",
          position: "relative",
          zIndex: 26,
          backdropFilter: "blur(8px)",
          border: `1px solid ${deep}44`,
        }}
        whileHover={{
          boxShadow: `0 4px 12px -2px ${deep}60, inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 ${deep}30`,
          filter: "brightness(1.05)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={handleColorClick}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-5 h-5 flex-shrink-0 flex items-center justify-center transition hover:scale-110"
            style={{ background: "transparent", border: "none", padding: 0 }}
            aria-label="Cycle color"
          >
            <Logo size={size === "md" ? 22 : 20} tint={baseTint} />
          </button>
          <span
            className="truncate font-medium tracking-tight"
            style={{
              color: "#0f172a",
              ...(titleBasis ? { flex: `1 1 ${titleBasis}` } : {}),
            }}
          >
            {task.title}
          </span>
        </div>
        {showProgress && task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-1 h-1 rounded-full bg-white/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${task.progress || 0}%`,
                background: `linear-gradient(90deg, ${deep}, ${deep}cc)`,
              }}
            />
          </div>
        )}
      </motion.div>
      <TaskPreviewPortal
        task={task}
        anchorRect={anchorRect}
        isVisible={showPreview && !isDragging}
      />
    </>
  );
}
