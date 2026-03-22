import Navbar from '../components/Navbar'
import FloatingNotes from '../components/FloatingNotes'

export default function About() {
  return (
    <div
      className="relative overflow-x-hidden flex flex-col min-h-screen transition-colors duration-400"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <FloatingNotes />

      <Navbar />

      <main className="flex-1 px-8 py-20 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1
            className="animate-fade-up text-5xl lg:text-6xl font-black mb-6"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          >
            About MiAmor
          </h1>
          <p
            className="animate-fade-up delay-100 text-lg font-black leading-relaxed"
            style={{ color: 'var(--text-light)' }}
          >
            MiAmor is a tribute to the beauty of sound and the simplicity of interaction. 
            We believe that making music should be as easy as typing a message.
          </p>
        </div>

        <section className="animate-fade-up delay-200 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Our Vision</h2>
            <p className="font-black text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
              To transform every keyboard into a multi-instrumental stage. Whether you're a 
              professional artist or just looking for a bit of creative release, MiAmor 
              is your digital sanctuary for sound.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Technology</h2>
            <p className="font-black text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>
              Built with the modern Web Audio API and React, MiAmor provides low-latency, 
              high-fidelity musical experiences directly in your browser without any plugins 
              or installations.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-8 px-8 text-center border-t transition-colors" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-black" style={{ color: 'var(--text-light)' }}>
          Made with ♡ &nbsp;·&nbsp;
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, color: 'var(--accent-dark)' }}>
            MiAmor
          </span>
          &nbsp;·&nbsp; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
