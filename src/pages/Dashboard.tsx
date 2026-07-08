/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Scissors, Eraser, Crop as CropIcon } from 'lucide-react';
import { useStore, store } from '../store';
import {
  Sparkles,
  Play,
  Wand2,
  Image as ImageIcon,
  Crop,
  Layers,
  FileText,
  Minimize2,
  ChevronRight,
  FolderOpen,
  Eye,
  Clock,
  PieChart,
  HardDrive
} from 'lucide-react';
import { motion } from 'motion/react';

function ImageComparisonSlider() {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Add global mouse up listener to handle dropping outside the container
  React.useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[300px] md:h-[400px] bg-slate-100 rounded-3xl overflow-hidden select-none cursor-ew-resize shadow-sm border border-slate-200 group"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onClick={(e) => handleMove(e.clientX)}
    >
      {/* Original Image (Background) */}
      <img 
        src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80" 
        alt="Original" 
        className="absolute inset-0 w-full h-full object-cover" 
        draggable={false}
      />
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/20 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
        Original
      </div>

      {/* Processed Image (Foreground/Clipped) */}
      <img 
        src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80" 
        alt="Processed" 
        className="absolute inset-0 w-full h-full object-cover" 
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          filter: 'brightness(1.1) contrast(1.1) saturate(1.6) sepia(0.2)'
        }}
        draggable={false}
      />
      
      <div 
        className="absolute top-4 left-4 bg-[#6366F1]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/20 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
      >
        AI Enhanced
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize flex items-center justify-center pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div 
          className="w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center pointer-events-auto cursor-ew-resize transition-transform hover:scale-110 active:scale-95"
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
            <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, recentFiles } = useStore();
  

  const quickTools = [
    { id: 'crop', name: 'Crop Image', icon: CropIcon, color: 'bg-blue-50 text-blue-500', route: 'tools' },
    { id: 'bg-remover', name: 'Background Remover', icon: Scissors, color: 'bg-indigo-50 text-indigo-500', route: 'bg-remover' },
    { id: 'enhancer', name: 'Image Enhancer', icon: Sparkles, color: 'bg-pink-50 text-pink-500', route: 'enhancer' },
    { id: 'obj-remover', name: 'Object Remover', icon: Eraser, color: 'bg-emerald-50 text-emerald-500', route: 'obj-remover' },
    { id: 'passport', name: 'Passport Photo', icon: ImageIcon, color: 'bg-sky-50 text-sky-500', route: 'passport' },
    { id: 'ocr', name: 'OCR Scanner', icon: FileText, color: 'bg-orange-50 text-orange-500', route: 'ocr' },
  ];


  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-12">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-10 min-w-0">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-10 border border-white shadow-sm flex items-center justify-between">
          <div className="max-w-md relative z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight">AI-Powered Creativity</h2>
            </div>
            
            <p className="text-[15px] text-slate-600 mb-8 leading-relaxed font-medium">
              Edit, enhance, convert and create stunning images like a pro - in seconds.
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { store.setActiveQuickTool('enhancer'); store.setView('tools'); }}
                className="px-6 py-3 bg-[#6366F1] hover:bg-indigo-600 text-white font-bold text-[14px] rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Try AI Enhance
              </button>
              <button className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[14px] rounded-xl flex items-center gap-2 shadow-sm transition-colors">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </div>
          </div>
          
          <div className="hidden md:block relative z-10">
             {/* Mock images to match banner visuals */}
             <div className="w-[320px] h-[200px] bg-white rounded-2xl shadow-xl overflow-hidden rotate-[-2deg] border-4 border-white relative">
               <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" alt="Mountain" className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 text-white/80 cursor-pointer hover:text-white bg-black/20 p-1 rounded-full backdrop-blur-sm">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
               </div>
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40"><ChevronRight className="w-4 h-4 text-white"/></div>
                 <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg"><Layers className="w-4 h-4 text-slate-800"/></div>
               </div>
             </div>
             <div className="absolute -top-6 -right-6 w-[120px] h-[120px] rounded-2xl overflow-hidden shadow-lg border-4 border-white rotate-[8deg]">
               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" alt="Portrait" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -bottom-6 -right-2 w-[140px] h-[90px] rounded-2xl overflow-hidden shadow-lg border-4 border-white rotate-[-6deg]">
               <img src="https://images.unsplash.com/photo-1615800098779-1be32e60cccc?w=300&q=80" alt="Flowers" className="w-full h-full object-cover" />
             </div>
             <Sparkles className="absolute top-2 left-[-20px] w-6 h-6 text-indigo-400" />
             <Sparkles className="absolute bottom-10 right-[-40px] w-5 h-5 text-purple-400" />
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-white/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        </div>

        {/* Quick Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Quick Tools</h3>
            <button onClick={() => store.setView('quick-tools')} className="text-[14px] font-semibold text-[#6366F1] hover:text-indigo-700 flex items-center gap-1 transition-colors">
              View all tools <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickTools.map((tool, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -4 }}
                onClick={() => { store.setActiveQuickTool(tool.id); store.setView(tool.route as any); }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.color}`}>
                  <tool.icon className="w-7 h-7" />
                </div>
                <span className="text-[13px] font-bold text-slate-900 text-center leading-tight">
                  {tool.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Image Comparison Feature */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Interactive Comparison</h3>
            <span className="text-[14px] font-semibold text-slate-500">Drag to compare</span>
          </div>
          <ImageComparisonSlider />
        </div>

        {/* Recent Files */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Recent Files</h3>
            <button className="text-[14px] font-semibold text-[#6366F1] hover:text-indigo-700 flex items-center gap-1 transition-colors">
              View all files <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {recentFiles.map((proj) => (
              <motion.div
                key={proj.id}
                whileHover={{ y: -4 }}
                onClick={() => { store.setSelectedImage(proj.img); store.setView('tools'); }}
                className="bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <img src={proj.img} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-4 h-4 flex items-center justify-center">•••</div>
                  </div>
                </div>
                <div className="px-1">
                  <h4 className="text-[14px] font-bold text-slate-900 truncate mb-1">{proj.title}</h4>
                  <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                    <span>{proj.time}</span>
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-[#6366F1] rounded font-bold uppercase tracking-wider">{proj.type}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        
        {/* AI Suggestions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-bold text-slate-900">AI Suggestions</h3>
            <button className="text-[13px] font-semibold text-[#6366F1] hover:text-indigo-700">View all</button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Enhance Photo Quality', desc: 'Improve brightness and clarity', icon: Sparkles, color: 'text-[#6366F1] bg-indigo-50' },
              { title: 'Remove Background', desc: 'Make your subject stand out', icon: Crop, color: 'text-emerald-500 bg-emerald-50' },
              { title: 'Upscale Resolution', desc: 'Increase image resolution', icon: Layers, color: 'text-orange-500 bg-orange-50' },
              { title: 'Apply Artistic Filter', desc: 'Try our trending filters', icon: Wand2, color: 'text-blue-500 bg-blue-50' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-[#6366F1] transition-colors">{item.title}</h4>
                    <p className="text-[12px] text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#6366F1] transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Your Activity */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-bold text-slate-900">Your Activity</h3>
            <div className="text-[12px] font-semibold text-slate-500 flex items-center gap-1 cursor-pointer hover:text-slate-700">
              This Week <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-2xl font-black text-slate-900">23</span>
                 <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[#6366F1]"><FolderOpen className="w-3 h-3" /></div>
               </div>
               <p className="text-[11px] font-semibold text-slate-500 leading-tight">Projects Created</p>
             </div>
             <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-2xl font-black text-slate-900">156</span>
                 <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500"><ImageIcon className="w-3 h-3" /></div>
               </div>
               <p className="text-[11px] font-semibold text-slate-500 leading-tight">Images Edited</p>
             </div>
             <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-[20px] font-black text-slate-900">4.8 <span className="text-[12px] font-bold">GB</span></span>
                 <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><HardDrive className="w-3 h-3" /></div>
               </div>
               <p className="text-[11px] font-semibold text-slate-500 leading-tight">Storage Used</p>
             </div>
             <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-[20px] font-black text-slate-900">08<span className="text-[14px] font-bold text-slate-400">:45</span></span>
                 <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><Clock className="w-3 h-3" /></div>
               </div>
               <p className="text-[11px] font-semibold text-slate-500 leading-tight">Time Saved</p>
             </div>
          </div>
        </div>

        {/* What's New */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-slate-900">What's New</h3>
            <button className="text-[13px] font-semibold text-[#6366F1] hover:text-indigo-700">View all</button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1 space-y-1">
              <span className="inline-block px-2 py-0.5 bg-[#6366F1] text-white text-[9px] font-bold uppercase tracking-wider rounded">New</span>
              <h4 className="text-[13px] font-bold text-slate-900 leading-tight">AI Scene Expansion</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Expand your images beyond boundaries with AI.</p>
            </div>
            <div className="w-[100px] h-[70px] rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
               <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&q=80" alt="Scene Expansion" className="w-full h-full object-cover" />
               <div className="absolute inset-0 border-[3px] border-dashed border-[#6366F1]/50 m-1 rounded flex items-center justify-center pointer-events-none">
                 <div className="absolute -top-1.5 -left-1.5 w-1.5 h-1.5 bg-[#6366F1] rounded-full" />
                 <div className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 bg-[#6366F1] rounded-full" />
                 <div className="absolute -bottom-1.5 -left-1.5 w-1.5 h-1.5 bg-[#6366F1] rounded-full" />
                 <div className="absolute -bottom-1.5 -right-1.5 w-1.5 h-1.5 bg-[#6366F1] rounded-full" />
                 <div className="w-4 h-4 bg-white/80 backdrop-blur rounded flex items-center justify-center"><ChevronRight className="w-3 h-3 text-[#6366F1] rotate-90" /></div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
