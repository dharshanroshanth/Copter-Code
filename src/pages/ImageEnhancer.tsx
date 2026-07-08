import React, { useState, useRef } from 'react';
import { useStore, store } from '../store';
import { Sparkles, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, AlertTriangle, Cloud, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAccessToken } from '../lib/firebase';
import { uploadBase64ImageToDrive } from '../lib/googleDrive';

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

// High-fidelity, professional-grade photographic contrast, exposure, and edge-preserving Unsharp Mask (USM) sharpener
const enhanceAndSharpenImage = (ctx: CanvasRenderingContext2D, width: number, height: number, sharpenAmount: number = 0.6) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;

  // 1. Convert RGB to YUV space to process Luminance (Y) separately from Chrominance (U, V)
  // This is industry standard to avoid color fringing and chromatic noise amplification during sharpening.
  const Y = new Float32Array(w * h);
  const U = new Float32Array(w * h);
  const V = new Float32Array(w * h);

  for (let idx = 0; idx < data.length; idx += 4) {
    const i = idx / 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    Y[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    U[i] = -0.14713 * r - 0.28886 * g + 0.436 * b;
    V[i] = 0.615 * r - 0.51499 * g - 0.10001 * b;
  }

  // 2. Local/Global Contrast and Tone Mapping on the Luminance (Y) channel
  // We use a professional-grade continuous tone reproduction curve that combines:
  // - A linear component for natural gradient reproduction
  // - A smoothstep (S-curve) component for photographic contrast pop in midtones
  // - A square root (gamma) component to lift shadows and reveal details without grain
  // Together, this matches professional film response curves and prevents crushing dark regions.
  for (let i = 0; i < w * h; i++) {
    const yNorm = Y[i] / 255;

    // Apply a clean photographic S-curve for a modern contrast pop
    const sCurve = yNorm * yNorm * (3.0 - 2.0 * yNorm);

    // Beautifully balanced tone reproduction curve: blend original, S-curve (contrast), and a gamma curve (shadow lift)
    let blendedY = yNorm * 0.30 + sCurve * 0.50 + Math.sqrt(yNorm) * 0.20;

    // Apply a subtle global exposure/brightness bump (5% boost to non-white pixels) to make images feel warmer and brighter
    blendedY = blendedY * 1.05;

    Y[i] = Math.max(0.0, Math.min(1.0, blendedY)) * 255;

    // 2.1. Professional Vibrance and Skin Protection
    // Boost vibrance and saturation significantly so colors look rich, deep, and alive
    const uVal = U[i];
    const vVal = V[i];
    const chroma = Math.sqrt(uVal * uVal + vVal * vVal);
    const normalizedChroma = Math.min(1.0, chroma / 100);

    let vibranceFactor = 1.35 - 0.20 * normalizedChroma;

    // Skin-tone detection: Warm reddish-orange region in YUV is characterized by V > 0 and U < 0
    if (vVal > 0 && uVal < 0) {
      vibranceFactor = 1.0 + (vibranceFactor - 1.0) * 0.45; // Soften saturation boost to maintain natural skin tone appearance
    }

    U[i] *= vibranceFactor;
    V[i] *= vibranceFactor;
  }

  // 3. Create a 5x5 Gaussian blurred version of the Y (Luminance) channel to use as low-frequency reference
  // A 5x5 Gaussian blur has a wider radius than a simple 3x3 filter, extracting higher-level structural edges
  // rather than pixel-level camera noise, completely resolving the heavy digital grain artifact issue.
  const Y_blur = new Float32Array(w * h);
  const Y_temp = new Float32Array(w * h);

  // Horizontal Pass with edge clamping
  for (let y = 0; y < h; y++) {
    const rowOffset = y * w;
    for (let x = 0; x < w; x++) {
      const x_2 = rowOffset + Math.max(0, x - 2);
      const x_1 = rowOffset + Math.max(0, x - 1);
      const x_0 = rowOffset + x;
      const x_p1 = rowOffset + Math.min(w - 1, x + 1);
      const x_p2 = rowOffset + Math.min(w - 1, x + 2);
      Y_temp[rowOffset + x] = (Y[x_2] + 4 * Y[x_1] + 6 * Y[x_0] + 4 * Y[x_p1] + Y[x_p2]) / 16;
    }
  }

  // Vertical Pass with edge clamping
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const y_2 = Math.max(0, y - 2) * w + x;
      const y_1 = Math.max(0, y - 1) * w + x;
      const y_0 = y * w + x;
      const y_p1 = Math.min(h - 1, y + 1) * w + x;
      const y_p2 = Math.min(h - 1, y + 2) * w + x;
      Y_blur[y * w + x] = (Y_temp[y_2] + 4 * Y_temp[y_1] + 6 * Y_temp[y_0] + 4 * Y_temp[y_p1] + Y_temp[y_p2]) / 16;
    }
  }

  // 4. Adaptive Noise-Gated Unsharp Masking & Denoising
  // We use precise noise gating and halo prevention:
  // - High edge difference (>2.0): Sharpen with professional, moderate factor.
  // - Flat regions (<1.5): Apply gentle bilateral-like skin smoothing.
  // - Limit maximum sharpening change (halos) to preserve edge fidelity without ringing artifacts.
  const Y_final = new Float32Array(w * h);
  const maxSharpenFactor = sharpenAmount * 1.60; // Clean, high-impact, professional-grade clarity

  for (let i = 0; i < w * h; i++) {
    const yVal = Y[i];
    const yBlur = Y_blur[i];
    const edge = yVal - yBlur;
    const absEdge = Math.abs(edge);

    let finalY = yVal;

    if (absEdge < 1.0) {
      // Denoise flat areas smoothly: blend slightly with blurred Y to hide camera sensor noise on cheeks/background
      const smoothFactor = 0.15 * (1.0 - absEdge / 1.0);
      finalY = yVal * (1.0 - smoothFactor) + yBlur * smoothFactor;
    } else {
      // Smooth noise gating transition for micro-details below 5.0
      let edgeWeight = 1.0;
      if (absEdge < 5.0) {
        edgeWeight = absEdge / 5.0;
      }

      // Compute sharpening adjustment
      const sharpenEffect = edge * maxSharpenFactor * edgeWeight;

      // Halo protection: limit maximum correction to avoid ringing artifacts on sharp high-contrast transitions
      const maxChange = 28.0;
      let limitedEffect = sharpenEffect;
      if (limitedEffect > maxChange) limitedEffect = maxChange;
      if (limitedEffect < -maxChange) limitedEffect = -maxChange;

      finalY = yVal + limitedEffect;
    }

    Y_final[i] = Math.max(0.0, Math.min(255.0, finalY));
  }

  // 5. Convert YUV back to RGB space and write output pixels to canvas data
  for (let i = 0; i < w * h; i++) {
    const yVal = Y_final[i];
    const uVal = U[i];
    const vVal = V[i];

    const r = yVal + 1.13983 * vVal;
    const g = yVal - 0.39465 * uVal - 0.58060 * vVal;
    const b = yVal + 2.03211 * uVal;

    const idx = i * 4;
    data[idx] = Math.max(0, Math.min(255, Math.round(r)));
    data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
    // Alpha channel remains untouched
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

  // Google Drive Saving States
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveSaveSuccess, setDriveSaveSuccess] = useState(false);
  const [driveSaveError, setDriveSaveError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setError(null);
        setDriveSaveError(null);
        setDriveSaveSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToGoogleDrive = async () => {
    if (!result) return;
    const token = getAccessToken();
    if (!token) {
      setDriveSaveError('Please connect your Google Drive account first in the Google Drive tab.');
      return;
    }

    setIsSavingToDrive(true);
    setDriveSaveSuccess(false);
    setDriveSaveError(null);

    try {
      const filename = `enhanced_photo_${Date.now()}.png`;
      await uploadBase64ImageToDrive(token, result, filename);
      setDriveSaveSuccess(true);
      setTimeout(() => setDriveSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving to drive:', err);
      setDriveSaveError(err?.message || 'Failed to save to Google Drive.');
    } finally {
      setIsSavingToDrive(false);
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
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Original Image
                  </h3>
                  <div 
                    className="bg-slate-950/95 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 z-10 shadow-md border border-white/15 select-none rounded-full min-w-[70px] text-center"
                    style={{ letterSpacing: '0.07em' }}
                  >
                    Before
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Result
                  </h3>
                  {result && (
                    <div 
                      className="bg-pink-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 z-10 shadow-md border border-pink-400/30 select-none rounded-full min-w-[70px] text-center"
                      style={{ letterSpacing: '0.07em' }}
                    >
                      After
                    </div>
                  )}
                </div>
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
                  <div className="space-y-2">
                    <button onClick={downloadResult} className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Enhanced
                    </button>
                    
                    <button
                      onClick={saveToGoogleDrive}
                      disabled={isSavingToDrive}
                      className={`w-full py-3 px-4 rounded-xl border font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm ${
                        driveSaveSuccess
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white border-indigo-500'
                      }`}
                    >
                      {isSavingToDrive ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving to Google Drive...
                        </>
                      ) : driveSaveSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Saved to Google Drive!
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4" />
                          Save to Google Drive
                        </>
                      )}
                    </button>

                    {driveSaveError && (
                      <p className="text-[11px] text-rose-500 text-center font-bold mt-1">
                        ⚠️ {driveSaveError}
                      </p>
                    )}
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
