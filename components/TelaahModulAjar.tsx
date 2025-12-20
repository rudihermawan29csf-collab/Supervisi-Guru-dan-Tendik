
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const ITEMS = [
  { label: "Nama penyusun, institusi, dan tahun disusunnya", id: 0 },
  { label: "Kompetensi Awal", id: 1 },
  { label: "Profil Pelajar Pancasila", id: 2 },
  { label: "Sarana dan Prasarana", id: 3 },
  { label: "Target Peserta Didik", id: 5 },
  { label: "Model Pembelajaran", id: 6 },
  { label: "Ketepatan Tujuan Pembelajaran", id: 8 },
  { label: "Pemahaman Bermakna", id: 9 },
  { label: "Pertanyaan Pemantik", id: 10 },
  { label: "Persiapan Pembelajaran", id: 11 },
  { label: "Skenario Pembelajaran (Motivasi/Apersepsi)", id: 12 },
  { label: "Rancangan Penilaian", id: 19 }
];

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const getAutoText = (percentage: number) => {
  if (percentage >= 91) return { c: "Modul ajar sangat lengkap, inovatif dan sesuai kurikulum.", tl: "Dapat dijadikan contoh Modul Ajar Praktik Baik." };
  if (percentage >= 81) return { c: "Modul ajar baik, skenario pembelajaran sudah operasional.", tl: "Perjelas kriteria ketercapaian tujuan pembelajaran." };
  if (percentage >= 71) return { c: "Cukup, pertanyaan pemantik perlu dikembangkan lagi.", tl: "Memperbaiki rubrik penilaian agar lebih spesifik." };
  return { c: "Modul ajar kurang lengkap, banyak komponen wajib yang absen.", tl: "Menyusun modul ajar baru sesuai CP terbaru." };
};

const TelaahModulAjar: React.FC<Props> = ({ settings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<number, number>>(ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {} as any));

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  const stats = useMemo(() => {
    const totalScore = (Object.values(scores) as number[]).reduce((sum, s) => sum + s, 0);
    const maxScore = ITEMS.length * 2; // 12 items * max 2
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let kriteria = 'Kurang';
    if (percentage >= 91) kriteria = 'Sangat Baik';
    else if (percentage >= 81) kriteria = 'Baik';
    else if (percentage >= 71) kriteria = 'Cukup';

    const auto = getAutoText(percentage);
    return { totalScore, maxScore, percentage, kriteria, auto };
  }, [scores]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-modul-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) setScores(saved.scores as any);
      else setScores(ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {} as any));
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'modul', settings.semester, {
      scores,
      remarks: {},
      catatan: stats.auto.c,
      tindakLanjut: stats.auto.tl
    });
  };

  const displayDate = useMemo(() => {
    const dateToUse = selectedTeacher?.tanggal || settings.tanggalCetak;
    return new Date(dateToUse).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
  }, [selectedTeacher, settings.tanggalCetak]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-4 no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none">
          <option value="">-- Pilih Guru --</option>
          {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
        </select>
        <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg disabled:opacity-50">Simpan Hasil</button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-center text-xl font-black uppercase mb-4 border-b-2 border-slate-900 pb-2 tracking-tight">Telaah Modul Ajar</h1>
        
        <div className="grid grid-cols-2 gap-6 text-[10px] font-bold uppercase mb-8">
          <div className="space-y-2">
            <div className="flex"><span className="w-32 text-slate-500">Nama Guru</span><span>: {selectedTeacher?.namaGuru || '-'}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">NIP</span><span>: {selectedTeacher?.nip || '-'}</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex"><span className="w-32 text-slate-500">Mata Pelajaran</span><span>: {selectedTeacher?.mataPelajaran || '-'}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Hari / Tanggal</span><span>: {selectedTeacher?.hari ? `${selectedTeacher.hari}, ${selectedTeacher.tanggal}` : '-'}</span></div>
          </div>
        </div>

        <table className="w-full border-collapse text-[10px] mb-6">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center">
              <th rowSpan={2} className="px-2 py-3 border border-slate-700 w-8">No</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Komponen Modul</th>
              <th colSpan={3} className="px-2 py-2 border border-slate-700">Skor</th>
            </tr>
            <tr className="bg-slate-800 text-white text-[8px]">
              <th className="border border-slate-700">2</th><th className="border border-slate-700">1</th><th className="border border-slate-700">0</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-2 py-2 border border-slate-200 text-center font-bold text-slate-400">{idx + 1}</td>
                <td className="px-4 py-2 border border-slate-200 font-medium">{item.label}</td>
                {[2, 1, 0].map(v => (
                  <td key={v} className="px-1 py-2 border border-slate-200 text-center">
                    <input type="radio" checked={scores[item.id] === v} onChange={() => setScores(p => ({...p, [item.id]: v}))} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tabel Ringkasan Nilai */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg border">
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Skor Perolehan</p>
               <p className="text-2xl font-black text-slate-800">{stats.totalScore}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Skor Maksimal</p>
               <p className="text-2xl font-black text-slate-800">{stats.maxScore}</p>
            </div>
            <div className="p-3 bg-indigo-600 rounded-lg shadow-lg">
               <p className="text-[10px] font-black text-indigo-100 uppercase mb-1">Nilai Akhir (%)</p>
               <p className="text-2xl font-black text-white">{stats.percentage}%</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center px-2">
             <p className="text-[10px] font-bold text-slate-500 italic">* Nilai Akhir = (Skor Perolehan / 24) x 100</p>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Predikat:</span>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${stats.percentage >= 91 ? 'bg-emerald-600' : stats.percentage >= 81 ? 'bg-blue-600' : stats.percentage >= 71 ? 'bg-amber-500' : 'bg-red-600'}`}>{stats.kriteria}</span>
             </div>
          </div>
        </div>

        <div className="space-y-4 mb-12 text-[11px] font-bold uppercase tracking-tight">
           <div className="border-b-2 border-dotted border-slate-400 pb-1">Catatan : <span className="font-normal italic lowercase text-slate-600">{stats.auto.c}</span></div>
           <div className="border-b-2 border-dotted border-slate-400 pb-1">Tindak Lanjut : <span className="font-normal italic lowercase text-slate-600">{stats.auto.tl}</span></div>
        </div>

        <div className="flex justify-between items-start text-xs mt-12 font-bold uppercase">
          <div className="text-center w-64">
             <p className="mb-20">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="underline font-black">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20">Mojokerto, {displayDate}<br/>Guru yang di Supervisi</p>
             <p className="underline font-black">{selectedTeacher?.namaGuru || '................................'}</p>
             <p className="text-[10px]">NIP. {selectedTeacher?.nip || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelaahModulAjar;
