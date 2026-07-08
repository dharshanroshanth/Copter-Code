/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { store } from '../store';
import {
  Sparkles,
  Search,
  CheckCircle,
  FileImage,
  ArrowRight,
  Maximize2,
  Trash2,
  Download,
  Eye,
  LayoutTemplate,
  Grid,
  Heart,
  Palette,
  Upload
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TemplateItem {
  id: string;
  title: string;
  category: 'youtube' | 'instagram' | 'banner' | 'editorial' | 'marketing';
  dimensions: string;
  aspectRatio: string;
  img: string;
  tagline: string;
  colors: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Pro';
}

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  const templatesList: TemplateItem[] = [
    {
      id: 't1',
      title: 'YouTube Creator Thumbnail',
      category: 'youtube',
      dimensions: '1280 x 720 px',
      aspectRatio: '16:9',
      img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600',
      tagline: 'High contrast display heading with smart subject isolation borders.',
      colors: ['#4F46E5', '#F59E0B', '#EF4444'],
      difficulty: 'Beginner',
    },
    {
      id: 't2',
      title: 'Instagram Travel Square',
      category: 'instagram',
      dimensions: '1080 x 1080 px',
      aspectRatio: '1:1',
      img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600',
      tagline: 'Scenic photo mask paired with sophisticated serif typographic overlays.',
      colors: ['#06B6D4', '#E11D48', '#ffffff'],
      difficulty: 'Intermediate',
    },
    {
      id: 't3',
      title: 'Retro Magazine Cover',
      category: 'editorial',
      dimensions: '1414 x 2000 px',
      aspectRatio: '1:1.41',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      tagline: 'Vintage layout with warm tones, high noise grain, and bold Swiss typography.',
      colors: ['#D97706', '#1E3A8A', '#000000'],
      difficulty: 'Pro',
    },
    {
      id: 't4',
      title: 'LinkedIn Corporate Banner',
      category: 'banner',
      dimensions: '1584 x 396 px',
      aspectRatio: '4:1',
      img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
      tagline: 'Clean corporate grid layout featuring geometric tech abstract patterns.',
      colors: ['#1E40AF', '#3B82F6', '#93C5FD'],
      difficulty: 'Beginner',
    },
    {
      id: 't5',
      title: 'E-commerce Product Showcase',
      category: 'marketing',
      dimensions: '1200 x 1500 px',
      aspectRatio: '4:5',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      tagline: 'Clean studio background framing centered product with warm shadow gradients.',
      colors: ['#10B981', '#EC4899', '#F3F4F6'],
      difficulty: 'Intermediate',
    },
    {
      id: 't6',
      title: 'Minimalist Poster Art',
      category: 'editorial',
      dimensions: '1200 x 1600 px',
      aspectRatio: '3:4',
      img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600',
      tagline: 'Abstract dynamic vector blobs combined with elegant letter-spaced captions.',
      colors: ['#6366F1', '#EC4899', '#F4F4F5'],
      difficulty: 'Intermediate',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'youtube', label: 'YouTube Covers' },
    { id: 'instagram', label: 'Instagram Posts' },
    { id: 'banner', label: 'Campaign Banners' },
    { id: 'editorial', label: 'Editorial Posters' },
    { id: 'marketing', label: 'Marketing Banners' },
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleCustomize = (template: TemplateItem) => {
    // Set the template picture as the active working canvas
    store.setSelectedImage(template.img);
    // Switch view to the tools page
    store.setView('tools');
  };

  // Drag and drop photo onto a card to customize
  const handleDragOverCard = (e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    setDragOverCardId(cardId);
  };

  const handleDragLeaveCard = () => {
    setDragOverCardId(null);
  };

  const handleDropOnCard = (e: React.DragEvent, template: TemplateItem) => {
    e.preventDefault();
    setDragOverCardId(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result as string;
        // Launch custom customized template immediately
        store.setSelectedImage(base64Data);
        store.setView('tools');
      };
    }
  };

  const filteredTemplates = templatesList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12 text-[#ecedee]">
      
      {/* Templates Banner Header */}
      <div className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-br from-indigo-950/40 via-[#121214] to-[#09090b] border border-[#27272a] shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            <LayoutTemplate className="w-3.5 h-3.5 animate-pulse" />
            <span>Designer Presets</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            High-Fidelity Layout Templates
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Select an aspect preset template card to kickstart your project instantly. <br />
            <span className="text-indigo-400 font-bold">Pro Tip:</span> Drag any local photo file from your computer directly onto a template card to customize it in one movement!
          </p>
        </div>
      </div>

      {/* Filter Options & Search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category horizontal track scroll */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/30'
                  : 'bg-zinc-900 border border-[#27272a] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search template presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[#121214] border border-[#27272a] rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder-zinc-600 text-zinc-300"
          />
        </div>
      </div>

      {/* Templates Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isFav = favorites.includes(template.id);
          const isDragActive = dragOverCardId === template.id;

          return (
            <div
              key={template.id}
              onDragOver={(e) => handleDragOverCard(e, template.id)}
              onDragLeave={handleDragLeaveCard}
              onDrop={(e) => handleDropOnCard(e, template)}
              onClick={() => setSelectedTemplate(template)}
              className={`bg-[#121214] border rounded-2xl overflow-hidden group shadow-lg hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between relative ${
                isDragActive ? 'ring-2 ring-indigo-500 scale-[0.98]' : 'border-[#27272a]'
              }`}
            >
              {/* Drag and drop layout helper overlay */}
              {isDragActive && (
                <div className="absolute inset-0 bg-indigo-950/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4 text-white">
                  <Upload className="w-8 h-8 text-indigo-400 animate-bounce mb-2" />
                  <p className="text-xs font-bold">Release to customize template</p>
                  <p className="text-[10px] text-zinc-400">Loads with your dropped photo</p>
                </div>
              )}

              {/* Card visual frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                <img
                  src={template.img}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Badges on card */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <span className="px-2.5 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] font-bold text-zinc-300">
                    {template.dimensions}
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(template.id, e)}
                    className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'text-rose-500 fill-rose-500' : 'text-zinc-400 hover:text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Aspect ratio label hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      Aspect {template.aspectRatio}
                    </span>
                    <span className="text-[10px] bg-indigo-600 px-2 py-1 rounded font-extrabold text-white">
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom copy */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {template.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  {/* Color dots preview */}
                  <div className="flex gap-1.5">
                    {template.colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-white/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomize(template);
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No templates found backup */}
      {filteredTemplates.length === 0 && (
        <div className="bg-[#121214] border border-[#27272a] rounded-2xl p-12 text-center space-y-3 max-w-md mx-auto mt-6">
          <Grid className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-sm font-bold text-white">No template presets found</p>
          <p className="text-xs text-zinc-500">Try searching for other tags or clear current filters.</p>
        </div>
      )}

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedTemplate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTemplate(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed z-50 max-w-xl w-full bg-[#121214] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/9] bg-zinc-950">
                <img
                  src={selectedTemplate.img}
                  alt={selectedTemplate.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-mono font-bold text-indigo-400">
                    {selectedTemplate.dimensions}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider rounded">
                      {selectedTemplate.category}
                    </span>
                    <span className="text-[10px] text-zinc-500">•</span>
                    <span className="text-[10px] text-zinc-400 font-bold font-mono">
                      Aspect Ratio {selectedTemplate.aspectRatio}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">
                    {selectedTemplate.title}
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {selectedTemplate.tagline}
                  </p>
                </div>

                {/* Stats Table */}
                <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-4">
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold">Layers</p>
                    <p className="text-xs font-bold text-white mt-1">4 Editable Layers</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold">Difficulty</p>
                    <p className="text-xs font-bold text-indigo-400 mt-1">{selectedTemplate.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold">Downloads</p>
                    <p className="text-xs font-bold text-white mt-1">1,405 Customizations</p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="flex-1 h-11 bg-zinc-900 border border-[#27272a] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleCustomize(selectedTemplate);
                      setSelectedTemplate(null);
                    }}
                    className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Customize Preset</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
