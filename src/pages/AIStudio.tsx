import { useStore, store } from '../store';
import { useState, useEffect } from 'react';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Sparkles,
  Settings2,
  SlidersHorizontal,
  Zap,
  ArrowRight,
  Download,
  Flame,
  Layout,
  Palette,
  Sparkle,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle, Trash2,
  Save,
  Copy,
  RefreshCw,
  X,
  Dices,
  Maximize2, Wand2, FolderPlus, Scissors, Wand, MessageSquare, Type
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { motion, AnimatePresence } from 'motion/react';


  const SURPRISE_PROMPTS = [
    "A majestic steampunk owl reading a glowing book, cinematic lighting, 8k resolution, Unreal Engine 5 render",
    "A cozy little cafe in a neon-lit futuristic Tokyo street, raining, reflections, lo-fi anime style",
    "An astronaut riding a skateboard on the rings of Saturn, vibrant colors, retro synthwave art",
    "A mystical ancient temple hidden deep inside a glowing bioluminescent forest, concept art, fantasy",
    "Macro photography of a tiny transparent tree frog sitting on a mechanical golden leaf, photorealistic",
    "A floating island with a cascading waterfall in a sky filled with pink clouds, studio ghibli style"
  ];

export default function AIStudio() {
  
  const [studioMode, setStudioMode] = useState<'image' | 'text'>('image');
  const [generatedText, setGeneratedText] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('You are an expert copywriter and creative assistant.');
  
  const handleGenerateText = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGeneratedText('');
    setLoadingText('Thinking...');
    
    try {
      const response = await fetch('/api/ai/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction }),
      });
      const data = await response.json();
      if (data.text) {
        setGeneratedText(data.text);
      }
    } catch (err) {
      console.error('Text gen failed', err);
    } finally {
      setGenerating(false);
    }
  };

  const { aiHistory } = useStore();

  const [prompt, setPrompt] = useState('');
  const [styleType, setStyleType] = useState('creative');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  const [generating, setGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seedInput, setSeedInput] = useState('');
  const [enhancePrompt, setEnhancePrompt] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageModel, setImageModel] = useState('flux');
  const [highQuality, setHighQuality] = useState(true);

    
  useEffect(() => {
    let interval;
    if (generating) {
      setLoadingText('Warming up AI Engine...');
      interval = setInterval(() => {
        const texts = ['Analyzing prompt...', 'Adjusting dimensions...', 'Rendering details...', 'Applying style...', 'Adding finishing touches...'];
        setLoadingText(texts[Math.floor(Math.random() * texts.length)]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [generating]);

  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) return;
    setOptimizing(true);
    setOptimizedResult(null);
    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: styleType }),
      });
      const data = await response.json();
      setOptimizedResult(data);
    } catch (err) {
      console.error('Failed to optimize prompt:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleGenerateImage = async () => {
    const finalPrompt = optimizedResult?.expandedPrompt || prompt;
    if (!finalPrompt.trim()) return;
    setGenerating(true);
    setGeneratedImages([]);
    try {
      // Free AI image generation via pollinations
      let width = 1024;
      let height = 1024;
      if (highQuality) {
        if (aspectRatio === '16:9') {
          width = 1280;
          height = 720;
        } else if (aspectRatio === '9:16') {
          width = 720;
          height = 1280;
        } else if (aspectRatio === '4:3') {
          width = 1152;
          height = 864;
        } else if (aspectRatio === '3:4') {
          width = 864;
          height = 1152;
        }
      } else {
        if (aspectRatio === '16:9') {
          width = 1024;
          height = 576;
        } else if (aspectRatio === '9:16') {
          width = 576;
          height = 1024;
        } else if (aspectRatio === '4:3') {
          width = 1024;
          height = 768;
        } else if (aspectRatio === '3:4') {
          width = 768;
          height = 1024;
        }
      }

      const promises = Array.from({ length: batchSize }).map(async (_, idx) => {
        let seed = Math.floor(Math.random() * 100000);
        if (seedInput.trim() && !isNaN(parseInt(seedInput.trim()))) {
          seed = parseInt(seedInput.trim()) + idx;
        }
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=${imageModel}`;
        if (enhancePrompt) {
          url += `&enhance=true`;
        }
        if (negativePrompt.trim()) {
          url += `&negative_prompt=${encodeURIComponent(negativePrompt.trim())}`;
        }
        
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = reject;
          img.src = url;
        });
        
        store.addAiHistory({ prompt: finalPrompt, img: url });
        return url;
      });

      const urls = await Promise.all(promises);
      setGeneratedImages(urls);
    } catch (err) {
      console.error('Generation failed:', err);
    
    } finally {
      
      setGenerating(false);

    }
  };

  const useOptimizedPrompt = () => {
    if (optimizedResult?.expandedPrompt) {
      setPrompt(optimizedResult.expandedPrompt);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-[#ecedee]">
      {/* Hero Header */}
      <div className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-br from-indigo-950/60 via-[#121214] to-[#09090b] border border-[#27272a] shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkle className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Generative Playground</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">AI Studio</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Co-create with Gemini. Provide a basic design direction, use AI suggestion blocks to generate perfect complementary color palettes and descriptive layout parameters, then render them instantly.
          </p>
        </div>
      </div>

      
      <div className="flex bg-[#121214] border border-[#27272a] rounded-xl p-1 mb-6 max-w-sm">
        <button
          onClick={() => setStudioMode('image')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${studioMode === 'image' ? 'bg-indigo-600/20 text-indigo-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
        >
          <ImageIcon className="w-4 h-4" /> Image Studio
        </button>
        <button
          onClick={() => setStudioMode('text')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${studioMode === 'text' ? 'bg-emerald-600/20 text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
        >
          <Type className="w-4 h-4" /> Text Studio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {studioMode === 'image' ? (
          <>
            {/* LEFT PANEL: Prompts & Gemini suggestions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-zinc-200">1. Describe Your Vision</h3>

            {/* Prompt input */}
            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  placeholder="E.g. A gorgeous cyberpunk cityscape with futuristic cars under magenta rain..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-28 p-4 bg-zinc-900 border border-[#27272a] rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:bg-[#18181b] focus:border-indigo-500 transition-all resize-none pr-10 pb-8"
                  maxLength={1000}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      handleGenerateImage();
                    }
                  }}
                />

                
                {/* Textarea Actions */}
                <div className="absolute bottom-3 right-3 text-[10px] font-bold text-zinc-500 pointer-events-none">
                  {prompt.length}/1000
                </div>
                
                
                  <button
                    onClick={() => setPrompt(SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)])}
                    className="absolute top-3 right-10 w-6 h-6 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-colors"
                    title="Surprise me"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                  </button>

                {prompt.length > 0 && (
                  <button
                    onClick={() => setPrompt('')}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    title="Clear prompt"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider py-1.5 mr-1">Try:</span>
                {[
                  "Neon city at night, rain, 8k",
                  "Minimalist cozy cabin, snow, golden hour",
                  "Astronaut walking in a vivid fantasy jungle",
                  "Macro shot of a glowing bioluminescent mushroom"
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(idea)}
                    className="px-2.5 py-1 bg-zinc-900 border border-[#27272a] rounded-full text-xs text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors"
                  >
                    {idea}
                  </button>
                ))}
              </div>


              {/* Style parameters */}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                
                <div className="space-y-2 mt-4 lg:mt-0 md:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Aspect Ratio</label>
                  <div className="flex bg-zinc-900 border border-[#27272a] rounded-xl overflow-hidden p-1">
                    {[
                      { id: '1:1', label: '1:1', icon: 'aspect-square' },
                      { id: '16:9', label: '16:9', icon: 'aspect-video' },
                      { id: '9:16', label: '9:16', icon: 'w-3 h-5' },
                      { id: '4:3', label: '4:3', icon: 'w-5 h-4' },
                      { id: '3:4', label: '3:4', icon: 'w-4 h-5' }
                    ].map(ratio => (
                      <button
                        key={ratio.id}
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`flex-1 py-2 flex flex-col items-center gap-1 rounded-lg transition-all ${
                          aspectRatio === ratio.id
                            ? 'bg-indigo-600/20 text-indigo-400 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <div className={`border-2 rounded-sm ${aspectRatio === ratio.id ? 'border-indigo-400' : 'border-zinc-500'} ${ratio.icon === 'aspect-square' ? 'w-4 h-4' : ratio.icon === 'aspect-video' ? 'w-5 h-3' : ratio.icon}`} />
                        <span className="text-[9px] font-bold tracking-wider">{ratio.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                
                <div className="space-y-2 mt-4 lg:mt-0 col-span-1 md:col-span-3">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">AI Engine Selection</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { id: 'flux', name: 'Flux', icon: '✨' },
                      { id: 'flux-realism', name: 'Realism', icon: '📸' },
                      { id: 'flux-anime', name: 'Anime', icon: '🌸' },
                      { id: 'flux-3d', name: '3D Render', icon: '🧊' },
                      { id: 'any-dark', name: 'Any Dark', icon: '🌙' },
                      { id: 'turbo', name: 'Turbo', icon: '⚡' }
                    ].map(model => (
                      <button
                        key={model.id}
                        onClick={() => setImageModel(model.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          imageModel === model.id
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                            : 'bg-zinc-900 border-[#27272a] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                        }`}
                      >
                        <span className="text-lg">{model.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{model.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                
                <div className="space-y-2 mt-4 lg:mt-0">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Batch Size</label>
                  <div className="flex bg-zinc-900 border border-[#27272a] rounded-xl overflow-hidden p-1">
                    {[1, 2, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => setBatchSize(num)}
                        className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${batchSize === num ? 'bg-indigo-600/20 text-indigo-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Style Preset</label>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors uppercase tracking-wider"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['creative', 'cinematic', 'minimalist', 'brutalist', 'anime', 'cyberpunk', 'photorealism', 'synthwave'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStyleType(st)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                        styleType === st
                          ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                          : 'bg-zinc-900 border-[#27272a] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-zinc-900/50 border border-[#27272a] rounded-xl space-y-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Advanced Parameters</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-md border border-[#27272a]">
                          <div className="space-y-0.5">
                            <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Auto-Enhance</label>
                            <p className="text-[9px] text-zinc-500">Automatically add detail and improve aesthetics</p>
                          </div>
                          <button
                            onClick={() => setEnhancePrompt(!enhancePrompt)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${enhancePrompt ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                          >
                            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${enhancePrompt ? 'left-6' : 'left-0.5'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-md border border-[#27272a]">
                          <div className="space-y-0.5">
                            <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">High Resolution (HD)</label>
                            <p className="text-[9px] text-zinc-500">Render in pristine HD clarity (slower but sharper)</p>
                          </div>
                          <button
                            onClick={() => setHighQuality(!highQuality)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${highQuality ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                          >
                            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${highQuality ? 'left-6' : 'left-0.5'}`} />
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Negative Prompt</label>
                          <input
                            type="text"
                            placeholder="e.g. low quality, blurry, text, watermark..."
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            className="w-full h-9 px-3 bg-zinc-900 border border-[#27272a] rounded-md text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fixed Seed (Optional)</label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="Leave empty for random seed"
                              value={seedInput}
                              onChange={(e) => setSeedInput(e.target.value)}
                              className="w-full h-9 px-3 pr-10 bg-zinc-900 border border-[#27272a] rounded-md text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600 font-mono"
                            />
                            <button
                              onClick={() => setSeedInput(Math.floor(Math.random() * 100000).toString())}
                              className="absolute right-1.5 top-1.5 w-6 h-6 bg-[#18181b] hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded flex items-center justify-center transition-colors"
                              title="Randomize Seed"
                            >
                              <Dices className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="hidden md:block" /> {/* spacer */}

                <button
                  onClick={handleOptimizePrompt}
                  disabled={optimizing || !prompt.trim()}
                  className="w-full md:w-auto h-11 px-6 bg-zinc-900 hover:bg-zinc-800 border border-[#27272a] disabled:opacity-50 text-indigo-400 disabled:pointer-events-none hover:text-indigo-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {optimizing ? (
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>Optimize Prompt with Gemini</span>
                </button>
              </div>

            </div>
          </div>

          {/* Optimized Suggestions panel */}
          <AnimatePresence>
            {optimizedResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-6 shadow-lg"
              >
                <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Optimizations</span>
                  </span>
                  <button
                    onClick={useOptimizedPrompt}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    Apply Optimized Prompt
                  </button>
                </div>

                {/* Expanded prompt view */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Expanded Prompt</p>
                  <div className="p-4 bg-zinc-950 rounded-lg text-xs font-medium text-zinc-300 leading-relaxed border border-white/5">
                    {optimizedResult.expandedPrompt}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Suggestions List */}
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Layout Tips</span>
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-400 list-disc list-inside">
                      {optimizedResult.suggestions?.map((s: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Mood Palette */}
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Suggested Color Palette</span>
                    </p>
                    <div className="flex gap-2">
                      {optimizedResult.palette?.map((c: string, idx: number) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div
                            className="w-10 h-10 rounded-md border border-white/5 shadow-md"
                            style={{ backgroundColor: c }}
                          />
                          <span className="font-mono text-[9px] text-zinc-500">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: Dynamic render stage & downloads (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 flex flex-col justify-between h-full min-h-[380px]">
            <div className="space-y-4 flex-1 flex flex-col">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Render Stage</span>
              </h3>

              <div className="flex-1 bg-zinc-950 border border-[#27272a] rounded-xl overflow-hidden relative flex items-center justify-center min-h-[220px] aspect-[4/3] shadow-inner">
                <div className="absolute inset-0 editor-grid-pattern opacity-10 pointer-events-none" />

                {generating ? (
                  <div className="text-center space-y-3 z-10 w-full h-full flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs font-bold text-zinc-400 animate-pulse">{loadingText}</p>
                    {batchSize > 1 && <p className="text-[10px] text-zinc-500">Generating {batchSize} images</p>}
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className={`w-full h-full grid gap-2 p-2 ${generatedImages.length === 1 ? 'grid-cols-1' : generatedImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {generatedImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group w-full h-full rounded-md overflow-hidden bg-zinc-900 border border-[#27272a] shadow-md">
                        <img
                          src={imgUrl}
                          alt="Generated output"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const link = document.createElement('a');
                              link.href = imgUrl;
                              link.download = `AI_Generated_${Date.now()}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="w-8 h-8 bg-black/60 hover:bg-black text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              store.addRecentFile({ title: 'AI Generation', img: imgUrl, type: 'PNG' });
                              const btn = e.currentTarget;
                              const originalHtml = btn.innerHTML;
                              btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                              setTimeout(() => btn.innerHTML = originalHtml, 2000);
                            }}
                            className="w-8 h-8 bg-black/60 hover:bg-black text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                            title="Save to Project"
                          >
                            <FolderPlus className="w-4 h-4" />
                          </button>

<button
                            onClick={(e) => {
                              e.stopPropagation();
                              store.setSelectedImage(imgUrl);
                              store.setView('editor');
                            }}
                            className="w-8 h-8 bg-black/60 hover:bg-indigo-600 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                            title="Open in Editor"
                          >
                            <Palette className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              store.setSelectedImage(imgUrl);
                              store.setView('bg-remover');
                            }}
                            className="w-8 h-8 bg-black/60 hover:bg-fuchsia-600 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                            title="Remove Background"
                          >
                            <Scissors className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              store.setSelectedImage(imgUrl);
                              store.setView('enhancer');
                            }}
                            className="w-8 h-8 bg-black/60 hover:bg-blue-600 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                            title="Enhance Image"
                          >
                            <Wand className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              store.addRecentFile({ title: 'AI Generation', img: imgUrl, type: 'IMG' });
                              const btn = e.currentTarget;
                              const originalHtml = btn.innerHTML;
                              btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                              setTimeout(() => btn.innerHTML = originalHtml, 2000);
                            }}
                            className="w-8 h-8 bg-black/60 hover:bg-green-600 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                            title="Save to Workspace"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2 z-10 w-full h-full flex flex-col items-center justify-center max-w-xs mx-auto">
                    <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
                    <p className="text-xs font-bold text-zinc-400">Ready for Rendering</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Optimize your prompt or input a descriptive layout direction and click generate below.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#27272a] mt-6 flex gap-3">
              <button
                onClick={handleGenerateImage}
                disabled={generating || !prompt.trim()}
                className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Masterpiece</span>
              </button>
              
              {generatedImages.length > 1 && !generating && (
                <button
                  onClick={() => {
                    generatedImages.forEach((imgUrl, idx) => {
                      setTimeout(() => {
                        const link = document.createElement('a');
                        link.href = imgUrl;
                        link.download = `AI_Generated_${Date.now()}_${idx}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }, idx * 200);
                    });
                  }}
                  className="px-4 h-11 bg-zinc-900 hover:bg-zinc-800 border border-[#27272a] rounded-md text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  title="Download All"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download All</span>
                </button>
              )}
            </div></div></div></>) : (
          <>
            {/* TEXT STUDIO LEFT PANEL */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Content Strategy & Copywriting
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">System Instruction / Persona</label>
                    <textarea
                      value={systemInstruction}
                      onChange={(e) => setSystemInstruction(e.target.value)}
                      className="w-full h-20 p-3 bg-zinc-900 border border-[#27272a] rounded-lg text-xs text-zinc-300 focus:border-emerald-500 focus:outline-none resize-none"
                      placeholder="E.g., You are a snarky social media manager..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Your Prompt</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-32 p-4 bg-zinc-900 border border-[#27272a] rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none resize-none"
                      placeholder="What should I write about today?"
                    />
                  </div>

                  <button
                    onClick={handleGenerateText}
                    disabled={generating || !prompt.trim()}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generating ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <Type className="w-4 h-4" />
                    )}
                    <span>Generate Text with Gemini</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TEXT STUDIO RIGHT PANEL */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
                <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-emerald-400" /> Generated Content
                </h3>
                
                <div className="flex-1 bg-zinc-950 border border-[#27272a] rounded-xl p-6 overflow-y-auto">
                  {generating ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                      <p className="text-xs font-bold text-zinc-400 animate-pulse">{loadingText}</p>
                    </div>
                  ) : generatedText ? (
                    <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                      <ReactMarkdown>{generatedText}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600 text-sm font-medium">
                      Your generated text will appear here...
                    </div>
                  )}
                </div>
                
                {generatedText && !generating && (
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedText)}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-[#27272a] text-zinc-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {studioMode === 'image' && (
        <>
          {/* History log block */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200">Your AI Generation History</h3>
          {aiHistory.length > 0 && (
            <button 
              onClick={() => store.clearAiHistory()}
              className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {aiHistory.map((h, i) => (
            <div
              key={i}
              className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden shadow-md hover:border-indigo-500/30 transition-all group cursor-pointer"
              onClick={() => {
                store.setSelectedImage(h.img);
                store.setView('editor');
              }}
            >
              
              <div className="aspect-video relative overflow-hidden bg-zinc-950">
                <img
                  src={h.img}
                  alt={h.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrompt(h.prompt);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-7 h-7 bg-black/60 hover:bg-indigo-600 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                    title="Reuse Prompt"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = h.img;
                      link.download = `AI_Generated_${Date.now()}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-7 h-7 bg-black/60 hover:bg-black text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.removeAiHistory(i);
                    }}
                    className="w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.removeAiHistory(i);
                    }}
                    className="w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

<button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(h.prompt);
                      const btn = e.currentTarget;
                      const originalHtml = btn.innerHTML;
                      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                      setTimeout(() => btn.innerHTML = originalHtml, 2000);
                    }}
                    className="w-7 h-7 bg-black/60 hover:bg-zinc-700 text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors"
                    title="Copy Prompt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-[10px] text-zinc-400 font-medium truncate" title={h.prompt}>
                  {h.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      {/* Lightbox Modal */}
              </>
      )}

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={lightboxImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

