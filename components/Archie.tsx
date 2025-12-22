import React, { useState, useRef, useEffect } from 'react';
import { Phone, Send, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToArchie } from '../services/geminiService';

export const Archie: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello. I am Archie. I can assist with archive retrieval, or we can discuss the evolution of the organization. Shall we talk about the General Assembly or perhaps Article 3 compliance?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textInput: string = input) => {
    if (!textInput.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Call Gemini
    const responseText = await sendMessageToArchie(userMsg.text, history);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || "I apologize, the line seems to be static.",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="bg-vault-paper h-[600px] border-4 border-vault-mahogany rounded-lg shadow-2xl flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="bg-vault-mahogany p-4 flex items-center shadow-lg z-10">
        <div className="bg-vault-amber/20 p-2 rounded-full border border-vault-amber/50 mr-4">
          <Phone className="w-6 h-6 text-vault-amber" />
        </div>
        <div>
          <h3 className="text-vault-amber font-serif text-xl tracking-wide">Archie</h3>
          <p className="text-vault-amber/60 text-xs uppercase tracking-widest">Concierge Bot • Custodian of the Spirit</p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-lg shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-white border-slate-200 text-slate-800' 
                  : 'bg-stone-100 border-stone-300 text-vault-charcoal font-serif'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[10px] opacity-50 block mt-2 text-right">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-100 border-stone-300 p-4 rounded-lg flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-vault-mahogany" />
              <span className="text-xs text-stone-500 font-serif italic">Consulting the archives...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="bg-stone-100 px-4 py-2 border-t border-stone-200 flex space-x-2 overflow-x-auto">
         <button onClick={() => handleQuickPrompt("Tell me about Article 3.")} className="flex items-center space-x-1 text-[10px] uppercase tracking-wider bg-white border border-stone-300 px-3 py-1 rounded-full text-stone-600 hover:text-vault-mahogany hover:border-vault-mahogany whitespace-nowrap transition-colors">
            <Sparkles className="w-3 h-3" />
            <span>Article 3 Neutrality</span>
         </button>
         <button onClick={() => handleQuickPrompt("How have Red Notices evolved?")} className="flex items-center space-x-1 text-[10px] uppercase tracking-wider bg-white border border-stone-300 px-3 py-1 rounded-full text-stone-600 hover:text-vault-mahogany hover:border-vault-mahogany whitespace-nowrap transition-colors">
            <Sparkles className="w-3 h-3" />
            <span>Red Notices</span>
         </button>
         <button onClick={() => handleQuickPrompt("What are the 4 Global Goals?")} className="flex items-center space-x-1 text-[10px] uppercase tracking-wider bg-white border border-stone-300 px-3 py-1 rounded-full text-stone-600 hover:text-vault-mahogany hover:border-vault-mahogany whitespace-nowrap transition-colors">
            <Sparkles className="w-3 h-3" />
            <span>Global Goals</span>
         </button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-stone-200 border-t border-vault-mahogany/30">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Archie (e.g., 'Do you remember the 2002 General Assembly?')"
            className="flex-1 bg-white border border-stone-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-vault-mahogany/50 font-serif placeholder:italic text-slate-700"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading}
            className="bg-vault-mahogany text-vault-amber px-6 py-2 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 border border-vault-amber/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-stone-500 mt-2 italic">
          Archie cannot discuss operational case data or provide emotional support.
        </p>
      </div>
    </div>
  );
};