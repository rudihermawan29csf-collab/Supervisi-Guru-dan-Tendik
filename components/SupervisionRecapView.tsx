
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  setSettings: (s: AppSettings) => void;
}

const getCatatanOtomatis = (avg: number) => {
  if (avg >= 91) return "Kinerja sangat memuaskan, pertahankan kualitas pembelajaran.";
  if (avg >= 75) return "Kinerja baik, tingkatkan inovasi pada media pembelajaran.";
  if (avg >= 55) return "Kinerja cukup, perlu pendampingan rutin dalam penyusunan administrasi.";
  return "Kinerja kurang, diperlukan pembinaan intensif dan supervisi klinis.";
};

const SupervisionRecapView: React.FC<Props> = ({ settings, records, setSettings }) => {
  const activeSemester = settings.semester;

  const recapData = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .map(r => {
        const scores = [
          r.nilaiAdm || 0,
          r.nilaiATP || 0,
          r.nilaiModul || 0,
          r.nilai || 0,
          r.nilaiPenilaian || 0
        ];
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
        return {
          ...r,
          nilaiAkhir: avg,
          catatanRecap: getCatatanOtomatis(avg)
        };
      });
  }, [records, activeSemester]);

  const exportPDF = () => {
    const element = document.getElementById('recap-export-area');
    // @ts-ignore
    html2pdf().from(element).save(`Rekap_Supervisi_${activeSemester}.pdf`);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold uppercase">Rekap Supervisi Akademik</h2>
        <div className="flex gap-2">
           <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Ganjil</button>
           <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>Genap</button>
           <button onClick={exportPDF} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase shadow">PDF</button>
        </div>
      </div>

      <div id="recap-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-bold">Rekapitulasi Hasil Supervisi Akademik</h1>
          <h2 className="text-md font-bold">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[8px] border border-slate-800">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-center font-bold">
                <th className="border border-slate-800 p-1 w-6">No</th>
                <th className="border border-slate-800 p-2 text-left">Nama Guru</th>
                <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
                <th className="border border-slate-800 p-1 w-10">Kelas</th>
                <th className="border border-slate-800 p-1">Adm. Pem</th>
                <th className="border border-slate-800 p-1">Telaah ATP</th>
                <th className="border border-slate-800 p-1">Telaah MA</th>
                <th className="border border-slate-800 p-1">Pelaks. Pemb</th>
                <th className="border border-slate-800 p-1">Penil. Pemb</th>
                <th className="border border-slate-800 p-1 bg-blue-800">Nilai Akhir</th>
                <th className="border border-slate-800 p-2 text-left">Catatan Pelaksanaan</th>
              </tr>
            </thead>
            <tbody>
              {recapData.map((d, i) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="border border-slate-800 p-1 text-center font-bold">{i + 1}</td>
                  <td className="border border-slate-800 p-2 font-bold uppercase">{d.namaGuru}</td>
                  <td className="border border-slate-800 p-2 italic">{d.mataPelajaran}</td>
                  <td className="border border-slate-800 p-1 text-center font-bold">{d.kelas || '-'}</td>
                  <td className="border border-slate-800 p-1 text-center">{d.nilaiAdm || 0}</td>
                  <td className="border border-slate-800 p-1 text-center">{d.nilaiATP || 0}</td>
                  <td className="border border-slate-800 p-1 text-center">{d.nilaiModul || 0}</td>
                  <td className="border border-slate-800 p-1 text-center">{d.nilai || 0}</td>
                  <td className="border border-slate-800 p-1 text-center">{d.nilaiPenilaian || 0}</td>
                  <td className="border border-slate-800 p-1 text-center font-black bg-blue-50 text-blue-800">{d.nilaiAkhir}</td>
                  <td className="border border-slate-800 p-2 italic">{d.catatanRecap}</td>
                </tr>
              ))}
              {recapData.length === 0 && (
                <tr><td colSpan={11} className="p-10 text-center italic text-slate-400 border border-slate-800 uppercase">Data belum tersedia.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupervisionRecapView;
