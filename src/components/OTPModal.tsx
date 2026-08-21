import React, { useState, useEffect } from 'react';
import { Key, Shield, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface OTPModalProps {
  userId: string;
  mobile: string;
  sampleOTP: string;
  onVerifySuccess: (user: any) => void;
  onClose: () => void;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  userId,
  mobile,
  sampleOTP,
  onVerifySuccess,
  onClose
}) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed.');
      }

      onVerifySuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-4">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-2">
            <Key className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">2-Factor OTP Verification</h3>
          <p className="text-xs text-slate-500 mt-1">
            Sent to mobile ending in <span className="font-semibold text-slate-800">****{mobile.slice(-4)}</span>
          </p>
        </div>

        {/* Demo OTP Banner for ease of testing */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 text-xs text-amber-900 flex items-center justify-between">
          <div>
            <p className="font-bold">📱 SMS Simulation Code:</p>
            <p className="font-mono text-sm tracking-widest text-amber-900 font-extrabold">{sampleOTP}</p>
          </div>
          <button
            type="button"
            onClick={() => setOtp(sampleOTP)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
          >
            Auto-Fill OTP
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
              Enter 6-Digit One-Time Password
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center text-xl font-mono tracking-[0.5em] font-extrabold py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Expires in: <strong className="text-slate-800">{formatTime(timeLeft)}</strong>
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || timeLeft === 0}
              className="w-1/2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
