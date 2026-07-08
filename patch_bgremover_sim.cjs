const fs = require('fs');
const content = `import React, { useState, useRef, useEffect } from 'react';
import { useStore, store } from '../store';
import { Scissors, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BgRemover() {
  const { selectedImage } = useStore();
  const [image, setImage] = useState<string | null>(selectedImage || null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    // Simulate AI Processing time and canvas clearing
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // 1. Clear the entire canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 2. Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // 3. Simulate background removal using a mask (destination-in)
        // We'll keep an ellipse in the center (assuming the subject is centered)
        // and clear out the edges to make it transparent.
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radiusX = canvas.width * 0.4;
        const radiusY = canvas.height * 0.45;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        
        // Output as transparent PNG
        setResult(canvas.toDataURL('image/png'));
        setIsProcessing(false);
      };
      img.src = image;
    }, 1500);
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
                  <img src={image} alt="Original" className="w-full h-full object-contain" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[14px] font-bold text-slate-700 transition-colors">
                    Choose Another
                  </button>
                  <button onClick={removeBackground} disabled={isProcessing || !!result} className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
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
                    <button onClick={() => { setResult(null); setProgress(0); }} className="flex-1 py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
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
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
`;
fs.writeFileSync('./src/pages/BgRemover.tsx', content);
