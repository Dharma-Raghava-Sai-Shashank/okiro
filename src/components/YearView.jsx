import YearCalendar from './YearCalendar'

export default function YearView({
  anchor,
  tasks,
  onPickMonth,
  onPickDay,
}) {
  return (
    <YearCalendar
      anchor={anchor}
      tasks={tasks}
      onPickMonth={onPickMonth}
      onPickDay={onPickDay}
    />
  )
}
