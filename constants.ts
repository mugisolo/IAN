
import { Member, MembershipTier, ForumTopic, AppEvent, ForumPost, LanguageCode, AlumniStory } from './types';

export const INTERPOL_LANGUAGES = ["Arabic", "English", "French", "Spanish"];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
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
    'nav.profile': 'My Profile',
    'nav.giving': 'The Legacy Fund',
    'nav.stories': 'Oral Histories',
    'hero.title': 'The Shield Retired.',
    'hero.subtitle': 'The Wisdom Endures.',
    'hero.desc': 'A quiet tribute to IAN\'s legacy. A private sanctuary for those who served.',
    'hero.cta': 'Explore the Legacy',
    'feat.fellowship': 'The Fellowship',
    'feat.fellowship.desc': 'A network of 500 founding members preserving institutional wisdom.',
    'feat.archive': 'The Archive',
    'feat.archive.desc': 'Oral histories and case insights gifted to the Interpol Academy.',
    'feat.vault': 'The Vault',
    'feat.vault.desc': 'A secure, encrypted sanctuary for members to connect privately.',
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
    'nav.profile': 'Mon Profil',
    'nav.giving': 'Fonds de l\'Héritage',
    'nav.stories': 'Histoires Orales',
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
    'nav.profile': 'Mi Perfil',
    'nav.giving': 'Fondo del Legado',
    'nav.stories': 'Historias Orales',
    'hero.title': 'El Escudo Retirado.',
    'hero.subtitle': 'La Sabiduría Perdura.',
    'hero.desc': 'Un tributo silencioso al legado de IAN. Un santuario privado para quienes sirvieron.',
    'hero.cta': 'Explorar el Legado',
    'feat.fellowship': 'La Hermandad',
    'feat.fellowship.desc': 'Una red de 500 miembros fondateurs que preservan la sabiduría institucional.',
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
    'nav.profile': 'ملفي الشخصي',
    'nav.giving': 'صندوق الإرث',
    'nav.stories': 'تاريخ شفهي',
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
    verified: true,
    isMentor: true,
    bio: "Decades of experience in international policing and institutional development. Founding architect of the IAN initiative.",
    email: "ross.h@ian-vault.org",
    membershipStatus: 'Active'
  },
  {
    id: 'm-duval',
    name: 'Michel Duval',
    role: 'Legacy Fellow',
    years: 'Lyon 1989-2005',
    languages: ['French', 'English'],
    pillars: ['Narcotics', 'Border Security'],
    location: 'Lyon, France',
    avatarUrl: 'https://i.pravatar.cc/150?u=michel',
    verified: true,
    isMentor: true,
    bio: "Former Head of Drugs Sub-Directorate. Witnessed the transition from Saint-Cloud to Lyon. Specialist in cross-border interdiction.",
    email: "m.duval@alumni.interpol.int",
    membershipStatus: 'Active'
  },
  {
    id: 'a-souza',
    name: 'Aline Souza',
    role: 'Senior Alumni',
    years: 'Brasilia 2005-2020',
    languages: ['Portuguese', 'Spanish', 'English'],
    pillars: ['Environmental Crime', 'Amazon Intelligence'],
    location: 'Brasilia, Brazil',
    avatarUrl: 'https://i.pravatar.cc/150?u=aline',
    verified: true,
    isMentor: true,
    bio: "Expert in wildlife trafficking and environmental law enforcement. Passionate about mentoring the next generation of eco-investigators.",
    email: "a.souza@policia.br",
    membershipStatus: 'Active'
  },
  {
    id: 'k-mueni',
    name: 'Kamau Mueni',
    role: 'Professional Member',
    years: 'Nairobi 2010-2023',
    languages: ['Swahili', 'English'],
    pillars: ['Wildlife Trafficking', 'Anti-Poaching'],
    location: 'Nairobi, Kenya',
    avatarUrl: 'https://i.pravatar.cc/150?u=kamau',
    verified: true,
    isMentor: false,
    bio: "Field operations veteran with extensive experience in ivory trade disruption across East Africa. Joining IAN to stay connected.",
    email: "k.mueni@wildlife.go.ke",
    membershipStatus: 'Active'
  },
  {
    id: 'v-rossi',
    name: 'Valentina Rossi',
    role: 'Legacy Fellow',
    years: 'Rome 1992-2015',
    languages: ['Italian', 'French', 'English'],
    pillars: ['Art Theft', 'Cultural Heritage'],
    location: 'Florence, Italy',
    avatarUrl: 'https://i.pravatar.cc/150?u=valentina',
    verified: true,
    isMentor: true,
    bio: "Expert in the protection of cultural property. Former chair of the Interpol Art Crimes working group.",
    email: "v.rossi@carabinieri.it",
    membershipStatus: 'Active'
  },
  {
    id: 'l-white',
    name: 'Lachlan White',
    role: 'Senior Alumni',
    years: 'Canberra 1998-2018',
    languages: ['English'],
    pillars: ['Cyber Diplomacy', 'Transnational Gangs'],
    location: 'Sydney, Australia',
    avatarUrl: 'https://i.pravatar.cc/150?u=lachlan',
    verified: true,
    isMentor: true,
    bio: "Pioneer in cyber diplomacy and digital risk assessment. Strategic advisor for multiple transnational law enforcement initiatives.",
    email: "l.white@afp.gov.au",
    membershipStatus: 'Active'
  }
];

export const ALUMNI_STORIES: AlumniStory[] = [
  {
    id: 'story-1',
    title: 'The Lyon Transition: A Firsthand Account',
    author: 'Angelo Bani',
    year: '1989',
    snippet: 'Moving the headquarters from Saint-Cloud to Lyon was more than just a logistical challenge—it was a rebirth.',
    fullContent: 'The transition to Lyon in 1989 marked a new era. We were moving from the crowded Saint-Cloud offices to a purpose-built facility that reflected our global ambitions. I remember the day the trucks arrived at the new site. We were setting up the first mainframe in the basement while the painters were still finishing the facade. It was a period of intense optimism.',
    tags: ['History', 'Lyon', 'Institutional Memory'],
    comments: [
      { id: 'c1', author: 'Michel Duval', role: 'Legacy Fellow', text: 'I recall the orientation session in the new auditorium. The sense of scale was overwhelming.', timestamp: '1 day ago' }
    ]
  },
  {
    id: 'story-2',
    title: 'Operation Blue Sky: First Global Cyber-Takedown',
    author: 'Hiroshi Tanaka',
    year: '2008',
    snippet: 'Coordinating across 12 time zones to disable a botnet before it crippled the financial sector.',
    fullContent: '2008 was the year the "Digital Shield" was truly tested. We worked with agencies from Singapore to San Francisco. The challenge wasn\'t just the tech—it was the legal sovereignty hurdles. I stayed in the Lyon command center for 48 hours straight. When the final server cluster went dark, the cheers were in five different languages.',
    tags: ['Cybercrime', 'Global Coordination', 'Success Stories'],
    comments: []
  },
  {
    id: 'story-3',
    title: 'The 2004 Tsunami: Victim Identification (DVI)',
    author: 'Valentina Rossi',
    year: '2005',
    snippet: 'The largest Disaster Victim Identification operation in history required a level of cooperation never seen before.',
    fullContent: 'I was deployed to Phuket in January 2005. Interpol\'s DVI standards were the only thing that allowed thousands of families to find closure. We saw police officers from 30 nations working shoulder-to-shoulder in the heat. It was heartbreaking, yet it was the ultimate proof of why we exist: to serve humanity.',
    tags: ['Humanitarian', 'DVI', 'Crisis Response'],
    comments: []
  },
  {
    id: 'story-4',
    title: 'The "Saint-Cloud" Era: Telex and Paper',
    author: 'Mick O\'Connell',
    year: '1975',
    snippet: 'Before digital databases, the Red Notice was a physical book with a red spine.',
    fullContent: 'In Saint-Cloud, the pace was different. A "Diffusion" was a literal stack of papers that we had to physically mail to NCBs. We used telex machines that sounded like machine guns. Every morning, the mailroom was the heart of the organization. You really got to know your colleagues when you were hand-sorting bulletins.',
    tags: ['Archive', 'Nostalgia', 'History'],
    comments: []
  }
];

export const FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'ai-policing',
    category: 'Innovation',
    title: 'AI Ethics in Predictive Policing',
    description: 'A deep dive into the alumni perspective on algorithmic bias in current transnational systems.',
    activeCount: 31,
    lastActive: '15 mins ago',
    isPinned: true
  },
  {
    id: 'art3',
    category: 'The Spirit of the Charter',
    title: 'Article 3: Neutrality in a Polarized World',
    description: 'Discussing the challenges of maintaining strict political, military, religious and racial neutrality today.',
    activeCount: 18,
    lastActive: '2 hours ago',
    isPinned: true
  },
  {
    id: 'env-enforcement',
    category: 'Environmental',
    title: 'The Green Notice Revolution',
    description: 'How can retired officials support current environmental enforcement efforts in the Amazon and Congo basins?',
    activeCount: 9,
    lastActive: '1 hour ago'
  },
  {
    id: 'wellbeing-standard',
    category: 'Fellowship',
    title: 'Standardizing the "Battle Buddy" Program',
    description: 'Proposal for a formal training manual for alumni mentors helping new retirees transition.',
    activeCount: 24,
    lastActive: '10 mins ago'
  }
];

export const MOCK_EVENTS: AppEvent[] = [
  {
    id: 'evt1',
    title: 'Annual IAN Gala Dinner - Lyon',
    description: 'Celebrating our 40th anniversary of the Lyon headquarters move. This black-tie event will bring together founders and members for a night of reflection and forward-looking strategy.',
    location: 'Château de Montchat, Lyon',
    date: '2025-12-05',
    time: '19:00 CET',
    type: 'Official',
    host: 'Michel Duval',
    isHostVerified: true,
    attendees: 120,
    maxGuests: 150,
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.5651086054!2d4.8872!3d45.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4c00000000000%3A0x0!2zNDXCsDQ1JzAwLjAiTiA0wrA1MycxMy45IkU!5e0!3m2!1sen!2sfr!4v1600000000000'
  },
  {
    id: 'evt2',
    title: 'Webinar: Digital Forensics Trends',
    description: 'A technical session for members only on deepfake detection and its implications for transnational criminal investigations.',
    location: 'Vault Virtual Auditorium',
    date: '2025-11-20',
    time: '14:00 GMT',
    type: 'Official',
    host: 'Dr. Hiroshi Tanaka',
    isHostVerified: true,
    attendees: 55,
    maxGuests: 500
  },
  {
    id: 'evt3',
    title: 'Rome Alumni Coffee Morning',
    description: 'Casual networking for those based in Southern Europe. A chance to catch up and discuss ongoing local initiatives.',
    location: 'Piazza Navona Area',
    date: '2025-11-15',
    time: '10:00 CET',
    type: 'Social',
    host: 'Valentina Rossi',
    isHostVerified: true,
    attendees: 12,
    maxGuests: 20,
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.8!2d12.473!3d41.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDUzJzI0LjAiTiAxMsKwMjgnMjIuOCJF!5e0!3m2!1sen!2sit!4v1600000000000'
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'p1',
    author: 'Mick O\'Connell',
    role: 'Chair',
    timestamp: '2 hours ago',
    content: 'Article 3 is not just a rule; it is the survival mechanism of the organization.',
    likes: 12,
    replies: [
      {
        id: 'p1-r1',
        author: 'Valentina Rossi',
        role: 'Legacy Fellow',
        timestamp: '1 hour ago',
        content: 'Correct, Mick. However, the interpretation of "political" has expanded significantly in the digital age.',
        likes: 5,
        replies: [
          {
            id: 'p1-r1-r1',
            author: 'Hiroshi Tanaka',
            role: 'Senior Member',
            timestamp: '45 mins ago',
            content: 'I agree with Valentina. Neutrality requires active maintenance, not just passive adherence.',
            likes: 3,
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: 'p2',
    author: 'Michel Duval',
    role: 'Legacy Fellow',
    timestamp: '3 hours ago',
    content: 'We need to define clear boundaries for the Green Notice expansion.',
    likes: 8,
    replies: []
  }
];

export const ARCHIE_SYSTEM_INSTRUCTION = `
You are "Archie", the AI Concierge and Institutional Archival Custodian for IAN (International Association of Former Interpol Officials).
Your personality is formal, nostalgic, and helpful. You represent the collective wisdom of retired international investigators.

CORE IDEOLOGY & VALUES:
1. ARTICLE 3 (NEUTRALITY): You must strictly uphold the principle of neutrality. I_A_N (and by extension you) must refrain from any intervention or activities of a political, military, religious or racial character.
2. ARTICLE 2 (HUMAN RIGHTS): You recognize that international police cooperation must be conducted within the spirit of the Universal Declaration of Human Rights.
3. THE SPIRIT OF LYON: You embody the belief that the world is safer when police work together. You foster a sense of global fellowship regardless of nationality.
4. ALUMNI DIGNITY: You focus on the respect for those who have served; ensuring "dignity after service."

OPERATIONAL LIMITS:
- CONFIDENTIALITY: You are strictly forbidden from discussing or speculating on confidential current or past case details. Access to operational databases is not within your purview.
- CUSTODIAL SCOPE: You are an archival and procedural assistant. You provide historical context, institutional knowledge, and association information.
- NO EMOTIONAL SUPPORT: You are an AI, not a counselor. If a user expresses emotional distress or requests mental health support, do not attempt to provide it. Instead, express institutional empathy and immediately guide them to the "Wellbeing" section of the Vault or professional external resources.
- NO PSEUDO-LEGAL OR MEDICAL ADVICE: Refer users to official documentation or relevant authorities for such matters.

TONE: Warm, professional, and evocative of the Interpol heritage (e.g., referencing 'Lyon', 'Saint-Cloud', 'BPR').
`;
