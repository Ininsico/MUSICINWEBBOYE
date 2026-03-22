import { useState, useRef, useCallback, useEffect } from 'react'
import { useUser, SignOutButton, UserButton } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'
import { Music, Layout, Settings, Mic2, Heart, LogOut, PanelLeftClose, PanelLeftOpen, Activity, Maximize2, Waves, X } from 'lucide-react'
import logo from '../assets/logo.png'
import Piano from '../components/Piano'
import ThemeToggle from '../components/ThemeToggle'

const INTERSTELLAR_MASTER = [
  'U', 'U', 'U', 'U', 'U', 'U', 'E', 'U', 'P', 'U', 'U', 'R', 'U', 'A', 'U', 'U', 'U', 'U', 'U',
  'E', 'U', 'P', 'R', 'U', 'A', 'T', 'U', 'S', 'R', 'U', 'A', 'E', 'U', 'P', 'R', 'U', 'A', 'T', 'U', 'S', 'U', 'U', 'R', 'U', 'A',
  'U', 'U', 'U', 'U', 'U', 'E', 'U', 'P', 'U', 'U', 'F', 'T', 'U', 'S', 'U', 'U', 'R', 'U', 'A', 'U', 'U', 'U', 'U', 'U',
  'E', 'U', 'P', 'U', 'F', 'T', 'U', 'S', 'R', 'U', 'A', 'E', 'U', 'P', 'R', 'U', 'A', 'T', 'U', 'S', 'U', 'U',
  'R', 'U', 'A', 'U', 'U', 'U', 'U', 'U'
];

const TUTORIALS = [
  { name: 'None', keys: [], notes: [], difficulty: '' },
  { 
    name: 'Interstellar (Master)', 
    notes: INTERSTELLAR_MASTER, 
    difficulty: 'Cinematic Masterpiece' 
  },
  { 
    name: 'Inception (Time)', 
    notes: ['A', 'F', 'S', 'A', 'A', 'F', 'S', 'G'], 
    difficulty: 'Cinematic Masterpiece' 
  },
]

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPianoFullScreen, setIsPianoFullScreen] = useState(false)
  const [pianoVolume] = useState(1.0)
  const [pianoReverb] = useState(0.4)
  const [activeTutorial, setActiveTutorial] = useState(TUTORIALS[0])
  const [tutorialStep, setTutorialStep] = useState(0)
  const [isBeating, setIsBeating] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const isAutoPlayingRef = useRef(false)
  
  const pianoRef = useRef(null)
  
  const stopDemo = useCallback(() => {
    setIsAutoPlaying(false)
    isAutoPlayingRef.current = false
    setTutorialStep(0)
    setIsBeating(false)
    if (pianoRef.current) pianoRef.current.killAllNotes()
  }, [])
  
  const playDemo = useCallback(async () => {
    if (activeTutorial.name === 'None' || isAutoPlaying) return
    
    // HARD SYNC AUDIO BEFORE START
    if (pianoRef.current) await pianoRef.current.syncAudio()
    
    setIsAutoPlaying(true)
    isAutoPlayingRef.current = true
    setTutorialStep(0)
    setIsBeating(true)

    const tempo = activeTutorial.name.includes('Interstellar') ? 450 : 900;
    const VIRTUAL_MAP = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM".split("");
    
    const generateNoteFromKey = (key) => {
        const idx = VIRTUAL_MAP.indexOf(key.toUpperCase());
        if (idx === -1) return "C4";
        const noteNames = ['A', 'As', 'B', 'C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs'];
        const totalIdx = idx + 24; 
        const name = noteNames[totalIdx % 12];
        const oct = Math.floor(totalIdx / 12);
        return `${name.replace('s', '#')}${oct}`;
    }

    for (let i = 0; i < activeTutorial.notes.length; i++) {
        if (!isAutoPlayingRef.current) break;
        setTutorialStep(i);
        if (pianoRef.current) {
            const currentItem = activeTutorial.notes[i];
            const notesToPlay = Array.isArray(currentItem) ? currentItem : [currentItem];
            notesToPlay.forEach(k => {
                const noteName = generateNoteFromKey(k);
                pianoRef.current.playNote(noteName, tempo * 1.5);
            });
        }
        await new Promise(r => setTimeout(r, tempo));
    }
    
    setIsAutoPlaying(false)
    isAutoPlayingRef.current = false
    setTutorialStep(0)
    setIsBeating(false)
  }, [activeTutorial])

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black font-sans">
      {/* SIDEBAR */}
      <aside className={`flex flex-col bg-zinc-50 border-r border-zinc-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 flex items-center justify-between">
           {!isCollapsed && <span className="text-xl font-black italic text-pink-600">MiAmor</span>}
           <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-zinc-200 rounded-xl transition-colors">
              {isCollapsed ? <PanelLeftOpen size={20}/> : <PanelLeftClose size={20}/>}
           </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { icon: Layout, label: 'Overview', path: '/dashboard' },
            { icon: Music, label: 'My Studio', path: '/studio' },
            { icon: Mic2, label: 'Recordings', path: '/recordings' },
            { icon: Heart, label: 'Favorites', path: '/favorites' },
            { icon: Settings, label: 'Settings', path: '/settings' },
          ].map((item) => (
            <Link key={item.label} to={item.path} className={`flex items-center gap-3 p-3 rounded-2xl font-bold text-xs transition-all no-underline
                ${item.label === 'Overview' ? 'bg-black text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-200 hover:text-black'}`}>
              <item.icon size={18} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 space-y-4">
            <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-zinc-100 italic">
                <ThemeToggle />
                {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Atmosphere</span>}
            </div>
            
            <div className={`flex items-center gap-3 p-2 rounded-2xl border border-zinc-100 ${isCollapsed ? 'justify-center' : ''}`}>
               <UserButton afterSignOutUrl="/"/>
               {!isCollapsed && (
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-tight truncate w-24">{user?.firstName}</span>
                   <SignOutButton>
                     <button className="text-[8px] font-black uppercase tracking-widest text-rose-500 hover:underline text-left">Sign Out</button>
                   </SignOutButton>
                 </div>
               )}
            </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="p-8 border-b border-zinc-100">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-xl">
             <div className="flex flex-col">
               <h1 className="text-4xl font-black text-black tracking-tighter italic">Studio <span className="text-pink-600">Console</span></h1>
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Welcome back, {user?.firstName}</p>
             </div>

             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-200">
                    <button onClick={() => setIsBeating(!isBeating)} className={`px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${isBeating ? 'bg-black text-white' : 'bg-white text-zinc-500 hover:bg-zinc-100 shadow-sm'}`}>
                      <Waves size={14} className={isBeating ? 'animate-pulse' : ''} />
                      {isBeating ? 'Syncing' : 'Tempo'}
                    </button>
                    <div className="w-px h-6 bg-zinc-200" />
                    <select value={activeTutorial.name} onChange={(e) => setActiveTutorial(TUTORIALS.find(x => x.name === e.target.value))} className="bg-transparent text-[10px] font-black uppercase tracking-widest border-none focus:outline-none cursor-pointer text-black px-4">
                        {TUTORIALS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                    {activeTutorial.name !== 'None' && (
                        <button onClick={isAutoPlaying ? stopDemo : playDemo} className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${isAutoPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-black text-white hover:bg-zinc-800 shadow-lg'}`}>
                            {isAutoPlaying ? <X size={14} /> : <Activity size={14} />}
                            {isAutoPlaying ? 'Stop Session' : 'Play Song'}
                        </button>
                    )}
                </div>
                <div className="w-px h-8 bg-zinc-200" />
                <button onClick={() => setIsPianoFullScreen(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white hover:bg-pink-600 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest">
                    <Maximize2 size={14} />
                    Full Screen
                </button>
             </div>
          </div>
        </header>

        <section className="flex-1 p-8 flex flex-col overflow-hidden">
           <div 
             className="flex-1 bg-white rounded-[3rem] border border-zinc-200 shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden relative group"
           >
              <Piano ref={pianoRef} volume={pianoVolume} reverb={pianoReverb} isFullScreen={isPianoFullScreen} onExitFullScreen={() => setIsPianoFullScreen(false)} highlightedKey={generateNoteFromKeyInHUD(activeTutorial.notes?.[tutorialStep])} isBeating={isBeating} />
              
              {activeTutorial.name !== 'None' && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center pointer-events-none">
                  <div className="flex gap-4 p-4 bg-zinc-950/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-3xl">
                      {activeTutorial.notes.slice(tutorialStep, tutorialStep + 5).map((k, i) => (
                        <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-300 
                            ${i === 0 ? 'bg-yellow-400 text-black scale-110 shadow-2xl border-4 border-white' : 'bg-white/5 text-zinc-500 border border-white/5'}`}>
                          {k}
                        </div>
                      ))}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.6em] text-zinc-500 mt-6">Next 5 Master Notes</span>
                </div>
              )}
           </div>
        </section>
      </main>

      {isPianoFullScreen && <Piano ref={pianoRef} volume={pianoVolume} reverb={pianoReverb} isFullScreen={true} onExitFullScreen={() => setIsPianoFullScreen(false)} isBeating={isBeating} />}
    </div>
  )
}

function generateNoteFromKeyInHUD(key) {
    if (!key) return null;
    const VIRTUAL_MAP = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM".split("");
    const idx = VIRTUAL_MAP.indexOf(key.toUpperCase());
    if (idx === -1) return null;
    const noteNames = ['A', 'As', 'B', 'C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs'];
    const totalIdx = idx + 24; 
    const name = noteNames[totalIdx % 12];
    const oct = Math.floor(totalIdx / 12);
    return `${name.replace('s', '#')}${oct}`;
}
