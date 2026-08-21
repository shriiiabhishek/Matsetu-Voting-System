import React, { useState } from 'react';
import { User, Language } from '../types';
import { UserCheck, Shield, RefreshCw, AlertCircle, Lock, Globe } from 'lucide-react';
import { registerVoterInFirestore } from '../lib/firestoreService';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigate: (view: string) => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ 
  onRegisterSuccess, 
  onNavigate,
  language = 'en',
  onLanguageChange
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // CAPTCHA State
  const [num1, setNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (parseInt(captchaInput) !== (num1 + num2)) {
      setError('Incorrect CAPTCHA answer. Please try again.');
      refreshCaptcha();
      return;
    }

    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newUserDoc: Omit<User, 'id'> = {
        fullName,
        username,
        email,
        mobile,
        dob,
        voterId: voterId.toUpperCase(),
        isVerified: true,
        verificationStatus: 'verified',
        accountStatus: 'active',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
      };

      // 1. Direct Firestore Persistence
      const registeredUser = await registerVoterInFirestore(newUserDoc);

      // 2. Also notify Express backend for sync
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            username,
            email,
            mobile,
            dob,
            voterId,
            password,
            captchaInput,
            captchaExpected: num1 + num2
          })
        });
      } catch (backendErr) {
        console.warn('Backend sync backup notice:', backendErr);
      }

      onRegisterSuccess(registeredUser);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      {/* Top right language switch on gateway */}
      {onLanguageChange && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 border border-slate-700 shadow-md">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
              language === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
              language === 'hi' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      )}

      <div className="max-w-2xl w-full space-y-5">
        
        {/* Gateway Official Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xl ring-4 ring-emerald-500/20 mb-1">
            <UserCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'hi' ? 'मतदाता पंजीकरण पोर्टल' : 'मतदाता पंजीकरण | Voter Registration'}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {language === 'hi'
              ? 'राष्ट्रीय मतदाता सूची में नाम दर्ज करें • भारत निर्वाचन आयोग'
              : 'Enroll your voter profile with authentic EPIC ID • भारत निर्वाचन आयोग'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] px-3 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-time Firestore Database Integration
            </span>
          </div>
        </div>

        {/* Auth Mode Switcher Tabs */}
        <div className="bg-slate-800/90 p-1 rounded-2xl border border-slate-700 grid grid-cols-2 shadow-lg">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            <Lock className="w-3.5 h-3.5" /> Login to Portal
          </button>
          <button
            type="button"
            className="py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-emerald-600 text-white shadow-md"
          >
            <UserCheck className="w-3.5 h-3.5" /> Register New Voter
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">National Electoral Roll Enrollment</h2>
            <p className="text-xs text-slate-500 mt-0.5">Please provide authentic details matching your Government Identity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (as per ID) *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Desired Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. rahul_voter"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* Voter ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Voter ID (EPIC Number) *</label>
              <input
                type="text"
                required
                value={voterId}
                onChange={e => setVoterId(e.target.value)}
                placeholder="e.g. EPIC98765432"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50 font-mono uppercase"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Security Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* CAPTCHA Protection */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" /> Security CAPTCHA Challenge
              </label>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold font-mono tracking-widest shadow-inner">
                {num1} + {num2} = ?
              </div>
              <input
                type="number"
                required
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                placeholder="Answer"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all text-xs flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Registering in Firestore...' : 'Create Voter Account & Open Dashboard'}</span>
          </button>

          <p className="text-center text-xs text-slate-600 pt-1">
            Already registered with Matsetu?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
            >
              Sign In to Your Account
            </button>
          </p>
        </form>

        {/* Bottom Official 24/7 ECI Voter Support System */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              {language === 'hi' ? '24/7 मतदाता सहायता केंद्र' : '24/7 ECI Voter Support & Assistance'}
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
              {language === 'hi' ? 'सक्रिय हेल्पलाइन' : 'Live Helpline'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
              <span className="text-base">📞</span>
              <div>
                <p className="text-[10px] text-slate-400">{language === 'hi' ? 'टोल-फ्री हेल्पलाइन' : 'National Toll-Free Helpline'}</p>
                <p className="font-mono font-bold text-emerald-400 text-xs">1950 (Toll Free)</p>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
              <span className="text-base">🤖</span>
              <div>
                <p className="text-[10px] text-slate-400">{language === 'hi' ? 'वोटसाथी AI सहायक' : 'VoteSathi AI Assistant'}</p>
                <p className="font-bold text-emerald-400 text-xs">{language === 'hi' ? 'नीचे दाईं ओर टैप करें' : 'Tap bubble at bottom-right'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
