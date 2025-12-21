
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings, InstrumentResult } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  setSettings: (s: AppSettings) => void;
}

const getLogPersiapanText = (score: number) => {
  if (score >= 12) return "Perangkat pendahuluan sangat lengkap, motivasi dan apersepsi sinkron dengan CP.";
  if (score >= 8) return "Perangkat pendahuluan memadai, tujuan pembelajaran sudah disampaikan.";
  return "Perangkat pendahuluan kurang lengkap, perlu penguatan pada aspek motivasi siswa.";
};

const getLogPelaksanaanText = (score: number) => {
  if (score >= 40) return "Sangat inovatif, manajemen kelas prima, interaksi 4C (Abad 21) terlihat nyata.";
  if (score >= 30) return "Langkah pembelajaran runut, penguasaan materi baik, media digunakan secara relevan.";
  return "Cenderung konvensional (ceramah), partisipasi aktif siswa masih perlu didorong.";
};

const getLogHasilText = (totalScore: number) => {
  if (totalScore >= 70) return "Target kompetensi tercapai optimal. Siswa sangat antusias dan mandiri.";
  if (totalScore >= 55) return "Target kompetensi tercapai. Perlu penguatan pada asesmen formatif.";
  return "Capaian belum optimal. Direkomendasikan untuk bimbingan teknis modul ajar.";
};

const SupervisionLogView: React.FC<Props> = ({ settings, records, instrumentResults, setSettings }) => {
  const activeSemester = settings.semester;

  const logData = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .map((teacher) => {
        const key = `${teacher.id}-pembelajaran-${activeSemester}`;
        const result = instrumentResults[key];
        
        let pScore = 0; let lScore = 0; let eScore = 0;
        if (result && result.scores) {
          const s = result.scores as Record<number, number>;
          for(let i=1; i<=7; i++) pScore += (s[i] || 0);
          for(let i=8; i<=30; i++) lScore += (s[i] || 0);
          for(let i=31; i<=38; i++) eScore += (s[i] || 0);
        }

        return {
          ...teacher,
          persiapanLog: getLogPersiapanText(pScore),
          pelaksanaanLog: getLogPelaksanaanText(lScore),
          hasilLog: getLogHasilText(pScore + lScore + eScore)
        };
      });
  }, [records, activeSemester, instrumentResults]);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Catatan Pelaksanaan Supervisi</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jurnal Evaluasi Naratif Performa Guru</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
           </div>
           <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg ml-2">Cetak Laporan</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-10 font-serif">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-black tracking-widest leading-none">CATATAN PELAKSANAAN SUPERVISI GURU</h1>
          <h2 className="text-md font-bold mt-1 uppercase">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic uppercase tracking-tight">TP {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <table className="w-full border-collapse text-[9px] border-2 border-slate-800">
          <thead>
            <tr className="bg-slate-50 text-slate-900 uppercase text-center font-black">
              <th className="border border-slate-800 p-2 w-8">No</th>
              <th className="border border-slate-800 p-2 text-left">Nama Guru</th>
              <th className="border border-slate-800 p-2">Hari / Tanggal</th>
              <th className="border border-slate-800 p-2 w-10">Jam</th>
              <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
              <th className="border border-slate-800 p-2 w-12">Kelas</th>
              <th className="border border-slate-800 p-2 text-left w-1/4">Evaluasi Persiapan</th>
              <th className="border border-slate-800 p-2 text-left w-1/4">Evaluasi Pelaksanaan</th>
              <th className="border border-slate-800 p-2 text-left">Hasil / Kesimpulan</th>
            </tr>
          </thead>
          <tbody>
            {logData.map((d, i) => (
              <tr key={d.id} className="hover:bg-slate-50 align-top">
                <td className="border border-slate-800 p-2 text-center font-bold text-slate-400">{i + 1}</td>
                <td className="border border-slate-800 p-2 font-black uppercase text-slate-800 leading-tight">{d.namaGuru}</td>
                <td className="border border-slate-800 p-2 text-center font-bold">{d.hari}, {d.tanggalPemb || d.tanggal}</td>
                <td className="border border-slate-800 p-2 text-center font-black text-slate-700">{d.jamKe || '-'}</td>
                <td className="border border-slate-800 p-2 italic text-indigo-700">{d.mataPelajaran}</td>
                <td className="border border-slate-800 p-2 text-center font-bold">{d.kelas}</td>
                <td className="border border-slate-800 p-2 italic leading-relaxed text-slate-600">{d.persiapanLog}</td>
                <td className="border border-slate-800 p-2 italic leading-relaxed text-slate-600">{d.pelaksanaanLog}</td>
                <td className="border border-slate-800 p-2 font-bold italic leading-relaxed text-blue-900 bg-blue-50/10">{d.hasilLog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupervisionLogView;
