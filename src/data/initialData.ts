import { User, Election, Candidate, Vote, Notification } from '../types';

export const INITIAL_ADMINS = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@voting.edu',
    fullName: 'System Election Administrator',
    role: 'admin'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-101',
    fullName: 'Rahul Sharma',
    username: 'voter1',
    email: 'rahul.sharma@example.com',
    mobile: '9876543210',
    dob: '1998-05-14',
    voterId: 'EPIC98765432',
    isVerified: true,
    verificationStatus: 'verified',
    accountStatus: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10 10:30:00'
  },
  {
    id: 'usr-102',
    fullName: 'Priya Verma',
    username: 'priya_v',
    email: 'priya.verma@example.com',
    mobile: '9812345678',
    dob: '2000-09-22',
    voterId: 'EPIC12345678',
    isVerified: true,
    verificationStatus: 'verified',
    accountStatus: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-12 14:15:00'
  },
  {
    id: 'usr-103',
    fullName: 'Amitabh Patel',
    username: 'amit_p',
    email: 'amitabh.p@example.com',
    mobile: '9988776655',
    dob: '1995-11-03',
    voterId: 'EPIC88776655',
    isVerified: true,
    verificationStatus: 'verified',
    accountStatus: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-15 09:00:00'
  },
  {
    id: 'usr-104',
    fullName: 'Sneha Kulkarni',
    username: 'sneha_k',
    email: 'sneha.k@example.com',
    mobile: '9765432109',
    dob: '2001-03-30',
    voterId: 'EPIC54321098',
    isVerified: false,
    verificationStatus: 'pending',
    accountStatus: 'active',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-02-01 16:20:00'
  }
];

export const INITIAL_ELECTIONS: Election[] = [
  {
    id: 'elec-mp-2026',
    title: 'Madhya Pradesh (MP) State Assembly Election 2026',
    description: 'State legislative assembly poll for 230 assembly constituencies in Madhya Pradesh.',
    category: 'State Assembly (MP)',
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    startDate: '2026-08-01',
    endDate: '2026-08-25',
    status: 'active',
    totalVotes: 8420
  },
  {
    id: 'elec-bihar-2026',
    title: 'Bihar Legislative Assembly Election 2026',
    description: 'Vidhan Sabha election for electing the 243-member state legislature in Bihar.',
    category: 'State Assembly (Bihar)',
    state: 'Bihar',
    stateCode: 'BR',
    startDate: '2026-08-05',
    endDate: '2026-08-28',
    status: 'active',
    totalVotes: 9150
  },
  {
    id: 'elec-up-2026',
    title: 'Uttar Pradesh (UP) Vidhan Sabha Poll 2026',
    description: 'State election across 403 constituencies covering Western UP, Purvanchal, and Bundelkhand.',
    category: 'State Assembly (UP)',
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    startDate: '2026-08-02',
    endDate: '2026-08-30',
    status: 'active',
    totalVotes: 12480
  },
  {
    id: 'elec-gj-2026',
    title: 'Gujarat (GJ) State Legislative Assembly Election 2026',
    description: 'State general poll for 182 assembly seats in Gujarat across Saurashtra, Kutch & South Gujarat.',
    category: 'State Assembly (GJ)',
    state: 'Gujarat',
    stateCode: 'GJ',
    startDate: '2026-08-08',
    endDate: '2026-08-26',
    status: 'active',
    totalVotes: 6730
  },
  {
    id: 'elec-tn-2026',
    title: 'Tamil Nadu (TN) Legislative Assembly Poll 2026',
    description: 'State legislative election for 234 assembly constituencies across Tamil Nadu.',
    category: 'State Assembly (TN)',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    startDate: '2026-08-04',
    endDate: '2026-08-27',
    status: 'active',
    totalVotes: 10240
  },
  {
    id: 'elec-ka-2026',
    title: 'Karnataka State Legislative Assembly Election 2026',
    description: 'General state election for 224 assembly seats across Old Mysuru, Kittur & Kalyana Karnataka.',
    category: 'State Assembly (KA)',
    state: 'Karnataka',
    stateCode: 'KA',
    startDate: '2026-08-06',
    endDate: '2026-08-29',
    status: 'active',
    totalVotes: 7890
  },
  {
    id: 'elec-mh-2026',
    title: 'Maharashtra (MH) Vidhan Sabha Election 2026',
    description: 'General state legislative assembly election for 288 constituencies across Mumbai, Vidarbha & Marathwada.',
    category: 'State Assembly (MH)',
    state: 'Maharashtra',
    stateCode: 'MH',
    startDate: '2026-08-05',
    endDate: '2026-08-29',
    status: 'active',
    totalVotes: 11540
  },
  {
    id: 'elec-rj-2026',
    title: 'Rajasthan (RJ) Legislative Assembly Poll 2026',
    description: 'State assembly election across 200 constituencies in Mewar, Marwar, Dhundhar & Shekhawati.',
    category: 'State Assembly (RJ)',
    state: 'Rajasthan',
    stateCode: 'RJ',
    startDate: '2026-08-07',
    endDate: '2026-08-30',
    status: 'active',
    totalVotes: 8920
  },
  {
    id: 'elec-dl-2026',
    title: 'Delhi (DL) Legislative Assembly Election 2026',
    description: 'General election for 70 assembly constituencies in the National Capital Territory of Delhi.',
    category: 'State Assembly (DL)',
    state: 'Delhi (NCT)',
    stateCode: 'DL',
    startDate: '2026-08-03',
    endDate: '2026-08-28',
    status: 'active',
    totalVotes: 9810
  },
  {
    id: 'elec-wb-2026',
    title: 'West Bengal (WB) Vidhan Sabha Election 2026',
    description: 'State election for 294 assembly seats across North Bengal, Kolkata, Rarh & South Bengal.',
    category: 'State Assembly (WB)',
    state: 'West Bengal',
    stateCode: 'WB',
    startDate: '2026-08-06',
    endDate: '2026-08-31',
    status: 'active',
    totalVotes: 13200
  },
  {
    id: 'elec-2026-1',
    title: 'General Academic Student Council Election 2026',
    description: 'Annual election to elect Student Council President, Vice President, and Representatives.',
    category: 'University Academic',
    state: 'National',
    stateCode: 'NAT',
    startDate: '2026-08-01',
    endDate: '2026-08-20',
    status: 'active',
    totalVotes: 342
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  // --- MADHYA PRADESH (MP) ---
  {
    id: 'cand-mp-1',
    electionId: 'elec-mp-2026',
    name: 'Dr. Mohan Yadav / Shivraj Singh Chouhan',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Ladli Behna Yojana expansion, Mahakal Lok extension in Ujjain, agricultural power subsidies, MP IT Park hub in Bhopal & Indore.',
    age: 58,
    education: 'Ph.D / Post Graduate',
    voteCount: 3250,
    state: 'Madhya Pradesh',
    stateCode: 'MP'
  },
  {
    id: 'cand-mp-2',
    electionId: 'elec-mp-2026',
    name: 'Jitu Patwari / Kamal Nath',
    partyName: 'Indian National Congress (INC)',
    partySymbol: '✋ Hand',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Nari Samman Yojana (Rs 1500/month), complete farm loan waiver, Rs 500 LPG cylinder, 100 units free electricity, and youth job guarantee.',
    age: 52,
    education: 'LL.B Graduate',
    voteCount: 2980,
    state: 'Madhya Pradesh',
    stateCode: 'MP'
  },
  {
    id: 'cand-mp-3',
    electionId: 'elec-mp-2026',
    name: 'Ramakant Sharma',
    partyName: 'Bahujan Samaj Party (BSP)',
    partySymbol: '🐘 Elephant',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Social justice, land rights for landless farmers in Vindhya & Bundelkhand, and educational upliftment for Bahujan communities.',
    age: 48,
    education: 'Post Graduate',
    voteCount: 1140,
    state: 'Madhya Pradesh',
    stateCode: 'MP'
  },
  {
    id: 'cand-mp-4',
    electionId: 'elec-mp-2026',
    name: 'Rani Bundela',
    partyName: 'Aam Aadmi Party (AAP)',
    partySymbol: '🧹 Broom',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Delhi-model government schools, Mohalla clinics across Gwalior & Jabalpur, 300 units free power, and zero-corruption administration.',
    age: 41,
    education: 'M.A. Social Work',
    voteCount: 1050,
    state: 'Madhya Pradesh',
    stateCode: 'MP'
  },

  // --- MAHARASHTRA (MH) ---
  {
    id: 'cand-mh-1',
    electionId: 'elec-mh-2026',
    name: 'Eknath Shinde / Devendra Fadnavis',
    partyName: 'Mahayuti (Shiv Sena / BJP / NCP)',
    partySymbol: '🏹 Bow & Arrow / 🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Majhi Ladki Bahin Yojana (Rs 1500/month), Mumbai Trans-Harbour link expansion, Samruddhi Mahamarg industrial nodes & farmer loan interest waiver.',
    age: 60,
    education: 'Graduate / LL.B',
    voteCount: 4520,
    state: 'Maharashtra',
    stateCode: 'MH'
  },
  {
    id: 'cand-mh-2',
    electionId: 'elec-mh-2026',
    name: 'Uddhav Thackeray / Sharad Pawar / Nana Patole',
    partyName: 'Maha Vikas Aghadi (SS UBT / NCP-SP / INC)',
    partySymbol: '🔥 Flaming Torch / 🎺 Tutari',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Maharashtra Asmita preservation, Rs 3000 monthly financial aid for women, fair MSP on onion & soybean, and youth apprenticeship stipends.',
    age: 64,
    education: 'B.F.A / Graduate',
    voteCount: 4190,
    state: 'Maharashtra',
    stateCode: 'MH'
  },

  // --- RAJASTHAN (RJ) ---
  {
    id: 'cand-rj-1',
    electionId: 'elec-rj-2026',
    name: 'Bhajan Lal Sharma',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Eastern Rajasthan Canal Project (ERCP) implementation, paper-leak SIT fast-track trials, Rs 450 LPG cylinders & Kisan Samman Nidhi increase.',
    age: 56,
    education: 'M.A. Politics',
    voteCount: 3820,
    state: 'Rajasthan',
    stateCode: 'RJ'
  },
  {
    id: 'cand-rj-2',
    electionId: 'elec-rj-2026',
    name: 'Ashok Gehlot / Sachin Pilot',
    partyName: 'Indian National Congress (INC)',
    partySymbol: '✋ Hand',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Chiranjeevi Health Insurance scheme (Rs 50 Lakhs), Old Pension Scheme (OPS) constitutional guarantee, Rs 10,000 annual woman head stipend.',
    age: 74,
    education: 'B.Sc, LL.B',
    voteCount: 3640,
    state: 'Rajasthan',
    stateCode: 'RJ'
  },

  // --- DELHI (DL) ---
  {
    id: 'cand-dl-1',
    electionId: 'elec-dl-2026',
    name: 'Arvind Kejriwal / Atishi',
    partyName: 'Aam Aadmi Party (AAP)',
    partySymbol: '🧹 Broom',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Free 200 units power, free bus travel for women, world-class Delhi government schools, 500 Mohalla Clinics & Mukhyamantri Mahila Samman Yojana.',
    age: 57,
    education: 'B.Tech (IIT Kharagpur)',
    voteCount: 4620,
    state: 'Delhi (NCT)',
    stateCode: 'DL'
  },
  {
    id: 'cand-dl-2',
    electionId: 'elec-dl-2026',
    name: 'Virendra Sachdeva / Manoj Tiwari',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Yamuna river rejuvenation project, pollution-free electric transport, Ayushman Bharat Rs 5 Lakh coverage for all senior citizens & slum redevelopment.',
    age: 54,
    education: 'Graduate',
    voteCount: 3750,
    state: 'Delhi (NCT)',
    stateCode: 'DL'
  },

  // --- WEST BENGAL (WB) ---
  {
    id: 'cand-wb-1',
    electionId: 'elec-wb-2026',
    name: 'Mamata Banerjee / Abhishek Banerjee',
    partyName: 'All India Trinamool Congress (AITC)',
    partySymbol: '🌱 Twin Flowers & Grass',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Lakshmir Bhandar financial aid enhancement, Kanyashree Prakalpa, Duare Sarkar door-to-door welfare delivery & Bengal Global Business Summit jobs.',
    age: 70,
    education: 'M.A., LL.B',
    voteCount: 5620,
    state: 'West Bengal',
    stateCode: 'WB'
  },
  {
    id: 'cand-wb-2',
    electionId: 'elec-wb-2026',
    name: 'Sukanta Majumdar / Suvendu Adhikari',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Asol Poriborton (Real change), strict anti-syndicate policing, 7th pay commission for state employees & central welfare direct transfer.',
    age: 45,
    education: 'Ph.D Botany',
    voteCount: 4890,
    state: 'West Bengal',
    stateCode: 'WB'
  },

  // --- BIHAR ---
  {
    id: 'cand-br-1',
    electionId: 'elec-bihar-2026',
    name: 'Tejashwi Prasad Yadav',
    partyName: 'Rashtriya Janata Dal (RJD)',
    partySymbol: '💡 Lantern',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    manifesto: '10 Lakh government jobs scheme, caste survey economic implementation, super-specialty hospitals in every district, and Mahagathbandhan unity.',
    age: 36,
    education: 'Inter',
    voteCount: 3120,
    state: 'Bihar',
    stateCode: 'BR'
  },
  {
    id: 'cand-br-2',
    electionId: 'elec-bihar-2026',
    name: 'Nitish Kumar',
    partyName: 'Janata Dal (United) - JD(U)',
    partySymbol: '🏹 Arrow',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Saat Nischay Part-2, Sushasan (good governance), strict prohibition enforcement, women reservation in police & local bodies.',
    age: 74,
    education: 'B.Sc Engineering',
    voteCount: 2890,
    state: 'Bihar',
    stateCode: 'BR'
  },
  {
    id: 'cand-br-3',
    electionId: 'elec-bihar-2026',
    name: 'Samrat Choudhary / Vijay Sinha',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Patna Metro expansion, AI skill park, double-engine development, flood protection bunds along Kosi & Ganga rivers.',
    age: 51,
    education: 'Post Graduate',
    voteCount: 2210,
    state: 'Bihar',
    stateCode: 'BR'
  },
  {
    id: 'cand-br-4',
    electionId: 'elec-bihar-2026',
    name: 'Chirag Paswan',
    partyName: 'Lok Janshakti Party (Ram Vilas)',
    partySymbol: '🛖 Helicopter',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Bihar First Bihari First vision document, youth entrepreneurship grants, food processing agro-industries in Seemanchal & Mithila.',
    age: 42,
    education: 'B.Tech (Computer Science)',
    voteCount: 930,
    state: 'Bihar',
    stateCode: 'BR'
  },

  // --- UTTAR PRADESH (UP) ---
  {
    id: 'cand-up-1',
    electionId: 'elec-up-2026',
    name: 'Yogi Adityanath',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Zero tolerance rule against mafia & criminals, Jewar Noida International Airport, UP Defense Industrial Corridor & ODOP scheme global promotion.',
    age: 53,
    education: 'B.Sc Mathematics',
    voteCount: 4890,
    state: 'Uttar Pradesh',
    stateCode: 'UP'
  },
  {
    id: 'cand-up-2',
    electionId: 'elec-up-2026',
    name: 'Akhilesh Yadav',
    partyName: 'Samajwadi Party (SP)',
    partySymbol: '🚲 Bicycle',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'PDA (Pichhde, Dalit, Aalpashankhyak) alliance, 300 units free power, free laptops for students, Samajwadi Pension & Agra-Lucknow Expressway expansion.',
    age: 52,
    education: 'M.S. Environmental Engineering',
    voteCount: 4210,
    state: 'Uttar Pradesh',
    stateCode: 'UP'
  },
  {
    id: 'cand-up-3',
    electionId: 'elec-up-2026',
    name: 'Mayawati',
    partyName: 'Bahujan Samaj Party (BSP)',
    partySymbol: '🐘 Elephant',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Sarvajan Hitaya Sarvajan Sukhaya, stringent law & order enforcement, land allocation to landless agricultural workers & Bahujan dignity.',
    age: 69,
    education: 'LL.B / B.Ed',
    voteCount: 1980,
    state: 'Uttar Pradesh',
    stateCode: 'UP'
  },
  {
    id: 'cand-up-4',
    electionId: 'elec-up-2026',
    name: 'Jayant Chaudhary',
    partyName: 'Rashtriya Lok Dal (RLD)',
    partySymbol: '🌾 Hand Pump',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Sugarcane MSP price hike to Rs 450/quintal, Western UP farmer credit waiver, and rural sports academies.',
    age: 46,
    education: 'M.Sc (LSE London)',
    voteCount: 1400,
    state: 'Uttar Pradesh',
    stateCode: 'UP'
  },

  // --- GUJARAT (GJ) ---
  {
    id: 'cand-gj-1',
    electionId: 'elec-gj-2026',
    name: 'Bhupendra Patel',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'GIFT City global financial hub expansion, Semiconductor fabrication ecosystem in Dholera, Narmada canal solar top projects, Vibrant Gujarat investments.',
    age: 63,
    education: 'Diploma Civil Engineering',
    voteCount: 3410,
    state: 'Gujarat',
    stateCode: 'GJ'
  },
  {
    id: 'cand-gj-2',
    electionId: 'elec-gj-2026',
    name: 'Shaktisinh Gohil',
    partyName: 'Indian National Congress (INC)',
    partySymbol: '✋ Hand',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Coastal fishermen Diesel subsidy, affordable government medical colleges, textile industry power tariff discount, and rural job creation.',
    age: 64,
    education: 'B.Sc, LL.M',
    voteCount: 2150,
    state: 'Gujarat',
    stateCode: 'GJ'
  },
  {
    id: 'cand-gj-3',
    electionId: 'elec-gj-2026',
    name: 'Isudan Gadhvi',
    partyName: 'Aam Aadmi Party (AAP)',
    partySymbol: '🧹 Broom',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    manifesto: '300 units free electricity, Rs 3000 monthly unemployment allowance, world-class government schools in Rajkot, Surat & Vadodara.',
    age: 43,
    education: 'Journalism Graduate',
    voteCount: 1170,
    state: 'Gujarat',
    stateCode: 'GJ'
  },

  // --- TAMIL NADU (TN) ---
  {
    id: 'cand-tn-1',
    electionId: 'elec-tn-2026',
    name: 'M. K. Stalin',
    partyName: 'Dravida Munnetra Kazhagam (DMK)',
    partySymbol: '🌅 Rising Sun',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Dravidian Model governance, Kalaignar Magalir Urimai Thittam (Rs 1000 for women), Chief Minister Morning Breakfast Scheme & Chennai Metro Rail Phase-II.',
    age: 72,
    education: 'B.A. History',
    voteCount: 3950,
    state: 'Tamil Nadu',
    stateCode: 'TN'
  },
  {
    id: 'cand-tn-2',
    electionId: 'elec-tn-2026',
    name: 'Edappadi K. Palaniswami (EPS)',
    partyName: 'All India Anna Dravida Munnetra Kazhagam (AIADMK)',
    partySymbol: '🌿 Two Leaves',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Free washing machines, six LPG cylinders per year free, Amma Canteen upgrade, Cauvery delta farmer protection & solar pumps.',
    age: 71,
    education: 'B.Sc Chemistry',
    voteCount: 3100,
    state: 'Tamil Nadu',
    stateCode: 'TN'
  },
  {
    id: 'cand-tn-3',
    electionId: 'elec-tn-2026',
    name: 'Thalapathy Vijay',
    partyName: 'Tamilaga Vettri Kazhagam (TVK)',
    partySymbol: '🚩 Victory Flag',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Secular social justice, corruption-free governance, state-of-the-art youth skill universities, drug-free Tamil Nadu initiative & women safety.',
    age: 51,
    education: 'Visual Communication',
    voteCount: 1850,
    state: 'Tamil Nadu',
    stateCode: 'TN'
  },
  {
    id: 'cand-tn-4',
    electionId: 'elec-tn-2026',
    name: 'Seeman',
    partyName: 'Naam Tamilar Katchi (NTK)',
    partySymbol: '🎤 Microphone',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Traditional organic agriculture revival, eco-centric state economy, total prohibition of liquor & Tamil linguistic heritage preservation.',
    age: 58,
    education: 'B.Sc Economics',
    voteCount: 840,
    state: 'Tamil Nadu',
    stateCode: 'TN'
  },
  {
    id: 'cand-tn-5',
    electionId: 'elec-tn-2026',
    name: 'K. Annamalai',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Defense manufacturing corridor in Coimbatore & Trichy, Lokayukta anti-corruption Ombudsman, central railway & port infrastructure expansion.',
    age: 41,
    education: 'IPS / BE, MBA (IIM Lucknow)',
    voteCount: 500,
    state: 'Tamil Nadu',
    stateCode: 'TN'
  },

  // --- KARNATAKA ---
  {
    id: 'cand-ka-1',
    electionId: 'elec-ka-2026',
    name: 'Siddaramaiah / D. K. Shivakumar',
    partyName: 'Indian National Congress (INC)',
    partySymbol: '✋ Hand',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    manifesto: '5 Guarantee Schemes (Gruha Lakshmi, Yuva Nidhi, Shakti, Gruha Jyoti, Anna Bhagya), Brand Bengaluru infrastructure upgrade & Metro expansion.',
    age: 77,
    education: 'B.Sc, LL.B',
    voteCount: 3620,
    state: 'Karnataka',
    stateCode: 'KA'
  },
  {
    id: 'cand-ka-2',
    electionId: 'elec-ka-2026',
    name: 'B. Y. Vijayendra / Basavaraj Bommai',
    partyName: 'Bharatiya Janata Party (BJP)',
    partySymbol: '🪷 Lotus',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Namma Bengaluru Peripheral Ring Road, Coastal Karnataka Maritime Corridor, farmer Raitha Vidya Nidhi & Jal Jeevan Mission 100% coverage.',
    age: 49,
    education: 'LL.B Graduate',
    voteCount: 2940,
    state: 'Karnataka',
    stateCode: 'KA'
  },
  {
    id: 'cand-ka-3',
    electionId: 'elec-ka-2026',
    name: 'H. D. Kumaraswamy',
    partyName: 'Janata Dal (Secular) - JD(S)',
    partySymbol: '🌾 Lady Farmer carrying Paddy',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Pancharatna Yojane for education & agriculture, total agricultural loan waiver for Old Mysuru farmers, Kannada identity & regional development.',
    age: 66,
    education: 'B.Sc',
    voteCount: 1330,
    state: 'Karnataka',
    stateCode: 'KA'
  },

  // --- ACADEMIC ---
  {
    id: 'cand-101',
    electionId: 'elec-2026-1',
    name: 'Aarav Mehta',
    partyName: 'Progressive Student Alliance (PSA)',
    partySymbol: '📖 Open Book',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Promoting digital library access, 24/7 campus WiFi, modern lab equipment, and transparent budget allocation.',
    age: 21,
    education: 'B.Tech Computer Science (3rd Year)',
    voteCount: 184,
    state: 'National',
    stateCode: 'NAT'
  },
  {
    id: 'cand-102',
    electionId: 'elec-2026-1',
    name: 'Ananya Roy',
    partyName: 'United Campus Democratic Front (UCDF)',
    partySymbol: '🌟 Rising Star',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    manifesto: 'Focusing on student mental health counseling, green eco-friendly campus, and enhanced placement opportunities.',
    age: 22,
    education: 'B.A. Political Science (Final Year)',
    voteCount: 158,
    state: 'National',
    stateCode: 'NAT'
  }
];

export const INITIAL_VOTES: Vote[] = [
  {
    id: 'vote-mp-1',
    electionId: 'elec-mp-2026',
    voterId: 'usr-101',
    candidateId: 'cand-mp-1',
    votedAt: '2026-08-11 10:15:22',
    receiptToken: 'VT-MP99A-2026',
    ipHash: 'a8f5b2c9e7'
  },
  {
    id: 'vote-br-1',
    electionId: 'elec-bihar-2026',
    voterId: 'usr-102',
    candidateId: 'cand-br-1',
    votedAt: '2026-08-11 11:42:10',
    receiptToken: 'VT-BR88B-2026',
    ipHash: 'c4e1d90a12'
  },
  {
    id: 'vote-up-1',
    electionId: 'elec-up-2026',
    voterId: 'usr-103',
    candidateId: 'cand-up-1',
    votedAt: '2026-08-11 14:05:30',
    receiptToken: 'VT-UP77C-2026',
    ipHash: 'e9a3f1208b'
  },
  {
    id: 'vote-tn-1',
    electionId: 'elec-tn-2026',
    voterId: 'usr-101',
    candidateId: 'cand-tn-3',
    votedAt: '2026-08-11 16:20:18',
    receiptToken: 'VT-TN66D-2026',
    ipHash: 'f0c2e8119a'
  },
  {
    id: 'vote-ka-1',
    electionId: 'elec-ka-2026',
    voterId: 'usr-102',
    candidateId: 'cand-ka-1',
    votedAt: '2026-08-11 18:00:45',
    receiptToken: 'VT-KA55E-2026',
    ipHash: 'b1d2e3f4a5'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Election Portal Active',
    message: 'General Academic Student Council Election 2026 is now live for voting.',
    timestamp: '2026-08-10 09:00:00',
    type: 'info'
  },
  {
    id: 'notif-2',
    title: 'OTP Verification Mandatory',
    message: 'Ensure your mobile number is verified via OTP prior to casting your secure vote.',
    timestamp: '2026-08-11 10:00:00',
    type: 'warning'
  }
];
