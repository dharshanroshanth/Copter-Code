import React, { useState, useRef, useEffect } from 'react';
import { useStore, store } from '../store';
import { Eraser, Upload, Download, Loader2, ArrowLeft, Image as ImageIcon, Undo, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ObjectRemover() {
  const { selectedImage } = useStore();
  const [image, setImage] = useState<string | null>(selectedImage || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setHasDrawn(false);
        setHistory([]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current && containerRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        
        // Match container aspect ratio to image
        const ratio = img.width / img.height;
        const containerWidth = container.clientWidth;
        const containerHeight = containerWidth / ratio;
        
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      };
      img.src = image;
    }
  }, [image]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; // red semi-transparent brush

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const removeObject = () => {
    if (!hasDrawn || !canvasRef.current) return;
    setIsProcessing(true);
    
    // Simulate AI processing
    
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = currentImageData.data;
      
      // Basic blur or pixelate effect for red pixels
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          let r = 0, g = 0, b = 0, count = 0;
          for (let dy = 0; dy < 4; dy++) {
            for (let dx = 0; dx < 4; dx++) {
              if (y+dy < canvas.height && x+dx < canvas.width) {
                const i = ((y+dy) * canvas.width + (x+dx)) * 4;
                r += data[i];
                g += data[i+1];
                b += data[i+2];
                count++;
              }
            }
          }
          if (count > 0) {
            r /= count; g /= count; b /= count;
            for (let dy = 0; dy < 4; dy++) {
              for (let dx = 0; dx < 4; dx++) {
                if (y+dy < canvas.height && x+dx < canvas.width) {
                  const i = ((y+dy) * canvas.width + (x+dx)) * 4;
                  // If it's a "red" pixel from the mask, replace with average
                  if (data[i] > 180 && data[i+1] < 100 && data[i+2] < 100) {
                     data[i] = r;
                     data[i+1] = g;
                     data[i+2] = b;
                  }
                }
              }
            }
          }
        }
      }
      
      ctx.putImageData(currentImageData, 0, 0);
      setHistory([...history, currentImageData]);
      setIsProcessing(false);
      setHasDrawn(false);

  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove current state
      const previousState = newHistory[newHistory.length - 1];
      const canvas = canvasRef.current;
      if (canvas && previousState) {
        const ctx = canvas.getContext('2d');
        ctx?.putImageData(previousState, 0, 0);
        setHistory(newHistory);
        setHasDrawn(false);
      }
    }
  };

  const downloadResult = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    a.download = 'object-removed.jpg';
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Eraser className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Object Remover</h1>
              <p className="text-[13px] font-medium text-slate-500">Paint over unwanted objects to erase them</p>
            </div>
          </div>
        </div>
        {image && (
          <div className="flex items-center gap-3">
            <button onClick={handleUndo} disabled={history.length <= 1} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors disabled:opacity-50">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={downloadResult} className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="max-w-4xl w-full space-y-6">
          {!image ? (
            <div className="border-2 border-dashed border-slate-300 rounded-3xl h-[400px] flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Upload an image</h3>
              <p className="text-[14px] text-slate-500 font-medium">Drag and drop or click to browse</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div ref={containerRef} className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden relative shadow-sm">
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={endDrawing}
                    onTouchMove={draw}
                    className="w-full h-auto cursor-crosshair touch-none"
                  />
                  
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm z-10"
                      >
                        <div className="w-16 h-16 relative flex items-center justify-center">
                          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
                          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                          <Wand2 className="w-6 h-6 text-emerald-500 animate-pulse" />
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-700">Erasing Object</span>
                          <span className="text-xs text-slate-500 mt-1">Reconstructing background...</span>
                          <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden relative">
                            <motion.div 
                              className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full w-1/2"
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

                </div>
              </div>

              <div className="w-full md:w-72 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
                  <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                    <Eraser className="w-4 h-4 text-emerald-500" /> Brush Settings
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="font-semibold text-slate-600">Brush Size</span>
                      <span className="font-mono text-slate-400">{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 text-[12px] p-3 rounded-xl font-medium leading-relaxed">
                    Paint over the objects you want to remove. The AI will seamlessly fill the background.
                  </div>
                  <button onClick={removeObject} disabled={!hasDrawn || isProcessing} className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
                    <Wand2 className="w-4 h-4" /> Erase Selection
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[14px] font-bold text-slate-700 transition-colors">
                    Upload New Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
    </div>
  );
}
