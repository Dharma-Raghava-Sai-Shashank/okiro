export default function Logo({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="okiro-flame" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c0 2 1 3.6 2 5.2c1.7 2.6 4 4.8 4 8.3a6 6 0 0 1-12 0c0-2.7 1-4.6 2-6.2c.8 1.7 1.7 1.7 1.7-.4c0-2 1.1-4.5 2.3-6.9z"
        fill="url(#okiro-flame)"
      />
      <path
        d="M12 11c0 1 .5 1.7 1 2.5c.8 1.2 1.6 2.1 1.6 3.5a2.6 2.6 0 0 1-5.2 0c0-1.2.4-2 .9-2.8c.4.7.7.7.7-.2c0-.9.4-2 1-3z"
        fill="#0f172a"
      />
    </svg>
  )
}
