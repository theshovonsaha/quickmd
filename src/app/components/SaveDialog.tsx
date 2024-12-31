// src/app/components/SaveDialog.tsx
'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

export default function SaveDialog({ isOpen, onClose, onSave }: SaveDialogProps) {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center space-x-2 mb-4">
          <Save className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-medium text-white">Save Document</h2>
        </div>
        <input
          type="text"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          autoFocus
        />
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave(title);
                setTitle('');
                onClose();
              }
            }}
            disabled={!title.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}