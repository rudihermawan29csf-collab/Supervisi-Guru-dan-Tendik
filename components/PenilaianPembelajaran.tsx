
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const ITEMS = [
  "Buku Nilai dan Perencanaan Penilaian",
  "Melaksanakan Tes (Penilaian Kognitif) UH, MIDSEM, UAS",
  "Penugasan Terstruktur",
  "Kegiatan Mandiri Tidak Terstruktur (KMTT)",
  "Melaksanakan Penilaian Keterampilan (Psikomotorik)",
  "Melaksanakan Penilaian Afektif / Sikap",
  "Program dan Pelaksanaan Remedial/Pengayaan",
  "Analisis Hasil Ulangan",
  "Bank Soal / Instrumen Tes"
];

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const PenilaianPembelajaran: React.FC<Props> = ({ settings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [pangkat, setPangkat] = useState('');
  const [sertifikasi, setSertifikasi] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');

  const [scores, setScores] = useState<Record<number, number>>(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 1 }), {} as any));
  const [monitoring, setMonitoring] = useState<Record<number, 'ada' | 'tidak'>>(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 'ada' }), {} as any));

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-penilaian-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores);
        setTindakLanjut(saved.tindakLanjut || '');
      } else {
        setScores(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 1 }), {} as any));
        setTindakLanjut('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const stats = useMemo(() => {
    const totalScore = (Object.values(scores) as number[]).reduce((sum, s) => sum + s, 0);
    const maxScore = 36; 
    const percentage = (totalScore / maxScore) * 100;
    
    let kriteria = 'Kurang';
    if (percentage >= 86) kriteria = 'Baik Sekali';
    else if (percentage >= 71) kriteria = 'Baik';
    else if (percentage >= 55) kriteria = 'Cukup';

    return { totalScore, percentage: percentage.toFixed(2), kriteria };
  }, [scores]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'penilaian', settings.semester, {
      scores,
      remarks: {},
      tindakLanjut
    });
  };

  const exportPDF = () => {
    const element = document.getElementById('penilaian-area');
    // @ts-ignore
    html2pdf().from(element).save(`Penilaian_${selectedTeacher?.namaGuru}.pdf`);
  };

  const exportExcel = () => {
    if (!selectedTeacher) return;
    const headers = "No,Aspek Penilaian,Pemantauan,Skor";
    const rows = ITEMS.map((item, idx) => `${idx+1},"${item}",${monitoring[idx]},${scores[idx]}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Penilaian_${selectedTeacher.namaGuru}.csv`;
    link.click();
  };

  const exportWord = () => {
    const element = document.getElementById('penilaian-area');
    const blob = new Blob(['\ufeff', element?.outerHTML || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Penilaian_${selectedTeacher?.namaGuru}.doc`;
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
          <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600">
            <option value="">-- Pilih Nama Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} disabled={!selectedTeacher} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
          <button onClick={exportExcel} disabled={!selectedTeacher} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Excel</button>
          <button onClick={exportWord} disabled={!selectedTeacher} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-black text-[9px] uppercase shadow">Word</button>
          <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-1.5 bg-blue-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Simpan</button>
        </div>
      </div>

      <div id="penilaian-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <h1 className="text-center text-xl font-black text-slate-900 uppercase mb-4 border-b-2 border-slate-900 pb-2">Instrumen Supervisi Penilaian Pembelajaran</h1>
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 italic">Tahun Pelajaran {settings.tahunPelajaran}</p>
        
        <div className="grid grid-cols-2 gap-6 text-xs font-bold uppercase mb-8">
          <div className="space-y-2">
            <div className="flex"><span className="w-32 text-slate-500">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Nama Guru</span><span className="font-black text-slate-900">: {selectedTeacher?.namaGuru || '-'}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Hari / Tanggal</span><span className="text-blue-700">: {selectedTeacher?.hari ? `${selectedTeacher.hari}, ${selectedTeacher.tanggal}` : '-'}</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex"><span className="w-32 text-slate-500">Mata Pelajaran</span><span className="italic">: {selectedTeacher?.mataPelajaran || '-'}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Jam Tatap Muka</span><span>: {selectedTeacher?.jamKe || '-'} JP</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Pangkat / Gol</span><input value={pangkat} onChange={e => setPangkat(e.target.value)} className="bg-transparent border-b border-slate-200 no-print px-1" /></div>
          </div>
        </div>

        <table className="w-full border-collapse text-[10px] mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase">
              <th rowSpan={2} className="px-2 py-3 border border-slate-700 w-8">No</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Aspek Penilaian</th>
              <th colSpan={2} className="px-2 py-2 border border-slate-700">Hasil</th>
              <th colSpan={4} className="px-2 py-2 border border-slate-700">Kesesuaian (1-4)</th>
            </tr>
            <tr className="bg-slate-800 text-white text-[8px]">
              <th className="border border-slate-700 px-1 py-1">Ada</th>
              <th className="border border-slate-700 px-1 py-1">Tdk</th>
              <th className="border border-slate-700 px-1 py-1">4</th>
              <th className="border border-slate-700 px-1 py-1">3</th>
              <th className="border border-slate-700 px-1 py-1">2</th>
              <th className="border border-slate-700 px-1 py-1">1</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-2 py-2 border border-slate-200 text-center font-bold text-slate-400">{idx + 1}</td>
                <td className="px-4 py-2 border border-slate-200 font-medium">{item}</td>
                <td className="px-1 py-2 border border-slate-200 text-center"><input type="radio" checked={monitoring[idx] === 'ada'} onChange={() => setMonitoring(p => ({...p, [idx]: 'ada'}))} /></td>
                <td className="px-1 py-2 border border-slate-200 text-center"><input type="radio" checked={monitoring[idx] === 'tidak'} onChange={() => setMonitoring(p => ({...p, [idx]: 'tidak'}))} /></td>
                {[4, 3, 2, 1].map(v => (
                  <td key={v} className="px-1 py-2 border border-slate-200 text-center"><input type="radio" checked={scores[idx] === v} onChange={() => setScores(p => ({...p, [idx]: v}))} /></td>
                ))}
              </tr>
            ))}
            <tr className="bg-slate-100 font-black text-slate-900">
              <td colSpan={4} className="px-4 py-3 border border-slate-200 text-right uppercase">Skor: {stats.totalScore}</td>
              <td colSpan={4} className="px-4 py-3 border border-slate-200 text-center text-emerald-700 uppercase italic">Hasil: {stats.percentage}% ({stats.kriteria})</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-start text-xs mt-12">
          <div className="text-center w-64">
             <p className="mb-20 uppercase font-medium">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline uppercase">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20 font-medium uppercase">Mojokerto, {displayDate}<br/>Guru Mata Pelajaran</p>
             <p className="font-black underline uppercase">{selectedTeacher?.namaGuru || '................................'}</p>
             <p className="text-[10px] italic">NIP. ................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenilaianPembelajaran;
