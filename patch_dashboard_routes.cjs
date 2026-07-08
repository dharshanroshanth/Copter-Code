const fs = require('fs');
let content = fs.readFileSync('./src/pages/Dashboard.tsx', 'utf8');

content = content.replace(
  "    { id: 'bg-remover', name: 'Background Remover', icon: Scissors, color: 'bg-indigo-50 text-indigo-500', route: 'tools' },",
  "    { id: 'bg-remover', name: 'Background Remover', icon: Scissors, color: 'bg-indigo-50 text-indigo-500', route: 'bg-remover' },"
);
content = content.replace(
  "    { id: 'enhancer', name: 'Image Enhancer', icon: Sparkles, color: 'bg-pink-50 text-pink-500', route: 'tools' },",
  "    { id: 'enhancer', name: 'Image Enhancer', icon: Sparkles, color: 'bg-pink-50 text-pink-500', route: 'enhancer' },"
);
content = content.replace(
  "    { id: 'obj-remover', name: 'Object Remover', icon: Eraser, color: 'bg-emerald-50 text-emerald-500', route: 'tools' },",
  "    { id: 'obj-remover', name: 'Object Remover', icon: Eraser, color: 'bg-emerald-50 text-emerald-500', route: 'obj-remover' },"
);
content = content.replace(
  "    { id: 'passport', name: 'Passport Photo', icon: ImageIcon, color: 'bg-sky-50 text-sky-500', route: 'tools' },",
  "    { id: 'passport', name: 'Passport Photo', icon: ImageIcon, color: 'bg-sky-50 text-sky-500', route: 'passport' },"
);
content = content.replace(
  "    { id: 'ocr', name: 'OCR Scanner', icon: FileText, color: 'bg-orange-50 text-orange-500', route: 'tools' },",
  "    { id: 'ocr', name: 'OCR Scanner', icon: FileText, color: 'bg-orange-50 text-orange-500', route: 'ocr' },"
);
// Keep 'crop' pointing to 'tools' because that's our main editor which supports crop,
// or we can point crop to 'tools' and maybe pass activeNav='crop' which we already do!
// Wait, we do: store.setActiveQuickTool(tool.id) on click. Tools.tsx intercepts it and sets activeNav.

fs.writeFileSync('./src/pages/Dashboard.tsx', content);
