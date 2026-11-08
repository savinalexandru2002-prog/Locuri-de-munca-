import React from 'react';
import { Search, MapPin, SlidersHorizontal, PhoneCall, MessageSquare, Building2, Sparkles } from 'lucide-react';
import { FilterState, JobCategory } from '../types';

interface HeroSearchProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  totalJobs: number;
  onOpenAdvancedFilters: () => void;
}

const CATEGORIES: { label: JobCategory | 'Toate'; icon: string }[] = [
  { label: 'Toate', icon: '🌟' },
  { label: 'IT & Software', icon: '💻' },
  { label: 'HoReCa & Turism', icon: '🏨' },
  { label: 'Inginerie & Auto', icon: '⚙️' },
  { label: 'Vânzări & Retail', icon: '🛒' },
  { label: 'Medical & Pharma', icon: '🩺' },
  { label: 'Logistică & Transport', icon: '🚚' },
  { label: 'Construcții & Imobiliare', icon: '🏗️' },
];

const BRAȘOV_DISTRICTS = [
  'Toate zonele',
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

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filterState,
  setFilterState,
  totalJobs,
  onOpenAdvancedFilters,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center flex-wrap justify-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>Brașov și Împrejurimi • Contact Direct</span>
          <span className="w-1 h-1 rounded-full bg-orange-400/60 hidden sm:inline-block"></span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Auto-publicare activă continuu • Sincronizat zilnic
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Găsește-ți următorul job în <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Brașov</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          Contactează direct angajatorii prin apel telefonic instant sau mesaje SMS/WhatsApp. Fără intermediari, fără timp pierdut.
        </p>

        {/* Search Bar Container */}
        <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-3 items-center">
          {/* Keyword Input */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl w-full border border-slate-200 focus-within:border-orange-500 transition-all">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Titlu job, companie sau cuvinte cheie..."
              value={filterState.search}
              onChange={(e) => setFilterState(prev => ({ ...prev, search: e.target.value }))}
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
            />
          </div>

          {/* District Select */}
          <div className="w-full md:w-56 flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-orange-500 transition-all">
            <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
            <select
              value={filterState.district}
              onChange={(e) => setFilterState(prev => ({ ...prev, district: e.target.value }))}
              className="w-full bg-transparent text-slate-900 text-sm focus:outline-none cursor-pointer"
            >
              {BRAȘOV_DISTRICTS.map((d) => (
                <option key={d} value={d === 'Toate zonele' ? '' : d} className="text-slate-900">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Button */}
          <button
            onClick={onOpenAdvancedFilters}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <span>Filtre Avansate</span>
          </button>
        </div>

        {/* Quick Category Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.label === 'Toate' ? !filterState.category : filterState.category === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setFilterState(prev => ({ ...prev, category: cat.label === 'Toate' ? '' : cat.label }))}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-2 ring-orange-400/50'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Count Banner */}
        <div className="mt-6 text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-4">
          <span>Sunt disponibile <strong className="text-white">{totalJobs}</strong> anunțuri active în Brașov</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 font-medium">Numere de telefon verificate</span>
        </div>
      </div>
    </div>
  );
};
