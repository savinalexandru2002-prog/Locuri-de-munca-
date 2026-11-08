/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { JobCard } from './components/JobCard';
import { JobFiltersModal } from './components/JobFilters';
import { JobDetailModal } from './components/JobDetailModal';
import { DirectContactModal } from './components/DirectContactModal';
import { ApplyModal } from './components/ApplyModal';
import { PostJobModal } from './components/PostJobModal';
import { AICareerAdvisor } from './components/AICareerAdvisor';
import { SavedJobsView } from './components/SavedJobsView';
import { MyApplicationsView } from './components/MyApplicationsView';
import { MyCVView } from './components/MyCVView';
import { PlatformsSyncModal } from './components/PlatformsSyncModal';
import { Job, FilterState, Application, EmployerMessage, JobPlatformSource, UserProfile } from './types';
import { INITIAL_JOBS } from './data/jobs';
import { Briefcase, MapPin, SearchX, Sparkles, Phone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'saved' | 'applications' | 'post' | 'ai' | 'cv'>('jobs');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [loading, setLoading] = useState(false);

  // User profile CV stored in localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('brasov_user_profile');
      return saved ? JSON.parse(saved) : {
        fullName: 'Alexandru Popescu',
        email: 'alexandru.popescu@example.com',
        phone: '+40 722 555 888',
        city: 'Centru, Brașov',
        desiredTitle: 'Specialist IT / HoReCa / Vvanzări',
        experienceYears: '2-3 ani',
        skills: ['Comunicare', 'Engleză avansat', 'Permis Cat B', 'Microsoft Office'],
        education: 'Universitatea Transilvania din Brașov',
        bio: 'Profesionist din Brașov cu experiență în relații cu clienții și operare PC, serios și punctat.',
        updatedAt: '08.09.2026'
      };
    } catch {
      return {
        fullName: 'Alexandru Popescu',
        email: 'alexandru.popescu@example.com',
        phone: '+40 722 555 888',
        city: 'Centru, Brașov',
        desiredTitle: 'Specialist',
        experienceYears: '2-3 ani',
        skills: ['Comunicare', 'Engleză'],
        education: 'Universitatea Transilvania Brașov',
        bio: 'Motivat și dornic de afirmare în Brașov.',
        updatedAt: '08.09.2026'
      };
    }
  });


  // Saved job IDs stored in localStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('brasov_saved_jobs');
      return saved ? JSON.parse(saved) : ['brasov-job-1', 'brasov-job-2'];
    } catch {
      return ['brasov-job-1', 'brasov-job-2'];
    }
  });

  // Applications and Messages stored in localStorage
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem('brasov_applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState<EmployerMessage[]>(() => {
    try {
      const saved = localStorage.getItem('brasov_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    category: '',
    district: '',
    jobType: '',
    experience: '',
    minSalary: 0,
    sortBy: 'recent',
  });

  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedJobForCall, setSelectedJobForCall] = useState<Job | null>(null);
  const [selectedJobForMessage, setSelectedJobForMessage] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isPlatformsModalOpen, setIsPlatformsModalOpen] = useState(false);
  const [totalSyncedCount, setTotalSyncedCount] = useState<number>(284);
  const [lastAutoPublishedAt, setLastAutoPublishedAt] = useState<string>('');

  const fetchJobs = React.useCallback(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setJobs(data.data);
          if (data.totalSyncedCount) setTotalSyncedCount(data.totalSyncedCount);
          if (data.lastAutoPublishTime) setLastAutoPublishedAt(data.lastAutoPublishTime);
        }
      })
      .catch(err => console.error('Failed to fetch jobs:', err));
  }, []);

  // Fetch jobs on mount and poll every 25 seconds for continuous auto-publishing updates
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 25000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('brasov_saved_jobs', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('brasov_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('brasov_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('brasov_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Toggle Save Job
  const handleToggleSave = (job: Job) => {
    setSavedIds(prev => 
      prev.includes(job.id) ? prev.filter(id => id !== job.id) : [...prev, job.id]
    );
  };

  // Submit Application
  const handleApplicationSubmit = (appData: Omit<Application, 'id' | 'appliedAt' | 'status'>) => {
    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApplications(prev => [data.data, ...prev]);
        }
      })
      .catch(() => {
        // Fallback local
        const newApp: Application = {
          id: `app-${Date.now()}`,
          ...appData,
          appliedAt: new Date().toISOString().split('T')[0],
          status: 'Trimisă',
        };
        setApplications(prev => [newApp, ...prev]);
      });
  };

  // Send Message
  const handleSendMessage = (msgData: Omit<EmployerMessage, 'id' | 'sentAt'>) => {
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(prev => [data.data, ...prev]);
        }
      })
      .catch(() => {
        const newMsg: EmployerMessage = {
          id: `msg-${Date.now()}`,
          ...msgData,
          sentAt: new Date().toLocaleString('ro-RO'),
        };
        setMessages(prev => [newMsg, ...prev]);
      });
  };

  // Handle New Job Created
  const handleJobCreated = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterState({
      search: '',
      category: '',
      district: '',
      jobType: '',
      experience: '',
      minSalary: 0,
      sortBy: 'recent',
    });
    setIsAdvancedFiltersOpen(false);
  };

  // Filter & Sort Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      !filterState.search ||
      job.title.toLowerCase().includes(filterState.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filterState.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filterState.search.toLowerCase());

    const matchesCategory = !filterState.category || job.category === filterState.category;
    const matchesDistrict = !filterState.district || job.district.toLowerCase() === filterState.district.toLowerCase();
    const matchesJobType = !filterState.jobType || job.jobType === filterState.jobType;
    const matchesExperience = !filterState.experience || job.experience === filterState.experience;
    const matchesSalary = job.salaryMax >= filterState.minSalary;

    return matchesSearch && matchesCategory && matchesDistrict && matchesJobType && matchesExperience && matchesSalary;
  }).sort((a, b) => {
    if (filterState.sortBy === 'salary_high') return b.salaryMax - a.salaryMax;
    if (filterState.sortBy === 'salary_low') return a.salaryMin - b.salaryMin;
    if (filterState.sortBy === 'views') return b.viewsCount - a.viewsCount;
    // default recent
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

  const savedJobsList = jobs.filter(j => savedIds.includes(j.id));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'post') {
            setIsPostJobOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        savedCount={savedIds.length}
        applicationsCount={applications.length}
        onOpenPlatformsModal={() => setIsPlatformsModalOpen(true)}
      />

      {/* Main Body depending on tab */}
      <main className="flex-1">
        {activeTab === 'jobs' && (
          <div>
            <HeroSearch
              filterState={filterState}
              setFilterState={setFilterState}
              totalJobs={filteredJobs.length}
              onOpenAdvancedFilters={() => setIsAdvancedFiltersOpen(true)}
            />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
              {/* Active filters summary if any */}
              {(filterState.category || filterState.district || filterState.jobType || filterState.experience || filterState.minSalary > 0 || filterState.search) && (
                <div className="flex items-center justify-between bg-orange-50/80 border border-orange-200/60 rounded-2xl p-4 mb-8">
                  <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-orange-900">
                    <span>Filtre active:</span>
                    {filterState.search && <span className="bg-white px-2.5 py-1 rounded-lg border border-orange-200">Căutare: "{filterState.search}"</span>}
                    {filterState.category && <span className="bg-white px-2.5 py-1 rounded-lg border border-orange-200">Domeniu: {filterState.category}</span>}
                    {filterState.district && <span className="bg-white px-2.5 py-1 rounded-lg border border-orange-200">Zonă: {filterState.district}</span>}
                    {filterState.jobType && <span className="bg-white px-2.5 py-1 rounded-lg border border-orange-200">Tip: {filterState.jobType}</span>}
                    {filterState.experience && <span className="bg-white px-2.5 py-1 rounded-lg border border-orange-200">Experiență: {filterState.experience}</span>}
                    {filterState.minSalary > 0 && <span className="bg-white px-2.5 py-1 rounded-lg border border-orange-200">Min: {filterState.minSalary} RON</span>}
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-orange-700 hover:underline shrink-0 ml-4"
                  >
                    Resetează tot
                  </button>
                </div>
              )}

              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto my-12">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <SearchX className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Nu am găsit locuri de muncă conform filtrelor</h3>
                  <p className="text-sm text-slate-600">
                    Încearcă să modifici termenii de căutare sau să resetezi filtrele avansate.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all inline-block"
                  >
                    Resetează filtrele
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedIds.includes(job.id)}
                      onToggleSave={handleToggleSave}
                      onOpenDetails={(j) => setSelectedJobForDetails(j)}
                      onOpenCall={(j) => {
                        setSelectedJobForCall(j);
                      }}
                      onOpenMessage={(j) => setSelectedJobForMessage(j)}
                      onOpenApply={(j) => setSelectedJobForApply(j)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedJobsView
            savedJobs={savedJobsList}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onOpenDetails={(j) => setSelectedJobForDetails(j)}
            onOpenCall={(j) => setSelectedJobForCall(j)}
            onOpenMessage={(j) => setSelectedJobForMessage(j)}
            onOpenApply={(j) => setSelectedJobForApply(j)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'applications' && (
          <MyApplicationsView
            applications={applications}
            messages={messages}
          />
        )}

        {activeTab === 'ai' && (
          <AICareerAdvisor />
        )}

        {activeTab === 'cv' && (
          <MyCVView
            profile={userProfile}
            onSaveProfile={(prof) => setUserProfile(prof)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">BrașovJobs Direct</span>
              <p className="text-xs text-slate-400">Portalul oficial de locuri de muncă în Brașov cu apel și mesaje directe</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>© 2026 BrașovJobs. Toate drepturile rezervate.</p>
            <p>Contact direct angajatori • Fără comisioane ascunse</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JobFiltersModal
        isOpen={isAdvancedFiltersOpen}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        filterState={filterState}
        setFilterState={setFilterState}
        onReset={handleResetFilters}
      />

      <JobDetailModal
        job={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        isSaved={selectedJobForDetails ? savedIds.includes(selectedJobForDetails.id) : false}
        onToggleSave={handleToggleSave}
        onOpenCall={(j) => setSelectedJobForCall(j)}
        onOpenMessage={(j) => setSelectedJobForMessage(j)}
        onOpenApply={(j) => setSelectedJobForApply(j)}
      />

      <DirectContactModal
        job={selectedJobForMessage}
        onClose={() => setSelectedJobForMessage(null)}
        onSendMessage={handleSendMessage}
      />

      <ApplyModal
        job={selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        onSubmitApplication={handleApplicationSubmit}
      />

      {isPostJobOpen && (
        <PostJobModal
          onClose={() => setIsPostJobOpen(false)}
          onJobCreated={handleJobCreated}
        />
      )}

      <PlatformsSyncModal
        isOpen={isPlatformsModalOpen}
        onClose={() => setIsPlatformsModalOpen(false)}
        totalSyncedCount={totalSyncedCount}
        onSyncPlatform={() => {
          fetchJobs();
        }}
      />
    </div>
  );
}
