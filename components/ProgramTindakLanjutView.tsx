
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  setSettings: (s: AppSettings) => void;
}

const getPredikat = (nilai: number) => {
  if (nilai >= 91) return { p: 'A', label: '91 - 100', color: 'text-emerald-700', bg: 'bg-emerald-50/30' };
  if (nilai >= 75) return { p: 'B', label: '75 - 90', color: 'text-blue-700', bg: 'bg-blue-50/30' };
  if (nilai >= 55) return { p: 'C', label: '55 - 74', color: 'text-amber-700', bg: 'bg-amber-50/30' };
  return { p: 'D', label: '< 55', color: 'text-red-700', bg: 'bg-red-50/30' };
};

const getAutoProgramText = (nilai: number) => {
  if (nilai >= 91) return { ha: "Kinerja unggul, standar kualitas terpenuhi sangat baik.", rtl: "Pertahankan kinerja dan berikan pengimbasan/mentoring sejawat." };
  if (nilai >= 75) return { ha: "Kinerja baik, dokumen lengkap namun media perlu variasi.", rtl: "Workshop internal pembuatan media interaktif digital." };
  if (nilai >= 55) return { ha: "Kinerja cukup, pemahaman implementasi kurikulum merdeka masih perlu dikuatkan.", rtl: "Supervisi klinis mandiri dan pendampingan oleh guru senior (teman sejawat)." };
  return { ha: "Kinerja kurang, administrasi dan proses belajar belum terarah.", rtl: "Pelatihan intensif khusus penyusunan perangkat ajar dan manajemen kelas." };
};

const ProgramTindakLanjutView: React.FC<Props> = ({ settings, records, setSettings }) => {
  const activeSemester = settings.semester;

  const data = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .map((r, i) => {
        const scores = [r.nilaiAdm || 0, r.nilaiATP || 0, r.nilaiModul || 0, r.nilai || 0, r.nilaiPenilaian || 0];
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
        const pred = getPredikat(avg);
        const auto = getAutoProgramText(avg);
        return { ...r, no: i + 1, avg, pred, ...auto };
      });
  }, [records, activeSemester]);

  const exportPDF = () => {
    const element = document.getElementById('ptl-export-area');
    // @ts-ignore
    html2pdf().from(element).save(`Program_Tindak_Lanjut_Guru_${activeSemester}.pdf`);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Program Tindak Lanjut Supervisi</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rencana Strategis Pasca Evaluasi</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
           </div>
           <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg ml-2">PDF</button>
        </div>
      </div>

      <div id="ptl-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 font-serif">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-black tracking-widest leading-none">PROGRAM TINDAK LANJUT HASIL SUPERVISI AKADEMIK</h1>
          <h2 className="text-md font-bold mt-1 uppercase">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic">TP {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <table className="w-full border-collapse text-[9px] border-2 border-slate-800 mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center font-black">
              <th className="border border-slate-800 p-2 w-8">No</th>
              <th className="border border-slate-800 p-2 text-left">Nama Lengkap</th>
              <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
              <th className="border border-slate-800 p-2 w-16">Nilai</th>
              <th className="border border-slate-800 p-2 w-16">Predikat</th>
              <th className="border border-slate-800 p-2 text-left">Hasil Analisis</th>
              <th className="border border-slate-800 p-2 text-left">Rencana Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-800 p-2 text-center font-bold text-slate-400">{d.no}</td>
                <td className="border border-slate-800 p-2 font-black uppercase text-slate-800 leading-tight">{d.namaGuru}</td>
                <td className="border border-slate-800 p-2 italic text-blue-800">{d.mataPelajaran}</td>
                <td className="border border-slate-800 p-2 text-center font-black text-sm">{d.avg}</td>
                <td className={`border border-slate-800 p-2 text-center font-black text-lg ${d.pred.color} ${d.pred.bg}`}>{d.pred.p}</td>
                <td className="border border-slate-800 p-2 italic leading-relaxed text-slate-600">{d.ha}</td>
                <td className="border border-slate-800 p-2 font-bold leading-relaxed text-slate-700 bg-slate-50/30">{d.rtl}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-10">
           <div className="p-4 border-2 border-slate-800 bg-slate-50">
             <h4 className="text-[10px] font-black uppercase mb-2 border-b-2 border-slate-800 pb-1">KRITERIA PREDIKAT</h4>
             <div className="space-y-1 text-[10px] font-bold">
               <div className="flex justify-between text-emerald-700"><span>PREDIKAT A (SANGAT BAIK)</span><span>91 - 100</span></div>
               <div className="flex justify-between text-blue-700"><span>PREDIKAT B (BAIK)</span><span>75 - 90</span></div>
               <div className="flex justify-between text-amber-700"><span>PREDIKAT C (CUKUP)</span><span>55 - 74</span></div>
               <div className="flex justify-between text-red-700"><span>PREDIKAT D (KURANG)</span><span>&lt; 55</span></div>
             </div>
           </div>
           
           <div className="grid grid-cols-2 text-[11px] font-bold text-center">
              <div>
                 <p className="mb-16">Mengetahui,<br/>Kepala Sekolah</p>
                 <p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p>
                 <p className="text-[9px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
              </div>
              <div>
                 <p className="mb-16">Mojokerto, {settings.tanggalCetak}<br/>Supervisor</p>
                 <p className="underline uppercase font-black">......................................</p>
                 <p className="text-[9px] font-mono">NIP. ......................................</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramTindakLanjutView;
