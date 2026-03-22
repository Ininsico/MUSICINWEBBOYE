export default function InstrumentCard({ name, keys, delay }) {
  return (
    <div
      className="animate-fade-up group relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center gap-4
        border border-[var(--pink-light)] shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: delay }}
    >
      <h3 className="text-xl font-black text-[var(--heading)]" style={{ fontFamily: 'var(--font-serif)' }}>
        {name}
      </h3>
      <p className="text-sm font-semibold text-[var(--text-light)] text-center leading-relaxed">
        Press{' '}
        <span className="font-mono bg-[var(--pink-light)] text-[var(--rose)] rounded px-1.5 py-0.5 text-xs">
          {keys}
        </span>{' '}
        to play
      </p>
    </div>
  )
}
