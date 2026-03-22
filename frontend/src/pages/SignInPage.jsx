import { SignIn, useUser } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'
import heroImg from '../assets/hero.png'

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser()

  if (isLoaded && isSignedIn) return <Navigate to="/dashboard" replace />
  return (
    <div className="relative w-full h-screen overflow-hidden">
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

      <Link 
        to="/" 
        className="absolute top-6 left-8 z-50 inline-flex items-center gap-2 text-sm font-black text-white no-underline hover:opacity-80 transition-opacity"
      >
        <span className="text-xl">←</span> Back to Home
      </Link>

      <main className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-6 lg:pt-14 px-8" style={{ zIndex: 10 }}>
        <div className="animate-fade-up">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/" />
        </div>
      </main>
    </div>
  )
}
