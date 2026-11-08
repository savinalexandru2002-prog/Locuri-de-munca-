import React from 'react';
import { FileText, Building2, Phone, Mail, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';
import { Application, EmployerMessage } from '../types';

interface MyApplicationsViewProps {
  applications: Application[];
  messages: EmployerMessage[];
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  applications,
  messages,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Applications Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              <span>Aplicațiile Mele ({applications.length})</span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Istoricul candidaturilor trimise către angajatorii din Brașov.
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-sm text-slate-500">Nu ai trimis nicio candidatură momentan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-400">Trimis la: {app.appliedAt}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{app.jobTitle}</h3>
                  <p className="text-sm font-medium text-orange-600 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>{app.company}</span>
                  </p>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div><strong>Candidat:</strong> {app.applicantName}</div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {app.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {app.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages Sent Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <span>Mesaje Trimise către Angajatori ({messages.length})</span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Mesajele WhatsApp / SMS trimise direct angajatorilor.
            </p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-sm text-slate-500">Nu ai trimis niciun mesaj direct momentan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase">
                      {msg.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{msg.company} • {msg.jobTitle}</span>
                  </div>
                  <span className="text-xs text-slate-400">{msg.sentAt}</span>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl italic">
                  "{msg.message}"
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-4">
                  <span>De la: <strong>{msg.senderName}</strong></span>
                  <span>Tel: <strong>{msg.phone}</strong></span>
                  <span>Către tel: <strong className="text-emerald-700">{msg.phone}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
