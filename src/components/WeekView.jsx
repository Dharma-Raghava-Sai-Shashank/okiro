import DayCell from './DayCell'
import TaskFlameCard from './TaskFlameCard'
import DaySummaryCard from './DaySummaryCard'
import { daysOfWeek, keyForDay, isToday } from '../lib/dates'

export default function WeekView({
  anchor,
  tasks,
  onOpen,
  onCycleColor,
  onPickDay,
}) {
  const days = daysOfWeek(anchor)

  return (
    <div className="flex flex-col gap-2.5 max-w-5xl mx-auto w-full">
      {days.map((d) => {
        const dayKey = keyForDay(d)
        const today = isToday(d)
        const dayTasks = tasks
          .filter((t) => t.scope === 'day' && t.bucketKey === dayKey)
          .sort((a, b) => (a.order || 0) - (b.order || 0))

        return (
          <div key={d.toISOString()} className="group flex items-stretch gap-4" data-today={today ? 'true' : undefined}>
            {/* Square: Dynamic Flame Card — vertically centered */}
            <TaskFlameCard
              date={d}
              dayTasks={dayTasks}
              onClickCell={onPickDay}
            />

            {/* Rectangle: Task list card — 30% width */}
            <div className="w-[30%] shrink-0">
              <DayCell
                date={d}
                tasks={tasks}
                onOpen={onOpen}
                onCycleColor={onCycleColor}
                onClickCell={onPickDay}
                size="week"
              />
            </div>

            {/* Summary Card — takes remaining space */}
            <div className="flex-1 min-w-0">
              <DaySummaryCard date={d} dayTasks={dayTasks} compact />
            </div>
          </div>
        )
      })}
    </div>
  )
}
