
import React, { useState } from 'react';
import { ViewState, LanguageCode } from '../types';
import { Shield, BookOpen, Users, Lock, Upload, FileCheck, CheckCircle2, Globe, ArrowRight, Linkedin, FileText, Calendar, Heart, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VerandaProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogin: (isNewRegistration?: boolean) => void;
}

export const Veranda: React.FC<VerandaProps> = ({ currentView, onNavigate, onLogin }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeLegacyTab, setActiveLegacyTab] = useState<'professional' | 'research' | 'social' | 'wellbeing'>('professional');
  const { t, language, setLanguage } = useLanguage();

  const renderContent = () => {
    switch (currentView) {
      case ViewState.VERANDA_MISSION:
        return (
          <div className="max-w-4xl mx-auto py-16 px-6 fade-in">
            <h2 className="text-4xl font-serif text-veranda-navy mb-8 text-center border-b border-veranda-silver pb-4">{t('nav.mission')}</h2>
            <div className="prose prose-lg text-slate-700 mx-auto font-sans leading-relaxed space-y-6">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-veranda-navy first-letter:mr-2 first-letter:float-left rtl:first-letter:float-right rtl:first-letter:ml-2">
                Establish IAN as the world's premier professional fellowship for retired Interpol officials—uniting 500 founding members in a knowledge-sharing community that preserves institutional wisdom, strengthens the Interpol brand, and creates a dignified "afterlife" for those who served.
              </p>
              <p>
                We are a loose formation of colleagues choosing to stay connected, not through obligation, but through shared purpose: to look after one another, archive our collective experience, and offer the world a living library of transnational crime expertise.
              </p>
              <div className="bg-slate-100 p-8 rounded-sm border-l-4 border-veranda-navy my-8 italic rtl:border-l-0 rtl:border-r-4">
                "We are the alumni. They are the institution. We strengthen their legacy by preserving ours."
              </div>
            </div>
          </div>
        );
      case ViewState.VERANDA_JOIN:
        return (
          <div className="max-w-4xl mx-auto py-16 px-6">
            <h2 className="text-4xl font-serif text-veranda-navy mb-4 text-center">{t('nav.membership')}</h2>
            <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
              An exclusive community for those who have served the cause of international cooperation.
            </p>
            
            <div className="bg-white p-10 border border-veranda-silver shadow-lg rounded-sm text-center">
              <Shield className="w-16 h-16 text-veranda-navy mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-veranda-navy mb-4">Membership Access</h3>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Membership is <strong>free for all verified former officials</strong>. 
                Full access to membership tiers, including options for publishing research and hosting official events, 
                is available within the secure Vault after account creation and identity verification.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left rtl:text-right mb-10">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-veranda-navy mr-3 mt-1 shrink-0 rtl:mr-0 rtl:ml-3" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Secure Community</h4>
                    <p className="text-slate-500 text-sm">End-to-end encrypted peer-to-peer connection.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-veranda-navy mr-3 mt-1 shrink-0 rtl:mr-0 rtl:ml-3" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Legacy Preservation</h4>
                    <p className="text-slate-500 text-sm">Contribute to oral histories and the Expertise Graph.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onNavigate(ViewState.VERANDA_REGISTER)} 
                className="inline-flex items-center px-8 py-4 bg-veranda-navy text-white hover:bg-opacity-90 transition-all uppercase tracking-widest text-sm font-bold shadow-md"
              >
                Start Verification
                <ArrowRight className="ml-2 w-4 h-4 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
              </button>
              
              <p className="text-xs text-slate-400 mt-6">
                Requires proof of service (Passport/ID & Service Record).
              </p>
            </div>
          </div>
        );
      case ViewState.VERANDA_REGISTER:
        return (
          <div className="max-w-2xl mx-auto py-16 px-6">
             <div className="text-center mb-10">
               <Shield className="w-12 h-12 text-veranda-navy mx-auto mb-4" />
               <h2 className="text-3xl font-serif text-veranda-navy">Fellowship Application</h2>
               <p className="text-slate-500 mt-2">Create your secure account. Identity verification is required.</p>
             </div>

             <div className="bg-white p-8 border border-veranda-silver shadow-lg rounded-sm">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Full Legal Name</label>
                    <input type="text" className="w-full border border-slate-300 p-3 bg-slate-50 focus:border-veranda-navy outline-none" placeholder="e.g. Jean-Luc Dubois" />
                  </div>
                   <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                    <input type="email" className="w-full border border-slate-300 p-3 bg-slate-50 focus:border-veranda-navy outline-none" placeholder="name@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Create Password</label>
                    <input type="password" className="w-full border border-slate-300 p-3 bg-slate-50 focus:border-veranda-navy outline-none" placeholder="••••••••" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Last Rank / Grade</label>
                      <input type="text" className="w-full border border-slate-300 p-3 bg-slate-50 focus:border-veranda-navy outline-none" placeholder="e.g. Assistant Director" />
                    </div>
                     <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Service Era</label>
                      <input type="text" className="w-full border border-slate-300 p-3 bg-slate-50 focus:border-veranda-navy outline-none" placeholder="e.g. 1995 - 2010" />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 my-6 pt-6">
                    <h3 className="text-veranda-navy font-serif text-xl mb-4">Identity Verification</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Please upload a clear copy of your Passport or National Identity Card. This document is used solely for verification and is stored in an encrypted vault.
                    </p>
                    
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={(e) => e.target.files && setSelectedFile(e.target.files[0].name)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      {selectedFile ? (
                         <div className="flex flex-col items-center text-green-700">
                           <FileCheck className="w-10 h-10 mb-2" />
                           <span className="font-medium">{selectedFile}</span>
                           <span className="text-xs mt-1">Ready for upload</span>
                         </div>
                      ) : (
                         <div className="flex flex-col items-center text-slate-400 group-hover:text-veranda-navy transition-colors">
                           <Upload className="w-10 h-10 mb-2" />
                           <span className="font-medium text-slate-600">Click to Upload Passport / ID</span>
                           <span className="text-xs mt-1">PDF, JPG, or PNG (Max 5MB)</span>
                         </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onLogin(true)}
                    disabled={!selectedFile}
                    className={`w-full py-4 uppercase tracking-widest text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                      selectedFile 
                      ? 'bg-veranda-navy text-white hover:bg-opacity-90' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedFile && <CheckCircle2 className="w-4 h-4" />}
                    <span>{selectedFile ? 'Submit Application' : 'Upload ID to Continue'}</span>
                  </button>
                  
                  <p className="text-center text-[10px] text-slate-400 mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy. Your data is protected by GDPR compliance protocols.
                  </p>
                </div>
             </div>
          </div>
        );
      case ViewState.VERANDA_LEGACY:
        return (
          <div className="max-w-6xl mx-auto py-16 px-6">
            <div className="text-center mb-12">
               <h2 className="text-4xl font-serif text-veranda-navy mb-4">Legacy & Impact</h2>
               <p className="text-slate-600 max-w-2xl mx-auto">
                 Explore the contributions of our fellowship. From academic research to community wellbeing, our members continue to serve.
               </p>
            </div>

            <div className="flex flex-wrap justify-center space-x-2 md:space-x-4 border-b border-veranda-silver mb-10">
               {[
                 { id: 'professional', label: 'Professional', icon: Users },
                 { id: 'research', label: 'Research', icon: FileText },
                 { id: 'social', label: 'Social Gatherings', icon: Calendar },
                 { id: 'wellbeing', label: 'Community Wellbeing', icon: Heart }
               ].map((tab) => {
                 const Icon = tab.icon;
                 return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveLegacyTab(tab.id as any)}
                     className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-all text-sm uppercase tracking-widest ${
                       activeLegacyTab === tab.id 
                         ? 'border-veranda-navy text-veranda-navy font-bold' 
                         : 'border-transparent text-slate-400 hover:text-veranda-navy'
                     }`}
                   >
                     <Icon className="w-4 h-4" />
                     <span>{tab.label}</span>
                   </button>
                 );
               })}
            </div>

            <div className="min-h-[400px]">
               {activeLegacyTab === 'professional' && (
                 <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { name: "Ross Halliday", role: "Strategic Advisor & Board Member", img: "https://ui-avatars.com/api/?name=Ross+Halliday&background=003366&color=ffffff" },
                      { name: "Cecilia Fant", role: "Financial Crime Specialist", img: "https://picsum.photos/id/1011/200/200" },
                      { name: "Mick O'Connell", role: "Operational Leadership Consultant", img: "https://picsum.photos/id/1025/200/200" }
                    ].map((member, idx) => (
                      <div key={idx} className="bg-white border border-veranda-silver p-6 text-center hover:shadow-lg transition-shadow">
                         <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover grayscale hover:grayscale-0 transition-all" />
                         <h3 className="text-xl font-serif text-veranda-navy">{member.name}</h3>
                         <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">{member.role}</p>
                         <a href="#" className="inline-flex items-center text-[#0077b5] hover:underline text-sm font-semibold">
                            <Linkedin className="w-4 h-4 mr-2" />
                            View Profile
                         </a>
                      </div>
                    ))}
                    <div className="bg-slate-50 border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center">
                       <Shield className="w-10 h-10 text-slate-300 mb-2" />
                       <p className="text-slate-500 italic text-sm">Join the fellowship to connect with 500+ verified experts.</p>
                       <button onClick={() => onNavigate(ViewState.VERANDA_REGISTER)} className="mt-4 text-xs uppercase tracking-widest text-veranda-navy font-bold">Apply Now</button>
                    </div>
                 </div>
               )}

               {activeLegacyTab === 'research' && (
                 <div className="space-y-6">
                    {[
                      { title: "The Evolution of Cross-Border Cyber Policing", author: "Dr. Jean-Luc Dubois", date: "Oct 2024", type: "Whitepaper" },
                      { title: "Ethical Considerations in AI-Driven Surveillance", author: "Sarah Jenkins & Tech Advisory Board", date: "Aug 2024", type: "Peer Reviewed" },
                      { title: "Historical Analysis of the Red Notice System", author: "Historical Committee", date: "Jan 2024", type: "Archive Report" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-6 border-l-4 border-veranda-navy shadow-sm flex justify-between items-center group cursor-pointer hover:bg-slate-50">
                         <div>
                            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                               <span>{item.type}</span>
                               <span>•</span>
                               <span>{item.date}</span>
                            </div>
                            <h3 className="text-xl font-serif text-veranda-navy group-hover:text-[#005580] transition-colors">{item.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">Author: {item.author}</p>
                         </div>
                         <FileText className="w-6 h-6 text-slate-300 group-hover:text-veranda-navy transition-colors" />
                      </div>
                    ))}
                 </div>
               )}

               {activeLegacyTab === 'social' && (
                 <div className="grid md:grid-cols-2 gap-8">
                    {[
                      { title: "Annual IAN Gala", date: "December 15, 2024", location: "Lyon, France", desc: "A formal gathering celebrating the achievements of our founding members." },
                      { title: "Regional Seminar: Asia-Pacific", date: "November 20, 2024", location: "Singapore", desc: "Open seminar on the future of regional cooperation." }
                    ].map((event, idx) => (
                      <div key={idx} className="bg-white border border-veranda-silver rounded-sm overflow-hidden shadow-sm">
                         <div className="h-2 bg-veranda-navy"></div>
                         <div className="p-6">
                            <div className="flex items-center text-xs text-slate-500 uppercase tracking-widest mb-3">
                               <Calendar className="w-4 h-4 mr-2" />
                               {event.date}
                            </div>
                            <h3 className="text-2xl font-serif text-veranda-navy mb-2">{event.title}</h3>
                            <p className="text-sm text-slate-600 mb-4">{event.desc}</p>
                            <span className="text-xs font-bold text-slate-400 flex items-center">
                              <Globe className="w-3 h-3 mr-1" /> {event.location}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
               )}

               {activeLegacyTab === 'wellbeing' && (
                 <div className="max-w-3xl mx-auto text-center">
                    <Heart className="w-16 h-16 text-red-800 mx-auto mb-6 bg-red-50 p-3 rounded-full" />
                    <h3 className="text-3xl font-serif text-veranda-navy mb-6">Community Wellbeing Initiatives</h3>
                    <p className="text-lg text-slate-600 leading-relaxed mb-12">
                      Retirement from service can be a challenging transition. Our community prioritizes the mental and emotional health of our members through peer-to-peer support networks.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                       <div className="bg-white p-6 border border-slate-200 shadow-sm">
                          <h4 className="text-lg font-serif text-veranda-navy mb-2 flex items-center">
                             <Users className="w-5 h-5 mr-2" /> Peer Support Network
                          </h4>
                          <p className="text-sm text-slate-600">
                            Confidential, one-on-one mentorship connecting recently retired officials with those who have successfully navigated the transition to civilian life.
                          </p>
                       </div>
                       <div className="bg-white p-6 border border-slate-200 shadow-sm">
                          <h4 className="text-lg font-serif text-veranda-navy mb-2 flex items-center">
                             <Award className="w-5 h-5 mr-2" /> Trauma Resources
                          </h4>
                          <p className="text-sm text-slate-600">
                            Access to a curated directory of mental health professionals who specialize in law enforcement trauma and post-service identity.
                          </p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        );
      default: // HOME
        return (
          <>
            <div className="relative h-[80vh] bg-slate-900 overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-40">
                 <img 
                    src="https://picsum.photos/id/195/1920/1080" 
                    alt="Legacy Texture" 
                    className="w-full h-full object-cover grayscale brightness-50"
                  />
               </div>
               <div className="relative z-10 text-center px-6 max-w-4xl">
                 <Shield className="w-20 h-20 text-veranda-ivory mx-auto mb-8 opacity-90 stroke-[1px]" />
                 <h1 className="text-5xl md:text-7xl font-serif text-veranda-ivory mb-6 tracking-wide leading-tight">
                   {t('hero.title')} <br/>
                   <span className="text-veranda-silver italic">{t('hero.subtitle')}</span>
                 </h1>
                 <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-10">
                   {t('hero.desc')}
                 </p>
                 <button 
                   onClick={() => onNavigate(ViewState.VERANDA_LEGACY)}
                   className="px-8 py-3 border border-veranda-ivory text-veranda-ivory hover:bg-veranda-ivory hover:text-veranda-navy transition-all duration-500 uppercase tracking-widest text-sm"
                 >
                   {t('hero.cta')}
                 </button>
               </div>
            </div>

            <div className="bg-white py-20 px-6">
              <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
                <div className="group cursor-default">
                  <div className="bg-veranda-navy/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-veranda-navy/10 transition-colors">
                    <Users className="w-8 h-8 text-veranda-navy" />
                  </div>
                  <h3 className="text-xl font-serif text-veranda-navy mb-3">{t('feat.fellowship')}</h3>
                  <p className="text-slate-600 font-light">{t('feat.fellowship.desc')}</p>
                </div>
                <div className="group cursor-default">
                  <div className="bg-veranda-navy/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-veranda-navy/10 transition-colors">
                    <BookOpen className="w-8 h-8 text-veranda-navy" />
                  </div>
                  <h3 className="text-xl font-serif text-veranda-navy mb-3">{t('feat.archive')}</h3>
                  <p className="text-slate-600 font-light">{t('feat.archive.desc')}</p>
                </div>
                <div className="group cursor-default">
                  <div className="bg-veranda-navy/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-veranda-navy/10 transition-colors">
                    <Lock className="w-8 h-8 text-veranda-navy" />
                  </div>
                  <h3 className="text-xl font-serif text-veranda-navy mb-3">{t('feat.vault')}</h3>
                  <p className="text-slate-600 font-light">{t('feat.vault.desc')}</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-veranda-ivory flex flex-col font-sans">
      <header className="bg-veranda-navy text-white px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer rtl:space-x-reverse" 
            onClick={() => onNavigate(ViewState.VERANDA_HOME)}
          >
            <Globe className="w-6 h-6 text-veranda-silver" />
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-wider leading-none">IAN</span>
              <span className="text-[10px] text-veranda-silver uppercase tracking-[0.2em]">Legacy Fellowship</span>
            </div>
          </div>
          <nav className="flex items-center space-x-6 rtl:space-x-reverse text-sm uppercase tracking-widest text-slate-300">
            <div className="hidden md:flex space-x-6 rtl:space-x-reverse">
              <button onClick={() => onNavigate(ViewState.VERANDA_HOME)} className="hover:text-white transition-colors">{t('nav.home')}</button>
              <button onClick={() => onNavigate(ViewState.VERANDA_MISSION)} className="hover:text-white transition-colors">{t('nav.mission')}</button>
              <button onClick={() => onNavigate(ViewState.VERANDA_JOIN)} className="hover:text-white transition-colors">{t('nav.membership')}</button>
            </div>

            <div className="relative group">
               <button className="flex items-center space-x-1 hover:text-white">
                 <span>{language.toUpperCase()}</span>
               </button>
               <div className="absolute right-0 mt-2 w-32 bg-white text-slate-800 rounded-sm shadow-xl hidden group-hover:block border border-slate-200 z-50 rtl:right-auto rtl:left-0">
                  {(['en', 'fr', 'es', 'ar'] as LanguageCode[]).map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className="block w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 text-xs"
                    >
                      {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : lang === 'es' ? 'Español' : 'العربية'}
                    </button>
                  ))}
               </div>
            </div>

            <button 
              onClick={() => onLogin(false)}
              className="border border-veranda-silver px-4 py-2 hover:bg-veranda-silver hover:text-veranda-navy transition-all"
            >
              {t('nav.login')}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-veranda-navy text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase">
          <p>&copy; 2025 I-AN (International Association of Former Interpol Officials ). All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 rtl:space-x-reverse">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Host: OVH France</span>
          </div>
        </div>
        <div className="text-center mt-8 text-[10px] text-slate-600 max-w-lg mx-auto">
          IAN is a member-driven fellowship. We are not a shadow police force. We are not a competitor. We operate like a university's emeritus faculty.
        </div>
      </footer>
    </div>
  );
};
