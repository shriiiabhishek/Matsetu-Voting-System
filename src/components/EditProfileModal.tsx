import React, { useState, useRef } from 'react';
import { User } from '../types';
import { 
  X, 
  Upload, 
  Camera, 
  Check, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

interface EditProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onSaveProfile: (updatedData: Partial<User>) => Promise<void>;
}

// Preset avatars for rapid testing if user doesn't have local image file
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onClose,
  onSaveProfile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [mobile, setMobile] = useState(currentUser.mobile || '');
  const [dob, setDob] = useState(currentUser.dob || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser.profilePhoto || PRESET_AVATARS[0]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle local file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfilePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Full name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        dob,
        profilePhoto
      });

      setSuccessMessage('Profile and credentials updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600/30 p-2 rounded-xl border border-blue-400/30 text-blue-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Voter Profile & Credentials</h2>
              <p className="text-xs text-slate-300">Update your email, photo & registered voter information</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Notifications */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Profile Photo Upload Section */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Profile Picture / Voter Photo</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview */}
              <div className="relative group">
                <img
                  src={profilePhoto}
                  alt={fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity"
                >
                  <Upload className="w-4 h-4 mb-0.5" />
                  Change
                </button>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center sm:justify-start gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload New Photo from Device</span>
                </button>
                <p className="text-[10px] text-slate-500">
                  Supported formats: JPG, PNG, WebP (Max 5MB). Photo will be printed on your digital Voter ID card.
                </p>
              </div>
            </div>

            {/* Quick Avatar Selector */}
            <div className="pt-2 border-t border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 mb-1.5">Or Choose Instant Avatar:</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfilePhoto(url)}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      profilePhoto === url ? 'border-blue-600 ring-2 ring-blue-400 scale-105' : 'border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editable Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Email Address (Requested field) */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email Address (Notifications & Verification)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">
                Ballot confirmation receipts and OTP verification will be sent to this email.
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Mobile Number (+91)</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Date of Birth</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* EPIC Voter ID (Read-only security badge) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>EPIC Voter ID (Govt. Assigned)</span>
              </label>
              <input
                type="text"
                value={currentUser.voterId}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 font-mono font-bold cursor-not-allowed"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving to Firestore...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
