
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';
import { FULL_SCHEDULE, SCHEDULE_TEACHERS } from '../constants';

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
  setSettings: (s: AppSettings) => void;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const formatIndonesianDate = (dateStr?: string) => {
  if (!dateStr) return '..............................';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getAutoFeedback = (percentage: number) => {
  if (percentage >= 91) return {
    catatan: "Sangat baik, seluruh dokumen administrasi lengkap and disusun sesuai standar Kurikulum Merdeka.",
    tindakLanjut: "Pertahankan konsistensi dan bagikan praktik baik (best practice) dalam penyusunan perangkat kepada rekan sejawat."
  };
  if (percentage >= 81) return {
    catatan: "Baik, administrasi sudah lengkap namun perlu sedikit penyempurnaan pada detail teknis pemetaan materi.",
    tindakLanjut: "Lakukan review mandiri secara berkala untuk memastikan relevansi perangkat dengan perkembangan belajar siswa."
  };
  if (percentage >= 71) return {
    catatan: "Cukup, beberapa komponen administrasi utama sudah ada namun pengembangannya masih bersifat umum.",
    tindakLanjut: "Pendampingan intensif oleh Guru Pamong/Senior dalam menyusun instrumen penilaian dan KKTP yang lebih variatif."
  };
  return {
    catatan: "Kurang, banyak perangkat administrasi yang belum lengkap atau belum disesuaikan dengan kurikulum operasional sekolah.",
    tindakLanjut: "Pembinaan khusus melalui supervisi klinis dan diwajibkan mengikuti workshop penyusunan perangkat ajar."
  };
};

const AdministrasiPembelajaran: React.FC<Props> = ({ settings, setSettings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<number, number>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [catatan, setCatatan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  const calculatedHours = useMemo(() => {
    if (!selectedTeacher) return 0;
    const teacherInitials = SCHEDULE_TEACHERS.find(t => t.nama === selectedTeacher.namaGuru)?.kode || '';
    if (!teacherInitials) return 0;
    let count = 0;
    FULL_SCHEDULE.forEach(day => {
      day.rows.forEach(row => {
        if (row.classes) {
          Object.values(row.classes).forEach(code => {
            if (code.endsWith(teacherInitials)) count++;
          });
        }
      });
    });
    return count;
  }, [selectedTeacher]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores).filter(v => typeof v === 'number') as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const maxScore = 26;
    const percentage = Math.round((totalScore / maxScore) * 100);
    let kriteria = 'Kurang';
    if (percentage >= 91) kriteria = 'Sangat Baik';
    else if (percentage >= 81) kriteria = 'Baik';
    else if (percentage >= 71) kriteria = 'Cukup';
    return { totalScore, maxScore, percentage, kriteria };
  }, [scores]);

  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      const feedback = getAutoFeedback(stats.percentage);
      setCatatan(feedback.catatan);
      setTindakLanjut(feedback.tindakLanjut);
    }
  }, [stats.percentage]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-administrasi-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores as any || {});
        setRemarks(saved.remarks || {});
        setCatatan(saved.catatan || '');
        setTindakLanjut(saved.tindakLanjut || '');
      } else {
        setScores({});
        setRemarks({});
        setCatatan('');
        setTindakLanjut('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const handleScoreChange = (idx: number, val: number) => {
    setScores(prev => ({ ...prev, [idx]: val }));
    let autoRem = "";
    if (val === 2) autoRem = "Ada & Sesuai Kurikulum";
    else if (val === 1) autoRem = "Ada, Perlu Penyempurnaan";
    else autoRem = "Dokumen Belum Tersedia";
    setRemarks(prev => ({ ...prev, [idx]: autoRem }));
  };

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'administrasi', settings.semester, {
      scores,
      remarks,
      materi: String(calculatedHours),
      catatan,
      tindakLanjut
    });
    alert('Hasil administrasi pembelajaran berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none">
            <option value="">-- Pilih Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
        </div>
        <button onClick={handleSave} disabled={!selectedTeacher} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg">Simpan Hasil</button>
      </div>

      <div id="instr-adm-export" className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-8 border-b-4 border-double border-slate-900 pb-2">
          <h1 className="text-lg font-black uppercase tracking-tight leading-none">Instrumen Supervisi Akademik (Kurikulum Merdeka)</h1>
          <h2 className="text-xl font-bold uppercase tracking-widest mt-1">Administrasi Pembelajaran</h2>
        </div>

        <div className="grid grid-cols-1 gap-y-1 text-sm font-bold mb-8">
           <div className="flex items-start"><span className="w-48">Nama Sekolah</span><span className="mr-4">:</span><span className="uppercase">{settings.namaSekolah}</span></div>
           <div className="flex items-start"><span className="w-48">Nama Guru</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.namaGuru || '...........................................'}</span></div>
           <div className="flex items-start"><span className="w-48">Mata Pelajaran</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.mataPelajaran || '...........................................'}</span></div>
           <div className="flex items-start"><span className="w-48">Jumlah Jam Tatap Muka</span><span className="mr-4">:</span><span className="font-black text-blue-700">{calculatedHours || '0'} Jam</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[11px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">No</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">Komponen Administrasi Pembelajaran</th>
              <th colSpan={3} className="border-2 border-slate-900 p-1">Kondisi</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-48 text-left">Keterangan</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center">
              <th className="border-2 border-slate-900 p-1 w-20 text-[9px]">Tidak Ada (0)</th>
              <th className="border-2 border-slate-900 p-1 w-20 text-[9px]">Kurang (1)</th>
              <th className="border-2 border-slate-900 p-1 w-20 text-[9px]">Sesuai (2)</th>
            </tr>
          </thead>
          <tbody>
            {COMPONENTS_LIST.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="border-2 border-slate-900 p-2 text-center font-bold">{idx + 1}.</td>
                <td className="border-2 border-slate-900 p-2">{item}</td>
                {[0, 1, 2].map(val => (
                  <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(idx, val)}>
                    <div className={`w-5 h-5 mx-auto border border-slate-900 flex items-center justify-center ${scores[idx] === val ? 'bg-slate-800 text-white font-black' : 'bg-white'}`}>
                      {scores[idx] === val && "v"}
                    </div>
                  </td>
                ))}
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[idx] === 0 ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[idx] === 1 ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[idx] === 2 ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 italic text-[10px]">{remarks[idx]}</td>
              </tr>
            ))}
            <tr className="bg-slate-100 font-black">
              <td colSpan={2} className="border-2 border-slate-900 p-2 text-right uppercase">Skor Total</td>
              <td colSpan={3} className="border-2 border-slate-900 p-2 text-center text-blue-700">{stats.totalScore}</td>
              <td className="border-2 border-slate-900 bg-slate-200">Max: 26</td>
            </tr>
            <tr className="bg-white font-black">
              <td colSpan={2} className="border-2 border-slate-900 p-2 text-right uppercase italic">Ketercapaian</td>
              <td colSpan={3} className="border-2 border-slate-900 p-2 text-center text-emerald-700 text-sm">{stats.percentage}%</td>
              <td className="border-2 border-slate-900 bg-emerald-50 text-emerald-800 text-center uppercase tracking-widest">{stats.kriteria}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-2 border-slate-900 p-4 bg-slate-50">
           <h3 className="text-xs font-black uppercase mb-2 underline">Rubrik Penilaian & Predikat:</h3>
           <div className="grid grid-cols-2 gap-4 text-[10px] leading-tight">
              <div className="space-y-1">
                 <p className="font-bold">Kriteria Skor:</p>
                 <p>• Skor 2 : Jika komponen ada dan sesuai standar kurikulum.</p>
                 <p>• Skor 1 : Jika komponen ada namun tidak lengkap/sesuai.</p>
                 <p>• Skor 0 : Jika komponen tidak tersedia/tidak ada.</p>
              </div>
              <div className="space-y-1">
                 <p className="font-bold">Kriteria Persentase (Predikat):</p>
                 <div className="flex justify-between w-48"><span>91% - 100%</span><span>: Sangat Baik (A)</span></div>
                 <div className="flex justify-between w-48"><span>81% - 90%</span><span>: Baik (B)</span></div>
                 <div className="flex justify-between w-48"><span>71% - 80%</span><span>: Cukup (C)</span></div>
                 <div className="flex justify-between w-48"><span>Dibawah 71%</span><span>: Kurang (D)</span></div>
              </div>
           </div>
        </div>

        <div className="mt-6 space-y-4">
           <div className="border-b border-slate-400 pb-1">
              <h3 className="text-sm font-bold uppercase tracking-tighter text-blue-700">Catatan :</h3>
              <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium" placeholder="Otomatis terisi..." />
           </div>
           <div className="border-b border-slate-400 pb-1">
              <h3 className="text-sm font-bold uppercase tracking-tighter text-emerald-700">Tindak Lanjut :</h3>
              <textarea value={tindakLanjut} onChange={e => setTindakLanjut(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium" placeholder="Otomatis terisi..." />
           </div>
        </div>

        <div className="mt-12 grid grid-cols-2 text-sm font-bold tracking-tight text-center">
            <div className="flex flex-col justify-between h-36">
               <p className="uppercase leading-tight">Guru yang di Supervisi</p>
               <div>
                  <p className="underline uppercase font-black">{selectedTeacher?.namaGuru || '...................'}</p>
                  <p className="font-mono text-[11px] uppercase">NIP. {selectedTeacher?.nip || '...................'}</p>
               </div>
            </div>
            <div className="flex flex-col justify-between h-36">
               <p className="leading-tight uppercase">Mojokerto, {formatIndonesianDate(selectedTeacher?.tanggalAdm)}<br/>Kepala {settings.namaSekolah}</p>
               <div>
                  <p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p>
                  <p className="font-mono text-[11px] uppercase">NIP. {settings.nipKepalaSekolah}</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrasiPembelajaran;
