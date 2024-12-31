import { FileText, Github, Settings, Command } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <h1 className="text-lg font-medium text-white">Quick MD Viewer</h1>
            <div className="hidden sm:flex items-center ml-3 px-3 py-1 rounded-md bg-neutral-800/50 border border-neutral-700/50">
              <Command className="w-4 h-4 text-neutral-400 mr-2" />
              <span className="text-xs text-neutral-400">Press ⌘K to search</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/theshovonsaha"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors duration-200"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            <div className="w-px h-6 bg-neutral-800 mx-1" />
            <button 
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors duration-200"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button 
              className="hidden sm:flex items-center px-3 py-1.5 ml-2 text-sm text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              New Document
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}