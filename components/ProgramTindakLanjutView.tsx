
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  setSettings: (s: AppSettings) => void;
}

const getPredikat = (nilai: number) => {
  if (nilai >= 91) return { p: 'A', label: '91 - 100', color: 'text-emerald-700' };
  if (nilai >= 75) return { p: 'B', label: '75 - 90', color: 'text-blue-700' };
  if (nilai >= 55) return { p: 'C', label: '55 - 74', color: 'text-amber-700' };
  return { p: 'D', label: '< 55', color: 'text-red-700' };
};

const getAutoProgramText = (nilai: number) => {
  if (nilai >= 91) return { ha: "Kinerja unggul, konsistensi tinggi dalam PBM.", rtl: "Pertahankan kinerja dan bagikan praktik baik (mentorship)." };
  if (nilai >= 75) return { ha: "Kinerja baik, dokumen lengkap namun media perlu inovasi.", rtl: "Workshop pembuatan media pembelajaran berbasis digital." };
  if (nilai >= 55) return { ha: "Kinerja cukup, pemahaman kurikulum masih terbatas.", rtl: "Supervisi klinis rutin dan pendampingan oleh guru senior." };
  return { ha: "Kinerja kurang, administrasi dan PBM butuh perbaikan total.", rtl: "Pelatihan intensif (In House Training) dan evaluasi bulanan." };
};

const ProgramTindakLanjutView: React.FC<Props> = ({ settings, records, setSettings }) => {
  const activeSemester = settings.semester;

  const data = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .map(r => {
        const scores = [r.nilaiAdm || 0, r.nilaiATP || 0, r.nilaiModul || 0, r.nilai || 0, r.nilaiPenilaian || 0];
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
        const pred = getPredikat(avg);
        const auto = getAutoProgramText(avg);
        return { ...r, avg, pred, ...auto };
      });
  }, [records, activeSemester]);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold uppercase">Program Tindak Lanjut</h2>
        <div className="flex gap-2">
           <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Ganjil</button>
           <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Genap</button>
        </div>
      </div>

      <div id="program-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-bold">Program Tindak Lanjut Hasil Supervisi Akademik</h1>
          <h2 className="text-md font-bold">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <table className="w-full border-collapse text-[9px] border border-slate-800 mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center font-bold">
              <th className="border border-slate-800 p-2 w-8">No</th>
              <th className="border border-slate-800 p-2 text-left">Nama</th>
              <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
              <th className="border border-slate-800 p-2 w-16">Nilai</th>
              <th className="border border-slate-800 p-2 w-16">Predikat</th>
              <th className="border border-slate-800 p-2 text-left">Hasil Analisis</th>
              <th className="border border-slate-800 p-2 text-left">Rencana Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="border border-slate-800 p-2 text-center font-bold">{i + 1}</td>
                <td className="border border-slate-800 p-2 font-bold uppercase">{d.namaGuru}</td>
                <td className="border border-slate-800 p-2 italic">{d.mataPelajaran}</td>
                <td className="border border-slate-800 p-2 text-center font-black">{d.avg}</td>
                <td className={`border border-slate-800 p-2 text-center font-black text-lg ${d.pred.color}`}>{d.pred.p}</td>
                <td className="border border-slate-800 p-2 italic">{d.ha}</td>
                <td className="border border-slate-800 p-2 font-medium">{d.rtl}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 p-4 border rounded-xl bg-slate-50 max-w-xs">
          <h4 className="text-[10px] font-black uppercase mb-2 border-b">Tabel Predikat</h4>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between font-bold"><span>A</span><span>91 - 100</span></div>
            <div className="flex justify-between font-bold"><span>B</span><span>75 - 90</span></div>
            <div className="flex justify-between font-bold"><span>C</span><span>55 - 74</span></div>
            <div className="flex justify-between font-bold"><span>D</span><span>&lt; 55</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramTindakLanjutView;
