/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { store } from '../store';
import { useState } from 'react';
import {
  Play,
  Plus,
  Youtube,
  FileImage,
  Smile,
  MessageSquare,
  Layout,
  Compass,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function CreatorStudio() {
  const [activeCategory, setActiveCategory] = useState('YouTube Thumbnails');

  const categories = [
    'YouTube Thumbnails',
    'Posters',
    'Instagram Posts',
    'Facebook Covers',
    'Banners',
    'Flyers'
  ];

  // Mock template data for interactive filter switching
  const templatesData: Record<string, { id: string; title: string; image: string; tag: string }[]> = {
    'YouTube Thumbnails': [
      {
        id: 'yt-1',
        title: 'HOW TO MAKE MONEY ONLINE',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        tag: 'Finance'
      },
      {
        id: 'yt-2',
        title: 'TOP 5 PRODUCTIVITY TIPS',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
        tag: 'Efficiency'
      },
      {
        id: 'yt-3',
        title: 'BEST CAMERA FOR VLOGGING',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
        tag: 'Tech Review'
      },
      {
        id: 'yt-4',
        title: 'HOME WORKOUT FOR BEGINNERS',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400',
        tag: 'Fitness'
      },
      {
        id: 'yt-5',
        title: 'STUDY MOTIVATION',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
        tag: 'Education'
      },
      {
        id: 'yt-6',
        title: '5 APPS YOU MUST TRY!',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
        tag: 'Apps'
      }
    ],
    'Posters': [
      {
        id: 'post-1',
        title: 'MUSIC FESTIVAL 2026',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400',
        tag: 'Concerts'
      },
      {
        id: 'post-2',
        title: 'MODERN ART SHOWCASE',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400',
        tag: 'Exhibits'
      },
      {
        id: 'post-3',
        title: 'ELECTRO DANCE PARTY',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400',
        tag: 'DJ Night'
      },
      {
        id: 'post-4',
        title: 'CLASSIC MOVIE NIGHT',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400',
        tag: 'Cinema'
      },
      {
        id: 'post-5',
        title: 'STREET FOOD FESTIVAL',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
        tag: 'Culinary'
      },
      {
        id: 'post-6',
        title: 'LEADERSHIP SUMMIT',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400',
        tag: 'Conference'
      }
    ],
    'Instagram Posts': [
      {
        id: 'ig-1',
        title: 'MY SUMMER TRAVEL DIARY',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400',
        tag: 'Vlog'
      },
      {
        id: 'ig-2',
        title: 'BELIEVE IN YOURSELF',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        tag: 'Inspirational'
      },
      {
        id: 'ig-3',
        title: 'MEGA CLEARANCE - 70% OFF',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400',
        tag: 'Shopping'
      },
      {
        id: 'ig-4',
        title: 'INTRODUCING WIRELESS BUDS',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto-format&fit=crop&q=80&w=400',
        tag: 'Gadgets'
      },
      {
        id: 'ig-5',
        title: '5 MIN MORNING STRETCH',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400',
        tag: 'Health'
      },
      {
        id: 'ig-6',
        title: 'HEALTHY AVOCADO TOAST',
        image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=400',
        tag: 'Recipes'
      }
    ],
    'Facebook Covers': [
      {
        id: 'fb-1',
        title: 'CONNECTING PEOPLE TOGETHER',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
        tag: 'Networking'
      },
      {
        id: 'fb-2',
        title: 'JOIN OUR OUTDOOR CLUB',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
        tag: 'Nature'
      },
      {
        id: 'fb-3',
        title: 'THE CHRONICLES OF GAMING',
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400',
        tag: 'Esports'
      },
      {
        id: 'fb-4',
        title: 'LESS IS MORE DESIGN',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400',
        tag: 'Minimalism'
      },
      {
        id: 'fb-5',
        title: 'ANNUAL MEETUP 2026',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400',
        tag: 'Corporate'
      },
      {
        id: 'fb-6',
        title: 'BUILDING THE FUTURE',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
        tag: 'Technology'
      }
    ],
    'Banners': [
      {
        id: 'ban-1',
        title: 'BLACK FRIDAY SUPER DEAL',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400',
        tag: 'E-commerce'
      },
      {
        id: 'ban-2',
        title: 'DESIGN YOUR CREATIVE BRAND',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
        tag: 'Branding'
      },
      {
        id: 'ban-3',
        title: 'WE ARE HIRING: JOIN US!',
        image: 'https://images.unsplash.com/photo-1521791136368-1a8682707636?auto=format&fit=crop&q=80&w=400',
        tag: 'Jobs'
      },
      {
        id: 'ban-4',
        title: 'MASTERING REACT & TAILWIND',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400',
        tag: 'Coding'
      },
      {
        id: 'ban-5',
        title: 'CREATIVE GRAPHIC PORTFOLIO',
        image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=400',
        tag: 'Design'
      },
      {
        id: 'ban-6',
        title: 'TECH CONVENTION 2026',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400',
        tag: 'Events'
      }
    ],
    'Flyers': [
      {
        id: 'fly-1',
        title: 'LATIN NIGHT PARTY',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400',
        tag: 'Clubbing'
      },
      {
        id: 'fly-2',
        title: 'MODERN DUPLEX FOR SALE',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400',
        tag: 'Real Estate'
      },
      {
        id: 'fly-3',
        title: 'GET FIT TODAY - JOIN GYM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
        tag: 'Gym'
      },
      {
        id: 'fly-4',
        title: '5K RUN FOR CLEAN WATER',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400',
        tag: 'Charity'
      },
      {
        id: 'fly-5',
        title: 'GRAND OPENING - FREE COFFEE',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=400',
        tag: 'Cafe'
      },
      {
        id: 'fly-6',
        title: 'PROFESSIONAL HOUSE CLEANING',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400',
        tag: 'Services'
      }
    ]
  };

  const handleToolClick = (toolId: string) => {
    if (toolId === 'thumbnail') {
      store.setView('thumbnail-maker');
    } else if (toolId === 'crop' || toolId === 'resize' || toolId === 'format') {
      store.setView('quick-tools');
    } else {
      store.setView('editor');
    }
  };

  return (
    <div className="space-y-10 pb-16 text-[#ecedee]">
      {/* 1. HERO BANNER */}
      <section 
        className="w-full rounded-3xl bg-gradient-to-r from-[#ECE9FE] via-[#F3F0FF] to-[#F5F3FF] dark:from-[#1e1b4b]/40 dark:to-[#311042]/30 border border-indigo-100/50 dark:border-indigo-950/40 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-sm"
      >
        {/* Soft background glow circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-3xl -z-10" />

        {/* Hero Left Content */}
        <div className="flex-1 space-y-6 max-w-xl">
          <h2 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight leading-tight text-slate-900 dark:text-zinc-100 font-display">
            Create. Design. Inspire.<br />
            Bring <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-violet-500 to-fuchsia-500">Your Ideas to Life</span>
          </h2>
          <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-zinc-400 font-medium leading-relaxed max-w-lg">
            Everything you need to create stunning thumbnails, posters, social posts and more.
          </p>
        </div>
        {/* Hero Right Mockup Cards Layout */}
        <div className="w-full lg:w-auto flex-1 h-[270px] relative max-w-md mx-auto lg:mx-0 hidden md:block select-none">
          {/* Mockup Card 1: YouTube Thumbnail (Left floating) */}
          <div 
            onClick={() => handleToolClick('thumbnail')}
            className="w-[210px] aspect-[16/9.5] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-2.5 absolute left-0 bottom-4 z-10 rotate-[-6deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Background Image overlay */}
            <div className="absolute inset-0 opacity-80 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
            {/* YouTube style Badge */}
            <div className="relative z-10 self-start w-7 h-5 bg-rose-600 rounded flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-white text-transparent ml-0.5" />
            </div>
            {/* Thumbnail Text overlay */}
            <div className="relative z-10 text-[10px] leading-tight font-black font-sans uppercase tracking-tight text-white space-y-0.5">
              <div>7 TIPS TO</div>
              <div className="text-yellow-400 font-black">GROW YOUR</div>
              <div className="text-yellow-400 font-black">CHANNEL</div>
            </div>
          </div>
          {/* Additional mockup cards omitted for brevity */}
        </div>
      </section>
      {/* 2. POPULAR CREATOR TOOLS */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            Popular Creator Tools
          </h3>
        </div>
        {/* Tools scroll... omitted for brevity */}
      </section>
      {/* 3. POPULAR TEMPLATES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
            Popular Templates
          </h3>
          <button 
            onClick={() => store.setView('templates')}
            className="text-[13px] font-bold text-[#6366F1] hover:text-indigo-600 flex items-center gap-1 group transition-colors cursor-pointer"
          >
            <span>View all templates</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        {/* Templates scroll omitted for brevity */}
      </section>
    </div>
  );
}
