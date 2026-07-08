/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useStore, applyTheme, store } from './store';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import QuickTools from './pages/QuickTools';
import BgRemover from './pages/BgRemover';
import ImageEnhancer from './pages/ImageEnhancer';
import ObjectRemover from './pages/ObjectRemover';
import PassportPhoto from './pages/PassportPhoto';
import OCRScanner from './pages/OCRScanner';
import Tools from './pages/Tools';
import Templates from './pages/Templates';
import Resources from './pages/Resources';
import AIStudio from './pages/AIStudio';
import CreatorStudio from './pages/CreatorStudio';
import Settings from './pages/Settings';
import GoogleDriveBrowser from './pages/GoogleDriveBrowser';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Grid, Folder, Image as ImageIcon, Users } from 'lucide-react';

// Simplified view wrapper to support elegant page entry transitions
const FadeInPage = ({ children, viewKey }: { children: React.ReactNode; viewKey: string }) => (
  <motion.div
    key={viewKey}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  const { currentView, theme, user } = useStore();

  React.useEffect(() => {
    applyTheme(theme);

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('auto');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  // Auth Guard Effect
  React.useEffect(() => {
    if (!user) {
      if (!['landing', 'login', 'signup'].includes(currentView)) {
        store.setView('landing');
      }
    } else {
      if (['landing', 'login', 'signup'].includes(currentView)) {
        store.setView('dashboard');
      }
    }
  }, [user, currentView]);

  // Helper renderer to dispatch pages based on current active view
  const renderView = () => {
    if (!user && !['landing', 'login', 'signup'].includes(currentView)) {
      return <Login />;
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <Login />;
      case 'signup':
        return <Signup />;
      case 'dashboard':
        return <Dashboard />;
      case 'quick-tools':
        return <QuickTools />;
      case 'bg-remover':
        return <BgRemover />;
      case 'enhancer':
        return <ImageEnhancer />;
      case 'obj-remover':
        return <ObjectRemover />;
      case 'passport':
        return <PassportPhoto />;
      case 'ocr':
        return <OCRScanner />;
      case 'editor':
      case 'tools':
        return <Tools />;
      case 'ai-studio':
        return <AIStudio />;
      case 'creator-studio':
        return <CreatorStudio />;
      case 'settings':
        return <Settings />;
      case 'templates':
        return <Templates />;
      case 'resources':
        return <Resources />;
      case 'projects':
        return (
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto mt-12 text-[#ecedee]">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center mx-auto">
              <Folder className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Collaborative Projects</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Organize multiple campaign directories, asset bundles, and share mockups with your design team in real-time.
            </p>
          </div>
        );
      case 'files':
        return <GoogleDriveBrowser />;
      case 'workspace':
        return (
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto mt-12 text-[#ecedee]">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Team Workspace</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Invite project managers and external creative stakeholders to comment, review, and download master assets directly.
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  // Determine if the current view should render inside the global layout frame
  const isOuterPage = ['landing', 'login', 'signup'].includes(currentView) || !user;
  const isFullScreenApp = ['tools', 'editor'].includes(currentView);

  return (
    <div id="phototoolkit-app" className="font-sans antialiased bg-[#F8FAFC] text-slate-900 min-h-screen">
      <AnimatePresence mode="wait">
        {isOuterPage || isFullScreenApp ? (
          <FadeInPage viewKey={currentView}>{renderView()}</FadeInPage>
        ) : (
          <div key="authenticated-dashboard" className="flex h-screen overflow-hidden bg-[#F8FAFC]">
            {/* Navigational Sidebar */}
            <Sidebar />

            {/* Core Content Container */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
              <Header />
              <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar bg-[#F8FAFC]">
                <AnimatePresence mode="wait">
                  <FadeInPage viewKey={currentView}>{renderView()}</FadeInPage>
                </AnimatePresence>
              </main>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
