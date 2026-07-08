import React, { useState, useRef, useEffect } from 'react';
import { useStore, store } from '../store';
import { Image as ImageIcon, Upload, Download, Loader2, ArrowLeft, Crop, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Helper to convert image sources (including client-side blob URLs) to Base64 so they can be processed on the server
const prepareImageForServer = async (src: string): Promise<string> => {
  if (src.startsWith('data:') || src.startsWith('http')) {
    return src;
  }
  if (src.startsWith('blob:')) {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error('Failed to convert blob URL to base64:', err);
    }
  }
  return src;
};

export default function PassportPhoto() {
  const { selectedImage } = useStore();
  const [image, setImage] = useState<string | null>(selectedImage || null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [format, setFormat] = useState('2x2'); // '2x2' or '35x45'
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRemovedImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setError(null);
        bgRemovedImageRef.current = null;
      };
      reader.readAsDataURL(file);
    }
  };

  const processPhoto = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      let maskUrl = result;
      if (!bgRemovedImageRef.current) {
        setProgress(30);
        const preparedImage = await prepareImageForServer(image);
        setProgress(65);
        
        const response = await fetch('/api/ai/remove-bg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: preparedImage }),
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        maskUrl = data.imageUrl;
        setProgress(100);
      }
      
      const img = new Image();
      img.onload = () => {
        bgRemovedImageRef.current = img;
        renderCanvas(img);
      };
      img.src = maskUrl!;
    } catch (err: any) {
      console.error('Error processing photo:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
      setIsProcessing(false);
    }
  };

  const renderCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard dimensions (at 300 DPI)
    // 2x2 inch = 600x600 px
    // 35x45 mm = 413x531 px
    const width = format === '2x2' ? 600 : 413;
    const height = format === '2x2' ? 600 : 531;

    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Calculate scale to fit face (naive approach: fit height)
    const scale = Math.max(width / img.width, height / img.height) * 0.9; 
    const x = (width / 2) - (img.width / 2) * scale;
    const y = (height / 2) - (img.height / 2) * scale + (height * 0.1); // shift down slightly

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    setResult(canvas.toDataURL('image/jpeg', 0.95));
    setIsProcessing(false);
  };

  useEffect(() => {
    if (bgRemovedImageRef.current && result) {
      renderCanvas(bgRemovedImageRef.current);
    }
  }, [bgColor, format]);

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `passport-photo-${format}.jpg`;
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
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Passport Photo Maker</h1>
              <p className="text-[13px] font-medium text-slate-500">Create official ID & passport photos</p>
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
              <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Upload a portrait</h3>
              <p className="text-[14px] text-slate-500 font-medium">Use a photo with good lighting and looking straight</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                  <Crop className="w-4 h-4" /> Preview
                </h3>
                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
                   <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="shadow-xl rounded-sm overflow-hidden border border-slate-100 relative"
                        style={{ width: format === '2x2' ? '300px' : '206px', height: format === '2x2' ? '300px' : '265px' }}
                      >
                        <img src={result} alt="Result" className="w-full h-full object-cover" />
                      </motion.div>
                    ) : (
                      <motion.div key="original" className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-sm">
                        <img src={image} alt="Original" className="w-full h-auto" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="w-full md:w-80 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                  <div className="space-y-3">
                    <h3 className="text-[13px] font-bold text-slate-900">Format Size</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setFormat('2x2')} className={`py-2 px-3 rounded-lg text-[13px] font-bold border transition-colors ${format === '2x2' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        2x2 Inch<br/><span className="font-normal text-[11px]">US Passport</span>
                      </button>
                      <button onClick={() => setFormat('35x45')} className={`py-2 px-3 rounded-lg text-[13px] font-bold border transition-colors ${format === '35x45' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        35x45 mm<br/><span className="font-normal text-[11px]">UK / EU / Aus</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[13px] font-bold text-slate-900">Background Color</h3>
                    <div className="flex gap-2">
                      {['#FFFFFF', '#EEF2FF', '#F1F5F9', '#EFF6FF', '#F8FAFC'].map(color => (
                        <button 
                          key={color}
                          onClick={() => setBgColor(color)}
                          className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform ${bgColor === color ? 'border-sky-500 scale-110' : 'border-slate-200 hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {!result ? (
                    <button onClick={processPhoto} disabled={isProcessing} className="w-full py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                      {isProcessing ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing {progress}%</>
                      ) : (
                        <><ImageIcon className="w-4 h-4" /> Auto-Format Photo</>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                       <button onClick={downloadResult} className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Download Printable
                      </button>
                      <button onClick={() => { setResult(null); bgRemovedImageRef.current = null; }} className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-700 transition-colors">
                        Reset & Adjust
                      </button>
                    </div>
                  )}
                  
                  <button onClick={() => { fileInputRef.current?.click(); setResult(null); bgRemovedImageRef.current = null; }} className="w-full py-2 text-[13px] font-bold text-slate-500 hover:text-slate-700">
                    Upload New Image
                  </button>
                </div>
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
