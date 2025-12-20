
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings } from '../types';

interface Props {
  title: string;
  type: string;
  scoreKey: keyof TeacherRecord;
  maxScore: number;
  records: TeacherRecord[];
  settings: AppSettings;
  onUpdate: (records: TeacherRecord[]) => void;
  onRefresh: () => void;
  setSettings: (settings: AppSettings) => void;
}

const getAutoResults = (score: number) => {
  if (score >= 91) return {
    c: "Sangat Baik, dokumen lengkap.",
    tl: "Pertahankan konsistensi.",
    r: "Berlanjut di semester depan.",
    s: "Menjadi model bagi guru lain."
  };
  if (score >= 81) return {
    c: "Baik, perlu pengembangan media.",
    tl: "Workshop pembuatan media.",
    r: "Dilaksanakan 1 kali.",
    s: "Gunakan aplikasi inovatif."
  };
  if (score >= 71) return {
    c: "Cukup, instrumen kurang variatif.",
    tl: "Diskusi di MGMP sekolah.",
    r: "Dalam proses perbaikan.",
    s: "Lengkapi perangkat modul."
  };
  return {
    c: "Kurang, butuh pembinaan.",
    tl: "Supervisi klinis mandiri.",
    r: "Revisi total dokumen.",
    s: "Ikuti diklat pedagogik."
  };
};

const GenericResultsView: React.FC<Props> = ({ title, scoreKey, records, settings, onUpdate, setSettings }) => {
  const activeSemester = settings.semester;
  
  const filteredRecords = useMemo(() => {
    return records.filter(r => r.semester === activeSemester).map(r => {
      const score = Number(r[scoreKey]) || 0;
      const auto = getAutoResults(score);
      return { ...r, catatan: auto.c, tindakLanjut: auto.tl, realisasi: auto.r, saran: auto.s };
    });
  }, [records, activeSemester, scoreKey]);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-2">
           <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Ganjil</button>
           <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Genap</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <table className="w-full border-collapse text-[9px] border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center">
              <th className="border border-slate-800 p-2 w-8">No</th>
              <th className="border border-slate-800 p-2 text-left">Nama Guru</th>
              <th className="border border-slate-800 p-2 w-10">Skor</th>
              <th className="border border-slate-800 p-2 text-left">Catatan</th>
              <th className="border border-slate-800 p-2 text-left">Tindak Lanjut</th>
              <th className="border border-slate-800 p-2 text-left">Realisasi</th>
              <th className="border border-slate-800 p-2 text-left">Saran</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r, i) => (
              <tr key={r.id}>
                <td className="border border-slate-800 p-2 text-center">{i + 1}</td>
                <td className="border border-slate-800 p-2 font-bold uppercase">{r.namaGuru}</td>
                <td className="border border-slate-800 p-2 text-center font-black text-blue-600">{Number(r[scoreKey]) || '-'}</td>
                <td className="border border-slate-800 p-2 italic">{r.catatan}</td>
                <td className="border border-slate-800 p-2 italic">{r.tindakLanjut}</td>
                <td className="border border-slate-800 p-2 italic">{r.realisasi}</td>
                <td className="border border-slate-800 p-2 italic">{r.saran}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericResultsView;
