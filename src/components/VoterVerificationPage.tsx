import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Search, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const VoterVerificationPage: React.FC = () => {
  const [voterIdInput, setVoterIdInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!voterIdInput) {
      setError('Please enter a Voter ID (EPIC Number).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-voter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterId: voterIdInput.trim(),
          mobile: mobileInput.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification lookup failed.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error executing voter verification check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Voter Verification Portal</h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time verification status check for official EPIC Voter ID credentials.
          </p>
        </div>

        <form onSubmit={handleVerify} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Voter ID Number (EPIC Number) *</label>
              <input
                type="text"
                required
                value={voterIdInput}
                onChange={e => setVoterIdInput(e.target.value)}
                placeholder="e.g. EPIC98765432"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number (Optional)</label>
              <input
                type="tel"
                value={mobileInput}
                onChange={e => setMobileInput(e.target.value)}
                placeholder="10-digit number"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Performing Database Verification Check...' : 'Verify Voter Registry Status'}
          </button>
        </form>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <div>
              <p className="font-bold">Verification Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Official Verification Match Confirmed</h3>
                <p className="text-xs text-emerald-800">Voter credentials are active and verified in electoral records.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Full Name</p>
                <p className="font-bold text-slate-900">{result.user.fullName}</p>
              </div>
              <div>
                <p className="text-slate-500">Voter ID (EPIC)</p>
                <p className="font-bold font-mono text-slate-900">{result.user.voterId}</p>
              </div>
              <div>
                <p className="text-slate-500">Registered Mobile</p>
                <p className="font-bold text-slate-900">+91 {result.user.mobile.substring(0, 3)}****{result.user.mobile.slice(-2)}</p>
              </div>
              <div>
                <p className="text-slate-500">Account Verification Status</p>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {result.user.isVerified ? 'Verified Active Voter' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
