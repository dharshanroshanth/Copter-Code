import React, { useState, useRef } from 'react';
import { useStore, store } from '../store';
import { Scissors, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, RefreshCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { removeBackground } from '@imgly/background-removal';

// Helper to convert image sources to Blob or self-contained data to avoid CORS and sandbox iframe restrictions
const prepareImageSource = async (src: string): Promise<Blob | string> => {
  if (src.startsWith('blob:')) {
    try {
      const response = await fetch(src);
      return await response.blob();
    } catch (err) {
      console.warn('Failed to convert blob URL to Blob:', err);
    }
  } else if (src.startsWith('http')) {
    try {
      const response = await fetch(src, { mode: 'cors' });
      return await response.blob();
    } catch (err) {
      console.warn('CORS fetch of remote image failed, passing URL directly:', err);
    }
  }
  return src;
};

// Resilient background removal trying multiple CDNs sequentially in case of blocks or outages
const removeBgWithFallbacks = async (
  image: Blob | string,
  onProgress: (progress: number) => void
): Promise<Blob> => {
  const cdns = [
    "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/",
    "https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/",
    "https://unpkg.com/@imgly/background-removal-data@1.7.0/dist/"
  ];

  let lastError: any = null;
  for (const cdn of cdns) {
    try {
      console.log(`Attempting background removal with CDN: ${cdn}`);
      const resultBlob = await removeBackground(image, {
        publicPath: cdn,
        progress: (key, current, total) => {
          if (total) {
            onProgress(Math.round((current / total) * 100));
          }
        }
      });
      return resultBlob;
    } catch (err) {
      console.warn(`Background removal failed using CDN ${cdn}:`, err);
      lastError = err;
    }
  }
  throw lastError || new Error("All CDN paths failed to initialize or download model files.");
};

export default function BgRemover() {
  const { selectedImage } = useStore();
  const [image, setImage] = useState<string | null>(selectedImage || null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setResult(null);
      setProgress(0);
      setError(null);
    }
  };

  const processBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Pre-process image source to standard Blob
      const imageSource = await prepareImageSource(image);
      
      // Step 2: Run background remover with CDN resilience
      const blob = await removeBgWithFallbacks(imageSource, (p) => {
        setProgress(p);
      });
      
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err: any) {
      console.error('Error removing background:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'background-removed.png';
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => store.setView('dashboard')} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Background Remover</h1>
              <p className="text-[13px] font-medium text-slate-500">Automatically remove backgrounds with AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="max-w-4xl w-full space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Background Removal Failed</h4>
                <p className="text-xs text-rose-700 leading-relaxed">
                  {error}
                </p>
                <p className="text-[11px] text-rose-600 font-medium leading-relaxed">
                  Tip: WebAssembly or CDN access might be restricted in your current environment/iframe sandbox. Try using a smaller or different image, or open the app in a new tab if issues persist.
                </p>
              </div>
            </div>
          )}

          {!image ? (
            <div className="border-2 border-dashed border-slate-300 rounded-3xl h-[400px] flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Upload an image</h3>
              <p className="text-[14px] text-slate-500 font-medium">Drag and drop or click to browse</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Original Image
                </h3>
                <div className="aspect-square bg-white border border-slate-200 rounded-2xl overflow-hidden relative flex items-center justify-center">
                  
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm z-10 rounded-2xl"
                      >
                        <div className="w-16 h-16 relative flex items-center justify-center">
                          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
                          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                          <Scissors className="w-6 h-6 text-indigo-600 animate-pulse" />
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-700">Removing Background</span>
                          <span className="text-xs text-slate-500 mt-1">{progress}%</span>
                          <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                            <motion.div 
                              className="h-full bg-indigo-600 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ ease: "linear", duration: 0.2 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <img src={image} alt="Original" className={`w-full h-full object-contain transition-all duration-300 ${isProcessing ? 'opacity-50 blur-sm scale-[0.98]' : ''}`} />

                </div>
                <div className="flex gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[14px] font-bold text-slate-700 transition-colors">
                    Choose Another
                  </button>
                  <button onClick={processBackground} disabled={isProcessing || !!result} className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing {progress}%
                      </>
                    ) : (
                      <>
                        <Scissors className="w-4 h-4" />
                        Remove BG
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                  <Scissors className="w-4 h-4" /> Result
                </h3>
                <div className="aspect-square bg-checkered border border-slate-200 rounded-2xl overflow-hidden relative flex items-center justify-center">
                  <AnimatePresence>
                    {result ? (
                      <motion.img 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={result} 
                        alt="Result" 
                        className="w-full h-full object-contain drop-shadow-2xl" 
                      />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-[13px] font-medium bg-white/80 px-2 py-1 rounded">Result will appear here</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                {result && (
                  <div className="flex gap-3">
                    <button onClick={() => { setResult(null); setProgress(0); setError(null); }} className="flex-1 py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                      <RefreshCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button onClick={downloadResult} className="flex-[2] py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
    </div>
  );
}
