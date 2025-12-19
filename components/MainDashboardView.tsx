
import React, { useState, useMemo } from 'react';
import { TeacherRecord, SupervisionStatus, AppSettings } from '../types';
import { TENDIK_RECORDS, EXTRA_RECORDS } from '../constants';

interface MainDashboardViewProps {
  records: TeacherRecord[];
  settings: AppSettings;
  onRefresh?: () => void;
}

type DashboardTab = 'adm-guru' | 'pembelajaran' | 'tendik' | 'ekstra';

const MainDashboardView: React.FC<MainDashboardViewProps> = ({ records, settings, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('pembelajaran');

  const getPredikat = (score: number) => {
    if (score >= 91) return { label: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 81) return { label: 'Baik', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 71) return { label: 'Cukup', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Kurang', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const dashboardData = useMemo(() => {
    switch (activeTab) {
      case 'adm-guru': {
        const completed = records.filter(r => r.status === SupervisionStatus.COMPLETED && r.nilaiAdm && r.nilaiAdm > 0);
        return {
          title: "Administrasi Guru",
          items: completed.map(r => ({ name: r.namaGuru, category: r.mataPelajaran, score: r.nilaiAdm || 0 })),
          stats: { total: records.length, done: completed.length, avg: completed.length > 0 ? (completed.reduce((s, r) => s + (r.nilaiAdm || 0), 0) / completed.length).toFixed(1) : 0, best: completed.length > 0 ? Math.max(...completed.map(r => r.nilaiAdm || 0)) : 0 }
        };
      }
      case 'pembelajaran': {
        const completed = records.filter(r => r.status === SupervisionStatus.COMPLETED && r.nilai && r.nilai > 0);
        return {
          title: "Supervisi Pembelajaran",
          items: completed.map(r => ({ name: r.namaGuru, category: r.mataPelajaran, score: r.nilai || 0 })),
          stats: { total: records.length, done: completed.length, avg: completed.length > 0 ? (completed.reduce((s, r) => s + (r.nilai || 0), 0) / completed.length).toFixed(1) : 0, best: completed.length > 0 ? Math.max(...completed.map(r => r.nilai || 0)) : 0 }
        };
      }
      case 'tendik': {
        const completed = TENDIK_RECORDS.filter(r => r.status === SupervisionStatus.COMPLETED);
        return {
          title: "Administrasi Tendik",
          items: completed.map(r => ({ name: r.nama, category: r.bidang, score: r.nilai })),
          stats: { total: TENDIK_RECORDS.length, done: completed.length, avg: completed.length > 0 ? (completed.reduce((s, r) => s + r.nilai, 0) / completed.length).toFixed(1) : 0, best: completed.length > 0 ? Math.max(...completed.map(r => r.nilai)) : 0 }
        };
      }
      case 'ekstra': {
        const completed = EXTRA_RECORDS.filter(r => r.status === SupervisionStatus.COMPLETED);
        return {
          title: "Ekstrakurikuler",
          items: completed.map(r => ({ name: r.nama, category: r.ekstra, score: r.nilai })),
          stats: { total: EXTRA_RECORDS.length, done: completed.length, avg: completed.length > 0 ? (completed.reduce((s, r) => s + r.nilai, 0) / completed.length).toFixed(1) : 0, best: completed.length > 0 ? Math.max(...completed.map(r => r.nilai)) : 0 }
        };
      }
      default: return null;
    }
  }, [activeTab, records]);

  const exportPDF = () => {
    const element = document.getElementById('dashboard-export');
    // @ts-ignore
    html2pdf().from(element).save(`Laporan_Dashboard_${activeTab}.pdf`);
  };

  const exportExcel = () => {
    const tableElement = document.getElementById('dashboard-table-export');
    if (!tableElement) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid windowtext; padding: 5px; }</style></head><body>`;
    const tableHtml = tableElement.outerHTML;
    const footer = `</body></html>`;
    const blob = new Blob([header + tableHtml + footer], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Dashboard_${activeTab}.xls`;
    link.click();
  };

  if (!dashboardData) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4 no-print px-2">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          {['adm-guru', 'pembelajaran', 'tendik', 'ekstra'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as DashboardTab)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
              {tab.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
            <button onClick={onRefresh} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-sm flex items-center transition-all hover:bg-indigo-700">
               <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
               Refresh Data
            </button>
            <button onClick={exportPDF} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-sm">PDF</button>
            <button onClick={exportExcel} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-sm">Excel (.xls)</button>
        </div>
      </div>

      <div id="dashboard-export">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Capaian</p>
            <p className="text-2xl font-bold">{dashboardData.stats.done} / {dashboardData.stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Rata-Rata</p>
            <p className="text-2xl font-bold text-emerald-600">{dashboardData.stats.avg}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Tertinggi</p>
            <p className="text-2xl font-bold text-amber-600">{dashboardData.stats.best}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <table id="dashboard-table-export" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase">
                <th className="px-6 py-4 border border-slate-800">Identitas</th>
                <th className="px-6 py-4 text-center border border-slate-800">Skor</th>
                <th className="px-6 py-4 text-right border border-slate-800">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardData.items.map((item, idx) => {
                const pred = getPredikat(item.score);
                return (
                  <tr key={idx}>
                    <td className="px-6 py-4 border border-slate-100">
                      <div className="text-xs font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400 italic">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold border border-slate-100">{item.score}</td>
                    <td className="px-6 py-4 text-right border border-slate-100">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${pred.color} ${pred.bg}`}>{pred.label}</span>
                    </td>
                  </tr>
                );
              })}
              {dashboardData.items.length === 0 && (
                <tr>
                   <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic text-xs uppercase tracking-widest">Belum ada data supervisi yang terverifikasi (Skor > 0)</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardView;
