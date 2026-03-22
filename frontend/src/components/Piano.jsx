import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const KEYS = [
  // LOW OCTAVE (Z-/ mapping)
  { note: 'C3',  sargam: 'SA',  key: 'Z', type: 'white', freq: 130.81 },
  { note: 'C#3', sargam: 're',  key: 'S', type: 'black', freq: 138.59 },
  { note: 'D3',  sargam: 'RE',  key: 'X', type: 'white', freq: 146.83 },
  { note: 'D#3', sargam: 'ga',  key: 'D', type: 'black', freq: 155.56 },
  { note: 'E3',  sargam: 'GA',  key: 'C', type: 'white', freq: 164.81 },
  { note: 'F3',  sargam: 'MA',  key: 'V', type: 'white', freq: 174.61 },
  { note: 'F#3', sargam: 'ma',  key: 'G', type: 'black', freq: 185.00 },
  { note: 'G3',  sargam: 'PA',  key: 'B', type: 'white', freq: 196.00 },
  { note: 'G#3', sargam: 'dha', key: 'H', type: 'black', freq: 207.65 },
  { note: 'A3',  sargam: 'DHA', key: 'N', type: 'white', freq: 220.00 },
  { note: 'A#3', sargam: 'ni',  key: 'J', type: 'black', freq: 233.08 },
  { note: 'B3',  sargam: 'NI',  key: 'M', type: 'white', freq: 246.94 },

  // MID OCTAVE (A-' mapping - Standardized)
  { note: 'C4',  sargam: 'SA',  key: 'A', type: 'white', freq: 261.63 },
  { note: 'C#4', sargam: 're',  key: 'W', type: 'black', freq: 277.18 },
  { note: 'D4',  sargam: 'RE',  key: 'S', type: 'white', freq: 293.66 },
  { note: 'D#4', sargam: 'ga',  key: 'E', type: 'black', freq: 311.13 },
  { note: 'E4',  sargam: 'GA',  key: 'D', type: 'white', freq: 329.63 },
  { note: 'F4',  sargam: 'MA',  key: 'F', type: 'white', freq: 349.23 },
  { note: 'F#4', sargam: 'ma',  key: 'T', type: 'black', freq: 369.99 },
  { note: 'G4',  sargam: 'PA',  key: 'G', type: 'white', freq: 392.00 },
  { note: 'G#4', sargam: 'dha', key: 'Y', type: 'black', freq: 415.30 },
  { note: 'A4',  sargam: 'DHA', key: 'H', type: 'white', freq: 440.00 },
  { note: 'A#4', sargam: 'ni',  key: 'U', type: 'black', freq: 466.16 },
  { note: 'B4',  sargam: 'NI',  key: 'J', type: 'white', freq: 493.88 },

  // HIGH OCTAVE (Q-] mapping)
  { note: 'C5',  sargam: 'SA',  key: 'K', type: 'white', freq: 523.25 },
  { note: 'C#5', sargam: 're',  key: 'O', type: 'black', freq: 554.37 },
  { note: 'D5',  sargam: 'RE',  key: 'L', type: 'white', freq: 587.33 },
  { note: 'D#5', sargam: 'ga',  key: 'P', type: 'black', freq: 622.25 },
  { note: 'E5',  sargam: 'GA',  key: ';', type: 'white', freq: 659.25 },
  { note: 'F5',  sargam: 'MA',  key: '[', type: 'white', freq: 698.46 },
  { note: 'F#5', sargam: 'ma',  key: '=', type: 'black', freq: 739.99 },
  { note: 'G5',  sargam: 'PA',  key: ']', type: 'white', freq: 783.99 },
]

export default function Piano({ volume = 0.6, reverb = 0.4, isFullScreen = false, onExitFullScreen }) {
  const [activeKeys, setActiveKeys] = useState(new Set())
  const audioCtxRef = useRef(null)
  const masterGainRef = useRef(null)
  const compressorRef = useRef(null)
  const oscillatorsRef = useRef({}) 
  const isSustainingRef = useRef(false)

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      masterGainRef.current = audioCtxRef.current.createGain()
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime)
      compressorRef.current = audioCtxRef.current.createDynamicsCompressor()
      masterGainRef.current.connect(compressorRef.current)
      compressorRef.current.connect(audioCtxRef.current.destination)
    }
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
    }
  }

  const startNote = (key, freq) => {
    initAudio()
    const now = audioCtxRef.current.currentTime
    if (oscillatorsRef.current[key]) stopNote(key, true)

    const osc1 = audioCtxRef.current.createOscillator()
    const osc2 = audioCtxRef.current.createOscillator()
    const subOsc = audioCtxRef.current.createOscillator()
    const gainNode = audioCtxRef.current.createGain()
    const filter = audioCtxRef.current.createBiquadFilter()

    osc1.type = 'triangle'
    osc2.type = 'sawtooth'
    subOsc.type = 'sine'

    osc1.frequency.setValueAtTime(freq, now)
    osc2.frequency.setValueAtTime(freq * 1.003, now)
    subOsc.frequency.setValueAtTime(freq * 0.5, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2200, now)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.03)

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    subOsc.connect(gainNode)
    gainNode.connect(filter)
    filter.connect(masterGainRef.current)

    osc1.start(now)
    osc2.start(now)
    subOsc.start(now)

    oscillatorsRef.current[key] = { oscs: [osc1, osc2, subOsc], gain: gainNode, released: false }
    setActiveKeys(prev => new Set([...prev, key]))
  }

  const stopNote = (key, immediate = false) => {
    const note = oscillatorsRef.current[key]
    if (!note) return
    if (isSustainingRef.current && !immediate) {
      note.released = true
      return
    }

    const now = audioCtxRef.current.currentTime
    const releaseTime = immediate ? 0.05 : 0.8 + (reverb * 5)
    
    note.gain.gain.cancelScheduledValues(now)
    note.gain.gain.setTargetAtTime(0, now, releaseTime / 4)

    note.oscs.forEach(osc => {
      try { osc.stop(now + releaseTime) } catch(e) {}
    })

    delete oscillatorsRef.current[key]
    setActiveKeys(prev => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.code === 'Space') { 
        e.preventDefault(); 
        isSustainingRef.current = true; 
        return; 
      }
      const char = e.key.toUpperCase();
      const keyObj = KEYS.find(k => k.key === char);
      if (keyObj) startNote(char, keyObj.freq);
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        isSustainingRef.current = false;
        Object.keys(oscillatorsRef.current).forEach(k => {
          if (oscillatorsRef.current[k].released) stopNote(k);
        });
        return;
      }
      const char = e.key.toUpperCase();
      if (KEYS.find(k => k.key === char)) stopNote(char);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [volume, reverb]);

  useEffect(() => {
    if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  return (
    <div className={`w-full flex justify-center items-center transition-all duration-1000 
      ${isFullScreen ? 'fixed inset-0 z-[100] bg-black p-4 lg:p-12' : 'p-2'}`}>
      
      <div className={`relative flex w-full max-w-[1400px] h-[500px] bg-zinc-950 rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.9)] 
        ${isFullScreen ? 'h-[750px]' : ''}`}>
        
        {isFullScreen && (
          <button onClick={onExitFullScreen} className="absolute top-8 right-8 p-4 text-white/20 hover:text-white transition-colors z-[101]">
            <X size={44} />
          </button>
        )}

        <div className="flex w-full h-full p-6 lg:p-12">
          {KEYS.map((k, i) => (
            <div
              key={`${k.note}-${i}`}
              onMouseDown={() => startNote(k.key, k.freq)}
              onMouseUp={() => stopNote(k.key)}
              onMouseLeave={() => stopNote(k.key)}
              className={`
                relative flex flex-col justify-end transition-all duration-150 cursor-pointer
                ${k.type === 'white' 
                  ? 'flex-1 h-full bg-linear-to-b from-zinc-50 to-zinc-200 z-10 border-x border-zinc-300 rounded-b-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]' 
                  : 'w-[3.5%] h-[62%] -mx-[1.75%] bg-linear-to-b from-zinc-700 to-zinc-900 z-20 rounded-b-xl border-x border-zinc-950 shadow-2xl hover:from-zinc-600'}
                ${activeKeys.has(k.key) ? (k.type === 'white' ? 'translate-y-8 !from-zinc-300 !to-zinc-400' : 'translate-y-8 !from-zinc-500 !to-zinc-700') : ''}
              `}
            >
              <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none transition-all duration-500 
                ${activeKeys.has(k.key) ? 'scale-125 opacity-100' : 'scale-100 opacity-60'}`}>
                <div className={`text-xl font-black tracking-tighter ${k.type === 'white' ? 'text-zinc-900' : 'text-[var(--accent)]'}`}>
                  {k.sargam}
                </div>
                {!isFullScreen && k.type === 'white' && (
                  <div className="mt-3 text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-950/5 px-2 py-1 rounded-lg">
                    {k.key}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
