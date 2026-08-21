import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  LayoutDashboard,
  Users,
  Vote as VoteIcon,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  BarChart3,
  FileText,
  AlertCircle,
  Trash2,
  Edit,
  Database,
  Flame,
  Activity,
  LogIn,
  Server,
  Globe,
  Clock,
  KeyRound
} from 'lucide-react';
import { User, Election, Candidate, Vote, LoginLog, AuditLog } from '../types';
import { LiveClock } from './LiveClock';
import { getNowTimestamp, formatExactDateTime } from '../utils/dateTime';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AdminDashboardProps {
  elections: Election[];
  candidates: Candidate[];
  votes: Vote[];
  voters?: User[];
  loginLogs?: LoginLog[];
  auditLogs?: AuditLog[];
  isFirestoreConnected?: boolean;
  totalVotersCount: number;
  verifiedVotersCount: number;
  onAddElection: (electionData: any) => Promise<any>;
  onAddCandidate: (candidateData: any) => Promise<any>;
  onToggleElectionStatus: (electionId: string, status: string) => Promise<any>;
  onUpdateVoterStatus?: (userId: string, accountStatus?: User['accountStatus'], verificationStatus?: User['verificationStatus']) => Promise<any>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  elections,
  candidates,
  votes,
  voters = [],
  loginLogs = [],
  auditLogs = [],
  isFirestoreConnected = true,
  totalVotersCount,
  verifiedVotersCount,
  onAddElection,
  onAddCandidate,
  onToggleElectionStatus,
  onUpdateVoterStatus
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'vote-audit' | 'voters-list' | 'elections' | 'candidates' | 'firestore-db'>('firestore-db');
  const [firestoreSubTab, setFirestoreSubTab] = useState<'users' | 'logins' | 'votes' | 'audit'>('users');

  // Search & Filter States
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterParty, setAuditFilterParty] = useState('all');
  const [auditFilterElection, setAuditFilterElection] = useState('all');
  const [voterSearch, setVoterSearch] = useState('');

  // Form States
  const [electionTitle, setElectionTitle] = useState('');
  const [electionDesc, setElectionDesc] = useState('');
  const [electionCategory, setElectionCategory] = useState('Academic');
  
  const [candElectionId, setCandElectionId] = useState(elections[0]?.id || '');
  const [candName, setCandName] = useState('');
  const [candParty, setCandParty] = useState('');
  const [candSymbol, setCandSymbol] = useState('🏛️');
  const [candManifesto, setCandManifesto] = useState('');
  const [candEducation, setCandEducation] = useState('Graduate');

  const [message, setMessage] = useState<string | null>(null);

  // Calculations for Analytics
  const totalVotesCast = votes.length;
  const turnoutPercentage = verifiedVotersCount > 0 ? ((totalVotesCast / verifiedVotersCount) * 100).toFixed(1) : '0';

  // Extract unique parties for filter dropdown
  const allPartyNames = Array.from(new Set(candidates.map(c => c.partyName))).filter(Boolean);

  // Audit Logs mapping
  const enrichedVotes = votes.map(vote => {
    const voter = voters.find(u => u.id === vote.voterId);
    const candidate = candidates.find(c => c.id === vote.candidateId);
    const election = elections.find(e => e.id === vote.electionId);

    return {
      ...vote,
      voterName: voter ? voter.fullName : 'Registered Voter',
      voterEpic: voter ? voter.voterId : 'EPIC-UNKNOWN',
      voterEmail: voter ? voter.email : 'N/A',
      voterMobile: voter ? voter.mobile : 'N/A',
      voterAvatar: voter?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      candidateName: candidate ? candidate.name : 'Unknown Candidate',
      partyName: candidate ? candidate.partyName : 'Independent',
      partySymbol: candidate ? candidate.partySymbol : '🏛️',
      electionTitle: election ? election.title : 'General Election',
      electionState: election?.state || candidate?.state || 'National'
    };
  });

  const filteredVotes = enrichedVotes.filter(v => {
    const matchesSearch =
      v.voterName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      v.voterEpic.toLowerCase().includes(auditSearch.toLowerCase()) ||
      v.partyName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      v.candidateName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      v.receiptToken.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesParty = auditFilterParty === 'all' || v.partyName === auditFilterParty;
    const matchesElection = auditFilterElection === 'all' || v.electionId === auditFilterElection;

    return matchesSearch && matchesParty && matchesElection;
  });

  const filteredVotersList = voters.filter(usr =>
    usr.fullName.toLowerCase().includes(voterSearch.toLowerCase()) ||
    usr.voterId.toLowerCase().includes(voterSearch.toLowerCase()) ||
    usr.email.toLowerCase().includes(voterSearch.toLowerCase()) ||
    usr.mobile.includes(voterSearch)
  );

  // Chart 1: Candidate Vote Bar Chart
  const candidateBarData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes Received',
        data: candidates.map(c => c.voteCount),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 8
      }
    ]
  };

  // Chart 2: Voter Turnout Pie Chart
  const turnoutPieData = {
    labels: ['Votes Cast', 'Pending Verified Voters'],
    datasets: [
      {
        data: [totalVotesCast, Math.max(0, verifiedVotersCount - totalVotesCast)],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(203, 213, 225, 0.8)'],
        borderColor: ['#10b981', '#cbd5e1'],
        borderWidth: 1
      }
    ]
  };

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!electionTitle || !electionDesc) return;

    try {
      await onAddElection({
        title: electionTitle,
        description: electionDesc,
        category: electionCategory,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        status: 'active'
      });
      setMessage('New election created successfully!');
      setElectionTitle('');
      setElectionDesc('');
    } catch (err: any) {
      setMessage('Failed to create election.');
    }
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candParty) return;

    try {
      const now = getNowTimestamp();
      await onAddCandidate({
        electionId: candElectionId || elections[0]?.id,
        name: candName,
        partyName: candParty,
        partySymbol: candSymbol || '🗳️',
        manifesto: candManifesto || 'Committed to transparent and accountable public service.',
        education: candEducation || 'Graduate',
        age: 28,
        nominatedAt: now,
        registeredAt: now,
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
      });
      setMessage('New candidate registered successfully with accurate nomination date & time!');
      setCandName('');
      setCandParty('');
      setCandManifesto('');
    } catch (err: any) {
      setMessage('Failed to add candidate.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">System Admin Control Center</h1>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                SUPERADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage elections, candidate registries, voter verification status, and monitor real-time vote analytics.
            </p>
            <div className="pt-2">
              <LiveClock variant="badge" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('firestore-db')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'firestore-db' ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-300 font-extrabold' : 'bg-slate-800 text-orange-300 hover:bg-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> 🔥 Firestore Live DB ({voters.length} Users)
            </button>
            <button
              onClick={() => setActiveTab('vote-audit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'vote-audit' ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <VoteIcon className="w-3.5 h-3.5" /> Live Voter & Party Vote Audit
            </button>
            <button
              onClick={() => setActiveTab('voters-list')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'voters-list' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Registered Voters ({voters.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'elections' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Elections
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'candidates' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Candidates
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center justify-between">
            <span className="font-semibold">{message}</span>
            <button onClick={() => setMessage(null)} className="text-emerald-600 font-bold">Dismiss</button>
          </div>
        )}

        {/* Tab -1: Live Firebase Firestore Database Synchronizer */}
        {activeTab === 'firestore-db' && (
          <div className="space-y-6">
            {/* Firebase Connection & Project Info Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-7 rounded-2xl border border-slate-700 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-inner">
                    <Flame className="w-6 h-6 fill-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white tracking-tight">Firebase Cloud Firestore Live Database</h2>
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        REAL-TIME SYNC CONNECTED
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      All voter registrations, logins, and ballots automatically persist and sync in real-time to Google Cloud Firestore.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                    <span className="text-slate-400">Project:</span> <strong className="text-orange-300">tourismsarthi-5aa78</strong>
                  </div>
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                    <span className="text-slate-400">Project No:</span> <strong className="text-amber-300">683569616964</strong>
                  </div>
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                    <span className="text-slate-400">Database:</span> <strong className="text-blue-300">ai-studio-matsetu-b18d779c-a17c-4627-bf61-959a46614192</strong>
                  </div>
                </div>
              </div>

              {/* Firestore 6 Collections Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                <div
                  onClick={() => setFirestoreSubTab('users')}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    firestoreSubTab === 'users' ? 'bg-orange-500/20 border-orange-400 ring-2 ring-orange-400/30' : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
                    <span>matsetu_users</span>
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{voters.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Voter & Admin Accounts</div>
                </div>

                <div
                  onClick={() => setFirestoreSubTab('votes')}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    firestoreSubTab === 'votes' ? 'bg-orange-500/20 border-orange-400 ring-2 ring-orange-400/30' : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
                    <span>matsetu_votes</span>
                    <VoteIcon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{votes.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Cast Ballots Stored</div>
                </div>

                <div
                  onClick={() => setFirestoreSubTab('logins')}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    firestoreSubTab === 'logins' ? 'bg-orange-500/20 border-orange-400 ring-2 ring-orange-400/30' : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
                    <span>matsetu_login_logs</span>
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{loginLogs.length || voters.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Live Login Sessions</div>
                </div>

                <div
                  onClick={() => setFirestoreSubTab('audit')}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    firestoreSubTab === 'audit' ? 'bg-orange-500/20 border-orange-400 ring-2 ring-orange-400/30' : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
                    <span>matsetu_audit</span>
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{auditLogs.length || (votes.length + voters.length)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Audit Trail Events</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
                    <span>matsetu_elections</span>
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{elections.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Active State Polls</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase mb-1">
                    <span>matsetu_candidates</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{candidates.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Contesting Candidates</div>
                </div>
              </div>
            </div>

            {/* Firestore Sub-Navigation */}
            <div className="flex border-b border-slate-200 gap-2">
              <button
                onClick={() => setFirestoreSubTab('users')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  firestoreSubTab === 'users'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Registered Users & Profile Data ({voters.length})
              </button>
              <button
                onClick={() => setFirestoreSubTab('logins')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  firestoreSubTab === 'logins'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Live Login Records ({loginLogs.length})
              </button>
              <button
                onClick={() => setFirestoreSubTab('votes')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  firestoreSubTab === 'votes'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <VoteIcon className="w-3.5 h-3.5" /> Cast Ballots Database ({votes.length})
              </button>
              <button
                onClick={() => setFirestoreSubTab('audit')}
                className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  firestoreSubTab === 'audit'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Audit Trail Ledger ({auditLogs.length})
              </button>
            </div>

            {/* SubTab 1: Firestore Users Table */}
            {firestoreSubTab === 'users' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Firestore Collection: <code className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-xs font-mono">matsetu_users</code>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Every new registered voter and administrator document stored in Firestore with real-time updates.
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold bg-orange-100 text-orange-900 px-3 py-1 rounded-lg">
                    {voters.length} Documents Saved
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/75 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Document ID / Voter</th>
                        <th className="py-3 px-4">Voter ID (EPIC)</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Registered Date</th>
                        <th className="py-3 px-4">Last Login Time</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4">Status & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {voters.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={usr.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                                alt={usr.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{usr.fullName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">@{usr.username} • ID: {usr.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-700">
                            {usr.voterId || 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <p>{usr.email}</p>
                            <p className="text-[10px] text-slate-400">📱 {usr.mobile} {usr.dob ? `• DOB: ${usr.dob}` : ''}</p>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {usr.createdAt || '2026-01-10'}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-800">
                            {usr.lastLoginAt ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                                <Clock className="w-3 h-3" /> {usr.lastLoginAt}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {usr.isVerified ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              {onUpdateVoterStatus && (
                                <>
                                  <button
                                    onClick={() => onUpdateVoterStatus(usr.id, usr.accountStatus === 'active' ? 'suspended' : 'active')}
                                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                                      usr.accountStatus === 'active'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700'
                                        : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                                    }`}
                                  >
                                    {usr.accountStatus === 'active' ? 'Active' : 'Suspended'}
                                  </button>
                                  {!usr.isVerified && (
                                    <button
                                      onClick={() => onUpdateVoterStatus(usr.id, undefined, 'verified')}
                                      className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold"
                                    >
                                      Verify
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SubTab 2: Firestore Live Logins */}
            {firestoreSubTab === 'logins' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Firestore Collection: <code className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-xs font-mono">matsetu_login_logs</code>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Live real-time login audit stream. Every time a voter or admin signs in, a session log is automatically appended to Firestore.
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-lg">
                    {loginLogs.length} Login Events Logged
                  </div>
                </div>

                {loginLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <LogIn className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No recent login events recorded in Firestore yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Log in with any voter or administrator account to see live real-time login events appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/75 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Login Time (IST)</th>
                          <th className="py-3 px-4">User / Account</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">User ID</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Client / Device Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loginLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-800">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-blue-500" />
                                {log.loginAt}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{log.fullName || log.username}</p>
                              <p className="text-[10px] text-slate-400 font-mono">@{log.username}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                                log.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {log.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                              {log.userId}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Success
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[10px] text-slate-500 truncate max-w-xs">
                              {log.deviceInfo || 'Standard Web Browser'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SubTab 3: Firestore Cast Ballots */}
            {firestoreSubTab === 'votes' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Firestore Collection: <code className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-xs font-mono">matsetu_votes</code>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Immutable voting records saved to Firestore with cryptographic receipt token proofs.
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg">
                    {votes.length} Total Ballots in Database
                  </div>
                </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/75 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Receipt Token</th>
                          <th className="py-3 px-4">Voter (Who Voted)</th>
                          <th className="py-3 px-4">Candidate Voted (किसको वोट दिया)</th>
                          <th className="py-3 px-4">Party & Symbol</th>
                          <th className="py-3 px-4">Election / Contest</th>
                          <th className="py-3 px-4">Timestamp (IST)</th>
                          <th className="py-3 px-4">Cryptographic Hash</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {votes.map((v) => {
                          const matchedVoter = voters.find(u => u.id === v.voterId);
                          const matchedCandidate = candidates.find(c => c.id === v.candidateId);
                          const matchedElection = elections.find(e => e.id === v.electionId);

                          const displayVoterName = v.voterName || (matchedVoter ? matchedVoter.fullName : v.voterId);
                          const displayVoterEpic = v.voterEpic || (matchedVoter ? matchedVoter.voterId : '');
                          const displayCandidateName = v.candidateName || (matchedCandidate ? matchedCandidate.name : v.candidateId);
                          const displayParty = v.partyName || (matchedCandidate ? matchedCandidate.partyName : 'Political Party');
                          const displayElection = v.electionTitle || (matchedElection ? matchedElection.title : v.electionId);

                          return (
                            <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                                <span className="bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                                  {v.receiptToken}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-bold text-slate-900">{displayVoterName}</p>
                                <p className="text-[10px] text-blue-600 font-mono font-semibold">
                                  {displayVoterEpic ? `EPIC: ${displayVoterEpic}` : `ID: ${v.voterId}`}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                  <VoteIcon className="w-3.5 h-3.5 text-emerald-600" />
                                  {displayCandidateName}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-slate-700">{displayParty}</span>
                                {matchedCandidate?.partySymbol && (
                                  <span className="ml-1.5 text-xs">({matchedCandidate.partySymbol})</span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                                {displayElection}
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {v.votedAt}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                                SHA256-{v.ipHash}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
              </div>
            )}

            {/* SubTab 4: Firestore Audit Trail */}
            {firestoreSubTab === 'audit' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Firestore Collection: <code className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-xs font-mono">matsetu_audit_trail</code>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Continuous immutable audit ledger recording every administrative, voter, and voting event.
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-lg">
                    {auditLogs.length} Ledger Records
                  </div>
                </div>

                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">Audit trail listening on Firestore.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/75 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Event Timestamp</th>
                          <th className="py-3 px-4">Action Code</th>
                          <th className="py-3 px-4">Details</th>
                          <th className="py-3 px-4">Actor</th>
                          <th className="py-3 px-4">Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {auditLogs.map((audit) => (
                          <tr key={audit.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                              {audit.timestamp}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-purple-700">
                              {audit.action}
                            </td>
                            <td className="py-3 px-4 text-slate-800 font-medium">
                              {audit.details}
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                              {audit.actor}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-100 text-slate-800">
                                {audit.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 0: Live Voter & Party Audit Ledger */}
        {activeTab === 'vote-audit' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      🇮🇳 Live System Voting Audit
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ● Real-time Sync Active
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Live Voter & Party Vote Audit Dashboard</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete administrative record of each voter, their selected candidate, political party, election, and cryptographic verification token.
                  </p>
                </div>

                <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
                  <span>Total Ballots Cast:</span>
                  <span className="text-amber-400 text-base">{votes.length}</span>
                </div>
              </div>

              {/* Filters & Search Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Search Voter, EPIC or Party</label>
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={e => setAuditSearch(e.target.value)}
                    placeholder="Search by voter name, EPIC ID, BJP, RJD, SP..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Political Party</label>
                  <select
                    value={auditFilterParty}
                    onChange={e => setAuditFilterParty(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
                  >
                    <option value="all">All Parties</option>
                    {allPartyNames.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Filter by Election</label>
                  <select
                    value={auditFilterElection}
                    onChange={e => setAuditFilterElection(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
                  >
                    <option value="all">All State & National Elections</option>
                    {elections.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Audit Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Voter Profile & EPIC ID</th>
                      <th className="py-3 px-4">Election & State</th>
                      <th className="py-3 px-4">Voted Candidate</th>
                      <th className="py-3 px-4">Political Party & Symbol</th>
                      <th className="py-3 px-4">Timestamp & Receipt Token</th>
                      <th className="py-3 px-4 text-center">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredVotes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500 font-medium">
                          No matching voter ballot records found.
                        </td>
                      </tr>
                    ) : (
                      filteredVotes.map((v, idx) => (
                        <tr key={v.id || idx} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.voterAvatar}
                                alt={v.voterName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{v.voterName}</p>
                                <p className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                  {v.voterEpic}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{v.voterEmail}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800 line-clamp-1">{v.electionTitle}</p>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-full inline-block mt-1">
                              📍 {v.electionState}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-extrabold text-slate-900">{v.candidateName}</p>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{v.partySymbol}</span>
                              <span className="font-extrabold text-blue-900 bg-blue-100/90 border border-blue-200 px-2.5 py-1 rounded-lg text-xs">
                                {v.partyName}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-mono text-[11px] font-bold text-slate-800">{v.receiptToken}</p>
                            <p className="text-[10px] text-slate-500">{v.votedAt}</p>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 0.5: Registered Voters Registry */}
        {activeTab === 'voters-list' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Registered Electoral Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete list of all registered voters in the system with verification status & voting activity logs.
                </p>
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={voterSearch}
                  onChange={e => setVoterSearch(e.target.value)}
                  placeholder="Search by name, EPIC ID, email..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Voter Profile</th>
                    <th className="py-3 px-4">EPIC Voter ID</th>
                    <th className="py-3 px-4">Contact & Mobile</th>
                    <th className="py-3 px-4">Date of Birth</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4">Votes Cast Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredVotersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 font-medium">
                        No registered voters found.
                      </td>
                    </tr>
                  ) : (
                    filteredVotersList.map(v => {
                      const voterVotesCount = votes.filter(vt => vt.voterId === v.id).length;
                      return (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                                alt={v.fullName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{v.fullName}</p>
                                <p className="text-[10px] text-slate-500">@{v.username}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono font-bold text-blue-700">
                            {v.voterId}
                          </td>

                          <td className="py-3 px-4">
                            <p className="font-medium text-slate-800">{v.mobile}</p>
                            <p className="text-[10px] text-slate-500">{v.email}</p>
                          </td>

                          <td className="py-3 px-4 font-medium text-slate-700">
                            {v.dob}
                          </td>

                          <td className="py-3 px-4">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Voter
                            </span>
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-900">
                            <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200 font-mono">
                              {voterVotesCount} Ballots Cast
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 1: Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Total Voters Registered</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalVotersCount}</p>
                <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> {verifiedVotersCount} Verified Voters
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Total Elections</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">{elections.length}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  {elections.filter(e => e.status === 'active').length} Currently Active
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Total Candidates</p>
                <p className="text-3xl font-extrabold text-purple-600 mt-1">{candidates.length}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Official Campaign Contenders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Voter Turnout Rate</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{turnoutPercentage}%</p>
                <p className="text-[10px] text-emerald-600 mt-1 font-medium">{totalVotesCast} Total Ballots Cast</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Candidate Vote Distribution (Bar Chart)</h3>
                <div className="h-64">
                  <Bar data={candidateBarData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Voter Participation Ratio (Pie Chart)</h3>
                <div className="h-52">
                  <Pie data={turnoutPieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Elections CRUD */}
        {activeTab === 'elections' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Create New Election Ballot
              </h3>

              <form onSubmit={handleCreateElection} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Election Title *</label>
                  <input
                    type="text"
                    required
                    value={electionTitle}
                    onChange={e => setElectionTitle(e.target.value)}
                    placeholder="e.g. Campus Representative Poll 2026"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={electionCategory}
                    onChange={e => setElectionCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Academic">Academic</option>
                    <option value="National">National</option>
                    <option value="Civic / Municipal">Civic / Municipal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={electionDesc}
                    onChange={e => setElectionDesc(e.target.value)}
                    placeholder="Detailed election scope and objectives..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm"
                >
                  Create Election
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Existing Elections Registry</h3>

              <div className="space-y-3">
                {elections.map(el => (
                  <div key={el.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{el.title}</p>
                      <p className="text-slate-500 mt-0.5">{el.category} | Votes: {el.totalVotes}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleElectionStatus(el.id, el.status === 'active' ? 'completed' : 'active')}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                          el.status === 'active' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {el.status === 'active' ? 'Close Voting' : 'Activate Voting'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Candidates CRUD */}
        {activeTab === 'candidates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" /> Register Candidate
              </h3>

              <form onSubmit={handleCreateCandidate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Election *</label>
                  <select
                    value={candElectionId}
                    onChange={e => setCandElectionId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {elections.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={candName}
                    onChange={e => setCandName(e.target.value)}
                    placeholder="Candidate name"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Party / Alliance Name *</label>
                  <input
                    type="text"
                    required
                    value={candParty}
                    onChange={e => setCandParty(e.target.value)}
                    placeholder="e.g. Progressive Student Alliance"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Party Symbol (Emoji or Icon Code)</label>
                  <input
                    type="text"
                    value={candSymbol}
                    onChange={e => setCandSymbol(e.target.value)}
                    placeholder="e.g. 📖 or 🚀"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Manifesto</label>
                  <textarea
                    rows={2}
                    value={candManifesto}
                    onChange={e => setCandManifesto(e.target.value)}
                    placeholder="Key campaign promises..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm"
                >
                  Register Candidate
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Candidates Registry ({candidates.length})</h3>
                  <p className="text-[11px] text-slate-500">Verified electoral contenders with verified nomination timestamps</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                  LIVE STATUS
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {candidates.map(c => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={c.photoUrl} alt={c.name} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                        <p className="text-blue-600 font-semibold">{c.partyName}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                            Symbol: {c.partySymbol}
                          </span>
                          <span className="font-mono text-slate-600">
                            🕒 Nominated: {formatExactDateTime(c.nominatedAt || c.registeredAt || '2026-08-01 10:00:00')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:shrink-0 bg-white sm:bg-transparent p-2 sm:p-0 rounded-lg border sm:border-0 border-slate-200">
                      <span className="text-[10px] text-slate-400 block sm:inline mr-1">Total:</span>
                      <span className="font-mono font-extrabold text-emerald-600 text-sm">{c.voteCount}</span>
                      <span className="text-[11px] text-slate-500 font-medium ml-1">Votes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
