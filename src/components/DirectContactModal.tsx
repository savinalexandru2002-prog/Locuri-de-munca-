import React, { useState } from 'react';
import { X, MessageSquare, Send, Phone, CheckCircle2, Copy } from 'lucide-react';
import { Job, EmployerMessage } from '../types';

interface DirectContactModalProps {
  job: Job | null;
  onClose: () => void;
  onSendMessage: (msg: Omit<EmployerMessage, 'id' | 'sentAt'>) => void;
}

export const DirectContactModal: React.FC<DirectContactModalProps> = ({
  job,
  onClose,
  onSendMessage,
}) => {
  if (!job) return null;

  const [senderName, setSenderName] = useState('');
  const [phone, setPhone] = useState('');
  const [messageType, setMessageType] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [messageText, setMessageText] = useState(
    `Bună ziua! Sunt interesat(ă) de postul "${job.title}" de la ${job.company} din Brașov. Aș dori să stabilim o discuție sau un interviu. Vă mulțumesc!`
  );
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !phone) {
      alert('Vă rugăm să introduceți numele și numărul de telefon.');
      return;
    }

    onSendMessage({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      phone: job.phone,
      senderName,
      message: messageText,
      type: messageType,
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(job.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-lg">Contactează Direct Angajatorul</h2>
          </div>
          <p className="text-xs text-slate-300">
            {job.company} • {job.title}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Număr telefon: <strong className="text-white">{job.phone}</strong></span>
            <button
              onClick={handleCopyPhone}
              className="ml-2 text-orange-300 hover:text-orange-200 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copiat!' : 'Copiază'}</span>
            </button>
          </div>
        </div>

        {sentSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Mesaj trimis cu succes!</h3>
            <p className="text-sm text-slate-600">
              Angajatorul a fost notificat și te va contacta în cel mai scurt timp la numărul specificat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Canal de Contact
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMessageType('whatsapp')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    messageType === 'whatsapp'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>💬 WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessageType('sms')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    messageType === 'sms'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>📱 SMS / Mesaj Direct</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Numele Tău *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Ion Popescu"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Numărul Tău de Telefon *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: 0722 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Conținutul Mesajului
              </label>
              <textarea
                rows={4}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Anulează
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Trimite Mesajul</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
