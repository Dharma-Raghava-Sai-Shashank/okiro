import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { startOfDay, startOfMonth } from 'date-fns'
import AuroraBackground from './components/AuroraBackground'
import FlameBackground from './components/FlameBackground'
import Inbox from './components/Inbox'
import ScopeNav from './components/ScopeNav'
import YearView from './components/YearView'
import MonthView from './components/MonthView'
import WeekView from './components/WeekView'
import DayView from './components/DayView'
import TaskChip from './components/TaskChip'
import TaskDetailModal from './components/TaskDetailModal'
import { useTasks } from './hooks/useTasks'
import { stepAnchor, todayKey } from './lib/dates'

export default function App() {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    moveTask,
    removeTask,
    addSubtask,
    toggleSubtask,
    editSubtask,
    removeSubtask,
  } = useTasks()

  const [scope, setScope] = useState('month')
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()))
  const [activeChip, setActiveChip] = useState(null)
  const [openTaskId, setOpenTaskId] = useState(null)
  const [openContextDate, setOpenContextDate] = useState(null)
  const [yearMode, setYearMode] = useState('cards')

  const isYearCalendar = scope === 'year' && yearMode === 'calendar'

  useEffect(() => {
    const start = performance.now()
    let rafId
    const tick = () => {
      window.dispatchEvent(new Event('resize'))
      if (performance.now() - start < 650) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => rafId && cancelAnimationFrame(rafId)
  }, [isYearCalendar])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const openTask = useMemo(
    () => tasks.find((t) => t._id === openTaskId) || null,
    [tasks, openTaskId],
  )

  const handleScope = (s) => setScope(s)
  const handleStep = (delta) => setAnchor((a) => stepAnchor(scope, a, delta))
  const handleToday = () => setAnchor(startOfDay(new Date()))

  const handlePickMonth = (m) => {
    setAnchor(startOfMonth(m))
    setScope('month')
  }
  const handlePickDay = (d) => {
    setAnchor(d)
    setScope('day')
  }

  const handleOpen = (task, fromBucketKey) => {
    setOpenTaskId(task._id)
    setOpenContextDate(fromBucketKey || todayKey())
  }

  const handleCycleColor = (task, nextC) => {
    updateTask(task._id, { color: nextC })
  }

  const onDragStart = (e) => {
    const taskId = e.active.data.current?.taskId
    const t = tasks.find((x) => x._id === taskId)
    if (t) setActiveChip(t)
  }

  const onDragEnd = (e) => {
    setActiveChip(null)
    const { active, over } = e
    if (!over) return
    const taskId = active.data.current?.taskId
    if (!taskId) return
    const sourceTask = tasks.find((t) => t._id === taskId)
    if (!sourceTask) return
    const target = over.data.current
    if (!target) return

    if (target.type === 'trash') {
      removeTask(taskId)
      return
    }
    if (target.type === 'inbox') {
      if (sourceTask.scope === 'day') {
        moveTask(taskId, 'inbox', '', Date.now())
      }
      return
    }
    if (target.type === 'day' && target.bucketKey) {
      if (sourceTask.scope === 'inbox') {
        addTask(sourceTask.title, {
          scope: 'day',
          bucketKey: target.bucketKey,
          color: sourceTask.color,
        })
      } else {
        moveTask(taskId, 'day', target.bucketKey, Date.now())
      }
    }
  }

  const renderView = () => {
    if (loading) {
      return (
        <div className="text-sm text-slate-500 italic px-4 py-12 text-center">
          Loading…
        </div>
      )
    }
    switch (scope) {
      case 'year':
        return (
          <YearView
            anchor={anchor}
            tasks={tasks}
            onPickMonth={handlePickMonth}
            onPickDay={handlePickDay}
            mode={yearMode}
            onModeChange={setYearMode}
          />
        )
      case 'month':
        return (
          <MonthView
            anchor={anchor}
            tasks={tasks}
            onOpen={handleOpen}
            onCycleColor={handleCycleColor}
            onPickDay={handlePickDay}
          />
        )
      case 'week':
        return (
          <WeekView
            anchor={anchor}
            tasks={tasks}
            onOpen={handleOpen}
            onCycleColor={handleCycleColor}
            onPickDay={handlePickDay}
          />
        )
      case 'day':
        return (
          <DayView
            anchor={anchor}
            tasks={tasks}
            onOpen={handleOpen}
            onCycleColor={handleCycleColor}
            onToggleSubtask={toggleSubtask}
            onAddSubtask={addSubtask}
            onRemoveSubtask={removeSubtask}
          />
        )
      default:
        return null
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <AuroraBackground />
      <FlameBackground />
      <div
        className={`min-h-screen w-full py-5 transition-[padding] duration-500 ease-out ${
          isYearCalendar ? 'px-3' : 'px-4 sm:px-6 lg:px-8'
        }`}
      >
        <div
          className={`mx-auto grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] h-[calc(100vh-2.5rem)] transition-[max-width,gap] duration-500 ease-out ${
            isYearCalendar
              ? 'max-w-none gap-4 lg:gap-5'
              : 'max-w-[1500px] gap-5 lg:gap-7'
          }`}
        >
          <div className="min-h-0 lg:h-full">
            <Inbox
              tasks={tasks}
              onAdd={addTask}
              onOpen={handleOpen}
              onCycleColor={handleCycleColor}
            />
          </div>

          <div className="flex flex-col gap-4 min-h-0 lg:overflow-y-auto pr-1">
            <ScopeNav
              scope={scope}
              anchor={anchor}
              onScope={handleScope}
              onStep={handleStep}
              onToday={handleToday}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-700 bg-rose-100/70 border border-rose-200 rounded-xl px-3 py-2"
              >
                {error}
              </motion.div>
            )}
            <div className="pb-6">{renderView()}</div>
          </div>
        </div>

        <TaskDetailModal
          task={openTask}
          defaultSubtaskDate={openContextDate}
          onClose={() => setOpenTaskId(null)}
          onPatch={(patch) =>
            openTask && updateTask(openTask._id, patch, { debounce: 300 })
          }
          onDelete={() => openTask && removeTask(openTask._id)}
          onAddSubtask={(title, date) =>
            openTask && addSubtask(openTask._id, title, date)
          }
          onToggleSubtask={(subId) =>
            openTask && toggleSubtask(openTask._id, subId)
          }
          onEditSubtask={(subId, patch) =>
            openTask && editSubtask(openTask._id, subId, patch)
          }
          onRemoveSubtask={(subId) =>
            openTask && removeSubtask(openTask._id, subId)
          }
        />
      </div>

      <DragOverlay>
        {activeChip ? (
          <div className="rotate-1 scale-105">
            <TaskChip task={activeChip} disableDrag size="sm" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
