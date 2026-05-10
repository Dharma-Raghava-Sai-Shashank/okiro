import { useEffect, useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'
import LogoFlame from './LogoFlame'

const sparkCount = 10
const sparks = Array.from({ length: sparkCount }, (_, i) => ({
  id: i,
  startX: -45 + Math.random() * 90,
  delay: Math.random() * 5,
  duration: 3.4 + Math.random() * 3,
  size: 1.4 + Math.random() * 2.4,
  drift: (Math.random() - 0.5) * 70,
  rise: 200 + Math.random() * 200,
}))

const burstCount = 12
const bursts = Array.from({ length: burstCount }, (_, i) => {
  const baseAngle = (i / burstCount) * Math.PI * 2
  const angle = baseAngle + (Math.random() - 0.5) * 0.35
  const distance = 110 + Math.random() * 80
  const dx = Math.cos(angle) * distance
  const dy = Math.sin(angle) * distance - 25
  const rotateDeg = (angle * 180) / Math.PI + 90
  const stagger = Math.random() * 0.02
  const widthPx = 9 + Math.random() * 4
  const heightPx = 16 + Math.random() * 6
  return { id: i, dx, dy, rotateDeg, stagger, widthPx, heightPx }
})

const FLAME_BEAT = 2.7
const FLAME_BEAT_SLOW = 5.4
const flameEase = 'easeInOut'
const easeOutCubic = [0.16, 1, 0.3, 1]

const TRAVEL_SCALE = 0.6
const TRAVEL_DURATION = 3.0
const ARC_LIFT = 36
const GROW_DURATION = 3.0
const SPIKE_DURATION = 1.0

function FlameSvg({ idSuffix, scale = 1, opacity = 1 }) {
  const flickerId = `okiro-flicker-${idSuffix}`
  const flickerFastId = `okiro-flicker-fast-${idSuffix}`
  const outerId = `okiro-outer-${idSuffix}`
  const innerId = `okiro-inner-${idSuffix}`
  const coreId = `okiro-core-${idSuffix}`

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 200 320"
      preserveAspectRatio="xMidYMax meet"
      style={{ transformOrigin: '50% 100%', opacity }}
      animate={{
        scaleY: [1, 1.07, 0.95, 1.05, 1],
        scaleX: [1, 0.96, 1.04, 0.97, 1],
      }}
      transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <filter id={flickerId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.038"
            numOctaves="2"
            seed="2"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.013 0.038;0.022 0.06;0.011 0.034;0.018 0.05;0.013 0.038"
              dur="5.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="seed"
              values="2;6;11;15;2"
              dur="9s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={16 * scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="1.4" />
        </filter>

        <filter
          id={flickerFastId}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.08"
            numOctaves="2"
            seed="5"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.03 0.08;0.05 0.12;0.025 0.07;0.04 0.1;0.03 0.08"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="seed"
              values="5;10;14;18;5"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={7 * scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="0.7" />
        </filter>

        <radialGradient id={outerId} cx="50%" cy="92%" r="55%">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.95" />
          <stop offset="22%" stopColor="#93c5fd" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.78" />
          <stop offset="80%" stopColor="#1e40af" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={innerId} cx="50%" cy="88%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="32%" stopColor="#dbeafe" stopOpacity="0.95" />
          <stop offset="68%" stopColor="#60a5fa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={coreId} cx="50%" cy="86%" r="22%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="55%" stopColor="#eff6ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter={`url(#${flickerId})`}>
        <path
          d="M 100 320 C 40 305 24 250 26 195 C 28 140 55 95 78 55 C 86 75 100 75 100 50 C 100 22 112 -8 100 -25 C 90 -8 105 22 105 50 C 105 75 116 75 124 55 C 148 95 174 140 174 195 C 174 250 158 305 100 320 Z"
          fill={`url(#${outerId})`}
        />
      </g>

      <g filter={`url(#${flickerFastId})`}>
        <path
          d="M 100 305 C 60 290 50 245 52 200 C 54 165 75 130 90 100 C 96 115 100 115 100 95 C 100 70 108 45 102 30 C 96 45 105 70 105 95 C 105 115 110 115 116 100 C 132 130 152 165 154 200 C 156 245 144 290 100 305 Z"
          fill={`url(#${innerId})`}
        />
      </g>

      <g filter={`url(#${flickerFastId})`}>
        <path
          d="M 100 290 C 80 280 72 248 74 215 C 76 188 88 162 96 138 C 99 148 100 148 100 132 C 100 116 104 100 100 88 C 96 100 102 116 102 132 C 102 148 103 148 105 138 C 114 162 126 188 128 215 C 130 248 122 280 100 290 Z"
          fill={`url(#${coreId})`}
        />
      </g>
    </motion.svg>
  )
}

function useFlamePhase() {
  // No intro / no travel — flame starts stable at Globals from t=0.
  return 'stable'
}

function useGlobalsAnchor() {
  const [delta, setDelta] = useState({ dx: 0, dy: 0, ready: false })
  useLayoutEffect(() => {
    const compute = () => {
      const node = document.getElementById('okiro-flame-target')
      if (!node) return
      const rect = node.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return
      const targetX = rect.left + rect.width / 2
      const targetY = rect.top + rect.height / 2
      const vpCenterX = window.innerWidth / 2
      const vpCenterY = window.innerHeight / 2
      setDelta({
        dx: targetX - vpCenterX,
        dy: targetY - vpCenterY,
        ready: true,
      })
    }
    compute()
    const ro = new ResizeObserver(compute)
    const node = document.getElementById('okiro-flame-target')
    if (node) ro.observe(node)
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('resize', compute)
      ro.disconnect()
    }
  }, [])
  return delta
}

function travelKeyframes(delta, key) {
  const v = delta[key]
  const lift = key === 'y' ? -ARC_LIFT : 0
  return [0, v * 0.5 + lift, v]
}

export default function FlameBackground() {
  const phase = useFlamePhase()
  const { dx, dy, ready } = useGlobalsAnchor()

  const travelling = phase === 'travel' || phase === 'stable'
  const settled = phase === 'stable'

  // Don't render until we've measured the Globals anchor — avoids a flash
  // at viewport center on first paint before the position is known.
  if (!ready) return null

  const xValue = phase === 'travel' && ready ? travelKeyframes({ dx, dy }, 'x') : settled && ready ? dx : 0
  const yValue = phase === 'travel' && ready ? travelKeyframes({ dx, dy }, 'y') : settled && ready ? dy : 0
  const positionTransition =
    phase === 'travel'
      ? { duration: TRAVEL_DURATION, ease: flameEase, times: [0, 0.55, 1] }
      : { duration: 0 }

  // Heat halo — settled state breathes at full size but at lower opacity for a cleaner finish
  const haloStable = {
    scale: [1, 1.06, 0.96, 1.04, 1],
    opacity: [0.45, 0.6, 0.5, 0.58, 0.45],
    x: xValue,
    y: yValue,
  }
  const haloIntroAnimate = {
    scale: 1,
    opacity: 0.78,
    x: 0,
    y: 0,
  }
  const haloTravelAnimate = {
    scale: 1,
    opacity: 0.78,
    x: xValue,
    y: yValue,
  }

  // Hot bottom — opacity range scaled
  const hotStable = {
    scaleX: [1, 1.12, 0.94, 1.06, 1],
    opacity: [0.55, 0.78, 0.55, 0.72, 0.55],
    x: xValue,
    y: yValue,
  }
  const hotIntroAnimate = {
    scaleX: 1,
    opacity: 0.65,
    x: 0,
    y: 0,
  }
  const hotTravelAnimate = {
    scaleX: 1,
    opacity: 0.65,
    x: xValue,
    y: yValue,
  }

  // Flame body wrapper — handles grow + travel + scale-down on arrival
  const flameWrapInitial = { scale: 0.08, opacity: 0.4, x: 0, y: 0 }
  const flameWrapIntroAnimate = { scale: 1, opacity: 1, x: 0, y: 0 }
  const flameWrapSpikeAnimate = { scale: 1, opacity: 1, x: 0, y: 0 }
  const flameWrapTravelAnimate = ready
    ? {
        scale: [1, 0.78, TRAVEL_SCALE],
        opacity: 1,
        x: travelKeyframes({ dx, dy }, 'x'),
        y: travelKeyframes({ dx, dy }, 'y'),
      }
    : flameWrapSpikeAnimate
  const flameWrapStableAnimate = ready
    ? { scale: TRAVEL_SCALE, opacity: 0.85, x: dx, y: dy }
    : { scale: 1, opacity: 0.85, x: 0, y: 0 }

  const flameWrapTransition =
    phase === 'intro'
      ? { duration: GROW_DURATION, ease: easeOutCubic }
      : phase === 'spike'
      ? { duration: SPIKE_DURATION, ease: 'easeOut' }
      : phase === 'travel'
      ? { duration: TRAVEL_DURATION, ease: flameEase, times: [0, 0.55, 1] }
      : { duration: 0.5, ease: 'easeOut', x: { duration: 0 }, y: { duration: 0 } }

  const flameWrapAnimate =
    phase === 'intro'
      ? flameWrapIntroAnimate
      : phase === 'spike'
      ? flameWrapSpikeAnimate
      : phase === 'travel'
      ? flameWrapTravelAnimate
      : flameWrapStableAnimate

  // Ambient wash — refactored to a finite centered container
  const ambientStable = {
    opacity: [0.65, 0.85, 0.72, 0.82, 0.65],
    scale: [1, 1.03, 0.99, 1.02, 1],
    x: xValue,
    y: yValue,
  }
  const ambientIntroAnimate = { opacity: 0.7, scale: 1, x: 0, y: 0 }
  const ambientSpikeAnimate = { opacity: 0.85, scale: 1.05, x: 0, y: 0 }
  const ambientTravelAnimate = { opacity: 0.7, scale: 1, x: xValue, y: yValue }

  // Close-in warm glow — spike target. Settled state dims it; cradle+inner halo replace its role.
  const warmStable = {
    scale: [1, 1.05, 0.97, 1.03, 1],
    opacity: [0.35, 0.55, 0.42, 0.5, 0.35],
    x: xValue,
    y: yValue,
  }
  const warmIntroAnimate = { scale: 0.4, opacity: 0.2, x: 0, y: 0 }
  const warmSpikeAnimate = {
    scale: [1, 1.4, 1.05],
    opacity: [0.6, 1, 0.7],
    x: 0,
    y: 0,
  }
  const warmTravelAnimate = { scale: 1, opacity: 0.65, x: xValue, y: yValue }

  // Slow ambient ring — second spike target. Settled state dims it for a contained finish.
  const slowStable = {
    scale: [1, 1.02, 0.99, 1.015, 1],
    opacity: [0.3, 0.5, 0.38, 0.46, 0.3],
    x: xValue,
    y: yValue,
  }
  const slowIntroAnimate = { scale: 0.5, opacity: 0.18, x: 0, y: 0 }
  const slowSpikeAnimate = {
    scale: [1, 1.3, 1.02],
    opacity: [0.5, 0.95, 0.65],
    x: 0,
    y: 0,
  }
  const slowTravelAnimate = { scale: 1, opacity: 0.6, x: xValue, y: yValue }

  // Edge vignette — stays centered, just breathes
  const vignetteIntroAnimate = { opacity: 0.4 }
  const vignetteStableAnimate = { opacity: [0.95, 0.88, 0.95, 0.9, 0.95] }

  // Global flicker — stays centered
  const flickerIntroAnimate = { opacity: 0.02 }
  const flickerStableAnimate = { opacity: [0.03, 0.08, 0.04, 0.07, 0.03] }

  const introTransition = { duration: GROW_DURATION, ease: easeOutCubic }
  const spikeTransition = { duration: SPIKE_DURATION, ease: 'easeOut' }
  const instantXY = { x: { duration: 0 }, y: { duration: 0 } }
  const stableTransition = {
    duration: FLAME_BEAT,
    repeat: Infinity,
    ease: flameEase,
    ...instantXY,
  }
  const stableSlowTransition = {
    duration: FLAME_BEAT_SLOW,
    repeat: Infinity,
    ease: flameEase,
    ...instantXY,
  }
  const hotStableTransition = {
    duration: 1.7,
    repeat: Infinity,
    ease: flameEase,
    ...instantXY,
  }

  return (
    <>
      {/* GLOBAL FLICKER — entire page subtly lifts and dims with the flame */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[2] overflow-hidden pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 90% at 50% 50%, rgba(96, 165, 250, 0.08), rgba(59, 130, 246, 0.05) 40%, transparent 75%)',
          mixBlendMode: 'plus-lighter',
        }}
        initial={{ opacity: 0 }}
        animate={
          phase === 'intro' ? flickerIntroAnimate : flickerStableAnimate
        }
        transition={phase === 'intro' ? introTransition : stableTransition}
      />

      {/* MAIN FLAME LAYER — stays behind cells through grow/spike/travel; only lifts ON TOP after settling at Globals */}
      <div
        aria-hidden
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: settled ? 30 : -5 }}
      >
        {/* Heat halo around the orb */}
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            translateX: '-50%',
            translateY: '-50%',
            width: '70vmin',
            height: '70vmin',
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(96, 165, 250, 0.30), rgba(59, 130, 246, 0.14) 35%, rgba(29, 78, 216, 0.05) 65%, transparent 80%)',
            filter: 'blur(60px)',
          }}
          initial={false}
          animate={haloStable}
          transition={
            phase === 'intro'
              ? introTransition
              : phase === 'travel'
              ? positionTransition
              : stableTransition
          }
        />

        {/* Hot bottom of the flame — just below the orb */}
        <motion.div
          className="absolute"
          style={{
            top: 'calc(50% + 22vmin)',
            left: '50%',
            translateX: '-50%',
            translateY: '-50%',
            width: '28vmin',
            height: '8vmin',
            background:
              'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.45), rgba(96, 165, 250, 0.20) 50%, transparent 80%)',
            filter: 'blur(22px)',
          }}
          initial={false}
          animate={hotStable}
          transition={hotStableTransition}
        />

        {/* The flame body — orb that grows + travels + scales down */}
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            translateX: '-50%',
            translateY: '-50%',
            width: 'min(38vmin, 380px)',
            height: 'min(58vmin, 560px)',
          }}
          initial={false}
          animate={flameWrapStableAnimate}
          transition={{ duration: 0.5, ease: 'easeOut', x: { duration: 0 }, y: { duration: 0 } }}
        >
          <div className="absolute inset-0">
            <LogoFlame idSuffix="back-logo" />
          </div>

          {/* Cradle — soft gradient pool of light under the settled flame */}
          <motion.div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: '12%',
              right: '12%',
              bottom: '-6%',
              height: '22%',
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(147, 197, 253, 0.55) 0%, rgba(96, 165, 250, 0.28) 45%, rgba(59, 130, 246, 0.10) 75%, transparent 100%)',
              filter: 'blur(14px)',
            }}
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={
              settled
                ? { opacity: [0.55, 0.82, 0.6, 0.78, 0.55], scaleX: [1, 1.06, 0.96, 1.04, 1] }
                : { opacity: 0, scaleX: 0.7 }
            }
            transition={
              settled
                ? { duration: 2.7, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.4 }
            }
          />

          {/* Inner halo — tight glow framing the cartoon flame on the panel */}
          <motion.div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: '-8%',
              right: '-8%',
              top: '8%',
              bottom: '-2%',
              background:
                'radial-gradient(ellipse 50% 55% at 50% 65%, rgba(147, 197, 253, 0.32) 0%, rgba(96, 165, 250, 0.16) 40%, transparent 80%)',
              filter: 'blur(20px)',
              mixBlendMode: 'plus-lighter',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: settled ? 0.85 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Soft outward fade so the orb's edge doesn't read as a hard rectangle */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(255, 255, 255, 0.18) 85%)',
          }}
        />
      </div>

      {/* AMBIENT LIGHT WASH — finite container, travels with flame */}
      <motion.div
        aria-hidden
        className="fixed pointer-events-none z-[3]"
        style={{
          top: '50%',
          left: '50%',
          translateX: '-50%',
          translateY: '-50%',
          width: 'min(100vw, 1400px)',
          height: 'min(100vh, 1100px)',
          background:
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(96, 165, 250, 0.18), rgba(59, 130, 246, 0.10) 35%, rgba(29, 78, 216, 0.04) 65%, transparent 82%)',
          mixBlendMode: 'plus-lighter',
        }}
        initial={false}
        animate={ambientStable}
        transition={stableTransition}
      />

      {/* EDGE VIGNETTE — stays at viewport center, just breathes */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[4] overflow-hidden pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, transparent 35%, rgba(30, 41, 59, 0.16) 90%, rgba(15, 23, 42, 0.22) 100%)',
          mixBlendMode: 'multiply',
        }}
        initial={false}
        animate={vignetteStableAnimate}
        transition={stableTransition}
      />

      {/* FRONT LAYER — flame whispers, sparks, and warm glow visibly over cells */}
      <div
        aria-hidden
        className="fixed inset-0 z-[25] overflow-hidden pointer-events-none"
      >
        {/* Blurred copy of the flame, in front of cells, additive */}
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            translateX: '-50%',
            translateY: '-50%',
            width: 'min(38vmin, 380px)',
            height: 'min(58vmin, 560px)',
            filter: 'blur(10px)',
            mixBlendMode: 'plus-lighter',
          }}
          initial={false}
          animate={{ scale: TRAVEL_SCALE, opacity: 0.5, x: dx, y: dy }}
          transition={{ duration: 0, x: { duration: 0 }, y: { duration: 0 } }}
        >
          <LogoFlame idSuffix="front-logo" blurred />
        </motion.div>

        {/* Close-in warm glow — synced to flame beat, spike target */}
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            translateX: '-50%',
            translateY: '-50%',
            width: '40vmin',
            height: '36vmin',
            background:
              'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.22), rgba(96, 165, 250, 0.09) 50%, transparent 80%)',
            filter: 'blur(28px)',
            mixBlendMode: 'plus-lighter',
          }}
          initial={false}
          animate={warmStable}
          transition={stableTransition}
        />

        {/* Slow ambient room-glow ring — runs at 2× the flame beat, spike target */}
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            translateX: '-50%',
            translateY: '-50%',
            width: 'min(60vmin, 700px)',
            height: 'min(50vmin, 600px)',
            background:
              'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.08), rgba(96, 165, 250, 0.04) 50%, transparent 80%)',
            mixBlendMode: 'plus-lighter',
          }}
          initial={false}
          animate={slowStable}
          transition={stableSlowTransition}
        />

        {/* Sparks — rise from the flame's center on the Globals panel */}
        {sparks.map((s) => {
          const originLeft = `calc(50% + ${dx}px)`
          const originTop = `calc(50% + ${dy + window.innerHeight * 0.05}px)`
          return (
              <motion.span
                key={`spark-${s.id}`}
                className="absolute rounded-full"
                style={{
                  left: originLeft,
                  top: originTop,
                  width: s.size,
                  height: s.size,
                  background:
                    'radial-gradient(circle, rgba(219, 234, 254, 0.95), rgba(96, 165, 250, 0.55) 60%, transparent)',
                  boxShadow: '0 0 8px rgba(147, 197, 253, 0.85)',
                }}
                initial={{ x: s.startX, y: 0, opacity: 0 }}
                animate={{
                  x: [s.startX, s.startX + s.drift * 0.5, s.startX + s.drift],
                  y: [0, -s.rise * 0.55, -s.rise],
                  opacity: [0, 0.95, 0],
                }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )
          })}

        {/* Periodic burst — flame teardrops fan outward from the Globals flame */}
        {bursts.map((b) => {
          const originLeft = `calc(50% - ${b.widthPx / 2}px + ${dx}px)`
          const originTop = `calc(50% - ${b.heightPx / 2}px + ${dy}px)`
          return (
            <motion.span
              key={`burst-${b.id}`}
              className="absolute"
              style={{
                left: originLeft,
                top: originTop,
                width: b.widthPx,
                height: b.heightPx,
                background:
                  'radial-gradient(ellipse at 50% 80%, rgba(255, 255, 255, 0.95) 0%, rgba(147, 197, 253, 0.85) 35%, rgba(59, 130, 246, 0.55) 70%, transparent 100%)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 30% 30%',
                filter: 'blur(0.6px)',
                boxShadow: '0 0 12px rgba(147, 197, 253, 0.7)',
                mixBlendMode: 'plus-lighter',
              }}
              animate={{
                x: [0, b.dx * 0.45, b.dx, b.dx * 1.08],
                y: [0, b.dy * 0.45, b.dy, b.dy * 1.08],
                opacity: [0, 1, 0.75, 0],
                scale: [0.4, 1.1, 0.85, 0.35],
                rotate: b.rotateDeg,
              }}
              transition={{
                duration: 1.1,
                delay: 1.5 + b.stagger,
                repeat: Infinity,
                repeatDelay: 6.4,
                ease: 'easeOut',
              }}
            />
          )
        })}
      </div>
    </>
  )
}
