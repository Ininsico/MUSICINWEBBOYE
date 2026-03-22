import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('miamor-theme') === 'dark' || 
             (!localStorage.getItem('miamor-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('miamor-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('miamor-theme', 'light')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 text-[var(--accent)] hover:scale-110 active:scale-95 shadow-sm"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} className="text-[var(--accent-dark)]" />}
    </button>
  )
}
