
import React, { useMemo } from 'react';
import { AppSettings, AdminRecord, InstrumentResult } from '../types';

interface Props {
  adminRecords: AdminRecord[];
  settings: AppSettings;
  instrumentResults: Record<string, InstrumentResult>;
  setSettings: (s: AppSettings) => void;
}

const TendikResultsView: React.FC<Props> = ({ adminRecords, settings, instrumentResults, setSettings }) => {
  const activeSemester = settings.semester;

  const categories = [
    { label: 'Administrasi Sekolah', id: 'sekolah' },
    { label: 'Administrasi Ketenagaan', id: 'ketenagaan' },
    { label: 'Administrasi Perlengkapan', id: 'perlengkapan' },
    { label: 'Administrasi Perpustakaan', id: 'perpustakaan' },
    { label: 'Laboratorium IPA', id: 'lab-ipa' },
    { label: 'Laboratorium Komputer', id: 'lab-komputer' },
    { label: 'Administrasi Kesiswaan', id: 'kesiswaan' },
  ];

  const getAutoFollowUp = (score: number) => {
    if (score >= 90) return {
      catatan: "Kinerja sangat memuaskan, semua aspek terpenuhi dengan baik.",
      tindakLanjut: "Mempertahankan kualitas administrasi yang ada.",
      realisasi: "Dilaksanakan secara berkelanjutan.",
      saran: "Terus lakukan inovasi digital dalam pengarsipan."
    };
    if (score >= 80) return {
      catatan: "Kinerja baik, sebagian besar aspek terpenuhi.",
      tindakLanjut: "Melengkapi beberapa detail kecil yang terlewat.",
      realisasi: "Diberikan tenggat waktu 1 minggu perbaikan.",
      saran: "Tingkatkan ketelitian dalam pencatatan berkala."
    };
    if (score >= 70) return {
      catatan: "Kinerja cukup, banyak aspek yang perlu ditingkatkan.",
      tindakLanjut: "Pendampingan khusus dalam penataan administrasi.",
      realisasi: "Evaluasi ulang dalam 1 bulan ke depan.",
      saran: "Lakukan studi banding atau pelatihan internal."
    };
    return {
      catatan: "Kinerja kurang, memerlukan pembinaan intensif.",
      tindakLanjut: "Pembinaan langsung oleh Kepala Sekolah.",
      realisasi: "Perbaikan total administrasi dalam 2 minggu.",
      saran: "Fokus pada pemenuhan standar minimal administrasi."
    };
  };

  const resultsData = useMemo(() => {
    return categories.map((cat, idx) => {
      // Find matching schedule record
      const schedule = adminRecords.find(r => 
        r.semester === activeSemester && 
        (r.kegiatan.toLowerCase().includes(cat.label.toLowerCase()) || 
         r.kegiatan.toLowerCase().includes(cat.id.toLowerCase()))
      );

      // Get score from instrument results
      const resKey = `tendik-${cat.id}-${activeSemester}`;
      const result = instrumentResults[resKey];
      
      let avgScore = 0;
      if (result && result.scores) {
        const vals = Object.values(result.scores).map(v => parseFloat(v as string)).filter(v => !isNaN(v));
        if (vals.length > 0) avgScore = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
      }

      const auto = getAutoFollowUp(avgScore * 100); // Scale to 100 for logic if needed, or assume avg 0-100

      return {
        no: idx + 1,
        instrumen: cat.label,
        hariTgl: schedule ? `${schedule.hari}, ${schedule.tgl}` : '-',
        pembina: schedule ? schedule.nama : '-',
        skor: avgScore || '-',
        ...auto
      };
    });
  }, [adminRecords, activeSemester, instrumentResults]);

  const exportPDF = () => {
    const element = document.getElementById('tendik-results-export-area');
    // @ts-ignore
    html2pdf().from(element).save(`Hasil_Supervisi_Tendik_${activeSemester}.pdf`);
  };

  const exportExcel = () => {
    const table = document.getElementById('tendik-results-table-real');
    if (!table) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid black; padding: 5px; font-size: 9pt; }</style></head><body>`;
    const tableHtml = table.outerHTML;
    const blob = new Blob([header + tableHtml + '</body></html>'], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Hasil_Supervisi_Tendik_${activeSemester}.xls`;
    link.click();
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print px-2">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-bold text-slate-800">Hasil Supervisi Tendik Terpadu</h2>
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Ganjil' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Genap' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Genap</button>
           </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">PDF</button>
          <button onClick={exportExcel} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">Excel</button>
        </div>
      </div>

      <div id="tendik-results-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-bold">Hasil Supervisi Tenaga Kependidikan</h1>
          <h2 className="text-md font-bold">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <table id="tendik-results-table-real" className="w-full border-collapse text-[9px] table-auto border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white font-bold text-center uppercase">
              <th className="px-1 py-3 border border-slate-800 w-8">No</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Hari/Tanggal</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Instrumen</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Petugas/Pembina</th>
              <th className="px-1 py-3 border border-slate-800 w-14">Hasil Skor</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Catatan Khusus</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Tindak Lanjut</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Realisasi Tindak Lanjut</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Saran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resultsData.map((row) => (
              <tr key={row.no} className="align-top hover:bg-slate-50">
                <td className="px-1 py-3 border border-slate-800 text-center font-bold">{row.no}</td>
                <td className="px-2 py-3 border border-slate-800 font-medium">{row.hariTgl}</td>
                <td className="px-2 py-3 border border-slate-800 font-bold uppercase">{row.instrumen}</td>
                <td className="px-2 py-3 border border-slate-800 italic">{row.pembina}</td>
                <td className="px-1 py-3 border border-slate-800 text-center font-black text-blue-700 bg-blue-50/20">{row.skor}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.catatan}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.tindakLanjut}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.realisasi}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.saran}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between items-start text-xs font-bold uppercase tracking-tighter">
          <div className="text-center w-64">
             <p className="mb-20 uppercase font-medium">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20 font-medium uppercase">Mojokerto, .....................<br/>Supervisor</p>
             <p className="font-black underline uppercase tracking-widest">................................................</p>
             <p className="text-[10px] italic">NIP. ................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TendikResultsView;
