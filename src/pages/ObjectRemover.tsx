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
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
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
    let active = true;
    if (image && canvasRef.current && containerRef.current) {
      const load = async () => {
        let srcToLoad = image;
        if (image.startsWith('http')) {
          try {
            const response = await fetch('/api/ai/proxy-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: image }),
            });
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.dataUrl && active) {
                srcToLoad = data.dataUrl;
              }
            }
          } catch (err) {
            console.warn('Failed to proxy cross-origin image on server:', err);
          }
        }

        if (!active) return;

        const img = new Image();
        if (srcToLoad.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          if (!active) return;
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

          // Setup offscreen mask canvas
          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = containerWidth;
          maskCanvas.height = containerHeight;
          const maskCtx = maskCanvas.getContext('2d');
          if (maskCtx) {
            maskCtx.fillStyle = '#000000';
            maskCtx.fillRect(0, 0, containerWidth, containerHeight);
          }
          maskCanvasRef.current = maskCanvas;
        };
        img.src = srcToLoad;
      };

      load();
    }

    return () => {
      active = false;
    };
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
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.beginPath();
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

    // Also draw on the offscreen mask canvas
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.lineWidth = brushSize;
        maskCtx.lineCap = 'round';
        maskCtx.strokeStyle = '#FFFFFF';
        maskCtx.lineTo(x, y);
        maskCtx.stroke();
        maskCtx.beginPath();
        maskCtx.moveTo(x, y);
      }
    }

    setHasDrawn(true);
  };

  const removeObject = () => {
    if (!hasDrawn || !canvasRef.current || history.length === 0) return;
    setIsProcessing(true);
    
    // Process in a setTimeout to allow the UI to render the loading spinner
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsProcessing(false);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }
      
      const width = canvas.width;
      const height = canvas.height;

      // Get clean original image data from before this drawing session
      const sourceImageData = history[history.length - 1];
      if (!sourceImageData) {
        setIsProcessing(false);
        return;
      }
      const srcData = sourceImageData.data;

      // Get the mask canvas data
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) {
        setIsProcessing(false);
        return;
      }
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) {
        setIsProcessing(false);
        return;
      }
      const maskData = maskCtx.getImageData(0, 0, width, height).data;

      // Dilate the user selection mask by 4 pixels to completely cover anti-aliased dark edges and shadows
      const dilatedMask = new Uint8Array(width * height);
      const dilationRadius = 4;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (maskData[idx * 4] > 128) { // White pixel in user's selection mask
            for (let dy = -dilationRadius; dy <= dilationRadius; dy++) {
              for (let dx = -dilationRadius; dx <= dilationRadius; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  dilatedMask[ny * width + nx] = 1;
                }
              }
            }
          }
        }
      }

      // Create new output image data
      const outputImageData = ctx.createImageData(width, height);
      const outData = outputImageData.data;

      // Create a working buffer populated with the original clean image data
      const work = new Uint8ClampedArray(srcData);

      // Find bounding box of the mask
      let minX = width, maxX = 0, minY = height, maxY = 0;
      let hasMask = false;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          if (dilatedMask[idx] === 1) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            hasMask = true;
          }
        }
      }

      if (hasMask) {
        // Define patch synthesis constants
        const B = 16; // Block size
        const S = 8;  // Stride (50% overlap for perfectly seamless results)

        // Initialize target patches covering the mask
        interface TargetPatch {
          x: number;
          y: number;
          knownCount: number;
        }
        const targetPatches: TargetPatch[] = [];

        for (let y = Math.max(0, minY - B + S); y <= maxY; y += S) {
          for (let x = Math.max(0, minX - B + S); x <= maxX; x += S) {
            let maskCount = 0;
            let totalCount = 0;
            for (let py = 0; py < B; py++) {
              for (let px = 0; px < B; px++) {
                const tx = x + px;
                const ty = y + py;
                if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
                  totalCount++;
                  if (dilatedMask[ty * width + tx] === 1) {
                    maskCount++;
                  }
                }
              }
            }
            if (maskCount > 0) {
              targetPatches.push({
                x,
                y,
                knownCount: totalCount - maskCount
              });
            }
          }
        }

        // Greedy priority-based patch propagation
        const processed = new Set<number>();

        while (processed.size < targetPatches.length) {
          // Dynamic priority update: find the unprocessed patch with the highest knownCount
          let bestPatchIdx = -1;
          let maxKnown = -1;

          for (let i = 0; i < targetPatches.length; i++) {
            if (processed.has(i)) continue;
            
            const patch = targetPatches[i];
            let maskCount = 0;
            let totalCount = 0;
            for (let py = 0; py < B; py++) {
              for (let px = 0; px < B; px++) {
                const tx = patch.x + px;
                const ty = patch.y + py;
                if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
                  totalCount++;
                  if (dilatedMask[ty * width + tx] === 1) {
                    maskCount++;
                  }
                }
              }
            }
            const knownCount = totalCount - maskCount;
            patch.knownCount = knownCount;

            if (knownCount > maxKnown) {
              maxKnown = knownCount;
              bestPatchIdx = i;
            }
          }

          if (bestPatchIdx === -1) break;
          processed.add(bestPatchIdx);
          const patch = targetPatches[bestPatchIdx];

          // Search for the best matching original background patch (SSD)
          let bestSx = -1;
          let bestSy = -1;
          let minCost = Infinity;

          // Multi-range search windows (fast local-first search, fallback to global)
          const searchRanges = [120, 240, Math.max(width, height)];
          const steps = [2, 4, 8];

          for (let rIdx = 0; rIdx < searchRanges.length; rIdx++) {
            const searchRange = searchRanges[rIdx];
            const step = steps[rIdx];

            for (let dy = -searchRange; dy <= searchRange; dy += step) {
              for (let dx = -searchRange; dx <= searchRange; dx += step) {
                const sx = patch.x + dx;
                const sy = patch.y + dy;

                if (sx < 0 || sx + B > width || sy < 0 || sy + B > height) {
                  continue;
                }

                // Ensure candidate source patch contains 0 masked pixels
                let isValid = true;
                for (let cy = 0; cy < B; cy++) {
                  for (let cx = 0; cx < B; cx++) {
                    if (dilatedMask[(sy + cy) * width + (sx + cx)] === 1) {
                      isValid = false;
                      break;
                    }
                  }
                  if (!isValid) break;
                }

                if (!isValid) continue;

                // Calculate matching cost (SSD) over known pixels of target patch
                let cost = 0;
                let comparedCount = 0;

                for (let cy = 0; cy < B; cy++) {
                  for (let cx = 0; cx < B; cx++) {
                    const tx = patch.x + cx;
                    const ty = patch.y + cy;
                    
                    if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
                      const tIdx = ty * width + tx;
                      if (dilatedMask[tIdx] === 0) { // Known background pixel
                        const sIdx = (sy + cy) * width + (sx + cx);
                        const tPx = tIdx * 4;
                        const sPx = sIdx * 4;

                        const rDiff = work[tPx] - work[sPx];
                        const gDiff = work[tPx + 1] - work[sPx + 1];
                        const bDiff = work[tPx + 2] - work[sPx + 2];

                        cost += rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
                        comparedCount++;
                      }
                    }
                  }
                }

                if (comparedCount > 0) {
                  cost = cost / comparedCount;
                }

                // Favor closer background textures for local consistency
                const distSq = dx * dx + dy * dy;
                cost += distSq * 0.01;

                if (cost < minCost) {
                  minCost = cost;
                  bestSx = sx;
                  bestSy = sy;
                }
              }
            }

            if (bestSx !== -1) break; // Found a match
          }

          if (bestSx === -1) {
            // Fallback: fill with original pixels
            for (let cy = 0; cy < B; cy++) {
              for (let cx = 0; cx < B; cx++) {
                const tx = patch.x + cx;
                const ty = patch.y + cy;
                if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
                  const tIdx = ty * width + tx;
                  dilatedMask[tIdx] = 0;
                }
              }
            }
            continue;
          }

          // Copy and blend the best matching source patch to the target patch
          for (let cy = 0; cy < B; cy++) {
            for (let cx = 0; cx < B; cx++) {
              const tx = patch.x + cx;
              const ty = patch.y + cy;
              
              if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
                const tIdx = ty * width + tx;

                if (dilatedMask[tIdx] === 1) {
                  // Seamless boundary blend: 2-pixel feathered edge
                  let minBorderDist = 3;
                  for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                      const nx = tx + dx;
                      const ny = ty + dy;
                      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        if (dilatedMask[ny * width + nx] === 0) {
                          const dist = Math.max(Math.abs(dx), Math.abs(dy));
                          if (dist < minBorderDist) {
                            minBorderDist = dist;
                          }
                        }
                      }
                    }
                  }

                  let alpha = 1.0;
                  if (minBorderDist === 1) alpha = 0.40;
                  else if (minBorderDist === 2) alpha = 0.75;

                  const sIdx = (bestSy + cy) * width + (bestSx + cx);
                  const tPx = tIdx * 4;
                  const sPx = sIdx * 4;

                  work[tPx] = Math.round(work[tPx] * (1.0 - alpha) + work[sPx] * alpha);
                  work[tPx + 1] = Math.round(work[tPx + 1] * (1.0 - alpha) + work[sPx + 1] * alpha);
                  work[tPx + 2] = Math.round(work[tPx + 2] * (1.0 - alpha) + work[sPx + 2] * alpha);
                  work[tPx + 3] = 255;
                }
              }
            }
          }

          // Mark filled pixels as known/filled in our working mask
          for (let cy = 0; cy < B; cy++) {
            for (let cx = 0; cx < B; cx++) {
              const tx = patch.x + cx;
              const ty = patch.y + cy;
              if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
                dilatedMask[ty * width + tx] = 0;
              }
            }
          }
        }
      }

      // Copy fully reconstructed image buffer back to outputImageData
      for (let i = 0; i < work.length; i++) {
        outData[i] = work[i];
      }

      ctx.putImageData(outputImageData, 0, 0);
      setHistory([...history, outputImageData]);

      // Reset offscreen mask canvas to solid black for next selection
      const resetMaskCtx = maskCanvas.getContext('2d');
      if (resetMaskCtx) {
        resetMaskCtx.fillStyle = '#000000';
        resetMaskCtx.fillRect(0, 0, width, height);
      }

      setIsProcessing(false);
      setHasDrawn(false);
    }, 50);
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

        // Reset offscreen mask canvas to solid black
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          const maskCtx = maskCanvas.getContext('2d');
          if (maskCtx) {
            maskCtx.fillStyle = '#000000';
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
          }
        }
      }
    }
  };

  const downloadResult = () => {
    if (!canvasRef.current) return;
    try {
      const a = document.createElement('a');
      a.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
      a.download = 'object-removed.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image from canvas:', error);
      // Fallback: open in new tab if programmatic click or CORS is blocked
      try {
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`<img src="${dataUrl}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
          newTab.document.title = "Object Removed Photo";
        }
      } catch (err) {
        console.error('Fallback download failed:', err);
      }
    }
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
