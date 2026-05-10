import DayCell from './DayCell'
import { daysOfWeek } from '../lib/dates'
import { format } from 'date-fns'

export default function WeekView({
  anchor,
  tasks,
  onOpen,
  onCycleColor,
  onPickDay,
}) {
  const days = daysOfWeek(anchor)
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((d) => (
        <div key={d.toISOString()} className="flex flex-col gap-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 text-center font-medium">
            {format(d, 'EEE d MMM')}
          </div>
          <DayCell
            date={d}
            tasks={tasks}
            onOpen={onOpen}
            onCycleColor={onCycleColor}
            onClickCell={onPickDay}
            size="lg"
          />
        </div>
      ))}
    </div>
  )
}
