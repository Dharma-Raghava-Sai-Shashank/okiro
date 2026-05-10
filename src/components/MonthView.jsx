import DayCell from './DayCell'
import { daysOfMonthGrid, WEEKDAY_HEADERS } from '../lib/dates'

export default function MonthView({
  anchor,
  tasks,
  onOpen,
  onCycleColor,
  onPickDay,
}) {
  const days = daysOfMonthGrid(anchor)
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-2 px-1">
        {WEEKDAY_HEADERS.map((d) => (
          <div
            key={d}
            className="text-[11px] uppercase tracking-wider text-slate-500 text-center font-medium"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => (
          <DayCell
            key={d.toISOString()}
            date={d}
            tasks={tasks}
            onOpen={onOpen}
            onCycleColor={onCycleColor}
            onClickCell={onPickDay}
            size="md"
            monthAnchor={anchor}
          />
        ))}
      </div>
    </div>
  )
}
