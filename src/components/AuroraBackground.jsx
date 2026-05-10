import { motion } from 'framer-motion'

const blobs = [
  {
    color: 'rgba(147, 197, 253, 0.42)',
    style: { top: '-20%', left: '15%', width: '70rem', height: '50rem' },
    duration: 22,
    delta: { x: [0, 60, -30, 0], y: [0, 40, -20, 0] },
  },
  {
    color: 'rgba(186, 230, 253, 0.40)',
    style: { bottom: '-20%', right: '10%', width: '60rem', height: '46rem' },
    duration: 26,
    delta: { x: [0, -50, 40, 0], y: [0, -30, 50, 0] },
  },
]

export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #f0f7ff 0%, #e6f0fb 50%, #dde9f7 100%)',
      }}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${b.color}, transparent 70%)`,
            filter: 'blur(80px)',
            ...b.style,
          }}
          animate={{ x: b.delta.x, y: b.delta.y }}
          transition={{
            duration: b.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.5) 0%, transparent 55%)',
        }}
      />
    </div>
  )
}
