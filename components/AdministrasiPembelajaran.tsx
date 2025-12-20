
import React, { useState, useMemo, useEffect } from 'react';
import { FULL_SCHEDULE, SCHEDULE_TEACHERS } from '../constants';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const COMPONENTS_LIST = [
  "Kalender Pendidikan",
  "Rencana Pekan Efektif (RPE)",
  "Program Tahunan",
  "Program Semester",
  "Alur Tujuan Pembelajaran",
  "Modul Ajar",
  "Jadwal Tatap Muka",
  "Jurnal Mengajar",
  "Daftar Nilai",
  "KKTP",
  "Absensi Siswa",
  "Buku Pegangan Guru",
  "Buku Teks Siswa"
];

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const getAutoText = (percentage: number) => {
  if (percentage >= 91) return { c: "Administrasi sangat lengkap dan sistematis.", tl: "Pertahankan dan lakukan pengimbasan kepada guru lain." };
  if (percentage >= 81) return { c: "Administrasi lengkap sesuai standar Kurikulum Merdeka.", tl: "Tingkatkan ketelitian dalam pengarsipan jurnal mengajar." };
  if (percentage >= 71) return { c: "Administrasi cukup, namun ada beberapa komponen yang perlu direvisi.", tl: "Melengkapi komponen yang kurang dalam waktu 1 minggu." };
  return { c: "Administrasi kurang lengkap, segera lengkapi perangkat pembelajaran.", tl: "Pendampingan intensif oleh kurikulum/kepala sekolah." };
};

const AdministrasiPembelajaran: React.FC<Props> = ({ settings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  
  const [scores, setScores] = useState<Record<number, number>>(
    COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any)
  );
  const [remarks, setRemarks] = useState<Record<number, string>>(
    COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: '' }), {} as any)
  );

  const selectedTeacher = useMemo(() => {
    return records.find(t => t.id === selectedTeacherId);
  }, [selectedTeacherId, records]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores) as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const maxScore = 26; 
    const percentage = (totalScore / maxScore) * 100;
    
    let category = 'Kurang';
    if (percentage >= 91) category = 'Sangat Baik';
    else if (percentage >= 81) category = 'Baik';
    else if (percentage >= 71) category = 'Cukup';

    const auto = getAutoText(percentage);

    return { totalScore, percentage: percentage.toFixed(2), category, auto };
  }, [scores]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-administrasi-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores);
        setRemarks(saved.remarks);
      } else {
        setScores(COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));
        setRemarks(COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: '' }), {} as any));
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'administrasi', settings.semester, {
      scores,
      remarks,
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
        <div className="flex items-center space-x-3">
          <label className="text-xs font-black text-slate-500 uppercase">Pilih Guru:</label>
          <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600">
            <option value="">-- Pilih Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
        </div>
        <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-1.5 bg-blue-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Simpan</button>
      </div>

      <div id="instrument-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
          <h1 className="text-xl font-black text-slate-900 uppercase">Administrasi Pembelajaran</h1>
          <p className="text-xs font-bold text-slate-500 uppercase italic">Tahun Pelajaran {settings.tahunPelajaran}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm mb-8 font-bold uppercase text-[10px]">
          <div className="space-y-2">
            <div className="flex"><span className="w-32 text-slate-500">Nama Guru</span><span>: {selectedTeacher?.namaGuru || '-'}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">NIP</span><span>: {selectedTeacher?.nip || '-'}</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex"><span className="w-32 text-slate-500">Mata Pelajaran</span><span>: {selectedTeacher?.mataPelajaran || '-'}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Hari / Tanggal</span><span>: {selectedTeacher?.hari ? `${selectedTeacher.hari}, ${selectedTeacher.tanggal}` : '-'}</span></div>
          </div>
        </div>

        <table className="w-full border-collapse text-xs mb-4">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-[9px]">
              <th rowSpan={2} className="px-2 py-3 border border-slate-700 w-10 text-center">No</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Komponen Administrasi</th>
              <th colSpan={3} className="px-2 py-2 border border-slate-700 text-center">Kondisi</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Keterangan</th>
            </tr>
            <tr className="bg-slate-800 text-white text-[8px] text-center">
              <th className="px-1 py-2 border border-slate-700">Tidak Ada (0)</th>
              <th className="px-1 py-2 border border-slate-700">Tdk Sesuai (1)</th>
              <th className="px-1 py-2 border border-slate-700">Sesuai (2)</th>
            </tr>
          </thead>
          <tbody>
            {COMPONENTS_LIST.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30">
                <td className="px-2 py-2 border border-slate-200 text-center">{idx + 1}.</td>
                <td className="px-4 py-2 border border-slate-200 font-medium">{item}</td>
                {[0, 1, 2].map(v => (
                  <td key={v} className="px-1 py-2 border border-slate-200 text-center">
                    <input type="radio" checked={scores[idx] === v} onChange={() => setScores(p => ({...p, [idx]: v}))} />
                  </td>
                ))}
                <td className="px-4 py-1 border border-slate-200">
                  <input type="text" value={remarks[idx]} onChange={(e) => setRemarks(p => ({...p, [idx]: e.target.value}))} className="w-full bg-transparent outline-none" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-slate-50 p-4 rounded-xl border mb-6 text-[10px] font-bold">
           <p className="mb-2">Keterangan : Nilai Akhir = Skor Perolehan x 100 % / Skor Maksimal (26)</p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-600">
              <span>91% - 100% = Sangat Baik</span>
              <span>81% - 90% = Baik</span>
              <span>71% - 80% = Cukup</span>
              <span>Dibawah 71% = Kurang</span>
           </div>
           <p className="mt-2 text-blue-700">HASIL: {stats.percentage}% ({stats.category})</p>
        </div>

        <div className="space-y-4 mb-12 text-[11px] font-bold uppercase">
           <div className="border-b-2 border-dotted border-slate-400 pb-1">
              Catatan : <span className="font-normal italic lowercase">{stats.auto.c}</span>
           </div>
           <div className="border-b-2 border-dotted border-slate-400 pb-1">
              Tindak Lanjut : <span className="font-normal italic lowercase">{stats.auto.tl}</span>
           </div>
        </div>

        <div className="flex justify-between items-start text-xs mt-10">
          <div className="text-center w-64 uppercase font-bold">
             <p className="mb-20">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="underline">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64 uppercase font-bold">
             <p className="mb-20">Mojokerto, {displayDate}<br/>Guru yang di Supervisi</p>
             <p className="underline">{selectedTeacher?.namaGuru || '................................'}</p>
             <p className="text-[10px]">NIP. {selectedTeacher?.nip || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrasiPembelajaran;
