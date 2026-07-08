import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as React from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useStore, store } from '../store';
import {
  Crop as CropIcon, Sliders, Sparkles, Type, Layers, Wand2, Image as ImageIcon,
  SquareStack, Archive, Frame, MoreHorizontal, ChevronLeft, Undo, Redo, Cloud,
  Download, ChevronDown, RotateCw, FlipHorizontal, Link,
  ZoomIn, ZoomOut, Maximize, Play, LayoutGrid, Settings2, Diamond,
  Triangle, CloudRain, Circle, Plus, Hash, Trash2, X,
  FileImage,
} from 'lucide-react';

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

export default function Editor() {
  const { selectedImage, activeQuickTool } = useStore();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const defaultImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const overlayInputRef = React.useRef<HTMLInputElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const [activeImage, setActiveImage] = React.useState(selectedImage || defaultImage);
  React.useEffect(() => { if (selectedImage) setActiveImage(selectedImage); }, [selectedImage]);
  const [activeNav, setActiveNav] = React.useState('crop');
  const [exportFormat, setExportFormat] = React.useState<'png' | 'jpeg' | 'webp'>('png');
  const [activeRatio, setActiveRatio] = React.useState('custom');

  // Functional State
  const defaultAdjustments = {
    brightness: 0, contrast: 0, highlights: 0, shadows: 0,
    whites: 0, blacks: 0, vibrance: 0, saturation: 0,
    temperature: 0, tint: 0,
    clarity: 0, sharpen: 0, dehaze: 0, vignette: 0
  };
  
  const defaultTransform = { rotate: 0, flipX: false, flipY: false };
  React.useEffect(() => {
    if (activeQuickTool) {
      if (activeQuickTool === 'crop') {
        setActiveNav('crop');
        store.setActiveQuickTool(null);
        return;
      }
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
        let toolName = activeQuickTool;
        switch (activeQuickTool) {
          case "bg-remover": toolName = "Background removed"; break;
          case "enhancer": toolName = "Image enhanced"; break;
          case "obj-remover": toolName = "Objects removed"; break;
          case "passport": toolName = "Passport photo generated"; break;
          case "ocr": toolName = "Text extracted"; break;
          case "compress": toolName = "Image compressed"; break;
        }
        setToastMessage(`${toolName} successfully!`);
        store.setActiveQuickTool(null);
        setTimeout(() => setToastMessage(null), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeQuickTool]);

  const [adjustments, setAdjustments] = React.useState({ ...defaultAdjustments });
  const [transform, setTransform] = React.useState({ ...defaultTransform });
  const [rotateInput, setRotateInput] = React.useState(defaultTransform.rotate.toString());
  React.useEffect(() => {
    setRotateInput(transform.rotate.toString());
  }, [transform.rotate]);
  const [zoom, setZoom] = React.useState(100);
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [cropAspect, setCropAspect] = React.useState<number | undefined>();
  const [dimensions, setDimensions] = React.useState({ w: 1920, h: 1080 });
  const [isLinked, setIsLinked] = React.useState(true);
  const linkedAspectRef = React.useRef(1920/1080);
  React.useEffect(() => {
    if (isLinked && dimensions.w > 0 && dimensions.h > 0) {
      linkedAspectRef.current = dimensions.w / dimensions.h;
    }
  }, [isLinked]);
  
  const [batchImages, setBatchImages] = React.useState<{id: string, src: string, name: string, status: 'pending'|'processing'|'done'|'error', progress: number, processedDataUrl?: string}[]>([]);
  const [batchBgRemoval, setBatchBgRemoval] = React.useState(false);
  const [selectedZipIds, setSelectedZipIds] = React.useState<Set<string>>(new Set());
  const batchFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const newBatchImages = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        src: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0
      }));
      setBatchImages(prev => [...prev, ...newBatchImages]);
    }
  };

  const processBatch = async () => {
    for (let i = 0; i < batchImages.length; i++) {
      const imgData = batchImages[i];
      if (imgData.status === 'done') continue;

      setBatchImages(prev => prev.map(img => img.id === imgData.id ? { ...img, status: 'processing', progress: 0 } : img));
      
      try {
        let finalSrc = imgData.src;

        if (batchBgRemoval) {
          setBatchImages(prev => prev.map(img => img.id === imgData.id ? { ...img, progress: 30 } : img));
          const preparedImage = await prepareImageForServer(finalSrc);
          setBatchImages(prev => prev.map(img => img.id === imgData.id ? { ...img, progress: 65 } : img));
          
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
          
          finalSrc = data.imageUrl;
          setBatchImages(prev => prev.map(img => img.id === imgData.id ? { ...img, progress: 100 } : img));
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imageEl = new Image();
        imageEl.crossOrigin = "anonymous";
        imageEl.src = finalSrc;
        await new Promise(resolve => { imageEl.onload = resolve; });

        canvas.width = imageEl.naturalWidth;
        canvas.height = imageEl.naturalHeight;
        if (ctx) {
           if (!batchBgRemoval) {
             ctx.fillStyle = '#ffffff';
             ctx.fillRect(0, 0, canvas.width, canvas.height);
           }
           ctx.filter = getFilterStyle();
           
           ctx.translate(canvas.width / 2, canvas.height / 2);
           ctx.rotate((transform.rotate * Math.PI) / 180);
           ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
           
           const isRotated = transform.rotate % 180 !== 0;
           const effImgW = isRotated ? imageEl.naturalHeight : imageEl.naturalWidth;
           const effImgH = isRotated ? imageEl.naturalWidth : imageEl.naturalHeight;
           const coverScale = Math.min(canvas.width / effImgW, canvas.height / effImgH);
           const scaledW = imageEl.naturalWidth * coverScale;
           const scaledH = imageEl.naturalHeight * coverScale;

           ctx.drawImage(imageEl, -scaledW/2, -scaledH/2, scaledW, scaledH);
        }
        
        

        const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : `image/${exportFormat}`;
        setBatchImages(prev => prev.map(img => img.id === imgData.id ? { ...img, status: 'done', progress: 100, processedDataUrl: canvas.toDataURL(mimeType, 1.0) } : img));
      } catch (err) {
        console.error("Batch processing error on", imgData.name, err);
        setBatchImages(prev => prev.map(img => img.id === imgData.id ? { ...img, status: 'error' } : img));
      }
    }
  };

  // Layers State
  const [texts, setTexts] = React.useState<{id: string, text: string, x: number, y: number, color: string, size: number}[]>([]);
  const [overlays, setOverlays] = React.useState<{id: string, src: string, x: number, y: number, width: number, opacity?: number}[]>([]);

  const [selectedOverlayId, setSelectedOverlayId] = React.useState<string | null>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{
    type: 'drag' | 'resize' | null;
    overlayId: string;
    startX: number;
    startY: number;
    startOverlayX: number;
    startOverlayY: number;
    startOverlayWidth: number;
  }>({
    type: null,
    overlayId: '',
    startX: 0,
    startY: 0,
    startOverlayX: 0,
    startOverlayY: 0,
    startOverlayWidth: 0,
  });

  const handleOverlayStart = (
    e: React.MouseEvent | React.TouchEvent, 
    oId: string, 
    type: 'drag' | 'resize'
  ) => {
    e.stopPropagation();
    setSelectedOverlayId(oId);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const targetOverlay = overlays.find(o => o.id === oId);
    if (!targetOverlay) return;
    
    dragRef.current = {
      type,
      overlayId: oId,
      startX: clientX,
      startY: clientY,
      startOverlayX: targetOverlay.x,
      startOverlayY: targetOverlay.y,
      startOverlayWidth: targetOverlay.width,
    };
    
    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!dragRef.current.type) return;
      
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const dx = currentX - dragRef.current.startX;
      const dy = currentY - dragRef.current.startY;
      
      const container = canvasContainerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      
      const pctDx = (dx / containerRect.width) * 100;
      const pctDy = (dy / containerRect.height) * 100;
      
      setOverlays(prevOverlays => 
        prevOverlays.map(o => {
          if (o.id !== dragRef.current.overlayId) return o;
          
          if (dragRef.current.type === 'drag') {
            return {
              ...o,
              x: Math.max(-50, Math.min(150, dragRef.current.startOverlayX + pctDx)),
              y: Math.max(-50, Math.min(150, dragRef.current.startOverlayY + pctDy)),
            };
          } else if (dragRef.current.type === 'resize') {
            const newWidth = Math.max(5, Math.min(100, dragRef.current.startOverlayWidth + pctDx * 2));
            return {
              ...o,
              width: newWidth,
            };
          }
          return o;
        })
      );
    };
    
    const onEnd = () => {
      if (dragRef.current.type) {
        saveHistoryState();
        dragRef.current.type = null;
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
  };

  // History State
  const [history, setHistory] = React.useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  React.useEffect(() => {
    if (history.length === 0) {
      saveHistoryState();
    }
  }, []);

  const saveHistoryState = () => {
    const state = { adjustments, transform, zoom, dimensions, texts, overlays };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setAdjustments(prevState.adjustments);
      setTransform(prevState.transform);
      setZoom(prevState.zoom);
      setDimensions(prevState.dimensions);
      setTexts(prevState.texts || []);
      setOverlays(prevState.overlays || []);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setAdjustments(nextState.adjustments);
      setTransform(nextState.transform);
      setZoom(nextState.zoom);
      setDimensions(nextState.dimensions);
      setTexts(nextState.texts || []);
      setOverlays(nextState.overlays || []);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const [filmstrip, setFilmstrip] = React.useState([
    { id: 1, label: 'Original', src: activeImage },
    { id: 2, label: 'Mountain View', src: 'https://images.unsplash.com/photo-1464822759023-fea0923eb422?w=400&q=80' },
    { id: 3, label: 'Boat Closeup', src: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=400&q=80' },
    { id: 4, label: 'Forest', src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80' },
  ]);

  const handleReset = () => {
    setAdjustments({ ...defaultAdjustments });
    setTransform({ ...defaultTransform });
    setZoom(100);
    setTexts([]);
    setOverlays([]);
    saveHistoryState();
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (history.length <= 1) {
      setDimensions({
        w: e.currentTarget.naturalWidth,
        h: e.currentTarget.naturalHeight
      });
    }
    if (activeNav === 'crop') {
      handleRatioClick(activeRatio, e.currentTarget);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setActiveImage(url);
      setFilmstrip(prev => [
        { id: Date.now(), label: e.target.files![0].name, src: url },
        ...prev
      ]);
      handleReset();
    }
  };

  const selectFilmstripImage = (src: string) => {
    setActiveImage(src);
    handleReset();
  };

  
  const applyCrop = () => {
    if (!imageRef.current) return;
    
    const naturalWidth = imageRef.current.naturalWidth;
    const naturalHeight = imageRef.current.naturalHeight;
    
    let x = 0;
    let y = 0;
    let w = naturalWidth;
    let h = naturalHeight;
    
    if (crop && crop.width && crop.height) {
      x = (crop.x / 100) * naturalWidth;
      y = (crop.y / 100) * naturalHeight;
      w = (crop.width / 100) * naturalWidth;
      h = (crop.height / 100) * naturalHeight;
    } else if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      const scaleX = naturalWidth / imageRef.current.width;
      const scaleY = naturalHeight / imageRef.current.height;
      x = completedCrop.x * scaleX;
      y = completedCrop.y * scaleY;
      w = completedCrop.width * scaleX;
      h = completedCrop.height * scaleY;
    }
    
    if (w <= 0 || h <= 0) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(
      imageRef.current,
      x,
      y,
      w,
      h,
      0,
      0,
      w,
      h
    );
    
    const base64Image = canvas.toDataURL('image/png');
    setActiveImage(base64Image);
    const roundedW = Math.round(w);
    const roundedH = Math.round(h);
    setDimensions({ w: roundedW, h: roundedH });
    linkedAspectRef.current = roundedW / roundedH;
    setCrop(undefined);
    setCompletedCrop(undefined);
    saveHistoryState();
  };


  React.useEffect(() => {
    if (activeNav === 'crop' && !crop) {
      handleRatioClick(activeRatio);
    }
  }, [activeNav]);

  const handleRatioClick = (ratioId: string, imgEl?: HTMLImageElement) => {
    setActiveRatio(ratioId);
    const img = imgEl || imageRef.current;
    if (!img) return;
    
    let aspect: number | undefined = undefined;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imageAspect = imgW / imgH;

    switch (ratioId) {
      case '1:1': aspect = 1; break;
      case '16:9': aspect = 16 / 9; break;
      case '4:5': aspect = 4 / 5; break;
      case '9:16': aspect = 9 / 16; break;
      case '3:2': aspect = 3 / 2; break;
      case '2:3': aspect = 2 / 3; break;
      case 'original': aspect = imageAspect; break;
      case 'custom':
      case 'free':
        aspect = undefined; break;
    }
    setCropAspect(aspect);

    let newCrop: Crop;
    if (aspect) {
      let widthPercent = 80;
      let heightPercent = 80 * imageAspect / aspect;
      
      if (heightPercent > 80) {
        heightPercent = 80;
        widthPercent = 80 * aspect / imageAspect;
      }
      
      const xPercent = (100 - widthPercent) / 2;
      const yPercent = (100 - heightPercent) / 2;
      
      newCrop = {
        unit: '%',
        width: widthPercent,
        height: heightPercent,
        x: xPercent,
        y: yPercent
      };
    } else {
      newCrop = {
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10
      };
    }
    
    setCrop(newCrop);
    setCompletedCrop(undefined);
  };

  const getFilterStyle = () => {
    let b = 100 + adjustments.brightness + (adjustments.shadows * 0.2) + (adjustments.whites * 0.2) - (adjustments.blacks * 0.2); 
    let c = 100 + adjustments.contrast + (adjustments.highlights * 0.2) + (adjustments.clarity * 0.3) + (adjustments.dehaze * 0.2);
    let s = 100 + adjustments.saturation + (adjustments.vibrance * 0.5) + (adjustments.dehaze * 0.1);
    
    let filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${adjustments.tint}deg)`;
    
    if (adjustments.temperature > 0) {
      filter += ` sepia(${adjustments.temperature}%) hue-rotate(-30deg) saturate(120%)`;
    } else if (adjustments.temperature < 0) {
      filter += ` sepia(${Math.abs(adjustments.temperature)}%) hue-rotate(180deg) saturate(120%)`;
    }

    if (adjustments.sharpen > 0) {
      filter += ` contrast(${100 + (adjustments.sharpen * 0.4)}%)`;
    }
    return filter;
  };

  const handleDownload = async () => {
    if (!imageRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.w;
    canvas.height = dimensions.h;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.filter = getFilterStyle();

    const imgW = imageRef.current.naturalWidth;
    const imgH = imageRef.current.naturalHeight;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotate * Math.PI) / 180);
    ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
    
    // Draw image to fill the custom dimensions on canvas (accounting for rotation)
    const isRotated = transform.rotate % 180 !== 0;
    const drawW = isRotated ? canvas.height : canvas.width;
    const drawH = isRotated ? canvas.width : canvas.height;

    ctx.drawImage(
      imageRef.current,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    );
    ctx.restore();

    // Reset filter for drawing overlays and text on top of the edited image
    ctx.filter = 'none';

    // Draw overlays in high resolution
    for (const o of overlays) {
      const oImg = new Image();
      oImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        oImg.onload = () => resolve();
        oImg.onerror = () => resolve();
        oImg.src = o.src;
      });
      
      const overlayWidth = (o.width / 100) * canvas.width;
      const overlayHeight = oImg.naturalWidth ? (overlayWidth * (oImg.naturalHeight / oImg.naturalWidth)) : overlayWidth;
      const overlayX = (o.x / 100) * canvas.width - overlayWidth / 2;
      const overlayY = (o.y / 100) * canvas.height - overlayHeight / 2;
      
      ctx.save();
      ctx.globalAlpha = o.opacity !== undefined ? o.opacity : 1;
      ctx.drawImage(oImg, overlayX, overlayY, overlayWidth, overlayHeight);
      ctx.restore();
    }

    // Draw texts in high resolution
    for (const t of texts) {
      ctx.save();
      ctx.fillStyle = t.color;
      
      // Calculate font size relative to output canvas
      const displayHeight = imageRef.current ? imageRef.current.clientHeight : 600;
      const scaleFactor = canvas.height / (displayHeight || 600);
      const scaledSize = t.size * scaleFactor;
      
      ctx.font = `bold ${scaledSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4 * scaleFactor;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2 * scaleFactor;
      
      const textX = (t.x / 100) * canvas.width;
      const textY = (t.y / 100) * canvas.height;
      ctx.fillText(t.text, textX, textY);
      ctx.restore();
    }

    const link = document.createElement('a');
    const ext = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
    link.download = `phototoolkit-export-${Date.now()}.${ext}`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    store.addRecentFile({ title: `Exported ${Date.now()}`, img: canvas.toDataURL('image/png', 0.5), type: exportFormat.toUpperCase() });
  };

  const renderSlider = (label: string, key: keyof typeof adjustments, min: number, max: number) => {
    const val = adjustments[key];
    return (
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[14px] text-slate-700 font-medium">{label}</span>
          <div className="min-w-[40px] h-7 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center px-2">
            <span className="text-[13px] text-slate-700 font-medium">{val}</span>
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={val}
          onChange={(e) => setAdjustments({ ...adjustments, [key]: parseInt(e.target.value) })}
          onMouseUp={saveHistoryState}
          onTouchEnd={saveHistoryState}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full shadow-sm"
        />
      </div>
    );
  };

  const navItems = [
    { id: 'crop', label: 'Crop', icon: CropIcon },
    { id: 'adjust', label: 'Adjust', icon: Sliders },
    { id: 'filters', label: 'Filters', icon: Sparkles },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'overlay', label: 'Overlay', icon: ImageIcon },
    { id: 'batch', label: 'Batch', icon: SquareStack },
    { id: 'format', label: 'Format', icon: FileImage },
  ];

  const cropRatios = [
    { id: 'custom', icon: LayoutGrid, label: 'Custom' },
    { id: 'original', icon: ImageIcon, label: 'Original' },
    { id: '1:1', icon: Hash, label: '1:1\nSquare' },
    { id: '16:9', icon: Hash, label: '16:9\nWidescreen' },
    { id: '4:5', icon: Hash, label: '4:5\nPortrait' },
    { id: '9:16', icon: Hash, label: '9:16\nStory' },
    { id: '3:2', icon: Hash, label: '3:2\nPhoto' },
    { id: '2:3', icon: Hash, label: '2:3\nPortrait' },
    { id: 'free', icon: LayoutGrid, label: 'Free\nForm' },
  ];

  // --- SIDEBAR PANELS ---

  const renderCropPanel = () => (
    <>
      <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h2 className="text-[16px] font-bold text-slate-900">Crop & Rotate</h2>
      </div>
      <div className="p-5 space-y-8">
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-slate-900">Crop Ratio</h3>
          <div className="grid grid-cols-3 gap-3">
            {cropRatios.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => handleRatioClick(ratio.id)}
                className={`flex flex-col items-center justify-center gap-2 h-[84px] rounded-2xl border transition-all ${
                  activeRatio === ratio.id 
                    ? 'border-[#6366F1] bg-[#F0F0FE] text-[#6366F1]' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <ratio.icon className="w-6 h-6 stroke-[1.5]" />
                <span className="text-[11px] font-medium text-center leading-tight whitespace-pre-line">{ratio.label}</span>
              </button>
            ))}
          
          </div>
        </div>
        {activeNav === 'crop' && crop && (
          <div className="pt-2">
            <button onClick={applyCrop} className="w-full py-2.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm">
              Apply Crop
            </button>
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-slate-900">Rotate</h3>

          <div className="flex items-center gap-3">
            <input 
              type="range" min="-180" max="180" 
              value={transform.rotate}
              onChange={(e) => setTransform({ ...transform, rotate: parseInt(e.target.value) })}
              onMouseUp={saveHistoryState} onTouchEnd={saveHistoryState}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full shadow-sm" 
            />
            <div className="relative w-16 h-8 rounded-lg border border-slate-200 flex items-center bg-slate-50 focus-within:border-[#6366F1] focus-within:ring-1">
              <input 
                type="text" 
                value={rotateInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setRotateInput(val);
                  const parsed = parseInt(val);
                  if (!isNaN(parsed)) {
                    setTransform(prev => ({ ...prev, rotate: parsed }));
                  }
                }}
                onBlur={() => {
                  saveHistoryState();
                  setRotateInput(transform.rotate.toString());
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="w-full h-full bg-transparent text-center text-[12px] font-medium text-slate-700 focus:outline-none pr-4"
              />
              <span className="absolute right-2 text-[12px] font-medium text-slate-400 pointer-events-none">°</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setTransform({ ...transform, rotate: transform.rotate - 90 }); saveHistoryState(); }} className="flex-1 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors">
              <RotateCw className="w-4.5 h-4.5 -scale-x-100" />
            </button>
            <button onClick={() => { setTransform({ ...transform, rotate: transform.rotate + 90 }); saveHistoryState(); }} className="flex-1 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors">
              <RotateCw className="w-4.5 h-4.5" />
            </button>
            <button onClick={() => { setTransform({ ...transform, flipX: !transform.flipX }); saveHistoryState(); }} className="flex-1 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors">
              <FlipHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderAdjustPanel = () => (
    <>
      <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-[16px] font-bold text-slate-900">Adjustments</h2>
        <button onClick={handleReset} className="text-[12px] font-bold text-[#6366F1] hover:text-indigo-700">Reset All</button>
      </div>
      <div className="p-5 space-y-8">
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-slate-900">Light</h3>
          <div>
            {renderSlider('Brightness', 'brightness', -100, 100)}
            {renderSlider('Contrast', 'contrast', -100, 100)}
            {renderSlider('Highlights', 'highlights', -100, 100)}
            {renderSlider('Shadows', 'shadows', -100, 100)}
            {renderSlider('Whites', 'whites', -100, 100)}
            {renderSlider('Blacks', 'blacks', -100, 100)}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-slate-900">Color</h3>
          <div>
            {renderSlider('Vibrance', 'vibrance', -100, 100)}
            {renderSlider('Saturation', 'saturation', -100, 100)}
            {renderSlider('Temperature', 'temperature', -100, 100)}
            {renderSlider('Tint', 'tint', -100, 100)}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-slate-900">Effects</h3>
          <div>
            {renderSlider('Clarity', 'clarity', -100, 100)}
            {renderSlider('Sharpen', 'sharpen', 0, 100)}
            {renderSlider('Dehaze', 'dehaze', -100, 100)}
            {renderSlider('Vignette', 'vignette', 0, 100)}
          </div>
        </div>
        <div className="h-8"></div>
      </div>
    </>
  );

  const renderFiltersPanel = () => {
    const presets = [
      { name: 'Normal', values: { ...defaultAdjustments } },
      { name: 'Warm', values: { ...defaultAdjustments, temperature: 30, saturation: 20 } },
      { name: 'Cool', values: { ...defaultAdjustments, temperature: -30, contrast: 10 } },
      { name: 'B&W', values: { ...defaultAdjustments, saturation: -100, contrast: 20 } },
      { name: 'Vintage', values: { ...defaultAdjustments, temperature: 40, tint: -20, contrast: -10, vignette: 40 } },
      { name: 'Pop', values: { ...defaultAdjustments, vibrance: 50, contrast: 30, saturation: 20 } },
    ];
    return (
      <>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-bold text-slate-900">Filters</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
           {presets.map(p => (
              <button 
                key={p.name}
                onClick={() => { setAdjustments(p.values); saveHistoryState(); }}
                className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border border-slate-200 hover:border-[#6366F1] hover:bg-[#F0F0FE] hover:text-[#6366F1] transition-all text-slate-600"
              >
                 <Sparkles className="w-7 h-7" />
                 <span className="text-[13px] font-bold">{p.name}</span>
              </button>
           ))}
        </div>
      </>
    );
  };

  const renderTextPanel = () => (
    <>
      <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h2 className="text-[16px] font-bold text-slate-900">Text</h2>
      </div>
      <div className="p-5 space-y-4">
        <button 
          onClick={() => { setTexts([...texts, { id: Date.now().toString(), text: 'New Text', x: 50, y: 50, color: '#ffffff', size: 48 }]); saveHistoryState(); }}
          className="w-full py-3 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Type className="w-4 h-4" /> Add Heading
        </button>
        <div className="space-y-3 mt-6">
           {texts.map(t => (
             <div key={t.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-3 shadow-sm">
                <input 
                  type="text" 
                  value={t.text} 
                  onChange={(e) => setTexts(texts.map(x => x.id === t.id ? { ...x, text: e.target.value } : x))}
                  onBlur={saveHistoryState}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] font-medium outline-none focus:border-[#6366F1]"
                />
                <div className="flex items-center gap-3">
                   <input 
                     type="color" 
                     value={t.color} 
                     onChange={(e) => setTexts(texts.map(x => x.id === t.id ? { ...x, color: e.target.value } : x))}
                     onBlur={saveHistoryState}
                     className="w-8 h-8 rounded cursor-pointer border border-slate-200 p-0 shrink-0"
                   />
                   <input 
                     type="range" min="12" max="200" 
                     value={t.size} 
                     onChange={(e) => setTexts(texts.map(x => x.id === t.id ? { ...x, size: parseInt(e.target.value) } : x))}
                     onMouseUp={saveHistoryState} onTouchEnd={saveHistoryState}
                     className="flex-1 h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                   />
                   <button onClick={() => { setTexts(texts.filter(x => x.id !== t.id)); saveHistoryState(); }} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </>
  );

  
  
  const renderFormatPanel = () => (
    <>
      <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h2 className="text-[16px] font-bold text-slate-900">Convert Format</h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-[13px] text-slate-500">Select the output format for your image download.</p>
        
        <div className="space-y-3">
          <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${exportFormat === 'png' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="format" value="png" checked={exportFormat === 'png'} onChange={() => setExportFormat('png')} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
              <div>
                <p className="text-[13px] font-bold text-slate-700">PNG</p>
                <p className="text-[11px] text-slate-500">Lossless, supports transparency</p>
              </div>
            </div>
          </label>

          <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${exportFormat === 'jpeg' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="format" value="jpeg" checked={exportFormat === 'jpeg'} onChange={() => setExportFormat('jpeg')} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
              <div>
                <p className="text-[13px] font-bold text-slate-700">JPEG / JPG</p>
                <p className="text-[11px] text-slate-500">Compressed, best for photos</p>
              </div>
            </div>
          </label>

          <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${exportFormat === 'webp' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="format" value="webp" checked={exportFormat === 'webp'} onChange={() => setExportFormat('webp')} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
              <div>
                <p className="text-[13px] font-bold text-slate-700">WebP</p>
                <p className="text-[11px] text-slate-500">Modern format, highly compressed</p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    let hasFiles = false;
    batchImages.forEach(img => {
      if (selectedZipIds.has(img.id) && img.processedDataUrl) {
        hasFiles = true;
        const base64Data = img.processedDataUrl.split(',')[1];
        const ext = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
        zip.file(`processed-${img.name.split('.')[0] || img.id}.${ext}`, base64Data, { base64: true });
      }
    });
    if (hasFiles) {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'batch-processed.zip');
    }
  };

  const renderBatchPanel = () => (
    <>
      <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h2 className="text-[16px] font-bold text-slate-900">Batch Processing</h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-[13px] text-slate-500">Apply current filter settings to multiple images at once.</p>
        
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input 
            type="checkbox" 
            checked={batchBgRemoval} 
            onChange={(e) => setBatchBgRemoval(e.target.checked)} 
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-[13px] font-medium text-slate-700">Remove backgrounds (Warning: slow!)</span>
        </label>

        <input type="file" ref={batchFileInputRef} onChange={handleBatchUpload} accept="image/*" multiple className="hidden" />
        <button 
          onClick={() => batchFileInputRef.current?.click()}
          className="w-full py-3 bg-white border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl text-[14px] font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Images
        </button>
        
        <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
           {batchImages.map(img => (
             <div key={img.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center gap-3">
                {img.status === 'done' && (
                  <input 
                    type="checkbox" 
                    checked={selectedZipIds.has(img.id)} 
                    onChange={(e) => {
                      const newSet = new Set(selectedZipIds);
                      if (e.target.checked) newSet.add(img.id);
                      else newSet.delete(img.id);
                      setSelectedZipIds(newSet);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 shrink-0 cursor-pointer"
                  />
                )}
                <img src={img.src} className="w-10 h-10 object-cover rounded-md shadow-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-700 truncate">{img.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      {img.status === 'pending' ? 'Ready' : img.status === 'processing' ? 'Processing...' : img.status === 'error' ? 'Error' : 'Done'}
                    </span>
                    {img.status === 'processing' && (
                      <span className="text-[10px] font-bold text-indigo-600">{img.progress}%</span>
                    )}
                  </div>
                  {img.status === 'processing' && (
                    <div className="w-full h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${img.progress}%` }}></div>
                    </div>
                  )}
                </div>
                {img.status === 'pending' && (
                  <button onClick={() => setBatchImages(prev => prev.filter(x => x.id !== img.id))} className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded shrink-0 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
             </div>
           ))}
           {batchImages.length === 0 && (
              <div className="py-6 flex flex-col items-center justify-center text-slate-400">
                <SquareStack className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-[12px] text-center px-4">No images added. Upload to start batch processing.</p>
              </div>
           )}
        </div>
        
        {batchImages.length > 0 && (
          <div className="pt-2">
            <div className="flex gap-2">
              <button 
                onClick={processBatch}
                disabled={batchImages.every(i => i.status === 'done')}
                className="flex-1 py-3 bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> 
                {batchImages.every(i => i.status === 'done') ? 'All Processed' : 'Process Images'}
              </button>
              {batchImages.some(i => i.status === 'done') && (
                <button
                  onClick={handleDownloadZip}
                  disabled={selectedZipIds.size === 0}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  ZIP Selected ({selectedZipIds.size})
                </button>
              )}
            </div>
            <button 
              onClick={() => setBatchImages([])}
              className="w-full mt-2 py-2 text-slate-500 hover:text-slate-800 text-[12px] font-bold transition-colors"
            >
              Clear List
            </button>
          </div>
        )}
      </div>
    </>
  );

  const renderOverlayPanel = () => {
    const selectedOverlay = overlays.find(o => o.id === selectedOverlayId);
    
    return (
      <>
        <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-bold text-slate-900">Overlays</h2>
        </div>
        <div className="p-5 space-y-6">
          <input type="file" ref={overlayInputRef} onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const url = URL.createObjectURL(e.target.files[0]);
              const newOverlayId = Date.now().toString();
              setOverlays([...overlays, { id: newOverlayId, src: url, x: 50, y: 50, width: 30, opacity: 1 }]);
              setSelectedOverlayId(newOverlayId);
              saveHistoryState();
            }
          }} accept="image/*" className="hidden" />
          <button 
            onClick={() => overlayInputRef.current?.click()}
            className="w-full py-3 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-[14px] font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Upload Overlay
          </button>

          {selectedOverlay ? (
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-indigo-950">Selected Overlay</span>
                <span className="text-[11px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[12px] font-medium text-slate-600">
                  <span>Opacity</span>
                  <span>{Math.round((selectedOverlay.opacity !== undefined ? selectedOverlay.opacity : 1) * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05"
                  value={selectedOverlay.opacity !== undefined ? selectedOverlay.opacity : 1}
                  onChange={(e) => {
                    const newOpacity = parseFloat(e.target.value);
                    setOverlays(overlays.map(o => o.id === selectedOverlayId ? { ...o, opacity: newOpacity } : o));
                  }}
                  onMouseUp={saveHistoryState}
                  onTouchEnd={saveHistoryState}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[12px] font-medium text-slate-600">
                  <span>Size</span>
                  <span>{Math.round(selectedOverlay.width)}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="1"
                  value={selectedOverlay.width}
                  onChange={(e) => {
                    const newW = parseInt(e.target.value);
                    setOverlays(overlays.map(o => o.id === selectedOverlayId ? { ...o, width: newW } : o));
                  }}
                  onMouseUp={saveHistoryState}
                  onTouchEnd={saveHistoryState}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
                />
              </div>

              <div className="pt-2 border-t border-slate-200/50 flex gap-2">
                <button 
                  onClick={() => {
                    setOverlays(overlays.filter(o => o.id !== selectedOverlayId));
                    setSelectedOverlayId(null);
                    saveHistoryState();
                  }}
                  className="flex-1 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button 
                  onClick={() => setSelectedOverlayId(null)}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-[12px] font-semibold transition-colors"
                >
                  Deselect
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
              <p className="text-[12px] leading-relaxed">
                Click on an overlay on the canvas or upload one to edit its transparency, size, or layer order.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-6">
             {overlays.map(o => (
               <div 
                 key={o.id} 
                 onClick={(e) => {
                   e.stopPropagation();
                   setSelectedOverlayId(o.id);
                 }}
                 className={`relative group rounded-xl overflow-hidden border aspect-square bg-slate-50 shadow-sm cursor-pointer transition-all ${selectedOverlayId === o.id ? 'ring-2 ring-[#6366F1] border-transparent' : 'border-slate-200 hover:border-slate-300'}`}
               >
                 <img src={o.src} className="w-full h-full object-contain p-2" />
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setOverlays(overlays.filter(x => x.id !== o.id));
                     if (selectedOverlayId === o.id) setSelectedOverlayId(null);
                     saveHistoryState();
                   }} 
                   className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
             ))}
          </div>
        </div>
      </>
    );
  };

  const renderSidebarContent = () => {
    switch (activeNav) {
      case 'crop': return renderCropPanel();
      case 'adjust': return renderAdjustPanel();
      case 'filters': return renderFiltersPanel();
      case 'text': return renderTextPanel();
      case 'overlay': return renderOverlayPanel();
      case 'batch': return renderBatchPanel();
      case 'format': return renderFormatPanel();
      default: return (
        <div className="p-6 flex flex-col items-center justify-center h-full text-slate-400">
          <Wand2 className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-[14px] font-medium text-center">Select a tool from the menu to see options</p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
      
      {/* HEADER */}
      <header className="h-[64px] bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => store.setView('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">PhotoToolkit</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <button onClick={() => store.setView('dashboard')} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-[15px] font-bold leading-tight">Editor</h1>
              <p className="text-[12px] text-slate-500 font-medium">Professional editing made simple</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button onClick={handleUndo} disabled={historyIndex <= 0} className="w-8 h-8 rounded hover:bg-white hover:shadow-sm flex items-center justify-center text-slate-600 transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="w-8 h-8 rounded hover:bg-white hover:shadow-sm flex items-center justify-center text-slate-600 transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none">
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-500">
            <Cloud className="w-4 h-4" />
            <span>Saved</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleDownload} className="px-4 h-9 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Image
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFTMOST SIDEBAR (Nav) */}
        <div className="w-[96px] bg-white border-r border-slate-200 flex flex-col items-center py-6 shrink-0 overflow-y-auto custom-scrollbar gap-2 z-20 shadow-sm relative">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center justify-center w-[76px] h-[76px] rounded-2xl gap-1.5 transition-colors ${
                  activeNav === item.id 
                    ? 'bg-[#F0F0FE] text-[#6366F1]' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-[22px] h-[22px] ${activeNav === item.id ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </button>
            ))}
        </div>

        {/* SECOND SIDEBAR (Tool Options) */}
        <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
           {renderSidebarContent()}
        </div>

        {/* CENTER WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F4F4F5] relative">
          
          {/* FLOATING TOP TOOLBAR */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl flex items-center px-2 z-20 gap-1 border border-white/20">
             <button onClick={() => setActiveNav('crop')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeNav === 'crop' ? 'bg-[#F0F0FE] text-[#6366F1]' : 'hover:bg-slate-100 text-slate-700'}`}>
               <CropIcon className="w-5 h-5" />
             </button>
             <div className="w-px h-6 bg-slate-200 mx-2"></div>
             <button onClick={() => { setTransform({...transform, rotate: transform.rotate + 90}); saveHistoryState(); }} className="px-3 h-10 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-[14px] font-medium text-slate-700 transition-colors">
               <RotateCw className="w-4.5 h-4.5" /> Rotate
             </button>
             <button onClick={() => { setTransform({...transform, flipX: !transform.flipX}); saveHistoryState(); }} className="px-3 h-10 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-[14px] font-medium text-slate-700 transition-colors">
               <FlipHorizontal className="w-4.5 h-4.5" /> Flip
             </button>
             <div className="w-px h-6 bg-slate-200 mx-2"></div>
             <button onClick={() => setActiveNav('adjust')} className={`px-4 h-10 rounded-xl flex items-center gap-2 text-[14px] font-medium transition-colors ${activeNav === 'adjust' ? 'bg-[#F0F0FE] text-[#6366F1]' : 'hover:bg-slate-100 text-slate-700'}`}>
               <Sliders className="w-4.5 h-4.5" /> Adjust
             </button>
             <button className="px-4 h-10 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-[14px] font-medium text-slate-700 transition-colors">
               <Play className="w-4.5 h-4.5" /> Animate
             </button>
             <div className="w-px h-6 bg-slate-200 mx-2"></div>
             <button className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors">
               <LayoutGrid className="w-5 h-5" />
             </button>
          </div>

          {/* CANVAS CONTENT */}
          <div 
            onMouseDown={() => setSelectedOverlayId(null)}
            onTouchStart={() => setSelectedOverlayId(null)}
            className="flex-1 relative flex items-center justify-center p-8 mt-16 mb-24 overflow-hidden"
          >
             <div 
               style={{
                 transform: `scale(${zoom / 100})`,
                 transition: 'transform 0.2s ease',
                 transformOrigin: 'center center'
               }}
               className="relative flex items-center justify-center max-w-full max-h-full"
             >
                <div 
                  ref={canvasContainerRef}
                  className="relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white/5 rounded-sm overflow-hidden flex items-center justify-center"
                  style={{
                    aspectRatio: dimensions.w > 0 && dimensions.h > 0 ? `${dimensions.w}/${dimensions.h}` : 'auto',
                    maxHeight: '65vh',
                    maxWidth: '100%',
                    height: '65vh'
                  }}
                >
                  {activeNav === 'crop' ? (
                    <ReactCrop 
                     crop={crop} 
                     onChange={c => setCrop(c)}
                     onComplete={c => setCompletedCrop(c)}
                     aspect={cropAspect}
                     style={{ maxWidth: '100%', maxHeight: '100%', display: 'flex' }}
                   >
                     <img 
                       ref={imageRef}
                       src={activeImage} 
                       alt="Editing Canvas" 
                       onLoad={handleImageLoad}
                       crossOrigin="anonymous"
                       style={{
                         maxWidth: '100%',
                         maxHeight: '100%',
                         objectFit: 'contain',
                         filter: getFilterStyle(),
                         transform: `rotate(${transform.rotate}deg) scaleX(${transform.flipX ? -1 : 1}) scaleY(${transform.flipY ? -1 : 1})`,
                         transformOrigin: 'center center'
                       }}
                     />
                   </ReactCrop>
                  ) : (
                    <img 
                       ref={imageRef}
                       src={activeImage} 
                       alt="Editing Canvas" 
                       onLoad={handleImageLoad}
                       crossOrigin="anonymous"
                       style={{
                         width: '100%',
                         height: '100%',
                         objectFit: 'fill',
                         filter: getFilterStyle(),
                         transform: `rotate(${transform.rotate}deg) scaleX(${transform.flipX ? -1 : 1}) scaleY(${transform.flipY ? -1 : 1})`,
                         transformOrigin: 'center center'
                       }}
                     />
                  )}
                   
                   {adjustments.vignette > 0 && (
                     <div className="absolute inset-0 pointer-events-none mix-blend-multiply" style={{
                        background: `radial-gradient(circle, transparent ${100 - adjustments.vignette}%, rgba(0,0,0,${adjustments.vignette/100}) 150%)`
                     }}></div>
                   )}

                   {texts.map(t => (
                      <div key={t.id} className="absolute whitespace-nowrap cursor-move font-bold" 
                           style={{ left: `${t.x}%`, top: `${t.y}%`, color: t.color, fontSize: t.size, transform: 'translate(-50%, -50%)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {t.text}
                      </div>
                   ))}
                   
                   {overlays.map(o => {
                      const isSelected = selectedOverlayId === o.id;
                      return (
                        <div 
                          key={o.id} 
                          className={`absolute group select-none transition-shadow ${isSelected ? 'ring-2 ring-[#6366F1] ring-offset-1' : 'hover:ring-1 hover:ring-[#6366F1]/50'}`} 
                          style={{ 
                            left: `${o.x}%`, 
                            top: `${o.y}%`, 
                            width: `${o.width}%`, 
                            transform: 'translate(-50%, -50%)',
                            opacity: o.opacity !== undefined ? o.opacity : 1,
                            cursor: 'move',
                            zIndex: isSelected ? 50 : undefined
                          }}
                          onMouseDown={(e) => handleOverlayStart(e, o.id, 'drag')}
                          onTouchStart={(e) => handleOverlayStart(e, o.id, 'drag')}
                        >
                          <img 
                            src={o.src} 
                            className="w-full drop-shadow-xl pointer-events-none select-none" 
                            alt="Overlay item"
                          />
                          
                          {isSelected && (
                            <>
                              {/* Close handle top-right */}
                              <button 
                                className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors z-20 pointer-events-auto cursor-pointer"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  setOverlays(overlays.filter(x => x.id !== o.id));
                                  setSelectedOverlayId(null);
                                  saveHistoryState();
                                }}
                                onTouchStart={(e) => {
                                  e.stopPropagation();
                                  setOverlays(overlays.filter(x => x.id !== o.id));
                                  setSelectedOverlayId(null);
                                  saveHistoryState();
                                }}
                              >
                                <X className="w-3 h-3" />
                              </button>

                              {/* Bottom-right resize handle */}
                              <div 
                                className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#6366F1] rounded-full shadow-md z-20 cursor-se-resize flex items-center justify-center hover:scale-110 transition-transform"
                                onMouseDown={(e) => handleOverlayStart(e, o.id, 'resize')}
                                onTouchStart={(e) => handleOverlayStart(e, o.id, 'resize')}
                              >
                                <div className="w-1.5 h-1.5 bg-[#6366F1] rounded-full"></div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                   })}
                </div>
             </div>
          </div>

          {/* BOTTOM ZOOM TOOLBAR */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 flex items-center px-1 z-20">
            <button onClick={() => setZoom(z => Math.max(10, z - 10))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[12px] font-bold text-slate-700 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(300, z + 10))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <button onClick={() => setZoom(100)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          {/* FILMSTRIP (BOTTOM) */}
          <div className="absolute bottom-0 inset-x-0 h-[100px] bg-white border-t border-slate-200 flex items-center gap-3 overflow-x-auto custom-scrollbar px-4 z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileUpload} 
               accept="image/*" 
               className="hidden" 
             />
             <button onClick={() => fileInputRef.current?.click()} className="w-[84px] h-[72px] shrink-0 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all text-slate-500">
               <Plus className="w-5 h-5" />
               <span className="text-[11px] font-bold">Add New</span>
             </button>
             
             {filmstrip.map((img) => (
               <div key={img.id} onClick={() => selectFilmstripImage(img.src)} className={`w-[110px] h-[72px] shrink-0 rounded-xl overflow-hidden relative cursor-pointer group transition-all ${activeImage === img.src ? 'ring-2 ring-[#6366F1] ring-offset-2' : 'hover:opacity-90'}`}>
                 <img src={img.src} alt={img.label} className="w-full h-full object-cover" crossOrigin="anonymous" />
                 <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <MoreHorizontal className="w-3.5 h-3.5 text-slate-700" />
                 </div>
                 <div className="absolute bottom-0 inset-x-0 h-6 bg-white/90 backdrop-blur-sm flex items-center px-2 border-t border-white/50 text-[9.5px] font-bold text-slate-700 shadow-sm">
                   <span className="w-4 text-slate-400">{img.id}</span>
                   <span className="truncate">{img.label}</span>
                 </div>
               </div>
             ))}
          </div>

        </div>

      </div>
    </div>
  );
}
