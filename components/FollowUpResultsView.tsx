
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings, SupervisionStatus } from '../types';

interface Props {
  records: TeacherRecord[];
  settings: AppSettings;
  onUpdate: (records: TeacherRecord[]) => void;
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

const FollowUpResultsView: React.FC<Props> = ({ records, settings, onUpdate }) => {
  const activeSemester = settings.semester;
  const filteredRecords = useMemo(() => {
    return records.filter(r => r.semester === activeSemester);
  }, [records, activeSemester]);

  const handleUpdateField = (id: number, field: 'tindakLanjut' | 'realisasi', value: string) => {
    const updated = records.map(r => r.id === id ? { ...r, [field]: value } : r);
    onUpdate(updated);
  };

  const exportPDF = () => {
    const element = document.getElementById('follow-up-export');
    const opt = { margin: 10, filename: `Tindak_Lanjut_Supervisi_${activeSemester}.pdf`, jsPDF: { orientation: 'landscape' } };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const exportExcel = () => {
    const tableElement = document.getElementById('follow-up-table-real');
    if (!tableElement) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid windowtext; padding: 5px; }</style></head><body>`;
    const tableHtml = tableElement.outerHTML;
    const footer = `</body></html>`;
    const blob = new Blob([header + tableHtml + footer], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Tindak_Lanjut_${activeSemester}.xls`;
    link.click();
  };

  const exportWord = () => {
    const html = document.getElementById('follow-up-export')?.innerHTML;
    const blob = new Blob(['\ufeff', html || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Tindak_Lanjut_${activeSemester}.doc`;
    link.click();
  };

  const handleSave = () => {
    onUpdate([...records]);
    alert('Data tindak lanjut berhasil disimpan secara permanen!');
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print px-2">
        <h2 className="text-xl font-bold text-slate-800">Tindak Lanjut Supervisi</h2>
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-lg transition-all hover:bg-indigo-700">Simpan Perubahan</button>
          <button onClick={exportPDF} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">PDF</button>
          <button onClick={exportWord} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-bold text-[9px] uppercase shadow">Word</button>
          <button onClick={exportExcel} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">Excel (.xls)</button>
        </div>
      </div>

      <div id="follow-up-export" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4">
          <h1 className="text-lg font-bold uppercase">Instrumen Tindak Lanjut Hasil Supervisi Akademik</h1>
          <h2 className="text-md font-bold uppercase">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic uppercase">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <table id="follow-up-table-real" className="w-full border-collapse text-[11px] table-auto border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white font-bold text-center">
              <th className="px-2 py-3 border border-slate-800 w-10">No</th>
              <th className="px-4 py-3 border border-slate-800 text-left">Nama Guru</th>
              <th className="px-4 py-3 border border-slate-800 text-left">Mapel</th>
              <th className="px-2 py-3 border border-slate-800 w-20">Kelas</th>
              <th className="px-2 py-3 border border-slate-800 w-16">Skor</th>
              <th className="px-4 py-3 border border-slate-800 text-left">Tindak Lanjut</th>
              <th className="px-4 py-3 border border-slate-800 text-left">Realisasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((r, i) => (
              <tr key={r.id} className="align-top">
                <td className="px-2 py-3 border border-slate-800 text-center font-bold">{i + 1}</td>
                <td className="px-4 py-3 border border-slate-800 font-bold">{r.namaGuru}</td>
                <td className="px-4 py-3 border border-slate-800 italic">{r.mataPelajaran}</td>
                <td className="px-2 py-3 border border-slate-800 text-center">{r.kelas || '-'}</td>
                <td className="px-2 py-3 border border-slate-800 text-center font-bold text-blue-600">{r.nilai || '-'}</td>
                <td className="px-4 py-1 border border-slate-800">
                  <textarea value={r.tindakLanjut || ''} onChange={e => handleUpdateField(r.id, 'tindakLanjut', e.target.value)} className="w-full bg-transparent outline-none text-[10px] italic min-h-[40px] no-print" placeholder="..." />
                  <div className="hidden print:block text-[10px] italic">{r.tindakLanjut || '-'}</div>
                </td>
                <td className="px-4 py-1 border border-slate-800">
                  <textarea value={r.realisasi || ''} onChange={e => handleUpdateField(r.id, 'realisasi', e.target.value)} className="w-full bg-transparent outline-none text-[10px] italic min-h-[40px] no-print" placeholder="..." />
                  <div className="hidden print:block text-[10px] italic">{r.realisasi || '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between items-start text-xs font-bold uppercase">
          <div className="text-center w-64">
             <p className="mb-20">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-bold underline">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px]">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20">Mojokerto, {formatIndonesianDate(settings.tanggalCetak)}<br/>Supervisor</p>
             <p className="font-bold underline">................................................</p>
             <p className="text-[10px] italic">NIP. ................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpResultsView;
