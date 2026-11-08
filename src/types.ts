export type JobCategory = 
  | 'IT & Software'
  | 'HoReCa & Turism'
  | 'Inginerie & Auto'
  | 'Vânzări & Retail'
  | 'Medical & Pharma'
  | 'Construcții & Imobiliare'
  | 'Logistică & Transport'
  | 'Financiar & Contabilitate'
  | 'Altele';

export type JobType = 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid' | 'Internship';

export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Expert' | 'Fără experiență';

export type JobPlatformSource = 'eJobs' | 'BestJobs' | 'LinkedIn' | 'OLX' | 'Indeed' | 'Hipo' | 'Direct';

export interface Job {
  id: string;
  title: string;
  company: string;
  category: JobCategory;
  location: string; // e.g., 'Centru, Brașov', 'Tractorul, Brașov', etc.
  district: string;
  salaryMin: number; // in RON net
  salaryMax: number;
  currency: string; // 'RON'
  jobType: JobType;
  experience: ExperienceLevel;
  phone: string; // e.g. '+40 722 123 456'
  contactPerson: string;
  contactTitle: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  urgent?: boolean;
  featured?: boolean;
  viewsCount: number;
  applicationsCount: number;
  sourcePlatform?: JobPlatformSource;
  externalUrl?: string;
  autoPublished?: boolean;
  autoPublishedAt?: string;
  status?: 'Publicat' | 'Auto-Publicat' | 'Activ' | 'În verificare';
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  phone: string;
  email: string;
  message: string;
  appliedAt: string;
  status: 'Trimisă' | 'Vizualizată' | 'Programat interviu' | 'Respinsă';
}

export interface EmployerMessage {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  phone: string;
  senderName: string;
  message: string;
  sentAt: string;
  type: 'sms' | 'whatsapp' | 'apel';
}

export interface FilterState {
  search: string;
  category: string;
  district: string;
  jobType: string;
  experience: string;
  minSalary: number;
  sortBy: 'recent' | 'salary_high' | 'salary_low' | 'views';
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  desiredTitle: string;
  experienceYears: string;
  skills: string[];
  education: string;
  bio: string;
  resumeFileName?: string;
  resumeText?: string;
  resumeDataUrl?: string;
  updatedAt: string;
}

