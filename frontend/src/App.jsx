import { useEffect, useRef, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

/* ── floating music notes ─────────────────────────────────────────────────── */
const NOTES = ['♩', '♪', '♫', '♬', '𝄞', '𝄢']

function FloatingNote({ note, style }) {
  return (
    <span
      className="pointer-events-none select-none absolute text-[var(--pink-dark)] opacity-0"
      style={{ animation: 'note-drift 3s ease-out forwards', ...style }}
    >
      {note}
    </span>
  )
}

/* ── instrument card ─────────────────────────────────────────────────────── */
function InstrumentCard({ emoji, name, keys, delay }) {
  return (
    <div
      className="animate-fade-up group relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center gap-4
        border border-[var(--pink-light)] shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: delay }}
    >
      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
      <h3 className="font-serif text-xl font-semibold text-[var(--heading)]" style={{ fontFamily: 'var(--font-serif)' }}>
        {name}
      </h3>
      <p className="text-sm text-[var(--text-light)] text-center leading-relaxed">
        Press <span className="font-mono bg-[var(--pink-light)] text-[var(--rose)] rounded px-1.5 py-0.5 text-xs">{keys}</span> to play
      </p>
    </div>
  )
}

/* ── main app ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [floatingNotes, setFloatingNotes] = useState([])
  const noteIdRef = useRef(0)

  /* spawn a floating note on any keypress */
  useEffect(() => {
    const spawnNote = () => {
      const id    = noteIdRef.current++
      const note  = NOTES[Math.floor(Math.random() * NOTES.length)]
      const left  = `${10 + Math.random() * 80}%`
      const top   = `${30 + Math.random() * 50}%`
      const size  = `${1.2 + Math.random() * 1.4}rem`
      setFloatingNotes(prev => [...prev, { id, note, left, top, size }])
      setTimeout(() => {
        setFloatingNotes(prev => prev.filter(n => n.id !== id))
      }, 3100)
    }
    window.addEventListener('keydown', spawnNote)
    return () => window.removeEventListener('keydown', spawnNote)
  }, [])

  return (
    <div className="relative overflow-x-hidden flex flex-col min-h-screen" style={{ background: 'var(--cream)' }}>

      {/* ── ambient blobs ───────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="float-a absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, var(--pink-light), transparent 70%)' }} />
        <div className="float-b absolute top-1/2 -right-40 w-[520px] h-[520px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, var(--pink), transparent 70%)' }} />
        <div className="float-c absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--cream-dark), transparent 70%)' }} />
      </div>

      {/* ── floating note sprites ────────────────────────────────────────── */}
      {floatingNotes.map(({ id, note, left, top, size }) => (
        <FloatingNote key={id} note={note} style={{ left, top, fontSize: size }} />
      ))}

      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════ */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full">
        {/* brand */}
        <a href="/" id="brand-logo" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🎵</span>
          <span
            className="text-xl font-semibold tracking-wide"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--heading)', fontStyle: 'italic' }}
          >
            Mi Amor
          </span>
        </a>

        {/* nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {['Instruments', 'About', 'GitHub'].map(link => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium transition-colors duration-200 no-underline"
              style={{ color: 'var(--text-light)' }}
              onMouseEnter={e => e.target.style.color = 'var(--rose)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-light)'}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#instruments"
          id="nav-cta"
          className="hidden md:block text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300
            hover:scale-105 hover:shadow-md no-underline"
          style={{
            background: 'linear-gradient(135deg, var(--pink), var(--pink-dark))',
            color: '#fff',
          }}
        >
          Play Now
        </a>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="flex-1 flex flex-col lg:flex-row items-center gap-12 px-8 py-16 max-w-6xl mx-auto w-full">

        {/* left — text */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
          {/* pill badge */}
          <div className="animate-fade-up inline-flex self-center lg:self-start items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border"
            style={{ background: 'var(--pink-light)', borderColor: 'var(--pink)', color: 'var(--rose)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-[pulse-ring_2s_ease_infinite]" style={{ background: 'var(--rose)' }} />
            Play music · right in your browser
          </div>

          <h1
            className="animate-fade-up delay-100 text-6xl lg:text-7xl font-light leading-tight"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--heading)', lineHeight: '1.05' }}
          >
            Make music
            <br />
            <em>fall in love.</em>
          </h1>

          <p className="animate-fade-up delay-200 text-lg leading-relaxed max-w-md" style={{ color: 'var(--text-light)' }}>
            Mi Amor brings handcrafted musical instruments to life in your browser.
            Hit any key on your keyboard and let the music speak.
          </p>

          {/* CTA row */}
          <div className="animate-fade-up delay-300 flex flex-wrap gap-4 justify-center lg:justify-start">
            <a
              href="#instruments"
              id="hero-cta-primary"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-white transition-all duration-300
                hover:scale-105 hover:shadow-xl no-underline"
              style={{ background: 'linear-gradient(135deg, var(--pink-dark), var(--rose))', animation: 'pulse-ring 2.5s ease infinite' }}
            >
              <span>Start Playing</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
            <a
              href="#"
              id="hero-cta-secondary"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-all duration-300
                hover:scale-105 no-underline border"
              style={{ color: 'var(--rose)', borderColor: 'var(--pink)', background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--pink-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Watch demo
            </a>
          </div>

          {/* keyboard hint */}
          <p className="animate-fade-up delay-500 text-xs mt-2" style={{ color: 'var(--text-light)' }}>
            Tip: press any key right now 👀
          </p>
        </div>

        {/* right — hero image with decorative frame */}
        <div className="float-d relative flex-1 flex justify-center items-center">
          {/* decorative ring */}
          <div className="absolute inset-0 m-auto w-72 h-72 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, var(--pink-light), transparent 70%)' }} />
          <img
            src={heroImg}
            alt="Floating musical instruments in soft pink tones"
            className="animate-fade-up delay-200 relative z-10 w-full max-w-sm lg:max-w-md rounded-3xl shadow-2xl object-cover"
            style={{ boxShadow: '0 24px 80px rgba(196,88,122,0.18)' }}
          />
          {/* decorative notes orbiting */}
          {['♩','♫','♬','𝄞'].map((n, i) => (
            <span
              key={n}
              className="absolute text-2xl select-none pointer-events-none"
              style={{
                color: 'var(--pink-dark)',
                opacity: 0.7,
                top:  `${[10, 75, 15, 70][i]}%`,
                left: `${[5,  5,  85, 82][i]}%`,
                animation: `float ${4 + i * 0.8}s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          INSTRUMENTS SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="instruments"
        className="px-8 py-20 max-w-6xl mx-auto w-full"
      >
        <div className="text-center mb-14">
          <h2
            className="animate-fade-up text-4xl lg:text-5xl font-light mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--heading)' }}
          >
            Choose your <em>instrument</em>
          </h2>
          <p className="animate-fade-up delay-100 text-base max-w-md mx-auto" style={{ color: 'var(--text-light)' }}>
            Each instrument is playable entirely from your keyboard — no downloads, no plugins.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <InstrumentCard emoji="🎹" name="Piano" keys="A–L"    delay="0.1s" />
          <InstrumentCard emoji="🥁" name="Drums" keys="Q W E R" delay="0.2s" />
          <InstrumentCard emoji="🎸" name="Guitar" keys="1–8"   delay="0.3s" />
          <InstrumentCard emoji="🎺" name="Trumpet" keys="Z X C"delay="0.4s" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURE STRIP
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="px-8 py-16 my-8 mx-4 lg:mx-8 rounded-3xl"
        style={{ background: 'linear-gradient(135deg, var(--cream-dark), var(--pink-light))' }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: '⌨️', title: 'Keyboard First', desc: 'Every note mapped to a key. No mouse needed.' },
            { icon: '🌐', title: 'Runs in Browser', desc: 'Zero installs. Just open and play.' },
            { icon: '🎛️', title: 'Real-time Audio', desc: 'Web Audio API powers crisp, low-latency sound.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <span className="text-4xl">{icon}</span>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--heading)', fontFamily: 'var(--font-serif)' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer className="py-8 px-8 text-center border-t" style={{ borderColor: 'var(--cream-dark)' }}>
        <p className="text-sm" style={{ color: 'var(--text-light)' }}>
          Made with ♡ &nbsp;·&nbsp;
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--rose)' }}>Mi Amor</span>
          &nbsp;·&nbsp; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
