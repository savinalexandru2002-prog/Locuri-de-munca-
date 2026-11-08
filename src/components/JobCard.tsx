import React from 'react';
import { MapPin, Phone, MessageSquare, Bookmark, Briefcase, Eye, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (job: Job) => void;
  onOpenDetails: (job: Job) => void;
  onOpenCall: (job: Job) => void;
  onOpenMessage: (job: Job) => void;
  onOpenApply: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onOpenDetails,
  onOpenCall,
  onOpenMessage,
  onOpenApply,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Header info */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                {job.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700">
                {job.jobType}
              </span>
              {job.autoPublished && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Auto-Publicat
                </span>
              )}
              {job.sourcePlatform && (
                <a
                  href={job.externalUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 hover:underline ${
                    job.sourcePlatform === 'eJobs' ? 'bg-red-50 text-red-700 border border-red-200' :
                    job.sourcePlatform === 'BestJobs' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    job.sourcePlatform === 'LinkedIn' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                    job.sourcePlatform === 'OLX' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    job.sourcePlatform === 'Indeed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    job.sourcePlatform === 'Hipo' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-700'
                  }`}
                  title={`Preluat de pe ${job.sourcePlatform}`}
                >
                  <span>🔗 {job.sourcePlatform}</span>
                </a>
              )}
              {job.urgent && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 animate-pulse">
                  Urgent
                </span>
              )}
            </div>
            <h3 
              onClick={() => onOpenDetails(job)}
              className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
            >
              {job.title}
            </h3>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {job.company}
            </p>
          </div>

          <button
            onClick={() => onToggleSave(job)}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isSaved
                ? 'bg-orange-100 text-orange-600'
                : 'bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200'
            }`}
            title={isSaved ? 'Elimină din salvate' : 'Salvează jobul'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-orange-600' : ''}`} />
          </button>
        </div>

        {/* Location & Salary */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{job.experience}</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-4 border border-slate-100">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Salariu Net</span>
            <span className="text-base font-extrabold text-slate-900">
              {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Contact</span>
            <a
              href={`tel:${job.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{job.phone}</span>
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2">
          {job.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Direct Call & Message Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${job.phone}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenCall(job);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Sună</span>
          </a>

          <button
            onClick={() => onOpenMessage(job)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
            <span>Mesaj</span>
          </button>
        </div>

        <button
          onClick={() => onOpenDetails(job)}
          className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
        >
          <span>Detalii</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
