
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

/* Fix: Component must return JSX and not void */
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

  const handleScoreChange = (id: number, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

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

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none">
          <option value="">-- Pilih Guru --</option>
          {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
        </select>
        <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
            <button onClick={handleSave} disabled={!selectedTeacher} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg ml-2">Simpan Hasil</button>
        </div>
      </div>

      <div id="obs-results-export" className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900">
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-2">
          <h1 className="text-xl font-black uppercase">Hasil Observasi Pembelajaran</h1>
          <p className="text-sm font-bold">Semester {settings.semester} • {settings.namaSekolah}</p>
        </div>

        <div className="mb-6 text-sm font-bold">
           <div className="flex"><span className="w-32">Nama Guru</span><span>: {selectedTeacher?.namaGuru || '...................'}</span></div>
           <div className="flex"><span className="w-32">Mata Pelajaran</span><span>: {selectedTeacher?.mataPelajaran || '...................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-xs">
          <thead>
            <tr className="bg-slate-100 font-bold uppercase text-center">
              <th className="border-2 border-slate-900 p-2 w-10">No</th>
              <th className="border-2 border-slate-900 p-2 text-left">Aspek yang Diobservasi</th>
              <th className="border-2 border-slate-900 p-2 w-20">Skor (1-4)</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                <tr className="bg-slate-50 font-bold"><td className="border-2 border-slate-900 p-2 text-center">{group.no}</td><td colSpan={2} className="border-2 border-slate-900 p-2 uppercase">{group.title}</td></tr>
                {group.items.map((item, iIdx) => (
                  <tr key={item.id}>
                    <td className="border-2 border-slate-900"></td>
                    <td className="border-2 border-slate-900 p-2 pl-6">{iIdx + 1}. {item.label}</td>
                    <td className="border-2 border-slate-900 p-1 text-center">
                      <input 
                        type="number" min="1" max="4" 
                        value={scores[item.id] || ''} 
                        onChange={e => handleScoreChange(item.id, Number(e.target.value))}
                        className="w-12 text-center border rounded no-print"
                      />
                      <span className="hidden print:inline">{scores[item.id] || '-'}</span>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="bg-slate-100 font-bold">
              <td colSpan={2} className="border-2 border-slate-900 p-2 text-right uppercase">Rata-rata Skor</td>
              <td className="border-2 border-slate-900 p-2 text-center text-blue-700">{stats.average}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ObservationResultsView;
