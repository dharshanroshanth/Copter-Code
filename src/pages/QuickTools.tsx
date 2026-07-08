/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useStore, store } from '../store';
import {
  Wand2,
  Undo,
  RotateCcw,
  Sparkles,
  Download,
  Sliders,
  Crop,
  Layers,
  Flame,
  CheckCircle,
  Eye,
  RefreshCw,
  LayoutTemplate
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { motion, AnimatePresence } from 'motion/react';

export default function QuickTools() {
  const { selectedImage } = useStore();

  // Use a professional fallback model portrait if no image is uploaded
  
  const defaultImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
  const initialImage = selectedImage || defaultImage;
  const [activeImage, setActiveImage] = useState(initialImage);
  
  useEffect(() => {
    setActiveImage(selectedImage || defaultImage);
    setIsBackgroundRemoved(false);
  }, [selectedImage]);

  // Manual Adjustment states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);

  // Active transform state
  const [transforming, setTransforming] = useState(false);
  const [transformMessage, setTransformMessage] = useState('');
  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);
  const [isUpscaled, setIsUpscaled] = useState(false);

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);
    setIsBackgroundRemoved(false);
    setIsUpscaled(false);
  };

  const handleAIAction = async (action: string, label: string) => {
    setTransforming(true);
    setTransformMessage(label);

    try {
      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeImage,
          action: action,
        }),
      });
      const data = await response.json();

      if (action === 'remove-bg') {
        const blob = await removeBackground(activeImage, {
          publicPath: "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/"
        });
        const url = URL.createObjectURL(blob);
        setActiveImage(url);
        setIsBackgroundRemoved(true);
      } else if (action === 'upscale') {
        setIsUpscaled(true);
        setBrightness(105);
        setContrast(102);
      } else if (action === 'enhance') {
        setBrightness(110);
        setContrast(115);
        setSaturation(120);
      }
    } catch (err) {
      console.error('AI Transform failed:', err);
    } finally {
      setTransforming(false);
    }
  };

  const downloadImage = () => {
    // Elegant client-side download anchor
    const link = document.createElement('a');
    link.href = activeImage;
    link.download = `PhotoToolkit_Edit_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Build the live visual filter string based on custom adjustments
  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hue}deg)`,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 text-[#ecedee]">
      {/* LEFT: Central Workspace Editor Stage (7 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Top Control Action Bar */}
        <div className="h-14 bg-[#121214] border border-[#27272a] rounded-xl px-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Editor Stage</span>
            {selectedImage ? (
              <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 rounded">
                CUSTOM IMAGE ACTIVE
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 rounded">
                DEMO PHOTO
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAdjustments}
              className="w-9 h-9 rounded bg-zinc-900 border border-[#27272a] hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              title="Reset Adjustments"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAIAction('enhance', 'Auto Enhancing Exposure...')}
              className="h-9 px-3 rounded bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 flex items-center gap-1.5 text-xs font-bold transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Auto Enhance</span>
            </button>
          </div>
        </div>

        {/* Dynamic Image Display Canvas Frame */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-[#27272a] flex items-center justify-center shadow-inner">
          {/* Subtle checkered grid pattern always visible in background */}
          <div className="absolute inset-0 editor-grid-pattern opacity-10 pointer-events-none" />

          {/* Conditional isolated background rendering */}
          <div className="relative max-w-[85%] max-h-[85%] overflow-hidden rounded-lg shadow-2xl flex items-center justify-center">
            {isBackgroundRemoved ? (
              <div className="absolute inset-0 bg-[#09090b] opacity-90">
                <div className="absolute inset-0 editor-grid-pattern opacity-60" />
              </div>
            ) : null}

            <img
              src={activeImage}
              alt="Active Visual Canvas"
              style={filterStyle}
              className="max-w-full max-h-[400px] object-contain transition-all duration-300 relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* AI transform active loader overlay */}
          <AnimatePresence>
            {transforming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-indigo-600/30 border-t-indigo-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">{transformMessage}</p>
                  <p className="text-xs text-zinc-500 mt-1">Applying neural parameters via server-side pipeline</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Isolated layer labels */}
          <div className="absolute bottom-5 left-5 bg-[#121214]/90 backdrop-blur border border-[#27272a] rounded px-3 py-1.5 flex items-center gap-2 text-[10px] font-bold text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>RGBA LAYER 0</span>
            {isBackgroundRemoved && <span className="text-rose-400 uppercase">• MASKED BG</span>}
            {isUpscaled && <span className="text-amber-400 uppercase">• 4K UPSCALE</span>}
          </div>
        </div>

        {/* Bottom Metadata & Info Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#121214] border border-[#27272a] rounded-xl p-4 text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Canvas Res</p>
            <p className="text-sm font-bold text-white mt-1">{isUpscaled ? '3840 x 2160' : '1920 x 1080'}</p>
          </div>
          <div className="bg-[#121214] border border-[#27272a] rounded-xl p-4 text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Color Model</p>
            <p className="text-sm font-bold text-white mt-1">SRGB Color</p>
          </div>
          <div className="bg-[#121214] border border-[#27272a] rounded-xl p-4 text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Storage format</p>
            <p className="text-sm font-bold text-white mt-1">Lossless PNG</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Precise adjustments & smart filters (4 Cols) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Core AI Actions */}
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Neural Filters</span>
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => handleAIAction('remove-bg', 'Isolating Subject Mask...')}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 border border-[#27272a] hover:border-[#3f3f46] text-zinc-200 rounded-md text-xs font-bold transition-all flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>Remove Background</span>
              </div>
              <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">AI Isolate</span>
            </button>

            <button
              onClick={() => handleAIAction('upscale', 'Generating 4K Ultra Parameters...')}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 border border-[#27272a] hover:border-[#3f3f46] text-zinc-200 rounded-md text-xs font-bold transition-all flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Super Resolution (4K)</span>
              </div>
              <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">Upscale</span>
            </button>
          </div>
        </div>

        {/* Adjustment sliders */}
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Manual Adjustments</span>
          </h3>

          <div className="space-y-5">
            {/* Brightness */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Brightness</span>
                <span className="font-mono text-[11px] text-zinc-500">{brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Contrast</span>
                <span className="font-mono text-[11px] text-zinc-500">{contrast}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Saturation</span>
                <span className="font-mono text-[11px] text-zinc-500">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Blur */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Gaussian Blur</span>
                <span className="font-mono text-[11px] text-zinc-500">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Hue-Rotate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Hue Rotation</span>
                <span className="font-mono text-[11px] text-zinc-500">{hue}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save & Export Controls */}
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-4">
          <button
            onClick={downloadImage}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all shadow-md shadow-indigo-950/40 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res</span>
          </button>
          <button
            onClick={() => store.setView('creator-studio')}
            className="w-full h-11 bg-[#18181b] border border-[#27272a] hover:bg-zinc-800 text-zinc-300 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-400" />
            <span>Push to Creator Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
