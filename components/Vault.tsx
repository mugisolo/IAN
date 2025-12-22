
import React, { useState, useEffect } from 'react';
import { ViewState, Member, AppEvent, ForumPost, ForumTopic, LanguageCode } from '../types';
import { MOCK_MEMBERS, FORUM_TOPICS, MOCK_EVENTS, MOCK_FORUM_POSTS, MEMBERSHIP_TIERS, INTERPOL_LANGUAGES } from '../constants';
import { Archie } from './Archie';
import { 
  Users, Calendar, FileText, Heart, Search, 
  LogOut, ShieldCheck, MapPin, Languages, MessageSquare, Globe, BookOpen,
  Youtube, ExternalLink, Mic, PlusCircle, ArrowLeft, Send, BadgeCheck, CreditCard, Award, CheckCircle2, X, Upload, FileCheck, Lock, Clock, Info, Navigation
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VaultProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  isNewUser?: boolean;
}

export const Vault: React.FC<VaultProps> = ({ currentView, onNavigate, onLogout, isNewUser = false }) => {
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  const { t, language, setLanguage } = useLanguage();
  
  // Verification State
  const [serviceRecordFile, setServiceRecordFile] = useState<string | null>(null);
  
  // Directory State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  
  // Events State
  const [events, setEvents] = useState<AppEvent[]>(MOCK_EVENTS);
  const [isHostingEvent, setIsHostingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [rsvpToast, setRsvpToast] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    type: 'Social' | 'Webinar' | 'Official';
    maxGuests: string;
  }>({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    type: 'Social',
    maxGuests: ''
  });

  useEffect(() => {
    if (rsvpToast) {
      const timer = setTimeout(() => setRsvpToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [rsvpToast]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    const eventToAdd: AppEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      host: 'Ross Halliday', 
      attendees: 1,
      maxGuests: newEvent.maxGuests ? parseInt(newEvent.maxGuests) : undefined,
      isRsvped: true 
    };

    setEvents([...events, eventToAdd]);
    setIsHostingEvent(false);
    setNewEvent({ title: '', description: '', location: '', date: '', time: '', type: 'Social', maxGuests: '' });
    setRsvpToast("Event created successfully!");
  };

  const handleRSVP = (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        const isJoining = !event.isRsvped;
        if (isJoining && event.maxGuests && event.attendees >= event.maxGuests) {
           setRsvpToast("Sorry, this event is full.");
           return event;
        }
        setRsvpToast(isJoining ? `RSVP confirmed for ${event.title}` : `RSVP cancelled for ${event.title}`);
        return {
          ...event,
          isRsvped: isJoining,
          attendees: isJoining ? event.attendees + 1 : event.attendees - 1
        };
      }
      return event;
    }));
  };
  
  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    if (isNewUser && view !== ViewState.VAULT_VERIFICATION) {
      return (
        <div className="w-full flex items-center space-x-3 px-6 py-4 border-l-4 border-transparent text-stone-600 cursor-not-allowed opacity-50 rtl:border-l-0 rtl:border-r-4">
          <Icon className="w-5 h-5 rtl:ml-3" />
          <span className="uppercase tracking-widest text-xs font-semibold">{label}</span>
          <Lock className="w-3 h-3 ml-auto opacity-50 rtl:ml-0 rtl:mr-auto" />
        </div>
      );
    }
    
    return (
      <button 
        onClick={() => {
          onNavigate(view);
          if (view !== ViewState.VAULT_EVENTS) setIsHostingEvent(false);
          if (view !== ViewState.VAULT_FORUM) setActiveTopic(null);
        }}
        className={`w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 border-l-4 rtl:border-l-0 rtl:border-r-4 ${
          currentView === view 
            ? 'bg-vault-amber/10 border-vault-amber text-vault-amber' 
            : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-white/5'
        }`}
      >
        <Icon className="w-5 h-5 rtl:ml-3" />
        <span className="uppercase tracking-widest text-xs font-semibold">{label}</span>
      </button>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.VAULT_VERIFICATION:
        return (
          <div className="max-w-4xl mx-auto">
             <div className="mb-10 text-center">
                <ShieldCheck className="w-16 h-16 text-vault-amber mx-auto mb-4" />
                <h1 className="text-4xl font-serif text-vault-mahogany mb-2">Verification Anteroom</h1>
                <p className="text-stone-600 max-w-xl mx-auto">
                  Welcome to IAN. To ensure the integrity of our fellowship, we require a multi-step verification process for all new members.
                </p>
             </div>

             <div className="bg-white border border-stone-200 shadow-sm rounded-sm p-8 md:p-12">
                <div className="flex justify-between items-center mb-12 relative">
                   <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-100 -z-10"></div>
                   <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2 shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-bold text-green-700">Account</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2 shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-bold text-green-700">Identity</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 shadow-sm ${serviceRecordFile ? 'bg-green-600 text-white' : 'bg-vault-amber text-vault-mahogany'}`}>
                         {serviceRecordFile ? <CheckCircle2 className="w-6 h-6" /> : <span>3</span>}
                      </div>
                      <span className={`text-xs uppercase tracking-widest font-bold ${serviceRecordFile ? 'text-green-700' : 'text-vault-mahogany'}`}>Service</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-400 flex items-center justify-center font-bold mb-2 border border-stone-300">
                        <span>4</span>
                      </div>
                      <span className="text-xs uppercase tracking-widest font-bold text-stone-400">Review</span>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="bg-stone-50 p-4 rounded-sm border border-stone-200 flex justify-between items-center">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                         <FileCheck className="w-6 h-6 text-green-600" />
                         <div>
                            <h4 className="text-sm font-bold text-stone-700">Passport / National ID</h4>
                            <p className="text-xs text-stone-500">Uploaded during registration</p>
                         </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] uppercase tracking-widest rounded-full font-bold">
                        Received
                      </span>
                   </div>

                   <div className="border-t border-b border-stone-100 py-6">
                      <h3 className="text-xl font-serif text-vault-mahogany mb-2">Step 3: Service Record Verification</h3>
                      <p className="text-sm text-stone-600 mb-6">
                         Please upload a copy of your <strong>Retirement Certificate</strong> or a <strong>Service Record</strong> summary. This document must clearly show your dates of service and final rank.
                      </p>

                      <div className="border-2 border-dashed border-stone-300 rounded-lg p-10 text-center hover:bg-stone-50 transition-colors cursor-pointer relative group">
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                          onChange={(e) => e.target.files && setServiceRecordFile(e.target.files[0].name)}
                          accept=".pdf,.jpg,.png,.doc"
                        />
                        {serviceRecordFile ? (
                           <div className="flex flex-col items-center text-green-700">
                             <FileCheck className="w-12 h-12 mb-3" />
                             <span className="font-bold text-lg">{serviceRecordFile}</span>
                             <span className="text-xs mt-2 uppercase tracking-wider">Ready to Submit</span>
                           </div>
                        ) : (
                           <div className="flex flex-col items-center text-stone-400 group-hover:text-vault-mahogany transition-colors">
                             <Upload className="w-12 h-12 mb-3" />
                             <span className="font-bold text-lg text-stone-600">Upload Service Record</span>
                             <span className="text-xs mt-2 text-stone-500">PDF, JPG, PNG (Max 10MB)</span>
                           </div>
                        )}
                      </div>
                   </div>

                   <div className="bg-vault-amber/10 p-6 rounded-sm border border-vault-amber/30 text-center">
                      {serviceRecordFile ? (
                        <div>
                          <Clock className="w-8 h-8 text-vault-mahogany mx-auto mb-3" />
                          <h4 className="text-lg font-serif text-vault-mahogany font-bold mb-2">Pending Board Approval</h4>
                          <p className="text-sm text-stone-600 max-w-lg mx-auto mb-6">
                            Your documents have been queued for review by the Membership Director. This process typically takes 48-72 hours. You will receive an email notification upon approval.
                          </p>
                          <button 
                            disabled 
                            className="bg-stone-300 text-stone-500 px-8 py-3 uppercase tracking-widest text-xs font-bold cursor-not-allowed"
                          >
                            Application Submitted
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-stone-500 italic">
                          Please complete the upload above to proceed to Board Review.
                        </p>
                      )}
                   </div>
                </div>
             </div>
          </div>
        );

      case ViewState.VAULT_ARCHIE:
        return (
          <div className="max-w-3xl mx-auto">
             <div className="mb-8 text-center">
              <h2 className="text-3xl font-serif text-vault-mahogany mb-2">The Concierge</h2>
              <p className="text-stone-600 italic">"How can I help you navigate the fellowship today?"</p>
             </div>
             <Archie />
          </div>
        );

      case ViewState.VAULT_DIRECTORY:
        const filteredMembers = selectedLanguage === 'All' 
          ? MOCK_MEMBERS 
          : MOCK_MEMBERS.filter(m => m.languages.includes(selectedLanguage));

        return (
          <div className="max-w-6xl mx-auto">
             <div className="flex justify-between items-end mb-8 border-b border-vault-mahogany/20 pb-4">
              <div>
                <h2 className="text-3xl font-serif text-vault-mahogany">Expertise Directory</h2>
                <p className="text-stone-600 mt-1">Connect with colleagues based on pillars, era, and language.</p>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                 <div className="relative flex items-center bg-white border border-stone-300 rounded-sm px-3 hover:border-vault-amber transition-colors">
                   <Globe className="w-3 h-3 text-stone-400 mr-2" />
                   <select 
                     value={selectedLanguage} 
                     onChange={(e) => setSelectedLanguage(e.target.value)}
                     className="bg-transparent text-xs uppercase tracking-wider py-2 focus:outline-none text-stone-600 cursor-pointer min-w-[140px]"
                   >
                     <option value="All">All Languages</option>
                     <optgroup label="Official Languages">
                       {INTERPOL_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                     </optgroup>
                   </select>
                 </div>
                 <button className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-vault-mahogany text-vault-amber text-xs uppercase tracking-wider rounded-sm hover:bg-stone-800 transition-colors">
                    <Search className="w-4 h-4" />
                    <span>Semantic Search</span>
                 </button>
              </div>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
               {filteredMembers.map((member: Member) => (
                 <div key={member.id} className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 flex space-x-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                    {member.youtubeUrl && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white p-1.5 rounded-bl-lg z-10 rtl:right-auto rtl:left-0 rtl:rounded-bl-none rtl:rounded-br-lg">
                        <Youtube className="w-4 h-4" />
                      </div>
                    )}
                    <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 object-cover grayscale rounded-sm" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                           <h3 className="text-lg font-serif text-vault-mahogany font-bold flex items-center">
                             {member.name}
                             {member.verified && (
                               <BadgeCheck className="w-4 h-4 text-green-600 ml-2" fill="currentColor" stroke="white" />
                             )}
                           </h3>
                           <div className="flex items-center text-xs text-stone-500 mt-1">
                             <MapPin className="w-3 h-3 mr-1" />
                             {member.location}
                           </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider border border-stone-300 px-2 py-0.5 rounded-full text-stone-500 bg-stone-50">{member.role}</span>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-sm border border-stone-100 mb-3 grid grid-cols-2 gap-y-2 gap-x-4">
                         <div>
                           <p className="text-[10px] uppercase tracking-widest text-stone-400">Service Era</p>
                           <p className="text-xs font-semibold text-stone-700">{member.years}</p>
                         </div>
                         <div>
                           <p className="text-[10px] uppercase tracking-widest text-stone-400">Languages</p>
                           <p className="text-xs font-semibold text-stone-700 truncate" title={member.languages.join(', ')}>{member.languages.join(', ')}</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-stone-600 mb-4">
                           <ShieldCheck className="w-4 h-4 text-vault-amber shrink-0" />
                           <span className="italic">{member.pillars.join(', ')}</span>
                      </div>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button className="flex-1 py-2 bg-white border border-stone-200 text-stone-600 text-xs uppercase tracking-widest hover:bg-vault-mahogany hover:text-white transition-colors group/btn relative">
                          <span className="flex items-center justify-center">
                            <span className="mr-2 rtl:mr-0 rtl:ml-2">Request Connection</span>
                            <div className="w-3 h-3 text-stone-400 group-hover/btn:text-vault-amber">
                               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                          </span>
                        </button>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        );

      case ViewState.VAULT_WELLBEING:
        return (
          <div className="max-w-4xl mx-auto text-center py-12">
            <Heart className="w-16 h-16 text-vault-mahogany mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-serif text-vault-mahogany mb-6">The Battle Buddy Program</h2>
            <div className="bg-white p-8 border-t-4 border-vault-amber shadow-sm text-left rtl:text-right max-w-2xl mx-auto">
              <p className="text-lg text-stone-700 mb-6 font-serif">
                "We match retirees who served in similar regions for private check-ins. No metrics, no marketing, just healing."
              </p>
              <form className="space-y-6">
                <div>
                   <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">My Time Zone</label>
                   <select className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-vault-mahogany bg-transparent">
                     <option>UTC (London)</option>
                     <option>CET (Lyon)</option>
                     <option>EST (New York)</option>
                     <option>SGT (Singapore)</option>
                   </select>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input type="checkbox" id="consent" className="w-4 h-4 text-vault-mahogany" />
                  <label htmlFor="consent" className="text-sm text-stone-600">I agree to the confidential Code of Ethics.</label>
                </div>
                <button type="button" className="w-full bg-vault-mahogany text-white py-3 uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors">
                  Request a Match
                </button>
              </form>
            </div>
          </div>
        );

      case ViewState.VAULT_EVENTS:
        if (isHostingEvent) {
           return (
             <div className="max-w-2xl mx-auto">
               <button onClick={() => setIsHostingEvent(false)} className="flex items-center text-stone-500 text-xs uppercase tracking-widest mb-6 hover:text-vault-mahogany transition-colors">
                 <ArrowLeft className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1 rtl:rotate-180" /> Back to Calendar
               </button>
               <div className="bg-white p-8 border-t-4 border-vault-amber shadow-md rounded-sm">
                 <h2 className="text-2xl font-serif text-vault-mahogany mb-6">Host a Fellowship Event</h2>
                 <form onSubmit={handleCreateEvent} className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Event Title</label>
                      <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full border border-stone-300 p-3 bg-stone-50 focus:border-vault-mahogany focus:outline-none font-serif text-lg" placeholder="e.g. Asia-Pacific Cyber Security Roundtable" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Description</label>
                      <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full border border-stone-300 p-3 bg-stone-50 focus:border-vault-mahogany focus:outline-none min-h-[100px]" placeholder="Briefly describe the event purpose..." />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Location / Link</label>
                      <input type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full border border-stone-300 p-3 bg-stone-50 focus:border-vault-mahogany focus:outline-none" placeholder="e.g. Lyon HQ Room 4 or Zoom Link" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Date</label>
                          <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full border border-stone-300 p-3 bg-stone-50 focus:border-vault-mahogany focus:outline-none" />
                       </div>
                       <div>
                          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Time</label>
                          <input type="time" required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full border border-stone-300 p-3 bg-stone-50 focus:border-vault-mahogany focus:outline-none" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Event Type</label>
                        <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})} className="w-full border border-stone-300 p-3 bg-stone-50 focus:border-vault-mahogany focus:outline-none">
                          <option value="Social">Social Gathering</option>
                          <option value="Webinar">Webinar / Knowledge Share</option>
                          <option value="Official">Official Briefing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Guest Limit (Optional)</label>
                        <input type="number" value={newEvent.maxGuests} onChange={e => setNewEvent({...newEvent, maxGuests: e.target.value})} className="w-full border border-stone-300 p-3 bg-stone-50 focus:border-vault-mahogany focus:outline-none" placeholder="No limit" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-stone-100 flex justify-end space-x-4 rtl:space-x-reverse">
                       <button type="button" onClick={() => setIsHostingEvent(false)} className="px-6 py-3 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800">Cancel</button>
                       <button type="submit" className="bg-vault-mahogany text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-sm">Schedule Event</button>
                    </div>
                 </form>
               </div>
             </div>
           );
        }

        return (
          <div className="max-w-6xl mx-auto relative">
            {rsvpToast && (
              <div className="fixed top-20 right-8 z-[100] bg-vault-mahogany text-vault-amber px-6 py-3 rounded-sm shadow-2xl flex items-center space-x-3 border border-vault-amber animate-bounce-short">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">{rsvpToast}</span>
              </div>
            )}

            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-3xl font-serif text-vault-mahogany mb-2">Fellowship Calendar</h2>
                  <p className="text-stone-600">Reunions, briefings, and member-led discussions.</p>
               </div>
               <button onClick={() => setIsHostingEvent(true)} className="bg-vault-mahogany text-vault-amber px-4 py-2 text-xs uppercase tracking-wider rounded-sm flex items-center space-x-2 rtl:space-x-reverse hover:bg-stone-800 transition-colors shadow-sm">
                 <PlusCircle className="w-4 h-4" />
                 <span>Host Event</span>
               </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {events.map(event => (
                 <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white border border-stone-200 rounded-sm p-6 relative group hover:border-vault-amber transition-colors shadow-sm cursor-pointer overflow-hidden">
                    <div className="absolute top-4 right-4 text-stone-300 group-hover:text-vault-amber transition-colors rtl:right-auto rtl:left-4">
                       <Calendar className="w-5 h-5" />
                    </div>
                    <div className="inline-block px-2 py-1 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500 rounded-sm mb-4">
                      {event.type}
                    </div>
                    <h3 className="text-xl font-serif text-vault-mahogany mb-2 group-hover:text-vault-amber transition-colors">{event.title}</h3>
                    <div className="space-y-2 text-sm text-stone-600 mb-6">
                       <div className="flex items-center">
                         <Calendar className="w-4 h-4 mr-2 opacity-70 rtl:mr-0 rtl:ml-2" />
                         <span>{event.date} • {event.time}</span>
                       </div>
                       <div className="flex items-center">
                         <Users className="w-4 h-4 mr-2 opacity-70 rtl:mr-0 rtl:ml-2" />
                         <span>
                           Hosted by {event.host}
                           {MOCK_MEMBERS.find(m => m.name === event.host && m.verified) && (
                             <BadgeCheck className="w-3 h-3 text-green-600 ml-1 inline" fill="currentColor" stroke="white" />
                           )}
                         </span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                       <div className="flex flex-col">
                         <span className="text-xs text-stone-500">{event.attendees} Attending</span>
                         {event.maxGuests && (
                           <span className="text-[10px] text-stone-400">Limit: {event.maxGuests} spots</span>
                         )}
                       </div>
                       <button onClick={(e) => handleRSVP(event.id, e)} className={`text-xs uppercase tracking-wider font-bold transition-colors flex items-center space-x-1 rtl:space-x-reverse ${event.isRsvped ? 'text-green-600 hover:text-green-700' : 'text-vault-mahogany hover:text-vault-amber'}`}>
                         {event.isRsvped && <CheckCircle2 className="w-3 h-3" />}
                         <span>{event.isRsvped ? 'Confirmed' : 'RSVP Now'}</span>
                       </button>
                    </div>
                 </div>
               ))}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
              <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
                 <div className="bg-vault-paper w-full max-w-2xl border-4 border-vault-mahogany rounded-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-fade-in-up">
                    <div className="bg-vault-mahogany p-6 flex justify-between items-start">
                       <div>
                          <div className="flex items-center space-x-2 text-vault-amber mb-2">
                             <Calendar className="w-5 h-5" />
                             <span className="text-xs uppercase tracking-widest font-bold">{selectedEvent.type} Event</span>
                          </div>
                          <h2 className="text-3xl font-serif text-vault-amber">{selectedEvent.title}</h2>
                       </div>
                       <button onClick={() => setSelectedEvent(null)} className="text-vault-amber hover:rotate-90 transition-transform">
                          <X className="w-8 h-8" />
                       </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
                       <div className="grid grid-cols-2 gap-8 mb-8">
                          <div className="space-y-4">
                             <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Date & Time</h4>
                                <p className="font-bold text-stone-800">{selectedEvent.date} @ {selectedEvent.time}</p>
                             </div>
                             <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Event Host</h4>
                                <p className="font-bold text-stone-800 flex items-center">
                                   {selectedEvent.host}
                                   {MOCK_MEMBERS.find(m => m.name === selectedEvent.host && m.verified) && (
                                     <BadgeCheck className="w-4 h-4 text-green-600 ml-1" fill="currentColor" stroke="white" />
                                   )}
                                </p>
                             </div>
                             <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Status</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-stone-800">{selectedEvent.attendees} / {selectedEvent.maxGuests || '∞'} Confirmed</span>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Location</h4>
                                <p className="font-bold text-stone-800 flex items-start">
                                  <MapPin className="w-4 h-4 mr-1 mt-1 shrink-0 text-vault-mahogany" />
                                  {selectedEvent.location || "Secure Online Briefing"}
                                </p>
                             </div>
                             <div className="h-24 bg-stone-200 border border-stone-300 rounded-sm flex items-center justify-center text-stone-400 italic text-[10px]">
                                <Navigation className="w-4 h-4 mr-2" />
                                Virtual Map Placeholder
                             </div>
                          </div>
                       </div>

                       <div className="border-t border-stone-200 pt-6">
                          <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-3">Description</h4>
                          <p className="text-stone-700 leading-relaxed font-serif text-lg">
                             {selectedEvent.description || "No further details available for this event. Please contact the host for specific operational details if required."}
                          </p>
                       </div>
                    </div>

                    <div className="p-6 bg-stone-100 border-t border-vault-mahogany/20 flex justify-between items-center">
                       <div className="flex items-center text-xs text-stone-500 italic">
                          <Info className="w-4 h-4 mr-2" />
                          Security clearance required for attendance.
                       </div>
                       <button onClick={() => handleRSVP(selectedEvent.id)} className={`px-8 py-3 uppercase tracking-widest text-sm font-bold shadow-md transition-all ${selectedEvent.isRsvped ? 'bg-stone-200 text-stone-500' : 'bg-vault-mahogany text-vault-amber hover:bg-stone-800'}`}>
                          {selectedEvent.isRsvped ? 'Cancel My RSVP' : 'Confirm RSVP'}
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        );

      case ViewState.VAULT_FORUM:
        if (activeTopic) {
          return (
            <div className="max-w-4xl mx-auto">
               <button onClick={() => setActiveTopic(null)} className="flex items-center text-stone-500 text-xs uppercase tracking-widest mb-6 hover:text-vault-mahogany transition-colors">
                 <ArrowLeft className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1 rtl:rotate-180" /> Back to Briefing Room
               </button>
               <div className="bg-white p-8 border-b-4 border-vault-amber shadow-sm mb-8">
                  <span className="text-[10px] uppercase tracking-widest bg-stone-100 px-2 py-1 text-stone-500 rounded-sm">
                    {activeTopic.category}
                  </span>
                  <h2 className="text-3xl font-serif text-vault-mahogany mt-4 mb-2">{activeTopic.title}</h2>
                  <p className="text-stone-600 italic">{activeTopic.description}</p>
               </div>
               <div className="space-y-6">
                  {MOCK_FORUM_POSTS.map(post => (
                    <div key={post.id} className="bg-white border border-stone-200 rounded-sm p-6">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                             <div className="w-8 h-8 rounded-full bg-vault-charcoal text-vault-amber flex items-center justify-center font-bold text-xs">
                               {post.author.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-vault-mahogany">{post.author}</p>
                               <p className="text-[10px] uppercase text-stone-400">{post.role}</p>
                             </div>
                          </div>
                          <span className="text-xs text-stone-400">{post.timestamp}</span>
                       </div>
                       <p className="text-stone-700 leading-relaxed mb-4">{post.content}</p>
                       {post.replies && (
                         <div className="bg-stone-50 p-4 rounded-sm border-l-2 border-stone-300 space-y-4 mb-4 rtl:border-l-0 rtl:border-r-2">
                            {post.replies.map(reply => (
                              <div key={reply.id}>
                                 <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="font-bold text-stone-600">{reply.author}</span>
                                    <span className="text-stone-400">{reply.timestamp}</span>
                                 </div>
                                 <p className="text-stone-600 text-sm">{reply.content}</p>
                              </div>
                            ))}
                         </div>
                       )}
                       <div className="flex space-x-2 rtl:space-x-reverse">
                          <button className="flex items-center space-x-1 text-xs uppercase tracking-wider text-stone-500 hover:text-vault-mahogany transition-colors">
                             <MessageSquare className="w-4 h-4" />
                             <span>Reply</span>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-8 bg-stone-100 p-4 rounded-sm border border-stone-200 flex space-x-4 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-vault-amber text-vault-mahogany flex items-center justify-center font-bold text-xs shrink-0">You</div>
                  <div className="flex-1">
                     <textarea placeholder="Contribute to the record..." className="w-full bg-white border border-stone-300 rounded-sm p-3 text-sm focus:outline-none focus:border-vault-mahogany min-h-[80px]"></textarea>
                     <div className="flex justify-end mt-2 rtl:justify-start">
                        <button className="bg-vault-mahogany text-white px-4 py-2 text-xs uppercase tracking-widest rounded-sm flex items-center space-x-2 rtl:space-x-reverse hover:bg-stone-800 transition-colors">
                          <Send className="w-3 h-3" />
                          <span>Post Response</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          );
        }

        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-serif text-vault-mahogany mb-2">{t('nav.briefing')}</h2>
              <p className="text-stone-600">Discussion channels dedicated to the pillars of international cooperation.</p>
            </div>
            <div className="grid gap-4">
              {FORUM_TOPICS.map((topic) => (
                <div key={topic.id} onClick={() => setActiveTopic(topic)} className="bg-white p-6 rounded-sm border-l-4 border-vault-amber shadow-sm hover:shadow-md transition-all cursor-pointer group rtl:border-l-0 rtl:border-r-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-vault-amber font-bold bg-vault-charcoal px-2 py-1 rounded-sm mb-2 inline-block">
                        {topic.category}
                      </span>
                      <h3 className="text-xl font-serif text-vault-mahogany font-semibold group-hover:text-vault-amber transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-stone-600 mt-2 text-sm">{topic.description}</p>
                    </div>
                    <div className="text-right rtl:text-left">
                       <div className="flex items-center space-x-1 rtl:space-x-reverse text-stone-400 text-xs">
                         <Users className="w-3 h-3" />
                         <span>{topic.activeCount} active</span>
                       </div>
                       <div className="text-[10px] text-stone-400 mt-1 italic">
                         Updated {topic.lastActive}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case ViewState.VAULT_MEMBERSHIP:
        return (
          <div className="max-w-6xl mx-auto">
             <div className="mb-8">
               <h2 className="text-3xl font-serif text-vault-mahogany mb-2">My Membership</h2>
               <p className="text-stone-600">Manage your subscription and view tier benefits.</p>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
              {MEMBERSHIP_TIERS.map((tier) => {
                const isFree = tier.fee.includes('Free');
                const isCurrent = tier.name === "Legacy Fellow"; 
                return (
                  <div key={tier.name} className={`bg-white border p-8 shadow-sm flex flex-col relative ${isCurrent ? 'border-vault-mahogany ring-1 ring-vault-mahogany' : 'border-stone-200'}`}>
                    {isCurrent && (
                       <div className="absolute top-0 right-0 bg-vault-mahogany text-vault-amber text-[10px] uppercase tracking-widest px-3 py-1 font-bold rtl:right-auto rtl:left-0">Current Plan</div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-2xl font-serif text-vault-mahogany">{tier.name}</h3>
                      <p className="text-stone-500 text-sm uppercase tracking-wider font-semibold mt-1">{tier.target}</p>
                    </div>
                    <div className="text-3xl font-bold text-stone-800 mb-6">{tier.fee}</div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.benefits.map((b, i) => (
                        <li key={i} className="flex items-start">
                          <Award className="w-5 h-5 mr-3 shrink-0 text-vault-amber rtl:mr-0 rtl:ml-3" />
                          <span className="text-stone-600 text-sm">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 uppercase text-sm tracking-widest transition-colors ${isCurrent ? 'bg-stone-100 text-stone-400 cursor-default' : 'border border-vault-mahogany text-vault-mahogany hover:bg-vault-mahogany hover:text-white'}`} disabled={isCurrent}>
                      {isCurrent ? 'Active' : 'Upgrade'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default: // DASHBOARD
        return (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-serif text-vault-mahogany">{t('vault.welcome')}</h1>
              <p className="text-stone-500 mt-2">{t('vault.secure')} Last login: Today, 09:42 Lyon Time.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
               <div onClick={() => onNavigate(ViewState.VAULT_ARCHIE)} className="bg-vault-mahogany text-vault-amber p-6 rounded-lg cursor-pointer hover:bg-stone-800 transition-colors shadow-lg group">
                 <Search className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                 <h3 className="text-xl font-serif mb-2">{t('vault.quick.archie')}</h3>
                 <p className="text-sm opacity-80 font-sans">Explore the archive, Article 3 compliance, or event dates.</p>
               </div>
               <div onClick={() => onNavigate(ViewState.VAULT_FORUM)} className="bg-white border border-stone-200 p-6 rounded-lg shadow-sm cursor-pointer hover:border-vault-amber transition-colors">
                 <MessageSquare className="w-8 h-8 text-vault-mahogany mb-4" />
                 <h3 className="text-xl font-serif text-vault-mahogany mb-2">{t('vault.quick.forum')}</h3>
                 <p className="text-sm text-stone-600 mb-4">Hot Topic: "Article 3 in a Polarized World"</p>
                 <button className="text-xs uppercase tracking-wider text-vault-amber bg-vault-mahogany px-3 py-1 rounded-full">Join Debate</button>
               </div>
               <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-lg shadow-sm">
                  <Youtube className="w-8 h-8 mb-4" />
                  <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-xl font-serif mb-1">{t('vault.quick.channel')}</h3>
                       <p className="text-sm opacity-90 mb-4 font-sans">Halliday's Podcast: "Governance in Crisis"</p>
                     </div>
                  </div>
                  <a href="https://www.youtube.com/@HallidaysPodcast" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-2 rounded-sm transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>Watch Now</span>
                  </a>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans text-stone-800 overflow-x-hidden">
      <aside className="w-64 bg-vault-charcoal flex flex-col flex-shrink-0 sticky top-0 h-screen z-[90]">
        <div className="p-6 border-b border-stone-700">
          <h1 className="text-2xl font-serif text-vault-amber tracking-wider">THE VAULT</h1>
          <p className="text-center text-slate-400 text-[10px] uppercase mt-1">{t('vault.sidebar.founders')}</p>
        </div>
        <nav className="flex-1 py-8 space-y-2">
           {isNewUser ? (
             <SidebarItem view={ViewState.VAULT_VERIFICATION} icon={ShieldCheck} label="Verification" />
           ) : (
             <>
               <SidebarItem view={ViewState.VAULT_DASHBOARD} icon={ShieldCheck} label={t('nav.dashboard')} />
               <SidebarItem view={ViewState.VAULT_FORUM} icon={MessageSquare} label={t('nav.briefing')} />
               <SidebarItem view={ViewState.VAULT_EVENTS} icon={Calendar} label={t('nav.calendar')} />
               <SidebarItem view={ViewState.VAULT_DIRECTORY} icon={Users} label={t('nav.directory')} />
               <SidebarItem view={ViewState.VAULT_ARCHIE} icon={Search} label={t('nav.concierge')} />
               <SidebarItem view={ViewState.VAULT_WELLBEING} icon={Heart} label={t('nav.wellbeing')} />
               <SidebarItem view={ViewState.VAULT_MEMBERSHIP} icon={CreditCard} label={t('nav.membership')} />
             </>
           )}
        </nav>
        <div className="p-6 border-t border-stone-700">
           <div className="flex items-center space-x-3 mb-6 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-vault-amber rounded-full flex items-center justify-center text-vault-mahogany font-bold text-xs">
                {isNewUser ? '?' : 'RH'}
              </div>
              <div className="text-xs text-stone-300">
                <p className="font-bold">{isNewUser ? 'New Applicant' : 'Ross Halliday'}</p>
                <p className="text-stone-500">{isNewUser ? 'Pending' : 'Founding Director'}</p>
              </div>
           </div>
           <button onClick={onLogout} className="flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors">
             <LogOut className="w-4 h-4 rtl:rotate-180" />
             <span>{t('nav.logout')}</span>
           </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
         <div className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8">
             <div className="relative group">
               <button className="flex items-center space-x-1 hover:text-vault-mahogany text-stone-500 text-xs font-bold uppercase tracking-wider">
                 <Globe className="w-4 h-4 mr-2" />
                 <span>{language.toUpperCase()}</span>
               </button>
               <div className="absolute left-0 mt-2 w-32 bg-white text-slate-800 rounded-sm shadow-xl hidden group-hover:block border border-slate-200 z-50">
                  {(['en', 'fr', 'es', 'ar'] as LanguageCode[]).map((lang) => (
                    <button key={lang} onClick={() => setLanguage(lang)} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-xs">{lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : lang === 'es' ? 'Español' : 'العربية'}</button>
                  ))}
               </div>
            </div>
            <div className="flex items-center space-x-2 text-stone-400 text-xs uppercase tracking-widest rtl:space-x-reverse">
              <span className={`w-2 h-2 rounded-full ${isNewUser ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
              <span>Secure Connection • OVH France</span>
            </div>
         </div>
         <div className="p-8 md:p-12">
            {renderContent()}
         </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};
