export type UserRole = 'voter' | 'admin';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  dob: string;
  voterId: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountStatus: 'active' | 'suspended';
  profilePhoto?: string;
  createdAt: string;
  lastLoginAt?: string;
  loginCount?: number;
  role?: UserRole;
}

export interface LoginLog {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  role: UserRole;
  loginAt: string;
  deviceInfo?: string;
  status: 'success' | 'failed';
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  actor: string;
  type: 'vote' | 'registration' | 'login' | 'admin' | 'status_change';
}

export interface Candidate {
  id: string;
  electionId: string;
  name: string;
  partyName: string;
  partySymbol: string;
  photoUrl: string;
  manifesto: string;
  age: number;
  education: string;
  voteCount: number;
  state?: string;
  stateCode?: string;
  nominatedAt?: string;
  registeredAt?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  totalVotes: number;
  state?: string;
  stateCode?: string;
}

export interface Vote {
  id: string;
  electionId: string;
  electionTitle?: string;
  voterId: string;
  voterName?: string;
  voterEpic?: string;
  candidateId: string;
  candidateName?: string;
  partyName?: string;
  votedAt: string;
  receiptToken: string;
  ipHash: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export interface OTPRecord {
  mobileOrEmail: string;
  otp: string;
  expiresAt: number;
}

export interface PHPFileItem {
  filename: string;
  path: string;
  category: 'database' | 'config' | 'auth' | 'voter' | 'admin' | 'chatbot' | 'docs';
  content: string;
  description: string;
}

export type Language = 'en' | 'hi';
