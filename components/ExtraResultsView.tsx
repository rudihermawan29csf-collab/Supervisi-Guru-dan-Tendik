
import React, { useMemo } from 'react';
import { AppSettings, ExtraRecord, InstrumentResult } from '../types';

interface Props {
  extraRecords: ExtraRecord[];
  settings: AppSettings;
  instrumentResults: Record<string, InstrumentResult>;
  setSettings: (s: AppSettings) => void;
}

const ExtraResultsView: React.FC<Props> = ({ extraRecords, settings, instrumentResults, setSettings }) => {
  const activeSemester = settings.semester;

  const getAutoFollowUp = (score: number) => {
    if (score >= 90) return {
      catatan: "Kinerja sangat memuaskan, program terlaksana sesuai target.",
      tindakLanjut: "Mempertahankan kualitas pembimbingan.",
      realisasi: "Dilaksanakan setiap pertemuan rutin.",
      saran: "Tingkatkan partisipasi siswa dalam ajang lomba."
    };
    if (score >= 80) return {
      catatan: "Kinerja baik, administrasi dan pelaksanaan sejalan.",
      tindakLanjut: "Melengkapi beberapa dokumentasi kegiatan.",
      realisasi: "Perbaikan dilakukan dalam 2 pertemuan kedepan.",
      saran: "Fokus pada penguatan kreativitas peserta didik."
    };
    if (score >= 70) return {
      catatan: "Kinerja cukup, perlu perbaikan dalam manajemen lapangan.",
      tindakLanjut: "Pendampingan oleh koordinator ekstra.",
      realisasi: "Evaluasi bulanan diperketat.",
      saran: "Buat modul latihan yang lebih terstruktur."
    };
    return {
      catatan: "Kinerja kurang, memerlukan restrukturisasi program.",
      tindakLanjut: "Pembinaan khusus dari tim kesiswaan.",
      realisasi: "Revisi program kerja segera.",
      saran: "Tingkatkan frekuensi koordinasi dengan sekolah."
    };
  };

  const resultsData = useMemo(() => {
    return extraRecords
      .filter(r => r.semester === activeSemester)
      .map((r, idx) => {
        // Get score from instrument results
        const resKey = `extra-${r.id}-${activeSemester}`;
        const result = instrumentResults[resKey];
        
        let avgScore = 0;
        if (result && result.scores) {
          const vals = Object.values(result.scores).map(v => {
            if (v === 'B') return 3;
            if (v === 'C') return 2;
            if (v === 'K') return 1;
            if (v === 'T') return 0;
            if (v === 'YA') return 1;
            if (v === 'TIDAK') return 0;
            return 0;
          });
          
          if (vals.length > 0) {
            // Normalize to 100 scale approximately
            const maxPossible = 3 * 30; // 30 items, max 3 pts each for B/C/K/T (B=3)
            const sum = vals.reduce((a, b) => a + b, 0);
            avgScore = Math.round((sum / maxPossible) * 100);
          }
        }

        const auto = getAutoFollowUp(avgScore || 0);

        return {
          no: idx + 1,
          nama: r.nama,
          nip: r.nip,
          hariTgl: `${r.hari}, ${r.tgl}`,
          pukul: r.pukul,
          ekstra: r.ekstra,
          skor: avgScore || '-',
          ...auto
        };
      });
  }, [extraRecords, activeSemester, instrumentResults]);

  const exportPDF = () => {
    const element = document.getElementById('extra-results-export-area');
    // @ts-ignore
    html2pdf().from(element).save(`Hasil_Supervisi_Ekstra_${activeSemester}.pdf`);
  };

  const exportExcel = () => {
    const table = document.getElementById('extra-results-table-real');
    if (!table) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid black; padding: 5px; font-size: 9pt; }</style></head><body>`;
    const tableHtml = table.outerHTML;
    const blob = new Blob([header + tableHtml + '</body></html>'], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Hasil_Supervisi_Ekstra_${activeSemester}.xls`;
    link.click();
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print px-2">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-bold text-slate-800">Hasil Supervisi Ekstrakurikuler</h2>
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

      <div id="extra-results-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-bold">Hasil Supervisi Kegiatan Ekstrakurikuler</h1>
          <h2 className="text-md font-bold">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <table id="extra-results-table-real" className="w-full border-collapse text-[9px] table-auto border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white font-bold text-center uppercase">
              <th className="px-1 py-3 border border-slate-800 w-8">No</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Nama Pembina / Petugas</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Hari / Tanggal</th>
              <th className="px-2 py-3 border border-slate-800 text-center">Pukul</th>
              <th className="px-2 py-3 border border-slate-800 text-left">Ekstrakurikuler</th>
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
                <td className="px-2 py-3 border border-slate-800 font-bold">
                  <div>{row.nama}</div>
                  <div className="text-[8px] font-mono opacity-70">NIP. {row.nip}</div>
                </td>
                <td className="px-2 py-3 border border-slate-800 font-medium">{row.hariTgl}</td>
                <td className="px-2 py-3 border border-slate-800 text-center">{row.pukul}</td>
                <td className="px-2 py-3 border border-slate-800 italic font-medium">{row.ekstra}</td>
                <td className="px-1 py-3 border border-slate-800 text-center font-black text-indigo-700 bg-indigo-50/20">{row.skor}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.catatan}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.tindakLanjut}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.realisasi}</td>
                <td className="px-2 py-3 border border-slate-800 text-[8px]">{row.saran}</td>
              </tr>
            ))}
            {resultsData.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-400 italic font-medium border border-slate-800 uppercase">Data belum tersedia untuk semester ini.</td></tr>
            )}
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

export default ExtraResultsView;
