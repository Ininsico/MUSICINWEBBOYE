import { useUser } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import logoImg from '../assets/logo.png'
import Navbar from '../components/Navbar'
import FloatingNotes from '../components/FloatingNotes'

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  if (isLoaded && isSignedIn) return <Navigate to="/dashboard" replace />
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col transition-colors duration-400" style={{ background: 'var(--bg)' }}>

      <FloatingNotes />

      <section className="relative flex flex-col h-full w-full">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(18px) brightness(0.5)',
            transform: 'scale(1.08)',
            zIndex: 0,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(249,101,152,0.78) 0%, rgba(220,50,115,0.65) 35%, rgba(196,88,122,0.70) 65%, rgba(255,172,210,0.55) 100%)',
            zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <Navbar transparent />
        </div>

        <div
          className="relative flex-1 flex flex-col lg:flex-row items-center justify-between px-12 py-20 max-w-7xl mx-auto w-full gap-16"
          style={{ zIndex: 10 }}
        >
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1
              className="animate-fade-up text-7xl lg:text-8xl font-black leading-none mb-8"
              style={{
                fontFamily: 'var(--font-serif)',
                color: '#fff',
                textShadow: '0 4px 40px rgba(100,20,60,0.45)',
                letterSpacing: '-0.02em',
              }}
            >
              Make music
              <br />
              fall in love.
            </h1>

            <p
              className="animate-fade-up delay-200 text-xl font-bold leading-relaxed max-w-xl mb-12"
              style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 10px rgba(0,0,0,0.25)' }}
            >
              Mi Amor brings handcrafted musical instruments to life in your browser.
              Hit any key on your keyboard and let the music speak.
            </p>

            <div className="animate-fade-up delay-300 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/instruments"
                id="hero-cta-primary"
                className="group flex items-center gap-2 px-10 py-4 rounded-full font-black transition-all duration-300
                  hover:scale-105 hover:shadow-2xl no-underline"
                style={{
                  background: '#fff',
                  color: 'var(--accent-dark)',
                  fontSize: '1rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
                }}
              >
                <span>Start Playing</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>

              <Link
                to="/about"
                id="hero-cta-secondary"
                className="flex items-center gap-2 px-10 py-4 rounded-full font-black transition-all duration-300
                  hover:scale-105 no-underline border-2"
                style={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.65)',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '1rem',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end animate-fade-up delay-400">
            <div className="relative group p-4">
              <div 
                className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110 opacity-60 group-hover:opacity-80 transition-opacity duration-500" 
              />
              <img
                src={logoImg}
                alt="Mi Amor Hero Logo"
                className="relative z-10 w-full max-w-[420px] lg:max-w-[500px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
