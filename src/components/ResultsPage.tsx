import React, { useState } from 'react';
import { Election, Candidate, Vote } from '../types';
import { Award, BarChart3, PieChart, Users, CheckCircle2, Trophy } from 'lucide-react';

interface ResultsPageProps {
  elections: Election[];
  candidates: Candidate[];
  votes: Vote[];
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  elections,
  candidates,
  votes
}) => {
  const [filterState, setFilterState] = useState<string>('all');

  const stateTabs = [
    { code: 'all', name: 'All States / National' },
    { code: 'MP', name: 'Madhya Pradesh (MP)' },
    { code: 'BR', name: 'Bihar' },
    { code: 'UP', name: 'Uttar Pradesh (UP)' },
    { code: 'GJ', name: 'Gujarat (GJ)' },
    { code: 'TN', name: 'Tamil Nadu (TN)' },
    { code: 'KA', name: 'Karnataka (KA)' }
  ];

  const filteredElections = elections.filter(e => filterState === 'all' || e.stateCode === filterState);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200 inline-block">
            🇮🇳 State & National Live Vote Analytics
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">State-Wise Election Results & Party Standings</h1>
          <p className="text-xs text-slate-600">
            Real-time candidate breakdown, percentage vote share, and leading political parties across MP, Bihar, UP, Gujarat, Tamil Nadu, Karnataka.
          </p>

          {/* State Filter Bar */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {stateTabs.map(st => (
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

        {/* Elections Results Cards */}
        <div className="space-y-8">
          {filteredElections.map(election => {
            const electionCandidates = candidates.filter(c => c.electionId === election.id);
            const totalElectionVotes = electionCandidates.reduce((sum, c) => sum + c.voteCount, 0);

            // Sort candidates by vote count descending to highlight winner
            const sortedCandidates = [...electionCandidates].sort((a, b) => b.voteCount - a.voteCount);
            const winningCandidate = sortedCandidates[0];

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
                  </div>

                  <div className="bg-slate-100 p-3 rounded-xl text-right text-xs shrink-0">
                    <p className="text-slate-500">Total Valid Votes</p>
                    <p className="text-lg font-extrabold text-blue-600">{totalElectionVotes} Ballots</p>
                  </div>
                </div>

                {/* Leading Candidate Highlight Banner */}
                {winningCandidate && totalElectionVotes > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-4 text-amber-950">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-bold text-amber-800">Currently Leading Candidate</p>
                      <h3 className="font-extrabold text-base">{winningCandidate.name} ({winningCandidate.partyName})</h3>
                      <p className="text-xs text-amber-900 font-medium">
                        {winningCandidate.voteCount} Votes ({((winningCandidate.voteCount / (totalElectionVotes || 1)) * 100).toFixed(1)}% Share)
                      </p>
                    </div>
                  </div>
                )}

                {/* Candidate Percentage Breakdown */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate Vote Share Breakdown</h3>

                  <div className="space-y-4">
                    {sortedCandidates.map((cand, idx) => {
                      const percentage = totalElectionVotes > 0 ? ((cand.voteCount / totalElectionVotes) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={cand.id} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-400 font-mono">#{idx + 1}</span>
                              <span className="font-bold text-slate-900">{cand.name}</span>
                              <span className="text-slate-500 font-medium">({cand.partyName})</span>
                            </div>
                            <div className="text-right font-mono font-bold text-slate-800">
                              {cand.voteCount} Votes ({percentage}%)
                            </div>
                          </div>

                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full transition-all duration-500 ${
                                idx === 0 ? 'bg-emerald-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
