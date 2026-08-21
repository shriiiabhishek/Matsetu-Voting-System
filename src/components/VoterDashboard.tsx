import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { User, Election, Candidate, Vote, Notification } from '../types';
import { VoteInvoiceModal, VoteInvoiceData } from './VoteInvoiceModal';
import { EditProfileModal } from './EditProfileModal';
import { VoterIdCardModal } from './VoterIdCardModal';
import { LiveClock } from './LiveClock';
import { getNowTimestamp, formatExactDateTime } from '../utils/dateTime';
import {
  Vote as VoteIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  User as UserIcon,
  Bell,
  Sparkles,
  Award,
  Eye,
  Lock,
  X,
  Download,
  Printer,
  Edit3,
  Camera,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface VoterDashboardProps {
  currentUser: User;
  elections: Election[];
  candidates: Candidate[];
  votes: Vote[];
  notifications: Notification[];
  onCastVote: (electionId: string, candidateId: string) => Promise<any>;
  onUpdateProfile?: (updatedData: Partial<User>) => Promise<void>;
}

export const VoterDashboard: React.FC<VoterDashboardProps> = ({
  currentUser,
  elections,
  candidates,
  votes,
  notifications,
  onCastVote,
  onUpdateProfile
}) => {
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateDetailModal, setCandidateDetailModal] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingError, setVotingError] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<VoteInvoiceData | null>(null);
  const [filterState, setFilterState] = useState<string>('all');
  
  // Profile & PDF Modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showVoterIdModal, setShowVoterIdModal] = useState(false);


  const stateTabs = [
    { code: 'all', name: '🇮🇳 All States & Constituencies' },
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

  // Filter user's votes
  const userVotes = votes.filter(v => v.voterId === currentUser.id);

  const handleVoteSubmit = async () => {
    if (!selectedElection || !selectedCandidate) return;

    setVotingError(null);
    setIsSubmitting(true);

    try {
      const receipt = await onCastVote(selectedElection.id, selectedCandidate.id);
      
      // Trigger celebratory confetti on vote success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Show the Official ECI Voting Invoice & Certificate Modal
      const voteTimestamp = receipt?.vote?.votedAt || receipt?.votedAt || getNowTimestamp();
      setActiveInvoice({
        voteId: receipt?.vote?.id || receipt?.id || `vote-${Date.now()}`,
        receiptToken: receipt?.receiptToken || receipt?.vote?.receiptToken || 'VT-CONFIRMED-2026',
        timestamp: voteTimestamp,
        voter: currentUser,
        election: selectedElection,
        candidate: selectedCandidate,
        ipHash: receipt?.vote?.ipHash || receipt?.ipHash
      });

      setSelectedElection(null);
      setSelectedCandidate(null);
    } catch (err: any) {
      setVotingError(err.message || 'Failed to submit vote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openHistoryInvoice = (voteRecord: Vote) => {
    const el = elections.find(e => e.id === voteRecord.electionId) || {
      id: voteRecord.electionId,
      title: voteRecord.electionTitle || 'Democratic Election 2026',
      description: 'National General Assembly Election',
      category: 'General',
      startDate: '2026-08-01',
      endDate: '2026-08-30',
      status: 'completed',
      totalVotes: 100
    };

    const cand = candidates.find(c => c.id === voteRecord.candidateId) || {
      id: voteRecord.candidateId,
      electionId: voteRecord.electionId,
      name: voteRecord.candidateName || 'Contesting Candidate',
      partyName: voteRecord.partyName || 'Independent',
      partySymbol: '🇮🇳 Tricolor Emblem',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      manifesto: 'Public Service & Governance',
      age: 45,
      education: 'Graduate',
      voteCount: 1
    };

    setActiveInvoice({
      voteId: voteRecord.id,
      receiptToken: voteRecord.receiptToken,
      timestamp: voteRecord.votedAt,
      voter: currentUser,
      election: el as Election,
      candidate: cand as Candidate,
      ipHash: voteRecord.ipHash
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header & Profile Summary */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group shrink-0">
              <img
                src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={currentUser.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowEditProfileModal(true)}
                className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer"
                title="Click to change photo"
              >
                <Camera className="w-5 h-5 mb-0.5 text-blue-400" />
                Change Photo
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">Welcome, {currentUser.fullName}</h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Voter
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                EPIC Voter ID: <strong className="text-amber-300">{currentUser.voterId}</strong> | Mobile: +91 {currentUser.mobile}
              </p>
              <p className="text-xs text-slate-400">
                Email: <span className="text-blue-300 font-medium">{currentUser.email}</span> | Registered DOB: {currentUser.dob}
              </p>

              {/* Action Buttons: Edit Details, Upload Photo, Download PDF */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details & Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVoterIdModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Voter ID Card (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-700/80 text-left lg:text-right shrink-0 w-full lg:w-auto space-y-2">
            <div>
              <p className="text-[11px] text-slate-400">Total Ballots Cast</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">{userVotes.length} Elections Voted</p>
            </div>
            {/* Live Ticking Clock */}
            <div className="pt-2 border-t border-slate-700/60">
              <p className="text-[10px] text-slate-400 mb-1">Official Election Server Clock</p>
              <LiveClock variant="compact" />
            </div>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 lg:justify-end mt-1 font-semibold">
              <Lock className="w-3 h-3" /> UNIQUE Voter Guard Active
            </p>
          </div>
        </div>

        {/* Edit Profile & Photo Modal */}
        {showEditProfileModal && (
          <EditProfileModal
            currentUser={currentUser}
            onClose={() => setShowEditProfileModal(false)}
            onSaveProfile={async (updated) => {
              if (onUpdateProfile) {
                await onUpdateProfile(updated);
              }
            }}
          />
        )}

        {/* Download Digital Voter ID Card Modal */}
        {showVoterIdModal && (
          <VoterIdCardModal
            currentUser={currentUser}
            onClose={() => setShowVoterIdModal(false)}
          />
        )}

        {/* Official ECI Voting Invoice & Certificate Modal with PDF Download */}
        {activeInvoice && (
          <VoteInvoiceModal
            invoiceData={activeInvoice}
            onClose={() => setActiveInvoice(null)}
          />
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Elections & Voting Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <VoteIcon className="w-5 h-5 text-blue-600" /> State & Constituency Voting Console
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any state (e.g. <strong>Madhya Pradesh - MP</strong>, UP, Bihar, Maharashtra) or constituency to cast your vote.
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full shrink-0">
                  1 Vote per Registered Voter
                </span>
              </div>

              {/* State Selection Dropdown & Quick Tap Buttons */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1.5">
                    <span>🏛️ Select State / UT:</span>
                  </label>
                  <select
                    id="state-constituency-dropdown"
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-sm cursor-pointer"
                  >
                    {stateTabs.map(st => (
                      <option key={st.code} value={st.code}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick-Tap State Buttons */}
                <div>
                  <p className="text-[11px] font-bold text-slate-500 mb-1.5">⚡ Quick-Tap State Filter:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stateTabs.map(st => (
                      <button
                        key={st.code}
                        id={`btn-state-${st.code.toLowerCase()}`}
                        onClick={() => setFilterState(st.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          filterState === st.code
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600/30'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected State Notice Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-3 flex items-center justify-between gap-2 text-xs text-blue-950">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📍</span>
                    <span>
                      Active State: <strong className="text-blue-700">{stateTabs.find(s => s.code === filterState)?.name || 'All States'}</strong> — Tap on candidate to select and vote.
                    </span>
                  </div>
                  {filterState !== 'all' && (
                    <button
                      onClick={() => setFilterState('all')}
                      className="text-[10px] text-blue-600 hover:text-blue-800 underline font-semibold shrink-0"
                    >
                      Show All States
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {elections
                .filter(e => e.status === 'active')
                .filter(e => filterState === 'all' || e.stateCode === filterState)
                .map(election => {
                const hasVoted = userVotes.some(v => v.electionId === election.id);
                const electionCandidates = candidates.filter(c => c.electionId === election.id);
                const userVoteRecord = userVotes.find(v => v.electionId === election.id);

                return (
                  <div
                    key={election.id}
                    className={`bg-white rounded-2xl p-6 border transition-all shadow-sm ${
                      hasVoted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {election.category}
                          </span>
                          {election.state && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                              📍 {election.state}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{election.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {!hasVoted && (
                          <button
                            type="button"
                            onClick={() => setSelectedElection(election)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-xl transition-all"
                          >
                            🎯 Select Constituency
                          </button>
                        )}

                        {hasVoted ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You Voted
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-600" /> Voting Open
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-4">{election.description}</p>

                    {/* Candidate Voting Grid */}
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-slate-800">
                          Contesting Candidates ({electionCandidates.length}) — Tap 'Select' to choose:
                        </p>
                        {election.state && (
                          <span className="text-[11px] font-semibold text-slate-500 font-mono">
                            Region: {election.state} ({election.stateCode})
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {electionCandidates.map(cand => {
                          const isSelected = selectedElection?.id === election.id && selectedCandidate?.id === cand.id;
                          return (
                            <div
                              key={cand.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                hasVoted
                                  ? 'bg-slate-50 border-slate-200 opacity-85'
                                  : isSelected
                                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400 shadow-md'
                                  : 'bg-white border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={cand.photoUrl}
                                  alt={cand.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-xs text-slate-900 truncate">{cand.name}</h4>
                                  <p className="text-[11px] text-blue-600 font-medium truncate">{cand.partyName}</p>
                                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono inline-block mt-0.5">
                                    Symbol: {cand.partySymbol}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => setCandidateDetailModal(cand)}
                                  className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                                >
                                  <Eye className="w-3 h-3" /> Manifesto
                                </button>

                                {!hasVoted && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedElection(election);
                                      setSelectedCandidate(cand);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                                        : 'bg-slate-900 hover:bg-blue-600 text-white shadow-sm'
                                    }`}
                                  >
                                    {isSelected ? '✓ Selected for Vote' : '👉 Select Candidate'}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Vote Submit Bar if selected */}
                      {!hasVoted && selectedElection?.id === election.id && selectedCandidate && (
                        <div className="mt-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-5 rounded-2xl border border-blue-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                          <div className="space-y-1">
                            <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Confirmed Selection for {election.state || 'Constituency'}
                            </span>
                            <p className="font-extrabold text-base text-white">
                              {selectedCandidate.name}
                            </p>
                            <p className="text-xs text-blue-200">
                              Party: <strong>{selectedCandidate.partyName}</strong> | Symbol: <strong>{selectedCandidate.partySymbol}</strong>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleVoteSubmit}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                          >
                            <VoteIcon className="w-4 h-4" />
                            <span>{isSubmitting ? 'Casting Encrypted Ballot...' : `🗳️ Cast Official Vote in ${election.state || 'Election'}`}</span>
                          </button>
                        </div>
                      )}

                      {/* Receipt token banner if already voted with PDF invoice download */}
                      {hasVoted && userVoteRecord && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span>
                              🔐 Vote recorded on <strong className="font-mono">{userVoteRecord.votedAt}</strong>
                            </span>
                            <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-[11px]">
                              Receipt: {userVoteRecord.receiptToken}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => openHistoryInvoice(userVoteRecord)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Official Voting Invoice (PDF)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Voting History Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Personal Voting History & Cryptographic Logs
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Download official signed slips anytime</span>
              </div>

              {userVotes.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-3 text-center">No votes cast yet. Select an active election above to cast your ballot.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Election Title</th>
                        <th className="p-3">Receipt Token</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Official Slip / Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userVotes.map(v => {
                        const el = elections.find(e => e.id === v.electionId);
                        return (
                          <tr key={v.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">{el?.title || v.electionId}</td>
                            <td className="p-3 font-mono text-blue-700 font-bold">{v.receiptToken}</td>
                            <td className="p-3 text-slate-500">{v.votedAt}</td>
                            <td className="p-3">
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => openHistoryInvoice(v)}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF Invoice</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Notifications & Voter Profile */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Info Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-600" /> Voter Registration Card
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-semibold text-slate-900">{currentUser.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">{currentUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">EPIC Voter ID</span>
                  <span className="font-mono font-bold text-blue-600">{currentUser.voterId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Mobile</span>
                  <span className="font-semibold text-slate-900">+91 {currentUser.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-semibold text-slate-900">{currentUser.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Government Verified
                  </span>
                </div>
              </div>

              {/* Sidebar Quick Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowVoterIdModal(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Digital Voter ID (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Update Profile & Photo</span>
                </button>
              </div>
            </div>

            {/* Support Desk: Abhishek Shrivastava */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-3xl border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                  ECI Voter Support Desk
                </span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  ● 24/7 Available
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" /> Support: Abhishek Shrivastava
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  For voter authentication assistance, state election guidance & help:
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <a href="mailto:shrivastavaabhishek6677@gmail.com" className="text-amber-300 font-medium hover:underline text-[11px] truncate">
                    shrivastavaabhishek6677@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[11px]">
                  <span className="text-slate-400">Helpline:</span>
                  <a href="tel:+919399409579" className="text-emerald-400 font-mono font-bold hover:underline">
                    +91 9399409579
                  </a>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Toll-Free National:</span>
                  <span className="text-emerald-400 font-mono font-bold">1950 (Toll Free)</span>
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Bell className="w-4 h-4 text-amber-500" /> Election Bulletins
              </h3>

              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 mb-0.5">{n.title}</p>
                    <p className="text-slate-600 leading-normal">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Manifesto Modal */}
        {candidateDetailModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 relative space-y-4">
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
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Education & Age</p>
                    <p className="font-semibold text-slate-800">{candidateDetailModal.education} ({candidateDetailModal.age} yrs)</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">State & Region</p>
                    <p className="font-semibold text-slate-800">{candidateDetailModal.state || 'General State Constituency'}</p>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Nomination Recorded:</span>
                    <span className="font-mono text-slate-700 font-bold text-[11px]">
                      {candidateDetailModal.nominatedAt || candidateDetailModal.registeredAt || '2026-08-01 10:00:00'}
                    </span>
                  </div>
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
                Close Manifesto
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
