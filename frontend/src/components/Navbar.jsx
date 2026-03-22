import { Link, useLocation } from 'react-router-dom'
import { UserButton, useUser, SignedIn, SignedOut } from '@clerk/clerk-react'
import logoImg from '../assets/logo.png'

export default function Navbar({ transparent = false }) {
  const { pathname } = useLocation()
  const { user } = useUser()

  const linkStyle = {
    color: transparent ? 'rgba(255,255,255,0.85)' : 'var(--text-light)',
  }

  return (
    <header
      className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full"
      style={{ position: 'relative', zIndex: 100 }}
    >
      <div className="flex items-center gap-3">
        <Link to="/" id="brand-logo" className="flex items-center no-underline">
          <img
            src={logoImg}
            alt="Mi Amor logo"
            className="w-12 h-12 object-contain drop-shadow-lg"
          />
        </Link>
        <span
          className="text-2xl font-black tracking-tight"
          style={{
            fontFamily: 'var(--font-serif)',
            color: transparent ? '#fff' : 'var(--rose)',
            textShadow: transparent ? '0 2px 16px rgba(196,88,122,0.6)' : 'none',
            letterSpacing: '-0.01em',
          }}
        >
          MiAmor
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {[
          { label: 'Home',        to: '/'            },
          { label: 'Instruments', to: '/instruments' },
          { label: 'About',       to: '/about'       },
        ].map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className="text-sm font-bold transition-colors duration-200 no-underline"
            style={{
              ...linkStyle,
              color: pathname === to
                ? (transparent ? '#fff' : 'var(--rose)')
                : linkStyle.color,
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <SignedOut>
          <Link
            to="/sign-in"
            className="hidden sm:block text-sm font-bold no-underline hover:opacity-80 transition-opacity"
            style={{ color: transparent ? '#fff' : 'var(--text-light)' }}
          >
            Sign In
          </Link>
          <Link 
            to="/sign-up"
            className="px-6 py-2.5 rounded-full font-black text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg no-underline"
            style={{
              background: transparent ? '#fff' : 'var(--rose)',
              color: transparent ? 'var(--rose)' : '#fff',
              boxShadow: transparent ? '0 4px 20px rgba(0,0,0,0.1)' : '0 4px 20px rgba(196,88,122,0.3)',
            }}
          >
            Signup
          </Link>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-3">
            {user?.firstName && (
              <span className="hidden sm:inline text-sm font-bold" style={{ color: transparent ? '#fff' : 'var(--heading)' }}>
                Hi, {user.firstName}
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </header>
  )
}
