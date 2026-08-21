import React from 'react';
import { Election, Candidate, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { ShieldCheck, Vote, Key, CheckCircle2, UserCheck, Lock, Award, Bot, FileText, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface HomePageProps {
  elections: Election[];
  candidates: Candidate[];
  language: Language;
  onNavigate: (view: string) => void;
  onOpenPHPModal?: () => void;
  onQuickLoginAsVoter: () => void;
  onQuickLoginAsAdmin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  elections,
  candidates,
  language,
  onNavigate,
  onOpenPHPModal,
  onQuickLoginAsVoter,
  onQuickLoginAsAdmin,
}) => {
  const t = TRANSLATIONS[language];
  const activeElections = elections.filter(e => e.status === 'active');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 lg:py-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Online Voting System • 2026 Electoral Session</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => onNavigate('voter-dashboard')}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2 text-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  My Voter Dashboard
                </button>
                <button
                  onClick={() => onNavigate('results')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm shadow-md"
                >
                  <Vote className="w-4 h-4" />
                  {t.results} (2026)
                </button>
                <button
                  onClick={() => onNavigate('elections')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm"
                >
                  <Vote className="w-4 h-4 text-blue-400" />
                  {t.exploreElectionsBtn}
                </button>
              </div>

              {/* Quick Academic Demo Logins */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Quick Demo Testing:</span>
                <div className="flex gap-2">
                  <button
                    onClick={onQuickLoginAsVoter}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg font-medium transition-colors"
                  >
                    Login as Sample Voter (voter1)
                  </button>
                  <button
                    onClick={onQuickLoginAsAdmin}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg font-medium transition-colors"
                  >
                    Login as Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card Illustration */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-white">Official E-Voting Platform</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    ● Active System
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700 flex items-start gap-3">
                    <UserCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">Instant Smart Voter Verification</p>
                      <p className="text-slate-400">Direct registration & login without OTP delays for quick voting access.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-200">Strict Single-Vote System</p>
                      <p className="text-slate-400">Database constraints ensure each voter casts exactly one verified vote.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700 space-y-1">
                    <p className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                      📞 Official Helpline & Support:
                    </p>
                    <p className="text-slate-200 font-medium">Abhishek Shrivastava</p>
                    <p className="text-emerald-400 font-mono font-bold">Mobile: +91 9399409579</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('elections')}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Vote className="w-4 h-4" /> View Active State Elections & Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State Political Parties Showcase */}
      <section className="py-12 bg-blue-900 text-white border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-1">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
              🇮🇳 All-India Regional & State Coverage
            </span>
            <h2 className="text-2xl font-extrabold text-white">Elections & Political Parties Across Indian States</h2>
            <p className="text-xs text-blue-200">
              Select any state to explore regional political party profiles, manifestos, and voting directory.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Madhya Pradesh (MP)', code: 'MP', parties: 'BJP, Congress, BSP, AAP', color: 'from-orange-600 to-amber-700' },
              { name: 'Bihar', code: 'BR', parties: 'RJD, JD(U), BJP, LJP, INC', color: 'from-emerald-600 to-teal-800' },
              { name: 'Uttar Pradesh (UP)', code: 'UP', parties: 'BJP, SP, BSP, INC, RLD', color: 'from-blue-600 to-indigo-800' },
              { name: 'Gujarat (GJ)', code: 'GJ', parties: 'BJP, INC, AAP', color: 'from-purple-600 to-indigo-900' },
              { name: 'Tamil Nadu (TN)', code: 'TN', parties: 'DMK, AIADMK, TVK, NTK, BJP', color: 'from-rose-600 to-pink-800' },
              { name: 'Karnataka (KA)', code: 'KA', parties: 'INC, BJP, JD(S)', color: 'from-cyan-600 to-blue-800' },
            ].map(st => (
              <button
                key={st.code}
                onClick={() => onNavigate('elections')}
                className={`bg-gradient-to-br ${st.color} p-3.5 rounded-xl shadow-md border border-white/10 hover:scale-105 transition-all text-left flex flex-col justify-between h-full`}
              >
                <div>
                  <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-white font-bold">{st.code}</span>
                  <h3 className="font-bold text-xs text-white mt-1.5">{st.name}</h3>
                </div>
                <p className="text-[10px] text-white/80 mt-2 font-medium truncate">{st.parties}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.howItWorksTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              End-to-end transparent voting workflow designed for institutional accuracy and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.step1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step1Desc}</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.step2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step2Desc}</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.step3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step3Desc}</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 font-bold text-lg">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.step4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Elections Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Live Ballots</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Active Elections</h2>
            </div>
            <button
              onClick={() => onNavigate('elections')}
              className="mt-3 sm:mt-0 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View All Elections <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeElections.map(election => {
              const electionCandidates = candidates.filter(c => c.electionId === election.id);
              return (
                <div key={election.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active Election
                    </span>
                    <span className="text-xs text-slate-500">{election.category}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{election.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">{election.description}</p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-slate-500">Registered Candidates</p>
                      <p className="font-bold text-slate-800">{electionCandidates.length} Candidates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500">Votes Cast So Far</p>
                      <p className="font-bold text-blue-600">{election.totalVotes} Votes</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('elections')}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    View Candidates & Cast Vote <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
