import Navbar from '../components/Navbar'
import InstrumentCard from '../components/InstrumentCard'
import FloatingNotes from '../components/FloatingNotes'

const INSTRUMENTS = [
  { name: 'Piano',   keys: 'A – L' },
  { name: 'Drums',   keys: 'Q  W  E  R' },
  { name: 'Guitar',  keys: '1 – 8' },
  { name: 'Trumpet', keys: 'Z  X  C' },
]

export default function Instruments() {
  return (
    <div
      className="relative overflow-x-hidden flex flex-col min-h-screen"
      style={{ background: 'var(--cream)' }}
    >
      <FloatingNotes />

      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="float-a absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, var(--pink-light), transparent 70%)' }}
        />
        <div
          className="float-b absolute top-1/2 -right-40 w-[520px] h-[520px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, var(--pink), transparent 70%)' }}
        />
      </div>

      <Navbar />

      <main className="flex-1 px-8 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1
            className="animate-fade-up text-5xl lg:text-6xl font-black mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--heading)' }}
          >
            Choose your instrument
          </h1>
          <p
            className="animate-fade-up delay-100 text-base font-semibold max-w-md mx-auto"
            style={{ color: 'var(--text-light)' }}
          >
            Each instrument is playable entirely from your keyboard — no downloads, no plugins.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INSTRUMENTS.map(({ name, keys }, i) => (
            <InstrumentCard
              key={name}
              name={name}
              keys={keys}
              delay={`${(i + 1) * 0.1}s`}
            />
          ))}
        </div>
      </main>

      <footer className="py-8 px-8 text-center border-t" style={{ borderColor: 'var(--cream-dark)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-light)' }}>
          Made with ♡ &nbsp;·&nbsp;
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, color: 'var(--rose)' }}>
            MiAmor
          </span>
          &nbsp;·&nbsp; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
