import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  increment,
  where,
  getDoc
} from 'firebase/firestore';
import { db, firebaseConfig } from './firebase';
import { User, Election, Candidate, Vote, LoginLog, AuditLog, UserRole } from '../types';
import { getNowTimestamp } from '../utils/dateTime';
import {
  INITIAL_USERS,
  INITIAL_ELECTIONS,
  INITIAL_CANDIDATES,
  INITIAL_VOTES,
  INITIAL_ADMINS
} from '../data/initialData';

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'matsetu_users',
  VOTES: 'matsetu_votes',
  ELECTIONS: 'matsetu_elections',
  CANDIDATES: 'matsetu_candidates',
  LOGIN_LOGS: 'matsetu_login_logs',
  AUDIT_TRAIL: 'matsetu_audit_trail'
};

export interface FirestoreStatePayload {
  users: User[];
  elections: Election[];
  candidates: Candidate[];
  votes: Vote[];
  loginLogs: LoginLog[];
  auditLogs: AuditLog[];
  isConnected: boolean;
  dbInfo: {
    projectId: string;
    databaseId: string;
    projectNumber: string;
  };
}

let isSeedingInProgress = false;

/**
 * Seed initial data if Firestore collections are empty on first initialization
 */
export async function seedInitialFirestoreData(): Promise<void> {
  if (isSeedingInProgress) return;
  isSeedingInProgress = true;

  try {
    const electionsSnapshot = await getDocs(collection(db, COLLECTIONS.ELECTIONS));
    if (electionsSnapshot.empty) {
      console.log('🌱 Seeding initial elections into Firestore...');
      for (const election of INITIAL_ELECTIONS) {
        await setDoc(doc(db, COLLECTIONS.ELECTIONS, election.id), {
          ...election,
          createdAt: new Date().toISOString()
        });
      }
    }

    const candidatesSnapshot = await getDocs(collection(db, COLLECTIONS.CANDIDATES));
    if (candidatesSnapshot.empty) {
      console.log('🌱 Seeding initial candidates into Firestore...');
      for (const candidate of INITIAL_CANDIDATES) {
        await setDoc(doc(db, COLLECTIONS.CANDIDATES, candidate.id), {
          ...candidate,
          createdAt: new Date().toISOString()
        });
      }
    }

    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    if (usersSnapshot.empty) {
      console.log('🌱 Seeding initial voters and admins into Firestore...');
      // Seed default admin
      await setDoc(doc(db, COLLECTIONS.USERS, INITIAL_ADMINS[0].id), {
        ...INITIAL_ADMINS[0],
        mobile: '9999999999',
        dob: '1990-01-01',
        voterId: 'ADMIN001',
        isVerified: true,
        verificationStatus: 'verified',
        accountStatus: 'active',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });

      // Seed initial voters
      for (const user of INITIAL_USERS) {
        await setDoc(doc(db, COLLECTIONS.USERS, user.id), {
          ...user,
          role: 'voter',
          lastLoginAt: user.createdAt
        });
      }
    }

    const votesSnapshot = await getDocs(collection(db, COLLECTIONS.VOTES));
    if (votesSnapshot.empty) {
      console.log('🌱 Seeding initial votes into Firestore...');
      for (const vote of INITIAL_VOTES) {
        await setDoc(doc(db, COLLECTIONS.VOTES, vote.id), vote);
      }
    }
  } catch (err) {
    console.warn('Firestore initial seeding notice (using local fallback if permission/offline):', err);
  } finally {
    isSeedingInProgress = false;
  }
}

/**
 * Setup Real-time Listeners on Firestore for live synchronization across all clients
 */
export function subscribeToFirestoreSync(
  onUpdate: (data: Partial<FirestoreStatePayload>) => void,
  onError?: (err: any) => void
): () => void {
  // Trigger initial seed check
  seedInitialFirestoreData();

  const unsubUsers = onSnapshot(
    collection(db, COLLECTIONS.USERS),
    (snapshot) => {
      const usersList: User[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as User),
        id: docSnap.id
      }));
      onUpdate({ users: usersList, isConnected: true });
    },
    (err) => {
      console.warn('Firestore users subscription notice:', err);
      onError?.(err);
    }
  );

  const unsubElections = onSnapshot(
    collection(db, COLLECTIONS.ELECTIONS),
    (snapshot) => {
      const electionsList: Election[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Election),
        id: docSnap.id
      }));
      onUpdate({ elections: electionsList, isConnected: true });
    },
    (err) => console.warn('Firestore elections subscription notice:', err)
  );

  const unsubCandidates = onSnapshot(
    collection(db, COLLECTIONS.CANDIDATES),
    (snapshot) => {
      const candidatesList: Candidate[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Candidate),
        id: docSnap.id
      }));
      onUpdate({ candidates: candidatesList, isConnected: true });
    },
    (err) => console.warn('Firestore candidates subscription notice:', err)
  );

  const unsubVotes = onSnapshot(
    collection(db, COLLECTIONS.VOTES),
    (snapshot) => {
      const votesList: Vote[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Vote),
        id: docSnap.id
      }));
      onUpdate({ votes: votesList, isConnected: true });
    },
    (err) => console.warn('Firestore votes subscription notice:', err)
  );

  const unsubLogs = onSnapshot(
    query(collection(db, COLLECTIONS.LOGIN_LOGS), limit(50)),
    (snapshot) => {
      const logsList: LoginLog[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as LoginLog),
        id: docSnap.id
      }));
      // Sort newest first
      logsList.sort((a, b) => (b.loginAt || '').localeCompare(a.loginAt || ''));
      onUpdate({ loginLogs: logsList });
    },
    (err) => console.warn('Firestore login logs subscription notice:', err)
  );

  const unsubAudit = onSnapshot(
    query(collection(db, COLLECTIONS.AUDIT_TRAIL), limit(50)),
    (snapshot) => {
      const auditList: AuditLog[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as AuditLog),
        id: docSnap.id
      }));
      auditList.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      onUpdate({ auditLogs: auditList });
    },
    (err) => console.warn('Firestore audit trail subscription notice:', err)
  );

  // Return unsubscribe function
  return () => {
    unsubUsers();
    unsubElections();
    unsubCandidates();
    unsubVotes();
    unsubLogs();
    unsubAudit();
  };
}

/**
 * Save new registered user in Firestore with audit log
 */
export async function registerVoterInFirestore(userData: Omit<User, 'id'> & { id?: string }): Promise<User> {
  const userId = userData.id || `usr-${Date.now()}`;
  const now = getNowTimestamp();

  const newUser: User = {
    ...userData,
    id: userId,
    isVerified: true,
    verificationStatus: 'verified',
    accountStatus: 'active',
    role: 'voter',
    createdAt: userData.createdAt || now,
    lastLoginAt: now,
    profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
  };

  // 1. Save user document
  await setDoc(doc(db, COLLECTIONS.USERS, userId), newUser);

  // 2. Add Login/Registration Log
  const logId = `log-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.LOGIN_LOGS, logId), {
    id: logId,
    userId,
    username: newUser.username,
    fullName: newUser.fullName,
    role: 'voter',
    loginAt: now,
    deviceInfo: navigator.userAgent.substring(0, 80),
    status: 'success'
  });

  // 3. Add to Audit Trail
  const auditId = `audit-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
    id: auditId,
    action: 'VOTER_REGISTERED_AND_LOGGED_IN',
    details: `Voter ${newUser.fullName} (EPIC: ${newUser.voterId}) registered & verified.`,
    timestamp: now,
    actor: newUser.username,
    type: 'registration'
  });

  return newUser;
}

/**
 * Find registered voter or admin in Firestore by identifier (username, email, voterId, mobile)
 */
export async function findVoterInFirestore(identifier: string): Promise<User | null> {
  const cleanId = identifier.trim();
  if (!cleanId) return null;

  try {
    const usersCol = collection(db, COLLECTIONS.USERS);
    
    // Check direct doc ID match
    const docDirect = await getDoc(doc(db, COLLECTIONS.USERS, cleanId));
    if (docDirect.exists()) {
      return { ...(docDirect.data() as User), id: docDirect.id };
    }

    // Try by username
    const qUsername = query(usersCol, where('username', '==', cleanId));
    const snapUsername = await getDocs(qUsername);
    if (!snapUsername.empty) {
      const docSnap = snapUsername.docs[0];
      return { ...(docSnap.data() as User), id: docSnap.id };
    }

    // Try by email
    const qEmail = query(usersCol, where('email', '==', cleanId));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) {
      const docSnap = snapEmail.docs[0];
      return { ...(docSnap.data() as User), id: docSnap.id };
    }

    // Try by Voter ID (EPIC)
    const qVoterId = query(usersCol, where('voterId', '==', cleanId.toUpperCase()));
    const snapVoterId = await getDocs(qVoterId);
    if (!snapVoterId.empty) {
      const docSnap = snapVoterId.docs[0];
      return { ...(docSnap.data() as User), id: docSnap.id };
    }

    // Try by mobile
    const qMobile = query(usersCol, where('mobile', '==', cleanId));
    const snapMobile = await getDocs(qMobile);
    if (!snapMobile.empty) {
      const docSnap = snapMobile.docs[0];
      return { ...(docSnap.data() as User), id: docSnap.id };
    }
  } catch (err) {
    console.warn('Firestore user lookup notice:', err);
  }

  // Fallback to initial users list if offline or seed
  const fallback = INITIAL_USERS.find(
    u => u.username.toLowerCase() === cleanId.toLowerCase() ||
         u.email.toLowerCase() === cleanId.toLowerCase() ||
         u.voterId.toUpperCase() === cleanId.toUpperCase() ||
         u.mobile === cleanId ||
         u.id === cleanId
  );

  return fallback || null;
}

/**
 * Record a user or admin login in Firestore and update user's lastLoginAt & login count
 */
export async function recordUserLoginInFirestore(user: User, role: UserRole): Promise<void> {
  const now = getNowTimestamp();
  const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    // 1. Update user record in Firestore with exact login timestamp and incremented session count
    const userRef = doc(db, COLLECTIONS.USERS, user.id);
    await setDoc(
      userRef,
      {
        lastLoginAt: now,
        loginCount: increment(1),
        role,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mobile: user.mobile || '',
        dob: user.dob || '',
        voterId: user.voterId || '',
        isVerified: user.isVerified ?? true,
        verificationStatus: user.verificationStatus || 'verified',
        accountStatus: user.accountStatus || 'active'
      },
      { merge: true }
    );

    // 2. Add Login Log Document with full exact timestamp, date & time, and client details
    await setDoc(doc(db, COLLECTIONS.LOGIN_LOGS, logId), {
      id: logId,
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      voterId: user.voterId || '',
      role,
      loginAt: now,
      deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 80) : 'Web Client',
      status: 'success'
    });

    // 3. Add to Audit Trail
    const auditId = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
      id: auditId,
      action: `${role.toUpperCase()}_LOGIN_RECORDED`,
      details: `${role === 'admin' ? 'Administrator' : 'Voter'} ${user.fullName} (@${user.username}, EPIC: ${user.voterId || 'N/A'}) logged into portal successfully at ${now}.`,
      timestamp: now,
      actor: user.username || user.fullName,
      type: 'login'
    });
    console.log(`✅ Login event persisted to Firestore for ${user.fullName} (${role}) at ${now}`);
  } catch (err) {
    console.warn('Firestore login record notice:', err);
  }
}

/**
 * Cast a vote in Firestore with double-voting prevention check
 */
export async function castVoteInFirestore(
  electionId: string,
  electionTitle: string,
  voter: User,
  candidateId: string,
  candidateName: string,
  partyName: string
): Promise<{ success: boolean; vote: Vote; receiptToken: string }> {
  // Check if voter already cast ballot for this election in Firestore
  const q = query(
    collection(db, COLLECTIONS.VOTES),
    where('electionId', '==', electionId),
    where('voterId', '==', voter.id)
  );
  const existingVotes = await getDocs(q);

  if (!existingVotes.empty) {
    throw new Error('DUPLICATE VOTE REJECTED: You have already cast your vote in this election.');
  }

  const receiptToken = `VT-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
  const voteId = `vote-${Date.now()}`;
  const now = getNowTimestamp();

  const newVote: Vote = {
    id: voteId,
    electionId,
    electionTitle: electionTitle || 'General Election',
    voterId: voter.id,
    voterName: voter.fullName,
    voterEpic: voter.voterId || voter.username,
    candidateId,
    candidateName: candidateName || 'Contesting Candidate',
    partyName: partyName || 'Independent',
    votedAt: now,
    receiptToken,
    ipHash: Math.random().toString(36).substring(2, 10)
  };

  // 1. Save complete vote document in Firestore
  await setDoc(doc(db, COLLECTIONS.VOTES, voteId), newVote);

  // 2. Increment candidate vote count in Firestore
  try {
    const candidateRef = doc(db, COLLECTIONS.CANDIDATES, candidateId);
    await updateDoc(candidateRef, {
      voteCount: increment(1)
    });
  } catch (err) {
    console.warn('Candidate vote count increment notice:', err);
  }

  // 3. Increment election total votes in Firestore
  try {
    const electionRef = doc(db, COLLECTIONS.ELECTIONS, electionId);
    await updateDoc(electionRef, {
      totalVotes: increment(1)
    });
  } catch (err) {
    console.warn('Election total votes increment notice:', err);
  }

  // 4. Add to Audit Trail
  const auditId = `audit-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
    id: auditId,
    action: 'VOTE_CAST_SUCCESS',
    details: `Voter ${voter.fullName} (EPIC: ${voter.voterId}) voted for ${candidateName} (${partyName}) in "${electionTitle}". Token: ${receiptToken}`,
    timestamp: now,
    actor: `${voter.fullName} (${voter.voterId || voter.username})`,
    type: 'vote'
  });

  return { success: true, vote: newVote, receiptToken };
}

/**
 * Admin: Add election to Firestore
 */
export async function addElectionToFirestore(electionData: Omit<Election, 'id' | 'totalVotes'>): Promise<Election> {
  const electionId = `elec-${Date.now()}`;
  const now = getNowTimestamp();
  const newElection: Election = {
    ...electionData,
    id: electionId,
    totalVotes: 0
  };

  await setDoc(doc(db, COLLECTIONS.ELECTIONS, electionId), newElection);

  const auditId = `audit-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
    id: auditId,
    action: 'ELECTION_CREATED',
    details: `New election "${newElection.title}" created.`,
    timestamp: now,
    actor: 'admin',
    type: 'admin'
  });

  return newElection;
}

/**
 * Admin: Add candidate to Firestore
 */
export async function addCandidateToFirestore(candidateData: Omit<Candidate, 'id' | 'voteCount'>): Promise<Candidate> {
  const candidateId = `cand-${Date.now()}`;
  const now = getNowTimestamp();
  const newCandidate: Candidate = {
    ...candidateData,
    id: candidateId,
    voteCount: 0,
    nominatedAt: now,
    registeredAt: now
  };

  await setDoc(doc(db, COLLECTIONS.CANDIDATES, candidateId), newCandidate);

  const auditId = `audit-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
    id: auditId,
    action: 'CANDIDATE_ADDED',
    details: `Candidate "${newCandidate.name}" (${newCandidate.partyName}) added to election ${newCandidate.electionId}.`,
    timestamp: now,
    actor: 'admin',
    type: 'admin'
  });

  return newCandidate;
}

/**
 * Admin: Update election status in Firestore
 */
export async function updateElectionStatusInFirestore(electionId: string, status: Election['status']): Promise<void> {
  const electionRef = doc(db, COLLECTIONS.ELECTIONS, electionId);
  await updateDoc(electionRef, { status });

  const auditId = `audit-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
    id: auditId,
    action: 'ELECTION_STATUS_CHANGED',
    details: `Election ${electionId} status changed to "${status}".`,
    timestamp: getNowTimestamp(),
    actor: 'admin',
    type: 'admin'
  });
}

/**
 * Admin: Update voter status in Firestore
 */
export async function updateVoterStatusInFirestore(
  userId: string,
  accountStatus?: User['accountStatus'],
  verificationStatus?: User['verificationStatus']
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const updates: any = {};
  if (accountStatus) updates.accountStatus = accountStatus;
  if (verificationStatus) {
    updates.verificationStatus = verificationStatus;
    updates.isVerified = verificationStatus === 'verified';
  }

  await updateDoc(userRef, updates);

  const auditId = `audit-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
    id: auditId,
    action: 'VOTER_STATUS_UPDATED',
    details: `Voter ID ${userId} updated (Status: ${accountStatus || 'unchanged'}, Verification: ${verificationStatus || 'unchanged'}).`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor: 'admin',
    type: 'status_change'
  });
}

/**
 * Update voter profile details (email, photo, mobile, dob, etc.) in Firestore
 */
export async function updateUserProfileInFirestore(
  userId: string,
  updatedFields: Partial<User>
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, updatedFields);

  const auditId = `audit-${Date.now()}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  await setDoc(doc(db, COLLECTIONS.AUDIT_TRAIL, auditId), {
    id: auditId,
    action: 'VOTER_PROFILE_UPDATED',
    details: `Voter ID ${userId} updated their personal credentials (${Object.keys(updatedFields).join(', ')}).`,
    timestamp: now,
    actor: updatedFields.fullName || userId,
    type: 'status_change'
  });
}

