export default function InstrumentCard({ name, keys, delay }) {
  return (
    <div
      className="animate-fade-up group relative backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center gap-4
        border shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer"
      style={{ 
        animationDelay: delay,
        background: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      <h3 className="text-xl font-black transition-colors" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
        {name}
      </h3>
      <p className="text-sm font-black transition-colors" style={{ color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.6 }}>
        Press{' '}
        <span className="font-mono bg-[var(--accent)]/20 text-[var(--accent-dark)] rounded px-1.5 py-0.5 text-xs">
          {keys}
        </span>{' '}
        to play
      </p>
    </div>
  )
}
