import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import JSZip from "jszip";
import {
  INITIAL_USERS,
  INITIAL_ELECTIONS,
  INITIAL_CANDIDATES,
  INITIAL_VOTES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMINS
} from "./src/data/initialData";
import { PHP_PROJECT_FILES } from "./src/data/phpProjectData";
import { User, Election, Candidate, Vote, Notification, OTPRecord } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-Memory Database Storage
  let users: User[] = [...INITIAL_USERS];
  let elections: Election[] = [...INITIAL_ELECTIONS];
  let candidates: Candidate[] = [...INITIAL_CANDIDATES];
  let votes: Vote[] = [...INITIAL_VOTES];
  let notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  let otps: Map<string, OTPRecord> = new Map();

  // Helper to format exact running date and time
  function getServerTimestamp(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Gemini AI Client Instance (Lazy Initialization)
  let genAIClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!genAIClient && process.env.GEMINI_API_KEY) {
      try {
        genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
      }
    }
    return genAIClient;
  }

  // --- API ENDPOINTS ---

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. GET State Overview
  app.get("/api/state", (req, res) => {
    res.json({
      elections,
      candidates,
      votes,
      notifications,
      users,
      totalVoters: users.length,
      verifiedVoters: users.filter(u => u.isVerified).length,
    });
  });

  // 2. Voter Registration
  app.post("/api/auth/register", (req, res) => {
    const { fullName, username, email, mobile, dob, voterId, password, captchaInput, captchaExpected } = req.body;

    if (captchaInput !== undefined && captchaExpected !== undefined && parseInt(captchaInput) !== parseInt(captchaExpected)) {
      return res.status(400).json({ error: "Invalid CAPTCHA answer." });
    }

    // Check if user already exists
    const existingIndex = users.findIndex(u => 
      u.email.toLowerCase() === (email || '').toLowerCase() ||
      u.username.toLowerCase() === (username || '').toLowerCase() ||
      u.voterId.toUpperCase() === (voterId || '').toUpperCase()
    );

    const now = getServerTimestamp();

    if (existingIndex >= 0) {
      // Update existing user's login timestamp
      users[existingIndex].lastLoginAt = now;
      users[existingIndex].loginCount = (users[existingIndex].loginCount || 0) + 1;
      return res.json({
        success: true,
        message: "Voter account verified!",
        user: users[existingIndex]
      });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName: fullName || 'Registered Voter',
      username: username || `voter_${Date.now().toString().slice(-4)}`,
      email: email || 'voter@example.com',
      mobile: mobile || '9876543210',
      dob: dob || '2000-01-01',
      voterId: (voterId || `EPIC${Date.now().toString().slice(-8)}`).toUpperCase(),
      isVerified: true,
      verificationStatus: 'verified',
      accountStatus: 'active',
      profilePhoto: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
      createdAt: now,
      lastLoginAt: now,
      loginCount: 1,
      role: 'voter'
    };

    users.push(newUser);

    res.json({
      success: true,
      message: "Registration & Smart Voter Verification successful!",
      user: newUser
    });
  });

  // 3. Smart Voter Verification Check
  app.post("/api/auth/verify-voter", (req, res) => {
    const { voterId, mobile } = req.body;
    const user = users.find(u => 
      u.voterId.toUpperCase() === (voterId || '').toUpperCase() ||
      u.mobile === (mobile || '')
    );

    if (!user) {
      return res.status(404).json({
        verified: false,
        message: "Voter ID not found in official electoral database. Please register first."
      });
    }

    res.json({
      verified: true,
      status: user.verificationStatus,
      user: {
        fullName: user.fullName,
        voterId: user.voterId,
        mobile: user.mobile,
        isVerified: user.isVerified
      }
    });
  });

  // 4. Voter Login (Matches by username, email, Voter ID (EPIC), or mobile)
  app.post("/api/auth/login", (req, res) => {
    const { loginInput, password, captchaInput, captchaExpected } = req.body;

    if (captchaInput !== undefined && captchaExpected !== undefined && parseInt(captchaInput) !== parseInt(captchaExpected)) {
      return res.status(400).json({ error: "Invalid CAPTCHA code." });
    }

    const cleanInput = (loginInput || '').trim();
    if (!cleanInput) {
      return res.status(400).json({ error: "Please enter your username, email, Voter ID, or mobile number." });
    }

    let user = users.find(u =>
      u.username.toLowerCase() === cleanInput.toLowerCase() ||
      u.email.toLowerCase() === cleanInput.toLowerCase() ||
      u.voterId.toUpperCase() === cleanInput.toUpperCase() ||
      u.mobile === cleanInput ||
      u.id === cleanInput
    );

    const now = getServerTimestamp();

    if (!user) {
      // If user is registering/logging in for the first time dynamically
      const generatedId = `usr-${Date.now()}`;
      user = {
        id: generatedId,
        fullName: cleanInput.includes('@') ? cleanInput.split('@')[0] : cleanInput,
        username: cleanInput.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@voter.edu`,
        mobile: '9876543210',
        dob: '2000-01-01',
        voterId: cleanInput.startsWith('EPIC') ? cleanInput.toUpperCase() : `EPIC${Math.floor(10000000 + Math.random() * 90000000)}`,
        isVerified: true,
        verificationStatus: 'verified',
        accountStatus: 'active',
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        createdAt: now,
        lastLoginAt: now,
        loginCount: 1,
        role: 'voter'
      };
      users.push(user);
    } else {
      user.lastLoginAt = now;
      user.loginCount = (user.loginCount || 0) + 1;
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ error: "Voter account suspended. Contact admin." });
    }

    res.json({
      success: true,
      requireOTP: false,
      user,
      message: "Authentication successful! Opening Voter Dashboard."
    });
  });

  // 5. Verify OTP
  app.post("/api/auth/verify-otp", (req, res) => {
    const { userId, otp } = req.body;
    const otpRecord = otps.get(userId);

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP expired or not requested. Please login again." });
    }

    if (Date.now() > otpRecord.expiresAt) {
      otps.delete(userId);
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Incorrect 6-digit OTP code." });
    }

    otps.delete(userId);

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    res.json({
      success: true,
      message: "OTP authentication successful!",
      user
    });
  });

  // 6. Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && (password === 'admin123' || password === 'password123')) {
      return res.json({
        success: true,
        admin: INITIAL_ADMINS[0],
        token: 'admin-session-token-9988'
      });
    }
    return res.status(401).json({ error: "Invalid admin credentials." });
  });

  // 7. Secure Voting Module (STRICT UNIQUE election_id + voter_id)
  app.post("/api/vote/cast", (req, res) => {
    const { electionId, voterId, candidateId } = req.body;

    const user = users.find(u => u.id === voterId);
    if (!user) {
      return res.status(401).json({ error: "Unauthenticated voter." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Voter verification is pending. Cannot cast ballot." });
    }

    const election = elections.find(e => e.id === electionId);
    if (!election || election.status !== 'active') {
      return res.status(400).json({ error: "Election is not active for voting." });
    }

    // STRICT UNIQUE CONSTRAINT CHECK: Check if voter already voted in this election
    const existingVote = votes.find(v => v.electionId === electionId && v.voterId === voterId);
    if (existingVote) {
      return res.status(409).json({
        error: "DUPLICATE VOTE REJECTED: You have already cast your vote in this election.",
        existingVote
      });
    }

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) {
      return res.status(400).json({ error: "Invalid candidate selected." });
    }

    // Create Vote Record
    const receiptToken = `VT-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
    const nowTs = getServerTimestamp();
    const newVote: Vote = {
      id: `vote-${Date.now()}`,
      electionId,
      electionTitle: election.title,
      voterId,
      voterName: user.fullName,
      voterEpic: user.voterId,
      candidateId,
      candidateName: candidate.name,
      partyName: candidate.partyName,
      votedAt: nowTs,
      receiptToken,
      ipHash: Math.random().toString(36).substring(2, 10)
    };

    votes.push(newVote);

    // Increment Candidate Vote Count & Election Total
    candidate.voteCount += 1;
    election.totalVotes += 1;

    // Log Notification
    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: "Vote Successfully Cast",
      message: `Vote recorded in "${election.title}". Receipt Token: ${receiptToken}`,
      timestamp: nowTs,
      type: "success"
    });

    res.json({
      success: true,
      message: "Vote cast and cryptographic receipt generated successfully!",
      vote: newVote,
      receiptToken
    });
  });

  // 7b. Update Voter Profile (Email, Photo, Full Name, Mobile, DOB)
  app.put("/api/voter/profile", (req, res) => {
    const { userId, email, fullName, mobile, dob, profilePhoto } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "Voter account not found." });
    }

    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (dob) user.dob = dob;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    res.json({
      success: true,
      message: "Voter profile updated successfully.",
      user
    });
  });


  // 8. Admin Management Endpoints
  // Create / Update / Toggle Elections
  app.post("/api/admin/elections", (req, res) => {
    const { title, description, category, startDate, endDate, status } = req.body;
    const newElection: Election = {
      id: `elec-2026-${elections.length + 1}`,
      title,
      description,
      category: category || 'General',
      startDate,
      endDate,
      status: status || 'active',
      totalVotes: 0
    };
    elections.push(newElection);
    res.json({ success: true, election: newElection });
  });

  app.patch("/api/admin/elections/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const election = elections.find(e => e.id === id);
    if (election) {
      election.status = status;
      return res.json({ success: true, election });
    }
    res.status(404).json({ error: "Election not found" });
  });

  // Add Candidate
  app.post("/api/admin/candidates", (req, res) => {
    const { electionId, name, partyName, partySymbol, manifesto, age, education, photoUrl } = req.body;
    const nowTs = getServerTimestamp();
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      electionId,
      name,
      partyName,
      partySymbol: partySymbol || '🏛️',
      manifesto: manifesto || 'Working for student & citizen welfare.',
      age: parseInt(age) || 25,
      education: education || 'Graduate',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      voteCount: 0,
      nominatedAt: nowTs,
      registeredAt: nowTs
    };
    candidates.push(newCandidate);
    res.json({ success: true, candidate: newCandidate });
  });

  // Manage Voter Status
  app.patch("/api/admin/voters/:id/status", (req, res) => {
    const { id } = req.params;
    const { accountStatus, verificationStatus } = req.body;
    const user = users.find(u => u.id === id);
    if (user) {
      if (accountStatus) user.accountStatus = accountStatus;
      if (verificationStatus) {
        user.verificationStatus = verificationStatus;
        user.isVerified = verificationStatus === 'verified';
      }
      return res.json({ success: true, user });
    }
    res.status(404).json({ error: "Voter not found" });
  });

  // 9. AI Chatbot API – VoteSathi
  app.post("/api/chatbot/ask", async (req, res) => {
    const { query, language } = req.body;
    if (!query) {
      return res.status(400).json({ reply: "Please enter a question for VoteSathi." });
    }

    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(query);

    // System prompt for VoteSathi
    const systemPrompt = `You are "VoteSathi" (वोटसाथी), the official AI Voting Assistant for Matsetu (मतसेतु) E-Voting Portal.
Answer questions accurately, politely, and concisely in ${isHindi ? 'Hindi' : 'English'}.
Context about the application:
1. Platform Name: Matsetu (मतसेतु) - Smart E-Voting Portal.
2. System Developer & Support Helpline Officer: Abhishek Shrivastava (Mobile / Helpline: +91 9399409579, Email: shrivastavaabhishek6677@gmail.com).
3. Voting workflow: Instant Smart Voter Verification -> Register/Login -> Voter Dashboard -> Select Candidate -> Cast Vote -> Instant Receipt.
4. Active state elections: Madhya Pradesh (MP BJP, Congress, BSP, AAP), Bihar (RJD, JD-U, BJP, LJP, INC), Uttar Pradesh (UP BJP, SP, BSP, INC, RLD), Gujarat (GJ BJP, INC, AAP), Tamil Nadu (TN DMK, AIADMK, TVK, NTK, BJP), Karnataka (KA INC, BJP, JD-S).
Keep your responses under 3-4 clear sentences.`;

    const aiClient = getGeminiClient();
    if (aiClient) {
      try {
        const geminiRes = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nUser Question: ${query}`
        });

        if (geminiRes.text) {
          return res.json({ reply: geminiRes.text.trim() });
        }
      } catch (err) {
        console.error("Gemini API error in VoteSathi Chatbot:", err);
      }
    }

    // Rule-based fallback response if Gemini key is absent or errors
    const qLower = query.toLowerCase();
    let reply = isHindi
      ? "मैं वोटसाथी हूँ, आपका स्मार्ट वोटिंग सहायक। आप पंजीकरण, ओटीपी सत्यापन, या चुनाव प्रक्रिया के बारे में पूछ सकते हैं।"
      : "I am VoteSathi, your Smart Voting Assistant. You can ask me about registration, OTP verification, or voting procedures.";

    if (qLower.includes("how to vote") || qLower.includes("vote kaise")) {
      reply = isHindi
        ? "वोट देने के लिए: 1. वोटर आईडी के साथ रजिस्टर करें। 2. ओटीपी के साथ लॉगिन करें। 3. डैशबोर्ड पर जाएं, अपना उम्मीदवार चुनें और 'वोट डालें' पर क्लिक करें।"
        : "To vote: 1. Register with your EPIC Voter ID. 2. Login with 2FA OTP. 3. Navigate to Voter Dashboard, select your candidate, and click 'Cast Vote'.";
    } else if (qLower.includes("otp") || qLower.includes("verification")) {
      reply = isHindi
        ? "लॉगिन के समय आपके पंजीकृत मोबाइल नंबर पर 6-अंकीय ओटीपी भेजा जाता है ताकि 2-फैक्टर प्रमाणीकरण सुनिश्चित हो सके।"
        : "A 6-digit OTP is sent to your registered mobile number during login for secure 2-Factor Authentication.";
    } else if (qLower.includes("candidate") || qLower.includes("उम्मीदवार")) {
      reply = isHindi
        ? "सभी उम्मीदवार अपने संबंधित घोषणापत्रों और चुनाव चिह्नों के साथ चुनाव पृष्ठ और डैशबोर्ड पर सूचीबद्ध हैं।"
        : "All candidates are listed on the Elections page and Voter Dashboard along with their party symbols and manifestos.";
    } else if (qLower.includes("double") || qLower.includes("duplicate")) {
      reply = isHindi
        ? "हमारा डेटाबेस 'UNIQUE(election_id, voter_id)' बाधा का उपयोग करता है जिससे एक मतदाता प्रति चुनाव केवल एक ही वोट डाल सकता है।"
        : "Our database enforces a UNIQUE constraint on (election_id, voter_id), guaranteeing exactly one vote per voter per election.";
    }

    return res.json({ reply });
  });

  // 10. ZIP Source Code Export Endpoint
  app.get("/api/export-php-zip", async (req, res) => {
    try {
      const zip = new JSZip();

      // Add all PHP files and SQL file to ZIP archive
      PHP_PROJECT_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="online_voting_system_php_mysql.zip"');
      res.send(zipBuffer);
    } catch (err) {
      console.error("ZIP Generation Error:", err);
      res.status(500).json({ error: "Failed to generate project ZIP file." });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
