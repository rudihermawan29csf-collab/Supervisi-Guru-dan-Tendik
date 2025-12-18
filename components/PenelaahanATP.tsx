
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const ITEMS = [
  "Mencantumkan: nama sekolah, mata pelajaran, Kelas, Semester dan CP.",
  "Peta Kompetensi sesuai fase usia / pembelajaran",
  "Capaian Pembelajaran",
  "Tujuan Pembelajaran",
  "ATP mencakup komponen kompetensi",
  "ATP mencakup komponen konten",
  "ATP mencakup komponen variasi",
  "Mengambarkan urutan pengembangan kompetensi yang harus dikuasai peserta didik",
  "Alur tujuan pembelajaran dalam satu fase menggambarkan cakupan dan tahapan pembelajaran yang linear",
  "Alur tujuan pembelajaran menggambarkan tahapan perkembangan kompetensi antarfase dan jenjang",
  "Identifikasi elemen/sub elemen Profil Pelajar Pancasila",
  "Alur Tujuan Pembelajaran"
];

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const PenelaahanATP: React.FC<Props> = ({ settings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [kelasSemester, setKelasSemester] = useState('');
  
  const [scores, setScores] = useState<Record<number, number>>(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-atp-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores);
        setKelasSemester(saved.kelasSemester || '');
      } else {
        setScores(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));
        setKelasSemester('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const stats = useMemo(() => {
    const totalScore = (Object.values(scores) as number[]).reduce((sum, s) => sum + s, 0);
    const maxScore = 24; 
    const percentage = (totalScore / maxScore) * 100;
    
    let kriteria = 'Kurang';
    if (percentage >= 91) kriteria = 'Sangat Baik';
    else if (percentage >= 81) kriteria = 'Baik';
    else if (percentage >= 71) kriteria = 'Cukup';

    return { totalScore, percentage: percentage.toFixed(2), kriteria };
  }, [scores]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'atp', settings.semester, {
      scores,
      remarks: {},
      kelasSemester
    });
  };

  const exportPDF = () => {
    const element = document.getElementById('atp-area');
    // @ts-ignore
    html2pdf().from(element).save(`ATP_${selectedTeacher?.namaGuru}.pdf`);
  };

  const exportExcel = () => {
    if (!selectedTeacher) return;
    const headers = "No,Komponen Indikator,Skor";
    const rows = ITEMS.map((item, idx) => `${idx+1},"${item}",${scores[idx]}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `ATP_${selectedTeacher.namaGuru}.csv`;
    link.click();
  };

  const exportWord = () => {
    const element = document.getElementById('atp-area');
    const blob = new Blob(['\ufeff', element?.outerHTML || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ATP_${selectedTeacher?.namaGuru}.doc`;
    link.click();
  };

  const displayDate = useMemo(() => {
    const dateToUse = selectedTeacher?.tanggal || settings.tanggalCetak;
    return new Date(dateToUse).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
  }, [selectedTeacher, settings.tanggalCetak]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-4 no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-black text-slate-500 uppercase">Pilih Guru:</label>
          <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-indigo-600 outline-none">
            <option value="">-- Pilih Nama Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} disabled={!selectedTeacher} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
          <button onClick={exportExcel} disabled={!selectedTeacher} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Excel</button>
          <button onClick={exportWord} disabled={!selectedTeacher} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-black text-[9px] uppercase shadow">Word</button>
          <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Simpan</button>
        </div>
      </div>

      <div id="atp-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <h1 className="text-center text-lg font-black text-slate-900 uppercase border-b-2 border-slate-900 pb-2 mb-4">Instrumen Penelaahan Alur Tujuan Pembelajaran (ATP)</h1>
        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8 italic">Tahun Pelajaran {settings.tahunPelajaran}</p>
        
        <div className="grid grid-cols-2 gap-6 text-[10px] uppercase font-bold mb-8">
          <div className="space-y-2">
             <div className="flex"><span className="w-28 text-slate-500">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
             <div className="flex"><span className="w-28 text-slate-500">Nama Guru</span><span className="font-black text-slate-900">: {selectedTeacher?.namaGuru || '-'}</span></div>
          </div>
          <div className="space-y-2">
             <div className="flex"><span className="w-28 text-slate-500">Mata Pelajaran</span><span>: {selectedTeacher?.mataPelajaran || '-'}</span></div>
             <div className="flex"><span className="w-28 text-slate-500">Hari / Tgl</span><span className="text-indigo-700">: {selectedTeacher?.hari ? `${selectedTeacher.hari}, ${selectedTeacher.tanggal}` : '-'}</span></div>
          </div>
        </div>

        <table className="w-full border-collapse text-[9px] mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center">
              <th rowSpan={2} className="px-2 py-3 border border-slate-700 w-8">No</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Komponen/Indikator</th>
              <th colSpan={3} className="px-2 py-2 border border-slate-700">Skor</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Catatan</th>
            </tr>
            <tr className="bg-slate-800 text-[8px]">
              <th className="border border-slate-700 px-1 py-1">2</th>
              <th className="border border-slate-700 px-1 py-1">1</th>
              <th className="border border-slate-700 px-1 py-1">0</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-2 py-2 border border-slate-200 text-center font-bold text-slate-400">{idx + 1}</td>
                <td className="px-4 py-2 border border-slate-200 font-medium">{item}</td>
                {[2, 1, 0].map(v => (
                  <td key={v} className="px-1 py-2 border border-slate-200 text-center"><input type="radio" checked={scores[idx] === v} onChange={() => setScores(p => ({...p, [idx]: v}))} /></td>
                ))}
                <td className="px-2 py-2 border border-slate-200"></td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-black">
              <td colSpan={2} className="px-4 py-3 border border-slate-200 text-right uppercase">Skor: {stats.totalScore} ({stats.percentage}%)</td>
              <td colSpan={4} className="px-4 py-3 border border-slate-200 text-center text-indigo-700 uppercase italic">Predikat: {stats.kriteria}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-start text-xs mt-10">
          <div className="text-center w-64">
             <p className="mb-20 uppercase font-medium">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline uppercase">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20 font-medium uppercase">Mojokerto, {displayDate}<br/>Guru yang di Supervisi</p>
             <p className="font-black underline uppercase">{selectedTeacher?.namaGuru || '................................'}</p>
             <p className="text-[10px] italic">NIP. ................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenelaahanATP;
