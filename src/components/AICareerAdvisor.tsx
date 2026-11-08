import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Briefcase, Award, MapPin } from 'lucide-react';
import Markdown from 'react-markdown';

export const AICareerAdvisor: React.FC = () => {
  const [userSkills, setUserSkills] = useState('');
  const [targetCategory, setTargetCategory] = useState('IT & Software');
  const [question, setQuestion] = useState('Ce salarii se oferă în acest domeniu în Brașov și ce companii angajează?');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdvice(null);
    try {
      const res = await fetch('/api/ai/career-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSkills, targetCategory, question }),
      });
      const data = await res.json();
      if (data.success) {
        setAdvice(data.advice);
      } else {
        setAdvice('Eroare la obținerea sfatului AI. Vă rugăm să încercați din nou.');
      }
    } catch (err) {
      console.error(err);
      setAdvice('Eroare de conexiune cu serverul AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Consilier Carieră Brașov (AI)</h1>
            <p className="text-orange-100 text-xs sm:text-sm">
              Asistent inteligent alimentat de Gemini pentru piața muncii din Brașov
            </p>
          </div>
        </div>
        <p className="text-sm text-orange-100/90 max-w-2xl">
          Introdu competențele tale, domeniul vizat și află imediat ce companii din Brașov caută profilul tău, sfaturi pentru interviuri și estimări salariale corecte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Inputs */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <User className="w-4 h-4 text-orange-600" />
            <span>Profilul tău</span>
          </h2>

          <form onSubmit={handleAskAI} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Competențe / Experiență
              </label>
              <textarea
                rows={3}
                required
                placeholder="ex: React, JavaScript, 3 ani experiență, engleză avansată..."
                value={userSkills}
                onChange={(e) => setUserSkills(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Domeniu Dorit
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-orange-500"
              >
                <option value="IT & Software">IT & Software</option>
                <option value="HoReCa & Turism">HoReCa & Turism</option>
                <option value="Inginerie & Auto">Inginerie & Auto</option>
                <option value="Vânzări & Retail">Vânzări & Retail</option>
                <option value="Medical & Pharma">Medical & Pharma</option>
                <option value="Logistică & Transport">Logistică & Transport</option>
                <option value="Altele">Altele</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Întrebare specifică
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Se generează sfatul AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Obține Consiliere Carieră</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Output View */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <Bot className="w-5 h-5 text-orange-600" />
              <h2 className="font-bold text-slate-900 text-base">Recomandare Personalizată pentru Brașov</h2>
            </div>

            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Gemini analizează piața muncii din Brașov...</p>
              </div>
            ) : advice ? (
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
                <Markdown>{advice}</Markdown>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 text-slate-400">
                <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm">Completează formularul din stânga și apasă pe butonul de consiliere pentru a afla oportunitățile ideale în Brașov.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-right">
            <span className="text-[11px] text-slate-400">Puternic susținut de Gemini AI • Date actualizate Brașov</span>
          </div>
        </div>
      </div>
    </div>
  );
};
