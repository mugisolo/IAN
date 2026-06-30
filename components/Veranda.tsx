
import React, { useState } from 'react';
import { ViewState, LanguageCode } from '../types';
import { Shield, BookOpen, Users, Lock, Upload, FileCheck, CheckCircle2, Globe, ArrowRight, Linkedin, FileText, Calendar, Heart, Award, Sparkles, Terminal, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Archie } from './Archie';

interface VerandaProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogin: (isNewRegistration?: boolean) => void;
}

export const Veranda: React.FC<VerandaProps> = ({ currentView, onNavigate, onLogin }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeLegacyTab, setActiveLegacyTab] = useState<'professional' | 'research' | 'social' | 'wellbeing'>('professional');
  const { t, language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [regStep, setRegStep] = useState<'upload' | 'scanning' | 'mfa'>('upload');
  const [scanProgress, setScanProgress] = useState(0);
  const [mfaCode, setMfaCode] = useState('');

  const startScanning = () => {
    setRegStep('scanning');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setRegStep('mfa'), 1000);
      }
    }, 100);
  };

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
               <p className="text-slate-500 mt-2">
                 {regStep === 'upload' && 'Create your secure account. Identity verification is required.'}
                 {regStep === 'scanning' && 'Analyzing document integrity...'}
                 {regStep === 'mfa' && 'Secure multi-factor authentication check.'}
               </p>
             </div>

             <div className="bg-white p-8 border border-veranda-silver shadow-lg rounded-sm">
                {regStep === 'upload' && (
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
                      onClick={startScanning}
                      disabled={!selectedFile}
                      className={`w-full py-4 uppercase tracking-widest text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                        selectedFile 
                        ? 'bg-veranda-navy text-white hover:bg-opacity-90' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedFile && <CheckCircle2 className="w-4 h-4" />}
                      <span>{selectedFile ? 'Begin Secure Scan' : 'Upload ID to Continue'}</span>
                    </button>
                  </div>
                )}

                {regStep === 'scanning' && (
                  <div className="py-12 space-y-8 text-center">
                    <div className="relative w-48 h-64 border-2 border-veranda-navy mx-auto overflow-hidden bg-slate-50 flex items-center justify-center">
                       <FileText className="w-20 h-20 text-slate-200" />
                       <div className="absolute inset-x-0 bg-veranda-navy/20 h-1 shadow-[0_0_10px_rgba(0,51,102,0.5)] transition-all duration-100 ease-linear" style={{ top: `${scanProgress}%` }}></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-veranda-navy/5 to-transparent"></div>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">
                        <span>Scanning Artifacts</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-veranda-navy h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-sans italic">"Verifying holographic security markers and Article 3 compliance..."</p>
                  </div>
                )}

                {regStep === 'mfa' && (
                  <div className="py-8 space-y-6">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-veranda-navy mx-auto mb-4" />
                      <h3 className="text-xl font-serif text-veranda-navy mb-2">Multi-Factor Authentication</h3>
                      <p className="text-sm text-slate-600">A secure code was transmitted to your verified mobile device.</p>
                    </div>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-10 h-12 border border-slate-300 bg-slate-50 text-center text-xl font-bold text-veranda-navy outline-none focus:border-veranda-navy"
                          value={mfaCode[i - 1] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d?$/.test(val)) {
                              setMfaCode(prev => {
                                const arr = prev.split('');
                                arr[i - 1] = val;
                                return arr.join('');
                              });
                              if (val && e.target.nextElementSibling) {
                                (e.target.nextElementSibling as HTMLInputElement).focus();
                              }
                            }
                          }}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => onLogin(true)}
                      disabled={mfaCode.length < 6}
                      className={`w-full py-4 uppercase tracking-widest text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                        mfaCode.length === 6
                        ? 'bg-veranda-navy text-white hover:bg-opacity-90' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Verification</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4">
                      IAN Verification Engine v4.2.0 • Session Secured
                    </p>
                  </div>
                )}
                
                <p className="text-center text-[10px] text-slate-400 mt-4">
                  By submitting, you agree to our Terms of Service and Privacy Policy. Your data is protected by GDPR compliance protocols.
                </p>
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
          <div className="flex h-[calc(100vh-64px)] bg-slate-900 overflow-hidden relative">
            {/* Background Texture/Ambient Light */}
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-veranda-navy/10 rounded-full blur-[120px]"></div>
               <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-900/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Archie Chat Interface - Full Width */}
            <div className="flex-1 flex flex-col items-center justify-center p-0 z-10">
               <div className="w-full h-full shadow-[0_0_100px_rgba(0,0,0,0.6)] rounded-none md:rounded-none border-none overflow-hidden bg-slate-950/95 backdrop-blur-md flex flex-col transition-all duration-700">
                  <Archie isPublic={true} />
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-veranda-ivory flex flex-col font-sans">
      <header className="bg-veranda-navy text-white px-4 md:px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer rtl:space-x-reverse" 
            onClick={() => {
              onNavigate(ViewState.VERANDA_HOME);
              setIsMobileMenuOpen(false);
            }}
          >
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-veranda-silver" />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl tracking-wider leading-none">IAN</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse text-sm uppercase tracking-widest text-slate-300">
            <div className="flex space-x-6 rtl:space-x-reverse">
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

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-veranda-navy border-t border-slate-800 flex flex-col p-6 space-y-6 animate-fade-in">
            <button 
              onClick={() => { onNavigate(ViewState.VERANDA_HOME); setIsMobileMenuOpen(false); }} 
              className="text-left text-lg uppercase tracking-widest text-slate-300 hover:text-white"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => { onNavigate(ViewState.VERANDA_MISSION); setIsMobileMenuOpen(false); }} 
              className="text-left text-lg uppercase tracking-widest text-slate-300 hover:text-white"
            >
              {t('nav.mission')}
            </button>
            <button 
              onClick={() => { onNavigate(ViewState.VERANDA_JOIN); setIsMobileMenuOpen(false); }} 
              className="text-left text-lg uppercase tracking-widest text-slate-300 hover:text-white"
            >
              {t('nav.membership')}
            </button>
            
            <div className="border-t border-slate-800 pt-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 block">Switch Language</label>
              <div className="flex flex-wrap gap-2">
                {(['en', 'fr', 'es', 'ar'] as LanguageCode[]).map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => { setLanguage(lang); setIsMobileMenuOpen(false); }}
                    className={`px-3 py-2 text-xs border ${language === lang ? 'bg-white text-veranda-navy' : 'border-slate-700 text-slate-400'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => { onLogin(false); setIsMobileMenuOpen(false); }}
              className="w-full bg-veranda-silver text-veranda-navy py-4 uppercase tracking-widest font-bold shadow-lg"
            >
              {t('nav.login')}
            </button>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-veranda-navy text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase text-center md:text-left">
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
