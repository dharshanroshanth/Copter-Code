import { store } from '../store';
import {
  Sparkles, PlayCircle, ArrowRight, ShieldCheck, Cloud, Zap, Rocket,
  ChevronDown, UserCircle, Wand2, SquareDashed, Type, MonitorUp, Focus, LayoutTemplate, Layers, Aperture
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const handleStart = () => {
    store.setView('signup');
  };

  const handleLogin = () => {
    store.setView('login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <header className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => store.setView('landing')}>
          <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Aperture className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-[22px] tracking-tight">PhotoToolkit</span>
        </div>

        <nav className="hidden lg:flex items-center gap-10 text-[15px] font-semibold text-slate-700">
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group">Features <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" /></button>
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group">Tools <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" /></button>
          <button className="hover:text-indigo-600 transition-colors">Templates</button>
          <button className="hover:text-indigo-600 transition-colors">Pricing</button>
          <button className="hover:text-indigo-600 transition-colors">Blog</button>
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group">Resources <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" /></button>
        </nav>

        <div className="flex items-center gap-6">
          <button onClick={handleLogin} className="text-[15px] font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
            Login
          </button>
          <button onClick={handleStart} className="bg-[#6366F1] hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-[#6366F1]" />
              AI-Powered Image Editing
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#6366F1] text-white text-[11px] font-bold tracking-wide">New</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-[4.5rem] sm:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-slate-900">
            All-in-One <br />
            <span className="text-[#6366F1]">Image Toolkit</span> <br />
            Powered by AI
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-[22px] text-slate-500 max-w-lg leading-relaxed">
            Edit, enhance, convert and create stunning images like a pro – in seconds.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row gap-5 pt-4">
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-2xl text-[17px] font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl text-[17px] font-bold flex items-center justify-center gap-3 transition-all shadow-sm"
            >
              <PlayCircle className="w-6 h-6 text-[#6366F1]" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="pt-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 40}`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-[#F8FAFC] object-cover"
                  />
                ))}
              </div>
              <p className="text-[15px] text-slate-500 font-medium">Trusted by 2M+ creators and businesses</p>
            </div>
            <div className="flex items-center gap-3 text-[15px] text-slate-500">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div><span className="font-bold text-slate-900">4.8/5</span> from 40K+ reviews</div>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Hero Image */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative h-[650px] w-full mt-10 lg:mt-0">
          
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* The main image split effect */}
            {/* Base Image (left side) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center" />
            
            {/* Transparent checkerboard overlay on right half to simulate background removal */}
            <div className="absolute top-0 right-0 bottom-0 w-[45%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgLz4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIiAvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YwZjBmMCIgLz4KPC9zdmc+')] z-0 border-l-4 border-dashed border-[#6366F1]" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center [clip-path:polygon(0_0,55%_0,55%_100%,0_100%)] z-10" />
            
            {/* Loop Arrow graphic connecting the two sides */}
            <svg className="absolute top-8 right-[25%] w-32 h-20 text-[#6366F1] z-20 pointer-events-none drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 50 Q 30 10, 60 20 T 90 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M5 45 L10 50 L15 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Floating Tool Chips */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-12 -left-16 bg-white px-5 py-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100 z-30">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="font-bold text-slate-800 text-[15px] leading-tight">AI Background<br/>Remover</span>
          </motion.div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-44 -left-12 bg-white px-5 py-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100 z-30">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-bold text-slate-800 text-[15px]">Image Enhancer</span>
          </motion.div>

          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-72 -left-16 bg-white px-5 py-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100 z-30">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <SquareDashed className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800 text-[15px]">Object Remover</span>
          </motion.div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute top-[24rem] -left-10 bg-white px-5 py-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100 z-30">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Type className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-bold text-slate-800 text-[15px]">Remove Text</span>
          </motion.div>

          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-16 -left-16 bg-white px-5 py-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100 z-30">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <MonitorUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="font-bold text-slate-800 text-[15px]">AI Upscale</span>
          </motion.div>

          {/* Bottom Right Badge */}
          <div className="absolute -bottom-8 right-8 bg-white px-8 py-5 rounded-full shadow-xl shadow-slate-200/60 flex items-center gap-3 border border-slate-100 z-30">
            <Zap className="w-6 h-6 text-indigo-600 fill-indigo-100" />
            <span className="font-bold text-indigo-900 text-[17px]">Edit 10x Faster with AI</span>
          </div>
        </motion.div>
      </main>

      {/* Feature Strip */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-20 pb-32">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            <div className="flex items-center gap-5 lg:px-8 first:px-0 pt-6 lg:pt-0 first:pt-0">
              <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7 text-[#6366F1] fill-[#6366F1]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">AI Powered</h3>
                <p className="text-[15px] text-slate-500 mt-1">Smart tools for everyone</p>
              </div>
            </div>

            <div className="flex items-center gap-5 lg:px-8 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-rose-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Secure & Private</h3>
                <p className="text-[15px] text-slate-500 mt-1">Your data is 100% safe</p>
              </div>
            </div>

            <div className="flex items-center gap-5 lg:px-8 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center shrink-0">
                <Cloud className="w-7 h-7 text-sky-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Cloud Storage</h3>
                <p className="text-[15px] text-slate-500 mt-1">Access anywhere, anytime</p>
              </div>
            </div>

            <div className="flex items-center gap-5 lg:px-8 pt-6 lg:pt-0">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                <Rocket className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Easy to Use</h3>
                <p className="text-[15px] text-slate-500 mt-1">No skills needed</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <section className="relative w-full bg-gradient-to-b from-white to-[#F8FAFC] py-32 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center space-y-5 mb-20">
            <h4 className="text-[13px] font-bold tracking-[0.25em] text-[#6366F1] uppercase">
              POWERFUL TOOLS, ENDLESS POSSIBILITIES
            </h4>
            <h2 className="text-4xl sm:text-[3rem] font-extrabold text-slate-900 tracking-tight">
              Everything You Need in One Place
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <Wand2 className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">AI Editing</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">Advanced AI tools to edit like a professional</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-8">
                <Sparkles className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">Quick Tools</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">One-click tools for your daily needs</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-8">
                <LayoutTemplate className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">Creator Studio</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">Design thumbnails, posters, memes & more</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8">
                <Layers className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">Templates</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">Thousands of stunning templates</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500" />
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500" />
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500" />
                </div>
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">Batch Processing</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">Edit multiple images at once</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
