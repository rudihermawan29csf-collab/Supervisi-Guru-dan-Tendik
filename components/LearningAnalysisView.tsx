
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings, InstrumentResult } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  setSettings: (s: AppSettings) => void;
}

const LearningAnalysisView: React.FC<Props> = ({ settings, records, instrumentResults, setSettings }) => {
  const activeSemester = settings.semester;

  const analysisData = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .map((teacher, idx) => {
        const key = `${teacher.id}-pembelajaran-${activeSemester}`;
        const result = instrumentResults[key];
        
        let persiapan = 0; // A: 0, 1, 3, 4
        let pelaksanaan = 0; // B: 7, 9, 21, 28
        let evaluasi = 0; // C: 30, 32, 35
        
        if (result && result.scores) {
          const s = result.scores as Record<number, number>;
          persiapan = (s[0] || 0) + (s[1] || 0) + (s[3] || 0) + (s[4] || 0);
          pelaksanaan = (s[7] || 0) + (s[9] || 0) + (s[21] || 0) + (s[28] || 0);
          evaluasi = (s[30] || 0) + (s[32] || 0) + (s[35] || 0);
        }

        const totalPerc = Math.round(((persiapan + pelaksanaan + evaluasi) / 22) * 100);
        let reco = "Pendampingan Berkelanjutan";
        if (totalPerc >= 91) reco = "Pertahankan & Bagikan Praktik Baik";
        else if (totalPerc >= 81) reco = "Tingkatkan Variasi Media";
        else if (totalPerc >= 71) reco = "Evaluasi Manajemen Kelas";

        return {
          ...teacher,
          persiapan,
          pelaksanaan,
          evaluasi,
          rekomendasi: reco
        };
      });
  }, [records, activeSemester, instrumentResults]);

  const exportPDF = () => {
    const element = document.getElementById('analysis-export-area');
    // @ts-ignore
    html2pdf().from(element).save(`Analisis_Supervisi_${activeSemester}.pdf`);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold uppercase">Analisis Hasil Supervisi Pembelajaran</h2>
        <div className="flex gap-2">
           <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Ganjil</button>
           <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Genap</button>
           <button onClick={exportPDF} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">PDF</button>
        </div>
      </div>

      <div id="analysis-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-bold">Analisis Supervisi Akademik</h1>
          <h2 className="text-md font-bold">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[9px] border border-slate-800">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-center">
                <th className="border border-slate-800 p-2 w-8">No</th>
                <th className="border border-slate-800 p-2 text-left">Nama</th>
                <th className="border border-slate-800 p-2">Hari / Tanggal</th>
                <th className="border border-slate-800 p-2">Jam Ke</th>
                <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
                <th className="border border-slate-800 p-2">Kelas</th>
                <th className="border border-slate-800 p-2">Persiapan</th>
                <th className="border border-slate-800 p-2">Pelaksanaan</th>
                <th className="border border-slate-800 p-2">Evaluasi</th>
                <th className="border border-slate-800 p-2 text-left">Rekomendasi</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.map((d, i) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="border border-slate-800 p-2 text-center">{i + 1}</td>
                  <td className="border border-slate-800 p-2 font-bold uppercase">{d.namaGuru}</td>
                  <td className="border border-slate-800 p-2 text-center">{d.hari}, {d.tanggal}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold">{d.jamKe}</td>
                  <td className="border border-slate-800 p-2 italic">{d.mataPelajaran}</td>
                  <td className="border border-slate-800 p-2 text-center">{d.kelas}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-blue-600">{d.persiapan}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-emerald-600">{d.pelaksanaan}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-purple-600">{d.evaluasi}</td>
                  <td className="border border-slate-800 p-2 font-medium">{d.rekomendasi}</td>
                </tr>
              ))}
              {analysisData.length === 0 && (
                <tr><td colSpan={10} className="p-10 text-center italic text-slate-400 border border-slate-800">Data hasil supervisi belum tersedia.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalysisView;
