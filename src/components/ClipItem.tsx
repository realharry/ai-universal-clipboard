import React from 'react';
import { Copy, Trash2, FileText, Image } from 'lucide-react';
import { Clip } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface ClipItemProps {
  clip: Clip;
  onDelete: (clipId: string) => void;
}

export const ClipItem: React.FC<ClipItemProps> = ({ clip, onDelete }) => {
  const handleCopy = async () => {
    const success = await copyToClipboard(clip.content);
    if (success) {
      // Show visual feedback
      const event = new CustomEvent('clipCopied', { detail: clip.title || 'Content copied!' });
      window.dispatchEvent(event);
    }
  };

  const handleDelete = () => {
    onDelete(clip.id);
  };

  const formatTimestamp = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="group border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {clip.type === 'text' ? (
              <FileText size={14} className="text-blue-500 flex-shrink-0" />
            ) : (
              <Image size={14} className="text-green-500 flex-shrink-0" />
            )}
            <span className="text-xs text-gray-500">{formatTimestamp(clip.createdAt)}</span>
          </div>
          
          {clip.title && (
            <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
              {clip.title}
            </h4>
          )}
          
          <p className="text-sm text-gray-600 break-words">
            {truncateContent(clip.content)}
          </p>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="Copy to clipboard"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete clip"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};