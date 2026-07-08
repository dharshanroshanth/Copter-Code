/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useStore, store } from '../store';
import { ViewType } from '../types';
import { getAccessToken } from '../lib/firebase';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Settings,
  Cloud,
  ChevronRight,
  Focus,
  Wand2,
  Image as ImageIcon,
  LayoutTemplate,
  FolderOpen,
  FileText,
  Users,
} from 'lucide-react';

export default function Sidebar() {
  const { currentView, user } = useStore();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      store.updateGoogleDriveStorage(token);
    }
  }, [currentView]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tools', label: 'Quick Tools', icon: Settings },
    { id: 'ai-studio', label: 'AI Studio', icon: Wand2 },
    { id: 'creator-studio', label: 'Creator Studio', icon: ImageIcon },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'files', label: 'Google Drive', icon: Cloud },
    { id: 'workspace', label: 'Workspace', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const storagePercentage = user ? (user.storageUsed / user.storageLimit) * 100 : 65;
  const storageUsed = user?.storageUsed || 6.5;
  const storageLimit = user?.storageLimit || 10;

  return (
    <aside
      id="sidebar-container"
      className="w-[260px] bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 text-slate-900"
    >
      {/* Brand Logo Header */}
      <div className="pt-8 pb-6 px-6 flex items-center gap-3">
        <div
          onClick={() => store.setView(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-[10px] bg-[#6366F1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Focus className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-[20px] tracking-tight text-slate-900">
            PhotoToolkit
          </span>
        </div>
      </div>

      {/* Navigational Menu Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => store.setView(item.id as ViewType)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-50 text-[#6366F1]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#6366F1]' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Promotions & Storage Info */}
      <div className="p-4 space-y-4">
        {/* Storage Progress Widget */}
        <div className="px-1 pb-4">
          <div className="text-[14px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <Cloud className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
            <span>Google Drive Storage</span>
          </div>
          <div className="text-[12px] text-slate-500 font-medium mb-2.5">
            {Math.round(storagePercentage)}% of {storageLimit} GB used
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#6366F1] rounded-full transition-all duration-500"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          <div className="text-right text-[11px] text-slate-500 font-medium mb-4">
            {storageUsed} GB / {storageLimit} GB
          </div>
          <button
            onClick={() => store.setView('settings')}
            className="text-[13px] font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" /> Manage Storage
          </button>
        </div>
      </div>
    </aside>
  );
}
