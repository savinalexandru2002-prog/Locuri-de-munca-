import React, { useState, useEffect } from 'react';
import { X, FileText, Send, CheckCircle2, Upload, Sparkles } from 'lucide-react';
import { Job, Application, UserProfile } from '../types';

interface ApplyModalProps {
  job: Job | null;
  onClose: () => void;
  onSubmitApplication: (appData: Omit<Application, 'id' | 'appliedAt' | 'status'>) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  onClose,
  onSubmitApplication,
}) => {
  if (!job) return null;

  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiLetter = async () => {
    setIsGeneratingAi(true);
    try {
      let savedSkills = '';
      const saved = localStorage.getItem('brasov_user_profile');
      if (saved) {
        const p: UserProfile = JSON.parse(saved);
        savedSkills = p.skills?.join(', ') || p.bio || '';
      }
      const res = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          applicantName,
          skills: savedSkills,
        }),
      });
      const data = await res.json();
      if (data.success && data.letter) {
        setMessage(data.letter);
      }
    } catch (err) {
      console.error('Failed to generate AI letter', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('brasov_user_profile');
      if (saved) {
        const profile: UserProfile = JSON.parse(saved);
        if (profile.fullName) {
          setHasSavedProfile(true);
          setApplicantName(profile.fullName);
          setPhone(profile.phone);
          setEmail(profile.email);
          if (profile.resumeFileName) {
            setCvFileName(profile.resumeFileName);
          }
          if (profile.bio) {
            setMessage(`Bună ziua! Am văzut anunțul pentru "${job.title}" la ${job.company} și sunt foarte interesat(ă). ${profile.bio}`);
          }
        }
      }
    } catch {}
  }, [job]);

  const handleUseSavedProfile = () => {
    try {
      const saved = localStorage.getItem('brasov_user_profile');
      if (saved) {
        const profile: UserProfile = JSON.parse(saved);
        setApplicantName(profile.fullName || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
        if (profile.resumeFileName) setCvFileName(profile.resumeFileName);
        if (profile.bio) setMessage(`Bună ziua! Sunt interesat(ă) de poziția de ${job.title}. ${profile.bio}`);
      }
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone || !email) {
      alert('Vă rugăm să completați toate câmpurile obligatorii.');
      return;
    }

    onSubmitApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantName,
      phone,
      email,
      message,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFileName(e.target.files[0].name);
    }
  };



  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-lg">Aplicare Rapidă la Job</h2>
          </div>
          <p className="text-xs text-slate-300">
            {job.title} • <span className="text-orange-400 font-medium">{job.company}</span>
          </p>
        </div>

        {success ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Aplicație trimisă!</h3>
            <p className="text-sm text-slate-600">
              Candidatura ta a fost înregistrată cu succes. Angajatorul din Brașov va fi notificat imediat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {hasSavedProfile && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="text-xs font-bold text-orange-900">CV-ul tău salvat a fost precompletat!</span>
                </div>
                <button
                  type="button"
                  onClick={handleUseSavedProfile}
                  className="text-xs font-bold text-orange-700 hover:underline"
                >
                  Reîncarcă date
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nume complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Maria Popescu"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: 0722 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                required
                placeholder="nume@exemplu.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Atașează CV (PDF / DOCX)
              </label>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-xl cursor-pointer bg-slate-50 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">
                  {cvFileName ? cvFileName : 'Click pentru a încărca CV-ul'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Maxim 5MB (PDF, DOC)</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Scrisoare de intenție / Scurtă prezentare
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAiLetter}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                  title="Generează automat o scrisoare de intenție folosind Gemini AI"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAi ? 'Se generează cu AI...' : 'Generează cu AI'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Menționează experiența ta relevantă pentru acest post din Brașov sau apasă pe 'Generează cu AI'..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Anulează
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Trimite Candidatura</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
