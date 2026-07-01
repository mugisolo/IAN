
import React, { useState, useEffect } from 'react';
import { ViewState, Member, AppEvent, ForumPost, ForumTopic, LanguageCode, AlumniStory, StoryComment } from '../types';
import { MOCK_MEMBERS, FORUM_TOPICS, MOCK_EVENTS, MOCK_FORUM_POSTS, MEMBERSHIP_TIERS, INTERPOL_LANGUAGES, ALUMNI_STORIES } from '../constants';
import { Archie } from './Archie';
import { 
  Users, Calendar, FileText, Heart, Search, 
  LogOut, ShieldCheck, MessageSquare, Globe,
  Youtube, ExternalLink, PlusCircle, ArrowLeft, BadgeCheck, CreditCard, Award, CheckCircle2, X, Upload, FileCheck, Lock, Paperclip, Sparkles, Loader2,
  Clock, UserCircle, HandHeart, BookOpen, Settings, Check, MessageCircle, Send, Terminal, Pin, CalendarDays, List, ChevronRight, ThumbsUp, Trash, Trash2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { auth } from '../services/firebase.ts';
import { 
  createGoogleCalendarEvent, 
  createGoogleDoc, 
  listGoogleTasks, 
  createGoogleTask, 
  updateGoogleTaskStatus, 
  deleteGoogleTask 
} from '../services/workspace.ts';

interface ForumCommentProps {
  post: ForumPost;
  depth?: number;
}

const ForumComment: React.FC<ForumCommentProps> = ({ post, depth = 0 }) => (
  <div className={`border-l-2 border-stone-100 pl-4 py-4 ${depth > 0 ? 'mt-4' : 'border-b border-stone-50'}`}>
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold text-vault-mahogany">{post.author}</span>
        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">[{post.role}]</span>
      </div>
      <span className="text-[10px] text-stone-400">{post.timestamp}</span>
    </div>
    <p className="text-stone-700 font-serif text-lg leading-relaxed mb-3">{post.content}</p>
    {post.imageUrls && post.imageUrls.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {post.imageUrls.map((url, i) => (
          <img key={i} src={url} alt="Post content" className="w-48 h-32 object-cover rounded-sm border border-stone-200" />
        ))}
      </div>
    )}
    <div className="flex items-center space-x-4 mt-3">
       <button className="flex items-center space-x-1 text-[10px] uppercase font-bold text-stone-400 hover:text-vault-mahogany transition-colors">
          <ThumbsUp className="w-3 h-3" /> <span>{post.likes || 0} Likes</span>
       </button>
       <button className="text-[10px] uppercase font-bold text-stone-400 hover:text-vault-mahogany transition-colors">
          Reply
       </button>
    </div>
    {post.replies && post.replies.length > 0 && (
      <div className="ml-4">
        {post.replies.map(reply => (
          <ForumComment key={reply.id} post={reply} depth={depth + 1} />
        ))}
      </div>
    )}
  </div>
);

interface VaultProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  isNewUser?: boolean;
}

export const Vault: React.FC<VaultProps> = ({ currentView, onNavigate, onLogout, isNewUser = false }) => {
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  const { t, language, setLanguage } = useLanguage();
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [events, setEvents] = useState<AppEvent[]>(MOCK_EVENTS);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [rsvpToast, setRsvpToast] = useState<string | null>(null);
  const [isExportingDoc, setIsExportingDoc] = useState(false);
  const [exportedLink, setExportedLink] = useState<string | null>(null);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState<Record<string, boolean>>({});
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) return;

        // Fetch User and sync state
        const syncRes = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          }
        });
        if (syncRes.ok) {
          const u = await syncRes.json();
          setDbUser(u);
          if (u.avatarUrl) {
            setCurrentUserAvatar(u.avatarUrl);
          }
        }

        // Fetch Events
        const eventsRes = await fetch('/api/events', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (eventsRes.ok) {
          const evData = await eventsRes.json();
          setEvents(evData);
        }

        // Fetch Tasks
        const tasksRes = await fetch('/api/tasks', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (tasksRes.ok) {
          const tData = await tasksRes.json();
          setTasksList(tData);
        }
      } catch (err) {
        console.error('Failed to load cloud backend data:', err);
      }
    };

    // Listen for Auth changes and trigger fetch
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadBackendData();
      }
    });
    return () => unsubscribe();
  }, []);

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [isStartingTopic, setIsStartingTopic] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({ title: '', category: '', description: '', startDocument: '' });
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(FORUM_TOPICS);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(MOCK_MEMBERS[0].avatarUrl);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  
  const [topicPhotos, setTopicPhotos] = useState<string[]>([]);
  const [postPhotos, setPostPhotos] = useState<string[]>([]);
  const [postContent, setPostContent] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'topic' | 'post') => {
    const files = e.target.files;
    if (!files) return;

    const loaders = Array.from(files).map((file: any) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file as Blob);
      });
    });

    Promise.all(loaders).then(urls => {
      if (target === 'avatar') {
        setCurrentUserAvatar(urls[0]);
        setRsvpToast("Profile selection updated.");
      } else if (target === 'topic') {
        setTopicPhotos(prev => [...prev, ...urls]);
      } else if (target === 'post') {
        setPostPhotos(prev => [...prev, ...urls]);
      }
    });
  };

  const handleDocumentUpload = () => {
    setIsUploadingDoc(true);
    // Simulate upload
    setTimeout(() => {
      setNewTopicForm(prev => ({ ...prev, startDocument: 'institution_brief_v1.pdf' }));
      setIsUploadingDoc(false);
    }, 1500);
  };

  const handleCreateTopic = () => {
    if (!newTopicForm.title || !newTopicForm.category) return;
    const newTopic: ForumTopic = {
      id: `topic-${Date.now()}`,
      ...newTopicForm,
      startImages: topicPhotos,
      activeCount: 1,
      lastActive: 'Just now',
      isPinned: false
    };
    setForumTopics([newTopic, ...forumTopics]);
    setIsStartingTopic(false);
    setNewTopicForm({ title: '', category: '', description: '', startDocument: '' });
    setTopicPhotos([]);
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && postPhotos.length === 0) return;
    
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: auth.currentUser?.displayName || MOCK_MEMBERS[0].name,
      role: MOCK_MEMBERS[0].role,
      content: postContent,
      timestamp: 'Just now',
      imageUrls: postPhotos,
      likes: 0
    };

    setForumPosts([newPost, ...forumPosts]);
    setPostContent('');
    setPostPhotos([]);
    setRsvpToast("Perspective transmitted to channel.");
  };
  
  const [activeStory, setActiveStory] = useState<AlumniStory | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>('50');
  const [isConnected, setIsConnected] = useState<Record<string, boolean>>({});
  
  const [adviceInput, setAdviceInput] = useState('');
  const [localStories, setLocalStories] = useState<AlumniStory[]>(ALUMNI_STORIES);
  
  const [eventViewMode, setEventViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiSearchResults, setAiSearchResults] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim()) return;
    setIsAiSearching(true);
    setAiSearchResults(null);
    
    // Construct context from members and stories
    const context = `
      MEMBER DIRECTORY:
      ${MOCK_MEMBERS.map(m => `${m.name} (${m.role}): Expertise in ${m.pillars.join(', ')}. Located in ${m.location}.`).join('\n')}
      
      ARCHIVE STORIES:
      ${localStories.map(s => `${s.title} by ${s.author} (${s.year}): ${s.snippet}`).join('\n')}
    `;
    
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: aiSearchQuery,
          dataContext: context,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setAiSearchResults(data.text || 'No results found.');
    } catch (err) {
      console.error('Vault Search Error:', err);
      setAiSearchResults('The search engine failed to retrieve results.');
    } finally {
      setIsAiSearching(false);
    }
  };

  useEffect(() => {
    if (rsvpToast) {
      const timer = setTimeout(() => setRsvpToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [rsvpToast]);

  const handleRunAiAnalysis = async () => {
    if (!activeTopic) return;
    setIsAnalyzing(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topicTitle: activeTopic.title,
          content: activeTopic.description,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setAiAnalysis(data.text || 'No analysis available.');
    } catch (err) {
      console.error('Topic analysis error:', err);
      setAiAnalysis('The analytical engine encountered a processing error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConnect = (id: string) => {
    setIsConnected(prev => ({ ...prev, [id]: true }));
    setRsvpToast("Connection request transmitted.");
  };

  const handleRsvp = async (event: AppEvent) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        setRsvpToast("Please login with Google to RSVP.");
        return;
      }

      const res = await fetch(`/api/events/${event.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        setRsvpToast(result.rsvped ? `RSVP registered for: ${event.title}` : `RSVP cancelled for: ${event.title}`);
        
        // Refresh events list
        const eventsRes = await fetch('/api/events', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (eventsRes.ok) {
          const updatedEvents = await eventsRes.json();
          setEvents(updatedEvents);
        }
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error('RSVP failed:', err);
    }
  };

  const handleSyncToGoogleCalendar = async (event: AppEvent) => {
    try {
      setIsSyncingCalendar(prev => ({ ...prev, [event.id]: true }));
      
      const googleEvent = await createGoogleCalendarEvent({
        title: `IAN Event: ${event.title}`,
        description: event.description,
        date: event.date,
        time: event.time,
      });

      // Update local state with the Google Meet Link
      setEvents(prev => prev.map(e => e.id === event.id ? { 
        ...e, 
        googleEventId: googleEvent.eventId, 
        googleMeetLink: googleEvent.meetLink 
      } : e));

      setRsvpToast(`Event synced! Google Meet room created.`);
    } catch (err) {
      console.error('Failed to sync to Google Calendar:', err);
      alert('Could not sync to Google Calendar. Ensure Google Calendar access permissions are granted.');
    } finally {
      setIsSyncingCalendar(prev => ({ ...prev, [event.id]: false }));
    }
  };

  const handleAddTask = async (title: string) => {
    if (!title.trim()) return;
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) return;

      let googleTaskId = '';
      try {
        const googleTask = await createGoogleTask(title);
        googleTaskId = googleTask.id;
      } catch (gErr) {
        console.warn('Google Tasks sync failed (saving locally only):', gErr);
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ title, googleTaskId })
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasksList(prev => [...prev, newTask]);
        setRsvpToast("Duty registered and synced to Google Tasks.");
      }
    } catch (err) {
      console.error('Failed to add duty:', err);
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean, googleTaskId?: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) return;

      if (googleTaskId) {
        try {
          await updateGoogleTaskStatus(googleTaskId, completed);
        } catch (gErr) {
          console.warn('Google Tasks sync update failed:', gErr);
        }
      }

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ completed })
      });

      if (res.ok) {
        setTasksList(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
        setRsvpToast(completed ? "Duty marked completed!" : "Duty reopened.");
      }
    } catch (err) {
      console.error('Failed to toggle duty:', err);
    }
  };

  const handleDeleteTask = async (taskId: number, googleTaskId?: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) return;

      if (googleTaskId) {
        try {
          await deleteGoogleTask(googleTaskId);
        } catch (gErr) {
          console.warn('Google Tasks deletion sync failed:', gErr);
        }
      }

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (res.ok) {
        setTasksList(prev => prev.filter(t => t.id !== taskId));
        setRsvpToast("Duty deleted successfully.");
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleAddAdvice = () => {
    if (!activeStory || !adviceInput.trim()) return;

    const newComment: StoryComment = {
      id: Date.now().toString(),
      author: auth.currentUser?.displayName || 'Ross Halliday',
      role: 'Founding Director',
      text: adviceInput,
      timestamp: 'Just now'
    };

    const updatedStories = localStories.map(s => {
      if (s.id === activeStory.id) {
        return {
          ...s,
          comments: [...(s.comments || []), newComment]
        };
      }
      return s;
    });

    setLocalStories(updatedStories);
    setActiveStory(updatedStories.find(s => s.id === activeStory.id) || null);
    setAdviceInput('');
    setRsvpToast("Advice appended to Archive.");
  };

  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const disabled = isNewUser && view !== ViewState.VAULT_VERIFICATION && view !== ViewState.VAULT_DASHBOARD;
    
    return (
      <button 
        disabled={disabled}
        onClick={() => {
          onNavigate(view);
          setActiveTopic(null);
          setAiAnalysis(null);
          setActiveStory(null);
          setExportedLink(null);
        }}
        className={`w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 border-l-4 rtl:border-l-0 rtl:border-r-4 ${
          currentView === view 
            ? 'bg-vault-amber/10 border-vault-amber text-vault-amber' 
            : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-white/5'
        } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Icon className="w-5 h-5 rtl:ml-3" />
        <span className="uppercase tracking-widest text-[10px] font-bold">{label}</span>
      </button>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.VAULT_PROFILE:
        const userMember = {
          ...MOCK_MEMBERS[0],
          name: auth.currentUser?.displayName || MOCK_MEMBERS[0].name,
          email: auth.currentUser?.email || MOCK_MEMBERS[0].email || 'ross.h@ian-vault.org',
        }; 
        return (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
             <div className="bg-white border border-stone-200 shadow-sm rounded-sm overflow-hidden mb-8">
                <div className="h-40 md:h-48 bg-vault-charcoal relative">
                   <div className="absolute -bottom-10 md:-bottom-16 left-6 md:left-12 group">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-sm border-4 md:border-8 border-white bg-vault-amber flex items-center justify-center shadow-xl overflow-hidden relative">
                         <img src={currentUserAvatar} alt={userMember.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                         <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="w-6 h-6 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                         </label>
                      </div>
                   </div>
                   <div className="absolute top-4 right-4 flex space-x-2">
                      <span className="bg-vault-amber/20 text-vault-amber text-[7px] md:text-[8px] border border-vault-amber/30 px-2 md:px-3 py-1 font-bold uppercase tracking-widest backdrop-blur-md">
                        Institutional ID: IAN-{userMember.id.toUpperCase()}
                      </span>
                   </div>
                </div>
                <div className="pt-14 md:pt-20 pb-8 md:pb-10 px-6 md:px-12 text-stone-900">
                   <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-10 border-b border-stone-100 pb-8 space-y-6 md:space-y-0">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                           <h2 className="text-2xl md:text-3xl font-serif text-vault-mahogany font-bold">{userMember.name}</h2>
                           {userMember.verified && <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />}
                        </div>
                        <p className="text-stone-500 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold">{userMember.role} • {userMember.years}</p>
                      </div>
                      <div className="flex space-x-3 md:space-x-4 w-full md:w-auto">
                         <button className="flex-1 md:flex-none justify-center bg-stone-50 text-stone-600 border border-stone-200 px-4 md:px-5 py-3 md:py-3 text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-stone-100 flex items-center space-x-2 font-bold">
                           <Settings className="w-3 md:w-4 h-3 md:h-4" />
                           <span>Privacy</span>
                         </button>
                         <button className="flex-1 md:flex-none justify-center bg-vault-mahogany text-white px-4 md:px-6 py-3 md:py-3 text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-stone-800 flex items-center space-x-2 md:space-x-3 shadow-lg font-bold">
                           <Settings className="w-3 md:w-4 h-3 md:h-4" />
                           <span>Edit Identity</span>
                         </button>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                      <div className="md:col-span-2 space-y-8 md:space-y-10">
                         <div className="bg-stone-50/50 p-6 md:p-8 border-l-4 border-vault-amber">
                            <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-3 md:mb-4 font-bold">Legacy Narrative</label>
                            <p className="font-serif leading-relaxed text-stone-700 text-base md:text-lg italic">"{userMember.bio}"</p>
                         </div>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            <div>
                               <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3 font-bold">Communication</label>
                               <div className="space-y-3">
                                  <div className="flex items-center text-sm text-stone-600 font-serif"><Globe className="w-4 h-4 mr-3 text-stone-300 shrink-0" /> {userMember.email}</div>
                                  <div className="flex items-center text-sm text-stone-600 font-serif"><Clock className="w-4 h-4 mr-3 text-stone-300 shrink-0" /> {userMember.phone || 'Not provided'}</div>
                               </div>
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3 font-bold">Pillars of Expertise</label>
                               <div className="flex flex-wrap gap-2">
                                  {userMember.pillars.map(p => (
                                    <span key={p} className="text-[8px] md:text-[9px] border border-stone-200 px-2 md:px-3 py-1 text-stone-500 uppercase font-bold tracking-widest bg-white">{p}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="space-y-6 md:space-y-8">
                         <div className="p-6 border border-stone-100 bg-white">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-4 font-bold">Fellowship Status</label>
                            <div className="flex items-center space-x-3 mb-6">
                               <div className="w-3 h-3 rounded-full bg-green-500"></div>
                               <span className="text-xs font-bold uppercase tracking-widest text-stone-900">{userMember.membershipStatus} Membership</span>
                            </div>
                            <div className="p-4 bg-vault-charcoal text-vault-amber text-center">
                               <p className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold mb-1 opacity-60">Verification Level</p>
                               <p className="text-xs md:text-sm font-bold tracking-widest uppercase">Institutional Gold</p>
                            </div>
                         </div>
                         
                         <div className="p-6 border border-stone-100 bg-stone-50">
                            <label className="block text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-4 font-bold">Diplomatic Reach</label>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                                  <span className="text-[9px] md:text-[10px] font-bold uppercase text-stone-500">Connections</span>
                                  <span className="text-xs font-bold text-stone-800">142</span>
                               </div>
                               <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                                  <span className="text-[9px] md:text-[10px] font-bold uppercase text-stone-500">Endorsements</span>
                                  <span className="text-xs font-bold text-stone-800">12</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );

      case ViewState.VAULT_GIVING:
        return (
          <div className="max-w-4xl mx-auto py-8 text-stone-900">
            <div className="text-center mb-12">
               <HandHeart className="w-16 h-16 text-vault-amber mx-auto mb-4" />
               <h2 className="text-4xl font-serif text-vault-mahogany mb-2">The Legacy Fund</h2>
               <p className="text-stone-500 italic">Supporting retired officials and the Interpol Academy.</p>
            </div>
            <div className="bg-white border border-stone-200 shadow-sm p-10 max-w-2xl mx-auto text-center">
               <h3 className="text-xl font-serif text-vault-mahogany mb-6">Contribute to the Archive</h3>
               <div className="grid grid-cols-4 gap-4 mb-8">
                 {['25', '50', '100', '500'].map(amt => (
                   <button 
                     key={amt} 
                     onClick={() => setDonationAmount(amt)}
                     className={`py-3 border-2 transition-all font-bold ${donationAmount === amt ? 'bg-vault-mahogany text-white border-vault-mahogany' : 'border-stone-200 text-stone-400 hover:border-vault-amber'}`}
                   >
                     ${amt}
                   </button>
                 ))}
               </div>
               <button className="w-full bg-vault-mahogany text-vault-amber py-4 uppercase tracking-[0.2em] text-sm font-bold shadow-lg hover:bg-stone-800 transition-colors">Confirm Contribution</button>
            </div>
          </div>
        );

      case ViewState.VAULT_STORIES:
        if (activeStory) {
          return (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <button onClick={() => setActiveStory(null)} className="flex items-center text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-6 hover:text-vault-mahogany transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Return to Archives
              </button>
              <div className="bg-vault-paper p-12 border-t-8 border-vault-mahogany shadow-2xl mb-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><ShieldCheck className="w-64 h-64 text-vault-mahogany" /></div>
                 <div className="flex justify-between items-center mb-8 border-b border-vault-mahogany/10 pb-4 text-left">
                    <span className="text-vault-mahogany/60 font-serif italic text-sm">Case Record File #{activeStory.id}</span>
                    <div className="flex items-center space-x-3">
                       <button 
                          onClick={async () => {
                             try {
                                setIsExportingDoc(true);
                                setExportedLink(null);
                                const doc = await createGoogleDoc({
                                   title: `IAN Oral History: ${activeStory.title}`,
                                   content: `IAN DEPOSITED STORY\nAuthor: ${activeStory.author}\nYear: ${activeStory.year}\n\n${activeStory.fullContent}\n\nInstitutional Comments:\n` + 
                                      (activeStory.comments?.map(c => `[${c.author} - ${c.role}]: ${c.text}`).join('\n') || 'None')
                                });
                                setExportedLink(doc.htmlLink);
                                setRsvpToast("Story successfully compiled to Google Docs.");
                             } catch (err) {
                                console.error(err);
                                alert("Failed to export to Google Docs. Ensure Google Drive/Docs permissions are granted.");
                             } finally {
                                setIsExportingDoc(false);
                             }
                          }}
                          disabled={isExportingDoc}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 border border-blue-700 disabled:opacity-50 transition-all font-sans"
                       >
                          {isExportingDoc ? (
                             <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Exporting...</span>
                             </>
                          ) : (
                             <>
                                <FileText className="w-3 h-3" />
                                <span>Export Google Doc</span>
                             </>
                          )}
                       </button>
                       <span className="text-xs uppercase font-bold text-vault-amber bg-vault-mahogany px-3 py-1">{activeStory.year}</span>
                    </div>
                 </div>

                 {exportedLink && (
                    <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-600 flex items-center justify-between text-left animate-fade-in-up">
                       <div className="flex items-center space-x-3">
                          <FileCheck className="w-5 h-5 text-blue-600 shrink-0 animate-bounce" />
                          <div>
                             <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Google Document Created Successfully</p>
                             <p className="text-[11px] text-blue-700 font-serif">You can access and edit this historical case file instantly in Google Docs.</p>
                          </div>
                       </div>
                       <a 
                          href={exportedLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] uppercase font-bold tracking-widest px-4 py-2 flex items-center space-x-1 font-sans shadow-sm"
                       >
                          <span>Open Doc</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                     </div>
                  )}
                  <h2 className="text-5xl font-serif text-vault-mahogany mb-8 leading-tight">{activeStory.title}</h2>
                 <p className="text-stone-500 text-xs uppercase tracking-[0.3em] mb-10 font-bold">DEPOSITED BY: {activeStory.author.toUpperCase()}</p>
                 <div className="prose prose-stone font-serif text-2xl leading-relaxed text-stone-800 mb-12 pb-12 border-b border-vault-mahogany/10 first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-vault-mahogany">
                   {activeStory.fullContent}
                 </div>
                 
                 <div className="bg-white/50 p-8 border-l-4 border-vault-amber shadow-sm">
                    <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-vault-mahogany mb-8 flex items-center">
                       <MessageCircle className="w-5 h-5 mr-3" /> Institutional Advice & Annotations
                    </h3>
                    <div className="space-y-8 mb-10">
                       {activeStory.comments?.map(comment => (
                         <div key={comment.id} className="border-b border-stone-200 pb-4 last:border-0">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-vault-mahogany">{comment.author} <span className="font-normal text-stone-400 ml-1">({comment.role})</span></span>
                              <span className="text-[10px] text-stone-400 uppercase">{comment.timestamp}</span>
                           </div>
                           <p className="text-base text-stone-700 italic font-serif leading-relaxed">"{comment.text}"</p>
                         </div>
                       ))}
                    </div>
                    
                    <div className="mt-8 bg-white p-4 border border-stone-200 shadow-inner">
                       <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-3 font-bold">Append your institutional perspective</label>
                       <div className="flex space-x-3">
                          <textarea 
                            value={adviceInput}
                            onChange={(e) => setAdviceInput(e.target.value)}
                            className="flex-1 bg-stone-50 border-none p-4 text-sm font-serif italic text-stone-900 focus:outline-none focus:ring-1 focus:ring-vault-amber"
                            placeholder="Share a perspective on this historical account..."
                            rows={3}
                          />
                          <button 
                            onClick={handleAddAdvice}
                            className="bg-vault-mahogany text-vault-amber px-6 flex flex-col items-center justify-center hover:bg-stone-800 transition-colors shadow-lg"
                          >
                             <Send className="w-5 h-5" />
                             <span className="text-[8px] uppercase mt-2 font-bold tracking-widest">Append</span>
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-6xl mx-auto">
             <div className="flex justify-between items-end mb-12 border-b border-vault-mahogany/20 pb-6">
                <div>
                   <h2 className="text-4xl font-serif text-vault-mahogany">The Oral History Archive</h2>
                   <p className="text-stone-500 font-serif italic mt-2 text-lg">Firsthand accounts from the Saint-Cloud and Lyon eras.</p>
                </div>
                <BookOpen className="w-10 h-10 text-vault-amber opacity-40" />
             </div>
             <div className="grid md:grid-cols-2 gap-10">
               {localStories.map(story => (
                 <div 
                   key={story.id} 
                   onClick={() => setActiveStory(story)} 
                   className="bg-vault-paper p-10 border border-vault-mahogany/10 hover:border-vault-amber shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div className="text-[10px] uppercase text-vault-mahogany/50 font-bold tracking-widest">{story.year} • {story.author.toUpperCase()}</div>
                       <div className="flex items-center text-stone-300 group-hover:text-vault-amber transition-colors">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          <span className="text-xs font-bold">{story.comments?.length || 0}</span>
                       </div>
                    </div>
                    <h3 className="text-3xl font-serif text-vault-mahogany group-hover:text-vault-amber transition-colors mb-4 leading-tight">{story.title}</h3>
                    <p className="text-stone-700 line-clamp-4 mb-8 leading-relaxed font-serif text-xl italic flex-grow">"{story.snippet}"</p>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-vault-mahogany/5">
                      {story.tags?.map(tag => (
                        <span key={tag} className="text-[8px] bg-vault-mahogany/5 text-vault-mahogany px-2 py-1 uppercase font-bold tracking-tighter">#{tag}</span>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        );

      case ViewState.VAULT_DIRECTORY:
        const filteredMembers = selectedLanguage === 'All' 
          ? MOCK_MEMBERS 
          : MOCK_MEMBERS.filter(m => m.languages.includes(selectedLanguage));
        return (
          <div className="max-w-6xl mx-auto text-stone-900">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b pb-4 space-y-4 md:space-y-0 text-left w-full">
              <h2 className="text-2xl md:text-3xl font-serif text-vault-mahogany w-full md:w-auto">Expertise Directory</h2>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or pillar..." 
                    className="pl-10 pr-4 py-3 md:py-2 bg-white border border-stone-200 text-xs focus:ring-1 focus:ring-vault-amber outline-none w-full"
                  />
                </div>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full sm:w-auto bg-white border border-stone-300 p-3 md:p-2 text-xs text-stone-900 focus:ring-1 focus:ring-vault-amber outline-none">
                   <option value="All">All Languages</option>
                   {INTERPOL_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
             </div>

             {/* AI Search Integration */}
             <div className="mb-10 bg-vault-charcoal p-6 md:p-8 border-t-4 border-vault-amber shadow-2xl">
                <div className="flex items-center space-x-3 mb-5 md:mb-6">
                  <Sparkles className="w-5 h-5 text-vault-amber" />
                  <h3 className="text-[10px] md:text-sm uppercase tracking-[0.2em] font-bold text-white">Vault Intelligence Search</h3>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <input 
                    type="text" 
                    value={aiSearchQuery}
                    onChange={(e) => setAiSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                    placeholder="e.g. 'Who has experience in environmental crime in Brazil?'"
                    className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-white text-sm focus:outline-none focus:border-vault-amber font-serif italic"
                  />
                  <button 
                    onClick={handleAiSearch}
                    disabled={isAiSearching}
                    className="bg-vault-amber text-vault-mahogany px-6 py-4 md:py-3 flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-widest hover:bg-vault-amber/80 transition-all disabled:opacity-50"
                  >
                    {isAiSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Query Vault</span>
                  </button>
                </div>
                {aiSearchResults && (
                  <div className="mt-6 md:mt-8 bg-white/5 p-4 md:p-6 border-l-2 border-vault-amber animate-fade-in-up">
                    <p className="text-white font-serif text-base md:text-lg leading-relaxed whitespace-pre-wrap">{aiSearchResults}</p>
                  </div>
                )}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
               {filteredMembers.map((member: Member) => (
                 <div key={member.id} className="bg-white p-6 md:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 hover:shadow-md transition-shadow group text-left">
                    <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover grayscale group-hover:grayscale-0 transition-all rounded-sm border border-stone-100 mx-auto sm:mx-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif text-vault-mahogany font-bold">{member.name}</h3>
                        {member.isMentor && <span className="text-[8px] bg-vault-amber text-vault-mahogany px-2 py-0.5 font-bold uppercase tracking-widest">Mentor</span>}
                      </div>
                      <p className="text-xs text-stone-500 mb-2 font-bold uppercase tracking-wider">{member.role}</p>
                      <p className="text-[10px] md:text-xs text-stone-400 mb-2 italic">{member.location} • {member.years}</p>
                      <p className="text-[10px] md:text-xs text-stone-600 font-serif italic mb-4 line-clamp-2 leading-relaxed">{member.bio}</p>
                      <div className="flex flex-wrap gap-1 mb-6">
                        {member.pillars?.map(p => <span key={p} className="text-[7px] md:text-[8px] border border-stone-200 px-1.5 py-0.5 text-stone-500 uppercase">{p}</span>)}
                      </div>
                      <button 
                        onClick={() => handleConnect(member.id)} 
                        className={`w-full py-3 md:py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                          isConnected[member.id] 
                          ? 'bg-stone-100 text-stone-400' 
                          : 'bg-vault-mahogany text-white hover:bg-stone-800'
                        }`}
                      >
                        {isConnected[member.id] ? 'Connected' : 'Transmit Request'}
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        );

      case ViewState.VAULT_DASHBOARD:
        return (
          <div className="max-w-5xl mx-auto text-stone-900">
            <h1 className="text-2xl md:text-4xl font-serif text-vault-mahogany mb-8 md:mb-12 tracking-wide flex items-center">
              {t('vault.welcome')} 
              <span className="ml-3 md:ml-4 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
               <div onClick={() => onNavigate(ViewState.VAULT_ARCHIE)} className="bg-vault-mahogany text-vault-amber p-6 md:p-8 cursor-pointer hover:bg-stone-800 transition-all shadow-xl border-b-4 border-vault-amber group">
                 <Terminal className="w-8 h-8 md:w-10 md:h-10 mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                 <h3 className="text-lg md:text-xl font-serif mb-2">{t('vault.quick.archie')}</h3>
                 <p className="text-[10px] uppercase opacity-50 tracking-widest font-bold">Vault Oracle Interface</p>
               </div>
               <div onClick={() => onNavigate(ViewState.VAULT_STORIES)} className="bg-vault-paper border border-vault-mahogany/10 p-6 md:p-8 cursor-pointer hover:shadow-lg transition-all group">
                 <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-vault-mahogany mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                 <h3 className="text-lg md:text-xl font-serif text-vault-mahogany mb-2">{t('nav.stories')}</h3>
                 <p className="text-[10px] uppercase text-stone-400 tracking-widest font-bold">Oral history archive</p>
               </div>
               <div onClick={() => onNavigate(ViewState.VAULT_FORUM)} className="bg-white border border-stone-200 p-6 md:p-8 cursor-pointer hover:shadow-lg transition-all group">
                 <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-vault-mahogany mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                 <h3 className="text-lg md:text-xl font-serif text-vault-mahogany mb-2">Briefing Room</h3>
                 <p className="text-[10px] uppercase text-stone-400 tracking-widest font-bold">Peer Discussion</p>
               </div>
               <div className="bg-gradient-to-br from-red-700 to-red-900 text-white p-6 md:p-8 shadow-xl">
                  <Youtube className="w-8 h-8 md:w-10 md:h-10 mb-4 md:mb-6" />
                  <h3 className="text-lg md:text-xl font-serif mb-1">Featured</h3>
                  <p className="text-[10px] uppercase opacity-60 tracking-widest font-bold mb-4">Latest Video</p>
                  <a href="https://www.youtube.com/@HallidaysPodcast" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-[10px] bg-white/10 px-4 py-2 hover:bg-white/20 transition-all font-bold tracking-widest border border-white/20"><ExternalLink className="w-3 h-3" /><span>Watch Briefing</span></a>
               </div>
            </div>
            
            <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
               <div className="space-y-6 text-left">
                 <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-stone-400 border-b pb-2">Upcoming Calendar</h2>
                 <div className="space-y-4">
                    {events.slice(0, 2).map(event => (
                      <div key={event.id} className="flex space-x-4 bg-white p-4 md:p-6 border border-stone-100 shadow-sm">
                        <div className="flex flex-col items-center justify-center bg-vault-mahogany text-vault-amber w-14 h-14 md:w-16 md:h-16 shrink-0">
                           <span className="text-[10px] md:text-xs font-bold uppercase">
                             {event.date.split('-')[1] === '11' ? 'NOV' : event.date.split('-')[1] === '12' ? 'DEC' : 'EVENT'}
                           </span>
                           <span className="text-lg md:text-xl font-serif font-bold">{event.date.split('-')[2]}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-base md:text-lg text-vault-mahogany">{event.title}</h4>
                          <p className="text-[10px] md:text-xs text-stone-500 mt-1 uppercase tracking-widest">{event.location}</p>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => onNavigate(ViewState.VAULT_EVENTS)} className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-vault-mahogany transition-colors">View All Events →</button>
                 </div>
               </div>
               <div className="space-y-6 text-left">
                 <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-stone-400 border-b pb-2">Service Status</h2>
                 <div className="bg-vault-charcoal p-6 md:p-8 border-l-8 border-vault-amber text-stone-300">
                    <p className="text-[9px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-6 opacity-60">Verified Credentials</p>
                    <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                       {auth.currentUser?.photoURL || currentUserAvatar ? (
                         <img src={auth.currentUser?.photoURL || currentUserAvatar} alt="User" className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full border-2 border-vault-amber" />
                       ) : (
                         <div className="w-12 h-12 md:w-14 md:h-14 bg-vault-amber rounded-full flex items-center justify-center text-vault-mahogany font-serif text-xl md:text-2xl font-bold">
                           {(auth.currentUser?.displayName || 'Ross Halliday').substring(0, 2).toUpperCase()}
                         </div>
                       )}
                       <div>
                          <h3 className="text-lg md:text-xl text-white font-serif">{auth.currentUser?.displayName || 'Ross Halliday'}</h3>
                          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-vault-amber font-bold">
                            {dbUser?.role || 'Professional Member'}
                          </p>
                          <p className="text-[8px] text-stone-400 tracking-wider truncate max-w-[200px]">{auth.currentUser?.email}</p>
                       </div>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                       <div className="flex items-center text-[9px] md:text-[10px] uppercase tracking-widest text-green-500"><CheckCircle2 className="w-4 h-4 mr-2" /> Identity Confirmed</div>
                       <div className="flex items-center text-[9px] md:text-[10px] uppercase tracking-widest text-green-500"><CheckCircle2 className="w-4 h-4 mr-2" /> Article 3 Compliant</div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Google Tasks Integrated Fellowship Duties Card */}
            <div className="mt-12 bg-white border border-stone-200 p-8 shadow-sm">
               <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div className="text-left">
                     <h3 className="text-lg md:text-xl font-serif text-vault-mahogany font-bold uppercase tracking-widest">Fellowship Duties & Tasks</h3>
                     <p className="text-xs text-stone-500 italic mt-1 font-serif">Logged in Cloud SQL and synchronized with Google Tasks.</p>
                  </div>
                  <FileCheck className="w-6 h-6 text-vault-amber animate-pulse" />
               </div>

               <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6 custom-scrollbar text-left">
                  {tasksList.length > 0 ? (
                     tasksList.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100/70 border-l-4 border-vault-amber transition-all">
                           <div className="flex items-center space-x-3 text-left">
                              <button 
                                 onClick={() => handleToggleTask(task.id, !task.completed, task.googleTaskId)}
                                 className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-600 border-green-600 text-white' : 'border-stone-300 hover:border-vault-amber'}`}
                              >
                                 {task.completed && <Check className="w-3 h-3" />}
                              </button>
                              <span className={`text-sm font-serif ${task.completed ? 'line-through text-stone-400 italic' : 'text-stone-800'}`}>{task.title}</span>
                           </div>
                           <button 
                              onClick={() => handleDeleteTask(task.id, task.googleTaskId)}
                              className="p-1 hover:text-red-600 text-stone-400 transition-colors"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     ))
                  ) : (
                     <p className="text-stone-400 italic text-sm text-center py-6 font-serif">All fellowship duties are clear. Clearance verified.</p>
                  )}
               </div>

               <form onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const input = target.elements.namedItem('taskTitle') as HTMLInputElement;
                  if (input.value.trim()) {
                     handleAddTask(input.value);
                     input.value = '';
                  }
               }} className="flex space-x-3">
                  <input 
                     type="text" 
                     name="taskTitle"
                     placeholder="Assign a new operational duty to track..."
                     className="flex-grow p-3 bg-stone-50 border border-stone-200 text-xs font-serif italic focus:ring-1 focus:ring-vault-amber outline-none"
                  />
                  <button 
                     type="submit"
                     className="bg-vault-mahogany text-white hover:bg-stone-800 px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 transition-colors font-sans"
                  >
                     <PlusCircle className="w-4 h-4" />
                     <span>Add Duty</span>
                  </button>
               </form>
            </div>
         </div>
       );

      case ViewState.VAULT_ARCHIE:
        return (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="mb-12 text-center text-stone-900">
              <h2 className="text-4xl font-serif text-vault-mahogany mb-4">The Vault Oracle</h2>
              <p className="italic font-serif text-lg text-stone-500">"Archie: Online. Direct communication with institutional logic."</p>
            </div>
            <Archie isPublic={false} />
          </div>
        );

      case ViewState.VAULT_FORUM:
        if (activeTopic) {
          return (
            <div className="max-w-4xl mx-auto animate-fade-in-up text-stone-900">
              <button onClick={() => setActiveTopic(null)} className="flex items-center text-stone-500 text-xs mb-8 uppercase tracking-widest hover:text-vault-mahogany transition-colors"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Channels</button>
              
              <div className="bg-white p-10 border border-stone-200 shadow-xl mb-8">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center space-x-3">
                     <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 px-3 py-1 text-stone-500">{activeTopic.category}</span>
                     {activeTopic.isPinned && <Pin className="w-4 h-4 text-vault-amber" />}
                     {activeTopic.startDocument && (
                       <a href="#" className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-vault-mahogany hover:text-vault-amber transition-colors border border-stone-200 px-2 py-1">
                         <FileText className="w-3 h-3" />
                         <span>Reference Doc</span>
                       </a>
                     )}
                   </div>
                   <button onClick={handleRunAiAnalysis} disabled={isAnalyzing} className="bg-vault-amber text-vault-mahogany px-4 py-2 flex items-center space-x-3 text-xs font-bold uppercase tracking-widest hover:bg-vault-amber/80 transition-all shadow-md active:scale-95 disabled:opacity-50">
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Run Deep Analysis</span>
                  </button>
                </div>
                <h2 className="text-4xl font-serif text-vault-mahogany mb-6">{activeTopic.title}</h2>
                <p className="text-stone-700 font-serif text-xl leading-relaxed mb-6 italic">"{activeTopic.description}"</p>
                
                {activeTopic.startImages && activeTopic.startImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-10">
                    {activeTopic.startImages.map((url, i) => (
                      <img key={i} src={url} alt="Topic attachment" className="w-full max-w-md h-64 object-cover border-4 border-white shadow-xl" />
                    ))}
                  </div>
                )}
                
                <div className="border-b mb-10"></div>
                {aiAnalysis && (
                  <div className="bg-vault-charcoal text-stone-200 p-8 border-l-4 border-vault-amber animate-fade-in-up shadow-inner mb-10">
                    <div className="flex items-center space-x-2 text-vault-amber mb-6"><Sparkles className="w-5 h-5" /> <span className="text-xs uppercase tracking-[0.2em] font-bold">Vault Oracle Output</span></div>
                    <div className="text-lg font-serif leading-relaxed whitespace-pre-wrap opacity-90">{aiAnalysis}</div>
                  </div>
                )}

                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-stone-400 border-b pb-2 mb-8">Threaded Discussion</h3>
                  {forumPosts.map(post => (
                    <ForumComment key={post.id} post={post} />
                  ))}
                </div>

                <div className="mt-12 bg-stone-50 p-6 border border-stone-100">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-3 font-bold">Post your perspective</label>
                    <div className="flex flex-col space-y-4">
                      <textarea 
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full bg-white border border-stone-200 p-4 text-sm font-serif italic text-stone-900 focus:outline-none focus:ring-1 focus:ring-vault-amber"
                        placeholder="Contribute to the collective intelligence..."
                        rows={3}
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                           <label className="cursor-pointer group flex items-center space-x-2 text-stone-400 hover:text-vault-mahogany transition-colors">
                              <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] uppercase font-bold tracking-widest">Attach Visuals</span>
                              <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'post')} />
                           </label>
                           {postPhotos.length > 0 && (
                             <span className="text-[10px] font-bold text-vault-amber bg-vault-charcoal px-2 py-0.5 rounded-full">{postPhotos.length} Files</span>
                           )}
                        </div>
                        
                        <button 
                          onClick={handleCreatePost}
                          className="bg-vault-mahogany text-vault-amber px-10 py-4 uppercase text-xs font-bold tracking-widest flex items-center justify-center space-x-2 hover:bg-stone-800 transition-colors shadow-lg"
                        >
                          <Send className="w-4 h-4" />
                          <span>Transmit</span>
                        </button>
                      </div>

                      {postPhotos.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                          {postPhotos.map((url, i) => (
                            <div key={i} className="relative group">
                              <img src={url} alt="Draft attachment" className="w-20 h-20 object-cover border border-stone-200" />
                              <button 
                                onClick={() => setPostPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-6xl mx-auto text-stone-900">
             <div className="flex justify-between items-end mb-12 border-b pb-6">
                <div>
                   <h2 className="text-4xl font-serif text-vault-mahogany">Briefing Room</h2>
                   <p className="text-stone-500 font-serif italic text-lg mt-2">Secure peer-to-peer discussion channels.</p>
                </div>
                {['Legacy Fellow', 'Senior Alumni', 'Founding Director'].includes(MOCK_MEMBERS[0].role) && (
                  <button 
                    onClick={() => setIsStartingTopic(true)}
                    className="bg-vault-mahogany text-vault-amber px-6 py-3 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Start Briefing</span>
                  </button>
                )}
             </div>

             {isStartingTopic && (
                <div className="mb-12 bg-white p-10 border border-stone-200 shadow-xl animate-fade-in-up">
                   <div className="flex justify-between items-center mb-8 border-b pb-4">
                      <h3 className="text-xl font-serif text-vault-mahogany font-bold uppercase tracking-widest">Initiate New Discussion</h3>
                      <button onClick={() => setIsStartingTopic(false)} className="text-stone-400 hover:text-vault-mahogany"><X className="w-5 h-5" /></button>
                   </div>
                   <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-2 tracking-widest">Topic Title</label>
                            <input 
                               type="text" 
                               value={newTopicForm.title}
                               onChange={(e) => setNewTopicForm({...newTopicForm, title: e.target.value})}
                               className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:ring-1 focus:ring-vault-amber outline-none font-serif italic"
                               placeholder="e.g. Interpol Reform 2030"
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-2 tracking-widest">Category</label>
                            <select 
                               value={newTopicForm.category}
                               onChange={(e) => setNewTopicForm({...newTopicForm, category: e.target.value})}
                               className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:ring-1 focus:ring-vault-amber outline-none"
                            >
                               <option value="">Select Category</option>
                               <option value="Innovation">Innovation</option>
                               <option value="Governance">Governance</option>
                               <option value="Field Support">Field Support</option>
                               <option value="Institutional Memory">Institutional Memory</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-2 tracking-widest">Abstract / Description</label>
                            <textarea 
                               rows={4}
                               value={newTopicForm.description}
                               onChange={(e) => setNewTopicForm({...newTopicForm, description: e.target.value})}
                               className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:ring-1 focus:ring-vault-amber outline-none font-serif italic"
                               placeholder="Describe the objective of this discussion..."
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-2 tracking-widest">Starting Document (Optional)</label>
                            <div 
                               onClick={handleDocumentUpload}
                               className="flex items-center justify-center w-full border-2 border-dashed border-stone-200 h-10 hover:border-vault-amber transition-colors cursor-pointer group relative overflow-hidden"
                            >
                               {isUploadingDoc ? (
                                 <div className="flex items-center">
                                   <Loader2 className="w-4 h-4 text-vault-amber animate-spin mr-2" />
                                   <span className="text-[10px] uppercase font-bold text-vault-amber tracking-widest">Uploading Archive...</span>
                                 </div>
                               ) : newTopicForm.startDocument ? (
                                 <div className="flex items-center text-vault-mahogany">
                                   <FileCheck className="w-4 h-4 mr-2" />
                                   <span className="text-[10px] uppercase font-bold tracking-widest">{newTopicForm.startDocument}</span>
                                 </div>
                               ) : (
                                 <div className="flex items-center">
                                   <Upload className="w-4 h-4 text-stone-300 group-hover:text-vault-amber mr-2" />
                                   <span className="text-[10px] uppercase font-bold text-stone-400 group-hover:text-vault-mahogany tracking-widest">Upload Reference</span>
                                 </div>
                               )}
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-2 tracking-widest">Starting Images (Optional)</label>
                            <div className="flex flex-col space-y-4">
                               <label className="flex items-center justify-center w-full border-2 border-dashed border-stone-200 h-10 hover:border-vault-amber transition-colors cursor-pointer group">
                                  <Upload className="w-4 h-4 text-stone-300 group-hover:text-vault-amber mr-2" />
                                  <span className="text-[10px] uppercase font-bold text-stone-400 group-hover:text-vault-mahogany tracking-widest">Attach Historical Visuals</span>
                                  <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'topic')} />
                               </label>
                               
                               {topicPhotos.length > 0 && (
                                 <div className="flex flex-wrap gap-2">
                                    {topicPhotos.map((url, i) => (
                                      <div key={i} className="relative group">
                                        <img src={url} alt="Topic attachment" className="w-16 h-16 object-cover border border-stone-200" />
                                        <button 
                                          onClick={() => setTopicPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex justify-end">
                      <button 
                         onClick={handleCreateTopic}
                         className="bg-vault-mahogany text-vault-amber px-10 py-4 uppercase text-xs font-bold tracking-[0.2em] shadow-xl hover:bg-stone-800 transition-all active:scale-95"
                      >
                         Open Discussion Channel
                      </button>
                   </div>
                </div>
             )}
             <div className="grid gap-6">
               {[...forumTopics].sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1)).map((topic) => (
                 <div key={topic.id} onClick={() => setActiveTopic(topic)} className={`bg-white p-10 border-l-8 shadow-sm cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1 group relative ${topic.isPinned ? 'border-vault-amber' : 'border-stone-200'}`}>
                    {topic.isPinned && <Pin className="absolute top-4 right-4 w-4 h-4 text-vault-amber" />}
                    <div className="flex justify-between items-center mb-4">
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${topic.isPinned ? 'text-vault-amber' : 'text-stone-400'}`}>{topic.category}</span>
                       <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{topic.lastActive}</span>
                    </div>
                    <h3 className="text-2xl font-serif text-vault-mahogany group-hover:text-vault-amber transition-colors mb-2">{topic.title}</h3>
                    <p className="text-stone-600 mt-2 text-lg font-serif italic leading-relaxed line-clamp-2">"{topic.description}"</p>
                    <div className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                       <Users className="w-3 h-3" /> <span>{topic.activeCount} Colleagues participating</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        );

      case ViewState.VAULT_MEMBERSHIP:
        return (
          <div className="max-w-6xl mx-auto text-stone-900">
             <h2 className="text-4xl font-serif text-vault-mahogany mb-12 border-b pb-6">Fellowship Tiers</h2>
             <div className="grid md:grid-cols-3 gap-10">
              {MEMBERSHIP_TIERS.map((tier) => {
                const isCurrent = tier.name === "Legacy Fellow"; 
                return (
                  <div key={tier.name} className={`bg-white border p-10 flex flex-col relative transition-all hover:shadow-xl ${isCurrent ? 'border-vault-mahogany ring-2 ring-vault-mahogany' : 'border-stone-200'}`}>
                    {isCurrent && <div className="absolute top-0 right-0 bg-vault-mahogany text-vault-amber text-[10px] uppercase px-4 py-2 font-bold tracking-widest">Active Plan</div>}
                    <h3 className="text-3xl font-serif text-vault-mahogany mb-4">{tier.name}</h3>
                    <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-6 font-bold">{tier.target}</p>
                    <div className="text-4xl font-bold text-stone-800 mb-10">{tier.fee}</div>
                    <ul className="space-y-4 mb-12 flex-1 border-t border-stone-50 pt-6">
                      {tier.benefits?.map((b, i) => (
                        <li key={i} className="flex items-start text-stone-600 text-sm font-serif italic"><Award className="w-5 h-5 mr-3 text-vault-amber shrink-0" /> {b}</li>
                      ))}
                    </ul>
                    <button className={`w-full py-4 uppercase text-sm font-bold tracking-widest transition-all ${isCurrent ? 'bg-stone-100 text-stone-400 cursor-default' : 'bg-vault-mahogany text-white hover:bg-stone-800 shadow-lg'}`} disabled={isCurrent}>{isCurrent ? 'CURRENT FELLOW' : 'UPGRADE ACCESS'}</button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case ViewState.VAULT_EVENTS:
        const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
        const eventsOnSelectedDate = events.filter(e => {
          const day = parseInt(e.date.split('-')[2]);
          return day === selectedDate;
        });

        return (
          <div className="max-w-6xl mx-auto">
             <div className="flex justify-between items-end mb-12 border-b pb-6">
                <div>
                   <h2 className="text-4xl font-serif text-vault-mahogany">Fellowship Calendar</h2>
                   <p className="text-stone-500 font-serif italic text-lg mt-2">Strategic gatherings and virtual briefings.</p>
                </div>
                <div className="flex bg-stone-100 p-1 rounded-sm border border-stone-200">
                   <button 
                    onClick={() => setEventViewMode('calendar')}
                    className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest flex items-center space-x-2 transition-all ${eventViewMode === 'calendar' ? 'bg-white shadow-sm text-vault-mahogany' : 'text-stone-400 hover:text-stone-600'}`}
                   >
                     <CalendarDays className="w-3 h-3" /> <span>Calendar</span>
                   </button>
                   <button 
                    onClick={() => setEventViewMode('list')}
                    className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest flex items-center space-x-2 transition-all ${eventViewMode === 'list' ? 'bg-white shadow-sm text-vault-mahogany' : 'text-stone-400 hover:text-stone-600'}`}
                   >
                     <List className="w-3 h-3" /> <span>Timeline</span>
                   </button>
                </div>
             </div>

             {eventViewMode === 'calendar' ? (
                <div className="grid md:grid-cols-3 gap-12">
                   <div className="md:col-span-2">
                      <div className="bg-white p-8 border border-stone-200 shadow-xl">
                         <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-serif text-vault-mahogany font-bold uppercase tracking-widest">November 2025</h3>
                            <div className="flex space-x-2">
                               <button className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-400"><ArrowLeft className="w-4 h-4" /></button>
                               <button className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-400"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                         </div>
                         <div className="grid grid-cols-7 gap-px bg-stone-100 border border-stone-100">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                              <div key={d} className="bg-stone-50 p-2 text-[10px] font-bold uppercase text-stone-400 text-center">{d}</div>
                            ))}
                            {/* Empty days for Nov 2025 (starts on Sat) */}
                            {Array.from({ length: 6 }).map((_, i) => <div key={`empty-${i}`} className="bg-white p-4 h-24"></div>)}
                            {daysInMonth.map(day => {
                              const hasEvents = events.some(e => parseInt(e.date.split('-')[2]) === day);
                              return (
                                <div 
                                  key={day} 
                                  onClick={() => setSelectedDate(day)}
                                  className={`bg-white p-4 h-24 border border-stone-50 cursor-pointer transition-all hover:bg-vault-amber/5 relative ${selectedDate === day ? 'ring-2 ring-inset ring-vault-amber bg-vault-amber/5' : ''}`}
                                >
                                   <span className={`text-sm font-bold ${hasEvents ? 'text-vault-mahogany' : 'text-stone-300'}`}>{day}</span>
                                   {hasEvents && (
                                     <div className="mt-2 space-y-1">
                                        {events.filter(e => parseInt(e.date.split('-')[2]) === day).map(e => (
                                          <div key={e.id} className="w-full h-1 bg-vault-amber rounded-full"></div>
                                        ))}
                                     </div>
                                   )}
                                </div>
                              );
                            })}
                         </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-stone-400 border-b pb-2">Events on Nov {selectedDate}</h3>
                      {eventsOnSelectedDate.length > 0 ? (
                        <div className="space-y-4">
                           {eventsOnSelectedDate.map(event => (
                             <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-vault-paper p-6 border-l-4 border-vault-mahogany shadow-sm animate-fade-in-up cursor-pointer hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-vault-amber">{event.type}</span>
                                   {event.maxGuests && (
                                     <span className="text-[8px] bg-stone-100 px-2 py-0.5 text-stone-400 font-bold uppercase tracking-widest border border-stone-200">Limit: {event.maxGuests}</span>
                                   )}
                                </div>
                                <h4 className="text-xl font-serif text-vault-mahogany mb-2 tracking-tight">{event.title}</h4>
                                <div className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                   <div className="flex items-center"><Clock className="w-3 h-3 mr-2" /> {event.time}</div>
                                   <div className="flex items-center"><Globe className="w-3 h-3 mr-2" /> {event.location}</div>
                                   <div className="flex items-center">
                                      <UserCircle className="w-3 h-3 mr-2" /> 
                                      <span>{event.host}</span>
                                      {event.isHostVerified && <BadgeCheck className="w-3 h-3 ml-1 text-blue-400" />}
                                   </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleRsvp(event); }} className="w-full mt-6 py-2 bg-vault-mahogany text-white text-[10px] uppercase font-bold tracking-widest hover:bg-stone-800 transition-colors">Confirm Details</button>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center bg-white border border-dashed border-stone-200">
                           <Calendar className="w-10 h-10 text-stone-200 mx-auto mb-4" />
                           <p className="text-xs text-stone-400 italic">No engagements scheduled for this date.</p>
                        </div>
                      )}
                   </div>
                </div>
             ) : (
                <div className="space-y-12 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-stone-200">
                  {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                    <div key={event.id} className="relative pl-24 animate-fade-in-up">
                       <div className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-vault-amber border-4 border-white shadow-sm z-10"></div>
                       <div className="absolute left-10 top-0 text-[10px] font-bold uppercase text-stone-400 tracking-widest -translate-y-1">
                          {event.date}
                       </div>
                       <div onClick={() => setSelectedEvent(event)} className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-10 hover:shadow-lg transition-all group cursor-pointer text-left">
                          <div className="md:w-64 text-left">
                             <div className="flex items-center space-x-2 mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 px-2 py-1 text-stone-500">{event.type}</span>
                                {event.maxGuests && <span className="text-[9px] text-stone-300 font-bold">CAP: {event.maxGuests}</span>}
                             </div>
                             <h3 className="text-2xl font-serif text-vault-mahogany group-hover:text-vault-amber transition-colors">{event.title}</h3>
                          </div>
                          <p className="flex-1 text-stone-600 text-sm font-serif italic text-left">"{event.description}"</p>
                          <div className="md:w-48 space-y-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                             <div className="flex items-center"><Clock className="w-3 h-3 mr-2" /> {event.time}</div>
                             <div className="flex items-center"><Globe className="w-3 h-3 mr-2" /> {event.location}</div>
                             <div className="flex items-center">
                                <UserCircle className="w-3 h-3 mr-2" /> 
                                <span>{event.host}</span>
                                {event.isHostVerified && <BadgeCheck className="w-3 h-3 ml-1 text-blue-400" />}
                             </div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleRsvp(event); }} className="bg-vault-mahogany text-white px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-stone-800 shadow-md">RSVP</button>
                       </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        );

      default:
        return <div className="text-stone-900 p-12 text-center font-serif text-2xl">Consulting the Vault Archives...</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50 font-sans text-stone-800 overflow-x-hidden">
      {rsvpToast && (
        <div className="fixed top-20 md:top-8 left-1/2 -translate-x-1/2 z-[100] bg-vault-charcoal text-vault-amber px-4 md:px-6 py-2 md:py-3 border-b-2 border-vault-amber shadow-2xl animate-fade-in-up flex items-center space-x-3 w-[90%] md:w-auto justify-center">
           <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
           <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest">{rsvpToast}</span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-vault-charcoal flex-col flex-shrink-0 sticky top-0 h-screen z-[90] shadow-2xl">
        <div className="p-8 border-b border-white/5 text-center cursor-pointer" onClick={() => onNavigate(ViewState.VAULT_DASHBOARD)}>
          <h1 className="text-3xl font-serif text-vault-amber tracking-widest">THE VAULT</h1>
          <p className="text-white/30 text-[9px] uppercase mt-2 tracking-[0.3em] font-sans font-bold">Institutional Custody</p>
        </div>
        <nav className="flex-1 py-10 overflow-y-auto custom-scrollbar">
           <SidebarItem view={ViewState.VAULT_DASHBOARD} icon={ShieldCheck} label={t('nav.dashboard')} />
           <SidebarItem view={ViewState.VAULT_FORUM} icon={MessageSquare} label={t('nav.briefing')} />
           <SidebarItem view={ViewState.VAULT_DIRECTORY} icon={Users} label={t('nav.directory')} />
           <SidebarItem view={ViewState.VAULT_STORIES} icon={BookOpen} label={t('nav.stories')} />
           <SidebarItem view={ViewState.VAULT_EVENTS} icon={Calendar} label={t('nav.calendar')} />
           <SidebarItem view={ViewState.VAULT_ARCHIE} icon={Terminal} label={t('nav.concierge')} />
           <SidebarItem view={ViewState.VAULT_MEMBERSHIP} icon={Award} label={t('nav.membership')} />
           <SidebarItem view={ViewState.VAULT_GIVING} icon={HandHeart} label={t('nav.giving')} />
           <SidebarItem view={ViewState.VAULT_PROFILE} icon={UserCircle} label={t('nav.profile')} />
        </nav>
        <div className="p-8 border-t border-white/5">
           <button onClick={onLogout} className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all font-bold">
             <LogOut className="w-5 h-5" /><span>Logout & Seal Vault</span>
           </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-vault-charcoal border-t border-white/10 flex justify-around items-center h-16 z-[100] px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
         {[
           { view: ViewState.VAULT_DASHBOARD, icon: ShieldCheck, label: 'Dash' },
           { view: ViewState.VAULT_FORUM, icon: MessageSquare, label: 'Brief' },
           { view: ViewState.VAULT_ARCHIE, icon: Terminal, label: 'Archie' },
           { view: ViewState.VAULT_DIRECTORY, icon: Users, label: 'Global' },
           { view: ViewState.VAULT_PROFILE, icon: UserCircle, label: 'Self' }
         ].map((item) => (
           <button 
             key={item.view}
             onClick={() => onNavigate(item.view)}
             className={`flex flex-col items-center justify-center space-y-1 transition-all ${currentView === item.view ? 'text-vault-amber' : 'text-stone-500'}`}
           >
             <item.icon className="w-5 h-5" />
             <span className="text-[8px] uppercase font-bold tracking-tighter">{item.label}</span>
           </button>
         ))}
         <button onClick={onLogout} className="flex flex-col items-center justify-center space-y-1 text-stone-500 opacity-60">
            <LogOut className="w-5 h-5" />
            <span className="text-[8px] uppercase font-bold tracking-tighter">Exit</span>
         </button>
      </nav>
      
      <main className="flex-1 flex flex-col min-h-screen bg-stone-50 overflow-x-hidden md:pb-0 pb-16">
         <div className="h-16 md:h-20 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:px-10 shadow-sm sticky top-0 z-[80]">
            <div className="flex items-center space-x-3 md:space-x-6">
               {/* Mobile Logo */}
               <div className="md:hidden flex flex-col" onClick={() => onNavigate(ViewState.VAULT_DASHBOARD)}>
                  <span className="font-serif text-lg text-vault-mahogany font-bold tracking-tighter leading-none">THE VAULT</span>
               </div>
               
               <div className="hidden md:block h-4 w-px bg-stone-200"></div>

               <div className="relative group">
                  <button className="flex items-center space-x-1 md:space-x-2 hover:text-vault-mahogany text-stone-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors">
                    <Globe className="w-4 h-4 md:w-5 md:h-5" /><span>{language?.toUpperCase() || 'EN'}</span>
                  </button>
                  <div className="absolute left-0 mt-3 w-40 bg-white text-slate-800 rounded-sm shadow-2xl hidden group-hover:block border border-stone-100 z-[100]">
                     {(['en', 'fr', 'es', 'ar'] as LanguageCode[]).map((lang) => (
                       <button key={lang} onClick={() => setLanguage(lang)} className="block w-full text-left px-5 py-3 hover:bg-stone-50 text-xs text-stone-900 border-b last:border-0">{lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : lang === 'es' ? 'Español' : 'العربية'}</button>
                     ))}
                  </div>
               </div>
               
               <div className="h-4 w-px bg-stone-200"></div>
               
               <div className="flex items-center space-x-1 md:space-x-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
                  <span className="text-vault-mahogany truncate max-w-[100px] md:max-w-none">{currentView.replace('VAULT_', '').replace(/_/g, ' ')}</span>
               </div>
            </div>
            <div className="hidden lg:flex text-stone-300 text-[9px] uppercase tracking-[0.3em] font-sans font-bold items-center">
               <Lock className="w-3 h-3 mr-3 opacity-50" /> Vault Session Restricted • Article 3 Compliance Active
            </div>
            {/* Mobile Auth indicator */}
            <div className="lg:hidden">
               <Lock className="w-4 h-4 text-stone-300 opacity-50" />
            </div>
         </div>
         <div className="p-4 md:p-10 lg:p-16">
            {renderContent()}
         </div>
      </main>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-vault-charcoal/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fade-in-up">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 text-stone-400 hover:text-vault-mahogany transition-colors">
                <X className="w-8 h-8" />
              </button>
              
              <div className="h-64 bg-stone-900 overflow-hidden relative">
                 {selectedEvent.mapUrl ? (
                   <iframe 
                    src={selectedEvent.mapUrl}
                    className="w-full h-full grayscale opacity-50 contrast-125"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                   ></iframe>
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-vault-mahogany/10">
                      <Globe className="w-24 h-24 text-vault-mahogany/20" />
                   </div>
                 )}
                 <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-stone-900 to-transparent">
                    <span className="bg-vault-amber text-vault-mahogany px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">{selectedEvent.type}</span>
                    <h2 className="text-4xl font-serif text-white">{selectedEvent.title}</h2>
                 </div>
              </div>
              
              <div className="p-12">
                 <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                       <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 border-b pb-2 mb-6">Briefing Details</h3>
                       <p className="text-xl font-serif leading-relaxed text-stone-700 mb-8 italic">"{selectedEvent.description}"</p>
                       <p className="text-stone-600 font-serif leading-relaxed">
                          This institutional gathering is restricted to verified members of the Fellowship. 
                          Protocol adherence is mandatory. Please ensure your digital identification is active upon arrival at the secure venue or virtual portal.
                       </p>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-stone-400">
                             <Calendar className="w-4 h-4 mr-3 text-vault-amber" /> {selectedEvent.date}
                          </div>
                          <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-stone-400">
                             <Clock className="w-4 h-4 mr-3 text-vault-amber" /> {selectedEvent.time}
                          </div>
                          <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-stone-400">
                             <Globe className="w-4 h-4 mr-3 text-vault-amber" /> {selectedEvent.location}
                          </div>
                          <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-stone-400">
                             <UserCircle className="w-4 h-4 mr-3 text-vault-amber" /> 
                             <span>Hosted by {selectedEvent.host}</span>
                             {selectedEvent.isHostVerified && <BadgeCheck className="w-4 h-4 ml-1 text-blue-500" />}
                          </div>
                          {selectedEvent.maxGuests && (
                             <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-stone-400 border-t border-stone-100 pt-4 mt-4">
                                <Users className="w-4 h-4 mr-3 text-vault-amber" /> Guest Capacity: {selectedEvent.maxGuests} Active
                             </div>
                          )}
                       </div>
                       
                       <button 
                        onClick={() => handleRsvp(selectedEvent)}
                        className="w-full bg-vault-mahogany text-vault-amber py-4 uppercase text-xs font-bold tracking-[0.2em] shadow-xl hover:bg-stone-800 transition-all active:scale-95 flex items-center justify-center space-x-2"
                       >
                          <Lock className="w-4 h-4" />
                          <span>{events.find(e => e.id === selectedEvent.id)?.rsvped ? 'Cancel Attendance' : 'Secure My Attendance'}</span>
                       </button>

                       {/* Google Calendar and Google Meet Synchronization */}
                       {events.find(e => e.id === selectedEvent.id)?.googleMeetLink ? (
                          <a 
                             href={events.find(e => e.id === selectedEvent.id)?.googleMeetLink}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 uppercase text-xs font-bold tracking-[0.15em] shadow-xl transition-all flex items-center justify-center space-x-2"
                          >
                             <ExternalLink className="w-4 h-4" />
                             <span>Join Google Meet Briefing</span>
                          </a>
                       ) : (
                          <button 
                             onClick={() => handleSyncToGoogleCalendar(selectedEvent)}
                             disabled={isSyncingCalendar[selectedEvent.id]}
                             className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 uppercase text-xs font-bold tracking-[0.15em] shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                             {isSyncingCalendar[selectedEvent.id] ? (
                                <>
                                   <Loader2 className="w-4 h-4 animate-spin" />
                                   <span>Syncing to Google...</span>
                                </>
                             ) : (
                                <>
                                   <Calendar className="w-4 h-4" />
                                   <span>Sync to Google Calendar</span>
                                 </>
                             )}
                          </button>
                       )}
                       <p className="text-[9px] text-stone-400 text-center uppercase tracking-widest font-bold">RSVP required for clearance</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 191, 0, 0.2); }
      `}} />
    </div>
  );
};
