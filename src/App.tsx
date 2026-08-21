import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Election, Candidate, Vote, Notification, Language, UserRole, LoginLog, AuditLog } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { RegisterPage } from './components/RegisterPage';
import { VoterVerificationPage } from './components/VoterVerificationPage';
import { LoginPage } from './components/LoginPage';
import { VoterDashboard } from './components/VoterDashboard';
import { ElectionsPage } from './components/ElectionsPage';
import { ResultsPage } from './components/ResultsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { VoteSathiChatbot } from './components/VoteSathiChatbot';
import {
  subscribeToFirestoreSync,
  recordUserLoginInFirestore,
  castVoteInFirestore,
  addElectionToFirestore,
  addCandidateToFirestore,
  updateElectionStatusInFirestore,
  updateVoterStatusInFirestore,
  updateUserProfileInFirestore
} from './lib/firestoreService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<string>('login');

  // App State (Synced with Firestore in Real-Time & Express Backend)
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [voters, setVoters] = useState<User[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  const totalVotersCount = voters.length || 4;
  const verifiedVotersCount = voters.filter(v => v.isVerified).length || 3;

  // Fallback REST fetch
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      if (data.elections && elections.length === 0) setElections(data.elections);
      if (data.candidates && candidates.length === 0) setCandidates(data.candidates);
      if (data.votes && votes.length === 0) setVotes(data.votes);
      if (data.users && voters.length === 0) setVoters(data.users);
      if (data.notifications) setNotifications(data.notifications);
    } catch (err) {
      console.warn('REST state fallback notice:', err);
    }
  };

  // Setup Firestore Real-time synchronization
  useEffect(() => {
    fetchState();

    const unsubscribe = subscribeToFirestoreSync(
      (update) => {
        if (update.users && update.users.length > 0) setVoters(update.users);
        if (update.elections && update.elections.length > 0) setElections(update.elections);
        if (update.candidates && update.candidates.length > 0) setCandidates(update.candidates);
        if (update.votes && update.votes.length > 0) setVotes(update.votes);
        if (update.loginLogs) setLoginLogs(update.loginLogs);
        if (update.auditLogs) setAuditLogs(update.auditLogs);
        if (update.isConnected !== undefined) setIsFirestoreConnected(update.isConnected);
      },
      (err) => {
        console.warn('Firestore live listener error:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Handlers
  const handleRegisterSuccess = async (user: User) => {
    setCurrentUser(user);
    setCurrentRole('voter');
    // Record login in Firestore
    await recordUserLoginInFirestore(user, 'voter');
    setActiveView('voter-dashboard');
  };

  const handleLoginSuccess = async (user: User, role: UserRole) => {
    setCurrentUser(user);
    setCurrentRole(role);
    // Persist login record in Firestore instantly
    await recordUserLoginInFirestore(user, role);
    setActiveView(role === 'admin' ? 'admin' : 'voter-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setActiveView('login');
  };


  // Quick Demo Logins
  const handleQuickLoginAsVoter = () => {
    const voter: User = voters[0] || {
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
      createdAt: '2026-01-10'
    };
    handleLoginSuccess(voter, 'voter');
  };

  const handleQuickLoginAsAdmin = () => {
    const adminUser: User = {
      id: 'admin-1',
      fullName: 'System Administrator',
      username: 'admin',
      email: 'admin@voting.edu',
      mobile: '9999999999',
      dob: '1990-01-01',
      voterId: 'ADMIN001',
      isVerified: true,
      verificationStatus: 'verified',
      accountStatus: 'active',
      role: 'admin',
      createdAt: '2026-01-01'
    };
    handleLoginSuccess(adminUser, 'admin');
  };

  const handleCastVote = async (electionId: string, candidateId: string) => {
    if (!currentUser) throw new Error('You must be logged in as a verified voter.');

    const election = elections.find(e => e.id === electionId);
    const electionTitle = election ? election.title : 'State / National Election';
    const candidate = candidates.find(c => c.id === candidateId);
    const candidateName = candidate ? candidate.name : 'Selected Candidate';
    const partyName = candidate ? candidate.partyName : 'Party';

    // 1. Cast directly to Firestore (Storing full voter info, who they voted for, and enforcing single-vote constraint)
    const firestoreResult = await castVoteInFirestore(
      electionId,
      electionTitle,
      currentUser,
      candidateId,
      candidateName,
      partyName
    );

    // 2. Also sync to backend API
    try {
      await fetch('/api/vote/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId,
          electionTitle,
          voterId: currentUser.id,
          voterName: currentUser.fullName,
          voterEpic: currentUser.voterId,
          candidateId,
          candidateName,
          partyName
        })
      });
    } catch (e) {
      console.warn('Backend vote backup notice:', e);
    }

    return firestoreResult;
  };

  // Admin Actions
  const handleAddElection = async (electionData: any) => {
    const newElec = await addElectionToFirestore(electionData);
    try {
      await fetch('/api/admin/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(electionData)
      });
    } catch (e) {}
    return { success: true, election: newElec };
  };

  const handleAddCandidate = async (candidateData: any) => {
    const newCand = await addCandidateToFirestore(candidateData);
    try {
      await fetch('/api/admin/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      });
    } catch (e) {}
    return { success: true, candidate: newCand };
  };

  const handleToggleElectionStatus = async (electionId: string, status: string) => {
    await updateElectionStatusInFirestore(electionId, status as Election['status']);
    try {
      await fetch(`/api/admin/elections/${electionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {}
    return { success: true };
  };

  const handleUpdateVoterStatus = async (userId: string, accountStatus?: User['accountStatus'], verificationStatus?: User['verificationStatus']) => {
    await updateVoterStatusInFirestore(userId, accountStatus, verificationStatus);
    try {
      await fetch(`/api/admin/voters/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountStatus, verificationStatus })
      });
    } catch (e) {}
    return { success: true };
  };

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem('matsetu_user', JSON.stringify(updatedUser));
    
    // Update in voter state list
    setVoters(prev => prev.map(v => v.id === currentUser.id ? { ...v, ...updatedData } : v));

    try {
      await updateUserProfileInFirestore(currentUser.id, updatedData);
    } catch (err) {
      console.error('Failed to sync updated profile with Firestore:', err);
    }

    try {
      await fetch('/api/voter/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, ...updatedData })
      });
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar — Exclusively visible when authenticated to prevent repetitive header on initial landing */}
      {currentUser && (
        <Navbar
          currentUser={currentUser}
          currentRole={currentRole}
          language={language}
          onLanguageChange={setLanguage}
          onNavigate={setActiveView}
          onLogout={handleLogout}
          activeView={activeView}
        />
      )}

      {/* Main Content Area with Window Transitions */}
      <main className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView + (currentUser ? '-auth' : '-guest')}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* UN-AUTHENTICATED: Only Gateway Window (Login & Registration) */}
            {!currentUser ? (
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigate={setActiveView}
                onQuickLoginAsVoter={handleQuickLoginAsVoter}
                onQuickLoginAsAdmin={handleQuickLoginAsAdmin}
                language={language}
                onLanguageChange={setLanguage}
              />
            ) : (
              /* AUTHENTICATED: Full Portal Dashboard & Operations (All views visible) */
              <>
                {activeView === 'home' && (
                  <HomePage
                    elections={elections}
                    candidates={candidates}
                    language={language}
                    onNavigate={setActiveView}
                    onQuickLoginAsVoter={handleQuickLoginAsVoter}
                    onQuickLoginAsAdmin={handleQuickLoginAsAdmin}
                  />
                )}

                {(activeView === 'login' || activeView === 'register' || activeView === 'voter-dashboard') && currentRole !== 'admin' && (
                  <VoterDashboard
                    currentUser={currentUser}
                    elections={elections}
                    candidates={candidates}
                    votes={votes}
                    notifications={notifications}
                    onCastVote={handleCastVote}
                    onUpdateProfile={handleUpdateProfile}
                  />
                )}

                {(activeView === 'login' || activeView === 'register' || activeView === 'admin') && currentRole === 'admin' && (
                  <AdminDashboard
                    elections={elections}
                    candidates={candidates}
                    votes={votes}
                    voters={voters}
                    loginLogs={loginLogs}
                    auditLogs={auditLogs}
                    isFirestoreConnected={isFirestoreConnected}
                    totalVotersCount={totalVotersCount}
                    verifiedVotersCount={verifiedVotersCount}
                    onAddElection={handleAddElection}
                    onAddCandidate={handleAddCandidate}
                    onToggleElectionStatus={handleToggleElectionStatus}
                    onUpdateVoterStatus={handleUpdateVoterStatus}
                  />
                )}

                {activeView === 'elections' && (
                  <ElectionsPage
                    elections={elections}
                    candidates={candidates}
                    votes={votes}
                    onNavigate={setActiveView}
                  />
                )}

                {activeView === 'verify' && (
                  <VoterVerificationPage />
                )}

                {activeView === 'results' && (
                  <ResultsPage
                    elections={elections}
                    candidates={candidates}
                    votes={votes}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AI Chatbot Support System — Available at the bottom across all views (including initial login window) */}
      <VoteSathiChatbot language={language} currentUser={currentUser} />

      {/* Footer — Visible in full portal mode after login */}
      {currentUser && <Footer />}
    </div>
  );
}
