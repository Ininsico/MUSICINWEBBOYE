import { useUser, SignOutButton } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'
import { Music, Layout, Settings, Mic2, Heart, Shield, LogOut, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" />

  const sidebarItems = [
    { icon: <Layout size={20} />, label: 'Overview', active: true },
    { icon: <Music size={20} />, label: 'My Studio' },
    { icon: <Mic2 size={20} />, label: 'Recordings' },
    { icon: <Heart size={20} />, label: 'Favorites' },
    { icon: <Shield size={20} />, label: 'Privacy' },
  ]

  return (
    <div className="flex min-h-screen bg-[#0a0508] text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-white/2 flex flex-col items-center lg:items-stretch py-8 px-4 transition-all duration-300">
        <div className="flex items-center gap-3 px-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--pink)] to-[var(--rose)] flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Music size={24} className="text-white" />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            MiAmor
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${item.active ? 'bg-white/10 text-[var(--pink)]' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className={`${item.active ? 'text-[var(--pink)]' : 'group-hover:text-[var(--pink)] transition-colors'}`}>
                {item.icon}
              </span>
              <span className="hidden lg:block font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all group">
            <Settings size={20} className="group-hover:rotate-45 transition-transform" />
            <span className="hidden lg:block font-bold text-sm">Settings</span>
          </button>
          <SignOutButton>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all group">
              <LogOut size={20} />
              <span className="hidden lg:block font-bold text-sm">Logout</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Studio <span className="text-[var(--pink)]">Dashboard</span>
            </h1>
            <p className="text-zinc-500 font-semibold">Welcome back, {user.firstName || 'Music Maestro'}. What are we creating today?</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
            <img src={user.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-white/10" alt="Profile" />
            <div className="hidden sm:block pr-4">
              <p className="text-sm font-black">{user.fullName}</p>
              <p className="text-xs text-zinc-500 font-bold">{user.primaryEmailAddress.emailAddress}</p>
            </div>
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* LARGE MAIN CARD */}
          <div className="lg:col-span-3 lg:row-span-2 rounded-[3rem] bg-gradient-to-br from-zinc-900 via-[#1a1114] to-zinc-900 border border-white/10 p-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--pink)] opacity-[0.03] blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.06] transition-opacity" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <span className="px-5 py-2 rounded-full bg-white/5 text-[var(--pink)] text-xs font-black uppercase tracking-widest border border-white/10">Active Session</span>
                <span className="text-zinc-500 hover:text-white cursor-pointer transition-colors"><ChevronRight size={24} /></span>
              </div>
              <div className="mt-auto">
                <h2 className="text-6xl font-black mb-6 leading-none">Your Infinite <br/> Audio Canvas.</h2>
                <div className="flex gap-4">
                  <Link to="/instruments" className="px-8 py-4 rounded-full bg-white text-black font-black hover:scale-105 transition-transform no-underline">Start Composing</Link>
                  <button className="px-8 py-4 rounded-full bg-white/10 text-white font-black hover:bg-white/15 transition-all">Quick Record</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE WIDGET (Stats/Recent) */}
          <div className="lg:col-span-1 lg:row-span-2 rounded-[3rem] bg-white/2 border border-white/10 p-8 flex flex-col gap-6 backdrop-blur-3xl shadow-xl">
             <h3 className="text-xl font-black" style={{ fontFamily: 'var(--font-serif)' }}>Current Setup</h3>
             <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { name: 'Grand Piano', level: '85%', color: 'var(--pink)' },
                  { name: 'Electric Drums', level: '42%', color: 'var(--pink-dark)' },
                  { name: 'Synthesizer', level: '0%', color: 'var(--rose)' },
                ].map((inst, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/8 transition-colors">
                    <div className="flex justify-between mb-2">
                       <span className="text-sm font-bold">{inst.name}</span>
                       <span className="text-xs font-bold opacity-60">{inst.level}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full transition-all duration-1000" style={{ width: inst.level, backgroundColor: inst.color }} />
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full py-4 rounded-2xl bg-[var(--pink-dark)] text-white font-black hover:bg-[var(--pink)] transition-colors">View Library</button>
          </div>

          {/* BOTTOM ROW CARDS */}
          <div className="rounded-[3rem] bg-white/2 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/5 transition-colors group shadow-lg">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--pink)] mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
             </div>
             <div>
               <h4 className="font-black text-lg mb-2">Cloud Sync</h4>
               <p className="text-sm text-zinc-500 font-bold leading-relaxed">Your compositions are encrypted and safe.</p>
             </div>
          </div>

          <div className="rounded-[3rem] bg-white/2 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/5 transition-colors group shadow-lg">
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Settings size={24} />
             </div>
             <div>
               <h4 className="font-black text-lg mb-2">Engine Config</h4>
               <p className="text-sm text-zinc-500 font-bold leading-relaxed">Optimize audio buffers and latency settings.</p>
             </div>
          </div>

          <div className="lg:col-span-2 rounded-[3.5rem] bg-gradient-to-r from-[var(--pink-dark)] to-[var(--rose)] p-10 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-2">
                <h4 className="text-3xl font-black leading-tight">Join the Miamor <br/> Creative Circle.</h4>
                <p className="text-sm font-bold opacity-90">Unlock exclusive instruments and collaborations.</p>
              </div>
              <button className="relative z-10 whitespace-nowrap px-10 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-transform shadow-xl">Go Pro ✨</button>
          </div>
        </div>
      </main>
    </div>
  )
}
