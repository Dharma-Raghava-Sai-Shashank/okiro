export const PALETTE = [
  { name: 'amber', tint: '#fef3c7', mid: '#fde68a', deep: '#f59e0b' },
  { name: 'butter', tint: '#fef9c3', mid: '#fef08a', deep: '#eab308' },
  { name: 'mint', tint: '#d1fae5', mid: '#a7f3d0', deep: '#10b981' },
  { name: 'sage', tint: '#dcfce7', mid: '#bbf7d0', deep: '#22c55e' },
  { name: 'aqua', tint: '#cffafe', mid: '#a5f3fc', deep: '#06b6d4' },
  { name: 'sky', tint: '#dbeafe', mid: '#bfdbfe', deep: '#0ea5e9' },
  { name: 'periwinkle', tint: '#e0e7ff', mid: '#c7d2fe', deep: '#6366f1' },
  { name: 'lavender', tint: '#ede9fe', mid: '#ddd6fe', deep: '#8b5cf6' },
  { name: 'lilac', tint: '#f3e8ff', mid: '#e9d5ff', deep: '#a855f7' },
  { name: 'pink', tint: '#fce7f3', mid: '#fbcfe8', deep: '#ec4899' },
  { name: 'coral', tint: '#fee2e2', mid: '#fecaca', deep: '#ef4444' },
  { name: 'peach', tint: '#fed7aa', mid: '#fdba74', deep: '#fb923c' },
]

export const COLOR_HEXES = PALETTE.map((p) => p.tint)

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function colorFor(title) {
  const idx = hashStr(title || 'untitled') % PALETTE.length
  return PALETTE[idx].tint
}

export function nextColor(current) {
  const idx = COLOR_HEXES.indexOf(current)
  return COLOR_HEXES[(idx + 1) % COLOR_HEXES.length]
}

export function paletteEntry(tint) {
  return PALETTE.find((p) => p.tint === tint) || PALETTE[7]
}

export function deepFor(tint) {
  return paletteEntry(tint).deep
}

export function midFor(tint) {
  return paletteEntry(tint).mid
}

export function tintToRgba(tint, alpha) {
  const r = parseInt(tint.slice(1, 3), 16)
  const g = parseInt(tint.slice(3, 5), 16)
  const b = parseInt(tint.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function chipGradient(tint) {
  const top = tintToRgba(tint, 0.95)
  const bottom = tintToRgba(midFor(tint), 0.88)
  return `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`
}

export function chipGlow(tint, intensity = 0.35) {
  const r = parseInt(tint.slice(1, 3), 16)
  const g = parseInt(tint.slice(3, 5), 16)
  const b = parseInt(tint.slice(5, 7), 16)
  const deep = deepFor(tint)
  const dr = parseInt(deep.slice(1, 3), 16)
  const dg = parseInt(deep.slice(3, 5), 16)
  const db = parseInt(deep.slice(5, 7), 16)
  return `0 6px 24px -6px rgba(${dr}, ${dg}, ${db}, ${intensity}), 0 1px 3px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.85)`
}
