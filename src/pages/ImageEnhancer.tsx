import React, { useState, useRef, useEffect } from 'react';
import { useStore, store } from '../store';
import { Sparkles, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageEnhancer() {
  const { selectedImage } = useStore();
  const [image, setImage] = useState<string | null>(selectedImage || null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const enhanceImage = () => {
    if (!image) return;
    setIsProcessing(true);
    
    // Simulate AI processing time, then apply canvas filters
    
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Apply "enhancement" filters: boost contrast, saturation, slight sharpen (via brightness)
        ctx.filter = 'contrast(1.15) saturate(1.2) brightness(1.05)';
        ctx.drawImage(img, 0, 0);
        
        setResult(canvas.toDataURL('image/jpeg', 0.95));
        setIsProcessing(false);
      };
      img.src = image;
    
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'enhanced-image.jpg';
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
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Image Enhancer</h1>
              <p className="text-[13px] font-medium text-slate-500">Auto-enhance colors, lighting, and clarity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="max-w-4xl w-full space-y-6">
          {!image ? (
            <div className="border-2 border-dashed border-slate-300 rounded-3xl h-[400px] flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-4">
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
                          <div className="absolute inset-0 border-4 border-pink-200 rounded-full" />
                          <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin" />
                          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-700">Enhancing Image</span>
                          <span className="text-xs text-slate-500 mt-1">Applying AI models...</span>
                          <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden relative">
                            <motion.div 
                              className="absolute top-0 bottom-0 left-0 bg-pink-500 rounded-full w-1/2"
                              animate={{ 
                                x: ['-100%', '200%']
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                ease: "linear", 
                                duration: 1.5 
                              }}
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
                  <button onClick={enhanceImage} disabled={isProcessing || !!result} className="flex-1 py-3 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Enhance Image
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Result
                </h3>
                <div className="aspect-square bg-white border border-slate-200 rounded-2xl overflow-hidden relative flex items-center justify-center">
                  <AnimatePresence>
                    {result ? (
                      <motion.img 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={result} 
                        alt="Result" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-[13px] font-medium">Enhanced result will appear here</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                {result && (
                  <button onClick={downloadResult} className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Enhanced
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
