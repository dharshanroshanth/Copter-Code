const fs = require('fs');

let content = fs.readFileSync('./src/pages/Dashboard.tsx', 'utf8');

content = content.replace(
  "import {", 
  "import { Scissors, Eraser, Crop as CropIcon } from 'lucide-react';\nimport {"
);

content = content.replace(
  /const quickTools = \[\s+\{ id: 'bg-remover', name: 'Background Remover', icon: Crop, color: 'bg-indigo-50 text-indigo-500', route: 'tools' \},\s+\{ id: 'enhancer', name: 'Image Enhancer', icon: Sparkles, color: 'bg-pink-50 text-pink-500', route: 'tools' \},\s+\{ id: 'obj-remover', name: 'Object Remover', icon: Wand2, color: 'bg-emerald-50 text-emerald-500', route: 'tools' \},\s+\{ id: 'passport', name: 'Passport Photo', icon: ImageIcon, color: 'bg-blue-50 text-blue-500', route: 'tools' \},\s+\{ id: 'ocr', name: 'OCR Scanner', icon: FileText, color: 'bg-orange-50 text-orange-500', route: 'tools' \},\s+\{ id: 'compress', name: 'Compress Image', icon: Minimize2, color: 'bg-purple-50 text-purple-500', route: 'tools' \},\s+\];/s,
  `const quickTools = [
    { id: 'crop', name: 'Crop Image', icon: CropIcon, color: 'bg-blue-50 text-blue-500', route: 'tools' },
    { id: 'bg-remover', name: 'Background Remover', icon: Scissors, color: 'bg-indigo-50 text-indigo-500', route: 'tools' },
    { id: 'enhancer', name: 'Image Enhancer', icon: Sparkles, color: 'bg-pink-50 text-pink-500', route: 'tools' },
    { id: 'obj-remover', name: 'Object Remover', icon: Eraser, color: 'bg-emerald-50 text-emerald-500', route: 'tools' },
    { id: 'passport', name: 'Passport Photo', icon: ImageIcon, color: 'bg-sky-50 text-sky-500', route: 'tools' },
    { id: 'ocr', name: 'OCR Scanner', icon: FileText, color: 'bg-orange-50 text-orange-500', route: 'tools' },
  ];`
);

fs.writeFileSync('./src/pages/Dashboard.tsx', content);
