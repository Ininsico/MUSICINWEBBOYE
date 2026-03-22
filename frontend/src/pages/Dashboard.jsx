import { useState, useRef, useCallback, useEffect } from 'react'
import { useUser, SignOutButton, UserButton } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'
import { Music, Layout, Settings, Mic2, Heart, LogOut, PanelLeftClose, PanelLeftOpen, Activity, Maximize2, Waves, X } from 'lucide-react'
import logo from '../assets/logo.png'
import Piano from '../components/Piano'
import ThemeToggle from '../components/ThemeToggle'
import interstellarCover from '../assets/interstellar_cover.png'
import inceptionCover from '../assets/inception_cover.png'
import bladerunnerCover from '../assets/bladerunner_cover.png'

const RECORDINGS = [
  { id: 1, title: 'Interstellar (Stay)', artist: 'Imperial Grand', duration: '4:12', cover: interstellarCover, date: 'Mar 22, 2026' },
  { id: 2, title: 'Inception (Time)', artist: 'Cinematic Session', duration: '3:45', cover: inceptionCover, date: 'Mar 21, 2026' },
  { id: 3, title: 'Blade Runner 2049', artist: 'Synth Foundation', duration: '5:20', cover: bladerunnerCover, date: 'Mar 20, 2026' },
];

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

        {/* MASTERPIECE RECORDINGS - CINEMATIC ALBUM COVERS */}
        <section className="mt-8 mb-20 animate-fade-up px-8">
           <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
              <div className="flex flex-col">
                 <h3 className="text-3xl font-black text-black tracking-tighter italic" style={{ fontFamily: 'var(--font-serif)' }}>Masterpiece <span className="text-pink-600">Recordings</span></h3>
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">Handcrafted Sessions • 88-Key Imperial Studio</span>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-all flex items-center gap-2">
                 Studio Archive 
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {RECORDINGS.map((record) => (
                <div key={record.id} className="group flex flex-col bg-white rounded-[3rem] border border-zinc-200 shadow-2xl overflow-hidden hover:shadow-[0_50px_100px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-4">
                   {/* PREMIUM ALBUM COVER */}
                   <div className="aspect-square w-full relative overflow-hidden bg-black">
                      <img 
                        src={record.cover} 
                        alt={record.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-3xl transform scale-75 group-hover:scale-100 transition-all duration-500">
                            <Activity className="text-pink-600" size={32} />
                         </div>
                      </div>
                      
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-3xl px-4 py-1.5 rounded-full border border-white/10">
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">{record.duration}</span>
                      </div>
                   </div>

                   {/* METADATA OVERLAY */}
                   <div className="p-8 flex flex-col bg-white">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
                         <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.4em]">{record.artist}</span>
                      </div>
                      <h4 className="text-2xl font-black text-black tracking-tight mb-6 italic">{record.title}</h4>
                      <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{record.date}</span>
                         <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white hover:bg-rose-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg">
                            Studio Play
                         </button>
                      </div>
                   </div>
                </div>
              ))}
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
