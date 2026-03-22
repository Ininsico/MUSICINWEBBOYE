import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { X, Speaker } from 'lucide-react'

// FULL 88-KEY GENERATOR (A0 to C8)
const generateKeys = () => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const keys = []
  keys.push({ note: 'A0', type: 'white', freq: 27.50 })
  keys.push({ note: 'A#0', type: 'black', freq: 29.14 })
  keys.push({ note: 'B0', type: 'white', freq: 30.87 })
  for (let octave = 1; octave <= 7; octave++) {
    for (const name of noteNames) {
      if (keys.length >= 88) break
      const isBlack = name.includes('#')
      const freq = 440 * Math.pow(2, (keys.length - 48) / 12)
      keys.push({ note: `${name}${octave}`, type: isBlack ? 'black' : 'white', freq })
    }
  }
  if (keys.length < 88) keys.push({ note: 'C8', type: 'white', freq: 4186.01 })
  return keys
}

const ALL_88_KEYS = generateKeys()

// SURGICAL 88-KEY MAPPING SYSTEM
const KEY_MAP = {
  // EXTREME LEFT (BASS: A0-B2)
  'Q': 'A0', 'W': 'B0', 'E': 'C1', 'R': 'D1', 'T': 'E1', 'Y': 'F1', 'U': 'G1', 'I': 'A1', 'O': 'B1', 'P': 'C2', '[': 'D2', ']': 'E2',
  // MIDDLE (MID: C3-B5)
  'A': 'C3', 'S': 'D3', 'D': 'E3', 'F': 'F3', 'G': 'G3', 'H': 'A3', 'J': 'B3', 'K': 'C4', 'L': 'D4', ';': 'E4', "'": 'F4',
  // EXTREME RIGHT (TREBLE: C6-C8)
  'Z': 'C6', 'X': 'D6', 'C': 'E6', 'V': 'F6', 'B': 'G6', 'N': 'A6', 'M': 'B6', ',': 'C7', '.': 'D7', '/': 'E7',
  // BLACK KEYS (NUMBERS 1-0)
  '1': 'A#0', '2': 'C#1', '3': 'D#1', '4': 'F#1', '5': 'G#1', '6': 'A#1', '7': 'C#2', '8': 'D#2', '9': 'F#2', '0': 'G#2'
}

const Piano = forwardRef(({ 
    volume = 1.0, 
    reverb = 0.8, 
    isFullScreen = false, 
    onExitFullScreen, 
    highlightedKey = null,
    isBeating = false,
}, ref) => {
  const [activeKeys, setActiveKeys] = useState(new Set())
  const [isAudioReady, setIsAudioReady] = useState(false)
  const audioCtxRef = useRef(null)
  const masterGainRef = useRef(null)
  const oscillatorsRef = useRef({}) 
  const isSustainingRef = useRef(false)
  const beatIntervalRef = useRef(null)

  const initAudio = async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      masterGainRef.current = audioCtxRef.current.createGain()
      masterGainRef.current.gain.setValueAtTime(0.5, audioCtxRef.current.currentTime)
      const comp = audioCtxRef.current.createDynamicsCompressor()
      comp.threshold.setValueAtTime(-10, audioCtxRef.current.currentTime)
      masterGainRef.current.connect(comp)
      comp.connect(audioCtxRef.current.destination)
    }
    if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume()
    }
    setIsAudioReady(true)
    return true;
  }

  const getNoteID = (noteName) => noteName.replace('#', 's');

  const startNote = (noteName, volumeOverride = 0.35) => {
    if (!isAudioReady) return;
    const keyObj = ALL_88_KEYS.find(k => k.note === noteName);
    if (!keyObj) return;
    const id = getNoteID(noteName);
    const now = audioCtxRef.current.currentTime
    
    if (oscillatorsRef.current[id]) {
        oscillatorsRef.current[id].oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch(e) {} });
        delete oscillatorsRef.current[id];
    }

    const osc = audioCtxRef.current.createOscillator() 
    const sub = audioCtxRef.current.createOscillator()
    const gainNode = audioCtxRef.current.createGain()
    const filter = audioCtxRef.current.createBiquadFilter()

    osc.type = 'triangle'
    sub.type = 'sine'
    osc.frequency.setValueAtTime(keyObj.freq, now)
    sub.frequency.setValueAtTime(keyObj.freq / 2, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, now)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(volumeOverride, now + 0.04) 

    osc.connect(filter)
    sub.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(masterGainRef.current)
    osc.start(now)
    sub.start(now)

    oscillatorsRef.current[id] = { oscs: [osc, sub], gain: gainNode, releasedByPlayer: false }
    setActiveKeys(prev => new Set([...prev, id]))
  }

  const stopNote = (noteName, immediate = false) => {
    const id = getNoteID(noteName);
    const note = oscillatorsRef.current[id]
    
    setActiveKeys(prev => {
      const next = new Set(prev); next.delete(id); return next;
    });

    if (!note) return
    if (isSustainingRef.current && !immediate) { note.releasedByPlayer = true; return; }

    const now = audioCtxRef.current.currentTime
    const releaseTime = immediate ? 0.02 : 0.5
    note.gain.gain.cancelScheduledValues(now)
    note.gain.gain.setTargetAtTime(0, now, releaseTime / 5)
    
    setTimeout(() => {
        if (oscillatorsRef.current[id]) {
            note.oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch(e) {} })
            delete oscillatorsRef.current[id]
        }
    }, releaseTime * 1000)
  }

  const killAllNotes = () => {
    const now = audioCtxRef.current?.currentTime || 0;
    Object.keys(oscillatorsRef.current).forEach(id => {
        const note = oscillatorsRef.current[id];
        note?.oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch(e) {} });
        delete oscillatorsRef.current[id];
    });
    setActiveKeys(new Set());
  }

  useEffect(() => {
    if (isBeating && isAudioReady) {
        let step = 0;
        beatIntervalRef.current = setInterval(() => {
            if (!audioCtxRef.current) return;
            const now = audioCtxRef.current.currentTime;
            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();
            osc.frequency.setValueAtTime(step === 0 ? 55 : 40, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.connect(gain);
            gain.connect(masterGainRef.current);
            osc.start(now);
            osc.stop(now + 0.2);
            step = (step + 1) % 4;
        }, 500);
    } else {
        if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    }
    return () => { if (beatIntervalRef.current) clearInterval(beatIntervalRef.current); };
  }, [isBeating, isAudioReady]);

  useImperativeHandle(ref, () => ({
    playNote: (noteName, volume = 0.25) => { startNote(noteName, volume); setTimeout(() => stopNote(noteName, true), 800); },
    syncAudio: () => initAudio(),
    killAllNotes: () => killAllNotes()
  }));

  const handleKeyMap = (key) => KEY_MAP[key.toUpperCase()];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.code === 'Space') { e.preventDefault(); isSustainingRef.current = true; return; }
      if (e.code === 'Escape' && isFullScreen) { onExitFullScreen(); return; }
      const note = handleKeyMap(e.key);
      if (note) startNote(note);
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        isSustainingRef.current = false;
        Object.keys(oscillatorsRef.current).forEach(id => {
            if (oscillatorsRef.current[id].releasedByPlayer) stopNote(id.replace('s', '#'), true);
        });
        return;
      }
      const note = handleKeyMap(e.key);
      if (note) stopNote(note);
    };
    const handleGlobalMouseUp = () => {
        Object.keys(oscillatorsRef.current).forEach(id => stopNote(id.replace('s', '#')));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('blur', killAllNotes);
    return () => { 
        window.removeEventListener('keydown', handleKeyDown); 
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('blur', killAllNotes);
    };
  }, [isAudioReady, isFullScreen]);

  return (
    <div onClick={initAudio} className={`group w-full select-none relative
      ${isFullScreen ? 'fixed inset-0 z-[5000] bg-zinc-950 flex flex-col items-center justify-center p-20' : 'h-[360px]'}`}>
      
      {!isAudioReady && (
        <div className="absolute inset-0 z-[6000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-3xl cursor-pointer">
           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center animate-bounce shadow-[0_0_80px_rgba(225,29,72,0.4)]">
              <Speaker className="text-white" size={48} />
           </div>
           <h2 className="text-white text-4xl font-black uppercase tracking-[0.2em] mt-10 mb-2 italic">Master Studio Sync</h2>
        </div>
      )}

      {/* PIANO HOUSING */}
      <div className={`w-full h-full relative p-4 pb-12 bg-zinc-950 rounded-[2.5rem] border-t-8 border-x-4 border-zinc-900 shadow-[0_100px_150px_rgba(0,0,0,0.8)] flex flex-col
        ${isFullScreen ? 'scale-110' : 'scale-100'}`}>
        
        <div className="h-4 w-full bg-gradient-to-b from-zinc-900 to-zinc-950 mb-1 rounded-t-lg border-b border-zinc-800/20" />

        <div className="flex w-full h-full relative bg-zinc-950 px-1 items-start">
        {ALL_88_KEYS.map((k, i) => {
          const id = getNoteID(k.note);
          const isActive = activeKeys.has(id);
          const isGold = highlightedKey === k.note;
          
          return (
            <div
              key={k.note}
              onMouseDown={(e) => { e.stopPropagation(); startNote(k.note); }}
              onMouseUp={(e) => { e.stopPropagation(); stopNote(k.note); }}
              onMouseLeave={(e) => { e.stopPropagation(); stopNote(k.note); }}
              className={`
                relative flex flex-col justify-end transition-none cursor-pointer 
                ${k.type === 'white' 
                    ? 'flex-1 h-full bg-gradient-to-b from-zinc-100 to-white border-x border-zinc-200 z-10 shadow-[2px_10px_20px_rgba(0,0,0,0.05),inset_0_-8px_15px_rgba(0,0,0,0.05)] rounded-b-md' 
                    : 'w-[0.9%] h-[64%] -mx-[0.45%] bg-gradient-to-b from-zinc-800 to-zinc-950 border-x border-black z-20 rounded-b-lg shadow-2xl ring-1 ring-white/5'}
                ${isActive ? '!bg-zinc-300 !translate-y-4 !shadow-inner' : ''}
                ${isGold ? 'z-30' : ''}
              `}
            >
              {isGold && <div className="absolute inset-0 bg-yellow-400/30 animate-pulse rounded-b-md" />}
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
})

export default Piano;
