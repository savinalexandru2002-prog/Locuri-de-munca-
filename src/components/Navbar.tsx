import React from 'react';
import { Briefcase, Bookmark, FileText, PlusCircle, Sparkles, MapPin, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: 'jobs' | 'saved' | 'applications' | 'post' | 'ai' | 'cv';
  setActiveTab: (tab: 'jobs' | 'saved' | 'applications' | 'post' | 'ai' | 'cv') => void;
  savedCount: number;
  applicationsCount: number;
  onOpenPlatformsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  applicationsCount,
  onOpenPlatformsModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('jobs')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Brașov</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">JOBS</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Locuri de muncă & contact direct în Brașov</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Toate Joburile</span>
            </button>

            <button
              onClick={onOpenPlatformsModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
              title="Locurile de muncă sunt auto-publicate continuu pe server"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-Publicare Live (6 platforme)</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === 'saved'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Salvate</span>
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === 'applications'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Aplicațiile Mele</span>
              {applicationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {applicationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('cv')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'cv'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span>CV-ul Meu</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ai'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Consilier AI</span>
            </button>
          </nav>

          {/* Post Job Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('post')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all hover:shadow"
            >
              <PlusCircle className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Adaugă Job</span>
              <span className="sm:hidden">Adaugă</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex flex-col items-center gap-1 text-xs font-medium ${
              activeTab === 'jobs' ? 'text-orange-600' : 'text-slate-600'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Joburi</span>
          </button>
          <button
            onClick={onOpenPlatformsModal}
            className="flex flex-col items-center gap-1 text-xs font-bold text-emerald-700"
          >
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>Auto-Public</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center gap-1 text-xs font-medium relative ${
              activeTab === 'saved' ? 'text-orange-600' : 'text-slate-600'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>Salvate</span>
            {savedCount > 0 && (
              <span className="absolute -top-1 right-1 bg-orange-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex flex-col items-center gap-1 text-xs font-medium relative ${
              activeTab === 'applications' ? 'text-orange-600' : 'text-slate-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Aplicații</span>
            {applicationsCount > 0 && (
              <span className="absolute -top-1 right-1 bg-slate-900 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {applicationsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('cv')}
            className={`flex flex-col items-center gap-1 text-xs font-medium ${
              activeTab === 'cv' ? 'text-orange-600' : 'text-slate-600'
            }`}
          >
            <FileText className="w-5 h-5 text-orange-600" />
            <span>CV-ul Meu</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 text-xs font-medium ${
              activeTab === 'ai' ? 'text-orange-600' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>AI Carieră</span>
          </button>
        </div>
      </div>
    </header>
  );
};
