import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { MessageBubble } from './components/MessageBubble';
import { InstallModal } from './components/InstallModal';
import { Message, ModelType } from './types';
import { streamChatResponse } from './services/geminiService';
import { INITIAL_SUGGESTIONS } from './constants';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<ModelType>(ModelType.FLASH);
  const [isSearchEnabled, setIsSearchEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Attempt to get user location for better grounding (maps)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.debug("Location access denied or unavailable:", error.message);
        }
      );
    }
    
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
    setShowInstallModal(false);
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const initialAiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: '', // Start empty for streaming
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage, initialAiMessage]);
    setIsLoading(true);

    // Keep track of the current AI message content for streaming updates
    let currentAiText = '';

    await streamChatResponse(
      messages, // Pass history
      content, // user message
      model,
      isSearchEnabled,
      location,
      (chunkText) => {
        currentAiText = chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.content = chunkText;
          }
          return newMessages;
        });
      },
      (fullText, groundingMetadata) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.content = fullText;
            lastMsg.groundingMetadata = groundingMetadata;
          }
          return newMessages;
        });
        setIsLoading(false);
      },
      (error) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.content = "I encountered an error while processing your request. Please try again.";
            lastMsg.isError = true;
          }
          return newMessages;
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header 
        currentModel={model} 
        onModelChange={setModel} 
        onOpenInstall={() => setShowInstallModal(true)}
      />
      
      <InstallModal 
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={handleInstallClick}
        canInstall={!!deferredPrompt}
      />
      
      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-4 md:p-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 text-primary-600">
              <Sparkles size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">How can I help you today?</h2>
            <p className="text-slate-500 mb-8 text-center max-w-md">
              I'm Francis-AI. I can help you with writing, coding, research, and creative projects.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="p-4 bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md rounded-xl text-left text-sm text-slate-700 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1].content === '' && (
              <div className="flex items-center gap-2 text-slate-400 text-sm ml-12 animate-pulse">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="w-full bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-10">
        <ChatInput 
          onSend={handleSend} 
          isLoading={isLoading} 
          isSearchEnabled={isSearchEnabled}
          onToggleSearch={() => setIsSearchEnabled(!isSearchEnabled)}
        />
      </div>
    </div>
  );
};

export default App;