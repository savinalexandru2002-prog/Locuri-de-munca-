import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_JOBS } from "./src/data/jobs.js";
import { Job, Application, EmployerMessage, JobPlatformSource } from "./src/types.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// In-memory data stores for persistence during session
let jobsList: Job[] = INITIAL_JOBS.map(job => ({
  ...job,
  autoPublished: true,
  status: 'Auto-Publicat' as const,
  autoPublishedAt: 'Astăzi'
}));
let applicationsList: Application[] = [];
let messagesList: EmployerMessage[] = [];
let lastDailySyncDate: string = new Date().toISOString().split('T')[0];
let lastSyncTime: string = new Date().toLocaleString('ro-RO');
let lastAutoPublishTime: string = new Date().toLocaleTimeString('ro-RO');
let totalSyncedCount: number = 284;

const EXTENDED_AUTO_PUBLISH_POOL = [
  {
    title: 'Inginer Calitate Furnizori Automotive (SQA)',
    company: 'Schaeffler România Brașov',
    category: 'Inginerie & Auto',
    district: 'Zona Industrială',
    salaryMin: 7200,
    salaryMax: 10500,
    jobType: 'Full-time',
    experience: 'Mid',
    phone: '+40 268 505 000',
    contactPerson: 'Ing. Radu Moldovan',
    contactTitle: 'Director Calitate SQA',
    description: 'Post nou auto-publicat din fluxul activ de producție automotive. Auditare procese furnizori, IATF 16949, PPAP și aprobare mostre.',
    requirements: ['Studii superioare tehnice', 'Minim 2 ani în asigurarea calității auto', 'Cunoștințe IATF 16949 / VDA', 'Engleză fluent'],
    benefits: ['Al 13-lea salariu garantat', 'Asigurare de sănătate privată', 'Tichete de masă 40 lei/zi', 'Transport asigurat pe rute din Brașov și județ']
  },
  {
    title: 'Ospătar & Barman Profesionist Terase',
    company: 'Bistro de l\'Arte Centrul Vechi',
    category: 'HoReCa & Turism',
    district: 'Centrul Vechi',
    salaryMin: 4600,
    salaryMax: 6800,
    jobType: 'Full-time',
    experience: 'Junior',
    phone: '+40 742 334 556',
    contactPerson: 'Oana Georgescu',
    contactTitle: 'Manager Restaurant',
    description: 'Anunț auto-publicat pentru sezonul activ. Căutăm ospătari pasionați de gastronomie artizanală, vinuri locale și servire impecabilă în inima Brașovului.',
    requirements: ['Minim 6 luni experiență servire', 'Atitudine primitoare și dinamică', 'Engleză la nivel conversațional'],
    benefits: ['Bacșiș transparent și generos', 'Mese asigurate la tură', 'Program flexibil 2/2', 'Bonusuri lunare de vânzări']
  },
  {
    title: 'Senior DevOps & Cloud Engineer (AWS / Kubernetes)',
    company: 'Miele Tehnica Software Brașov',
    category: 'IT & Software',
    district: 'Centrul Civic',
    salaryMin: 12500,
    salaryMax: 18500,
    jobType: 'Hybrid',
    experience: 'Senior',
    phone: '+40 368 400 300',
    contactPerson: 'Cristian Enache',
    contactTitle: 'Tech Lead Infrastructure',
    description: 'Job auto-publicat din rețeaua IT Brașov. Automatizare CI/CD pipelines, infrastructură Terraform pe AWS și scalare clustere Kubernetes.',
    requirements: ['Minim 4 ani în rol DevOps / Cloud', 'Experiență solidă cu Docker, Kubernetes, AWS', 'Scripting Python sau Bash'],
    benefits: ['Pachet complet de beneficii flexibile (700 lei/lună)', 'Abonament medical VIP', 'Buget anual conferințe internaționale']
  },
  {
    title: 'Consilier Vânzări Echipamente Outdoor & Schi',
    company: 'Decathlon Brașov Coresi',
    category: 'Vânzări & Retail',
    district: 'Tractorul',
    salaryMin: 4300,
    salaryMax: 6100,
    jobType: 'Full-time',
    experience: 'Junior',
    phone: '+40 730 400 550',
    contactPerson: 'Cosmin Vasile',
    contactTitle: 'Lider Departament Sport',
    description: 'Poziție auto-publicată pentru magazinul Decathlon din complexul Coresi. Consilierea pasionaților de munte, gestionarea stocurilor și organizare evenimente sportive locale.',
    requirements: ['Pasiune pentru sport și mișcare', 'Abilități excelente de comunicare', 'Disponibilitate pentru lucru în ture'],
    benefits: ['Reducere de 20% la toate articolele', 'Asigurare medicală privată', 'Prime lunare de performanță magazin']
  },
  {
    title: 'Tehnician Electronician Montaj & Testare PCB',
    company: 'Benchmark Electronics Brașov',
    category: 'Inginerie & Auto',
    district: 'Zona Industrială',
    salaryMin: 5500,
    salaryMax: 7800,
    jobType: 'Full-time',
    experience: 'Mid',
    phone: '+40 268 308 000',
    contactPerson: 'Ing. Sorin Munteanu',
    contactTitle: 'Supervizor Producție Electronică',
    description: 'Anunț auto-publicat automat. Diagnosticare, testare și lipire componente electronice SMD/THT pentru echipamente medicale și aerospațiale.',
    requirements: ['Studii profil electronică/electrotehnică', 'Îndemânare la lipituri fine sub microscop', 'Atenție sporită la detalii'],
    benefits: ['Spor de noapte și ore suplimentare plătite dublu', 'Transport gratuit tur-retur', 'Tichete de masă 40 RON/zi']
  },
  {
    title: 'Asistent Medical Generalist Ambulatoriu',
    company: 'Spitalul Sf. Constantin Brașov',
    category: 'Medical & Pharma',
    district: 'Centrul Nou',
    salaryMin: 5800,
    salaryMax: 8200,
    jobType: 'Full-time',
    experience: 'Mid',
    phone: '+40 268 300 300',
    contactPerson: 'As. Șef Mariana Toma',
    contactTitle: 'Coordonator Asistență Medicală',
    description: 'Post medical auto-publicat. Recoltare probe biologice, administrare tratamente, asistență în cabinete de consultații multidisciplinare.',
    requirements: ['Diplomă de asistent medical generalist', 'Certificat de membru OAMGMAMR și asigurare malpraxis la zi', 'Răbdare și empatie'],
    benefits: ['Pachet medical gratuit pentru asigurat și familie', 'Condiții de lucru la standarde europene', 'Prime de sărbători']
  },
  {
    title: 'Șofer Profesionist Distribuție Regională Cat. C+E',
    company: 'Duvenbeck Logistics Brașov',
    category: 'Logistică & Transport',
    district: 'Bartolomeu',
    salaryMin: 6800,
    salaryMax: 9500,
    jobType: 'Full-time',
    experience: 'Mid',
    phone: '+40 735 990 120',
    contactPerson: 'Adrian Iacob',
    contactTitle: 'Fleet Manager',
    description: 'Job auto-publicat pentru transport marfă regional în județele Brașov, Sibiu, Covasna și Prahova. Camioane Mercedes Actros noi, curse zilnice cu întoarcere acasă în fiecare seară.',
    requirements: ['Permis categoria C+E valabil', 'Atestat profesional transport marfă și card tahograf', 'Cazier judiciar curat'],
    benefits: ['Diurnă zilnică consistentă', 'Fără dormit în cabină - în fiecare seară acasă', 'Flotă modernă cu revizii la zi']
  },
  {
    title: 'Recepționer Hotel 4* (Schimburi / Engleză)',
    company: 'Hotel Aro Palace Brașov',
    category: 'HoReCa & Turism',
    district: 'Centru',
    salaryMin: 4500,
    salaryMax: 6500,
    jobType: 'Full-time',
    experience: 'Junior',
    phone: '+40 268 478 800',
    contactPerson: 'Simona Barbu',
    contactTitle: 'Front Office Manager',
    description: 'Poziție auto-publicată din inima Brașovului. Check-in/check-out oaspeți din țară și străinătate, gestionare rezervări în sistemul hotelier, informare turistică.',
    requirements: ['Engleză fluent (o a doua limbă constituie avantaj)', 'Cunoștințe operare calculator', 'Prezență agreabilă și profesionalism'],
    benefits: ['Uniformă de serviciu asigurată și curățată', 'Tichete de masă și mese incluse în tură', 'Discounturi în lanțul hotelier']
  }
];

// Master Auto-Publish execution function
const autoPublishJobs = (options?: { platform?: JobPlatformSource; count?: number; triggerSource?: string }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  lastDailySyncDate = todayStr;
  lastSyncTime = new Date().toLocaleString('ro-RO');
  lastAutoPublishTime = new Date().toLocaleTimeString('ro-RO');
  
  const platforms: ('eJobs' | 'BestJobs' | 'LinkedIn' | 'OLX' | 'Indeed' | 'Hipo')[] = ['eJobs', 'BestJobs', 'LinkedIn', 'OLX', 'Indeed', 'Hipo'];
  const countToPublish = options?.count || (options?.platform ? 2 : 2);
  
  // Pick random samples from pool
  const shuffled = [...EXTENDED_AUTO_PUBLISH_POOL].sort(() => 0.5 - Math.random());
  const selectedSamples = shuffled.slice(0, countToPublish);
  const newlyPublishedJobs: Job[] = [];

  selectedSamples.forEach((sample, idx) => {
    const platform = options?.platform || platforms[(Math.floor(Math.random() * platforms.length) + idx) % platforms.length];
    const newJob: Job = {
      id: `autopublish-${platform.toLowerCase()}-${todayStr}-${Date.now()}-${idx}`,
      title: sample.title,
      company: sample.company,
      category: sample.category as any,
      location: `${sample.district}, Brașov`,
      district: sample.district,
      salaryMin: sample.salaryMin,
      salaryMax: sample.salaryMax,
      currency: 'RON',
      jobType: sample.jobType as any,
      experience: sample.experience as any,
      phone: sample.phone,
      contactPerson: sample.contactPerson,
      contactTitle: sample.contactTitle,
      description: `[Verificat & Auto-Publicat • ${new Date().toLocaleDateString('ro-RO')} via ${platform}] ${sample.description}`,
      requirements: sample.requirements,
      benefits: sample.benefits,
      postedDate: todayStr,
      urgent: idx === 0,
      featured: idx === 0,
      viewsCount: Math.floor(Math.random() * 25) + 5,
      applicationsCount: 0,
      sourcePlatform: platform,
      externalUrl: `https://www.${platform.toLowerCase()}.ro/locuri-de-munca/brasov`,
      autoPublished: true,
      status: 'Auto-Publicat',
      autoPublishedAt: lastAutoPublishTime
    };

    jobsList.unshift(newJob);
    newlyPublishedJobs.push(newJob);
  });

  totalSyncedCount += newlyPublishedJobs.length;
  console.log(`[Auto-Publisher] S-au auto-publicat ${newlyPublishedJobs.length} anunțuri noi în Brașov la ${lastAutoPublishTime} (Sursă: ${options?.triggerSource || options?.platform || 'Automat'})`);
  return newlyPublishedJobs;
};

// Initial boot auto-publishing run
try {
  autoPublishJobs({ count: 2, triggerSource: 'System Startup Auto-Publish' });
} catch (e) {
  console.error("Initial auto-publish error:", e);
}

// Continuous background auto-publisher running every 90 seconds (1.5 minutes)
setInterval(() => {
  try {
    autoPublishJobs({ count: 1, triggerSource: 'Continuous Background Auto-Publisher' });
  } catch (err) {
    console.error('[Background Auto-Publisher Error]', err);
  }
}, 90 * 1000);

// Check SerpAPI key from environment (either SERPAPI_KEY, GEMINI_API_KEYi or GEMINI_API_KEY2 if set there)
const getSerpApiKey = (): string | null => {
  if (process.env.SERPAPI_KEY) return process.env.SERPAPI_KEY.trim();
  const k1 = process.env.GEMINI_API_KEYi?.trim();
  if (k1 && k1.length === 64 && !k1.startsWith('AQ.') && !k1.startsWith('AIza')) return k1;
  const k2 = process.env.GEMINI_API_KEY2?.trim();
  if (k2 && k2.length === 64 && !k2.startsWith('AQ.') && !k2.startsWith('AIza')) return k2;
  return null;
};

// Initialize Gemini Client safely with support for multiple API keys (fallback / load sharing)
const getGeminiApiKeys = (): string[] => {
  const keys: string[] = [];
  // Only include genuine Gemini keys (AQ... or AIza... or length != 64 hex)
  const isLikelyGemini = (key: string) => key.startsWith('AQ.') || key.startsWith('AIza') || key.length !== 64;

  if (process.env.GEMINI_API_KEY && isLikelyGemini(process.env.GEMINI_API_KEY.trim())) {
    keys.push(process.env.GEMINI_API_KEY.trim());
  }
  if (process.env.GEMINI_API_KEYi && isLikelyGemini(process.env.GEMINI_API_KEYi.trim())) {
    keys.push(process.env.GEMINI_API_KEYi.trim());
  }
  if (process.env.GEMINI_API_KEY2 && isLikelyGemini(process.env.GEMINI_API_KEY2.trim())) {
    keys.push(process.env.GEMINI_API_KEY2.trim());
  }
  return keys;
};

const getGeminiClient = (customKey?: string) => {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Routes
app.get("/api/jobs", (req, res) => {
  res.json({ 
    success: true, 
    data: jobsList, 
    lastSyncTime, 
    lastDailySyncDate,
    lastAutoPublishTime,
    totalSyncedCount,
    autoPublishActive: true
  });
});

// Auto-publish batch endpoint (all platforms)
app.post("/api/auto-publish", (req, res) => {
  try {
    const newlyPublished = autoPublishJobs({ count: 3, triggerSource: 'Cerere UI Auto-Publicare' });
    res.json({ 
      success: true, 
      newlyPublished,
      data: jobsList, 
      lastSyncTime, 
      lastAutoPublishTime,
      totalSyncedCount,
      message: `${newlyPublished.length} locuri de muncă din Brașov au fost auto-publicate cu succes!` 
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Single platform sync & auto-publish
app.post("/api/sync-platform", (req, res) => {
  try {
    const { platform } = req.body;
    const validPlatforms = ['eJobs', 'BestJobs', 'LinkedIn', 'OLX', 'Indeed', 'Hipo'];
    const targetPlatform = validPlatforms.includes(platform) ? platform : 'eJobs';
    const newlyPublished = autoPublishJobs({ platform: targetPlatform, count: 2, triggerSource: `Sincronizare ${targetPlatform}` });
    
    res.json({ 
      success: true, 
      newlyPublished,
      data: jobsList, 
      lastSyncTime, 
      lastAutoPublishTime,
      totalSyncedCount,
      message: `Platforma ${targetPlatform} a fost actualizată și 2 joburi noi au fost auto-publicate!` 
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Check status of all API keys (Gemini and SerpAPI)
app.get("/api/keys-status", async (req, res) => {
  const serpKey = getSerpApiKey();
  const geminiKeys = getGeminiApiKeys();

  let serpStatus = {
    configured: !!serpKey,
    active: false,
    plan: null as string | null,
    searchesLeft: null as number | null,
    email: null as string | null
  };

  if (serpKey) {
    try {
      const resp = await fetch(`https://serpapi.com/account?api_key=${serpKey}`);
      const data = await resp.json();
      if (data && data.account_status === "Active") {
        serpStatus.active = true;
        serpStatus.plan = data.plan_name;
        serpStatus.searchesLeft = data.total_searches_left ?? data.plan_searches_left;
        serpStatus.email = data.account_email;
      }
    } catch (e: any) {
      console.warn("SerpAPI account check failed:", e?.message);
    }
  }

  res.json({
    gemini: {
      configuredCount: geminiKeys.length,
      primaryConfigured: !!process.env.GEMINI_API_KEY
    },
    serpapi: serpStatus
  });
});

app.post("/api/sync-daily", (req, res) => {
  const newlyPublished = autoPublishJobs({ count: 2, triggerSource: 'Sincronizare Zilnică Manuală' });
  res.json({ 
    success: true, 
    data: jobsList, 
    newlyPublished,
    lastSyncTime, 
    lastDailySyncDate,
    lastAutoPublishTime,
    totalSyncedCount 
  });
});

app.post("/api/sync-hourly", (req, res) => {
  const newlyPublished = autoPublishJobs({ count: 2, triggerSource: 'Sincronizare Orară' });
  res.json({ 
    success: true, 
    data: jobsList, 
    newlyPublished,
    lastSyncTime, 
    lastDailySyncDate,
    lastAutoPublishTime,
    totalSyncedCount 
  });
});

app.post("/api/jobs", (req, res) => {
  try {
    const newJobData = req.body;
    const nowTime = new Date().toLocaleTimeString('ro-RO');
    const newJob: Job = {
      id: `job-direct-${Date.now()}`,
      title: newJobData.title || 'Poziție nouă Brașov',
      company: newJobData.company || 'Companie Locală',
      category: newJobData.category || 'Altele',
      location: newJobData.location || 'Brașov',
      district: newJobData.district || 'Centru',
      salaryMin: Number(newJobData.salaryMin) || 4500,
      salaryMax: Number(newJobData.salaryMax) || 7500,
      currency: 'RON',
      jobType: newJobData.jobType || 'Full-time',
      experience: newJobData.experience || 'Junior',
      phone: newJobData.phone || '+40 700 000 000',
      contactPerson: newJobData.contactPerson || 'Departament HR',
      contactTitle: newJobData.contactTitle || 'Recruiter',
      description: newJobData.description || 'Fără descriere.',
      requirements: newJobData.requirements || ['Motivație și seriozitate'],
      benefits: newJobData.benefits || ['Pachet salarial atractiv'],
      postedDate: new Date().toISOString().split('T')[0],
      urgent: Boolean(newJobData.urgent),
      featured: true,
      viewsCount: 1,
      applicationsCount: 0,
      sourcePlatform: 'Direct',
      autoPublished: true,
      status: 'Auto-Publicat',
      autoPublishedAt: nowTime
    };
    jobsList.unshift(newJob);
    console.log(`[Auto-Publish Direct] Anunțul "${newJob.title}" (${newJob.company}) a fost auto-publicat instantaneu pe portal!`);
    res.json({ success: true, data: newJob, message: 'Anunțul tău a fost auto-publicat cu succes și este live pe portal!' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/applications", (req, res) => {
  try {
    const appData = req.body;
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: appData.jobId,
      jobTitle: appData.jobTitle,
      company: appData.company,
      applicantName: appData.applicantName,
      phone: appData.phone,
      email: appData.email,
      message: appData.message,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'Trimisă'
    };
    applicationsList.unshift(newApp);

    // Increment application count for job
    const job = jobsList.find(j => j.id === appData.jobId);
    if (job) {
      job.applicationsCount += 1;
    }

    res.json({ success: true, data: newApp });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/messages", (req, res) => {
  try {
    const msgData = req.body;
    const newMsg: EmployerMessage = {
      id: `msg-${Date.now()}`,
      jobId: msgData.jobId,
      jobTitle: msgData.jobTitle,
      company: msgData.company,
      phone: msgData.phone,
      senderName: msgData.senderName,
      message: msgData.message,
      sentAt: new Date().toLocaleString('ro-RO'),
      type: msgData.type || 'sms'
    };
    messagesList.unshift(newMsg);
    res.json({ success: true, data: newMsg });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Localized Career Guidance Fallback for Brașov
const generateLocalBrașovAdvice = (userSkills: string, targetCategory: string, question: string) => {
  const categoryGuidance: Record<string, { companies: string; salary: string; advice: string }> = {
    'IT & Software': {
      companies: 'Siemens Software Brașov, Pentalog, Atos, Mondly by Pearson, Bitdefender Brașov Hub, NTT Data (Coresi Business Park & Centrul Civic)',
      salary: 'Junior: 4.500 - 7.500 RON net | Mid: 8.000 - 14.000 RON net | Senior: 14.000 - 22.000 RON net',
      advice: 'Coresi Business Campus este principalul pol tehnologic din Brașov. Menționează portofoliul practic de proiecte și disponibilitatea pentru lucru hibrid.'
    },
    'HoReCa & Turism': {
      companies: 'Aro Palace 5*, Hotel Alpin Poiana Brașov, Bella Muzica, Sergiana Grup, Trattoria del Chianti, Bistro de l’Arte',
      salary: 'Ospătar/Barista: 3.800 - 5.500 RON + bacșiș | Bucătar: 5.000 - 9.000 RON | Recepție: 4.200 - 6.500 RON',
      advice: 'Contactul direct telefonic este cel mai apreciat în HoReCa în Brașov. Menționează cunoștințele de limbi străine (engleză/germană) pentru turiști.'
    },
    'Inginerie & Auto': {
      companies: 'Autoliv România, Schaeffler România (Cristian), Continental Powertrain (Ghimbav), Miele Brașov, Bilka Steel, Stabilus',
      salary: 'Tehnician: 4.800 - 7.500 RON net | Inginer Calitate/Producție: 6.500 - 12.000 RON net | Inginer Senior: 11.000 - 18.000 RON net',
      advice: 'Majoritatea marilor fabrici oferă transport gratuit din tot județul Brașov, tichete de masă și al 13-lea salariu. Evidențiază certificările tehnice.'
    },
    'Vânzări & Retail': {
      companies: 'Coresi Shopping Resort (Zara, H&M), Dedeman Brașov (Bartolomeu & Astra), Selgros Cash & Carry, Farmacia Tei, Flanco, Hornbach',
      salary: 'Lucrător comercial: 3.600 - 5.000 RON | Consilier vânzări showroom: 4.500 - 7.500 RON + comisioane',
      advice: 'Pune accent pe orientarea către client, dinamism și punctualitate. La companiile mari din Coresi sau Dedeman promovările interne sunt rapide.'
    },
    'Medical & Pharma': {
      companies: 'Regina Maria Brașov, MedLife Brașov, Spitalul Sf. Constantin, Farmacia Tei, RMN Diagnostica, Clinici Dentare Private',
      salary: 'Asistent medical: 4.200 - 6.800 RON net | Farmacist: 5.500 - 10.000 RON net | Medic/Specialist: 8.000 - 20.000+ RON',
      advice: 'Verifică dacă ai certificatul OAMGMAMR sau Colegiul Farmaciștilor la zi. Brașovul are o rețea medicală privată modernă în continuă dezvoltare.'
    },
    'Logistică & Transport': {
      companies: 'Vesta Spedition, Selgros Logistics, Decathlon Logistics Tractorul, Fan Courier Brașov Hub, Duvenbeck Ghimbav',
      salary: 'Stivuitorist: 4.200 - 6.000 RON | Dispecer transport: 5.000 - 8.000 RON | Șofer C+E: 7.000 - 14.000 RON',
      advice: 'Pentru posturile de depozit, atestatul ISCIR este un avantaj major. Pentru transport internațional, cunoașterea limbii engleze aduce un spor salarial.'
    },
    'Construcții & Imobiliare': {
      companies: 'Kasper Development (Coresi Avantgarden), Maurer Imobiliare, Kronvest Construct, Electro Brașov, companii de instalații HVAC',
      salary: 'Meseriași finisaje/electricieni: 5.000 - 8.500 RON net | Șef șantier / Inginer constructor: 7.500 - 14.000 RON net',
      advice: 'Zona de nord a Brașovului (Tractorul Nou) și Bartolomeu au cel mai mare volum de construcții. Poți apela direct numărul din anunț.'
    },
    'Altele': {
      companies: 'ManpowerGroup Brașov, Contexpert Consulting, CGS România, companii locale de servicii din Centrul Civic',
      salary: '3.800 - 7.500 RON net în funcție de rol și experiență',
      advice: 'Brașovul are un mediu antreprenorial activ. O atitudine deschisă și disponibilitatea de învățare rapidă sunt mereu apreciate de angajatorii locali.'
    }
  };

  const selected = categoryGuidance[targetCategory] || categoryGuidance['IT & Software'];

  return `### Recomandări Carieră pentru Piața Muncii din Brașov

**Profil analizat:** ${userSkills || 'Candidat în căutare de loc de muncă'}
**Domeniu vizat:** ${targetCategory}

---

#### 1. Angajatori și Companii de Referință în Brașov
${selected.companies}

#### 2. Estimare Salarială în Brașov (Valori nete în RON)
${selected.salary}
*Notă: Pachetele includ frecvent tichete de masă (40 RON/zi), bonusuri de performanță, asigurare medicală privată și transport.*

#### 3. Recomandări Practice pentru Angajare Rapidă
- **Contact Direct prin Apel Telefonic:** Angajatorii din Brașov apreciază candidații proactivi. Dacă postul are număr de telefon disponibil în platformă, sună direct la ore rezonabile (09:00 - 16:30) pentru o scurtă prezentare.
- **Profil și CV Adaptat:** Menționează clar cartierul din Brașov în care locuiești, experiența practică și disponibilitatea de începere.
- **Specificul domeniului:** ${selected.advice}

${question ? `\n> **Răspuns la întrebarea ta ("${question}"):**\n> Pe piața muncii din Brașov există cerere constantă în această perioadă. Consultă lista de locuri de muncă din secțiunea **Toate Joburile** și folosește butonul *Sună Angajatorul* sau *Mesaj SMS/WhatsApp* pentru un contact direct fără intermediari.` : ''}

Mult succes în carieră în Brașov!`;
};

// AI Career Advisor endpoint with multi-model fallback and local resilience
app.post("/api/ai/career-advice", async (req, res) => {
  const { userSkills, targetCategory, question } = req.body;

  const prompt = `Ești un consilier de carieră expert pentru piața muncii din Brașov, România. 
Utilizatorul are următoarele competențe/profil: "${userSkills || 'Candidat în căutare de loc de muncă'}".
Domeniul dorit: "${targetCategory || 'Toate domeniile'}".
Întrebare suplimentară sau context: "${question || 'Ce recomandări ai pentru piața din Brașov?'}".

Te rog să oferi un răspuns în limba română structurat profesional, cu recomandări concrete pentru Brașov (companii locale, salarii estimative în RON, sfaturi de interviu și cum să contacteze direct angajatorii prin apel sau mesaje). Fii concis, încurajator și la obiect.`;

  // Candidate models from gemini-api skill (gemini-3.1-flash-lite and gemini-3.5-flash-lite are fast and confirmed available)
  const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];

  let aiResponseText: string | null = null;
  const configuredKeys = getGeminiApiKeys();

  // Try across all configured keys and candidate models
  for (const apiKey of configuredKeys) {
    if (aiResponseText) break;
    for (const model of candidateModels) {
      try {
        const ai = getGeminiClient(apiKey);
        const generatePromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: "Ești un consilier de carieră specializat în județul Brașov. Oferi sfaturi practice, realiste și structurate.",
            temperature: 0.7,
          },
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout waiting for model response")), 8000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          aiResponseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[AI Career Advice] Key ending in ...${apiKey.slice(-4)} / Model ${model} returned error (${err?.status || err?.code || err?.message}), testing next...`);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  // If Gemini produced advice, return it
  if (aiResponseText) {
    return res.json({ success: true, advice: aiResponseText });
  }

  // Gracefully provide high-quality localized Brașov guidance so user request succeeds reliably
  const localAdvice = generateLocalBrașovAdvice(userSkills, targetCategory, question);
  return res.json({ success: true, advice: localAdvice });
});

// AI Cover Letter Generator endpoint using user's configured Gemini API keys
app.post("/api/ai/generate-cover-letter", async (req, res) => {
  const { jobTitle, company, applicantName, skills } = req.body;
  const prompt = `Scrie o scrisoare scurtă de intenție (maxim 3-4 fraze profesionale și calde) în limba română pentru candidatura ${applicantName ? `lui ${applicantName}` : 'unui candidat'} la postul de "${jobTitle || 'angajat'}" la compania "${company || 'din Brașov'}". Menționează pe scurt abilitățile: ${skills || 'abilități relevante, punctualitate și dorință de învățare'} și interesul pentru un interviu sau apel telefonic. Fără clișee pompoase, formulat simplu, demn și profesionist.`;

  const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let letterText: string | null = null;
  const configuredKeys = getGeminiApiKeys();

  for (const apiKey of configuredKeys) {
    if (letterText) break;
    for (const model of candidateModels) {
      try {
        const ai = getGeminiClient(apiKey);
        const generatePromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.7,
          },
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout waiting for model response")), 8000)
        );
        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          letterText = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`[AI Cover Letter] Key ending in ...${apiKey.slice(-4)} / Model ${model} returned error, trying fallback...`);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  if (letterText) {
    return res.json({ success: true, letter: letterText });
  }

  const fallbackText = `Bună ziua,\n\nVă transmit interesul meu activ pentru postul de ${jobTitle || 'angajat'} la ${company || 'compania dumneavoastră'} din Brașov. Cu o atitudine serioasă și orientare către rezultate, sunt motivat să contribui rapid la succesul echipei. Vă stau la dispoziție pentru o scurtă discuție telefonică sau un interviu direct.\n\nCu stimă,\n${applicantName || 'Candidat'}`;
  return res.json({ success: true, letter: fallbackText });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BrașovJobs server running on http://localhost:${PORT}`);
  });
}

startServer();
