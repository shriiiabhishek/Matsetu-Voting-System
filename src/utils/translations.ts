import { Language } from '../types';

export const TRANSLATIONS = {
  en: {
    brandName: 'Matsetu (मतसेतु)',
    academicBadge: 'Digital E-Voting Portal',
    home: 'Home',
    elections: 'Elections',
    register: 'Register Voter',
    login: 'Voter Login',
    verify: 'Voter Verification',
    dashboard: 'Voter Dashboard',
    adminDashboard: 'Admin Panel',
    results: 'Results & Analytics',
    phpSource: 'PHP/MySQL Code Export',
    logout: 'Logout',
    
    // Hero
    heroTitle: 'Matsetu (मतसेतु) - Digital E-Voting Portal',
    heroSubtitle: 'Secure, transparent, and instant state & national electronic voting platform with real-time audit ledger.',
    registerBtn: 'Register to Vote Now',
    exploreElectionsBtn: 'View Active Elections',
    
    // How it works
    howItWorksTitle: 'How It Works',
    step1Title: '1. Register Voter',
    step1Desc: 'Enter personal details, EPIC Voter ID, upload profile photo, and solve security CAPTCHA.',
    step2Title: '2. Smart Verification',
    step2Desc: 'Automated verification check against official voter registry and phone/email records.',
    step3Title: '3. OTP Authentication',
    step3Desc: 'Secure login requiring 6-digit One-Time Password sent to your verified mobile number.',
    step4Title: '4. Cast Ballot',
    step4Desc: 'Cast vote securely with cryptographic receipt token and UNIQUE double-vote protection.',
    
    // Chatbot
    chatTitle: 'VoteSathi AI Assistant',
    chatSubtitle: 'Ask questions about voting process, candidates, or OTP verification',
    chatPlaceholder: 'Ask a question in English or Hindi (e.g., How do I vote?)...',
    
    // Quick Chat Prompts
    prompt1: 'How do I vote in my MP / State constituency?',
    prompt2: 'How to download my voting certificate & invoice?',
    prompt3: 'Who are the contesting candidates in my state?',
    prompt4: 'How does 2FA OTP & CAPTCHA verification work?',
    
    // Language Toggle
    langEn: 'English',
    langHi: 'हिंदी (Hindi)',
  },
  hi: {
    brandName: 'मतसेतु (Matsetu)',
    academicBadge: 'डिजिटल ऑनलाइन ई-वोटिंग पोर्टल',
    home: 'मुख्य पृष्ठ',
    elections: 'चुनाव',
    register: 'मतदाता पंजीकरण',
    login: 'मतदाता लॉगिन',
    verify: 'मतदाता सत्यापन',
    dashboard: 'मतदाता डैशबोर्ड',
    adminDashboard: 'एडमिन पैनल',
    results: 'परिणाम और विश्लेषण',
    phpSource: 'PHP/MySQL कोड एक्सपोर्ट',
    logout: 'लॉगआउट',
    
    // Hero
    heroTitle: 'मतसेतु (Matsetu) - डिजिटल ई-वोटिंग पोर्टल',
    heroSubtitle: 'स्मार्ट सत्यापन, त्वरित मतदान और लाइव ऑडिट लेजर के साथ सुरक्षित ऑनलाइन ई-वोटिंग प्लेटफ़ॉर्म।',
    registerBtn: 'अभी वोट देने के लिए पंजीकरण करें',
    exploreElectionsBtn: 'सक्रिय चुनाव देखें',
    
    // How it works
    howItWorksTitle: 'यह कैसे काम करता है',
    step1Title: '1. मतदाता पंजीकरण',
    step1Desc: 'व्यक्तिगत विवरण, वोटर आईडी, प्रोफ़ाइल फ़ोटो दर्ज करें और सुरक्षा कैप्चा हल करें।',
    step2Title: '2. स्मार्ट सत्यापन',
    step2Desc: 'आधिकारिक मतदाता रिकॉर्ड के विरुद्ध स्वचालित स्मार्ट सत्यापन।',
    step3Title: '3. OTP प्रमाणीकरण',
    step3Desc: 'सुरक्षित लॉगिन के लिए आपके मोबाइल पर भेजा गया 6-अंकीय ओटीपी आवश्यक है।',
    step4Title: '4. गुप्त मतदान करें',
    step4Desc: 'क्रिप्टोग्राफिक रसीद टोकन और दोहरे वोट से सुरक्षा के साथ सुरक्षित मतदान करें।',
    
    // Chatbot
    chatTitle: 'वोटसाथी एआई सहायक',
    chatSubtitle: 'वोटिंग प्रक्रिया, उम्मीदवारों या ओटीपी सत्यापन के बारे में प्रश्न पूछें',
    chatPlaceholder: 'अंग्रेजी या हिंदी में प्रश्न पूछें (जैसे: एमपी में वोट कैसे दें?)...',
    
    // Quick Chat Prompts
    prompt1: 'मध्य प्रदेश (MP) या अपने राज्य में वोट कैसे दें?',
    prompt2: 'मतदान प्रमाणपत्र और इनवॉइस कैसे डाउनलोड करें?',
    prompt3: 'मेरे राज्य के चुनाव उम्मीदवार कौन हैं?',
    prompt4: 'ओटीपी और सुरक्षा सत्यापन कैसे काम करता है?',
    
    // Language Toggle
    langEn: 'English',
    langHi: 'हिंदी (Hindi)',
  }
};
