/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useStore, store } from '../store';
import { Search, Bell, Plus, ChevronDown, User, LogOut, CheckCircle, Flame, Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { user, currentView, theme } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const renderThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const notifications = [
    { id: '1', text: 'Sarah Lee requested review on "Summer Travel Post"', time: '2 mins ago', unread: true },
    { id: '2', text: 'Your export for "Mountain Lake" is ready for download', time: '1 hour ago', unread: true },
    { id: '3', text: 'System Update: High-fidelity image expansion is now active', time: '1 day ago', unread: false },
  ];

  const handleNewProject = () => {
    store.setView('tools');
  };

  return (
    <header
      id="main-app-header"
      className="h-[88px] border-b-0 bg-[#F8FAFC] px-10 flex items-center justify-between sticky top-0 z-20"
    >
      {/* Welcome Title (Only on Dashboard for now, or generally welcome) */}
      <div className="flex-1">
        {currentView === 'dashboard' ? (
          <div>
            <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Alex'}! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-[14px] text-slate-500 font-medium mt-0.5">
              Ready to create something amazing today?
            </p>
          </div>
        ) : (
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight capitalize">
            {currentView.replace('-', ' ')}
          </h1>
        )}
      </div>

      {/* Global Actions Bar */}
      <div className="flex items-center gap-6">
        {/* Search Input Area */}
        <div className="relative group w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors" />
          <input
            type="text"
            placeholder="Search tools, templates, projects..."
            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#6366F1] transition-all shadow-sm"
          />
        </div>

        {/* "+ New Project" Button */}
        <button
          onClick={handleNewProject}
          className="h-11 px-5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-[14px] font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Project</span>
        </button>

        {/* Theme Toggle Popover */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors relative shadow-sm"
          >
            {renderThemeIcon()}
          </button>

          <AnimatePresence>
            {themeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 text-slate-900"
                >
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        store.setTheme('light');
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-colors font-medium ${theme === 'light' ? 'bg-indigo-50 text-[#6366F1]' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => {
                        store.setTheme('dark');
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-colors font-medium ${theme === 'dark' ? 'bg-indigo-50 text-[#6366F1]' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => {
                        store.setTheme('auto');
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg transition-colors font-medium ${theme === 'auto' ? 'bg-indigo-50 text-[#6366F1]' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>System Auto</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors relative shadow-sm"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 text-slate-900"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
                    <span className="font-bold text-slate-900 text-[13px] uppercase tracking-wide">Notifications</span>
                    <span className="text-[11px] text-[#6366F1] font-bold bg-indigo-50 px-2 py-0.5 rounded-md">3 New</span>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex gap-3 text-[13px] leading-snug">
                        <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${n.unread ? 'bg-[#6366F1]' : 'bg-slate-300'}`} />
                        <div>
                          <p className="text-slate-700 font-medium">{n.text}</p>
                          <span className="text-[11px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-[14px] font-bold text-slate-900 hidden sm:block">
              {user?.name || 'Alex Johnson'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 text-slate-900"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide font-bold">Signed in as</p>
                    <p className="text-[13px] font-bold text-slate-900 truncate mt-0.5">{user?.email || 'alex@example.com'}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-[#6366F1] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md w-fit">
                      <Flame className="w-3 h-3 fill-indigo-500 text-indigo-500" />
                      <span>PRO PLAN</span>
                    </div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        store.setView('settings');
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        store.setUser(null);
                        store.setView('landing');
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
