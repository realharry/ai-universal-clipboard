export interface Clip {
  id: string;
  content: string;
  type: 'text' | 'image';
  createdAt: string; // Changed from timestamp to match background script
  title?: string;
  url?: string; // For image clips or source URL
}

export interface ClipboardState {
  clips: Clip[];
}

export type ClipAction = 
  | { type: 'ADD_CLIP'; payload: Omit<Clip, 'id' | 'createdAt'> }
  | { type: 'DELETE_CLIP'; payload: string }
  | { type: 'SET_CLIPS'; payload: Clip[] };