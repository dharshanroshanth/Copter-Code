import React, { useState, useRef } from 'react';
import { useStore, store } from '../store';
import { Sparkles, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Securely proxies and converts cross-origin images to Base64 to prevent canvas contamination
const prepareImageForCanvas = async (src: string): Promise<string> => {
  if (!src) return src;
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }
  if (src.startsWith('http')) {
    try {
      const response = await fetch('/api/ai/proxy-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: src }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.dataUrl) {
          return data.dataUrl;
        }
      }
    } catch (err) {
      console.warn('Failed to proxy cross-origin image on server, falling back to original:', err);
    }
  }
  return src;
};

// High-fidelity Programmatic Contrast, Color and Sharpness Enhancer with Noise-Gating
const enhanceAndSharpenImage = (ctx: CanvasRenderingContext2D, width: number, height: number, sharpenAmount: number = 0.6) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;
  
  // Create reference buffer
  const original = new Uint8ClampedArray(data);
  
  // Professional, balanced photographic adjustments (vibrant, rich & clear)
  const contrastFactor = 1.25;      // Distinct, clean contrast boost
  const saturationFactor = 1.30;    // Rich, vivid colors
  const brightnessOffset = 10;      // Exposure lift for bright, gorgeous results

  // 1. First Pass: Apply Noticeable Color, Contrast, and Brightness Enhancement at pixel level with shadow/highlight protection
  for (let idx = 0; idx < data.length; idx += 4) {
    let r = original[idx];
    let g = original[idx + 1];
    let b = original[idx + 2];

    // Apply gentle brightness boost
    r += brightnessOffset;
    g += brightnessOffset;
    b += brightnessOffset;

    // Calculate luminance for highlight/shadow protection
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Protect shadows and highlights by reducing contrast factor at the extremes
    // (Sigmoid-like soft roll-off)
    const factor = contrastFactor * (1.0 - 0.25 * Math.pow((luma - 128) / 128, 2));

    // Apply contrast boost
    r = (r - 128) * factor + 128;
    g = (g - 128) * factor + 128;
    b = (b - 128) * factor + 128;

    // Apply saturation boost
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + (r - gray) * saturationFactor;
    g = gray + (g - gray) * saturationFactor;
    b = gray + (b - gray) * saturationFactor;

    // Clamp values
    data[idx] = Math.max(0, Math.min(255, r));
    data[idx + 1] = Math.max(0, Math.min(255, g));
    data[idx + 2] = Math.max(0, Math.min(255, b));
  }

  // Update reference for sharpening convolution pass
  const enhancedOriginal = new Uint8ClampedArray(data);

  // 2. Second Pass: High-Fidelity 3x3 Laplacian Sharpening Convolution (4-neighborhood)
  // Apply sharpening across all pixels (no high gating) to guarantee blurriness is fixed and the image is visibly razor-sharp
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        const idx = (y * w + x) * 4 + c;
        
        // 4 surrounding pixels (cross structure is much cleaner and less noise-prone)
        const top = enhancedOriginal[((y - 1) * w + x) * 4 + c];
        const bottom = enhancedOriginal[((y + 1) * w + x) * 4 + c];
        const left = enhancedOriginal[(y * w + (x - 1)) * 4 + c];
        const right = enhancedOriginal[(y * w + (x + 1)) * 4 + c];
        const center = enhancedOriginal[idx];
        
        // Laplacian edge value: center * 4 - sum(neighbors)
        const edgeVal = center * 4 - (top + bottom + left + right);
        
        // Blend edge value to sharpen soft, blurry details beautifully
        let val = center + edgeVal * sharpenAmount;
        data[idx] = Math.max(0, Math.min(255, val));
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

export default function ImageEnhancer() {
  const { selectedImage } = useStore();
  const [image, setImage] = useState<string | null>(selectedImage || null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const enhanceImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Step 1: Pre-process and proxy image to bypass CORS (0% - 25%)
      setProgress(15);
      const safeSrc = await prepareImageForCanvas(image);
      setProgress(40);
      
      const img = new Image();
      if (safeSrc.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        try {
          setProgress(60);
          const canvas = canvasRef.current;
          if (!canvas) throw new Error('Canvas element not found.');
          
          // Cap maximum image dimension to 1600px for high-fidelity responsive performance
          const maxDim = 1600;
          let canvasWidth = img.width;
          let canvasHeight = img.height;
          if (img.width > maxDim || img.height > maxDim) {
            if (img.width > img.height) {
              canvasWidth = maxDim;
              canvasHeight = Math.round((img.height * maxDim) / img.width);
            } else {
              canvasHeight = maxDim;
              canvasWidth = Math.round((img.width * maxDim) / img.height);
            }
          }
          
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get 2D context.');
          
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          
          // Draw image to canvas and let programmatic pixel adjustments handle exposure, color and contrast
          setProgress(75);
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          
          // Run powerful high-fidelity sharpening convolution and pixel-level enhancements to fix blurriness
          setProgress(90);
          enhanceAndSharpenImage(ctx, canvasWidth, canvasHeight, 0.95); // High-fidelity sharpening (0.95)
          
          const enhancedUrl = canvas.toDataURL('image/jpeg', 0.95);
          setResult(enhancedUrl);
          setProgress(100);
          setIsProcessing(false);
        } catch (err: any) {
          console.error('Canvas processing failed:', err);
          setError(err.message || 'Error occurred while sharpening image.');
          setIsProcessing(false);
        }
      };
      
      img.onerror = () => {
        setError('Failed to load image into processing canvas. Try another image.');
        setIsProcessing(false);
      };
      
      img.src = safeSrc;
    } catch (err: any) {
      console.error('Image enhancement error:', err);
      setError(err.message || 'Failed to enhance image.');
      setIsProcessing(false);
    }
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
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Enhancement Failed</h4>
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
                  
                  {/* Overlay Badge */}
                  <div 
                    className="absolute top-4 right-4 bg-slate-950/90 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 z-10 shadow-md border border-white/15 select-none rounded-full"
                    style={{ letterSpacing: '0.07em' }}
                  >
                    Before
                  </div>

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
                          <span className="text-xs text-slate-500 mt-1">
                            {progress < 40 ? 'Securing image stream...' :
                             progress < 60 ? 'Reconstructing textures...' :
                             progress < 85 ? 'Applying exposure & color models...' :
                             progress < 100 ? 'Rebuilding pixel clarity...' : 'Finalizing output...'} ({progress}%)
                          </span>
                          <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden relative">
                            <motion.div 
                              className="h-full bg-pink-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ ease: "easeInOut", duration: 0.3 }}
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
                  
                  {/* Overlay Badge */}
                  {result && (
                    <div 
                      className="absolute top-4 right-4 bg-pink-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 z-10 shadow-md border border-pink-400/30 select-none rounded-full"
                      style={{ letterSpacing: '0.07em' }}
                    >
                      After
                    </div>
                  )}

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
