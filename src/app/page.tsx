'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import MDEditor from '@uiw/react-md-editor';
import { 
  Copy, FileDown, Eye, Edit2, Trash2, Save, 
  Search, Settings, Download, Upload, Share,
  Clock, Calendar, Code, Image
} from 'lucide-react';
import Header from './components/Header';
import SavedDocuments from './components/SavedDocuments';
import SaveDialog from './components/SaveDialog';
import { SavedDocument, getAllDocuments, saveDocument, deleteDocument } from './utils/storage';

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
);

const defaultMarkdown = `# Welcome to Quick MD Viewer

Start writing or paste your markdown here...`;

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  // Load documents and preferences
  useEffect(() => {
    setDocuments(getAllDocuments());
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    const savedAutoSave = localStorage.getItem('autoSave');
    if (savedAutoSave) {
      setAutoSaveEnabled(savedAutoSave === 'true');
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    let autoSaveTimer: NodeJS.Timeout;
    if (autoSaveEnabled && markdown !== defaultMarkdown) {
      autoSaveTimer = setTimeout(() => {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        saveDocument(`Autosave ${timestamp}`, markdown);
        setDocuments(getAllDocuments());
        setLastSaved(new Date());
      }, 30000); // Auto-save every 30 seconds
    }
    return () => clearTimeout(autoSaveTimer);
  }, [markdown, autoSaveEnabled]);

  // Update word and character count
  useEffect(() => {
    setCharCount(markdown.length);
    setWordCount(markdown.trim().split(/\s+/).filter(Boolean).length);
  }, [markdown]);

  const handleSave = (title: string) => {
    const newDoc = saveDocument(title, markdown);
    setDocuments(getAllDocuments());
    setLastSaved(new Date());
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
    setDocuments(getAllDocuments());
  };

  const handleSelect = (doc: SavedDocument) => {
    setMarkdown(doc.content);
    setIsPreview(false);
  };

  const handleCheckboxChange = useCallback((index: number) => {
    const lines = markdown.split('\n');
    let checkboxCount = 0;
    
    const updatedLines = lines.map(line => {
      if (line.match(/^\s*- \[([ x])\]/i)) {
        if (checkboxCount === index) {
          return line.replace(/\[([ x])\]/i, line.includes('[x]') ? '[ ]' : '[x]');
        }
        checkboxCount++;
      }
      return line;
    });
    
    setMarkdown(updatedLines.join('\n'));
  }, [markdown]);

  // Handle file paste (including images)
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result;
          const imageMarkdown = `\n![Pasted Image](${imageData})\n`;
          setMarkdown(prev => prev + imageMarkdown);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Header />
      <main className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-neutral-950 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          {/* Search and Settings Bar */}
          <div className="mb-4 flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAutoSaveEnabled(!autoSaveEnabled);
                  localStorage.setItem('autoSave', (!autoSaveEnabled).toString());
                }}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  autoSaveEnabled ? 'bg-green-600' : 'bg-neutral-700'
                }`}
              >
                <Clock className="h-4 w-4 inline mr-2" />
                Auto-save
              </button>
              <button
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
                }}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Document List */}
          <SavedDocuments
            documents={filteredDocuments}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onUpload={(title, content) => {
              const newDoc = saveDocument(title, content);
              setDocuments(getAllDocuments());
              setMarkdown(content);
            }}
          />

          {/* Status Bar */}
          <div className="mb-4 text-sm text-neutral-400 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
            {lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>

          {/* Editor Container */}
          <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-neutral-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    text-white hover:bg-neutral-700 active:bg-neutral-600"
                >
                  {isPreview ? (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSaveDialogOpen(true)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    text-white hover:bg-neutral-700 active:bg-neutral-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(markdown)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    text-white hover:bg-neutral-700 active:bg-neutral-600"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([markdown], {type: 'text/markdown'});
                    element.href = URL.createObjectURL(file);
                    element.download = 'document.md';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    text-white hover:bg-neutral-700 active:bg-neutral-600"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear the editor?')) {
                      setMarkdown('');
                    }
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-400 rounded-md transition-colors
                    hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </button>
              </div>
            </div>

            {/* Editor/Preview Area */}
            <div 
              className="min-h-[calc(100vh-12rem)]"
              onPaste={handlePaste}
            >
              {!isPreview ? (
                <MDEditor
                  value={markdown}
                  onChange={(val) => setMarkdown(val || '')}
                  preview="edit"
                  className="w-full border-none !min-h-[calc(100vh-12rem)]"
                />
              ) : (
                <div className="p-8 bg-neutral-900">
                  <MDPreview 
                    source={markdown}
                    className="prose prose-invert max-w-none"
                    components={{
                      input: (props: any) => {
                        if (props.type === 'checkbox') {
                          return (
                            <input
                              type="checkbox"
                              checked={props.checked}
                              onChange={() => handleCheckboxChange(props.index)}
                              className="cursor-pointer rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                            />
                          );
                        }
                        return <input {...props} />;
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SaveDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}