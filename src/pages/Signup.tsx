import * as React from 'react';
import { store } from '../store';
import { useState } from 'react';
import { Sparkles, Mail, Lock, ShieldCheck, Zap, Focus, EyeOff, Eye, User as UserIcon, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agree) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    store.setUser({
      id: 'signed-up-user-id',
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      plan: 'free',
      storageUsed: 0.0,
      storageLimit: 20,
      creditsUsed: 10,
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
          Already have an account?{' '}
          <button onClick={() => store.setView('login')} className="text-[#6366F1] font-semibold hover:text-indigo-700 transition-colors">
            Log in
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
              Create. Edit. Enhance.<br/>
              <span className="text-[#6366F1]">All in One Place.</span>
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-slate-500 mb-10 leading-relaxed">
              Join millions of creators, designers and businesses who trust PhotoToolkit for their image editing needs.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">AI-Powered Tools</h3>
                  <p className="text-slate-500 text-[15px]">Smart editing in seconds.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                  <Cloud className="w-6 h-6 text-sky-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Cloud Storage</h3>
                  <p className="text-slate-500 text-[15px]">Access your projects anywhere, anytime.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Secure & Private</h3>
                  <p className="text-slate-500 text-[15px]">Your data is 100% safe with us.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Fast & Easy</h3>
                  <p className="text-slate-500 text-[15px]">Powerful tools. No learning curve.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Abstract images composition (bottom left) */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="absolute bottom-10 right-0 h-64 w-[500px] pointer-events-none">
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
              Enhance with AI
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 lg:pr-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[480px] mx-auto bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
            <div className="text-center mb-6">
              <h2 className="text-[28px] font-extrabold text-slate-900 mb-2">Create Your Account</h2>
              <p className="text-[15px] text-slate-500">Start your creative journey with PhotoToolkit</p>
            </div>

            <div className="space-y-3 mb-6">
              <button onClick={() => {}} className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[14px] font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95c2.31-2.13 3.63-5.27 3.63-8.64z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.95-3.08c-1.1.74-2.51 1.18-4.01 1.18-3.08 0-5.69-2.08-6.62-4.88H1.31v3.18A11.99 11.99 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.38 14.31a7.16 7.16 0 0 1 0-4.62V6.51H1.31a11.99 11.99 0 0 0 0 10.98l4.07-3.18z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.31 0 3.28 2.69 1.31 6.51l4.07 3.18c.93-2.8 3.54-4.88 6.62-4.88z" />
                </svg>
                Sign up with Google
              </button>

              <button onClick={() => {}} className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[14px] font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M16.365 7.043c-.85-1.025-2.073-1.688-3.376-1.745-.102 1.386.536 2.656 1.343 3.593.82.955 2.115 1.656 3.42 1.63-.122-1.428-.592-2.518-1.387-3.478zM17.153 11.23c-1.465.02-3.08-1.002-4.004-1.002-.953 0-2.316.96-3.528.98-1.554.02-2.993.904-3.792 2.302-1.616 2.812-.413 6.974 1.157 9.248.77 1.12 1.682 2.38 2.88 2.337 1.158-.04 1.61-.744 3.012-.744 1.39 0 1.8.743 3.012.723 1.25-.02 2.052-1.16 2.795-2.25 1.142-1.666 1.61-3.285 1.632-3.37-.035-.015-3.155-1.213-3.164-4.81-.01-3.01 2.455-4.444 2.57-4.51-1.41-2.062-3.59-2.284-4.57-2.903z"/>
                </svg>
                Sign up with Apple
              </button>
              
              <button onClick={() => {}} className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[14px] font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2"/>
                  <path d="M15.466 14.89l.443-2.89h-2.773V9.797c0-.79.387-1.562 1.63-1.562h1.26v-2.46s-1.144-.195-2.238-.195c-2.285 0-3.777 1.384-3.777 3.89V12h-2.54v2.89h2.54v6.988a10.032 10.032 0 002.83 0v-6.988h2.33z" fill="#ffffff"/>
                </svg>
                Sign up with Facebook
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <hr className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-4 text-[13px] font-medium text-slate-400">or</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100 mb-2">
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-900">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-900">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-900">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-900">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]" />
                  <span className="text-[13px] text-slate-600">I agree to the <a href="#" className="text-[#6366F1] hover:underline">Terms of Service</a> and <a href="#" className="text-[#6366F1] hover:underline">Privacy Policy</a></span>
                </label>
              </div>

              <button type="submit" className="w-full h-11 mt-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-indigo-500/25">
                Sign Up
              </button>
            </form>

            <div className="mt-6 flex justify-center items-center gap-1.5 text-[12px] text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Your data is <span className="text-[#6366F1] font-semibold">protected</span> with end-to-end encryption
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
