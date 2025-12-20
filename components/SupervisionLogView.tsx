
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings, InstrumentResult } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  setSettings: (s: AppSettings) => void;
}

const getLogText = (val: number, type: 'persiapan' | 'pelaksanaan' | 'hasil') => {
  if (type === 'persiapan') {
    if (val >= 7) return "Perangkat lengkap dan sesuai CP.";
    if (val >= 5) return "Perangkat cukup lengkap, revisi sedikit.";
    return "Perangkat belum lengkap.";
  }
  if (type === 'pelaksanaan') {
    if (val >= 7) return "Pembelajaran sangat interaktif & inovatif.";
    if (val >= 5) return "Pembelajaran cukup lancar, manajemen kelas baik.";
    return "Metode pembelajaran perlu variasi.";
  }
  if (val >= 18) return "Tujuan pembelajaran tercapai dengan sangat baik.";
  if (val >= 14) return "Hasil pembelajaran memadai, target terpenuhi.";
  return "Hasil perlu tindak lanjut intensif.";
};

const SupervisionLogView: React.FC<Props> = ({ settings, records, instrumentResults, setSettings }) => {
  const activeSemester = settings.semester;

  const logData = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .map((teacher, idx) => {
        const key = `${teacher.id}-pembelajaran-${activeSemester}`;
        const result = instrumentResults[key];
        
        let pScore = 0; let lScore = 0; let eScore = 0;
        if (result && result.scores) {
          const s = result.scores as Record<number, number>;
          pScore = (s[0] || 0) + (s[1] || 0) + (s[3] || 0) + (s[4] || 0);
          lScore = (s[7] || 0) + (s[9] || 0) + (s[21] || 0) + (s[28] || 0);
          eScore = (s[30] || 0) + (s[32] || 0) + (s[35] || 0);
        }

        return {
          ...teacher,
          persiapanLog: getLogText(pScore, 'persiapan'),
          pelaksanaanLog: getLogText(lScore, 'pelaksanaan'),
          hasilLog: getLogText(pScore + lScore + eScore, 'hasil')
        };
      });
  }, [records, activeSemester, instrumentResults]);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold uppercase">Catatan Pelaksanaan Supervisi</h2>
        <div className="flex gap-2">
           <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Ganjil</button>
           <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Genap</button>
           <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold text-[9px] uppercase">Cetak Catatan</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8 print:p-0">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-bold">Catatan Supervisi Pembelajaran</h1>
          <h2 className="text-md font-bold">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic">Tahun Pelajaran {settings.tahunPelajaran}</p>
        </div>

        <table className="w-full border-collapse text-[9px] border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center">
              <th className="border border-slate-800 p-2 w-8">No</th>
              <th className="border border-slate-800 p-2 text-left">Nama Guru</th>
              <th className="border border-slate-800 p-2">Hari / Tanggal</th>
              <th className="border border-slate-800 p-2">Jam Ke</th>
              <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
              <th className="border border-slate-800 p-2 text-left">Persiapan</th>
              <th className="border border-slate-800 p-2 text-left">Pelaksanaan</th>
              <th className="border border-slate-800 p-2 text-left">Hasil</th>
            </tr>
          </thead>
          <tbody>
            {logData.map((d, i) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="border border-slate-800 p-2 text-center">{i + 1}</td>
                <td className="border border-slate-800 p-2 font-bold uppercase">{d.namaGuru}</td>
                <td className="border border-slate-800 p-2 text-center">{d.hari}, {d.tanggal}</td>
                <td className="border border-slate-800 p-2 text-center">{d.jamKe}</td>
                <td className="border border-slate-800 p-2 italic">{d.mataPelajaran}</td>
                <td className="border border-slate-800 p-2">{d.persiapanLog}</td>
                <td className="border border-slate-800 p-2">{d.pelaksanaanLog}</td>
                <td className="border border-slate-800 p-2 font-medium text-blue-700">{d.hasilLog}</td>
              </tr>
            ))}
            {logData.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center italic text-slate-400 border border-slate-800">Jurnal pelaksanaan supervisi masih kosong.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupervisionLogView;
