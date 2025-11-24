import React from 'react';
import { ModelType } from '../types';
import { MODEL_LABELS } from '../constants';
import { Sparkles, Zap, BrainCircuit, Download } from 'lucide-react';

interface HeaderProps {
  currentModel: ModelType;
  onModelChange: (model: ModelType) => void;
  onOpenInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentModel, onModelChange, onOpenInstall }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 hidden sm:block">
            Francis-AI
          </h1>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 sm:hidden">
            Francis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onModelChange(ModelType.FLASH)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentModel === ModelType.FLASH
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Zap size={14} className={currentModel === ModelType.FLASH ? 'text-amber-500' : ''} />
              <span className="hidden sm:inline">Flash</span>
            </button>
            <button
              onClick={() => onModelChange(ModelType.PRO)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentModel === ModelType.PRO
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BrainCircuit size={14} className={currentModel === ModelType.PRO ? 'text-indigo-500' : ''} />
              <span className="hidden sm:inline">Pro</span>
            </button>
          </div>

          {/* Install Button */}
          <button
            onClick={onOpenInstall}
            className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-all text-xs font-medium"
            title="Download App"
          >
            <Download size={16} className="md:mr-1.5" />
            <span className="hidden md:inline">Get App</span>
          </button>
        </div>
      </div>
    </header>
  );
};