import { useState } from 'react'
import { useUser, SignOutButton, UserButton } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'
import { Music, Layout, Settings, Mic2, Heart, Shield, LogOut, PanelLeftClose, PanelLeftOpen, ChevronRight, ChevronLeft, Activity, Maximize2, Waves } from 'lucide-react'
import logo from '../assets/logo.png'
import Piano from '../components/Piano'
import ThemeToggle from '../components/ThemeToggle'

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPianoFullScreen, setIsPianoFullScreen] = useState(false)
  const [pianoVolume, setPianoVolume] = useState(0.6)
  const [pianoReverb, setPianoReverb] = useState(0.4)
  const [showPianoControls, setShowPianoControls] = useState(false)

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" />

  const sidebarItems = [
    { icon: <Layout size={20} />, label: 'Overview', active: true },
    { icon: <Music size={20} />, label: 'My Studio' },
    { icon: <Mic2 size={20} />, label: 'Recordings' },
    { icon: <Heart size={20} />, label: 'Favorites' },
  ]

  return (
    <div className="flex min-h-screen transition-colors duration-400 bg-white text-black" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* SIDEBAR - COMPACT & FLOATING */}
      <aside 
        className={`m-4 h-fit max-h-[calc(100vh-2rem)] rounded-[2.5rem] transition-all duration-500 flex flex-col bg-zinc-50 border border-zinc-200 backdrop-blur-3xl shadow-2xl overflow-hidden sticky top-4
          ${isCollapsed ? 'w-14' : 'w-48'}`}
      >
        <div className={`flex items-center justify-between mb-4 ${isCollapsed ? 'p-3' : 'px-4 py-8'}`}>
          <div className="flex items-center gap-2">
             <img src={logo} alt="MiAmor" className="w-8 h-8 object-contain" />
             {!isCollapsed && <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>MiAmor</span>}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`rounded-xl hover:bg-zinc-200/50 text-zinc-500 transition-all active:scale-95 
              ${isCollapsed ? 'hidden' : 'p-2'}`}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* COMPACT TOGGLE FOR COLLAPSED STATE */}
        {isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="w-full p-4 mb-4 text-zinc-400 hover:text-black transition-colors"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}

        <nav className={`flex-1 space-y-2 ${isCollapsed ? 'px-0' : 'px-3'}`}>
          {[
            { icon: Layout, label: 'Overview', path: '/dashboard' },
            { icon: Music, label: 'My Studio', path: '/studio' },
            { icon: Mic2, label: 'Recordings', path: '/recordings' },
            { icon: Heart, label: 'Favorites', path: '/favorites' },
            { icon: Shield, label: 'Settings', path: '/settings' },
          ].map((item) => (
            <Link 
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 rounded-2xl transition-all group no-underline
                ${isCollapsed ? 'p-3 justify-center' : 'p-3'}
                ${item.label === 'Overview' ? 'bg-black text-white shadow-xl' : 'text-zinc-400 hover:bg-zinc-200/50 hover:text-black'}`}
            >
              <item.icon size={18} className="transition-transform group-hover:scale-110" />
              {!isCollapsed && <span className="font-bold tracking-tight text-xs">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={`border-t border-zinc-100 ${isCollapsed ? 'p-2' : 'p-6'}`}>
           <SignOutButton>
              <button className={`w-full flex items-center transition-all font-bold text-xs group rounded-2xl text-rose-500 hover:bg-rose-50
                ${isCollapsed ? 'p-3 justify-center' : 'p-3 gap-3'}`}>
                 <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                 {!isCollapsed && <span>Logout</span>}
              </button>
           </SignOutButton>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-6 lg:p-10 overflow-y-auto min-h-screen transition-all duration-500 ${isPianoFullScreen ? 'hidden' : 'block'}`}>
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl lg:text-6xl font-black mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Studio <span className="text-[var(--accent-dark)]">Dashboard</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Welcome back, {user.firstName || 'Music Maestro'}. what are we creating today?</p>
          </div>
          <div className="flex items-center gap-8 bg-zinc-50 p-4 rounded-3xl border border-zinc-200 shadow-sm group">
            {/* POWER GAIN CONTROL - PERMANENTLY VISIBLE */}
            <div className="flex items-center gap-4 min-w-[200px] lg:min-w-[300px]">
              <Volume2 size={20} className="text-black opacity-40" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  <span>Power Gain Boost</span>
                  <span className="text-black font-black">{Math.round((pianoVolume / 2.5) * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="2.5" step="0.01" value={pianoVolume} 
                  onChange={(e) => setPianoVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-black"
                />
              </div>
            </div>

            <div className="w-px h-10 bg-zinc-200" />

            {/* Audio Effects Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowPianoControls(!showPianoControls)}
                className={`p-3 rounded-xl transition-all active:scale-95 ${showPianoControls ? 'bg-black text-white shadow-lg' : 'hover:bg-zinc-100 text-zinc-500'}`}
                title="Acoustic Reverb Settings"
              >
                <Activity size={20} />
              </button>
              
              {showPianoControls && (
                <div className="absolute top-16 right-0 w-64 bg-white border border-zinc-200 p-6 rounded-[2rem] shadow-2xl z-[100] animate-fade-up">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <span>Acoustic Reverb</span>
                      <span className="text-black">{Math.round(pianoReverb * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.01" value={pianoReverb} 
                      onChange={(e) => setPianoReverb(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-black"
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsPianoFullScreen(true)}
              className="p-3 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-black transition-all active:scale-95"
            >
              <Maximize2 size={20} />
            </button>

            <div className="w-px h-10 bg-zinc-200" />
            
            <ThemeToggle />
            <div className="w-px h-10 bg-zinc-200" />
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-11 h-11 rounded-xl ring-2 ring-zinc-100 shadow-lg",
                  userButtonTrigger: "focus:outline-none"
                }
              }}
            />
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LARGE MAIN CARD - CLEAN WRAPPER */}
          <div className="lg:col-span-4 lg:row-span-2 rounded-[5rem] overflow-hidden bg-white border border-zinc-200 shadow-[0_50px_100px_rgba(0,0,0,0.1)] min-h-[600px] flex flex-col justify-center">
            <Piano 
              volume={pianoVolume} 
              reverb={pianoReverb} 
              isFullScreen={isPianoFullScreen} 
              onExitFullScreen={() => setIsPianoFullScreen(false)} 
            />
          </div>
        </div>
      </main>

      {/* DETACHED FULL SCREEN PIANO */}
      {isPianoFullScreen && (
        <Piano 
          volume={pianoVolume} 
          reverb={pianoReverb} 
          isFullScreen={true} 
          onExitFullScreen={() => setIsPianoFullScreen(false)} 
        />
      )}
    </div>
  )
}
