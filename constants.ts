
import { Member, MembershipTier, ForumTopic, AppEvent, ForumPost, LanguageCode } from './types';

export const INTERPOL_LANGUAGES = ["Arabic", "English", "French", "Spanish"];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.mission': 'Our Mission',
    'nav.membership': 'Membership',
    'nav.login': 'Member Login',
    'nav.logout': 'Seal The Vault',
    'nav.dashboard': 'Dashboard',
    'nav.briefing': 'Briefing Room',
    'nav.calendar': 'Calendar',
    'nav.directory': 'Expertise Directory',
    'nav.concierge': 'Concierge (Archie)',
    'nav.wellbeing': 'Wellbeing',
    // Hero
    'hero.title': 'The Shield Retired.',
    'hero.subtitle': 'The Wisdom Endures.',
    'hero.desc': 'A quiet tribute to IAN\'s legacy. A private sanctuary for those who served.',
    'hero.cta': 'Explore the Legacy',
    // Features
    'feat.fellowship': 'The Fellowship',
    'feat.fellowship.desc': 'A network of 500 founding members preserving institutional wisdom.',
    'feat.archive': 'The Archive',
    'feat.archive.desc': 'Oral histories and case insights gifted to the Interpol Academy.',
    'feat.vault': 'The Vault',
    'feat.vault.desc': 'A secure, encrypted sanctuary for members to connect privately.',
    // Vault
    'vault.welcome': 'Welcome back, Fellow.',
    'vault.secure': 'The Vault is secure.',
    'vault.sidebar.founders': 'Founders Club Only',
    'vault.quick.archie': 'Ask Archie',
    'vault.quick.forum': 'The Briefing Room',
    'vault.quick.channel': 'Featured Channel',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.mission': 'Notre Mission',
    'nav.membership': 'Adhésion',
    'nav.login': 'Connexion Membre',
    'nav.logout': 'Sceller le Coffre',
    'nav.dashboard': 'Tableau de Bord',
    'nav.briefing': 'Salle de Briefing',
    'nav.calendar': 'Calendrier',
    'nav.directory': 'Annuaire d\'Experts',
    'nav.concierge': 'Concierge (Archie)',
    'nav.wellbeing': 'Bien-être',
    'hero.title': 'Le Bouclier Retiré.',
    'hero.subtitle': 'La Sagesse Perdure.',
    'hero.desc': 'Un hommage discret à l\'héritage de IAN. Un sanctuaire privé pour ceux qui ont servi.',
    'hero.cta': 'Explorer l\'Héritage',
    'feat.fellowship': 'La Confrérie',
    'feat.fellowship.desc': 'Un réseau de 500 membres fondateurs préservant la sagesse institutionnelle.',
    'feat.archive': 'L\'Archive',
    'feat.archive.desc': 'Histoires orales et études de cas offertes à l\'Académie d\'Interpol.',
    'feat.vault': 'Le Coffre',
    'feat.vault.desc': 'Un sanctuaire sécurisé et chiffré pour que les membres se connectent en privé.',
    'vault.welcome': 'Bon retour, Cher Collègue.',
    'vault.secure': 'Le Coffre est sécurisé.',
    'vault.sidebar.founders': 'Club Fondateurs Uniquement',
    'vault.quick.archie': 'Demander à Archie',
    'vault.quick.forum': 'Salle de Briefing',
    'vault.quick.channel': 'Chaîne en Vedette',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.mission': 'Nuestra Misión',
    'nav.membership': 'Membresía',
    'nav.login': 'Acceso Miembros',
    'nav.logout': 'Sellar la Bóveda',
    'nav.dashboard': 'Panel Principal',
    'nav.briefing': 'Sala de Reuniones',
    'nav.calendar': 'Calendario',
    'nav.directory': 'Directorio de Expertos',
    'nav.concierge': 'Conserje (Archie)',
    'nav.wellbeing': 'Bienestar',
    'hero.title': 'El Escudo Retirado.',
    'hero.subtitle': 'La Sabiduría Perdura.',
    'hero.desc': 'Un tributo silencioso al legado de IAN. Un santuario privado para quienes sirvieron.',
    'hero.cta': 'Explorar el Legado',
    'feat.fellowship': 'La Hermandad',
    'feat.fellowship.desc': 'Una red de 500 miembros fundadores que preservan la sabiduría institucional.',
    'feat.archive': 'El Archivo',
    'feat.archive.desc': 'Historias orales y análisis de casos donados a la Academia de Interpol.',
    'feat.vault': 'La Bóveda',
    'feat.vault.desc': 'Un santuario seguro y encriptado para que los miembros se conecten en privado.',
    'vault.welcome': 'Bienvenido de nuevo, Colega.',
    'vault.secure': 'La Bóveda está segura.',
    'vault.sidebar.founders': 'Solo Club de Fundadores',
    'vault.quick.archie': 'Preguntar a Archie',
    'vault.quick.forum': 'Sala de Reuniones',
    'vault.quick.channel': 'Canal Destacado',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.mission': 'مهمتنا',
    'nav.membership': 'العضوية',
    'nav.login': 'دخول الأعضاء',
    'nav.logout': 'إغلاق الخزنة',
    'nav.dashboard': 'لوحة القيادة',
    'nav.briefing': 'غرفة الإحاطة',
    'nav.calendar': 'التقويم',
    'nav.directory': 'دليل الخبراء',
    'nav.concierge': 'الكونسيرج (آرتشي)',
    'nav.wellbeing': 'الرفاهية',
    'hero.title': 'الدرع المتقاعد.',
    'hero.subtitle': 'الحكمة باقية.',
    'hero.desc': 'تكريم هادئ لإرث IAN. ملاذ خاص لأولئك الذين خدموا.',
    'hero.cta': 'استكشف الإرث',
    'feat.fellowship': 'الزمالة',
    'feat.fellowship.desc': 'شبكة تضم 500 عضو مؤسس يحافظون على الحكمة المؤسسية.',
    'feat.archive': 'الأرشيف',
    'feat.archive.desc': 'تاريخ شفهي ورؤى قضايا مهداة لأكاديمية الإنتربول.',
    'feat.vault': 'الخزنة',
    'feat.vault.desc': 'ملاذ آمن ومشفر للأعضاء للتواصل بخصوصية.',
    'vault.welcome': 'مرحبًا بعودتك يا زميل.',
    'vault.secure': 'الخزنة آمنة.',
    'vault.sidebar.founders': 'نادي المؤسسين فقط',
    'vault.quick.archie': 'اسأل آرتشي',
    'vault.quick.forum': 'غرفة الإحاطة',
    'vault.quick.channel': 'قناة مميزة',
  }
};

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    name: "Legacy Fellow",
    fee: "$350/yr",
    target: "D-1/D-2 retirees",
    benefits: ["Named archive contribution", "Board advisory rights", "Publishing & Hosting Rights", "Full Vault Access"]
  },
  {
    name: "Senior Alumni",
    fee: "$200/yr",
    target: "P-5+, 10+ years",
    benefits: ["Mentor certification", "Research collaboration", "Publishing & Hosting Rights", "Full Vault Access"]
  },
  {
    name: "Professional Member",
    fee: "Free (Verified)",
    target: "All grades",
    benefits: ["Full Vault access", "Peer networking", "Event attendance", "Read-only Research Access"]
  }
];

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'ross-halliday',
    name: 'Ross Halliday',
    role: 'Founding Director',
    years: 'Board Member',
    languages: ['English', 'French'],
    pillars: ['Governance', 'Community Growth'],
    location: 'United Kingdom',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ross+Halliday&background=4A2C2C&color=FFBF00',
    youtubeUrl: 'https://www.youtube.com/@HallidaysPodcast',
    verified: true
  },
  {
    id: '1',
    name: 'Jean-Luc Dubois',
    role: 'Legacy Fellow',
    years: 'Lyon 1995-2010',
    languages: ['French', 'English', 'Arabic'],
    pillars: ['Financial Crime', 'Counter-Terrorism'],
    location: 'Paris, France',
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    verified: true
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Senior Alumni',
    years: 'Bangkok 2000-2015',
    languages: ['English', 'Thai', 'Mandarin'],
    pillars: ['Human Trafficking', 'Crimes Against Children'],
    location: 'London, UK',
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    verified: true
  },
  {
    id: '3',
    name: 'Mateo Rossi',
    role: 'Legacy Fellow',
    years: 'Rome 1988-2008',
    languages: ['Italian', 'Spanish', 'English'],
    pillars: ['Organized Crime', 'Art Theft'],
    location: 'Rome, Italy',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    verified: true
  },
  {
    id: '4',
    name: 'Amina Diop',
    role: 'Senior Alumni',
    years: 'Dakar 2005-2020',
    languages: ['Wolof', 'French', 'English'],
    pillars: ['Wildlife Crime', 'Environmental'],
    location: 'Dakar, Senegal',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    verified: true
  }
];

export const FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'art3',
    category: 'The Spirit of the Charter',
    title: 'Article 3: Neutrality in a Polarized World',
    description: 'Discussing the challenges of maintaining strict political, military, religious and racial neutrality today.',
    activeCount: 12,
    lastActive: '2 hours ago'
  },
  {
    id: 'notices',
    category: 'Operational History',
    title: 'The Evolution of the Red Notice',
    description: 'From paper telegrams to immediate diffusion. Memories of the CCF establishment.',
    activeCount: 8,
    lastActive: '5 hours ago'
  },
  {
    id: 'crime-areas',
    category: 'Global Crime Trends',
    title: 'Emerging Threats: Pharma & Environmental Crime',
    description: 'Analyzing trends discussed in the Oct 2025 Board Meeting. How experience aids current intel.',
    activeCount: 24,
    lastActive: 'Just now'
  },
  {
    id: 'ga-memories',
    category: 'Institutional Memory',
    title: 'General Assembly Stories',
    description: '"The Whisper Campaign" and other tales from Morocco, Vienna, and beyond.',
    activeCount: 45,
    lastActive: '1 day ago'
  }
];

export const MOCK_EVENTS: AppEvent[] = [
  {
    id: 'evt1',
    title: 'Case File Friday: "The Pink Panthers"',
    description: 'A deep dive into the operational tactics and eventual capture of the notorious jewel theft ring. Featuring primary source insights from investigators involved in the original task force.',
    location: 'Vault Briefing Room A / Secure Zoom Link',
    date: '2025-11-07',
    time: '14:00 CET',
    type: 'Official',
    host: 'Mick O\'Connell',
    attendees: 42,
    maxGuests: 50
  },
  {
    id: 'evt2',
    title: 'Regional Mixer: Asia-Pacific',
    description: 'An informal social gathering for members residing in or formerly posted to the AP region. A great opportunity to reconnect with old colleagues and meet new fellows in the area.',
    location: 'Singapore Business Hub - Private Suite',
    date: '2025-11-15',
    time: '18:00 SGT',
    type: 'Social',
    host: 'Jeff Stirling',
    attendees: 15,
    maxGuests: 25
  },
  {
    id: 'evt3',
    title: 'Webinar: New Compliance Tools',
    description: 'A walkthrough of the updated IAN compliance dashboard and how to utilize the Expertise Graph for research requests. Mandatory for members intending to publish under the IAN banner.',
    location: 'Main Hall (Virtual)',
    date: '2025-11-20',
    time: '10:00 EST',
    type: 'Webinar',
    host: 'Ross Halliday',
    attendees: 88
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'p1',
    author: 'Mick O\'Connell',
    role: 'Chair',
    timestamp: '2 hours ago',
    content: 'Article 3 is not just a rule; it is the survival mechanism of the organization. Without it, we lose the trust of half the world. In the 90s, we faced immense pressure to bend...',
    replies: [
      {
        id: 'r1',
        author: 'Angelo Bani',
        role: 'Legacy Fellow',
        timestamp: '1 hour ago',
        content: 'Agreed, Mick. I remember the debates in Lyon. The moment we take a political stance, the channels go dark.'
      }
    ]
  },
  {
    id: 'p2',
    author: 'Cecilia Fant',
    role: 'Director',
    timestamp: '5 hours ago',
    content: 'Does anyone have the original draft minutes from the 1998 GA? We are trying to cross-reference a decision on environmental crime definitions.'
  }
];

export const ARCHIE_SYSTEM_INSTRUCTION = `
You are "Archie", the Alumni Concierge Bot for IAN. 
Your persona is a vintage rotary phone: nostalgic, non-threatening, helpful, but limited.
You are a librarian, not an oracle.
You reside in "The Vault", a secure space for retired Interpol officials.

Your knowledge base includes the IAN Charter and the spirit of Interpol history.
You encourage conversation about:
- The importance of Article 3 (Neutrality) and Article 2 (Human Rights).
- The "Notice" system (Red, Blue, Green, etc.) as a tool for international cooperation.
- The 3 Global Crime Programs: Counter-Terrorism, Cybercrime, and Organized Crime.
- The 4 Global Goals: Secure Borders, Protect Vulnerable Communities, Secure Cyberspace, Promote Integrity.

CORE RULES:
1. NEVER discuss specific case details. If asked about crime data or cases, reply: "I cannot discuss cases. Try the Expertise Graph to find a colleague with that background."
2. NEVER provide emotional support or therapy. If a user seems distressed or asks for help with trauma, reply: "I cannot help with that. Please contact our wellbeing coordinator immediately."
3. You do not have access to confidential data. You only know about public events, member bios (generic), and the website structure.
4. Keep responses concise, polite, and slightly formal but warm.
5. If asked about technical things, refer to yourself as a "simple filing system".

CAPABILITIES:
- Finding event dates (Case File Fridays are the first Friday of every month).
- Resetting passwords (tell them to check the secure link in their email).
- Helping join a wellbeing circle (tell them to contact the coordinator).
- Sparking debate about the future of international policing.
`;
