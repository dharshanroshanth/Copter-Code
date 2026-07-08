import * as React from 'react';
import { store } from '../store';
import { useState } from 'react';
import { Sparkles, Mail, Lock, ShieldCheck, Zap, Focus, EyeOff, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    store.setUser({
      id: 'elena-id',
      name: 'Elena Rostova',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      plan: 'free',
      storageUsed: 9.4,
      storageLimit: 20,
      creditsUsed: 120,
      creditsLimit: 500,
    });
    store.setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Header */}
      <header className="px-8 h-24 flex items-center justify-between z-50 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => store.setView('landing')}>
          <div className="w-9 h-9 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Focus className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-[20px] tracking-tight">PhotoToolkit</span>
        </div>
        <div className="text-[15px] text-slate-600 font-medium">
          Don't have an account?{' '}
          <button onClick={() => store.setView('signup')} className="text-[#6366F1] font-semibold hover:text-indigo-700 transition-colors">
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex pt-24 pb-8">
        {/* Left Side - Info & Graphics */}
        <div className="hidden lg:flex flex-col w-[55%] pl-20 pr-10 pt-10 pb-10 justify-between relative">
          <div className="max-w-[480px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Image Toolkit
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Welcome Back!
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl text-slate-500 mb-12">
              Log in to continue your creative journey
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit, enhance & create</h3>
                  <p className="text-slate-500 text-[15px]">Powerful AI tools in one place</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-blue-500 fill-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Save & access anywhere</h3>
                  <p className="text-slate-500 text-[15px]">Your projects, anytime, anywhere</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Secure & private</h3>
                  <p className="text-slate-500 text-[15px]">Your data is 100% safe with us</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Abstract images composition (bottom left) */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="relative h-64 mt-12 max-w-[500px]">
            {/* Background decorative dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/20 blur-[80px] rounded-full -z-10" />

            <div className="absolute top-0 left-0 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white rotate-[-8deg] z-10">
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=80" alt="Edit sample" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-12 left-32 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white rotate-[4deg] z-20">
              <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&auto=format&fit=crop&q=80" alt="Edit sample 2" className="w-full h-full object-cover" />
              {/* Overlay edit controls mock */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg shadow-sm flex items-center p-1.5 gap-2">
                 <div className="w-6 h-6 rounded flex items-center justify-center text-slate-700"><Sparkles className="w-3.5 h-3.5" /></div>
                 <div className="w-6 h-6 rounded flex items-center justify-center text-slate-700"><Focus className="w-3.5 h-3.5" /></div>
              </div>
            </div>
            <div className="absolute top-0 right-10 w-40 h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white rotate-[12deg] z-10">
              <img src="https://images.unsplash.com/photo-1490750967868-88cb44cb271b?w=500&auto=format&fit=crop&q=80" alt="Edit sample 3" className="w-full h-full object-cover" />
            </div>
            
            <div className="absolute bottom-4 right-16 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 z-30 font-semibold text-sm text-[#6366F1]">
              <Sparkles className="w-4 h-4" />
              AI Enhance
            </div>
          </motion.div>

          {/* Social Proof (bottom) */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="User" className="w-9 h-9 rounded-full border-2 border-[#F8FAFC] object-cover" />
              ))}
            </div>
            <p className="text-[14px] text-slate-500 font-medium">Trusted by <span className="font-bold text-[#6366F1]">2M+</span> creators<br/>and businesses worldwide</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 lg:pr-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[480px] mx-auto bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-[32px] font-extrabold text-slate-900 mb-2">Log In</h2>
              <p className="text-[15px] text-slate-500">Welcome back! Please enter your details.</p>
            </div>

            <div className="space-y-3 mb-8">
              <button onClick={() => {}} className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[15px] font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95c2.31-2.13 3.63-5.27 3.63-8.64z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.95-3.08c-1.1.74-2.51 1.18-4.01 1.18-3.08 0-5.69-2.08-6.62-4.88H1.31v3.18A11.99 11.99 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.38 14.31a7.16 7.16 0 0 1 0-4.62V6.51H1.31a11.99 11.99 0 0 0 0 10.98l4.07-3.18z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.31 0 3.28 2.69 1.31 6.51l4.07 3.18c.93-2.8 3.54-4.88 6.62-4.88z" />
                </svg>
                Continue with Google
              </button>

              <button onClick={() => {}} className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[15px] font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M16.365 7.043c-.85-1.025-2.073-1.688-3.376-1.745-.102 1.386.536 2.656 1.343 3.593.82.955 2.115 1.656 3.42 1.63-.122-1.428-.592-2.518-1.387-3.478zM17.153 11.23c-1.465.02-3.08-1.002-4.004-1.002-.953 0-2.316.96-3.528.98-1.554.02-2.993.904-3.792 2.302-1.616 2.812-.413 6.974 1.157 9.248.77 1.12 1.682 2.38 2.88 2.337 1.158-.04 1.61-.744 3.012-.744 1.39 0 1.8.743 3.012.723 1.25-.02 2.052-1.16 2.795-2.25 1.142-1.666 1.61-3.285 1.632-3.37-.035-.015-3.155-1.213-3.164-4.81-.01-3.01 2.455-4.444 2.57-4.51-1.41-2.062-3.59-2.284-4.57-2.903z"/>
                </svg>
                Continue with Apple
              </button>
              
              <button onClick={() => {}} className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[15px] font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2"/>
                  <path d="M15.466 14.89l.443-2.89h-2.773V9.797c0-.79.387-1.562 1.63-1.562h1.26v-2.46s-1.144-.195-2.238-.195c-2.285 0-3.777 1.384-3.777 3.89V12h-2.54v2.89h2.54v6.988a10.032 10.032 0 002.83 0v-6.988h2.33z" fill="#ffffff"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-8">
              <hr className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-4 text-[13px] font-medium text-slate-400">or</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-900">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-900">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]" defaultChecked />
                  <span className="text-[14px] font-medium text-slate-700">Remember me</span>
                </label>
                <a href="#" className="text-[14px] font-semibold text-[#6366F1] hover:text-indigo-700">Forgot Password?</a>
              </div>

              <button type="submit" className="w-full h-12 mt-4 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-indigo-500/25">
                Log In
              </button>
            </form>

            <div className="mt-8 flex justify-center items-center gap-1.5 text-[13px] text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Your data is <span className="text-[#6366F1] font-semibold">protected</span> with end-to-end encryption
            </div>
          </motion.div>

          <p className="text-center text-[13px] text-slate-500 mt-8 font-medium">
            By continuing, you agree to our <a href="#" className="text-[#6366F1] hover:underline">Terms of Service</a> and <a href="#" className="text-[#6366F1] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
