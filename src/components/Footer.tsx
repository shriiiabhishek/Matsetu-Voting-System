import React from 'react';
import { Vote, Phone, Mail, User, Code, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { LiveClock } from './LiveClock';

interface FooterProps {
  onOpenPHPModal?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Platform Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
              <Vote className="w-6 h-6 text-blue-500" />
              <span>Matsetu (मतसेतु) E-Voting Portal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern state-wise & national digital e-voting platform providing transparent, instant ballot casting & live vote count auditing.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> System Active & Verified
              </span>
              <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 font-mono">
                🔥 Firestore Synced: tourismsarthi-5aa78
              </span>
            </div>
          </div>

          {/* Dedicated Support System & Helpline */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2.5 shadow-md">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" /> Support System & Helpline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-300 font-semibold">Lead Developer & Support Officer:</span>
                <span className="text-white font-bold">Abhishek Shrivastava</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-semibold">Helpline / WhatsApp:</span>
                <a href="tel:+919399409579" className="text-emerald-400 font-bold hover:underline font-mono">
                  +91 9399409579
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-semibold">Support Email:</span>
                <a href="mailto:shrivastavaabhishek6677@gmail.com" className="text-amber-300 font-medium hover:underline text-[11px] truncate">
                  shrivastavaabhishek6677@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Live System Status Highlights */}
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">System Operational Overview</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Voter Verification & Single Vote Guard</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>State Elections Coverage: MP, BR, UP, GJ, TN, KA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live Admin Audit Ledger & Real-time Results</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Rights */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-200">
              © 2026 Matsetu (मतसेतु) E-Voting Portal. All Rights Reserved. Designed & Developed by <span className="text-blue-400 font-bold">Abhishek Shrivastava</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px]">
            <LiveClock variant="compact" />
            <span className="flex items-center gap-1 text-slate-300 border-l border-slate-800 pl-3">
              📞 Helpline: <a href="tel:9399409579" className="text-emerald-400 font-mono font-bold hover:underline">9399409579</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

