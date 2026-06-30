
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Sparkles, ExternalLink, Terminal, Shield, MessageCircle, Info, Zap, Globe, Lock, History, Plus, Menu, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { getArchieStream } from '../services/geminiService';

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: Date;
}

interface ArchieProps {
  isPublic?: boolean;
}

const STORAGE_KEY = 'archie_sessions';

export const Archie: React.FC<ArchieProps> = ({ isPublic = false }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [grounding, setGrounding] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = useCallback((): ChatMessage => ({
    id: 'welcome-' + Date.now(),
    role: 'model',
    text: isPublic 
      ? "Welcome to the IAN Public Concierge. I am Archie. I am here to discuss our mission, global law enforcement trends, and Interpol's mandate. Please note: for privacy and security, I cannot discuss the careers or identities of any individuals."
      : "Connection established, Fellow. Archie is online. I am prepared to retrieve archival logic or analyze current Article 3 challenges. What is your query?",
    timestamp: new Date()
  }), [isPublic]);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Fix timestamps
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          lastModified: new Date(s.lastModified),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
        if (sessionsWithDates.length > 0) {
          setCurrentSessionId(sessionsWithDates[0].id);
          setMessages(sessionsWithDates[0].messages);
        } else {
          startNewSession();
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
        startNewSession();
      }
    } else {
      startNewSession();
    }
  }, []);

  // Sync current messages to session
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setSessions(prev => {
        const index = prev.findIndex(s => s.id === currentSessionId);
        if (index === -1) return prev;
        
        const newSessions = [...prev];
        const currentSession = newSessions[index];
        
        // Update title if it's still default and we have a user msg
        let title = currentSession.title;
        if (title === 'New Consultation' || title === 'Secure Session') {
           const firstUserMsg = messages.find(m => m.role === 'user');
           if (firstUserMsg) {
             title = firstUserMsg.text.slice(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '');
           }
        }

        newSessions[index] = {
          ...currentSession,
          messages,
          title,
          lastModified: new Date()
        };
        
        // Persist to local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
        return newSessions;
      });
    }
  }, [messages, currentSessionId]);

  const startNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: isPublic ? 'New Consultation' : 'Secure Session',
      messages: [welcomeMessage()],
      lastModified: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages(newSession.messages);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const selectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      if (window.innerWidth < 768) setSidebarOpen(false);
    }
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    if (currentSessionId === id) {
      if (newSessions.length > 0) {
        selectSession(newSessions[0].id);
      } else {
        startNewSession();
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isLoading]);

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
    setStreamingText('');
    setGrounding([]);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const stream = await getArchieStream(userMsg.text, isPublic, history);
      
      let fullResponse = '';
      let lastGrounding: any[] = [];
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setStreamingText(fullResponse);
        }
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          const chunks = chunk.candidates[0].groundingMetadata.groundingChunks;
          lastGrounding = chunks;
          setGrounding(chunks);
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: fullResponse,
        timestamp: new Date(),
        grounding: lastGrounding
      } as ChatMessage]);
      setStreamingText('');
    } catch (error) {
      console.error("Archie error:", error);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'model',
        text: "Signal interference detected. Please rephrase your query.",
        timestamp: new Date()
      } as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const theme = isPublic 
    ? {
        container: "bg-white border-white/10 shadow-2xl overflow-visible",
        header: "bg-white border-slate-100 text-slate-900 shadow-sm",
        bubbleBot: "bg-white border-slate-100 text-slate-800 shadow-sm text-sm md:text-base",
        bubbleUser: "bg-slate-900 text-white shadow-md text-sm md:text-base",
        input: "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-800 shadow-sm",
        sidebar: "bg-slate-50 border-r border-slate-200"
      }
    : {
        container: "bg-zinc-950 border-emerald-500/10 shadow-2xl font-mono",
        header: "bg-zinc-900 border-emerald-500/20 text-emerald-500 shadow-xl",
        bubbleBot: "bg-zinc-900/50 border-emerald-500/20 text-emerald-400 text-sm md:text-base",
        bubbleUser: "bg-zinc-800 text-zinc-100 border-zinc-700 shadow-lg text-sm md:text-base",
        input: "bg-zinc-900 border-zinc-800 text-emerald-400 placeholder:text-emerald-900 focus:border-emerald-500 shadow-inner",
        sidebar: "bg-black border-r border-emerald-500/10"
      };

  const starterPrompts = isPublic 
    ? [
        { icon: Globe, text: "What is Interpol Article 3?", sub: "Core ideology of neutrality" },
        { icon: Zap, text: "Global crime trends 2025", sub: "Briefings on emerging threats" },
        { icon: Info, text: "Support for retired officials", sub: "Introduction to IAN missions" }
      ]
    : [
        { icon: Lock, text: "RETRIEVE ARCHIVE 0x-99", sub: "Institutional logic retrieval" },
        { icon: Terminal, text: "ANALYZE CURRENT SECTOR", sub: "Regional security analysis" },
        { icon: Shield, text: "ARTICLE 2 STATUS", sub: "Human rights compliance check" }
      ];

  const conversationStarted = messages.length > 1;

  return (
    <div className={`flex h-full w-full border-none font-sans transition-all duration-700 bg-transparent ${isPublic ? 'text-slate-900' : 'text-emerald-500'}`}>
      
      {/* Sessions Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: sidebarOpen ? (window.innerWidth < 768 ? '100%' : '300px') : '0px' }}
        className={`overflow-hidden flex flex-col border-r transition-all duration-500 z-30 ${isPublic ? 'bg-slate-50 border-slate-200' : 'bg-black border-emerald-500/10'}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-inherit">
          <h4 className="font-serif text-sm tracking-widest uppercase opacity-60">Consultations</h4>
          <button onClick={startNewSession} className={`p-2 rounded-lg transition-all ${isPublic ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-emerald-500/10 text-emerald-500'}`}>
             <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {sessions.map(s => (
            <div 
              key={s.id}
              onClick={() => selectSession(s.id)}
              className={`px-6 py-4 cursor-pointer flex items-center justify-between group transition-all rounded-r-xl mr-2 ${
                currentSessionId === s.id 
                  ? (isPublic ? 'bg-white text-veranda-navy font-bold shadow-sm' : 'bg-emerald-500/10 text-emerald-500 font-bold')
                  : (isPublic ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'text-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-500')
              }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <MessageCircle className="w-3.5 h-3.5 shrink-0 opacity-40" />
                <span className="text-xs truncate tracking-tight">{s.title}</span>
              </div>
              <button 
                onClick={(e) => deleteSession(e, s.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-inherit">
           <p className="text-[9px] uppercase tracking-widest opacity-30 text-center">Local Archive Sync Active</p>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Header */}
        <header className={`px-4 md:px-8 py-4 flex items-center justify-between border-b z-20 sticky top-0 backdrop-blur-md ${isPublic ? 'bg-white/80 border-slate-100 shadow-sm' : 'bg-black/80 border-emerald-500/10'}`}>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-all ${isPublic ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-emerald-500/10 text-emerald-500'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform hover:rotate-12 ${isPublic ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-black'}`}>
              {isPublic ? <MessageCircle className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif text-base tracking-tight leading-none mb-0.5">Archie <span className={`text-[7px] uppercase tracking-widest font-sans ml-1 px-1.5 py-0.5 rounded-full ${isPublic ? 'bg-slate-100 text-slate-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{isPublic ? 'Public' : 'Vault'}</span></h3>
              <p className="text-[9px] uppercase tracking-widest opacity-30 font-bold leading-none">Status: {isLoading ? 'Processing' : 'Standby'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`hidden md:flex flex-col items-end opacity-20 text-[8px] uppercase tracking-[0.2em] font-bold ${isPublic ? 'text-slate-900' : 'text-emerald-500'}`}>
               <span>Encrypted Link</span>
               <span>Search Grounding</span>
            </div>
          </div>
        </header>

        {/* Messages / Dashboard Area */}
        <div ref={scrollRef} className={`flex-1 overflow-y-auto px-4 py-8 md:px-12 lg:px-20 space-y-10 scroll-smooth transition-colors duration-1000 ${isPublic ? 'bg-[#fdfdfd]' : 'bg-[#030712]'}`}>
          {!conversationStarted && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-5xl mx-auto py-8 md:py-16 text-center"
            >
               <div className={`w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform ${isPublic ? 'bg-slate-100 text-slate-900' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                  {isPublic ? <Sparkles className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
               </div>
               <h2 className={`text-4xl md:text-5xl font-serif mb-4 tracking-tight leading-tight ${isPublic ? 'text-slate-900' : 'text-white'}`}>
                  {isPublic ? "Research Consultation" : "SECURE TERMINAL"}
               </h2>
               <p className={`text-sm md:text-base mb-12 max-w-xl mx-auto leading-relaxed opacity-60 ${isPublic ? 'text-slate-600' : 'text-emerald-500/60'}`}>
                  {isPublic 
                    ? "Welcome to Archie, the institutional guardian. I analyze Interpol history and global law enforcement trends."
                    : "Archie operational. Local archival sync active. Enter query."
                  }
               </p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
                  {starterPrompts.map((p, i) => {
                     const Icon = p.icon;
                     return (
                       <motion.button
                         key={i}
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: i * 0.1 }}
                         onClick={() => handleSend(p.text)}
                         className={`p-5 text-left rounded-xl border transition-all hover:translate-y-[-2px] active:scale-95 group relative overflow-hidden ${
                           isPublic 
                            ? 'bg-white border-slate-100 hover:border-slate-300 shadow-sm' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/50'
                         }`}
                       >
                          <div className={`mb-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isPublic ? 'bg-slate-50 text-slate-900 group-hover:bg-slate-900 group-hover:text-white' : 'bg-emerald-500/5 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black'}`}>
                             <Icon className="w-4 h-4" />
                          </div>
                          <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isPublic ? 'text-slate-900' : 'text-emerald-500'}`}>{p.text}</h4>
                          <p className={`text-[9px] leading-snug font-sans truncate ${isPublic ? 'text-slate-400' : 'text-emerald-500/40'}`}>{p.sub}</p>
                       </motion.button>
                     );
                  })}
               </div>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} max-w-6xl mx-auto w-full`}
              >
                <div className={`flex items-start max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                   <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center shadow transition-transform mt-1 ${
                      msg.role === 'user' 
                        ? (isPublic ? 'bg-slate-100 text-slate-400' : 'bg-zinc-800 text-emerald-500')
                        : (isPublic ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-black')
                   }`}>
                      {msg.role === 'user' ? <Shield className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
                   </div>
                   <div className={`p-5 rounded-2xl border text-sm md:text-base leading-relaxed ${
                      msg.role === 'user' ? theme.bubbleUser : theme.bubbleBot
                   }`}>
                     <p className="whitespace-pre-wrap">{msg.text}</p>
                     
                     {msg.grounding && msg.grounding.length > 0 && (
                       <div className={`mt-4 pt-4 border-t font-sans ${isPublic ? 'border-slate-100' : 'border-emerald-500/20'}`}>
                         <p className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-2 font-bold">Citations:</p>
                         <div className="flex flex-wrap gap-2">
                           {msg.grounding.map((g: any, i: number) => g.web && (
                             <a 
                               key={i} 
                               href={g.web.uri} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className={`flex items-center text-[9px] px-2.5 py-1 rounded-full border transition-all ${
                                 isPublic 
                                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
                                  : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black'
                               }`}
                             >
                               <ExternalLink className="w-2.5 h-2.5 mr-1" /> {g.web.title}
                             </a>
                           ))}
                         </div>
                       </div>
                     )}
                     <span className="text-[8px] opacity-20 block mt-3 font-bold tracking-widest text-right">
                       {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {streamingText && (
            <div className="flex justify-start max-w-6xl mx-auto w-full">
              <div className="flex items-start max-w-[95%] md:max-w-[85%] space-x-3">
                 <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-emerald-500 text-black shadow animate-pulse mt-1`}>
                    <Terminal className="w-3.5 h-3.5" />
                 </div>
                 <div className={`p-5 rounded-2xl border text-sm md:text-base leading-relaxed ${theme.bubbleBot}`}>
                   <p className="whitespace-pre-wrap">{streamingText}</p>
                   <span className={`inline-block w-1.5 h-4 bg-current animate-pulse ml-0.5 align-middle ${isPublic ? 'text-slate-900' : 'text-emerald-500'}`}></span>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={`p-6 md:p-8 border-t z-20 ${isPublic ? 'bg-white border-slate-100' : 'bg-[#030712] border-emerald-500/10'}`}>
          <div className="max-w-5xl mx-auto relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isPublic ? "Inquire about mission, mandate, or crime trends..." : "EXECUTE SECURE QUERY..."}
              className={`w-full pl-6 pr-14 py-4 md:py-6 rounded-2xl border focus:outline-none focus:ring-2 transition-all text-base md:text-lg font-sans ${theme.input} ${isPublic ? 'focus:ring-slate-100' : 'focus:ring-emerald-500/10'}`}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={isLoading} 
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50 group ${
                isPublic ? 'bg-slate-900 text-white hover:bg-black' : 'bg-emerald-500 text-black hover:bg-emerald-400'
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
            </button>
          </div>
          <div className="mt-4 flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-2 md:space-y-0 opacity-20 text-[8px] uppercase tracking-[0.2em] font-bold">
             <div className="flex items-center">
                <Shield className="w-2.5 h-2.5 mr-1.5" />
                <span>Neutrality Protocols Enabled</span>
             </div>
             <div className="hidden md:block w-1 h-1 rounded-full bg-slate-400"></div>
             <div className="flex items-center">
                <Globe className="w-2.5 h-2.5 mr-1.5" />
                <span>Grounding: Verified Sources</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
