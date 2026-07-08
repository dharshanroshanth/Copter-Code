/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, ViewType, Project, Layer, Asset, WorkspaceStats, ActivityLog, TaskItem } from './types';

// Let's seed initial data that perfectly matches the high-fidelity UI mockups
const initialUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  plan: 'pro',
  storageUsed: 9.4,
  storageLimit: 20.0,
  creditsUsed: 1450,
  creditsLimit: 5000,
};

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Summer Campaign',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    width: 1080,
    height: 1080,
    type: 'Instagram Post',
    updatedAt: '2 hours ago',
    size: '24 items',
    tags: ['campaign', 'travel', 'summer'],
  },
  {
    id: 'proj-2',
    name: 'Travel Collection',
    thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400',
    width: 1080,
    height: 1350,
    type: 'Instagram Post',
    updatedAt: '1 day ago',
    size: '57 items',
    tags: ['travel', 'explore'],
  },
  {
    id: 'proj-3',
    name: 'Fitness Series',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
    width: 1920,
    height: 1080,
    type: 'YouTube Thumbnail',
    updatedAt: '2 days ago',
    size: '31 items',
    tags: ['fitness', 'workout'],
  },
  {
    id: 'proj-4',
    name: 'Beauty Products',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400',
    width: 1080,
    height: 1080,
    type: 'Post',
    updatedAt: '3 days ago',
    size: '18 items',
    tags: ['beauty', 'skincare'],
  },
  {
    id: 'proj-5',
    name: 'Real Estate Ads',
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400',
    width: 1200,
    height: 630,
    type: 'Facebook Ad',
    updatedAt: '4 days ago',
    size: '22 items',
    tags: ['real estate', 'promo'],
  },
  {
    id: 'proj-6',
    name: 'Food Promotions',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400',
    width: 1080,
    height: 1080,
    type: 'Post',
    updatedAt: '5 days ago',
    size: '16 items',
    tags: ['food', 'burger'],
  },
  {
    id: 'proj-7',
    name: 'Environment Campaign',
    thumbnail: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&w=400',
    width: 1080,
    height: 1080,
    type: 'Post',
    updatedAt: '1 week ago',
    size: '12 items',
    tags: ['ecology', 'green'],
  },
  {
    id: 'proj-8',
    name: 'Webinar Promotion',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=400',
    width: 1920,
    height: 1080,
    type: 'Webinar Poster',
    updatedAt: '1 week ago',
    size: '15 items',
    tags: ['marketing', 'business'],
  },
];

const initialAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Summer_Campaign_01.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '2.4 MB',
    date: 'May 26, 2026, 10:30 AM',
    tags: ['campaign', 'travel', 'summer'],
  },
  {
    id: 'asset-2',
    name: 'Travel_Post_Design.psd',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '45.8 MB',
    date: 'May 26, 2026, 9:15 AM',
    tags: ['travel', 'explore'],
  },
  {
    id: 'asset-3',
    name: 'Product_Shot_02.jpg',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '3.1 MB',
    date: 'May 25, 2026, 4:30 PM',
    tags: ['beauty', 'product'],
  },
  {
    id: 'asset-4',
    name: 'Nature_Video.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-waterfall-in-forest-2255-large.mp4',
    type: 'video',
    size: '25.6 MB',
    date: 'May 25, 2026, 2:18 PM',
    tags: ['nature', 'video'],
  },
  {
    id: 'asset-5',
    name: 'Beauty_Product_Banner.png',
    url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '1.2 MB',
    date: 'May 24, 2026, 11:07 AM',
    tags: ['beauty', 'skincare'],
  },
  {
    id: 'asset-6',
    name: 'Fitness_Promo.jpg',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '2.7 MB',
    date: 'May 24, 2026, 10:45 AM',
    tags: ['fitness', 'workout'],
  },
  {
    id: 'asset-7',
    name: 'Brand_Guidelines.pdf',
    url: '#',
    type: 'document',
    size: '18.3 MB',
    date: 'May 23, 2026, 6:30 PM',
    tags: ['brand', 'guidelines'],
  },
  {
    id: 'asset-8',
    name: 'Earth_Day_Poster.jpg',
    url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '2.3 MB',
    date: 'May 23, 2026, 3:12 PM',
    tags: ['ecology', 'green'],
  },
];

const initialLayers: Layer[] = [
  {
    id: 'layer-1',
    name: 'Text - Time to',
    type: 'text',
    content: 'Time to',
    visible: true,
    locked: false,
    opacity: 100,
    x: 100,
    y: 120,
    width: 250,
    height: 50,
    color: '#FFDE4D',
    fontSize: 48,
    fontFamily: 'Poppins',
    fontWeight: 'Bold',
  },
  {
    id: 'layer-2',
    name: 'Text - TRAVEL',
    type: 'text',
    content: 'TRAVEL',
    visible: true,
    locked: false,
    opacity: 100,
    x: 100,
    y: 180,
    width: 400,
    height: 100,
    color: '#FFFFFF',
    fontSize: 96,
    fontFamily: 'Poppins',
    fontWeight: 'Extrabold',
  },
  {
    id: 'layer-3',
    name: 'Button - EXPLORE MORE',
    type: 'shape',
    content: 'EXPLORE MORE',
    visible: true,
    locked: false,
    opacity: 100,
    x: 100,
    y: 420,
    width: 200,
    height: 50,
    color: '#FFDE4D',
  },
  {
    id: 'layer-4',
    name: 'Airplane Vector Icon',
    type: 'shape',
    content: '✈',
    visible: true,
    locked: false,
    opacity: 80,
    x: 480,
    y: 100,
    width: 80,
    height: 80,
    color: '#FFFFFF',
  },
  {
    id: 'layer-5',
    name: 'Summer background image',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    visible: true,
    locked: true,
    opacity: 100,
    x: 0,
    y: 0,
    width: 800,
    height: 800,
  },
];

const initialActivities: ActivityLog[] = [
  {
    id: 'act-1',
    user: { name: 'Sarah Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    action: 'uploaded 5 files to',
    target: 'Summer Campaign',
    time: '2 hours ago',
  },
  {
    id: 'act-2',
    user: { name: 'Mike Ross', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
    action: 'shared project',
    target: 'Fitness Series with you',
    time: '1 day ago',
  },
  {
    id: 'act-3',
    user: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
    action: 'edited',
    target: 'Mountain_Lake_View.jpg in Editor',
    time: '1 day ago',
  },
  {
    id: 'act-4',
    user: { name: 'Emily Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    action: 'commented on',
    target: 'Beauty Product Launch assets',
    time: '2 days ago',
  },
  {
    id: 'act-5',
    user: { name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    action: 'added you to',
    target: 'Real Estate Ads workspace',
    time: '4 days ago',
  },
];

const initialTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Review Summer Campaign assets',
    dueDate: 'Due today',
    completed: false,
    assignedTo: { name: 'Sarah Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  },
  {
    id: 'task-2',
    title: 'Update brand guidelines',
    dueDate: 'Due tomorrow',
    completed: false,
    assignedTo: { name: 'Mike Ross', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
  },
  {
    id: 'task-3',
    title: 'Approve Fitness Series thumbnails',
    dueDate: 'Completed',
    completed: true,
    assignedTo: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
  },
  {
    id: 'task-4',
    title: 'Prepare presentation files',
    dueDate: 'Due May 30',
    completed: false,
    assignedTo: { name: 'Emily Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
  },
];


const initialRecentFiles = [
  { id: 'rf-1', title: 'Mountain View', time: 'Edited 2 mins ago', type: 'JPG', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { id: 'rf-2', title: 'Summer Portrait', time: 'Edited 1 hour ago', type: 'PNG', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { id: 'rf-3', title: 'Skincare Product', time: 'Edited 3 hours ago', type: 'JPG', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80' },
  { id: 'rf-4', title: 'Sale Poster Design', time: 'Edited yesterday', type: 'PSD', img: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&q=80' },
  { id: 'rf-5', title: 'New York City', time: 'Edited 2 days ago', type: 'JPG', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
];

// Complete application state holding the single source of truth
interface AppState {
  currentView: ViewType;
  user: User | null;
  projects: Project[];
  activeProject: Project | null;
  assets: Asset[];
  activeAsset: Asset | null;
  layers: Layer[];
  selectedLayerId: string | null;
  activities: ActivityLog[];
  tasks: TaskItem[];
  stats: WorkspaceStats;
  selectedImage: string | null;
  recentFiles: { id: string, title: string, time: string, type: string, img: string }[];
  aiHistory: { prompt: string, img: string }[];
  activeQuickTool: string | null;
  theme: 'auto' | 'light' | 'dark';
  editorAdjustments: {
    brightness: number;
    contrast: number;
    highlights: number;
    shadows: number;
    whites: number;
    blacks: number;
    vibrance: number;
    saturation: number;
    temperature: number;
    tint: number;
  };
}

// Global state variable
let globalState: AppState = {
  currentView: 'login', // Login Page by default
  user: null,
  projects: initialProjects,
  activeProject: initialProjects[0],
  assets: initialAssets,
  activeAsset: initialAssets[0],
  layers: initialLayers,
  selectedLayerId: 'layer-1',
  activities: initialActivities,
  tasks: initialTasks,
  selectedImage: null,
  recentFiles: initialRecentFiles,
  aiHistory: [
    {
      prompt: 'Cyberpunk ramen shop, glowing lanterns, high detailed vector',
      img: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=400',
    },
    {
      prompt: 'Minimalist alpine cabin during golden hour, cinematic lighting',
      img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=400',
    },
  ],
  activeQuickTool: null,
  stats: {
    projectsCount: 12,
    filesCount: 128,
    teamMembersCount: 8,
    storageUsed: '9.4 GB',
  },
  theme: (typeof window !== 'undefined' && localStorage.getItem('phototoolkit-theme') as 'auto' | 'light' | 'dark') || 'auto',
  editorAdjustments: {
    brightness: 12,
    contrast: 18,
    highlights: -10,
    shadows: 22,
    whites: 10,
    blacks: -15,
    vibrance: 20,
    saturation: 8,
    temperature: -4,
    tint: 2,
  },
};

// Listeners collection
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

// Theme helper to update HTML element class
export function applyTheme(theme: 'auto' | 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const isDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (theme === 'dark' || (theme === 'auto' && isDarkMediaQuery.matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Apply initially
applyTheme(globalState.theme);

// External controller actions
export const store = {
  getState() {
    return globalState;
  },
  setView(view: ViewType) {
    globalState.currentView = view;
    notify();
  },
  setUser(user: User | null) {
    globalState.user = user;
    notify();
  },
  setTheme(theme: 'auto' | 'light' | 'dark') {
    globalState.theme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('phototoolkit-theme', theme);
    }
    applyTheme(theme);
    notify();
  },
  setActiveQuickTool(tool: string | null) {
    globalState.activeQuickTool = tool;
    notify();
  },
  addRecentFile(file: { title: string, img: string, type?: string }) {
    const newFile = {
      id: `rf-${Date.now()}`,
      title: file.title,
      time: 'Just now',
      type: file.type || 'IMG',
      img: file.img
    };
    // remove duplicate if exists
    let filtered = globalState.recentFiles.filter(f => f.img !== file.img);
    filtered.unshift(newFile);
    globalState.recentFiles = filtered.slice(0, 5); // keep 5
    notify();
  },
  setSelectedImage(image: string | null) {
    globalState.selectedImage = image;
    notify();
  },
  setProjects(projects: Project[]) {
    globalState.projects = projects;
    notify();
  },
  setActiveProject(proj: Project | null) {
    globalState.activeProject = proj;
    notify();
  },
  setAssets(assets: Asset[]) {
    globalState.assets = assets;
    notify();
  },
  addAsset(asset: Asset) {
    globalState.assets = [asset, ...globalState.assets];
    notify();
  },
  setActiveAsset(asset: Asset | null) {
    globalState.activeAsset = asset;
    notify();
  },
  setLayers(layers: Layer[]) {
    globalState.layers = layers;
    notify();
  },
  updateLayer(layerId: string, updates: Partial<Layer>) {
    globalState.layers = globalState.layers.map((l) =>
      l.id === layerId ? { ...l, ...updates } : l
    );
    notify();
  },
  setSelectedLayerId(id: string | null) {
    globalState.selectedLayerId = id;
    notify();
  },
  setAdjustments(adjustments: Partial<typeof globalState.editorAdjustments>) {
    globalState.editorAdjustments = {
      ...globalState.editorAdjustments,
      ...adjustments,
    };
    notify();
  },
  resetAdjustments() {
    globalState.editorAdjustments = {
      brightness: 12,
      contrast: 18,
      highlights: -10,
      shadows: 22,
      whites: 10,
      blacks: -15,
      vibrance: 20,
      saturation: 8,
      temperature: -4,
      tint: 2,
    };
    notify();
  },
  addTask(title: string) {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      dueDate: 'Due tomorrow',
      completed: false,
      assignedTo: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
    };
    globalState.tasks = [newTask, ...globalState.tasks];
    notify();
  },
  toggleTask(taskId: string) {
    globalState.tasks = globalState.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    notify();
  },
  removeAiHistory(index: number) {
    const newHistory = [...globalState.aiHistory];
    newHistory.splice(index, 1);
    globalState.aiHistory = newHistory;
    notify();
  },
  clearAiHistory() {
    globalState.aiHistory = [];
    notify();
  },
  addAiHistory(item: { prompt: string, img: string }) {
    globalState.aiHistory = [item, ...globalState.aiHistory];
    notify();
  },
};

// React hook to access state
export function useStore(): AppState {
  const [state, setState] = useState(globalState);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
}
