import React, { useState } from 'react';
import { X, PlusCircle, Building2, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Job, JobCategory, JobType, ExperienceLevel } from '../types';

interface PostJobModalProps {
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

const CATEGORIES: JobCategory[] = [
  'IT & Software',
  'HoReCa & Turism',
  'Inginerie & Auto',
  'Vânzări & Retail',
  'Medical & Pharma',
  'Construcții & Imobiliare',
  'Logistică & Transport',
  'Financiar & Contabilitate',
  'Altele'
];

const JOB_TYPES: JobType[] = ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'Internship'];
const EXPERIENCES: ExperienceLevel[] = ['Fără experiență', 'Junior', 'Mid', 'Senior', 'Expert'];

const BRAȘOV_DISTRICTS = [
  'Centru',
  'Centrul Vechi',
  'Centrul Civic',
  'Tractorul',
  'Astra',
  'Noua',
  'Răcădău',
  'Bartolomeu',
  'Poiana Brașov',
  'Stupini',
  'Hărmanului',
  'Zona Industrială'
];

export const PostJobModal: React.FC<PostJobModalProps> = ({ onClose, onJobCreated }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<JobCategory>('IT & Software');
  const [district, setDistrict] = useState('Centru');
  const [salaryMin, setSalaryMin] = useState(4500);
  const [salaryMax, setSalaryMax] = useState(8000);
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [experience, setExperience] = useState<ExperienceLevel>('Junior');
  const [phone, setPhone] = useState('+40 ');
  const [contactPerson, setContactPerson] = useState('');
  const [contactTitle, setContactTitle] = useState('Recruiter HR');
  const [description, setDescription] = useState('');
  const [requirementsStr, setRequirementsStr] = useState('');
  const [benefitsStr, setBenefitsStr] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !phone || !description) {
      alert('Vă rugăm să completați câmpurile obligatorii.');
      return;
    }

    const requirements = requirementsStr ? requirementsStr.split('\n').filter(Boolean) : ['Seriozitate și implicare'];
    const benefits = benefitsStr ? benefitsStr.split('\n').filter(Boolean) : ['Pachet salarial atractiv'];

    const jobPayload = {
      title,
      company,
      category,
      location: `${district}, Brașov`,
      district,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      currency: 'RON',
      jobType,
      experience,
      phone,
      contactPerson: contactPerson || 'Echipa HR',
      contactTitle,
      description,
      requirements,
      benefits,
      urgent,
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload),
      });
      const data = await res.json();
      if (data.success) {
        onJobCreated(data.data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert('Eroare la crearea jobului.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <PlusCircle className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-lg">Adaugă și Auto-Publică un Job în Brașov</h2>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-Publicare Live
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Anunțul tău se auto-publică instantaneu pe portal, fără timp de așteptare pentru moderare.
          </p>
        </div>

        {success ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Job auto-publicat cu succes!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Anunțul tău este acum 100% activ și auto-publicat în rețeaua BrașovJobs. Candidații te pot contacta direct prin apel sau mesaj.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Titlu Poziție / Job *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Contabil Senior"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nume Companie *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: SC Expert SRL Brașov"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Domeniu
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JobCategory)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-orange-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Cartier / Zonă
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-orange-500"
                >
                  {BRAȘOV_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Tip Job
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-orange-500"
                >
                  {JOB_TYPES.map(jt => <option key={jt} value={jt}>{jt}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Salariu Min (RON)
                </label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Salariu Max (RON)
                </label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Experiență
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-orange-500"
                >
                  {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Număr de Telefon Direct *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+40 7..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500 font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Persoană Contact
                </label>
                <input
                  type="text"
                  placeholder="ex: Ana Maria"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Funcție Contact
                </label>
                <input
                  type="text"
                  placeholder="ex: HR Manager"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Descriere Detaliată *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Descrie responsabilitățile postului, cerințele și beneficiile..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Cerințe (câte una pe rând)
                </label>
                <textarea
                  rows={3}
                  placeholder="- Experiență 2 ani&#10;- Studii superioare"
                  value={requirementsStr}
                  onChange={(e) => setRequirementsStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Beneficii (câte una pe rând)
                </label>
                <textarea
                  rows={3}
                  placeholder="- Tichete de masă&#10;- Asigurare medicală"
                  value={benefitsStr}
                  onChange={(e) => setBenefitsStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="urgentCheck"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <label htmlFor="urgentCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Marchează ca Anunț Urgent 🔥
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
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
                <PlusCircle className="w-4 h-4" />
                <span>Publică Jobul</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
