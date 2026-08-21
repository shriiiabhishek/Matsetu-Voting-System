import React from 'react';
import { User, Language, UserRole } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { Vote, Shield, LogOut, LayoutDashboard, Globe, Flame, CheckCircle2, UserCheck, BarChart3, Calendar } from 'lucide-react';
import { LiveClock } from './LiveClock';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenPHPModal?: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  language,
  onLanguageChange,
  onNavigate,
  onLogout,
  activeView
}) => {
  const t = TRANSLATIONS[language];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => onNavigate(currentUser ? (currentRole === 'admin' ? 'admin' : 'voter-dashboard') : 'login')}
          >
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-sm flex items-center justify-center border border-blue-400/30">
              <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  {t.brandName}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  2026 Session
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  <Flame className="w-3 h-3 text-orange-400 fill-orange-400" /> Firestore Synced
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">{t.academicBadge}</p>
            </div>
          </div>

          {/* Navigation Links — EXCLUSIVELY AVAILABLE AFTER LOGIN: Home -> Dashboard -> Results */}
          {currentUser && (
            <div className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'home' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t.home}
              </button>
              <button
                onClick={() => onNavigate(currentRole === 'admin' ? 'admin' : 'voter-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'voter-dashboard' || activeView === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'text-amber-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {currentRole === 'admin' ? 'Admin Center' : 'My Dashboard'}
              </button>
              <button
                onClick={() => onNavigate('results')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'results' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                {t.results}
              </button>
              <button
                onClick={() => onNavigate('elections')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'elections' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {t.elections}
              </button>
              <button
                onClick={() => onNavigate('verify')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'verify' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                {t.verify}
              </button>
            </div>
          )}

          {/* Actions & Role Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Real-time Running Clock (Date + Seconds) */}
            <div className="hidden sm:flex items-center">
              <LiveClock variant="badge" />
            </div>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-[11px] rounded-md font-bold transition-colors ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 text-[11px] rounded-md font-bold transition-colors ${
                  language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Auth Buttons / Profile Badge */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate(currentRole === 'admin' ? 'admin' : 'voter-dashboard')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <img
                    src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                    alt={currentUser.fullName}
                    className="w-5 h-5 rounded-full object-cover border border-slate-500"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold leading-tight block">{currentUser.fullName.split(' ')[0]}</span>
                    <span className="text-[9px] text-blue-400 font-mono block">
                      {currentRole === 'admin' ? 'ADMIN' : (currentUser.voterId || 'VOTER')}
                    </span>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                  title="Logout from session"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline text-[11px]">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onNavigate('login')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeView === 'login'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {t.login}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row when Logged In: Home -> Dashboard -> Results */}
        {currentUser && (
          <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs overflow-x-auto gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-2.5 py-1 rounded-md font-semibold ${activeView === 'home' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              {t.home}
            </button>
            <button
              onClick={() => onNavigate(currentRole === 'admin' ? 'admin' : 'voter-dashboard')}
              className={`px-2.5 py-1 rounded-md font-bold ${activeView === 'voter-dashboard' || activeView === 'admin' ? 'bg-amber-400 text-slate-950' : 'text-amber-300'}`}
            >
              {currentRole === 'admin' ? 'Admin' : 'Dashboard'}
            </button>
            <button
              onClick={() => onNavigate('results')}
              className={`px-2.5 py-1 rounded-md font-semibold ${activeView === 'results' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              {t.results}
            </button>
            <button
              onClick={() => onNavigate('elections')}
              className={`px-2.5 py-1 rounded-md font-semibold ${activeView === 'elections' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              {t.elections}
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className={`px-2.5 py-1 rounded-md font-semibold ${activeView === 'verify' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              {t.verify}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

