
import React, { useMemo } from 'react';
import { TeacherRecord, AppSettings, InstrumentResult } from '../types';

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  setSettings: (s: AppSettings) => void;
  instrumentResults: Record<string, InstrumentResult>;
  onSaveAction: (teacherId: number, actions: any) => void;
}

const getAutoActionRTL = (avg: number) => {
  if (avg < 60) return "Supervisi klinis intensif dan evaluasi harian perangkat.";
  if (avg < 75) return "Bimbingan teknis tatap muka mengenai asesmen kurikulum merdeka.";
  return "Pendampingan penyusunan modul ajar berbasis IT interaktif.";
};

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

        const rtl = getAutoActionRTL(avg);
        return { ...r, avg, rtl, actions: savedActions };
      })
      .filter(r => r.avg < 83); // Filter guru di bawah nilai target 83
  }, [records, activeSemester, instrumentResults]);

  const handleToggle = (teacherId: number, field: string) => {
    const current = data.find(d => d.id === teacherId)?.actions || {};
    const updated = { ...current, [field]: !current[field as keyof typeof current] };
    onSaveAction(teacherId, updated);
  };

  const exportPDF = () => {
    const element = document.getElementById('action-export-area');
    // @ts-ignore
    html2pdf().from(element).save(`Laporan_Action_TL_Guru_${activeSemester}.pdf`);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Tindak Lanjut Action (Skor &lt; 83)</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Intervensi Langsung Supervisor terhadap Guru Prioritas</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Ganjil' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${activeSemester === 'Genap' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
           </div>
           <button onClick={exportPDF} className="px-4 py-2 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg ml-2">PDF</button>
        </div>
      </div>

      <div id="action-export-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 font-serif">
        <div className="text-center border-b-2 border-slate-900 mb-8 pb-4 uppercase">
          <h1 className="text-lg font-black tracking-widest leading-none">LAPORAN HASIL TINDAK LANJUT ACTION SUPERVISI AKADEMIK</h1>
          <h2 className="text-md font-bold mt-1 uppercase">{settings.namaSekolah}</h2>
          <p className="text-[10px] font-bold mt-1 italic uppercase opacity-75">Target: Guru dengan Pencapaian di bawah 83</p>
        </div>

        <table className="w-full border-collapse text-[9px] border-2 border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center font-black">
              <th className="border border-slate-800 p-2 w-8">No</th>
              <th className="border border-slate-800 p-2 text-left">Nama Lengkap</th>
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
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-800 p-2 text-center font-bold text-slate-400">{i + 1}</td>
                <td className="border border-slate-800 p-2 font-black uppercase text-slate-800 leading-tight">
                    {d.namaGuru} <br/>
                    <span className="text-rose-600 font-bold text-[8px]">(Nilai: {d.avg})</span>
                </td>
                <td className="border border-slate-800 p-2 italic leading-relaxed text-slate-600">{d.rtl}</td>
                <td className="border border-slate-800 p-1 text-center cursor-pointer no-print" onClick={() => handleToggle(d.id, 'contoh')}>
                  <div className={`w-5 h-5 mx-auto border-2 rounded flex items-center justify-center ${d.actions.contoh ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300'}`}>
                    {d.actions.contoh && <span className="font-black">v</span>}
                  </div>
                </td>
                <td className="border border-slate-800 p-1 text-center cursor-pointer no-print" onClick={() => handleToggle(d.id, 'tanyaJawab')}>
                  <div className={`w-5 h-5 mx-auto border-2 rounded flex items-center justify-center ${d.actions.tanyaJawab ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300'}`}>
                    {d.actions.tanyaJawab && <span className="font-black">v</span>}
                  </div>
                </td>
                <td className="border border-slate-800 p-1 text-center cursor-pointer no-print" onClick={() => handleToggle(d.id, 'diskusi')}>
                  <div className={`w-5 h-5 mx-auto border-2 rounded flex items-center justify-center ${d.actions.diskusi ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300'}`}>
                    {d.actions.diskusi && <span className="font-black">v</span>}
                  </div>
                </td>
                <td className="border border-slate-800 p-1 text-center cursor-pointer no-print" onClick={() => handleToggle(d.id, 'konsultasi')}>
                  <div className={`w-5 h-5 mx-auto border-2 rounded flex items-center justify-center ${d.actions.konsultasi ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300'}`}>
                    {d.actions.konsultasi && <span className="font-black">v</span>}
                  </div>
                </td>
                <td className="border border-slate-800 p-1 text-center cursor-pointer no-print" onClick={() => handleToggle(d.id, 'pelatihan')}>
                  <div className={`w-5 h-5 mx-auto border-2 rounded flex items-center justify-center ${d.actions.pelatihan ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300'}`}>
                    {d.actions.pelatihan && <span className="font-black">v</span>}
                  </div>
                </td>
                {/* Print view cells */}
                <td className="border border-slate-800 p-1 text-center hidden print:table-cell font-black">{d.actions.contoh ? 'v' : ''}</td>
                <td className="border border-slate-800 p-1 text-center hidden print:table-cell font-black">{d.actions.tanyaJawab ? 'v' : ''}</td>
                <td className="border border-slate-800 p-1 text-center hidden print:table-cell font-black">{d.actions.diskusi ? 'v' : ''}</td>
                <td className="border border-slate-800 p-1 text-center hidden print:table-cell font-black">{d.actions.konsultasi ? 'v' : ''}</td>
                <td className="border border-slate-800 p-1 text-center hidden print:table-cell font-black">{d.actions.pelatihan ? 'v' : ''}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center italic text-slate-400 border border-slate-800 uppercase tracking-widest font-black">Luar Biasa! Tidak ada guru di bawah skor 83.</td></tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between items-start text-xs font-bold uppercase tracking-tight px-4">
          <div className="text-center w-64">
             <p className="mb-20">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline">{settings.namaKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20 uppercase">Mojokerto, .....................<br/>Supervisor / Petugas</p>
             <p className="underline font-black uppercase">......................................</p>
          </div>
        </div>
      </div>
      
      <div className="no-print bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
         <div className="flex">
            <div className="flex-shrink-0"><svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>
            <div className="ml-3"><p className="text-xs text-amber-700 font-bold uppercase tracking-widest">Pemberitahuan:</p><p className="text-[11px] text-amber-600 mt-1 font-medium leading-relaxed italic">Halaman ini hanya menampilkan guru yang mendapatkan nilai rata-rata di bawah 83 untuk mempermudah fokus pendampingan Anda.</p></div>
         </div>
      </div>
    </div>
  );
};

export default FollowUpActionView;
