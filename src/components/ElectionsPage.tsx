import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Election, Candidate, Vote } from '../types';
import { Vote as VoteIcon, Calendar, CheckCircle2, Clock, Award, Eye, Search, X } from 'lucide-react';

interface ElectionsPageProps {
  elections: Election[];
  candidates: Candidate[];
  votes: Vote[];
  onNavigate: (view: string) => void;
}

export const ElectionsPage: React.FC<ElectionsPageProps> = ({
  elections,
  candidates,
  votes,
  onNavigate
}) => {
  const [filterState, setFilterState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [candidateDetailModal, setCandidateDetailModal] = useState<Candidate | null>(null);

  const stateList = [
    { code: 'all', name: '🇮🇳 All India / States' },
    { code: 'MP', name: '🏛️ Madhya Pradesh (MP)' },
    { code: 'UP', name: '🏛️ Uttar Pradesh (UP)' },
    { code: 'BR', name: '🏛️ Bihar (BR)' },
    { code: 'MH', name: '🏛️ Maharashtra (MH)' },
    { code: 'RJ', name: '🏛️ Rajasthan (RJ)' },
    { code: 'DL', name: '🏛️ Delhi NCT (DL)' },
    { code: 'GJ', name: '🏛️ Gujarat (GJ)' },
    { code: 'KA', name: '🏛️ Karnataka (KA)' },
    { code: 'TN', name: '🏛️ Tamil Nadu (TN)' },
    { code: 'WB', name: '🏛️ West Bengal (WB)' },
    { code: 'NAT', name: '🎓 National / Academic' }
  ];

  const filteredElections = elections.filter(e => {
    // Filter by state
    if (filterState !== 'all' && e.stateCode !== filterState) return false;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchElection = e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || (e.state && e.state.toLowerCase().includes(q));
      const matchCandidates = candidates.some(c => c.electionId === e.id && (c.name.toLowerCase().includes(q) || c.partyName.toLowerCase().includes(q) || c.partySymbol.toLowerCase().includes(q)));
      return matchElection || matchCandidates;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200 inline-block">
            🇮🇳 State-Wise Regional Political Directory
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Elections & Political Party Directory</h1>
          <p className="text-xs text-slate-600 max-w-2xl mx-auto">
            Explore state assembly elections across <strong>Madhya Pradesh, Bihar, Uttar Pradesh, Gujarat, Tamil Nadu, Karnataka</strong> and national ballots. View contesting candidates, party symbols, and manifestos.
          </p>
        </div>

        {/* Search Bar & State Filter Tabs */}
        <div className="space-y-4">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search party (BJP, Congress, RJD, SP, DMK, TVK, AAP), candidate or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {stateList.map(st => (
              <button
                key={st.code}
                onClick={() => setFilterState(st.code)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterState === st.code
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>

        {/* Elections List */}
        <div className="space-y-6">
          {filteredElections.map(election => {
            const electionCandidates = candidates.filter(c => c.electionId === election.id);
            return (
              <div key={election.id} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {election.category}
                      </span>
                      {election.state && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                          📍 {election.state}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{election.title}</h2>
                    <p className="text-xs text-slate-600 mt-1">{election.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      election.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : election.status === 'upcoming'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {election.status === 'active' ? <Clock className="w-4 h-4 text-emerald-600 animate-pulse" /> : null}
                      Status: {election.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Candidate List */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Participating Candidates ({electionCandidates.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {electionCandidates.map(cand => (
                      <div key={cand.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-start gap-3">
                        <img
                          src={cand.photoUrl}
                          alt={cand.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-300 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{cand.name}</h4>
                          <p className="text-[11px] text-blue-600 font-medium truncate">{cand.partyName}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Symbol: {cand.partySymbol}</p>

                          <button
                            type="button"
                            onClick={() => setCandidateDetailModal(cand)}
                            className="mt-2 text-[11px] text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View Manifesto
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vote CTA */}
                <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs">
                    <p className="font-semibold text-slate-200">Ready to participate?</p>
                    <p className="text-slate-400">Log in to your verified voter account to cast your vote securely.</p>
                  </div>
                  <button
                    onClick={() => onNavigate('login')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
                  >
                    Go to Voter Login
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Candidate Detail Modal */}
        <AnimatePresence>
          {candidateDetailModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 relative space-y-4"
              >
                <button
                  onClick={() => setCandidateDetailModal(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <img
                    src={candidateDetailModal.photoUrl}
                    alt={candidateDetailModal.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{candidateDetailModal.name}</h3>
                    <p className="text-xs text-blue-600 font-bold">{candidateDetailModal.partyName}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">Symbol: {candidateDetailModal.partySymbol}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-slate-500">Education Background</p>
                    <p className="font-semibold text-slate-800">{candidateDetailModal.education} (Age: {candidateDetailModal.age})</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold mb-1">Official Campaign Manifesto</p>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 leading-relaxed italic">
                      "{candidateDetailModal.manifesto}"
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCandidateDetailModal(null)}
                  className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-xs mt-2"
                >
                  Close Manifesto Window
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
