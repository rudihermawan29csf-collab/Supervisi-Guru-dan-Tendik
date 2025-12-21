
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  setSettings: (s: AppSettings) => void;
}

const getCatatanRecap = (avg: number) => {
  if (avg >= 91) return "Sangat Memuaskan. Perangkat lengkap, PBM interaktif, dan asesmen variatif.";
  if (avg >= 75) return "Baik. Kinerja memenuhi standar, perlu sedikit pengayaan pada media digital.";
  if (avg >= 55) return "Cukup. Administrasi tersedia, namun pengelolaan kelas perlu pendampingan rutin.";
  return "Kurang. Diperlukan supervisi klinis dan penataan ulang seluruh perangkat ajar.";
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
          catatanRecap: getCatatanRecap(avg)
        };
      });
  }, [records, activeSemester]);

  const exportPDF = () => {
    const element = document.getElementById('recap-export-area');
    // @ts-ignore
    html2pdf().from(element).save(`Rekapitulasi_Supervisi_${activeSemester}.pdf`);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Rekapitulasi Supervisi Akademik</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Konsolidasi Seluruh Instrumen Penilaian</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
           </div>
           <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg ml-2">PDF</button>
        </div>
      </div>

      <div id="recap-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8 font-serif">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-black tracking-widest leading-none">REKAPITULASI HASIL SUPERVISI AKADEMIK GURU</h1>
          <h2 className="text-md font-bold mt-1 uppercase">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic uppercase tracking-widest">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[9px] border-2 border-slate-800">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-center font-black">
                <th className="border border-slate-800 p-2 w-32 text-left">Nama Guru</th>
                <th className="border border-slate-800 p-2 text-left">Mata Pelajaran</th>
                <th className="border border-slate-800 p-2 w-12">Kelas</th>
                <th className="border border-slate-800 p-2">Adm. Pem</th>
                <th className="border border-slate-800 p-2">Telaah ATP</th>
                <th className="border border-slate-800 p-2">Telaah MA</th>
                <th className="border border-slate-800 p-2">Pelaks. Pemb</th>
                <th className="border border-slate-800 p-2">Penil. Pemb</th>
                <th className="border border-slate-800 p-2 bg-rose-800 text-white font-black">Nilai Akhir</th>
                <th className="border border-slate-800 p-2 text-left w-1/4">Catatan Pelaksanaan</th>
              </tr>
            </thead>
            <tbody>
              {recapData.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="border border-slate-800 p-2 font-black uppercase text-slate-800 leading-tight">{d.namaGuru}</td>
                  <td className="border border-slate-800 p-2 italic text-blue-800">{d.mataPelajaran}</td>
                  <td className="border border-slate-800 p-2 text-center font-black">{d.kelas || '-'}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-slate-600">{d.nilaiAdm || 0}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-slate-600">{d.nilaiATP || 0}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-slate-600">{d.nilaiModul || 0}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-slate-600">{d.nilai || 0}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-slate-600">{d.nilaiPenilaian || 0}</td>
                  <td className="border border-slate-800 p-2 text-center font-black text-rose-700 bg-rose-50/20 text-sm">{d.nilaiAkhir}</td>
                  <td className="border border-slate-800 p-2 italic leading-snug text-slate-600">{d.catatanRecap}</td>
                </tr>
              ))}
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
             <p className="mb-20 uppercase">Mojokerto, {settings.tanggalCetak}<br/>Supervisor / Petugas</p>
             <p className="underline font-black">................................................</p>
             <p className="text-[10px] font-mono tracking-tighter">NIP. ................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisionRecapView;
