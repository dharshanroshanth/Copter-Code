#!/bin/bash
sed -i "s/    { name: 'Background Remover', icon: Crop, color: 'bg-indigo-50 text-indigo-500', route: 'tools' },/    { id: 'bg-remover', name: 'Background Remover', icon: Crop, color: 'bg-indigo-50 text-indigo-500', route: 'tools' },/g" ./src/pages/Dashboard.tsx
sed -i "s/    { name: 'Image Enhancer', icon: Sparkles, color: 'bg-pink-50 text-pink-500', route: 'tools' },/    { id: 'enhancer', name: 'Image Enhancer', icon: Sparkles, color: 'bg-pink-50 text-pink-500', route: 'tools' },/g" ./src/pages/Dashboard.tsx
sed -i "s/    { name: 'Object Remover', icon: Wand2, color: 'bg-emerald-50 text-emerald-500', route: 'tools' },/    { id: 'obj-remover', name: 'Object Remover', icon: Wand2, color: 'bg-emerald-50 text-emerald-500', route: 'tools' },/g" ./src/pages/Dashboard.tsx
sed -i "s/    { name: 'Passport Photo', icon: ImageIcon, color: 'bg-blue-50 text-blue-500', route: 'tools' },/    { id: 'passport', name: 'Passport Photo', icon: ImageIcon, color: 'bg-blue-50 text-blue-500', route: 'tools' },/g" ./src/pages/Dashboard.tsx
sed -i "s/    { name: 'OCR Scanner', icon: FileText, color: 'bg-orange-50 text-orange-500', route: 'tools' },/    { id: 'ocr', name: 'OCR Scanner', icon: FileText, color: 'bg-orange-50 text-orange-500', route: 'tools' },/g" ./src/pages/Dashboard.tsx
sed -i "s/    { name: 'Compress Image', icon: Minimize2, color: 'bg-purple-50 text-purple-500', route: 'tools' },/    { id: 'compress', name: 'Compress Image', icon: Minimize2, color: 'bg-purple-50 text-purple-500', route: 'tools' },/g" ./src/pages/Dashboard.tsx

sed -i "s/onClick={() => store.setView(tool.route as any)}/onClick={() => { store.setActiveQuickTool(tool.id); store.setView(tool.route as any); }}/g" ./src/pages/Dashboard.tsx
