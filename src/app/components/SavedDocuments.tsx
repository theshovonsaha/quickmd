// src/app/components/SavedDocuments.tsx
'use client';

import { useState, useRef } from 'react';
import { SavedDocument } from '../utils/storage';
import { Trash2, FileText, ChevronDown, ChevronRight, Upload } from 'lucide-react';

interface SavedDocumentsProps {
  documents: SavedDocument[];
  onSelect: (doc: SavedDocument) => void;
  onDelete: (id: string) => void;
  onUpload: (title: string, content: string) => void;
}

export default function SavedDocuments({ 
  documents, 
  onSelect, 
  onDelete,
  onUpload 
}: SavedDocumentsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith('.md')) {
      alert('Please upload a Markdown (.md) file');
      return;
    }

    try {
      const content = await file.text();
      // Remove .md extension from filename to use as title
      const title = file.name.replace(/\.md$/, '');
      onUpload(title, content);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-4 text-white mb-6">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <h2 className="text-lg font-medium">Saved Documents</h2>
          <span className="text-sm text-neutral-400 ml-2">({documents.length})</span>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".md"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Upload Markdown file"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">Upload MD</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              <p className="text-sm">No documents yet</p>
              <p className="text-xs mt-1">Upload a markdown file or create a new document</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors group"
              >
                <button
                  className="flex items-center space-x-3 flex-1 text-left"
                  onClick={() => onSelect(doc)}
                >
                  <FileText className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-neutral-400">
                      Updated {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this document?')) {
                      onDelete(doc.id);
                    }
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-neutral-600 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}