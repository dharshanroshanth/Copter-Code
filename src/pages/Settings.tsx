/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useStore, store } from '../store';
import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Key,
  Database,
  Check,
  Flame,
  Cloud,
  Palette,
  Sun,
  Moon,
  Monitor,
  Camera
} from 'lucide-react';

export default function Settings() {
  const { user, theme } = useStore();
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState(user?.name || 'Elena Rostova');
  const [email, setEmail] = useState(user?.email || 'elena@company.com');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (user) {
      await store.updateUserProfile({
        ...user,
        name,
        email,
        avatar,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const tabs = [
    { id: 'account', label: 'Profile Account', icon: User },
    { id: 'appearance', label: 'Appearance Theme', icon: Palette },
    { id: 'database', label: 'Storage & Usage', icon: Database },
    { id: 'security', label: 'Credentials & Privacy', icon: Shield },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 text-[#ecedee]">
      {/* LEFT: Tabs Navigation (4 Cols) */}
      <div className="lg:col-span-4">
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-4 space-y-1">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-3.5 pb-2 border-b border-[#27272a] mb-2">
            System Settings
          </p>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Active Tab Content (8 Cols) */}
      <div className="lg:col-span-8">
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-8 shadow-xl min-h-[400px] flex flex-col justify-between">
          <div className="space-y-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Profile Settings</h3>
                  <p className="text-xs text-zinc-500 mt-1">Configure your PhotoToolkit professional profile credentials.</p>
                </div>

                <div className="space-y-6">

                  <div className="flex items-center gap-6 pb-6 border-b border-[#27272a]">
                    <div className="relative group">
                      <img src={avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-[#27272a]" />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                        <Camera className="w-6 h-6" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => setAvatar(e.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Profile Photo</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">Recommended size: 400x400px. Max size: 2MB.</p>
                      <label className="mt-3 inline-block px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-[11px] font-bold rounded-md cursor-pointer transition-colors">
                        Upload New Photo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => setAvatar(e.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Full Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-900 border border-[#27272a] rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:bg-[#18181b] focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Email Contact</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 bg-zinc-900 border border-[#27272a] rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:bg-[#18181b] focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Appearance Theme</h3>
                  <p className="text-xs text-zinc-500 mt-1">Customize your design workspace theme settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light Mode', desc: 'Clean, high-contrast workspace styling.', icon: Sun },
                    { id: 'dark', label: 'Dark Mode', desc: 'Classic, eye-friendly ambient contrast.', icon: Moon },
                    { id: 'auto', label: 'System Auto', desc: 'Synchronizes with system preferences.', icon: Monitor },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = theme === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`theme-btn-${item.id}`}
                        onClick={() => store.setTheme(item.id as any)}
                        className={`p-5 rounded-xl border text-left flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-950/20'
                            : 'bg-zinc-900 border-[#27272a] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-600/20 text-indigo-400' : 'bg-zinc-950 text-zinc-400'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isActive ? 'text-white' : 'text-zinc-300'}`}>{item.label}</p>
                          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Google Drive Storage & Usage</h3>
                  <p className="text-xs text-zinc-500 mt-1">Track your Google Drive file usage and capacity.</p>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Cloud className="w-4 h-4 text-indigo-400" />
                        Google Drive Storage Capacity
                      </span>
                      <span className="font-mono text-zinc-300 font-bold">
                        {user?.storageUsed || '9.4'} GB / {user?.storageLimit || '20'} GB
                      </span>
                    </div>

                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${user ? (user.storageUsed / user.storageLimit) * 100 : 47}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 border border-[#27272a] rounded-xl text-center">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">AI Operations Limit</p>
                      <p className="text-lg font-bold text-white mt-2">Unlimited</p>
                    </div>

                    <div className="p-4 bg-zinc-900/50 border border-[#27272a] rounded-xl text-center">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Storage Tier</p>
                      <p className="text-sm font-bold text-indigo-400 uppercase tracking-wide mt-2.5 flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 fill-indigo-500" />
                        <span>Full Access</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Credentials & API Keys</h3>
                  <p className="text-xs text-zinc-500 mt-1">Manage external auth mechanisms safely. Credentials are secured server-side.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-zinc-300">GEMINI_API_KEY</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Securely injected from your local Environment variables.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-400 uppercase">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'account' && (
            <div className="pt-6 border-t border-[#27272a] flex items-center justify-between mt-8">
              {saveSuccess ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Credentials Saved Successfully!
                </span>
              ) : (
                <span />
              )}

              <button
                onClick={handleSave}
                className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all shadow-md shadow-indigo-950/40"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
