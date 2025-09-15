import { Clip } from '../types';

const STORAGE_KEY = 'clipboard-clips';

export const storage = {
  async getClips(): Promise<Clip[]> {
    try {
      const result = await chrome.storage.local.get([STORAGE_KEY]);
      return result[STORAGE_KEY] || [];
    } catch (error) {
      console.error('Error getting clips from storage:', error);
      return [];
    }
  },

  async saveClips(clips: Clip[]): Promise<void> {
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: clips });
    } catch (error) {
      console.error('Error saving clips to storage:', error);
    }
  },

  async addClip(clip: Omit<Clip, 'id' | 'timestamp'>): Promise<void> {
    const clips = await this.getClips();
    const newClip: Clip = {
      ...clip,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    clips.unshift(newClip); // Add to beginning
    await this.saveClips(clips);
  },

  async deleteClip(clipId: string): Promise<void> {
    const clips = await this.getClips();
    const filteredClips = clips.filter(clip => clip.id !== clipId);
    await this.saveClips(filteredClips);
  },
};