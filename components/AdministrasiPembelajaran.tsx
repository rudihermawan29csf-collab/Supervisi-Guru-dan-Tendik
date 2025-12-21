
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';
import { SCHEDULE_TEACHERS, FULL_SCHEDULE } from '../constants';

const COMPONENTS_LIST = [
  "Kalender Pendidikan", "Rencana Pekan Efektif (RPE)", "Program Tahunan", "Program Semester",
  "Alur Tujuan Pembelajaran", "Modul Ajar", "Jadwal Tatap Muka", "Jurnal Mengajar",
  "Daftar Nilai", "KKTP", "Absensi Siswa", "Buku Pegangan Guru", "Buku Teks Siswa"
];

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const AdministrasiPembelajaran: React.FC<Props> = ({ settings, setSettings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<number, number>>({});
  const [catatan, setCatatan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  const jamTatapMuka = useMemo(() => {
    if (!selectedTeacher) return 0;
    const code = SCHEDULE_TEACHERS.find(t => t.nama === selectedTeacher.namaGuru)?.kode || '';
    let count = 0;
    FULL_SCHEDULE.forEach(day => day.rows.forEach(row => {
      if (row.classes) Object.values(row.classes).forEach(c => { if (c === code) count++; });
    }));
    return count;
  }, [selectedTeacher]);

  const stats = useMemo(() => {
    // Fix: Explicitly casting Object.values to number[] to resolve 'unknown' type errors in reduce and arithmetic operations.
    const scoreValues = Object.values(scores) as number[];
    const total = scoreValues.reduce((a, b) => a + b, 0);
    const perc = Math.round((total / 26) * 100);
    let pred = "Kurang";
    if (perc >= 91) pred = "Sangat Baik";
    else if (perc >= 81) pred = "Baik";
    else if (perc >= 71) pred = "Cukup";
    return { total, perc, pred };
  }, [scores]);

  useEffect(() => {
    if (selectedTeacherId) {
      if (stats.perc >= 91) {
        setCatatan("Seluruh dokumen administrasi lengkap dan sesuai standar kurikulum merdeka.");
        setTindakLanjut("Pertahankan konsistensi kinerja.");
      } else if (stats.perc >= 71) {
        setCatatan("Administrasi cukup lengkap, beberapa poin perlu penyesuaian detail.");
        setTindakLanjut("Lengkapi rincian pada jurnal dan KKTP.");
      } else {
        setCatatan("Banyak dokumen administrasi yang belum tersedia.");
        setTindakLanjut("Pembinaan intensif dalam penyusunan perangkat ajar.");
      }
    }
  }, [stats.perc, selectedTeacherId]);

  const handleScore = (idx: number, val: number) => setScores(p => ({ ...p, [idx]: val }));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm no-print">
        <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600">
          <option value="">-- Pilih Guru --</option>
          {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
        </select>
        <button onClick={() => window.print()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase">Cetak / Simpan</button>
      </div>

      <div className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900 font-serif">
        <div className="text-center mb-8 border-b-4 border-double border-slate-900 pb-2">
          <h1 className="text-lg font-black uppercase leading-none">Instrumen Supervisi Akademik (Kurikulum Merdeka)</h1>
          <h2 className="text-xl font-bold uppercase mt-1">Administrasi Pembelajaran</h2>
        </div>

        <div className="grid grid-cols-1 gap-1 text-sm font-bold mb-8">
           <div className="flex"><span className="w-48">Nama Sekolah</span><span className="mr-2">:</span><span className="uppercase">{settings.namaSekolah}</span></div>
           <div className="flex"><span className="w-48">Nama Guru</span><span className="mr-2">:</span><span className="uppercase">{selectedTeacher?.namaGuru || '................'}</span></div>
           <div className="flex"><span className="w-48">Mata Pelajaran</span><span className="mr-2">:</span><span className="uppercase">{selectedTeacher?.mataPelajaran || '................'}</span></div>
           <div className="flex"><span className="w-48">Jumlah Jam Tatap Muka</span><span className="mr-2">:</span><span>{jamTatapMuka} Jam</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-center font-black">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">No</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">Komponen Administrasi Pembelajaran</th>
              <th colSpan={3} className="border-2 border-slate-900 p-1 text-white">Kondisi</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-32">Keterangan</th>
            </tr>
            <tr className="bg-slate-800 text-white font-bold text-[9px]">
              <th className="border-2 border-slate-900 p-1">Tidak Ada (0)</th>
              <th className="border-2 border-slate-900 p-1">Ada Tdk Sesuai (1)</th>
              <th className="border-2 border-slate-900 p-1">Ada Sesuai (2)</th>
            </tr>
          </thead>
          <tbody>
            {COMPONENTS_LIST.map((item, idx) => (
              <tr key={idx}>
                <td className="border-2 border-slate-900 p-2 text-center">{idx + 1}.</td>
                <td className="border-2 border-slate-900 p-2">{item}</td>
                {[0, 1, 2].map(val => (
                  <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScore(idx, val)}>
                    <div className={`w-5 h-5 mx-auto border border-slate-900 flex items-center justify-center ${scores[idx] === val ? 'bg-slate-800 text-white' : ''}`}>
                      {scores[idx] === val && "v"}
                    </div>
                  </td>
                ))}
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[idx] === 0 ? "v" : ""}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[idx] === 1 ? "v" : ""}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[idx] === 2 ? "v" : ""}</td>
                <td className="border-2 border-slate-900 p-1 text-center italic">{scores[idx] === 2 ? "Lengkap" : scores[idx] === 1 ? "Revisi" : ""}</td>
              </tr>
            ))}
            <tr className="bg-slate-100 font-black">
              <td colSpan={2} className="border-2 border-slate-900 p-2 text-right">Skor Perolehan / Nilai Akhir</td>
              <td colSpan={3} className="border-2 border-slate-900 p-2 text-center text-blue-700">{stats.total} ({stats.perc}%)</td>
              <td className="border-2 border-slate-900 p-2 text-center uppercase">{stats.pred}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 space-y-4">
           <div className="border-b-2 border-slate-400 pb-1">
              <h3 className="text-sm font-bold uppercase">Catatan :</h3>
              <p className="text-sm italic min-h-[40px]">{catatan}</p>
           </div>
           <div className="border-b-2 border-slate-400 pb-1">
              <h3 className="text-sm font-bold uppercase">Tindak Lanjut :</h3>
              <p className="text-sm italic min-h-[40px]">{tindakLanjut}</p>
           </div>
        </div>

        <div className="mt-12 grid grid-cols-2 text-sm font-bold text-center">
            <div className="flex flex-col justify-between h-36">
               <p className="uppercase">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
               <div>
                  <p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p>
                  <p className="font-mono text-xs uppercase">NIP. {settings.nipKepalaSekolah}</p>
               </div>
            </div>
            <div className="flex flex-col justify-between h-36">
               <p className="uppercase">Mojokerto, {selectedTeacher?.tanggalAdm || '................'}<br/>Guru yang di Supervisi</p>
               <div>
                  <p className="underline uppercase font-black">{selectedTeacher?.namaGuru || '................'}</p>
                  <p className="font-mono text-xs uppercase">NIP. {selectedTeacher?.nip || '................'}</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrasiPembelajaran;
