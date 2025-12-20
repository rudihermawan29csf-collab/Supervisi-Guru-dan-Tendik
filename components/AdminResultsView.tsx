
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings } from '../types';

interface Props {
  records: TeacherRecord[];
  settings: AppSettings;
  onUpdate: (records: TeacherRecord[]) => void;
  onRefresh: () => void;
  setSettings: (settings: AppSettings) => void;
}

const formatIndonesianDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const AdminResultsView: React.FC<Props> = ({ records, settings, onUpdate, onRefresh, setSettings }) => {
  const activeSemester = settings.semester;
  
  const filteredRecords = useMemo(() => {
    return records.filter(r => r.semester === activeSemester);
  }, [records, activeSemester]);

  const handleUpdateField = (id: number, field: 'tindakLanjut' | 'realisasi' | 'saran' | 'catatan', value: string) => {
    const updated = records.map(r => r.id === id ? { ...r, [field]: value } : r);
    onUpdate(updated);
  };

  const exportPDF = () => {
    const element = document.getElementById('admin-results-export');
    const opt = { margin: 10, filename: `Hasil_Supervisi_Administrasi_${activeSemester}.pdf`, jsPDF: { orientation: 'landscape' } };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const exportExcel = () => {
    const tableElement = document.getElementById('admin-results-table-real');
    if (!tableElement) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid windowtext; padding: 5px; }</style></head><body>`;
    const tableHtml = tableElement.outerHTML;
    const footer = `</body></html>`;
    const blob = new Blob([header + tableHtml + footer], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Hasil_Supervisi_Administrasi_${activeSemester}.xls`;
    link.click();
  };

  const exportWord = () => {
    const html = document.getElementById('admin-results-export')?.innerHTML;
    const blob = new Blob(['\ufeff', html || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Hasil_Supervisi_Administrasi_${activeSemester}.doc`;
    link.click();
  };

  const handleSave = () => {
    onUpdate([...records]);
    alert('Data hasil administrasi berhasil disimpan!');
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print px-2">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-bold text-slate-800">Hasil Supervisi Administrasi</h2>
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Ganjil' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Semester 1</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Genap' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Semester 2</button>
           </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onRefresh} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-lg flex items-center transition-all hover:bg-indigo-700">
             <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
             Refresh Data
          </button>
          <button onClick={handleSave} className="px-5 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-lg transition-all hover:bg-blue-700">Simpan</button>
          <button onClick={exportPDF} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">PDF</button>
          <button onClick={exportWord} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-bold text-[9px] uppercase shadow">Word</button>
          <button onClick={exportExcel} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">Excel</button>
        </div>
      </div>

      <div id="admin-results-export" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4">
          <h1 className="text-lg font-bold uppercase">Hasil Supervisi Administrasi Guru</h1>
          <h2 className="text-md font-bold uppercase">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic uppercase">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester === 'Ganjil' ? '1 (Ganjil)' : '2 (Genap)'}</p>
        </div>

        <table id="admin-results-table-real" className="w-full border-collapse text-[10px] table-auto border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white font-bold text-center uppercase">
              <th className="px-1 py-3 border border-slate-800 w-8">No</th>
              <th className="px-3 py-3 border border-slate-800 text-left">Nama Guru</th>
              <th className="px-3 py-3 border border-slate-800 text-left">Mata Pelajaran</th>
              <th className="px-2 py-3 border border-slate-800 w-16">Hasil Skor</th>
              <th className="px-3 py-3 border border-slate-800 text-left">Catatan Khusus</th>
              <th className="px-3 py-3 border border-slate-800 text-left">Tindak Lanjut</th>
              <th className="px-3 py-3 border border-slate-800 text-left">Realisasi Tindak Lanjut</th>
              <th className="px-3 py-3 border border-slate-800 text-left">Saran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((r, i) => (
              <tr key={r.id} className="align-top hover:bg-slate-50">
                <td className="px-1 py-3 border border-slate-800 text-center font-bold text-slate-400">{i + 1}</td>
                <td className="px-3 py-3 border border-slate-800 font-bold text-slate-900 uppercase">{r.namaGuru}</td>
                <td className="px-3 py-3 border border-slate-800 italic text-indigo-700">{r.mataPelajaran}</td>
                <td className="px-2 py-3 border border-slate-800 text-center font-black text-blue-600 bg-blue-50/30">{r.nilaiAdm || '-'}</td>
                <td className="px-3 py-1 border border-slate-800">
                  <textarea value={r.catatan || ''} onChange={e => handleUpdateField(r.id, 'catatan', e.target.value)} className="w-full bg-transparent outline-none text-[9px] min-h-[40px] no-print py-1" placeholder="..." />
                  <div className="hidden print:block text-[9px]">{r.catatan || '-'}</div>
                </td>
                <td className="px-3 py-1 border border-slate-800">
                  <textarea value={r.tindakLanjut || ''} onChange={e => handleUpdateField(r.id, 'tindakLanjut', e.target.value)} className="w-full bg-transparent outline-none text-[9px] min-h-[40px] no-print py-1" placeholder="..." />
                  <div className="hidden print:block text-[9px]">{r.tindakLanjut || '-'}</div>
                </td>
                <td className="px-3 py-1 border border-slate-800">
                  <textarea value={r.realisasi || ''} onChange={e => handleUpdateField(r.id, 'realisasi', e.target.value)} className="w-full bg-transparent outline-none text-[9px] min-h-[40px] no-print py-1" placeholder="..." />
                  <div className="hidden print:block text-[9px]">{r.realisasi || '-'}</div>
                </td>
                <td className="px-3 py-1 border border-slate-800">
                  <textarea value={r.saran || ''} onChange={e => handleUpdateField(r.id, 'saran', e.target.value)} className="w-full bg-transparent outline-none text-[9px] min-h-[40px] no-print py-1" placeholder="..." />
                  <div className="hidden print:block text-[9px]">{r.saran || '-'}</div>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400 italic border border-slate-800">Belum ada data tersedia.</td></tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between items-start text-xs font-bold uppercase tracking-tighter">
          <div className="text-center w-64">
             <p className="mb-20">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20">Mojokerto, {formatIndonesianDate(settings.tanggalCetak)}<br/>Supervisor</p>
             <p className="font-black underline uppercase tracking-widest">................................................</p>
             <p className="text-[10px] italic">NIP. ................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResultsView;
