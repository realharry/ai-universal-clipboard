import React, { useState } from 'react';
import { Plus, Type } from 'lucide-react';

interface AddClipFormProps {
  onAddClip: (content: string, title?: string) => void;
}

export const AddClipForm: React.FC<AddClipFormProps> = ({ onAddClip }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddClip(content.trim(), title.trim() || undefined);
      setContent('');
      setTitle('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setTitle('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        <Plus size={16} />
        <span>Add new clip</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <Type size={16} className="text-blue-500" />
        <span className="text-sm font-medium text-gray-700">Add Text Clip</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <textarea
            placeholder="Enter your text content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Clip
          </button>
        </div>
      </div>
    </form>
  );
};