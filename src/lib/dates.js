import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  addMonths,
  addDays,
  addWeeks,
  addYears,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  getISOWeek,
} from 'date-fns'

export function keyForDay(d) {
  return format(d, 'yyyy-MM-dd')
}

export function keyForMonth(d) {
  return format(d, 'yyyy-MM')
}

export function todayKey() {
  return keyForDay(new Date())
}

export function isToday(d) {
  return isSameDay(d, new Date())
}

export function labelMonth(d) {
  return format(d, 'MMM yyyy')
}

export function labelMonthLong(d) {
  return format(d, 'MMMM yyyy')
}

export function labelDay(d) {
  return format(d, 'd · EEE')
}

export function labelDayLong(d) {
  return format(d, 'EEE d MMM yyyy')
}

export function labelWeekRange(d) {
  const s = startOfWeek(d, { weekStartsOn: 1 })
  const e = endOfWeek(d, { weekStartsOn: 1 })
  if (isSameMonth(s, e)) {
    return `${format(s, 'd')}–${format(e, 'd MMM yyyy')}`
  }
  return `${format(s, 'd MMM')}–${format(e, 'd MMM yyyy')}`
}

export function labelWeekShort(d) {
  return `Week ${getISOWeek(d)}`
}

export function monthsOfYear(year) {
  const start = startOfYear(new Date(year, 0, 1))
  return Array.from({ length: 12 }, (_, i) => addMonths(start, i))
}

export function daysOfMonthGrid(d) {
  const monthStart = startOfMonth(d)
  const monthEnd = endOfMonth(d)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  return eachDayOfInterval({ start: gridStart, end: gridEnd })
}

export function daysOfWeek(d) {
  const start = startOfWeek(d, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function stepAnchor(scope, anchor, delta) {
  switch (scope) {
    case 'year':
      return addYears(anchor, delta)
    case 'month':
      return addMonths(anchor, delta)
    case 'week':
      return addWeeks(anchor, delta)
    case 'day':
      return addDays(anchor, delta)
    default:
      return anchor
  }
}

export function dayFromKey(key) {
  if (!key) return null
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
