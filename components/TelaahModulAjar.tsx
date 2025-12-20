
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
  const [scores, setScores] = useState<Record<number, number>>(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  const stats = useMemo(() => {
    const totalScore = (Object.values(scores) as number[]).reduce((sum, s) => sum + s, 0);
    const maxScore = ITEMS.length * 2; 
    const percentage = (totalScore / maxScore) * 100;
    
    let kriteria = 'Kurang';
    if (percentage >= 91) kriteria = 'Sangat Baik';
    else if (percentage >= 81) kriteria = 'Baik';
    else if (percentage >= 71) kriteria = 'Cukup';

    const auto = getAutoText(percentage);
    return { totalScore, maxScore, percentage: percentage.toFixed(2), kriteria, auto };
  }, [scores]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-modul-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) setScores(saved.scores);
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
        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600">
          <option value="">-- Pilih Guru --</option>
          {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
        </select>
        <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-1.5 bg-blue-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Simpan</button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-center text-xl font-black uppercase mb-4 border-b-2 border-slate-900 pb-2">Telaah Modul Ajar</h1>
        
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

        <table className="w-full border-collapse text-[10px] mb-4">
          <thead>
            <tr className="bg-slate-900 text-white uppercase">
              <th rowSpan={2} className="px-2 py-3 border border-slate-700 w-8">No</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Komponen Modul</th>
              <th colSpan={3} className="px-2 py-2 border border-slate-700 text-center">Skor</th>
            </tr>
            <tr className="bg-slate-800 text-white text-[8px]">
              <th>2</th><th>1</th><th>0</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-2 border border-slate-200 text-center">{idx + 1}</td>
                <td className="px-4 py-2 border border-slate-200">{item.label}</td>
                {[2, 1, 0].map(v => (
                  <td key={v} className="px-1 py-2 border border-slate-200 text-center">
                    <input type="radio" checked={scores[idx] === v} onChange={() => setScores(p => ({...p, [idx]: v}))} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-slate-50 p-4 rounded-xl border mb-6 text-[10px] font-bold">
           <p className="mb-2">Keterangan : Nilai Akhir = Skor Perolehan x 100 % / Skor Maksimal ({stats.maxScore})</p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-600">
              <span>91% - 100% = Sangat Baik</span>
              <span>81% - 90% = Baik</span>
              <span>71% - 80% = Cukup</span>
              <span>Dibawah 71% = Kurang</span>
           </div>
        </div>

        <div className="space-y-4 mb-12 text-[11px] font-bold uppercase">
           <div className="border-b-2 border-dotted border-slate-400 pb-1">Catatan : <span className="font-normal italic lowercase">{stats.auto.c}</span></div>
           <div className="border-b-2 border-dotted border-slate-400 pb-1">Tindak Lanjut : <span className="font-normal italic lowercase">{stats.auto.tl}</span></div>
        </div>

        <div className="flex justify-between items-start text-xs mt-12 font-bold uppercase">
          <div className="text-center w-64">
             <p className="mb-20">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="underline">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20">Mojokerto, {displayDate}<br/>Guru yang di Supervisi</p>
             <p className="underline">{selectedTeacher?.namaGuru || '................................'}</p>
             <p className="text-[10px]">NIP. {selectedTeacher?.nip || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelaahModulAjar;
