import { motion } from 'framer-motion'

export default function LogoFlame({ idSuffix = 'big', blurred = false }) {
  const gradId = `logo-flame-grad-${idSuffix}`
  const highlightId = `logo-flame-hi-${idSuffix}`
  const baseId = `logo-flame-base-${idSuffix}`
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      style={{
        transformOrigin: '50% 95%',
        filter: blurred
          ? 'blur(10px) drop-shadow(0 0 14px rgba(96, 165, 250, 0.55))'
          : 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.25)) drop-shadow(0 0 14px rgba(96, 165, 250, 0.5)) drop-shadow(0 0 6px rgba(59, 130, 246, 0.55))',
      }}
      animate={{
        scaleY: [1, 1.04, 0.97, 1.03, 1],
        scaleX: [1, 0.98, 1.03, 0.99, 1],
      }}
      transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="28%" stopColor="#93c5fd" />
          <stop offset="62%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id={highlightId} cx="38%" cy="32%" r="32%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={baseId} cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#1d4ed8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M12 2c0 2 1 3.6 2 5.2c1.7 2.6 4 4.8 4 8.3a6 6 0 0 1-12 0c0-2.7 1-4.6 2-6.2c.8 1.7 1.7 1.7 1.7-.4c0-2 1.1-4.5 2.3-6.9z"
        fill={`url(#${gradId})`}
        stroke="rgba(15, 23, 42, 0.22)"
        strokeWidth="0.22"
      />
      <path
        d="M12 2c0 2 1 3.6 2 5.2c1.7 2.6 4 4.8 4 8.3a6 6 0 0 1-12 0c0-2.7 1-4.6 2-6.2c.8 1.7 1.7 1.7 1.7-.4c0-2 1.1-4.5 2.3-6.9z"
        fill={`url(#${highlightId})`}
      />
      <path
        d="M12 2c0 2 1 3.6 2 5.2c1.7 2.6 4 4.8 4 8.3a6 6 0 0 1-12 0c0-2.7 1-4.6 2-6.2c.8 1.7 1.7 1.7 1.7-.4c0-2 1.1-4.5 2.3-6.9z"
        fill={`url(#${baseId})`}
      />
      <path
        d="M12 11c0 1 .5 1.7 1 2.5c.8 1.2 1.6 2.1 1.6 3.5a2.6 2.6 0 0 1-5.2 0c0-1.2.4-2 .9-2.8c.4.7.7.7.7-.2c0-.9.4-2 1-3z"
        fill="#0f172a"
      />
    </motion.svg>
  )
}
