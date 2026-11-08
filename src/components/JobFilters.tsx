import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { FilterState, JobCategory, JobType, ExperienceLevel } from '../types';

interface JobFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
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

export const JobFiltersModal: React.FC<JobFiltersModalProps> = ({
  isOpen,
  onClose,
  filterState,
  setFilterState,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-orange-600" />
            <h2 className="font-bold text-lg text-slate-900">Filtre Avansate Brașov</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Sortează Anunțurile
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'recent', label: 'Cele mai noi' },
                { id: 'salary_high', label: 'Salariu: Mare - Mic' },
                { id: 'salary_low', label: 'Salariu: Mic - Mare' },
                { id: 'views', label: 'Cele mai vizualizate' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFilterState(prev => ({ ...prev, sortBy: s.id as any }))}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                    filterState.sortBy === s.id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Domeniu / Industrie
            </label>
            <select
              value={filterState.category}
              onChange={(e) => setFilterState(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500"
            >
              <option value="">Toate domeniile</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Tip Program & Locație
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterState(prev => ({ ...prev, jobType: '' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !filterState.jobType
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Oricare
              </button>
              {JOB_TYPES.map(jt => (
                <button
                  key={jt}
                  onClick={() => setFilterState(prev => ({ ...prev, jobType: jt }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterState.jobType === jt
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {jt}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Nivel Experiență
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterState(prev => ({ ...prev, experience: '' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !filterState.experience
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Oricare
              </button>
              {EXPERIENCES.map(exp => (
                <button
                  key={exp}
                  onClick={() => setFilterState(prev => ({ ...prev, experience: exp }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterState.experience === exp
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Salary Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Salariu Net Minim (RON)
              </label>
              <span className="text-sm font-bold text-orange-600">
                {filterState.minSalary} RON / lună
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15000"
              step="500"
              value={filterState.minSalary}
              onChange={(e) => setFilterState(prev => ({ ...prev, minSalary: Number(e.target.value) }))}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0 RON</span>
              <span>7.500 RON</span>
              <span>15.000+ RON</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetează Filtrele</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-600/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Aplică Filtrele</span>
          </button>
        </div>
      </div>
    </div>
  );
};
