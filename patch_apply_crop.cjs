const fs = require('fs');

let content = fs.readFileSync('./src/pages/Tools.tsx', 'utf8');

const applyCropFunc = `
  const applyCrop = () => {
    if (!imageRef.current || !completedCrop || completedCrop.width === 0 || completedCrop.height === 0) return;
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    
    // In our setup, objectFit: 'cover' might change rendered size, but react-image-crop handles it.
    // If we use unit: '%', completedCrop is in pixels of the rendered image.
    // Let's use the natural dimensions for accurate crop.
    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    const base64Image = canvas.toDataURL('image/png');
    setActiveImage(base64Image);
    setDimensions({ w: canvas.width, h: canvas.height });
    setCrop(undefined);
    setCompletedCrop(undefined);
    saveHistoryState();
  };
`;

content = content.replace(
  "const handleRatioClick = (ratioId: string) => {",
  applyCropFunc + "\n  const handleRatioClick = (ratioId: string) => {"
);

// Add the button in the crop panel
const buttonHtml = `
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
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*<div className="space-y-4">\s*<h3 className="text-\[14px\] font-bold text-slate-900">Rotate<\/h3>/m,
  buttonHtml
);

fs.writeFileSync('./src/pages/Tools.tsx', content);
