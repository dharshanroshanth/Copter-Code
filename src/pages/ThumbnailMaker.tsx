/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { store } from '../store';
import {
  ArrowLeft,
  Download,
  Type,
  Image as ImageIcon,
  Shapes,
  Layout,
  ChevronRight,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  Bold,
  Italic,
  RotateCw,
  Sparkles,
  GripVertical,
  Shirt,
  Box,
  BarChart3,
  FileText,
  Grid,
  Table,
  Frame,
  LayoutGrid,
  Upload,
  Search,
  Mic
} from 'lucide-react';

interface CanvasLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string; // Text value, image URL, or shape type
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  color?: string; // hex value
  fontSize?: number; // size in px
  alignment?: 'left' | 'center' | 'right';
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  shadow?: boolean;
  outline?: boolean;
  effect?: 'none' | 'neon' | 'cyber' | 'retro' | 'glitch';
  rotation?: number; // angle in degrees
  visible: boolean;
  width?: number; // percentage width
  fontWeight?: string;
  textTransform?: 'uppercase' | 'none';
  textShadow?: string;
  bgImage?: string;
  maskOpacity?: number;
  maskContrast?: number;
  maskBrightness?: number;
  bgX?: number;
  bgY?: number;
  maskWidth?: number;
  maskHeight?: number;
  svgPath?: string;
  svgViewBox?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fillType?: 'fill' | 'stroke';
  svgContent?: string;
}

interface PrestyledTemplateLayer {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: string;
  textTransform: 'uppercase' | 'none';
  textShadow: string;
}

interface PrestyledTemplate {
  id: string;
  label: string;
  previewText: string;
  layers: PrestyledTemplateLayer[];
}

const PRESTYLED_TEXT_TEMPLATES: PrestyledTemplate[] = [
  {
    id: 'happy-birthday',
    label: 'Happy Birthday',
    previewText: 'HAPPY BIRTHDAY',
    layers: [
      {
        text: 'HAPPY',
        fontFamily: 'Playball',
        fontSize: 48,
        color: '#ff2a85',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '0 0 5px #ff2a85, 0 0 15px #ff2a85'
      },
      {
        text: 'BIRTHDAY',
        fontFamily: 'Montserrat',
        fontSize: 22,
        color: '#00f0ff',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '0 0 5px #00f0ff'
      }
    ]
  },
  {
    id: 'retro-vibes',
    label: 'RETRO VIBES',
    previewText: 'RETRO VIBES',
    layers: [
      {
        text: 'RETRO',
        fontFamily: 'Rubik Mono One',
        fontSize: 34,
        color: '#ff5e00',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0px #1e293b'
      },
      {
        text: 'VIBES',
        fontFamily: 'Rubik Mono One',
        fontSize: 34,
        color: '#ffb700',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0px #1e293b'
      }
    ]
  },
  {
    id: 'golden-hour',
    label: 'GOLDEN HOUR',
    previewText: 'GOLDEN HOUR',
    layers: [
      {
        text: 'GOLDEN HOUR',
        fontFamily: 'Bebas Neue',
        fontSize: 50,
        color: '#ffcc00',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #ff6600, 4px 4px 0px #1e293b'
      }
    ]
  },
  {
    id: 'thank-you',
    label: 'Thank you!',
    previewText: 'Thank you!',
    layers: [
      {
        text: 'Thank you!',
        fontFamily: 'Caveat',
        fontSize: 54,
        color: '#22c55e',
        fontWeight: '700',
        textTransform: 'none',
        textShadow: '1px 1px 2px rgba(0,0,0,0.15)'
      }
    ]
  },
  {
    id: 'tech-now',
    label: 'TECH NOW',
    previewText: 'TECH NOW',
    layers: [
      {
        text: 'TECH NOW',
        fontFamily: 'Orbitron',
        fontSize: 32,
        color: '#38bdf8',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '0 0 8px #38bdf8'
      }
    ]
  },
  {
    id: 'sweet-dream',
    label: 'SWEET DREAM',
    previewText: 'Sweet Dream',
    layers: [
      {
        text: 'Sweet',
        fontFamily: 'Fredoka',
        fontSize: 36,
        color: '#ec4899',
        fontWeight: '700',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'Dream',
        fontFamily: 'Fredoka',
        fontSize: 40,
        color: '#a855f7',
        fontWeight: '700',
        textTransform: 'none',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'wanderlust',
    label: 'WANDERLUST',
    previewText: 'WANDERLUST',
    layers: [
      {
        text: 'WANDERLUST',
        fontFamily: 'Cinzel',
        fontSize: 30,
        color: '#ffffff',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
      },
      {
        text: 'EXPLORE THE WORLD',
        fontFamily: 'Lato',
        fontSize: 12,
        color: '#cbd5e1',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }
    ]
  },
  {
    id: 'glow-up',
    label: 'GLOW UP',
    previewText: 'Glow Up',
    layers: [
      {
        text: 'Glow Up',
        fontFamily: 'Sacramento',
        fontSize: 56,
        color: '#f43f5e',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: '0 0 5px #f43f5e, 0 0 15px #f43f5e'
      }
    ]
  },
  {
    id: 'chill-out',
    label: 'CHILL OUT',
    previewText: 'CHILL OUT',
    layers: [
      {
        text: 'CHILL OUT',
        fontFamily: 'Chewy',
        fontSize: 44,
        color: '#f59e0b',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #78350f'
      }
    ]
  },
  {
    id: 'creative-studio',
    label: 'CREATIVE STUDIO',
    previewText: 'CREATIVE STUDIO',
    layers: [
      {
        text: 'CREATIVE',
        fontFamily: 'Syne',
        fontSize: 32,
        color: '#ffffff',
        fontWeight: '800',
        textTransform: 'uppercase',
        textShadow: 'none'
      },
      {
        text: 'STUDIO',
        fontFamily: 'Syne',
        fontSize: 32,
        color: '#6366f1',
        fontWeight: '800',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'sale-50',
    label: 'SALE 50% OFF',
    previewText: 'SALE 50% OFF',
    layers: [
      {
        text: 'SALE',
        fontFamily: 'Anton',
        fontSize: 46,
        color: '#ef4444',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #ffffff'
      },
      {
        text: '50% OFF',
        fontFamily: 'Barlow Condensed',
        fontSize: 26,
        color: '#ffffff',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }
    ]
  },
  {
    id: 'cozy-morning',
    label: 'COZY MORNING',
    previewText: 'Cozy Morning',
    layers: [
      {
        text: 'Cozy',
        fontFamily: 'Playfair Display',
        fontSize: 36,
        color: '#d97706',
        fontWeight: '700',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'Morning',
        fontFamily: 'Playfair Display',
        fontSize: 36,
        color: '#1e293b',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'next-level',
    label: 'NEXT LEVEL',
    previewText: 'NEXT LEVEL',
    layers: [
      {
        text: 'NEXT LEVEL',
        fontFamily: 'Russo One',
        fontSize: 36,
        color: '#10b981',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '0 0 10px rgba(16,185,129,0.4)'
      }
    ]
  },
  {
    id: 'classy-lady',
    label: 'CLASSY LADY',
    previewText: 'Classy Lady',
    layers: [
      {
        text: 'Classy',
        fontFamily: 'Great Vibes',
        fontSize: 42,
        color: '#db2777',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'LADY',
        fontFamily: 'Prata',
        fontSize: 22,
        color: '#1e293b',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'action-hero',
    label: 'ACTION HERO',
    previewText: 'ACTION HERO',
    layers: [
      {
        text: 'ACTION',
        fontFamily: 'Lilita One',
        fontSize: 42,
        color: '#eab308',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0px #dc2626'
      }
    ]
  },
  {
    id: 'coffee-first',
    label: 'COFFEE FIRST',
    previewText: 'Coffee First',
    layers: [
      {
        text: 'Coffee',
        fontFamily: 'Pacifico',
        fontSize: 38,
        color: '#78350f',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'FIRST',
        fontFamily: 'Quicksand',
        fontSize: 18,
        color: '#b45309',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'dream-big',
    label: 'DREAM BIG',
    previewText: 'DREAM BIG',
    layers: [
      {
        text: 'DREAM',
        fontFamily: 'Permanent Marker',
        fontSize: 36,
        color: '#ffffff',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      },
      {
        text: 'BIG',
        fontFamily: 'Permanent Marker',
        fontSize: 44,
        color: '#ec4899',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }
    ]
  },
  {
    id: 'future-here',
    label: 'FUTURE IS HERE',
    previewText: 'FUTURE IS HERE',
    layers: [
      {
        text: 'FUTURE',
        fontFamily: 'Outfit',
        fontSize: 38,
        color: '#06b6d4',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '0 0 8px rgba(6,180,212,0.4)'
      }
    ]
  },
  {
    id: 'office-hours',
    label: 'OFFICE HOURS',
    previewText: 'OFFICE HOURS',
    layers: [
      {
        text: 'OFFICE',
        fontFamily: 'DM Sans',
        fontSize: 30,
        color: '#0f172a',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: 'none'
      },
      {
        text: 'HOURS',
        fontFamily: 'DM Sans',
        fontSize: 30,
        color: '#64748b',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'sports-night',
    label: 'SPORTS NIGHT',
    previewText: 'SPORTS NIGHT',
    layers: [
      {
        text: 'SPORTS',
        fontFamily: 'Kanit',
        fontSize: 40,
        color: '#e11d48',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #1e293b'
      },
      {
        text: 'NIGHT',
        fontFamily: 'Kanit',
        fontSize: 32,
        color: '#ffffff',
        fontWeight: '800',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #1e293b'
      }
    ]
  },
  {
    id: 'wild-west',
    label: 'Wild West',
    previewText: 'WILD WEST',
    layers: [
      {
        text: 'WILD WEST',
        fontFamily: 'Rye',
        fontSize: 40,
        color: '#d97706',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #451a03'
      }
    ]
  },
  {
    id: 'danger-zone',
    label: 'DANGER ZONE',
    previewText: 'DANGER ZONE',
    layers: [
      {
        text: 'DANGER',
        fontFamily: 'VT323',
        fontSize: 50,
        color: '#ef4444',
        fontWeight: '450',
        textTransform: 'uppercase',
        textShadow: '0 0 10px #ef4444'
      },
      {
        text: 'ZONE',
        fontFamily: 'VT323',
        fontSize: 50,
        color: '#ef4444',
        fontWeight: '450',
        textTransform: 'uppercase',
        textShadow: '0 0 10px #ef4444'
      }
    ]
  },
  {
    id: 'ocean-breeze',
    label: 'Ocean Breeze',
    previewText: 'Ocean Breeze',
    layers: [
      {
        text: 'Ocean',
        fontFamily: 'Lobster',
        fontSize: 46,
        color: '#06b6d4',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      },
      {
        text: 'Breeze',
        fontFamily: 'Comfortaa',
        fontSize: 22,
        color: '#0891b2',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'error-404',
    label: 'ERROR 404',
    previewText: 'ERROR 404',
    layers: [
      {
        text: 'ERROR',
        fontFamily: 'Share Tech Mono',
        fontSize: 40,
        color: '#ec4899',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #06b6d4, -2px -2px 0px #eab308'
      },
      {
        text: '404',
        fontFamily: 'Share Tech Mono',
        fontSize: 56,
        color: '#06b6d4',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #ec4899, -2px -2px 0px #eab308'
      }
    ]
  },
  {
    id: 'wedding-day',
    label: 'Wedding Day',
    previewText: 'Save the Date',
    layers: [
      {
        text: 'Save the Date',
        fontFamily: 'Pinyon Script',
        fontSize: 52,
        color: '#be185d',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'FOR OUR WEDDING',
        fontFamily: 'Cormorant Garamond',
        fontSize: 14,
        color: '#475569',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'comic-pop',
    label: 'Comic Pop',
    previewText: 'POW!',
    layers: [
      {
        text: 'POW!',
        fontFamily: 'Bangers',
        fontSize: 60,
        color: '#facc15',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0px #ef4444, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000'
      }
    ]
  },
  {
    id: 'midnight-city',
    label: 'Midnight City',
    previewText: 'MIDNIGHT',
    layers: [
      {
        text: 'MIDNIGHT',
        fontFamily: 'Righteous',
        fontSize: 42,
        color: '#a855f7',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '0 0 8px #a855f7'
      },
      {
        text: 'CITY',
        fontFamily: 'Righteous',
        fontSize: 42,
        color: '#ffffff',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '0 0 8px #ffffff'
      }
    ]
  },
  {
    id: 'summer-camp',
    label: 'Summer Camp',
    previewText: 'SUMMER CAMP',
    layers: [
      {
        text: 'SUMMER',
        fontFamily: 'Luckiest Guy',
        fontSize: 38,
        color: '#f97316',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #1e3a8a, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000'
      },
      {
        text: 'CAMP',
        fontFamily: 'Luckiest Guy',
        fontSize: 38,
        color: '#3b82f6',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #7c2d12, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000'
      }
    ]
  },
  {
    id: 'memories',
    label: 'Memories',
    previewText: 'MEMORIES',
    layers: [
      {
        text: 'MEMORIES',
        fontFamily: 'Cinzel Decorative',
        fontSize: 38,
        color: '#ffffff',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
      }
    ]
  },
  {
    id: 'winter-wonder',
    label: 'Winter Wonderland',
    previewText: 'Winter Wonderland',
    layers: [
      {
        text: 'Winter',
        fontFamily: 'Architects Daughter',
        fontSize: 38,
        color: '#38bdf8',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'Wonderland',
        fontFamily: 'Architects Daughter',
        fontSize: 38,
        color: '#ffffff',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
      }
    ]
  },
  {
    id: 'next-gen',
    label: 'NEXT GEN',
    previewText: 'NEXT GEN',
    layers: [
      {
        text: 'NEXT GEN',
        fontFamily: 'Allerta Stencil',
        fontSize: 38,
        color: '#84cc16',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '0 0 10px #84cc16, 0 0 20px rgba(132,204,22,0.5)'
      }
    ]
  },
  {
    id: 'vintage-romance',
    label: 'Vintage Romance',
    previewText: 'Vintage Romance',
    layers: [
      {
        text: 'Romance',
        fontFamily: 'Herr Von Muellerhoff',
        fontSize: 62,
        color: '#ec4899',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'VINTAGE VIBES',
        fontFamily: 'Playfair Display',
        fontSize: 14,
        color: '#475569',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'space-explorers',
    label: 'SPACE EXPLORERS',
    previewText: 'SPACE EXPLORERS',
    layers: [
      {
        text: 'SPACE',
        fontFamily: 'Syncopate',
        fontSize: 26,
        color: '#ffffff',
        fontWeight: '700',
        textTransform: 'uppercase',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      },
      {
        text: 'EXPLORERS',
        fontFamily: 'Syncopate',
        fontSize: 22,
        color: '#a855f7',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }
    ]
  },
  {
    id: 'sweet-candy',
    label: 'Sweet Candy',
    previewText: 'SWEET CANDY',
    layers: [
      {
        text: 'Sweet',
        fontFamily: 'Cherry Swash',
        fontSize: 38,
        color: '#f43f5e',
        fontWeight: '700',
        textTransform: 'none',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      },
      {
        text: 'Candy',
        fontFamily: 'Cherry Swash',
        fontSize: 38,
        color: '#e11d48',
        fontWeight: '700',
        textTransform: 'none',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
      }
    ]
  },
  {
    id: 'urban-legend',
    label: 'Urban Legend',
    previewText: 'URBAN LEGEND',
    layers: [
      {
        text: 'URBAN',
        fontFamily: 'Creepster',
        fontSize: 44,
        color: '#22c55e',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0px #022c22'
      },
      {
        text: 'LEGEND',
        fontFamily: 'Creepster',
        fontSize: 44,
        color: '#15803d',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0px #022c22'
      }
    ]
  },
  {
    id: 'grand-premiere',
    label: 'Grand Premiere',
    previewText: 'GRAND PREMIERE',
    layers: [
      {
        text: 'GRAND',
        fontFamily: 'Abril Fatface',
        fontSize: 40,
        color: '#facc15',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '2px 2px 0px #000'
      },
      {
        text: 'PREMIERE',
        fontFamily: 'Montserrat',
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '800',
        textTransform: 'uppercase',
        textShadow: '1px 1px 2px #000'
      }
    ]
  },
  {
    id: 'retro-future',
    label: 'Retro Future',
    previewText: 'RETRO FUTURE',
    layers: [
      {
        text: 'RETRO',
        fontFamily: 'Audiowide',
        fontSize: 36,
        color: '#ec4899',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '0 0 10px #ec4899'
      },
      {
        text: 'FUTURE',
        fontFamily: 'Audiowide',
        fontSize: 36,
        color: '#06b6d4',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '0 0 10px #06b6d4'
      }
    ]
  },
  {
    id: 'baking-day',
    label: 'Baking Day',
    previewText: 'Baking Day',
    layers: [
      {
        text: 'Baking',
        fontFamily: 'Cookie',
        fontSize: 50,
        color: '#ea580c',
        fontWeight: '400',
        textTransform: 'none',
        textShadow: 'none'
      },
      {
        text: 'WITH LOVE',
        fontFamily: 'Nunito',
        fontSize: 14,
        color: '#c2410c',
        fontWeight: '800',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  },
  {
    id: 'rock-roll',
    label: 'Rock & Roll',
    previewText: 'ROCK & ROLL',
    layers: [
      {
        text: 'ROCK & ROLL',
        fontFamily: 'Metal Mania',
        fontSize: 42,
        color: '#ef4444',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: '3px 3px 0px #000'
      }
    ]
  },
  {
    id: 'elegant-gold',
    label: 'Elegant Gold',
    previewText: 'ELEGANT GOLD',
    layers: [
      {
        text: 'ELEGANT',
        fontFamily: 'Italiana',
        fontSize: 38,
        color: '#d97706',
        fontWeight: '400',
        textTransform: 'uppercase',
        textShadow: 'none'
      },
      {
        text: 'CREATIONS',
        fontFamily: 'Montserrat',
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        textShadow: 'none'
      }
    ]
  }
];

const SHAPES_LIBRARY = [
  {
    category: 'Lines & Arrows',
    shapes: [
      { id: 'line', name: 'Straight Line', viewBox: '0 0 100 100', path: 'M 10,50 L 90,50', fillType: 'stroke', strokeWidth: 6 },
      { id: 'dash-line', name: 'Dashed Line', viewBox: '0 0 100 100', path: 'M 10,50 L 90,50', fillType: 'stroke', strokeWidth: 6, strokeDasharray: '10,8' },
      { id: 'right-arrow', name: 'Right Arrow', viewBox: '0 0 100 100', path: 'M 10,50 L 90,50 M 70,25 L 90,50 L 70,75', fillType: 'stroke', strokeWidth: 6 },
      { id: 'double-arrow', name: 'Double Arrow', viewBox: '0 0 100 100', path: 'M 15,50 L 85,50 M 30,30 L 15,50 L 30,70 M 70,30 L 85,50 L 70,70', fillType: 'stroke', strokeWidth: 6 },
      { id: 'curved-arrow', name: 'Curved Arrow', viewBox: '0 0 100 100', path: 'M 15,80 Q 50,20 80,45 M 65,35 L 80,45 L 75,60', fillType: 'stroke', strokeWidth: 6 }
    ]
  },
  {
    category: 'Basic Shapes',
    shapes: [
      { id: 'rect', name: 'Square', viewBox: '0 0 100 100', path: 'M 5,5 H 95 V 95 H 5 Z', fillType: 'fill' },
      { id: 'circle', name: 'Circle', viewBox: '0 0 100 100', path: 'M 50,50 m -45,0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0', fillType: 'fill' },
      { id: 'rounded-rect', name: 'Rounded Rect', viewBox: '0 0 100 100', path: 'M 20,10 H 80 A 10,10 0 0 1 90,20 V 80 A 10,10 0 0 1 80,90 H 20 A 10,10 0 0 1 10,80 V 20 A 10,10 0 0 1 20,10 Z', fillType: 'fill' },
      { id: 'oval', name: 'Oval', viewBox: '0 0 100 100', path: 'M 50,15 A 45,35 0 1,0 50,85 A 45,35 0 1,0 50,15 Z', fillType: 'fill' },
      { id: 'triangle', name: 'Triangle', viewBox: '0 0 100 100', path: 'M 50,5 L 95,95 H 5 Z', fillType: 'fill' }
    ]
  },
  {
    category: 'Polygons & Stars',
    shapes: [
      { id: 'pentagon', name: 'Pentagon', viewBox: '0 0 100 100', path: 'M 50,5 L 95,38 L 78,92 H 22 L 5,38 Z', fillType: 'fill' },
      { id: 'hexagon', name: 'Hexagon', viewBox: '0 0 100 100', path: 'M 50,5 L 90,28 V 72 L 50,95 L 10,72 V 28 Z', fillType: 'fill' },
      { id: 'octagon', name: 'Octagon', viewBox: '0 0 100 100', path: 'M 30,5 H 70 L 95,30 V 70 L 70,95 H 30 L 5,70 V 30 Z', fillType: 'fill' },
      { id: 'star-4', name: '4-Point Star', viewBox: '0 0 100 100', path: 'M 50,5 L 62,38 L 95,50 L 62,62 L 50,95 L 38,62 L 5,50 L 38,38 Z', fillType: 'fill' },
      { id: 'star-5', name: '5-Point Star', viewBox: '0 0 100 100', path: 'M 50,5 L 64,36 H 98 L 70,57 L 81,91 L 50,70 L 19,91 L 30,57 L 2,36 H 36 Z', fillType: 'fill' },
      { id: 'sparkle', name: 'Sparkle', viewBox: '0 0 100 100', path: 'M 50,5 Q 50,50 95,50 Q 50,50 50,95 Q 50,50 5,50 Q 50,50 50,5 Z', fillType: 'fill' }
    ]
  },
  {
    category: 'Abstract & Badges',
    shapes: [
      { id: 'banner', name: 'Banner Ribbon', viewBox: '0 0 100 100', path: 'M 5,15 H 95 L 85,50 L 95,85 H 5 L 15,50 Z', fillType: 'fill' },
      { id: 'bubble', name: 'Speech Bubble', viewBox: '0 0 100 100', path: 'M 10,15 H 90 V 70 H 45 L 20,90 V 70 H 10 Z', fillType: 'fill' },
      { id: 'heart', name: 'Heart', viewBox: '0 0 100 100', path: 'M 50,90 L 44,84 C 22,64 8,50 8,34 C 8,21 18,10 31,10 C 38,10 45,13 50,19 C 55,13 62,10 69,10 C 82,10 92,21 92,34 C 92,50 78,64 56,84 Z', fillType: 'fill' },
      { id: 'shield', name: 'Shield', viewBox: '0 0 100 100', path: 'M 50,5 C 75,5 90,15 90,45 C 90,75 50,95 50,95 C 50,95 10,75 10,45 C 10,15 25,5 50,5 Z', fillType: 'fill' }
    ]
  }
];

const FONT_CATEGORIES = [
  {
    label: '-- DISPLAY FONTS --',
    fonts: [
      { name: 'Space Grotesk', value: 'Space Grotesk' },
      { name: 'Impact', value: 'Impact' },
      { name: 'Anton', value: 'Anton' },
      { name: 'Bebas Neue', value: 'Bebas Neue' },
      { name: 'Oswald', value: 'Oswald' },
      { name: 'Syncopate', value: 'Syncopate' },
      { name: 'Righteous', value: 'Righteous' },
      { name: 'Titan One', value: 'Titan One' },
      { name: 'Rubik Mono One', value: 'Rubik Mono One' },
      { name: 'Alfa Slab One', value: 'Alfa Slab One' }
    ]
  },
  {
    label: '-- HANDWRITING FONTS --',
    fonts: [
      { name: 'Pacifico', value: 'Pacifico' },
      { name: 'Caveat', value: 'Caveat' },
      { name: 'Satisfy', value: 'Satisfy' },
      { name: 'Dancing Script', value: 'Dancing Script' },
      { name: 'Permanent Marker', value: 'Permanent Marker' },
      { name: 'Kaushan Script', value: 'Kaushan Script' },
      { name: 'Yellowtail', value: 'Yellowtail' },
      { name: 'Great Vibes', value: 'Great Vibes' },
      { name: 'Alex Brush', value: 'Alex Brush' }
    ]
  },
  {
    label: '-- MODERN SANS FONTS --',
    fonts: [
      { name: 'Poppins', value: 'Poppins' },
      { name: 'Inter', value: 'Inter' },
      { name: 'Montserrat', value: 'Montserrat' },
      { name: 'Roboto', value: 'Roboto' },
      { name: 'Lato', value: 'Lato' },
      { name: 'Raleway', value: 'Raleway' },
      { name: 'Ubuntu', value: 'Ubuntu' },
      { name: 'Open Sans', value: 'Open Sans' },
      { name: 'Kanit', value: 'Kanit' },
      { name: 'Quicksand', value: 'Quicksand' }
    ]
  },
  {
    label: '-- SERIF FONTS --',
    fonts: [
      { name: 'Playfair Display', value: 'Playfair Display' },
      { name: 'Cinzel', value: 'Cinzel' },
      { name: 'Merriweather', value: 'Merriweather' },
      { name: 'Lora', value: 'Lora' },
      { name: 'Prata', value: 'Prata' },
      { name: 'Cormorant Garamond', value: 'Cormorant Garamond' },
      { name: 'Bodoni Moda', value: 'Bodoni Moda' }
    ]
  }
];

export default function ThumbnailMaker() {
  const [title, setTitle] = useState('Untitled Thumbnail');
  const [bgColor, setBgColor] = useState('#0f172a'); // slate-900 default
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'design-vault'>('templates');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAssetSubCategory, setActiveAssetSubCategory] = useState<string | null>(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');

  // Stacking reorder states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Figma-style Mask Positioning Modal states
  const [isEditingMask, setIsEditingMask] = useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const isDraggingMaskRef = React.useRef(false);

  const handleMaskDragStart = (e: React.MouseEvent) => {
    const active = layers.find(l => l.id === selectedLayerId);
    if (!active) return;
    isDraggingMaskRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMaskDragMove = (e: React.MouseEvent) => {
    const active = layers.find(l => l.id === selectedLayerId);
    if (!isDraggingMaskRef.current || !active || !selectedLayerId) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    if (dx === 0 && dy === 0) return;

    // Map screen mouse movement directly to SVG coordinate viewBox (800x500 base)
    const svgElement = document.querySelector('#modal-svg-viewport');
    let scaleX = 1;
    let scaleY = 1;
    if (svgElement) {
      const rect = svgElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        scaleX = 800 / rect.width;
        scaleY = 500 / rect.height;
      }
    }

    const svgDx = dx * scaleX;
    const svgDy = dy * scaleY;

    const currentBgX = active.bgX ?? 0;
    const currentBgY = active.bgY ?? 0;
    const w = active.maskWidth ?? 800;
    const h = active.maskHeight ?? 500;

    // Clamp coordinates so image guide covers the text boundary coordinates (150-650 X, 150-350 Y)
    const newBgX = Math.max(650 - w, Math.min(150, currentBgX + svgDx));
    const newBgY = Math.max(350 - h, Math.min(150, currentBgY + svgDy));

    setLayers(prev => prev.map(l => l.id === selectedLayerId ? {
      ...l,
      bgX: newBgX,
      bgY: newBgY
    } : l));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMaskDragEnd = () => {
    isDraggingMaskRef.current = false;
  };

  const handleZoomChange = (scaleValue: number) => {
    const active = layers.find(l => l.id === selectedLayerId);
    if (!active || !selectedLayerId) return;

    const oldW = active.maskWidth ?? 800;
    const oldH = active.maskHeight ?? 500;
    const currentBgX = active.bgX ?? 0;
    const currentBgY = active.bgY ?? 0;

    const scale = scaleValue / 100;
    const newW = Math.round(800 * scale);
    const newH = Math.round(500 * scale);

    // Zoom smoothly toward the center point (400, 250) of the viewport
    const newBgX = Math.round(400 - ((400 - currentBgX) / oldW) * newW);
    const newBgY = Math.round(250 - ((250 - currentBgY) / oldH) * newH);

    // Clamp coords under the new zoom bounds
    const clampedBgX = Math.max(650 - newW, Math.min(150, newBgX));
    const clampedBgY = Math.max(350 - newH, Math.min(150, newBgY));

    setLayers(prev => prev.map(l => l.id === selectedLayerId ? {
      ...l,
      maskWidth: newW,
      maskHeight: newH,
      bgX: clampedBgX,
      bgY: clampedBgY
    } : l));
  };

  // Dynamic Google Fonts Loader
  React.useEffect(() => {
    const uniqueFonts = new Set<string>();

    // 1. Add all fonts from the catalog (excluding 'Impact' which is web-safe system font)
    FONT_CATEGORIES.forEach(category => {
      category.fonts.forEach(font => {
        if (font.value !== 'Impact') {
          uniqueFonts.add(font.value);
        }
      });
    });

    // 2. Add any fonts from PRESTYLED_TEXT_TEMPLATES that are not generic system keywords
    PRESTYLED_TEXT_TEMPLATES.forEach(temp => {
      temp.layers.forEach(layer => {
        if (layer.fontFamily && !['sans', 'serif', 'mono', 'display', 'cursive', 'Impact'].includes(layer.fontFamily)) {
          uniqueFonts.add(layer.fontFamily);
        }
      });
    });

    if (uniqueFonts.size === 0) return;

    const fontList = Array.from(uniqueFonts);
    const familiesParam = fontList.map(font => {
      const formatted = font.replace(/ /g, '+');
      return `family=${formatted}:wght@400;700;900`;
    }).join('&');

    const linkId = 'google-fonts-prestyled';
    let linkEl = document.getElementById(linkId) as HTMLLinkElement;
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = linkId;
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }
    linkEl.href = `https://fonts.googleapis.com/css2?${familiesParam}&display=swap`;
  }, []);

  const reorderLayers = (startIndex: number, endIndex: number) => {
    const result = Array.from(layers);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLayers(result);
  };

  // Default layers on load
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'text-1',
      type: 'text',
      content: 'HOW TO CREATE',
      x: 15,
      y: 22,
      color: '#ffffff',
      fontSize: 32,
      alignment: 'left',
      fontFamily: 'Space Grotesk',
      bold: true,
      italic: false,
      shadow: true,
      outline: false,
      effect: 'none',
      rotation: 0,
      visible: true
    },
    {
      id: 'text-2',
      type: 'text',
      content: 'VIRAL THUMBNAILS',
      x: 15,
      y: 38,
      color: '#eab308', // yellow-500
      fontSize: 42,
      alignment: 'left',
      fontFamily: 'Space Grotesk',
      bold: true,
      italic: false,
      shadow: false,
      outline: false,
      effect: 'retro',
      rotation: -3,
      visible: true
    },
    {
      id: 'img-sticker',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      x: 65,
      y: 20,
      rotation: 5,
      visible: true,
      width: 25
    }
  ]);

  // Drag operations state
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'move' | 'resize' | 'rotate' | null>(null);
  const [dragStart, setDragStart] = useState({
    clientX: 0,
    clientY: 0,
    layerX: 0,
    layerY: 0,
    layerWidth: 0,
    layerFontSize: 0,
    layerRotation: 0,
    corner: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    showToast('Exporting high-resolution 1920x1080 YouTube Thumbnail...');
    setTimeout(() => {
      showToast('Thumbnail exported successfully! Checked and downloaded.');
    }, 1500);
  };

  const loadTemplate = (preset: 'money' | 'productivity' | 'vlog') => {
    if (preset === 'money') {
      setBgColor('#020617'); // dark blue-black
      setLayers([
        {
          id: 'money-txt-1',
          type: 'text',
          content: 'HOW TO MAKE',
          x: 10,
          y: 26,
          color: '#ffffff',
          fontSize: 32,
          alignment: 'left',
          fontFamily: 'Space Grotesk',
          bold: true,
          italic: false,
          shadow: true,
          rotation: 0,
          visible: true
        },
        {
          id: 'money-txt-2',
          type: 'text',
          content: 'MONEY ONLINE',
          x: 10,
          y: 44,
          color: '#facc15', // yellow-400
          fontSize: 42,
          alignment: 'left',
          fontFamily: 'Space Grotesk',
          bold: true,
          italic: false,
          effect: 'retro',
          rotation: -2,
          visible: true
        },
        {
          id: 'money-img-1',
          type: 'image',
          content: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          x: 65,
          y: 20,
          rotation: 4,
          visible: true,
          width: 28
        }
      ]);
      setTitle('How to Make Money Online - Thumbnail');
    } else if (preset === 'productivity') {
      setBgColor('#1e1b4b'); // indigo-950
      setLayers([
        {
          id: 'prod-txt-1',
          type: 'text',
          content: 'TOP 5 TIPS',
          x: 50,
          y: 20,
          color: '#ffffff',
          fontSize: 38,
          alignment: 'center',
          fontFamily: 'Space Grotesk',
          bold: true,
          rotation: 0,
          visible: true
        },
        {
          id: 'prod-txt-2',
          type: 'text',
          content: 'PRODUCTIVITY HACKS',
          x: 50,
          y: 38,
          color: '#a855f7', // purple-500
          fontSize: 30,
          alignment: 'center',
          fontFamily: 'Inter',
          bold: true,
          effect: 'neon',
          rotation: 2,
          visible: true
        },
        {
          id: 'prod-img-1',
          type: 'shape',
          content: 'circle',
          x: 45,
          y: 60,
          color: '#3b82f6',
          rotation: 0,
          visible: true,
          width: 10
        }
      ]);
      setTitle('Productivity Hacks - Thumbnail');
    } else if (preset === 'vlog') {
      setBgColor('#18181b'); // zinc-900
      setLayers([
        {
          id: 'vlog-txt-1',
          type: 'text',
          content: 'BEST CAMERA FOR',
          x: 50,
          y: 18,
          color: '#facc15', // yellow-400
          fontSize: 30,
          alignment: 'center',
          fontFamily: 'Space Grotesk',
          bold: true,
          rotation: 0,
          visible: true
        },
        {
          id: 'vlog-txt-2',
          type: 'text',
          content: 'VLOGGING IN 2026',
          x: 50,
          y: 34,
          color: '#ffffff',
          fontSize: 34,
          alignment: 'center',
          fontFamily: 'Space Grotesk',
          bold: true,
          shadow: true,
          rotation: -4,
          visible: true
        },
        {
          id: 'vlog-img-1',
          type: 'image',
          content: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150',
          x: 38,
          y: 52,
          rotation: 0,
          visible: true,
          width: 24
        }
      ]);
      setTitle('Best Vlogging Camera - Thumbnail');
    }
    setSelectedLayerId(null);
    showToast('Loaded preset template!');
  };

  const addTextLayer = (
    content: string,
    fontSize = 24,
    color = '#ffffff',
    fontFamily: CanvasLayer['fontFamily'] = 'sans',
    bold = true,
    italic = false,
    effect: CanvasLayer['effect'] = 'none',
    shadow = false,
    outline = false
  ) => {
    const newTextLayer: CanvasLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      content,
      x: 30,
      y: 35,
      color,
      fontSize,
      alignment: 'center',
      fontFamily,
      bold,
      italic,
      shadow,
      outline,
      effect,
      rotation: 0,
      visible: true
    };
    setLayers(prev => [...prev, newTextLayer]);
    setSelectedLayerId(newTextLayer.id);
  };

  const addPrestyledTextTemplate = (template: PrestyledTemplate) => {
    const timeBase = Date.now();
    const newLayers: CanvasLayer[] = template.layers.map((layer, index) => {
      const yOffset = template.layers.length === 1 ? 42 : (index === 0 ? 32 : 48);
      return {
        id: `text-${timeBase}-${index}`,
        type: 'text',
        content: layer.text,
        x: 32,
        y: yOffset,
        color: layer.color,
        fontSize: layer.fontSize,
        alignment: 'center',
        fontFamily: layer.fontFamily,
        bold: layer.fontWeight === 'bold' || layer.fontWeight === '900' || layer.fontWeight === '800' || layer.fontWeight === '700',
        fontWeight: layer.fontWeight,
        textTransform: layer.textTransform,
        textShadow: layer.textShadow,
        visible: true,
        effect: 'none',
        rotation: 0
      };
    });

    setLayers(prev => [...prev, ...newLayers]);
    if (newLayers.length > 0) {
      setSelectedLayerId(newLayers[newLayers.length - 1].id);
    }
    showToast(`Loaded ${template.label} template!`);
  };

  const addStickerLayer = (url: string) => {
    const newSticker: CanvasLayer = {
      id: `img-${Date.now()}`,
      type: 'image',
      content: url,
      x: 40,
      y: 35,
      rotation: 0,
      visible: true,
      width: 20
    };
    setLayers(prev => [...prev, newSticker]);
    setSelectedLayerId(newSticker.id);
  };

  const addShapeLayer = (
    shape: string,
    svgPath?: string,
    svgViewBox?: string,
    fillType?: 'fill' | 'stroke',
    strokeWidth?: number,
    strokeDasharray?: string
  ) => {
    const newShape: CanvasLayer = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      content: shape,
      x: 45,
      y: 45,
      color: '#3b82f6', // blue-500
      rotation: 0,
      visible: true,
      width: 15,
      svgPath,
      svgViewBox,
      fillType,
      strokeWidth,
      strokeDasharray
    };
    setLayers(prev => [...prev, newShape]);
    setSelectedLayerId(newShape.id);
  };

  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const toggleVisibility = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  // 1. Mouse down triggers repositioning
  const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    setSelectedLayerId(layerId);
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    
    setDragMode('move');
    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
      layerWidth: layer.width || 20,
      layerFontSize: layer.fontSize || 24,
      layerRotation: layer.rotation || 0,
      corner: ''
    });
    setIsDragging(true);
  };

  // 2. Mouse down triggers resizing
  const handleResizeMouseDown = (e: React.MouseEvent, layerId: string, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    
    setDragMode('resize');
    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
      layerWidth: layer.width || 20,
      layerFontSize: layer.fontSize || 24,
      layerRotation: layer.rotation || 0,
      corner: corner
    });
    setIsDragging(true);
  };

  // 3. Mouse down triggers rotation
  const handleRotateMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    
    setDragMode('rotate');
    
    // Find the center of the layer element in screen coordinates
    const layerEl = document.getElementById(`layer-el-${layerId}`);
    let centerX = e.clientX;
    let centerY = e.clientY;
    
    if (layerEl) {
      const rect = layerEl.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    }
    
    setDragStart({
      clientX: centerX, // Store center point in clientX/clientY
      clientY: centerY,
      layerX: layer.x,
      layerY: layer.y,
      layerWidth: layer.width || 20,
      layerFontSize: layer.fontSize || 24,
      layerRotation: layer.rotation || 0,
      corner: ''
    });
    setIsDragging(true);
  };

  // 4. Mouse movement tracking
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedLayerId || !dragMode) return;
    
    const canvasEl = document.getElementById('design-workspace-canvas');
    if (!canvasEl) return;
    
    const canvasRect = canvasEl.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.clientX;
    const deltaY = e.clientY - dragStart.clientY;
    
    if (dragMode === 'move') {
      const pctDeltaX = (deltaX / canvasRect.width) * 100;
      const pctDeltaY = (deltaY / canvasRect.height) * 100;
      
      setLayers(prev => prev.map(l => {
        if (l.id === selectedLayerId) {
          return {
            ...l,
            x: Math.max(-10, Math.min(110, dragStart.layerX + pctDeltaX)),
            y: Math.max(-10, Math.min(110, dragStart.layerY + pctDeltaY))
          };
        }
        return l;
      }));
    } 
    else if (dragMode === 'resize') {
      const corner = dragStart.corner;
      const pctDeltaX = (deltaX / canvasRect.width) * 100;
      const pctDeltaY = (deltaY / canvasRect.height) * 100;
      
      setLayers(prev => prev.map(l => {
        if (l.id === selectedLayerId) {
          let newX = l.x;
          let newY = l.y;
          let newWidth = l.width || 20;
          let newFontSize = l.fontSize || 24;
          
          if (l.type === 'text') {
            let deltaSize = 0;
            if (corner === 'br') {
              deltaSize = deltaX / 3;
              newX = dragStart.layerX;
              newY = dragStart.layerY;
            } else if (corner === 'tr') {
              deltaSize = deltaX / 3;
              newX = dragStart.layerX;
              newY = Math.max(-10, Math.min(110, dragStart.layerY + pctDeltaY));
            } else if (corner === 'bl') {
              deltaSize = -deltaX / 3;
              newX = Math.max(-10, Math.min(110, dragStart.layerX + pctDeltaX));
              newY = dragStart.layerY;
            } else if (corner === 'tl') {
              deltaSize = -deltaX / 3;
              newX = Math.max(-10, Math.min(110, dragStart.layerX + pctDeltaX));
              newY = Math.max(-10, Math.min(110, dragStart.layerY + pctDeltaY));
            }
            newFontSize = Math.max(12, Math.min(120, Math.round(dragStart.layerFontSize + deltaSize)));
            
            return {
              ...l,
              x: newX,
              y: newY,
              fontSize: newFontSize
            };
          } else {
            if (corner === 'br') {
              newWidth = Math.max(5, Math.min(100, Math.round(dragStart.layerWidth + pctDeltaX)));
              newX = dragStart.layerX;
              newY = dragStart.layerY;
            } else if (corner === 'tr') {
              newWidth = Math.max(5, Math.min(100, Math.round(dragStart.layerWidth + pctDeltaX)));
              newX = dragStart.layerX;
              newY = Math.max(-10, Math.min(110, dragStart.layerY + pctDeltaY));
            } else if (corner === 'bl') {
              newWidth = Math.max(5, Math.min(100, Math.round(dragStart.layerWidth - pctDeltaX)));
              newX = Math.max(-10, Math.min(110, dragStart.layerX + pctDeltaX));
              newY = dragStart.layerY;
            } else if (corner === 'tl') {
              newWidth = Math.max(5, Math.min(100, Math.round(dragStart.layerWidth - pctDeltaX)));
              newX = Math.max(-10, Math.min(110, dragStart.layerX + pctDeltaX));
              newY = Math.max(-10, Math.min(110, dragStart.layerY + pctDeltaY));
            }
            
            return {
              ...l,
              x: newX,
              y: newY,
              width: newWidth
            };
          }
        }
        return l;
      }));
    }
    else if (dragMode === 'rotate') {
      const centerX = dragStart.clientX;
      const centerY = dragStart.clientY;
      
      // Calculate cursor angle from layer center
      const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let angleDeg = angleRad * (180 / Math.PI);
      
      // Offset by 90 degrees since handle floats below center (at 6 o'clock position)
      angleDeg = Math.round(angleDeg - 90);
      
      if (angleDeg < 0) angleDeg += 360;
      
      setLayers(prev => prev.map(l => {
        if (l.id === selectedLayerId) {
          return {
            ...l,
            rotation: angleDeg
          };
        }
        return l;
      }));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedLayerId(null);
    }
  };

  // Helper to dynamically build CSS styles for text layers
  const getTextStyle = (layer: CanvasLayer) => {
    const style: React.CSSProperties = {
      color: layer.color || '#ffffff',
      fontSize: layer.fontSize ? `${layer.fontSize}px` : '24px',
      textAlign: layer.alignment || 'left',
      fontStyle: layer.italic ? 'italic' : 'normal',
      fontWeight: layer.fontWeight || (layer.bold ? 'black' : 'normal'),
      textTransform: layer.textTransform || 'none',
    };

    // Font family mapping
    if (layer.fontFamily) {
      if (layer.fontFamily === 'serif') {
        style.fontFamily = 'Georgia, Cambria, serif';
      } else if (layer.fontFamily === 'mono') {
        style.fontFamily = '"JetBrains Mono", Courier, monospace';
      } else if (layer.fontFamily === 'display') {
        style.fontFamily = '"Space Grotesk", sans-serif';
      } else if (layer.fontFamily === 'cursive') {
        style.fontFamily = '"Brush Script MT", cursive';
      } else if (layer.fontFamily === 'sans') {
        style.fontFamily = '"Inter", sans-serif';
      } else {
        // Assume Google font name directly
        style.fontFamily = `"${layer.fontFamily}", sans-serif`;
      }
    } else {
      style.fontFamily = '"Inter", sans-serif';
    }

    // Shadow & Effects overlays
    const shadows: string[] = [];
    if (layer.textShadow) {
      shadows.push(layer.textShadow);
    }
    if (layer.shadow) {
      shadows.push('2px 2px 4px rgba(0, 0, 0, 0.7)');
    }
    if (layer.outline) {
      shadows.push('-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000');
    }

    // Effect Presets
    if (layer.effect === 'neon') {
      shadows.push(`0 0 5px ${layer.color || '#ec4899'}, 0 0 15px ${layer.color || '#ec4899'}, 0 0 30px #d946ef`);
    } else if (layer.effect === 'cyber') {
      shadows.push('0 0 10px #eab308, 0 0 2px #000');
    } else if (layer.effect === 'retro') {
      shadows.push('3px 3px 0px #09090b');
    } else if (layer.effect === 'glitch') {
      shadows.push('2px 2px 0px #ec4899, -2px -2px 0px #3b82f6');
    }

    if (shadows.length > 0) {
      style.textShadow = shadows.join(', ');
    }

    // Text Image Masking support
    if (layer.bgImage) {
      style.backgroundImage = `url(${layer.bgImage})`;
      
      const w = layer.maskWidth ?? 800;
      const h = layer.maskHeight ?? 500;
      const bx = layer.bgX ?? 0;
      const by = layer.bgY ?? 0;
      
      const alignX = Math.max(0, Math.min(100, ((400 - bx) / w) * 100));
      const alignY = Math.max(0, Math.min(100, ((250 - by) / h) * 100));
      
      style.backgroundSize = 'cover';
      style.backgroundPosition = `${alignX}% ${alignY}%`;
      style.backgroundClip = 'text';
      style.WebkitBackgroundClip = 'text';
      style.color = 'transparent';
      style.filter = `brightness(${layer.maskBrightness ?? 100}%) contrast(${layer.maskContrast ?? 100}%)`;
      style.opacity = layer.maskOpacity ?? 1;
    }

    return style;
  };

  const activeLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className="h-screen w-full flex flex-col bg-[#F8FAFC] text-slate-800 select-none overflow-hidden">
      
      {/* TOP NAVIGATION BAR */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-30 font-sans">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => store.setView('creator-studio')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[15px] font-bold text-slate-800 bg-transparent border-0 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-slate-50 px-2.5 py-1 rounded-lg w-64 transition-all"
            placeholder="Untitled Thumbnail"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="h-10 px-4 bg-[#6366F1] hover:bg-indigo-600 active:scale-[0.98] text-white rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-500/10 cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Export / Download</span>
          </button>
        </div>
      </header>

      {/* THREE-COLUMN EDITOR LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* COLUMN 1: LEFT SIDEBAR (TOOLBOX) */}
        <aside className="w-[320px] bg-white border-r border-slate-200 flex shrink-0 z-20 font-sans">
          
          {/* Vertical Menu Buttons */}
          <div className="w-18 border-r border-slate-100 flex flex-col py-4 items-center gap-5 shrink-0 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold w-14 aspect-square transition-all cursor-pointer ${
                activeTab === 'templates' 
                  ? 'bg-indigo-50 text-[#6366F1]' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layout className="w-5 h-5" />
              <span className="text-[10px]">Templates</span>
            </button>
            <button 
              onClick={() => setActiveTab('text')}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold w-14 aspect-square transition-all cursor-pointer ${
                activeTab === 'text' 
                  ? 'bg-indigo-50 text-[#6366F1]' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Type className="w-5 h-5" />
              <span className="text-[10px]">Text</span>
            </button>
            <button 
              onClick={() => setActiveTab('design-vault')}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold w-14 aspect-square transition-all cursor-pointer ${
                activeTab === 'design-vault' 
                  ? 'bg-indigo-50 text-[#6366F1]' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="text-[10px]">Vault</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <Layout className="w-4 h-4 text-indigo-400" />
                  <span>Presets</span>
                </h3>
                
                <button
                  onClick={() => loadTemplate('money')}
                  className="w-full flex flex-col border border-slate-200 rounded-xl overflow-hidden text-left bg-slate-50/50 hover:border-[#6366F1] transition-all cursor-pointer group"
                >
                  <div className="aspect-video bg-zinc-950 w-full relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150')` }}>
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute bottom-2 left-2 text-[9px] font-black uppercase text-white font-sans">
                      HOW TO MAKE <span className="text-yellow-400">MONEY</span>
                    </div>
                  </div>
                  <div className="p-2 bg-white">
                    <span className="text-xs font-bold text-slate-800">Surprised Surfer / Money</span>
                  </div>
                </button>

                <button
                  onClick={() => loadTemplate('productivity')}
                  className="w-full flex flex-col border border-slate-200 rounded-xl overflow-hidden text-left bg-slate-50/50 hover:border-[#6366F1] transition-all cursor-pointer group"
                >
                  <div className="aspect-video bg-[#1e1b4b] w-full relative flex items-center justify-center p-2 text-center text-white">
                    <span className="text-[8px] font-black font-sans leading-none">TOP 5 PRODUCTIVITY HACKS</span>
                  </div>
                  <div className="p-2 bg-white">
                    <span className="text-xs font-bold text-slate-800">Productivity Hacks list</span>
                  </div>
                </button>

                <button
                  onClick={() => loadTemplate('vlog')}
                  className="w-full flex flex-col border border-slate-200 rounded-xl overflow-hidden text-left bg-slate-50/50 hover:border-[#6366F1] transition-all cursor-pointer group"
                >
                  <div className="aspect-video bg-zinc-900 w-full relative flex flex-col items-center justify-center p-2 text-center text-white bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150')` }}>
                    <div className="absolute inset-0 bg-black/60" />
                    <span className="text-[8px] font-black font-sans text-yellow-400 leading-none">BEST CAMERA VLOG</span>
                  </div>
                  <div className="p-2 bg-white">
                    <span className="text-xs font-bold text-slate-800">Vlogging Camera review</span>
                  </div>
                </button>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fonts and combinations"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#6366F1] outline-none placeholder:text-slate-400 transition-all shadow-sm"
                  />
                </div>

                {/* Canva-style Default Text Styles */}
                {!searchQuery && (
                  <div className="space-y-3">
                    <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                      <Type className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Default Text Styles</span>
                    </h3>
                    
                    <div className="space-y-2">
                      {/* Add Heading */}
                      <button
                        onClick={() => addTextLayer('Add a heading', 40, '#ffffff', 'display', true, false, 'none')}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm hover:border-[#6366F1] active:scale-[0.99] flex flex-col justify-center min-h-14"
                      >
                        <div className="text-[20px] font-black text-slate-900 tracking-tight leading-none font-display">
                          Add a heading
                        </div>
                      </button>

                      {/* Add Subheading */}
                      <button
                        onClick={() => addTextLayer('Add a subheading', 24, '#e2e8f0', 'sans', true, false, 'none')}
                        className="w-full text-left px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm hover:border-[#6366F1] active:scale-[0.99] flex flex-col justify-center min-h-12"
                      >
                        <div className="text-[14px] font-bold text-slate-750 leading-none">
                          Add a subheading
                        </div>
                      </button>

                      {/* Add Body Text */}
                      <button
                        onClick={() => addTextLayer('Add body text...', 14, '#94a3b8', 'sans', false, false, 'none')}
                        className="w-full text-left px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm hover:border-[#6366F1] active:scale-[0.99] flex flex-col justify-center min-h-10"
                      >
                        <div className="text-[11px] font-normal text-slate-500 leading-none">
                          Add a little bit of body text
                        </div>
                      </button>
                    </div>
                    <div className="h-px bg-slate-100 my-4" />
                  </div>
                )}

                {/* Pre-styled Font Combinations Grid */}
                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pre-styled Font Combinations</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                    {PRESTYLED_TEXT_TEMPLATES.filter(temp => 
                      temp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      temp.previewText.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(temp => (
                      <button
                        key={temp.id}
                        onClick={() => addPrestyledTextTemplate(temp)}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[105px] relative overflow-hidden group shadow-sm active:scale-95 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-1 w-full">
                          {temp.layers.map((layer, idx) => {
                            const layerStyle: React.CSSProperties = {
                              color: layer.color,
                              fontWeight: layer.fontWeight,
                              textTransform: layer.textTransform,
                              fontFamily: layer.fontFamily === 'sans' ? '"Inter", sans-serif' : 
                                          layer.fontFamily === 'serif' ? 'Georgia, serif' : 
                                          layer.fontFamily === 'mono' ? '"JetBrains Mono", monospace' : 
                                          layer.fontFamily === 'display' ? '"Space Grotesk", sans-serif' : 
                                          layer.fontFamily === 'cursive' ? '"Brush Script MT", cursive' : 
                                          `"${layer.fontFamily}", sans-serif`,
                              fontSize: `${Math.max(11, Math.min(20, layer.fontSize * 0.42))}px`,
                              textShadow: layer.textShadow,
                              lineHeight: '1.1',
                            };
                            return (
                              <div key={idx} style={layerStyle}>
                                {layer.text}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mt-2 block opacity-80">
                          {temp.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design-vault' && (
              <div className="space-y-4 font-sans">
                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Describe your ideal element..."
                    value={assetSearchQuery}
                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-slate-50 focus:border-[#6366F1] outline-none"
                  />
                  <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                {!activeAssetSubCategory ? (
                  // Main Categories Grid (landing state)
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <LayoutGrid className="w-4 h-4 text-indigo-400" />
                      <span>Design Vault</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'shapes', label: 'Shapes', icon: Shapes, color: 'bg-emerald-500/10 text-emerald-600' },
                        { id: 'graphics', label: 'Graphics', icon: Sparkles, color: 'bg-indigo-500/10 text-indigo-600' },
                        { id: 'photos', label: 'Photos', icon: ImageIcon, color: 'bg-blue-500/10 text-blue-600' },
                        { id: 'mockups', label: 'Mockups', icon: Shirt, color: 'bg-purple-500/10 text-purple-600' },
                        { id: '3d', label: '3D', icon: Box, color: 'bg-pink-500/10 text-pink-600' },
                        { id: 'charts', label: 'Charts', icon: BarChart3, color: 'bg-amber-500/10 text-amber-600' },
                        { id: 'forms', label: 'Forms', icon: FileText, color: 'bg-rose-500/10 text-rose-600' },
                        { id: 'sheets', label: 'Sheets', icon: Grid, color: 'bg-teal-500/10 text-teal-600' },
                        { id: 'tables', label: 'Tables', icon: Table, color: 'bg-cyan-500/10 text-cyan-600' },
                        { id: 'frames', label: 'Frames', icon: Frame, color: 'bg-violet-500/10 text-violet-600' },
                        { id: 'grids', label: 'Grids', icon: LayoutGrid, color: 'bg-orange-500/10 text-orange-600' },
                        { id: 'uploads', label: 'Uploads', icon: Upload, color: 'bg-slate-500/10 text-slate-600' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveAssetSubCategory(cat.id)}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-white hover:border-[#6366F1] hover:shadow-sm transition-all cursor-pointer aspect-square text-center group active:scale-95"
                        >
                          <div className={`p-2 rounded-lg mb-1 transition-transform group-hover:scale-110 ${cat.color}`}>
                            <cat.icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 leading-tight">
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Sub-Category Explorer
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <button
                        onClick={() => setActiveAssetSubCategory(null)}
                        className="flex items-center gap-1 text-[10px] font-extrabold text-indigo-650 hover:text-[#6366F1] transition-colors uppercase cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        {activeAssetSubCategory}
                      </span>
                    </div>

                    {activeAssetSubCategory === 'shapes' && (
                      <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                        {SHAPES_LIBRARY.map((cat) => (
                          <div key={cat.category} className="space-y-2">
                            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                              {cat.category}
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              {cat.shapes.map((shape) => (
                                <button
                                  key={shape.id}
                                  onClick={() => addShapeLayer(
                                    shape.id, 
                                    shape.path, 
                                    shape.viewBox, 
                                    shape.fillType,
                                    shape.strokeWidth,
                                    shape.strokeDasharray
                                  )}
                                  className="p-2 border border-slate-200 rounded-lg hover:border-[#6366F1] hover:bg-indigo-50/20 bg-slate-50 flex items-center justify-center cursor-pointer transition-all aspect-square active:scale-95 group"
                                  title={shape.name}
                                >
                                  <svg
                                    viewBox={shape.viewBox}
                                    className="w-7 h-7 text-slate-600 transition-colors group-hover:text-[#6366F1]"
                                    preserveAspectRatio="none"
                                  >
                                    <path
                                      d={shape.path}
                                      fill={shape.fillType === 'stroke' ? 'none' : 'currentColor'}
                                      stroke={shape.fillType === 'fill' ? 'none' : 'currentColor'}
                                      strokeWidth={shape.strokeWidth !== undefined ? shape.strokeWidth : 3}
                                      strokeDasharray={shape.strokeDasharray || undefined}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeAssetSubCategory === 'graphics' && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => addStickerLayer('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150')}
                          className="p-1 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col"
                        >
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-full h-16 object-cover rounded-lg" />
                          <span className="text-[10px] font-semibold text-slate-550 mt-1 block">Surprised Man</span>
                        </button>
                        <button
                          onClick={() => addStickerLayer('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150')}
                          className="p-1 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col"
                        >
                          <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=100" className="w-full h-16 object-cover rounded-lg" />
                          <span className="text-[10px] font-semibold text-slate-550 mt-1 block">Camera gear</span>
                        </button>
                        <button
                          onClick={() => addStickerLayer('https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=150')}
                          className="p-1 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col"
                        >
                          <img src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=100" className="w-full h-16 object-cover rounded-lg" />
                          <span className="text-[10px] font-semibold text-slate-550 mt-1 block">Cool Glasses Cat</span>
                        </button>
                        <button
                          onClick={() => addStickerLayer('https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=150')}
                          className="p-1 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col"
                        >
                          <img src="https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=100" className="w-full h-16 object-cover rounded-lg" />
                          <span className="text-[10px] font-semibold text-slate-550 mt-1 block">Surprise Clock</span>
                        </button>
                      </div>
                    )}

                    {activeAssetSubCategory === '3d' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => addStickerLayer('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=350')}
                            className="p-1.5 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col items-center group active:scale-95 transition-all text-center"
                          >
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150" className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" alt="3D Glossy Sphere" />
                            <span className="text-[10px] font-bold text-slate-650 mt-1.5">3D Glossy Sphere</span>
                          </button>

                          <button
                            onClick={() => addStickerLayer('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=350')}
                            className="p-1.5 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col items-center group active:scale-95 transition-all text-center"
                          >
                            <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=150" className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" alt="3D Matte Cube" />
                            <span className="text-[10px] font-bold text-slate-650 mt-1.5">3D Matte Cube</span>
                          </button>

                          <button
                            onClick={() => addStickerLayer('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=350')}
                            className="p-1.5 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col items-center group active:scale-95 transition-all text-center"
                          >
                            <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=150" className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" alt="3D Torus Ring" />
                            <span className="text-[10px] font-bold text-slate-650 mt-1.5">3D Torus Ring</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {activeAssetSubCategory === 'mockups' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => addStickerLayer('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=350')}
                            className="p-1.5 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col items-center group active:scale-95 transition-all text-center"
                          >
                            <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=150" className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" alt="T-Shirt Mockup" />
                            <span className="text-[10px] font-bold text-slate-650 mt-1.5">T-Shirt Mockup</span>
                          </button>

                          <button
                            onClick={() => addStickerLayer('https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=350')}
                            className="p-1.5 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col items-center group active:scale-95 transition-all text-center"
                          >
                            <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=150" className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" alt="Book Cover Mockup" />
                            <span className="text-[10px] font-bold text-slate-650 mt-1.5">Book Cover</span>
                          </button>

                          <button
                            onClick={() => addStickerLayer('https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&q=80&w=350')}
                            className="p-1.5 border border-slate-200 rounded-xl hover:border-[#6366F1] bg-slate-50 overflow-hidden cursor-pointer flex flex-col items-center group active:scale-95 transition-all text-center"
                          >
                            <img src="https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&q=80&w=150" className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" alt="Device Display Mockup" />
                            <span className="text-[10px] font-bold text-slate-650 mt-1.5">Device Display</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {activeAssetSubCategory !== 'shapes' && 
                     activeAssetSubCategory !== 'graphics' && 
                     activeAssetSubCategory !== '3d' && 
                     activeAssetSubCategory !== 'mockups' && (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400">
                        <Sparkles className="w-8 h-8 text-slate-350 mx-auto mb-2 animate-pulse" />
                        <p className="text-[11px] font-bold uppercase tracking-wider">Premium Library</p>
                        <p className="text-[10px] text-slate-450 mt-1">This assets pack is empty or locked in the preview version.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </aside>

        {/* COLUMN 2: CENTER WORKSPACE CANVAS */}
        <main 
          className="flex-1 bg-slate-100 p-8 flex items-center justify-center relative overflow-hidden"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Checkered background grid overlay */}
          <div className="absolute inset-0 editor-grid-pattern opacity-10 pointer-events-none" />

          {/* YouTube 16:9 aspect-ratio design workspace canvas */}
          <div 
            id="design-workspace-canvas"
            onClick={handleCanvasClick}
            className="w-full max-w-[850px] aspect-video border border-slate-300 shadow-2xl rounded-2xl relative overflow-hidden flex items-center justify-center transition-all bg-[#0f172a]"
            style={{ backgroundColor: bgColor }}
          >
            {/* RENDER LAYERS in reverse order so index 0 is rendered last and appears on top */}
            {[...layers].reverse().map((layer) => {
              if (!layer.visible) return null;
              const isSelected = selectedLayerId === layer.id;

              return (
                <div
                  key={layer.id}
                  id={`layer-el-${layer.id}`}
                  onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    width: layer.width ? `${layer.width}%` : 'auto',
                    transform: `rotate(${layer.rotation || 0}deg)`,
                    transformOrigin: 'center center'
                  }}
                  className={`absolute z-10 select-none cursor-move group/layer ${
                    isSelected ? 'ring-2 ring-indigo-500 rounded-sm' : 'hover:ring-1 hover:ring-indigo-300 rounded-sm'
                  }`}
                >
                  {/* Select corner handles & rotation handle */}
                  {isSelected && (
                    <>
                      {/* Bounding box corners */}
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, layer.id, 'tl')}
                        className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full z-20 cursor-nwse-resize hover:scale-125 transition-transform" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, layer.id, 'tr')}
                        className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full z-20 cursor-nesw-resize hover:scale-125 transition-transform" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, layer.id, 'bl')}
                        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full z-20 cursor-nesw-resize hover:scale-125 transition-transform" 
                      />
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, layer.id, 'br')}
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full z-20 cursor-nwse-resize hover:scale-125 transition-transform" 
                      />

                      {/* Rotation handle floating below center */}
                      <div className="absolute -bottom-3 left-1/2 w-0.5 h-3 bg-indigo-500 -translate-x-1/2 pointer-events-none" />
                      <button
                        onMouseDown={(e) => handleRotateMouseDown(e, layer.id)}
                        className="absolute -bottom-9 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-indigo-500 hover:bg-indigo-50 text-indigo-600 rounded-full shadow flex items-center justify-center cursor-alias active:scale-95 transition-all z-20"
                      >
                        <RotateCw className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </>
                  )}

                  {/* Render Text Layer type */}
                  {layer.type === 'text' && (
                    <div
                      style={getTextStyle(layer)}
                      className="leading-tight select-none px-2 whitespace-pre-wrap font-bold"
                    >
                      {layer.content}
                    </div>
                  )}

                  {/* Render Image Layer type */}
                  {layer.type === 'image' && (
                    <img
                      src={layer.content}
                      alt="Sticker layer"
                      className="w-full h-auto object-contain pointer-events-none rounded shadow"
                    />
                  )}

                  {/* Render Shape Layer type */}
                  {layer.type === 'shape' && (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: layer.color || '#3b82f6' }}>
                      <svg 
                        viewBox={layer.svgViewBox || "0 0 100 100"} 
                        className="w-full h-full"
                        preserveAspectRatio="none"
                      >
                        {layer.svgContent ? (
                          <g dangerouslySetInnerHTML={{ __html: layer.svgContent }} />
                        ) : layer.svgPath ? (
                          <path 
                            d={layer.svgPath} 
                            fill={layer.fillType === 'stroke' ? 'none' : (layer.color || '#3b82f6')}
                            stroke={layer.fillType === 'fill' ? 'none' : (layer.color || '#3b82f6')}
                            strokeWidth={layer.strokeWidth !== undefined ? layer.strokeWidth : undefined}
                            strokeDasharray={layer.strokeDasharray || undefined}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ) : (
                          /* Legacy shape fallback */
                          <path
                            d={
                              layer.content === 'circle' 
                                ? "M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0" 
                                : layer.content === 'triangle' 
                                  ? "M 50 5 L 95 95 L 5 95 Z" 
                                  : "M 5 5 H 95 V 95 H 5 Z"
                            }
                            fill={layer.color || '#3b82f6'}
                          />
                        )}
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>


        </main>

        {/* COLUMN 3: RIGHT SIDEBAR (PROPERTIES PANEL) */}
        <aside className="w-[320px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 font-sans">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Properties Panel
            </h3>
          </div>

          {/* Properties Scroll area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            
            {/* Background properties */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                Canvas Background
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded border border-slate-200 cursor-pointer p-0 shrink-0 bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor.toUpperCase()}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-xs font-bold font-mono bg-slate-50 focus:border-[#6366F1] outline-none"
                />
              </div>
            </div>

            {/* Contextual properties (Visible when a text layer is selected) */}
            {activeLayer && activeLayer.type === 'text' && (
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <h4 className="text-[11px] font-extrabold text-[#6366F1] uppercase tracking-widest">
                  Edit Text Layer
                </h4>

                {/* Text Content Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-650">Content</label>
                  <textarea
                    value={activeLayer.content}
                    onChange={(e) => {
                      const text = e.target.value;
                      setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, content: text } : l));
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold bg-slate-50 focus:border-[#6366F1] outline-none resize-none h-18"
                    placeholder="Enter bold text..."
                  />
                </div>

                {/* Font Family Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-650">Font Family</label>
                  <select
                    value={activeLayer.fontFamily === 'sans' ? 'Inter' :
                           activeLayer.fontFamily === 'display' ? 'Space Grotesk' :
                           activeLayer.fontFamily === 'serif' ? 'Playfair Display' :
                           activeLayer.fontFamily === 'cursive' ? 'Pacifico' :
                           activeLayer.fontFamily || 'Inter'}
                    onChange={(e) => {
                      const font = e.target.value;
                      setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, fontFamily: font } : l));
                    }}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-bold bg-slate-50 focus:border-[#6366F1] outline-none"
                  >
                    {FONT_CATEGORIES.map((category) => (
                      <optgroup key={category.label} label={category.label}>
                        {category.fonts.map((font) => (
                          <option 
                            key={font.value} 
                            value={font.value} 
                            style={{ fontFamily: font.value }}
                          >
                            {font.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Font Size slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-655">
                    <span>Font Size</span>
                    <span className="font-mono">{activeLayer.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="90"
                    value={activeLayer.fontSize || 24}
                    onChange={(e) => {
                      const size = parseInt(e.target.value);
                      setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, fontSize: size } : l));
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Text color picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-655 block">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={activeLayer.color || '#ffffff'}
                      onChange={(e) => {
                        const col = e.target.value;
                        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, color: col } : l));
                      }}
                      className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={(activeLayer.color || '#ffffff').toUpperCase()}
                      onChange={(e) => {
                        const col = e.target.value;
                        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, color: col } : l));
                      }}
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-xs font-bold font-mono bg-slate-50 focus:border-[#6366F1] outline-none"
                    />
                  </div>
                </div>

                {/* Text Style Toggles (Bold and Italic) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-655 block">Text Styles</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, bold: !l.bold } : l));
                      }}
                      className={`flex-1 h-10 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeLayer.bold 
                          ? 'bg-indigo-50 border-indigo-200 text-[#6366F1]' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                      <span>Bold</span>
                    </button>
                    <button
                      onClick={() => {
                        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, italic: !l.italic } : l));
                      }}
                      className={`flex-1 h-10 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeLayer.italic 
                          ? 'bg-indigo-50 border-indigo-200 text-[#6366F1]' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                      <span>Italic</span>
                    </button>
                  </div>
                </div>

                {/* Image Text Fill */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-655 block">Image Text Fill</label>
                  
                  {!activeLayer.bgImage ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="text-mask-image-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const dataUrl = reader.result as string;
                            setLayers(prev => prev.map(l => l.id === selectedLayerId ? {
                              ...l,
                              bgImage: dataUrl,
                              maskOpacity: l.maskOpacity ?? 1,
                              maskContrast: l.maskContrast ?? 100,
                              maskBrightness: l.maskBrightness ?? 100
                            } : l));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <label
                        htmlFor="text-mask-image-upload"
                        className="w-full h-10 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[#6366F1] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Upload Image to Text</span>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsEditingMask(true)}
                            className="group relative flex items-center justify-center w-10 h-10 rounded border border-slate-200 overflow-hidden cursor-pointer active:scale-95 transition-all shrink-0"
                            title="Edit Mask Position"
                          >
                            <img
                              src={activeLayer.bgImage}
                              alt="Mask preview"
                              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                              <span className="text-[8px] font-black text-white uppercase tracking-wider scale-90">Edit</span>
                            </div>
                          </button>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-700">Mask Active</span>
                            <button
                              onClick={() => setIsEditingMask(true)}
                              className="text-[9px] font-extrabold text-[#6366F1] hover:underline text-left cursor-pointer"
                            >
                              Reposition Image
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setLayers(prev => prev.map(l => l.id === selectedLayerId ? {
                              ...l,
                              bgImage: undefined,
                              maskOpacity: undefined,
                              maskContrast: undefined,
                              maskBrightness: undefined
                            } : l));
                          }}
                          className="px-2 py-1 text-[10px] font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded transition-all cursor-pointer"
                        >
                          Remove Image
                        </button>
                      </div>

                      {/* Transparency Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-655">
                          <span>Transparency</span>
                          <span className="font-mono">{Math.round((activeLayer.maskOpacity ?? 1) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={activeLayer.maskOpacity ?? 1}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, maskOpacity: val } : l));
                          }}
                          className="w-full h-1 bg-slate-200 rounded cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                        />
                      </div>

                      {/* Contrast Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-655">
                          <span>Contrast</span>
                          <span className="font-mono">{activeLayer.maskContrast ?? 100}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="5"
                          value={activeLayer.maskContrast ?? 100}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, maskContrast: val } : l));
                          }}
                          className="w-full h-1 bg-slate-200 rounded cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                        />
                      </div>

                      {/* Brightness Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-655">
                          <span>Brightness</span>
                          <span className="font-mono">{activeLayer.maskBrightness ?? 100}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="5"
                          value={activeLayer.maskBrightness ?? 100}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, maskBrightness: val } : l));
                          }}
                          className="w-full h-1 bg-slate-200 rounded cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Rotation property */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-655">
                    <span>Rotation</span>
                    <span className="font-mono">{activeLayer.rotation || 0}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={activeLayer.rotation || 0}
                    onChange={(e) => {
                      const rot = parseInt(e.target.value);
                      setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, rotation: rot } : l));
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Alignment */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-655 block">Alignment</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, alignment: 'left' } : l));
                      }}
                      className={`flex-1 py-1.5 flex justify-center rounded border transition-all cursor-pointer ${
                        activeLayer.alignment === 'left' 
                          ? 'bg-[#6366F1] border-indigo-500 text-white' 
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, alignment: 'center' } : l));
                      }}
                      className={`flex-1 py-1.5 flex justify-center rounded border transition-all cursor-pointer ${
                        activeLayer.alignment === 'center' 
                          ? 'bg-[#6366F1] border-indigo-500 text-white' 
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, alignment: 'right' } : l));
                      }}
                      className={`flex-1 py-1.5 flex justify-center rounded border transition-all cursor-pointer ${
                        activeLayer.alignment === 'right' 
                          ? 'bg-[#6366F1] border-indigo-500 text-white' 
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Text Effects Accordion Section */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-655 block">Text Effects & Presets</label>
                  
                  {/* Drop Shadow & Stroke toggles */}
                  <div className="flex gap-4 items-center justify-between text-xs font-semibold text-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!activeLayer.shadow} 
                        onChange={(e) => {
                          const val = e.target.checked;
                          setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, shadow: val } : l));
                        }}
                        className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Drop Shadow</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!activeLayer.outline} 
                        onChange={(e) => {
                          const val = e.target.checked;
                          setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, outline: val } : l));
                        }}
                        className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Outline Stroke</span>
                    </label>
                  </div>


                </div>

              </div>
            )}

            {/* Contextual properties (Visible when shape or image is selected) */}
            {activeLayer && activeLayer.type !== 'text' && (
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <h4 className="text-[11px] font-extrabold text-[#6366F1] uppercase tracking-widest">
                  Edit Layer Asset
                </h4>

                {/* Width resize */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Width Ratio</span>
                    <span className="font-mono">{activeLayer.width || 20}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    value={activeLayer.width || 20}
                    onChange={(e) => {
                      const w = parseInt(e.target.value);
                      setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, width: w } : l));
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Rotation property */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-655">
                    <span>Rotation</span>
                    <span className="font-mono">{activeLayer.rotation || 0}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={activeLayer.rotation || 0}
                    onChange={(e) => {
                      const rot = parseInt(e.target.value);
                      setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, rotation: rot } : l));
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Color (if shape) */}
                {activeLayer.type === 'shape' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 block">Shape Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={activeLayer.color || '#3b82f6'}
                        onChange={(e) => {
                          const col = e.target.value;
                          setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, color: col } : l));
                        }}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={(activeLayer.color || '#3b82f6').toUpperCase()}
                        onChange={(e) => {
                          const col = e.target.value;
                          setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, color: col } : l));
                        }}
                        className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-xs font-bold font-mono bg-slate-50 focus:border-[#6366F1] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Layer List adjustments */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                Layers List
              </h4>

              <div className="space-y-2">
                {layers.map((layer, index) => {
                  const isSelected = selectedLayerId === layer.id;
                  const isDragOver = dragOverIndex === index;
                  const isDragged = draggedIndex === index;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      draggable={true}
                      onDragStart={(e) => {
                        setDraggedIndex(index);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== index) {
                          setDragOverIndex(index);
                        }
                      }}
                      onDragLeave={() => {
                        setDragOverIndex(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null && draggedIndex !== index) {
                          reorderLayers(draggedIndex, index);
                        }
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' 
                          : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100 text-slate-600'
                      } ${
                        isDragged ? 'opacity-40 border-dashed border-indigo-400' : ''
                      } ${
                        isDragOver ? 'border-t-2 border-t-indigo-500 pt-1.5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Drag Handle grip icon */}
                        <div className="cursor-grab active:cursor-grabbing text-slate-350 px-0.5 hover:text-indigo-500 shrink-0">
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                        {layer.type === 'text' && <Type className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
                        {layer.type === 'image' && <ImageIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
                        {layer.type === 'shape' && <Shapes className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
                        <span className="truncate leading-none">
                          {layer.type === 'text' ? layer.content : `${layer.type.toUpperCase()}: ${layer.content.split('/').pop()?.split('?')[0] || layer.content}`}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisibility(layer.id);
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                        >
                          {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLayer(layer.id);
                          }}
                          className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {layers.length === 0 && (
                  <p className="text-[11px] text-center text-slate-400 py-4">No layers active. Add some text or images!</p>
                )}
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* Dynamic Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10B981] text-white px-5 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 font-sans">
          <Check className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Figma-style Mask Positioning Modal */}
      {isEditingMask && activeLayer && activeLayer.type === 'text' && activeLayer.bgImage && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center select-none font-sans">
          <div className="text-white mb-4 text-center">
            <h3 className="text-lg font-black tracking-tight">Reposition & Zoom Image Fill</h3>
            <p className="text-xs text-zinc-400 mt-1">Drag the image to position it inside the letters. Use the zoom slider below to resize.</p>
          </div>

          {/* Mask Positioning Viewport */}
          <div className="w-[800px] h-[500px] bg-zinc-950 border border-zinc-800 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl">
            <svg 
              id="modal-svg-viewport"
              className="w-full h-full select-none" 
              viewBox="0 0 800 500"
              onMouseDown={handleMaskDragStart}
              onMouseMove={handleMaskDragMove}
              onMouseUp={handleMaskDragEnd}
              onMouseLeave={handleMaskDragEnd}
            >
              <defs>
                {/* Define the text boundary stencil shape */}
                <clipPath id="text-mask">
                  <text 
                    x="50%" 
                    y="50%" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fontSize="72px" // Keep the base mask scale uniform and clean
                    fontWeight="bold"
                    fontFamily={activeLayer.fontFamily || 'sans'}
                    style={{ textTransform: activeLayer.textTransform || 'none' }}
                  >
                    {activeLayer.content}
                  </text>
                </clipPath>
              </defs>

              {/* 1. The Dimmed Background Guide Image (Behind everything) */}
              <image 
                href={activeLayer.bgImage} 
                x={activeLayer.bgX ?? 0} 
                y={activeLayer.bgY ?? 0} 
                width={activeLayer.maskWidth ?? 800} 
                height={activeLayer.maskHeight ?? 500} 
                className="opacity-25 pointer-events-none"
              />

              {/* 2. The Interactive Masked Image (Visible only inside the text clip) */}
              <image 
                href={activeLayer.bgImage} 
                x={activeLayer.bgX ?? 0} 
                y={activeLayer.bgY ?? 0} 
                width={activeLayer.maskWidth ?? 800} 
                height={activeLayer.maskHeight ?? 500} 
                clipPath="url(#text-mask)"
                className="cursor-move"
              />
              
              {/* Outer white outline frame of the text mask for visibility guidelines */}
              <text 
                x="50%" 
                y="50%" 
                textAnchor="middle" 
                dominantBaseline="middle"
                fontSize="72px"
                fontWeight="bold"
                fontFamily={activeLayer.fontFamily || 'sans'}
                style={{ textTransform: activeLayer.textTransform || 'none' }}
                fill="none"
                stroke="rgba(255, 255, 255, 0.65)"
                strokeWidth="1.5"
                className="pointer-events-none"
              >
                {activeLayer.content}
              </text>
            </svg>
          </div>

          {/* Zoom Slider */}
          <div className="mt-5 w-[300px] flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
              <span>Image Zoom Scale</span>
              <span>{Math.round(((activeLayer.maskWidth ?? 800) / 800) * 100)}%</span>
            </div>
            <input
              type="range"
              min="100"
              max="300"
              step="5"
              value={Math.round(((activeLayer.maskWidth ?? 800) / 800) * 100)}
              onChange={(e) => handleZoomChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#6366F1] [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Done Action */}
          <button
            onClick={() => setIsEditingMask(false)}
            className="mt-6 px-8 py-3 bg-[#6366F1] hover:bg-indigo-600 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer"
          >
            Done / Save Position
          </button>
        </div>
      )}
    </div>
  );
}
