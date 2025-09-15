import React, { useState, useEffect } from 'react';
import { Clipboard, Trash2, Download } from 'lucide-react';
import { Clip } from '../types';
import { storage } from '../utils/storage';
import { ClipList } from './ClipList';
import { AddClipForm } from './AddClipForm';
import { Toast } from './Toast';

export const Sidepanel: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load clips on component mount
  useEffect(() => {
    loadClips();
  }, []);

  // Listen for storage changes to refresh when clips are added via keyboard shortcut
  useEffect(() => {
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.clips) {
        loadClips();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  // Listen for copy events to show toast
  useEffect(() => {
    const handleClipCopied = (event: CustomEvent) => {
      showToast(event.detail);
    };

    window.addEventListener('clipCopied', handleClipCopied as EventListener);
    return () => window.removeEventListener('clipCopied', handleClipCopied as EventListener);
  }, []);

  const loadClips = async () => {
    try {
      const loadedClips = await storage.getClips();
      setClips(loadedClips);
    } catch (error) {
      console.error('Error loading clips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClip = async (content: string, title?: string) => {
    try {
      await storage.addClip({
        content,
        type: 'text',
        title,
      });
      await loadClips();
      showToast('Clip added successfully!');
    } catch (error) {
      console.error('Error adding clip:', error);
      showToast('Failed to add clip');
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    try {
      await storage.deleteClip(clipId);
      await loadClips();
      showToast('Clip deleted');
    } catch (error) {
      console.error('Error deleting clip:', error);
      showToast('Failed to delete clip');
    }
  };

  const handleClearAll = async () => {
    if (clips.length === 0) return;
    
    const confirmed = window.confirm('Are you sure you want to delete all clips? This action cannot be undone.');
    if (confirmed) {
      try {
        await storage.saveClips([]);
        setClips([]);
        showToast('All clips cleared');
      } catch (error) {
        console.error('Error clearing clips:', error);
        showToast('Failed to clear clips');
      }
    }
  };

  const handleExportClips = () => {
    const exportData = {
      clips,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipboard-clips-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Clips exported successfully!');
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
  };

  const hideToast = () => {
    setToast({ show: false, message: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={hideToast}
      />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-blue-500" />
            <h1 className="text-lg font-semibold text-gray-900">Clipboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportClips}
              disabled={clips.length === 0}
              className="p-2 text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Export clips"
            >
              <Download size={16} />
            </button>
            <button
              onClick={handleClearAll}
              disabled={clips.length === 0}
              className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Clear all clips"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">
          {clips.length} {clips.length === 1 ? 'clip' : 'clips'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <AddClipForm onAddClip={handleAddClip} />
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ClipList
            clips={clips}
            onDeleteClip={handleDeleteClip}
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-3">
        <p className="text-xs text-gray-500 text-center">
          Select text on any page and press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Shift+C</kbd> to save
        </p>
      </div>
    </div>
  );
};