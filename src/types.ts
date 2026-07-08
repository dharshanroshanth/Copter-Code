/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro';
  storageUsed: number; // in GB
  storageLimit: number; // in GB
  creditsUsed: number;
  creditsLimit: number;
}

export type ViewType =
  | 'landing'
  | 'login'
  | 'quick-tools'
  | 'bg-remover'
  | 'enhancer'
  | 'obj-remover'
  | 'passport'
  | 'ocr'
  | 'signup'
  | 'dashboard'
  | 'editor'
  | 'tools'
  | 'ai-studio'
  | 'creator-studio'
  | 'motion'
  | 'templates'
  | 'projects'
  | 'files'
  | 'workspace'
  | 'settings'
  | 'resources';

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape';
  content?: string; // Text string or Image URL
  visible: boolean;
  locked: boolean;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // Fill or text color
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  width: number;
  height: number;
  type: string; // e.g. 'JPG', 'PNG', 'PSD'
  updatedAt: string;
  size: string;
  tags: string[];
}

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'font';
  size: string;
  date: string;
  tags: string[];
  owner?: string;
  shared?: boolean;
}

export interface WorkspaceStats {
  projectsCount: number;
  filesCount: number;
  teamMembersCount: number;
  storageUsed: string;
}

export interface ActivityLog {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  time: string;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignedTo: {
    name: string;
    avatar: string;
  };
}
