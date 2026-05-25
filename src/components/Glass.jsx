import { forwardRef } from 'react'

/*
 * Performance-optimised glass variants.
 * Replaced heavy backdrop-blur-2xl / backdrop-blur-xl with lighter
 * semi-opaque backgrounds that give the same frosted-glass feel
 * without the GPU-intensive compositing.
 */
const VARIANT_CLASSES = {
  panel:
    'bg-white/72 border border-white/40 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] rounded-2xl',
  card:
    'bg-white/60 border border-white/30 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.55)] rounded-2xl transition hover:bg-white/75',
  cell:
    'bg-white/60 border border-white/40 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] rounded-2xl transition',
  chip:
    'bg-white/50 border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_8px_-2px_rgba(15,23,42,0.18)] rounded-full',
  input:
    'bg-white/50 border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] placeholder:text-slate-500 focus:bg-white/70 focus:border-white/80 focus:ring-2 focus:ring-white/40 focus:outline-none rounded-xl',
}

const Glass = forwardRef(function Glass(
  { as: Tag = 'div', variant = 'panel', className = '', children, ...rest },
  ref,
) {
  const base = VARIANT_CLASSES[variant] || VARIANT_CLASSES.panel
  return (
    <Tag ref={ref} className={`${base} ${className}`} {...rest}>
      {children}
    </Tag>
  )
})

export default Glass
