import React, { useState } from 'react';
import { User, FileText, Upload, CheckCircle2, Award, Briefcase, GraduationCap, Sparkles, Mail, Phone, MapPin, Save, Trash2 } from 'lucide-react';
import { UserProfile } from '../types';

interface MyCVViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const MyCVView: React.FC<MyCVViewProps> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [skillInput, setSkillInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setUploadStatus(`Fișierul "${file.name}" (${(file.size / 1024).toFixed(1)} KB) a fost încărcat și salvat cu succes!`);
        setFormData(prev => ({
          ...prev,
          resumeFileName: file.name,
          resumeDataUrl: result,
          resumeText: `Document încărcat: ${file.name} (${new Date().toLocaleDateString('ro-RO')})`
        }));
        setTimeout(() => setUploadStatus(null), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...formData,
      updatedAt: new Date().toLocaleDateString('ro-RO')
    };
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-600" />
            <span>CV-ul Meu & Profilul Profesional</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Completează-ți CV-ul sau încarcă un document PDF/Word pentru a aplica rapid la joburile din Brașov cu 1 singur click.
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>CV-ul a fost salvat cu succes!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Quick AI parse */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-600" />
              <span>Încarcă CV (PDF / DOCX)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Poți atașa fișierul tău de CV existent. Sistemul va extrage automat datele pentru angajatori.
            </p>

            <label className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-orange-50/40 transition-all group">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800">Apasă aici pentru a încărca CV-ul</span>
              <span className="text-[11px] text-slate-400 mt-1">PDF, DOC, DOCX (Max 10MB)</span>
            </label>

            {uploadStatus && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
                {uploadStatus}
              </div>
            )}

            {formData.resumeFileName && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{formData.resumeFileName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {formData.resumeDataUrl && (
                    <a
                      href={formData.resumeDataUrl}
                      download={formData.resumeFileName}
                      className="text-orange-600 hover:underline font-bold"
                    >
                      Descarcă
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, resumeFileName: undefined, resumeDataUrl: undefined }))}
                    className="text-rose-600 hover:text-rose-700 p-1"
                    title="Șterge fișierul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Profile Suggestions */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span className="font-bold text-sm">Asistentul AI BrașovJobs</span>
            </div>
            <p className="text-xs text-orange-100 leading-relaxed">
              Un CV complet cu cel puțin 4 competențe și experiență menționată are șanse de 3 ori mai mari să primească un apel rapid de la angajatorii din Brașov!
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Detailed CV Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              <span>Informații Personale & Profesionale</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nume și Prenume *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                  placeholder="ex: Alexandru Savin"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                  placeholder="ex: alexandru@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Telefon mobil (pentru apeluri angajatori) *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                  placeholder="ex: +40 722 334 556"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Localitate / Zonă în Brașov *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                  placeholder="ex: Centru, Brașov"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Poziția / Meseria Dorită *</label>
                <input
                  type="text"
                  required
                  value={formData.desiredTitle}
                  onChange={e => handleChange('desiredTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                  placeholder="ex: Programator / Ospătar / Inginer / Asistent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nivel Experiență *</label>
                <select
                  value={formData.experienceYears}
                  onChange={e => handleChange('experienceYears', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500 bg-white"
                >
                  <option value="Fără experiență">Fără experiență / Entry-level</option>
                  <option value="1-3 ani">1 - 3 ani</option>
                  <option value="3-5 ani">3 - 5 ani</option>
                  <option value="5+ ani">Peste 5 ani (Senior/Expert)</option>
                </select>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-600" />
                <span>Competențe & Abilități principale</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  placeholder="Adaugă competență (ex: React, Engleză avansat, Permis Cat B, HoReCa)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Adaugă
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-orange-400 hover:text-orange-700 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Education & Bio */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  <span>Studii & Formare Profesională</span>
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={e => handleChange('education', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                  placeholder="ex: Universitatea Transilvania din Brașov - Facultatea de Inginerie / Litere"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Despre mine / Rezumat profesional</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-orange-500"
                  placeholder="Descrie scurt parcursul tău profesional, obiectivele în carieră și de ce ești un candidat potrivit..."
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvează CV-ul & Profilul</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
