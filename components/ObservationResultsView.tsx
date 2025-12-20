
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

interface ObsItem {
  id: number;
  label: string;
}

interface ObsGroup {
  no: string;
  title: string;
  items: ObsItem[];
}

const GROUPS: ObsGroup[] = [
  {
    no: "1",
    title: "Tahap sebelum observasi",
    items: [
      { id: 1, label: "Persiapan mengajar yang disiapkan" },
      { id: 2, label: "Konsep yang akan dibahas" },
      { id: 3, label: "Tujuan yang akan dicapai" },
      { id: 4, label: "Langkah-langkah penyajian" },
      { id: 5, label: "Pemanfaatan media" },
      { id: 6, label: "Proses interaksi" }
    ]
  },
  {
    no: "2",
    title: "Tahap pelaksanaan observasi",
    items: [
      { id: 7, label: "Kejelasan konsep" },
      { id: 8, label: "Tingkat keberhasilan" },
      { id: 9, label: "Penggunaan media" },
      { id: 10, label: "Efektivitas interaksi" }
    ]
  },
  {
    no: "3",
    title: "Tahap sesudah observasi",
    items: [
      { id: 11, label: "Kesan-kesan penampilan" },
      { id: 12, label: "Kemampuan mengidentifikasi keterampilan yang sudah baik" },
      { id: 13, label: "Kemampuan mengidentifikasi keterampilan yang belum berhasil" },
      { id: 14, label: "Diskusi tentang gagasan-gagasan alternatif" }
    ]
  }
];

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const ObservationResultsView: React.FC<Props> = ({ settings, setSettings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<number, number>>({});

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-hasil-observasi-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores as any || {});
      } else {
        setScores({});
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores).filter(v => typeof v === 'number') as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const average = scoreValues.length > 0 ? (totalScore / scoreValues.length).toFixed(2) : '0.00';
    return { totalScore, average };
  }, [scores]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'hasil-observasi', settings.semester, {
      scores,
      remarks: {}
    });
    alert('Hasil observasi berhasil disimpan!');
  };

  const exportPDF = () => {
    const element = document.getElementById('obs-results-export');
    const opt = { margin: 10, filename: `HasilObs_${selectedTeacher?.namaGuru || 'Guru'}_${settings.semester}.pdf`, jsPDF: { orientation: 'portrait' } };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const exportWord = () => {
    const html = document.getElementById('obs-results-export')?.innerHTML;
    const blob = new Blob(['\ufeff', html || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `HasilObs_${selectedTeacher?.namaGuru || 'Guru'}_${settings.semester}.doc`;
    link.click();
  };

  const exportExcel = () => {
    const html = document.getElementById('obs-results-export')?.innerHTML;
    const blob = new Blob(['\ufeff', html || ''], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `HasilObs_${selectedTeacher?.namaGuru || 'Guru'}_${settings.semester}.xls`;
    link.click();
  };

  const handleScoreChange = (id: number, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <select 
            value={selectedTeacherId} 
            onChange={(e) => setSelectedTeacherId(Number(e.target.value))} 
            className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Pilih Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${settings.semester === 'Ganjil' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${settings.semester === 'Genap' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
            <button onClick={exportWord} className="px-4 py-2 bg-blue-800 text-white rounded-lg font-black text-[9px] uppercase shadow">Word</button>
            <button onClick={exportExcel} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Excel</button>
            <button onClick={handleSave} disabled={!selectedTeacher} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg ml-2">Simpan Hasil</button>
        </div>
      </div>

      <div id="obs-results-export" className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-10 border-b-2 border-slate-900 pb-2">
          <h1 className="text-xl font-black uppercase tracking-widest underline underline-offset-4">HASIL OBSERVASI</h1>
          <p className="text-sm font-bold mt-2">Semester {settings.semester.toUpperCase()} • {settings.namaSekolah}</p>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[11px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">No</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left w-36">Komponen yang dianalisis</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">Aspek yang disupervisi</th>
              <th colSpan={5} className="border-2 border-slate-900 p-1">Hasil Penilaian</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center">
              <th className="border-2 border-slate-900 p-1 w-10">1</th>
              <th className="border-2 border-slate-900 p-1 w-10">2</th>
              <th className="border-2 border-slate-900 p-1 w-10">3</th>
              <th className="border-2 border-slate-900 p-1 w-10">4</th>
              <th className="border-2 border-slate-900 p-1 w-10">5</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                {group.items.map((item, iIdx) => (
                  <tr key={item.id} className="hover:bg-slate-50 align-top">
                    {iIdx === 0 && (
                      <>
                        <td rowSpan={group.items.length} className="border-2 border-slate-900 p-2 text-center font-bold">{group.no}.</td>
                        <td rowSpan={group.items.length} className="border-2 border-slate-900 p-2 font-bold">{group.title}</td>
                      </>
                    )}
                    <td className="border-2 border-slate-900 p-2 leading-relaxed flex items-start">
                       <span className="mr-2 leading-none">•</span>
                       <span>{item.label}</span>
                    </td>
                    {[1, 2, 3, 4, 5].map(val => (
                      <td 
                        key={val} 
                        className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" 
                        onClick={() => handleScoreChange(item.id, val)}
                      >
                        <div className={`w-5 h-5 mx-auto border border-slate-900 flex items-center justify-center transition-all ${scores[item.id] === val ? 'bg-slate-800 text-white' : 'bg-white'}`}>
                          {scores[item.id] === val && <span className="font-black">v</span>}
                        </div>
                      </td>
                    ))}
                    {[1, 2, 3, 4, 5].map(val => (
                       <td key={`p-${val}`} className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">
                         {scores[item.id] === val ? 'v' : ''}
                       </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="bg-slate-100 font-black">
              <td colSpan={3} className="border-2 border-slate-900 p-2 text-right uppercase">Jumlah</td>
              <td colSpan={5} className="border-2 border-slate-900 p-2 text-center text-blue-700">{stats.totalScore}</td>
            </tr>
            <tr className="bg-white font-black">
              <td colSpan={3} className="border-2 border-slate-900 p-2 text-right uppercase">Rata-rata</td>
              <td colSpan={5} className="border-2 border-slate-900 p-2 text-center text-indigo-700">{stats.average}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-16 text-sm font-bold tracking-tight">
            <div className="flex justify-between items-start">
               <div className="w-64 text-center">
                  <p className="mb-20">Guru yang di Supervisi,</p>
                  <div>
                     <p className="underline uppercase font-black">{selectedTeacher?.namaGuru || '............................'}</p>
                     <p className="font-mono text-xs uppercase">NIP. {selectedTeacher?.nip || '............................'}</p>
                  </div>
               </div>
               <div className="text-center w-80">
                  <p className="mb-20">Mojokerto, ...............................<br/>Kepala {settings.namaSekolah},</p>
                  <div>
                     <p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p>
                     <p className="font-mono text-xs uppercase">NIP. {settings.nipKepalaSekolah}</p>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationResultsView;
