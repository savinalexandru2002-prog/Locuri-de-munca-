import React from 'react';
import { Bookmark, Briefcase, Trash2 } from 'lucide-react';
import { Job } from '../types';
import { JobCard } from './JobCard';

interface SavedJobsViewProps {
  savedJobs: Job[];
  savedIds: string[];
  onToggleSave: (job: Job) => void;
  onOpenDetails: (job: Job) => void;
  onOpenCall: (job: Job) => void;
  onOpenMessage: (job: Job) => void;
  onOpenApply: (job: Job) => void;
  setActiveTab: (tab: 'jobs' | 'saved' | 'applications' | 'post' | 'ai') => void;
}

export const SavedJobsView: React.FC<SavedJobsViewProps> = ({
  savedJobs,
  savedIds,
  onToggleSave,
  onOpenDetails,
  onOpenCall,
  onOpenMessage,
  onOpenApply,
  setActiveTab,
}) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-orange-600 fill-orange-600" />
            <span>Joburi Salvate ({savedJobs.length})</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Locurile de muncă marcate de tine pentru a le urmări sau a contacta angajatorii ulterior.
          </p>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Nu ai niciun job salvat</h2>
          <p className="text-sm text-slate-600">
            Explorează lista de joburi din Brașov și apasă pe iconița de bookmark pentru a salva anunțurile care te interesează.
          </p>
          <button
            onClick={() => setActiveTab('jobs')}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all inline-block"
          >
            Explorează Joburile din Brașov
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onToggleSave={onToggleSave}
              onOpenDetails={onOpenDetails}
              onOpenCall={onOpenCall}
              onOpenMessage={onOpenMessage}
              onOpenApply={onOpenApply}
            />
          ))}
        </div>
      )}
    </div>
  );
};
