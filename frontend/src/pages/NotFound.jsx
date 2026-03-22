import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
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

      <main className="relative flex-1 flex flex-col items-center justify-center p-8 text-center" style={{ zIndex: 10 }}>
        <div className="animate-fade-up">
          <h1 
            className="text-[12rem] lg:text-[18rem] font-black leading-none opacity-20 select-none pointer-events-none mb-[-4rem]"
            style={{ color: '#fff', textShadow: '0 0 80px rgba(0,0,0,0.2)' }}
          >
            404
          </h1>
          <h2 className="text-4xl lg:text-6xl font-black mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>
            Lost in the <span className="text-white/80">Sound.</span>
          </h2>
          <p className="text-xl font-bold mb-12 max-w-lg mx-auto opacity-90" style={{ color: '#fff' }}>
            The frequencies you're looking for aren't quite right. Let's get you back to the main stage.
          </p>
          <Link 
            to="/" 
            className="px-12 py-5 bg-white text-[var(--rose)] font-black rounded-full hover:scale-105 transition-transform no-underline shadow-2xl"
          >
            Return to Harmony
          </Link>
        </div>
      </main>
    </div>
  )
}
