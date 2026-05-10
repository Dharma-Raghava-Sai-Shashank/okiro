import { forwardRef } from 'react'

const VARIANT_CLASSES = {
  panel:
    'bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] rounded-2xl',
  card:
    'bg-white/30 backdrop-blur-xl border border-white/30 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.55)] rounded-2xl transition hover:bg-white/45',
  cell:
    'bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_4px_18px_-10px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.6)] rounded-2xl transition',
  chip:
    'backdrop-blur-md border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_8px_-2px_rgba(15,23,42,0.18)] rounded-full',
  input:
    'bg-white/30 backdrop-blur-md border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] placeholder:text-slate-500 focus:bg-white/55 focus:border-white/80 focus:ring-2 focus:ring-white/40 focus:outline-none rounded-xl',
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
