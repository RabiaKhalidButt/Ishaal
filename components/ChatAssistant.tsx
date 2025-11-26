
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { createDesignChat, sendMessageToGemini } from '../services/geminiService';
import { Chat } from '@google/genai';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initChat = async () => {
    if (chatSession) return;

    setConnectionStatus('connecting');
    try {
      const chat = createDesignChat();
      if (chat) {
        setChatSession(chat);
        setConnectionStatus('connected');
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'init',
                    role: 'model',
                    text: "Hello! I'm Ishaal, your personal design assistant. How can I help you furnish your dream space today?",
                    timestamp: new Date()
                }
            ]);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch (e) {
        console.error("Chat init error", e);
        setConnectionStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen && connectionStatus === 'idle') {
      initChat();
    }
  }, [isOpen, connectionStatus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const replyText = await sendMessageToGemini(chatSession, userMsg.text);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: replyText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-brand-900 rotate-90 opacity-0 pointer-events-none' : 'bg-brand-800 text-white opacity-100'}`}
      >
        <div className="relative">
            <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            <MessageSquare className="w-6 h-6" />
        </div>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 transform origin-bottom-right border border-brand-100 ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-brand-900 p-4 rounded-t-2xl flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
             <div className="bg-brand-700 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-brand-100" />
             </div>
             <div>
                 <h3 className="font-serif font-medium">Design Assistant</h3>
                 <p className="text-xs text-brand-300 flex items-center gap-1">
                    {connectionStatus === 'connected' && <span className="w-2 h-2 bg-green-400 rounded-full"></span>}
                    {connectionStatus === 'connecting' && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>}
                    {connectionStatus === 'error' && <span className="w-2 h-2 bg-red-400 rounded-full"></span>}
                    {connectionStatus === 'connected' ? 'Online' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                 </p>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:text-brand-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-50 scrollbar-hide">
          {connectionStatus === 'error' ? (
             <div className="flex flex-col items-center justify-center h-full text-brand-400 space-y-4">
                <AlertCircle className="w-12 h-12 opacity-50" />
                <p className="text-center text-sm px-4">Unable to connect to the Design Assistant. Please check your API key.</p>
                <button 
                    onClick={initChat}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-200 text-brand-900 rounded-full text-sm font-medium hover:bg-brand-300 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Retry Connection
                </button>
             </div>
          ) : (
              <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-800 text-white rounded-br-none'
                            : 'bg-white border border-brand-200 text-brand-900 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-brand-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
              </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-brand-100 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={connectionStatus === 'connected' ? "Ask about design tips..." : "Connecting..."}
              disabled={isLoading || connectionStatus !== 'connected'}
              className="flex-1 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-brand-900 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || connectionStatus !== 'connected'}
              className="p-2 bg-brand-800 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
