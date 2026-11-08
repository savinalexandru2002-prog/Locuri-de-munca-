import React from 'react';
import { X, MapPin, Phone, MessageSquare, Building2, Briefcase, CheckCircle2, Award, Calendar, Share2, Bookmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { Job } from '../types';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (job: Job) => void;
  onOpenCall: (job: Job) => void;
  onOpenMessage: (job: Job) => void;
  onOpenApply: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  isSaved,
  onToggleSave,
  onOpenCall,
  onOpenMessage,
  onOpenApply,
}) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header bar */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-orange-500 text-white">
              {job.category}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200">
              {job.jobType}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200">
              {job.experience}
            </span>
            {job.autoPublished && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Auto-Publicat {job.autoPublishedAt ? `(${job.autoPublishedAt})` : ''}
              </span>
            )}
            {job.sourcePlatform && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/15 text-slate-200">
                Sursă: {job.sourcePlatform}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-1">
            {job.title}
          </h2>
          <p className="text-orange-400 font-semibold text-base mb-4">
            {job.company}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Publicat: {job.postedDate}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Salary & Direct Contact Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">Pachet Salarial</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">Net lunar negociabil în interviu</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Angajator ({job.contactPerson})</span>
              <div className="flex items-center gap-2 mt-1">
                <a
                  href={`tel:${job.phone}`}
                  onClick={() => onOpenCall(job)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{job.phone}</span>
                </a>
                <button
                  onClick={() => onOpenMessage(job)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-orange-400" />
                  <span>Trimite Mesaj</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Descrierea Jobului</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">Cerințe & Calificări</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">Beneficii Oferite</h3>
            <ul className="space-y-2">
              {job.benefits.map((ben, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onToggleSave(job)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              isSaved
                ? 'bg-orange-100 text-orange-700'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-600' : ''}`} />
            <span>{isSaved ? 'Salvat în favorite' : 'Salvează Job'}</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${job.phone}`}
              onClick={() => onOpenCall(job)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Sună Direct</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onOpenApply(job);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all"
            >
              <span>Aplică Rapid cu CV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
