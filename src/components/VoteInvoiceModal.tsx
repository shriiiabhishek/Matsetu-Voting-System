import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Copy, 
  Check, 
  FileText, 
  Sparkles,
  QrCode,
  Flame
} from 'lucide-react';
import { User, Election, Candidate, Vote } from '../types';
import { formatExactDateTime } from '../utils/dateTime';

export interface VoteInvoiceData {
  voteId?: string;
  receiptToken: string;
  timestamp: string;
  voter: User;
  election: Election;
  candidate: Candidate;
  ipHash?: string;
}

interface VoteInvoiceModalProps {
  invoiceData: VoteInvoiceData;
  onClose: () => void;
}

export const VoteInvoiceModal: React.FC<VoteInvoiceModalProps> = ({ invoiceData, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [copied, setCopied] = useState(false);

  const { voter, election, candidate, receiptToken, timestamp } = invoiceData;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(receiptToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);

    try {
      // Capture element with html2canvas
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210;
      const pageHeight = 297;
      const imgWidth = pdfWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      
      pdf.save(`ECI-Matsetu-Voting-Invoice-${receiptToken.substring(0, 12)}.pdf`);
    } catch (err) {
      console.error('Error generating PDF invoice:', err);
      // Fallback print
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Header (Excluded from PDF download) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                Official ECI Voting Slip & Tax-Compliant Ballot Invoice
              </h3>
              <p className="text-[10px] text-slate-400">भारत निर्वाचन आयोग • Election Commission of India</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all hidden sm:flex"
              title="Print slip"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPDF ? 'Creating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & PDF Capture Container */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh] bg-slate-100 flex justify-center">
          <div 
            ref={printRef}
            id="voting-invoice-printable"
            className="bg-white w-full max-w-xl p-6 sm:p-8 rounded-2xl border-2 border-slate-300 shadow-sm text-slate-900 relative font-sans space-y-5"
            style={{ minHeight: '620px' }}
          >
            {/* Indian National Tricolor Border Top */}
            <div className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl flex overflow-hidden">
              <div className="flex-1 bg-[#FF9933]"></div>
              <div className="flex-1 bg-[#FFFFFF] border-y border-slate-200"></div>
              <div className="flex-1 bg-[#138808]"></div>
            </div>

            {/* Header: Complete Voting Logo of India & ECI Title */}
            <div className="pt-2 text-center border-b-2 border-slate-800 pb-4 relative">
              <div className="flex items-center justify-between">
                
                {/* Left: Indian Voting Logo with Inked Finger */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white border-2 border-blue-400 shadow-md">
                    <svg viewBox="0 0 100 100" className="w-9 h-9 fill-current text-white">
                      {/* Voting Box EVM with Inked Finger Graphic */}
                      <rect x="15" y="45" width="70" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
                      <rect x="25" y="55" width="22" height="10" rx="3" fill="#3b82f6" />
                      <circle cx="70" cy="60" r="5" fill="#22c55e" />
                      <rect x="25" y="72" width="50" height="6" rx="2" fill="#64748b" />
                      {/* Inked Finger pointing down */}
                      <path d="M 45 10 C 42 10 38 14 38 20 L 38 48 C 38 52 42 55 46 55 C 50 55 54 52 54 48 L 54 20 C 54 14 50 10 45 10 Z" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
                      {/* Purple Indelible Inking Mark on Finger */}
                      <rect x="43" y="10" width="4" height="20" fill="#4338ca" rx="1" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-black tracking-wider text-slate-800 block uppercase">भारत निर्वाचन आयोग</span>
                    <span className="text-[8px] font-bold text-slate-500 block uppercase">Election Commission of India</span>
                  </div>
                </div>

                {/* Center / Right: National Ashok Chakra Emblem Motif */}
                <div className="text-center hidden sm:block">
                  <div className="w-10 h-10 mx-auto rounded-full border-2 border-blue-800 flex items-center justify-center p-0.5 text-blue-900">
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-900 fill-none stroke-[2]">
                      <circle cx="50" cy="50" r="46" />
                      <circle cx="50" cy="50" r="10" fill="#1e3a8a" />
                      {/* 24 spokes */}
                      {Array.from({ length: 24 }).map((_, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1="50"
                          x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                          y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                        />
                      ))}
                    </svg>
                  </div>
                  <span className="text-[8px] font-bold text-slate-600 mt-0.5 block tracking-widest">सत्यमेव जयते</span>
                </div>

                {/* Right: Slip Serial & Security Badge */}
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 uppercase tracking-tight">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> OFFICIAL VVPAT SLIP
                  </span>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">Form No. 17-C (E-Ballot)</p>
                </div>
              </div>

              <div className="mt-3">
                <h1 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                  National E-Voting Invoice & Acknowledgement Slip
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">
                  Official Electronic Voting Machine (EVM) Cryptographic Certificate of Vote Cast
                </p>
              </div>
            </div>

            {/* Voter Identification Record */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-extrabold text-[11px] text-slate-800 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" /> Section 1: Elector Identification
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  STATUS: VERIFIED ELECTOR
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Voter Full Name</span>
                  <span className="font-bold text-slate-900">{voter.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">EPIC / Voter ID No.</span>
                  <span className="font-mono font-extrabold text-blue-800">{voter.voterId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Mobile Registered</span>
                  <span className="font-medium text-slate-800">+91 {voter.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Registered DOB</span>
                  <span className="font-medium text-slate-800">{voter.dob}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Email Address</span>
                  <span className="font-medium text-slate-800 truncate block">{voter.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Polling Terminal</span>
                  <span className="font-mono font-bold text-slate-700">MATSETU-SECURE-V4</span>
                </div>
              </div>
            </div>

            {/* Ballot & Cast Vote Particulars (The Invoice Breakdown) */}
            <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between font-bold text-[11px]">
                <span>Section 2: Ballot Choice & Election Record</span>
                <span className="font-mono text-[10px] text-amber-300 font-normal">Single Non-Transferable Vote</span>
              </div>

              <table className="w-full text-left text-[11px]">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-2.5 text-slate-500 font-bold w-1/3 bg-slate-50">Election Title</td>
                    <td className="p-2.5 font-extrabold text-slate-900">{election.title}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 text-slate-500 font-bold bg-slate-50">State / Category</td>
                    <td className="p-2.5 text-slate-800">
                      <span className="font-semibold">{election.state || 'National Electoral Zone'}</span> ({election.category.toUpperCase()})
                    </td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="p-2.5 text-blue-900 font-bold bg-blue-100/60">Candidate Voted For</td>
                    <td className="p-2.5 font-black text-blue-900 text-xs sm:text-sm">
                      {candidate.name}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 text-slate-500 font-bold bg-slate-50">Political Party</td>
                    <td className="p-2.5 font-bold text-slate-800">{candidate.partyName}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 text-slate-500 font-bold bg-slate-50">Allotted Party Symbol</td>
                    <td className="p-2.5 font-mono font-extrabold text-slate-900">
                      🗳️ {candidate.partySymbol}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 text-slate-500 font-bold bg-slate-50">Timestamp of Vote</td>
                    <td className="p-2.5 font-mono text-slate-800 font-bold">{formatExactDateTime(timestamp)}</td>
                  </tr>
                  <tr className="bg-emerald-50/60">
                    <td className="p-2.5 text-emerald-900 font-bold bg-emerald-100/70">Receipt Hash Token</td>
                    <td className="p-2.5 font-mono font-black text-emerald-800 text-[11px] break-all">
                      {receiptToken}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Signatures, QR Code & Security Stamp Section */}
            <div className="pt-2 border-t-2 border-dashed border-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                
                {/* Security QR Code and Hash */}
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg text-white shrink-0 flex items-center justify-center shadow-inner">
                    <QrCode className="w-full h-full text-white" />
                  </div>
                  <div className="text-[9px] text-slate-500 space-y-0.5">
                    <span className="font-bold text-slate-700 block">SHA-256 Verified</span>
                    <span className="font-mono text-[8px] text-slate-400 block break-all">ECI-HASH-OK</span>
                    <span className="text-[8px] text-emerald-600 font-bold block">Digital Ledger Stored</span>
                  </div>
                </div>

                {/* Official ECI Seal / Stamp */}
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-blue-700 p-1 text-blue-800 flex flex-col items-center justify-center text-center rotate-[-6deg] bg-blue-50/40 shadow-sm">
                    <span className="text-[7px] font-black uppercase tracking-tighter text-blue-900">निर्वाचन आयोग</span>
                    <span className="text-[9px] font-black text-blue-950 uppercase">ECI SEAL</span>
                    <span className="text-[6px] font-bold text-blue-700">AUTHENTICATED</span>
                    <span className="text-[6px] font-mono text-emerald-800 font-black">✓ RECORDED</span>
                  </div>
                </div>

                {/* Returning Officer Official Signature on Paper */}
                <div className="text-right space-y-1">
                  <div className="h-10 flex items-end justify-end pr-2">
                    {/* Realistic Cursive Calligraphic Signature Style */}
                    <span 
                      className="font-serif italic font-extrabold text-lg text-slate-800 tracking-tight"
                      style={{ fontFamily: 'Georgia, serif', transform: 'rotate(-3deg)' }}
                    >
                      A. K. Sharma
                    </span>
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <p className="text-[10px] font-extrabold text-slate-900 uppercase">Authorized Returning Officer</p>
                    <p className="text-[8px] text-slate-500">Election Commission of India • Digital Signatory</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Statutory Legal Disclaimer Footer */}
            <div className="border-t border-slate-200 pt-2 text-center text-[8px] text-slate-400 leading-tight">
              <p>
                This electronic receipt is issued pursuant to the Conduct of Elections Rules, 1961. 
                The ballot has been cryptographically signed and irreversibly committed to the tamper-proof ledger.
              </p>
              <p className="font-mono text-slate-500 mt-0.5">
                Voter Helpline: 1950 | Portal: https://matsetu.eci.gov.in | Session ID: {receiptToken.substring(0, 16)}
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Fast Action Bar */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Receipt Token:</span>
            <code className="bg-slate-200 text-slate-800 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
              {receiptToken}
            </code>
            <button
              onClick={handleCopyToken}
              className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
              title="Copy receipt token"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPDF ? 'Generating High-Res PDF...' : 'Download Official PDF Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
