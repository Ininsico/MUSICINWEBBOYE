import { useEffect, useRef, useState } from 'react'

const NOTES = ['♩', '♪', '♫', '♬', '𝄞', '𝄢']

function FloatingNote({ note, style }) {
  return (
    <span
      className="pointer-events-none select-none absolute text-[var(--pink-dark)] opacity-0 z-50"
      style={{ animation: 'note-drift 3s ease-out forwards', ...style }}
    >
      {note}
    </span>
  )
}

export default function FloatingNotes() {
  const [notes, setNotes] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    const spawn = () => {
      const id   = idRef.current++
      const note = NOTES[Math.floor(Math.random() * NOTES.length)]
      const left = `${10 + Math.random() * 80}%`
      const top  = `${20 + Math.random() * 60}%`
      const size = `${1.2 + Math.random() * 1.4}rem`
      setNotes(prev => [...prev, { id, note, left, top, size }])
      setTimeout(() => setNotes(prev => prev.filter(n => n.id !== id)), 3100)
    }
    window.addEventListener('keydown', spawn)
    return () => window.removeEventListener('keydown', spawn)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {notes.map(({ id, note, left, top, size }) => (
        <FloatingNote key={id} note={note} style={{ left, top, fontSize: size }} />
      ))}
    </div>
  )
}
