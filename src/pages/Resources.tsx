/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BookOpen,
  CheckSquare,
  Sparkles,
  Command,
  FileText,
  Copy,
  ExternalLink,
  Info,
  Layers,
  Award,
  Video,
  FileImage,
  ArrowRight,
  Palette
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ResourceGuide {
  id: string;
  title: string;
  category: 'tip' | 'tutorial' | 'checklist';
  readTime: string;
  desc: string;
  author: string;
  img: string;
}

export default function Resources() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Quick design checklists
  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Validate background image separation contrast', checked: true },
    { id: 'c2', text: 'Select correct crop aspect preset (e.g. 16:9 for YouTube)', checked: false },
    { id: 'c3', text: 'Apply mild Gaussian noise for analog vintage effect', checked: false },
    { id: 'c4', text: 'Position copyright watermark in bottom corner with 30-50% opacity', checked: true },
    { id: 'c5', text: 'Execute Super Resolution 4K neural filter upscale', checked: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.checked, checked: !item.checked } : item))
    );
  };

  const keyboardShortcuts = [
    { keys: ['⌘', 'Z'], desc: 'Undo last change' },
    { keys: ['⌘', 'E'], desc: 'Auto Enhance Contrast' },
    { keys: ['⌘', 'R'], desc: 'Isolate Subject / Remove Background' },
    { keys: ['⌘', 'U'], desc: '4K Super Resolution Upscale' },
    { keys: ['⌥', 'R'], desc: 'Reset Adjustments Sliders' },
    { keys: ['⌘', 'D'], desc: 'Download lossless PNG' },
  ];

  const stockPalettes = [
    { name: 'Cosmic Indigo', colors: ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC'] },
    { name: 'Emerald Velvet', colors: ['#059669', '#10B981', '#34D399', '#6EE7B7'] },
    { name: 'Warm Amber', colors: ['#D97706', '#F59E0B', '#FBBF24', '#FDE68A'] },
    { name: 'Crimson Sunset', colors: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'] },
  ];

  const guidesList: ResourceGuide[] = [
    {
      id: 'g1',
      title: 'Mastering YouTube CTR With Bold Typography & Contrast',
      category: 'tutorial',
      readTime: '4 min read',
      desc: 'Learn how smart subject isolation borders combined with vivid auto exposure grades can boost video click-through-rates by up to 18%.',
      author: 'Elena Rostova',
      img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'g2',
      title: 'E-commerce Framing: Shadow Casting & Aspect Ratios',
      category: 'tip',
      readTime: '2 min read',
      desc: 'Positioning products on a clean white background with simulated studio shadow gradients. Best aspect presets to match Shopify standards.',
      author: 'Marcus Vance',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'g3',
      title: 'Applying Text Watermarks Without Ruining Design Flow',
      category: 'checklist',
      readTime: '3 min read',
      desc: 'A comprehensive layout breakdown explaining where to place copyright indicators and how to adjust opacities gracefully for dark workspaces.',
      author: 'Sophia Chen',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="space-y-8 pb-12 text-[#ecedee]">
      
      {/* Resources Welcome Banner */}
      <div className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-br from-indigo-950/40 via-[#121214] to-[#09090b] border border-[#27272a] shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Creative Hub</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Design Resources & Cheat Sheets
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Enhance your photo toolkit expertise. Access essential keyboard shortcuts, export checklists, designer color palettes, and expert photography composition guides.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT AREA: Keyboard Shortcuts and Export Checklist (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Keyboard Shortcuts Card */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <Command className="w-4 h-4 text-indigo-400" />
                <span>Workspace Keyboard Shortcuts</span>
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">High-Speed Operation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyboardShortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900 border border-[#27272a] rounded-xl hover:border-zinc-700 transition-colors">
                  <span className="text-xs text-zinc-400">{shortcut.desc}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, kIdx) => (
                      <kbd key={kIdx} className="px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-white rounded font-mono shadow">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Quality Checklist */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>Export Quality Checklist</span>
              </h3>
              <p className="text-[10px] text-zinc-500 mt-1">Review composition parameters before downloading final assets</p>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-indigo-600/5 border-indigo-500/20 text-white'
                      : 'bg-zinc-900 border-[#27272a] hover:border-zinc-700 text-zinc-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    item.checked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-[#27272a] text-transparent'
                  }`}>
                    ✓
                  </div>
                  <span className={`text-xs ${item.checked ? 'line-through opacity-70' : 'font-medium'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT AREA: Palette helper & Author advice (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Color Palettes Helper */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <div className="pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>Popular Brand Color Palettes</span>
              </h3>
              <p className="text-[10px] text-zinc-500 mt-1">Click color dots to instantly copy hex value to clipboard</p>
            </div>

            <div className="space-y-4.5">
              {stockPalettes.map((pal, pIdx) => (
                <div key={pIdx} className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{pal.name}</span>
                  <div className="flex gap-2.5">
                    {pal.colors.map((color, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleCopyColor(color)}
                        className="flex-1 h-9 rounded-lg border border-white/5 relative group transition-transform hover:scale-[1.04]"
                        style={{ backgroundColor: color }}
                        title={`Copy ${color}`}
                      >
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-[9px] font-extrabold text-white">
                          COPY
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {copiedColor && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-center text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  Copied Color hex {copiedColor} to Clipboard!
                </div>
              )}
            </div>
          </div>

          {/* Quick Composition tips */}
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-3.5">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Composition Expert Advice</span>
            </h3>

            <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[10px] font-extrabold text-amber-500 uppercase">Rule of Thirds</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                When cropping aspect ratio, align key facial features or product focal points along the grid intersections. It instantly makes elements feel naturally balanced.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* TUTORIAL AND GUIDE ARTICLES (Bento row) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Composition & Editing Tutorials</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guidesList.map((guide) => (
            <div key={guide.id} className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden shadow-lg group hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="aspect-video relative overflow-hidden bg-zinc-950">
                  <img src={guide.img} alt={guide.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[9px] font-extrabold text-indigo-400 uppercase">
                    {guide.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[9px] text-zinc-500 font-bold">{guide.readTime} • By {guide.author}</span>
                  <h4 className="font-bold text-xs text-white leading-normal group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 border-t border-white/5">
                <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <span>Read Article</span> <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
