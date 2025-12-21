
import React, { useMemo } from 'react';
import { TeacherRecord, SupervisionStatus, AppSettings } from '../types';

interface MainDashboardViewProps {
  records: TeacherRecord[];
  settings: AppSettings;
  onRefresh?: () => void;
}

const MainDashboardView: React.FC<MainDashboardViewProps> = ({ records, settings }) => {
  const activeSemester = settings.semester;

  const stats = useMemo(() => {
    const current = records.filter(r => r.semester === activeSemester);
    const completed = current.filter(r => r.status === SupervisionStatus.COMPLETED);
    const avgAdm = completed.length > 0 ? (completed.reduce((s, r) => s + (r.nilaiAdm || 0), 0) / completed.length).toFixed(1) : '0.0';
    const avgPbm = completed.length > 0 ? (completed.reduce((s, r) => s + (r.nilai || 0), 0) / completed.length).toFixed(1) : '0.0';
    
    return {
      total: current.length,
      done: completed.length,
      avgAdm,
      avgPbm
    };
  }, [records, activeSemester]);

  const exportPDF = () => {
    const element = document.getElementById('dashboard-export-area');
    const opt = { 
      margin: 10, 
      filename: `Dashboard_Supervisi_${activeSemester}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'landscape' } 
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const exportExcel = () => {
    const currentRecords = records.filter(r => r.semester === activeSemester);
    let csv = "No,Nama Guru,Mata Pelajaran,Nilai Adm,Nilai PBM,Status\n";
    currentRecords.forEach((r, i) => {
      csv += `${i+1},"${r.namaGuru}","${r.mataPelajaran}",${r.nilaiAdm || 0},${r.nilai || 0},"${r.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Rekap_Dashboard_${activeSemester}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Ringkasan Eksekutif</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{settings.namaSekolah} • SEMESTER {activeSemester}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all hover:bg-red-700">Download PDF</button>
           <button onClick={exportExcel} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all hover:bg-emerald-700">Export Excel</button>
        </div>
      </div>

      <div id="dashboard-export-area" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Guru</p>
            <p className="text-3xl font-black text-slate-800">{stats.total}</p>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-4"><div className="h-full bg-slate-400 rounded-full" style={{width: '100%'}}></div></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selesai Supervisi</p>
            <p className="text-3xl font-black text-blue-600">{stats.done}</p>
            <div className="w-full h-1 bg-blue-50 rounded-full mt-4"><div className="h-full bg-blue-600 rounded-full" style={{width: `${(stats.done/stats.total)*100}%`}}></div></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rata-rata Nilai Adm</p>
            <p className="text-3xl font-black text-emerald-600">{stats.avgAdm}</p>
            <div className="w-full h-1 bg-emerald-50 rounded-full mt-4"><div className="h-full bg-emerald-600 rounded-full" style={{width: `${(parseFloat(stats.avgAdm)/100)*100}%`}}></div></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rata-rata Nilai PBM</p>
            <p className="text-3xl font-black text-orange-600">{stats.avgPbm}</p>
            <div className="w-full h-1 bg-orange-50 rounded-full mt-4"><div className="h-full bg-orange-600 rounded-full" style={{width: `${(parseFloat(stats.avgPbm)/100)*100}%`}}></div></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest text-center">
            Monitoring Progress Supervisi {settings.namaSekolah} - Tahun {settings.tahunPelajaran}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b">
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Nama Guru</th>
                  <th className="px-6 py-4">Mata Pelajaran</th>
                  <th className="px-6 py-4 text-center">Nilai Adm</th>
                  <th className="px-6 py-4 text-center">Nilai PBM</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {records.filter(r => r.semester === activeSemester).map((r, i) => (
                  <tr key={r.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-bold text-slate-400">{i + 1}</td>
                    <td className="px-6 py-3 font-black text-slate-800 uppercase tracking-tight">{r.namaGuru}</td>
                    <td className="px-6 py-3 italic text-slate-500 font-medium">{r.mataPelajaran}</td>
                    <td className="px-6 py-3 text-center font-black text-emerald-600">{r.nilaiAdm || '-'}</td>
                    <td className="px-6 py-3 text-center font-black text-orange-600">{r.nilai || '-'}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${r.status === SupervisionStatus.COMPLETED ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardView;
