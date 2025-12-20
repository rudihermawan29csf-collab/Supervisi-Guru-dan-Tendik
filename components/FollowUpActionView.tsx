
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings, InstrumentResult } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  setSettings: (s: AppSettings) => void;
  instrumentResults: Record<string, InstrumentResult>;
  onSaveAction: (teacherId: number, actions: any) => void;
}

const FollowUpActionView: React.FC<Props> = ({ settings, records, setSettings, instrumentResults, onSaveAction }) => {
  const activeSemester = settings.semester;

  const data = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .map(r => {
        const scores = [r.nilaiAdm || 0, r.nilaiATP || 0, r.nilaiModul || 0, r.nilai || 0, r.nilaiPenilaian || 0];
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
        
        const key = `${r.id}-followup-actions-${activeSemester}`;
        const savedActions = instrumentResults[key]?.actions || {
          contoh: false,
          tanyaJawab: false,
          diskusi: false,
          konsultasi: false,
          pelatihan: false
        };

        let rtl = "Pendampingan penyusunan modul ajar.";
        if (avg < 70) rtl = "Bimbingan teknis dan pelatihan pedagogik.";
        else if (avg < 80) rtl = "Diskusi sejawat mengenai asesmen.";

        return { ...r, avg, rtl, actions: savedActions };
      })
      .filter(r => r.avg < 83);
  }, [records, activeSemester, instrumentResults]);

  const handleToggle = (teacherId: number, field: string) => {
    const current = data.find(d => d.id === teacherId)?.actions || {};
    const updated = { ...current, [field]: !current[field as keyof typeof current] };
    onSaveAction(teacherId, updated);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold uppercase">Tindak Lanjut Action (Skor &lt; 83)</h2>
        <div className="flex gap-2">
           <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Ganjil</button>
           <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Genap</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 overflow-x-auto">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-bold">Hasil Tindak Lanjut Supervisi Akademik</h1>
          <h2 className="text-md font-bold">{settings.namaSekolah}</h2>
        </div>

        <table className="w-full border-collapse text-[9px] border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center font-bold">
              <th className="border border-slate-800 p-2 w-8">No</th>
              <th className="border border-slate-800 p-2 text-left">Nama</th>
              <th className="border border-slate-800 p-2 text-left">Rencana Tindak Lanjut</th>
              <th className="border border-slate-800 p-1 w-16">Pemberian Contoh</th>
              <th className="border border-slate-800 p-1 w-16">Tanya Jawab</th>
              <th className="border border-slate-800 p-1 w-16">Diskusi</th>
              <th className="border border-slate-800 p-1 w-16">Konsultasi</th>
              <th className="border border-slate-800 p-1 w-16">Pelatihan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="border border-slate-800 p-2 text-center font-bold">{i + 1}</td>
                <td className="border border-slate-800 p-2 font-bold uppercase">{d.namaGuru} <span className="text-red-500 ml-1">({d.avg})</span></td>
                <td className="border border-slate-800 p-2 italic">{d.rtl}</td>
                <td className="border border-slate-800 p-1 text-center">
                  <input type="checkbox" checked={d.actions.contoh} onChange={() => handleToggle(d.id, 'contoh')} className="w-4 h-4" />
                </td>
                <td className="border border-slate-800 p-1 text-center">
                  <input type="checkbox" checked={d.actions.tanyaJawab} onChange={() => handleToggle(d.id, 'tanyaJawab')} className="w-4 h-4" />
                </td>
                <td className="border border-slate-800 p-1 text-center">
                  <input type="checkbox" checked={d.actions.diskusi} onChange={() => handleToggle(d.id, 'diskusi')} className="w-4 h-4" />
                </td>
                <td className="border border-slate-800 p-1 text-center">
                  <input type="checkbox" checked={d.actions.konsultasi} onChange={() => handleToggle(d.id, 'konsultasi')} className="w-4 h-4" />
                </td>
                <td className="border border-slate-800 p-1 text-center">
                  <input type="checkbox" checked={d.actions.pelatihan} onChange={() => handleToggle(d.id, 'pelatihan')} className="w-4 h-4" />
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center italic text-slate-400 border border-slate-800 uppercase">Tidak ada guru dengan skor di bawah 83.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowUpActionView;
