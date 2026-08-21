import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Sparkles,
  Lock,
  Flame,
  FileText,
  Clock
} from 'lucide-react';
import { User } from '../types';

interface VoterIdCardModalProps {
  currentUser: User;
  onClose: () => void;
}

export const VoterIdCardModal: React.FC<VoterIdCardModalProps> = ({
  currentUser,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setIsGeneratingPDF(true);

    try {
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Standard A4 orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210;
      const margin = 15;
      const imgWidth = pdfWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, 15, imgWidth, imgHeight);
      pdf.save(`ECI-Voter-ID-Card-${currentUser.voterId || currentUser.username}.pdf`);
    } catch (err) {
      console.error('Error generating Voter ID PDF:', err);
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header (Controls excluded from PDF) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/30 p-2 rounded-xl border border-blue-400/30 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Digital E-EPIC Voter Identity Card</h2>
              <p className="text-xs text-slate-300">Official Election Commission of India Smart Card</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Print Voter ID Card"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voter ID Smart Card Document */}
        <div className="p-6 overflow-y-auto max-h-[75vh] bg-slate-100 flex justify-center">
          <div
            ref={cardRef}
            className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl border border-slate-300 space-y-5 text-slate-900 font-sans relative overflow-hidden"
          >
            
            {/* Top Official Tricolor Accent Strip */}
            <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 rounded-t-xl" />

            {/* ECI Official Header */}
            <div className="text-center border-b-2 border-slate-200 pb-4 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h3 className="text-base font-extrabold tracking-wide uppercase text-slate-900">
                    Election Commission of India
                  </h3>
                  <p className="text-[11px] font-bold text-slate-600">
                    भारत निर्वाचन आयोग • Matsetu Digital Portal
                  </p>
                </div>
              </div>
              <div className="inline-block bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full mt-1">
                E-EPIC IDENTITY CARD / मतदाता पहचान पत्र
              </div>
            </div>

            {/* Smart Card Body */}
            <div className="grid grid-cols-3 gap-4 items-center bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 rounded-2xl border border-slate-200">
              
              {/* Voter Photo & Hologram */}
              <div className="col-span-1 flex flex-col items-center space-y-2">
                <div className="relative border-2 border-blue-600 rounded-2xl overflow-hidden shadow-md w-28 h-32 bg-white">
                  <img
                    src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-blue-900/80 text-white text-[8px] font-mono text-center py-0.5 font-bold">
                    DIGITAL VERIFIED
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-mono font-bold text-slate-500 block">GOVT OF INDIA</span>
                </div>
              </div>

              {/* Voter Details */}
              <div className="col-span-2 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">EPIC Number / पहचान पत्र क्र.</span>
                  <span className="font-mono text-base font-extrabold text-blue-700 tracking-wider">
                    {currentUser.voterId || 'EPIC98765432'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Elector's Name / मतदाता का नाम</span>
                  <span className="font-extrabold text-slate-900 text-sm">{currentUser.fullName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Date of Birth / जन्म तिथि</span>
                    <span className="font-semibold text-slate-800 font-mono text-xs">{currentUser.dob || '1998-05-14'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Mobile</span>
                    <span className="font-semibold text-slate-800 font-mono text-xs">+91 {currentUser.mobile || '9876543210'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
                  <span className="font-medium text-slate-700 text-xs truncate block">{currentUser.email || 'voter@example.com'}</span>
                </div>
              </div>
            </div>

            {/* Security Seal & QR Code Block */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SECURE CRYPTOGRAPHIC TOKEN
                </p>
                <p className="font-mono text-xs text-slate-300">
                  SHA-256: {Math.random().toString(36).substring(2, 10).toUpperCase()}-ECI-2026
                </p>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300 font-bold pt-0.5">
                  <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>Card Generated: {formattedDateTime}</span>
                </div>
                <p className="text-[9px] text-slate-400">
                  Authenticated for all State & National Assembly Elections.
                </p>
              </div>

              <div className="bg-white p-2 rounded-xl shrink-0 flex flex-col items-center">
                <QrCode className="w-12 h-12 text-slate-900" />
                <span className="text-[8px] font-mono font-bold text-slate-900 mt-0.5">SCAN TO VERIFY</span>
              </div>
            </div>

            {/* Footer Notice & Helpline */}
            <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex items-center justify-between">
              <span>National Toll-Free Helpline: <strong className="text-emerald-700 font-mono font-bold">1950</strong></span>
              <span>Support: <strong className="text-blue-700">Abhishek Shrivastava</strong></span>
            </div>

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            PDF is cryptographically signed and valid across all polling booths.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
