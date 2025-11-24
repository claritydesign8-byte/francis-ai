import React, { useState, useRef, useEffect } from 'react';
import { Send, Globe, Sparkles, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isSearchEnabled: boolean;
  onToggleSearch: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading, 
  isSearchEnabled, 
  onToggleSearch 
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-6">
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-lg ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Francis anything..."
            className="w-full bg-transparent border-none rounded-t-2xl px-4 py-4 text-slate-800 placeholder-slate-400 focus:ring-0 resize-none min-h-[60px] max-h-[200px]"
            rows={1}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleSearch}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isSearchEnabled 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
                title="Enable Google Search for real-time information"
              >
                <Globe size={14} className={isSearchEnabled ? 'animate-pulse' : ''} />
                {isSearchEnabled ? 'Search On' : 'Search Off'}
              </button>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${
                !input.trim() || isLoading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg transform active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
      <p className="text-center text-xs text-slate-400 mt-3">
        Francis-AI can make mistakes. Please verify important information.
      </p>
    </div>
  );
};