/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useStore, store } from '../store';
import { useState } from 'react';
import {
  Palette,
  Layout,
  Type,
  FileImage,
  Layers,
  Sparkles,
  Download,
  Trash2,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function CreatorStudio() {
  const { selectedImage } = useStore();
  const [activePreset, setActivePreset] = useState('youtube');
  const [canvasColor, setCanvasColor] = useState('#18181b');
  const [addedText, setAddedText] = useState('PREVIEW TITLE');
  const [textsList, setTextsList] = useState<{ id: string; val: string; top: number; left: number }[]>([]);

  const presets = [
    { id: 'youtube', label: 'YouTube Thumbnail', width: '1280 px', height: '720 px', aspect: '16/9' },
    { id: 'insta', label: 'Instagram Square', width: '1080 px', height: '1080 px', aspect: '1/1' },
    { id: 'pinterest', label: 'Pinterest Pin', width: '1000 px', height: '1500 px', aspect: '2/3' },
    { id: 'banner', label: 'Twitter Header', width: '1500 px', height: '500 px', aspect: '3/1' },
  ];

  const colors = ['#18181b', '#09090b', '#312e81', '#1e3a8a', '#111827', '#4c1d95', '#064e3b', '#881337'];

  const addTextToCanvas = () => {
    if (!addedText.trim()) return;
    const newText = {
      id: Math.random().toString(),
      val: addedText,
      top: 35 + textsList.length * 15,
      left: 20,
    };
    setTextsList((prev) => [...prev, newText]);
    setAddedText('');
  };

  const removeText = (id: string) => {
    setTextsList((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 text-[#ecedee]">
      {/* LEFT: Format selectors & Layout customizers (4 Cols) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Aspect Presets Card */}
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Layout className="w-4 h-4 text-indigo-400" />
            <span>Format Canvas presets</span>
          </h3>

          <div className="space-y-2.5">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePreset(p.id)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                  activePreset === p.id
                    ? 'bg-indigo-600/10 border-indigo-500 text-white'
                    : 'bg-zinc-900 border-[#27272a] hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-zinc-100">{p.label}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">{p.width} x {p.height}</p>
                </div>
                <div
                  className={`w-10 h-7 border border-dashed rounded shrink-0 ${
                    activePreset === p.id ? 'border-indigo-400/40' : 'border-zinc-700'
                  }`}
                  style={{ aspectRatio: p.aspect }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Text Overlay customizer */}
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-400" />
            <span>Typography Overlay</span>
          </h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter bold title..."
                value={addedText}
                onChange={(e) => setAddedText(e.target.value)}
                className="flex-1 h-10 px-3.5 bg-zinc-900 border border-[#27272a] rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:bg-[#18181b] focus:border-indigo-500 transition-all"
              />
              <button
                onClick={addTextToCanvas}
                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {textsList.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#27272a]">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Text Layers</p>
                <div className="space-y-1.5">
                  {textsList.map((t) => (
                    <div key={t.id} className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-white/5 text-xs text-zinc-300">
                      <span className="truncate">{t.val}</span>
                      <button onClick={() => removeText(t.id)} className="text-zinc-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Background Colors Card */}
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>Canvas Background</span>
          </h3>

          <div className="grid grid-cols-4 gap-2.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setCanvasColor(c)}
                className={`w-full aspect-square rounded-md border shadow transition-transform hover:scale-105 ${
                  canvasColor === c ? 'border-white scale-105' : 'border-[#27272a]'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Master Canvas Area & Export Options (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="relative aspect-[16/10] bg-zinc-950 border border-[#27272a] rounded-2xl overflow-hidden flex items-center justify-center p-8 shadow-2xl">
          {/* Grid background */}
          <div className="absolute inset-0 editor-grid-pattern opacity-10 pointer-events-none" />

          {/* Actual designer card box */}
          <div
            id="creative-active-canvas"
            className="relative shadow-2xl overflow-hidden flex flex-col items-center justify-center border border-white/5 rounded-lg select-none transition-all duration-300"
            style={{
              backgroundColor: canvasColor,
              width: activePreset === 'youtube' ? '85%' : activePreset === 'insta' ? '55%' : activePreset === 'pinterest' ? '45%' : '85%',
              aspectRatio: presets.find((p) => p.id === activePreset)?.aspect,
            }}
          >
            {/* Checker background overlay */}
            <div className="absolute inset-0 opacity-[0.05] editor-grid-pattern pointer-events-none" />

            {/* Selected Photo display */}
            <div className="w-full h-full relative z-10 flex items-center justify-center overflow-hidden p-6">
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                alt="Canvas subject"
                className="max-h-[80%] max-w-[80%] object-contain rounded shadow-lg border border-white/10"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic text layer overlays */}
              {textsList.map((t) => (
                <div
                  key={t.id}
                  className="absolute z-20 font-display font-black text-lg tracking-wider text-white select-none drop-shadow-md px-3 py-1 bg-black/40 backdrop-blur-xs border border-white/5 rounded-md cursor-move pointer-events-auto hover:border-indigo-500/80"
                  style={{ top: `${t.top}%`, left: `${t.left}%` }}
                >
                  {t.val}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Studio export bar */}
        <div className="bg-[#121214] border border-[#27272a] rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-zinc-100">Ready for Launch</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Publish your formatted visual poster straight to export files.</p>
          </div>

          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = selectedImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
              link.download = `CreatorStudio_Layout_${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Export Creative Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
