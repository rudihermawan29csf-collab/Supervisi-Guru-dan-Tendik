
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
      .map((teacher) => {
        const key = `${teacher.id}-pembelajaran-${activeSemester}`;
        const result = instrumentResults[key];
        
        let persiapan = 0;   // A: Pendahuluan (Items 1-7)
        let pelaksanaan = 0; // B: Inti (Items 8-30)
        let evaluasi = 0;    // C: Penutup (Items 31-38)
        
        if (result && result.scores) {
          const s = result.scores as Record<number, number>;
          // Persiapan: Sum items 1 to 7
          for(let i=1; i<=7; i++) persiapan += (s[i] || 0);
          // Pelaksanaan: Sum items 8 to 30
          for(let i=8; i<=30; i++) pelaksanaan += (s[i] || 0);
          // Evaluasi: Sum items 31 to 38
          for(let i=31; i<=38; i++) evaluasi += (s[i] || 0);
        }

        const totalScore = persiapan + pelaksanaan + evaluasi;
        const totalPerc = Math.round((totalScore / 76) * 100);
        
        let reco = "Pendampingan Berkelanjutan";
        if (totalPerc >= 91) reco = "Pertahankan & Bagikan Praktik Baik";
        else if (totalPerc >= 81) reco = "Tingkatkan Variasi Media & Model";
        else if (totalPerc >= 71) reco = "Evaluasi Manajemen Kelas & Waktu";

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
    html2pdf().from(element).save(`Analisis_Supervisi_PBM_${activeSemester}.pdf`);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Analisis Hasil Supervisi Pembelajaran</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penilaian Per Aspek Skenario Modul</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner mr-2">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
           </div>
           <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg">PDF</button>
        </div>
      </div>

      <div id="analysis-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8 font-serif">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-black tracking-widest leading-none">ANALISIS HASIL SUPERVISI PEMBELAJARAN GURU</h1>
          <h2 className="text-md font-bold mt-1 uppercase">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic uppercase tracking-tight">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[9px] border-2 border-slate-800">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-center font-black">
                <th className="border border-slate-800 p-2 w-8">No</th>
                <th className="border border-slate-800 p-2 text-left">Nama Lengkap Guru</th>
                <th className="border border-slate-800 p-2">Hari / Tanggal</th>
                <th className="border border-slate-800 p-2 w-10">Jam</th>
                <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
                <th className="border border-slate-800 p-2 w-12">Kelas</th>
                <th className="border border-slate-800 p-2 bg-blue-800">Persiapan</th>
                <th className="border border-slate-800 p-2 bg-emerald-800">Pelaksanaan</th>
                <th className="border border-slate-800 p-2 bg-purple-800">Evaluasi</th>
                <th className="border border-slate-800 p-2 text-left">Rekomendasi / Hasil Analisis</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.map((d, i) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="border border-slate-800 p-2 text-center font-bold text-slate-400">{i + 1}</td>
                  <td className="border border-slate-800 p-2 font-black uppercase text-slate-800">{d.namaGuru}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold">{d.hari}, {d.tanggalPemb || d.tanggal}</td>
                  <td className="border border-slate-800 p-2 text-center font-black text-slate-900">{d.jamKe || '-'}</td>
                  <td className="border border-slate-800 p-2 italic text-blue-800">{d.mataPelajaran}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold">{d.kelas}</td>
                  <td className="border border-slate-800 p-2 text-center font-black text-blue-700 bg-blue-50/20">{d.persiapan}</td>
                  <td className="border border-slate-800 p-2 text-center font-black text-emerald-700 bg-emerald-50/20">{d.pelaksanaan}</td>
                  <td className="border border-slate-800 p-2 text-center font-black text-purple-700 bg-purple-50/20">{d.evaluasi}</td>
                  <td className="border border-slate-800 p-2 font-medium italic text-slate-600 leading-tight">{d.rekomendasi}</td>
                </tr>
              ))}
              {analysisData.length === 0 && (
                <tr><td colSpan={10} className="p-10 text-center italic text-slate-400 border border-slate-800 uppercase tracking-widest">Jadwal atau hasil instrumen belum tersedia.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex justify-between items-start text-xs font-bold uppercase tracking-tight px-4">
          <div className="text-center w-64">
             <p className="mb-20 uppercase">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono tracking-tighter">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20 uppercase">Mojokerto, .....................<br/>Supervisor / Petugas</p>
             <p className="underline font-black">................................................</p>
             <p className="text-[10px] font-mono tracking-tighter">NIP. ................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalysisView;
