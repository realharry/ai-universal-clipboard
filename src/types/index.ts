export interface Clip {
  id: string;
  content: string;
  type: 'text' | 'image';
  timestamp: number;
  title?: string;
  url?: string; // For image clips
}

export interface ClipboardState {
  clips: Clip[];
}

export type ClipAction = 
  | { type: 'ADD_CLIP'; payload: Omit<Clip, 'id' | 'timestamp'> }
  | { type: 'DELETE_CLIP'; payload: string }
  | { type: 'SET_CLIPS'; payload: Clip[] };