
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const ITEMS = [
  "Buku Nilai dan Perencanaan Penilian",
  "Melaksanakan Tes(Penilaian Kognitif) UH, MIDSEM, UAS",
  "Penugasan Terstruktur",
  "Kegiatan Mandiri Tidak Terstruktur(KMTT)",
  "Melaksanakan Penilaian Ketrampilan (Psikomotorik)",
  "Melaksanakan Penilaian Afektif /Sikap",
  "Program dan Pelaksanaan Remedial/Pengayaan",
  "Analisis Hasil Ulangan",
  "Bank Soal/Instrumen Tes"
];

const formatIndonesianDate = (dateStr?: string) => {
  if (!dateStr) return '..............................';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getAutoFeedback = (percentage: number) => {
  if (percentage >= 86) return {
    catatan: "Sangat Memuaskan. Guru memiliki sistem penilaian yang komprehensif, mencakup aspek kognitif, afektif, dan psikomotorik secara seimbang.",
    tindakLanjut: "Pertahankan sistem bank soal yang sudah ada dan tingkatkan kualitas soal ke arah HOTS (Higher Order Thinking Skills)."
  };
  if (percentage >= 71) return {
    catatan: "Baik. Penilaian sudah dilakukan secara rutin, namun analisis hasil ulangan perlu didokumentasikan dengan lebih sistematis.",
    tindakLanjut: "Fokus pada penguatan program remedial dan pengayaan yang lebih terukur berdasarkan hasil analisis nilai."
  };
  if (percentage >= 55) return {
    catatan: "Cukup. Guru sudah melakukan penilaian dasar, namun belum mencakup seluruh aspek keterampilan dan sikap secara berkala.",
    tindakLanjut: "Pendampingan dalam penyusunan instrumen penilaian nontes (rubrik) untuk mengukur kompetensi siswa secara lebih objektif."
  };
  return {
    catatan: "Kurang. Perangkat penilaian belum memadai dan pelaksanaan evaluasi belajar belum terencana dengan baik.",
    tindakLanjut: "Pembinaan intensif mengenai teknik penilaian kelas dan penyusunan instrumen tes yang valid serta reliabel."
  };
};

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const PenilaianPembelajaran: React.FC<Props> = ({ settings, setSettings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<number, number>>({});
  const [presence, setPresence] = useState<Record<number, 'ada' | 'tidak'>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [catatan, setCatatan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores).filter(v => typeof v === 'number') as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const maxScore = 36; 
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    let kriteria = 'Kurang';
    if (percentage >= 86) kriteria = 'Sangat Baik';
    else if (percentage >= 71) kriteria = 'Baik';
    else if (percentage >= 55) kriteria = 'Cukup';
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
      const key = `${selectedTeacherId}-penilaian-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores as any || {});
        setRemarks(saved.remarks || {});
        setCatatan(saved.catatan || '');
        setTindakLanjut(saved.tindakLanjut || '');
        const newPresence: Record<number, 'ada' | 'tidak'> = {};
        ITEMS.forEach((_, idx) => {
           if (saved.scores[idx] !== undefined) newPresence[idx] = 'ada';
           else newPresence[idx] = 'tidak';
        });
        setPresence(newPresence);
      } else {
        setScores({}); setPresence({}); setRemarks({}); setCatatan(''); setTindakLanjut('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const handleScoreChange = (idx: number, val: number) => {
    setScores(prev => ({ ...prev, [idx]: val }));
    setPresence(prev => ({ ...prev, [idx]: 'ada' }));
    let autoRem = "";
    if (val === 4) autoRem = "Sangat Memadai / Terencana";
    else if (val === 3) autoRem = "Memadai / Rutin";
    else if (val === 2) autoRem = "Kurang Memadai";
    else autoRem = "Sangat Kurang / Tidak Jelas";
    setRemarks(prev => ({ ...prev, [idx]: autoRem }));
  };

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'penilaian', settings.semester, { scores, remarks, catatan, tindakLanjut });
    alert('Hasil penilaian pembelajaran berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none">
          <option value="">-- Pilih Guru --</option>
          {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
        </select>
        <button onClick={handleSave} disabled={!selectedTeacher} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg">Simpan Hasil</button>
      </div>

      <div className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-8 border-b-4 border-double border-slate-900 pb-2 font-black uppercase">
          <h1 className="leading-none text-lg">INSTRUMEN SUPERVISI PENILAIAN PEMBELAJARAN</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 text-sm font-bold mb-8">
           <div className="flex items-start"><span className="w-40">Nama Sekolah</span><span className="mr-4">:</span><span className="uppercase">{settings.namaSekolah}</span></div>
           <div className="flex items-start"><span className="w-40">Nama Guru</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.namaGuru || '...................'}</span></div>
           <div className="flex items-start"><span className="w-40">Mata Pelajaran</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.mataPelajaran || '...................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">No</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">PERTANYAAN</th>
              <th colSpan={2} className="border-2 border-slate-900 p-1">Pemantauan</th>
              <th colSpan={4} className="border-2 border-slate-900 p-1">Penilaian (1-4)</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-32 text-left">Keterangan</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center uppercase">
              <th className="border-2 border-slate-900 p-1 w-10">ada</th>
              <th className="border-2 border-slate-900 p-1 w-10">tidak</th>
              <th className="border-2 border-slate-900 p-1 w-8">4</th>
              <th className="border-2 border-slate-900 p-1 w-8">3</th>
              <th className="border-2 border-slate-900 p-1 w-8">2</th>
              <th className="border-2 border-slate-900 p-1 w-8">1</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="border-2 border-slate-900 p-2 text-center font-bold">{idx + 1}</td>
                <td className="border-2 border-slate-900 p-2">{item}</td>
                <td className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print font-black" onClick={() => setPresence(p => ({...p, [idx]: 'ada'}))}>{presence[idx] === 'ada' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print font-black" onClick={() => {setPresence(p => ({...p, [idx]: 'tidak'})); setScores(s => {const ns={...s}; delete ns[idx]; return ns;})}}>{presence[idx] === 'tidak' ? 'v' : ''}</td>
                {[4,3,2,1].map(val => (
                  <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(idx, val)}>
                    <div className={`w-4 h-4 mx-auto border border-slate-900 flex items-center justify-center ${scores[idx] === val ? 'bg-slate-800 text-white font-black' : 'bg-white'}`}>
                      {scores[idx] === val && "v"}
                    </div>
                  </td>
                ))}
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{presence[idx] === 'ada' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{presence[idx] === 'tidak' ? 'v' : ''}</td>
                {[4,3,2,1].map(val => <td key={`p-${val}`} className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[idx] === val ? 'v' : ''}</td>)}
                <td className="border-2 border-slate-900 p-1 italic text-[9px]">{remarks[idx]}</td>
              </tr>
            ))}
            <tr className="bg-slate-100 font-black">
              <td colSpan={2} className="border-2 border-slate-900 p-2 text-right uppercase">Skor Total (Max: 36)</td>
              <td colSpan={2} className="border-2 border-slate-900"></td>
              <td colSpan={4} className="border-2 border-slate-900 p-2 text-center text-blue-700">{stats.totalScore}</td>
              <td className="border-2 border-slate-900 text-center text-emerald-700">{stats.percentage}% - {stats.kriteria}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-2 border-slate-900 p-4 bg-slate-50">
           <h3 className="text-xs font-black uppercase mb-2 underline">Kriteria Penilaian:</h3>
           <div className="grid grid-cols-2 gap-4 text-[10px] leading-tight">
              <div className="space-y-1">
                 <p className="font-bold uppercase underline">Bobot Skor (1-4):</p>
                 <p>4: Sangat Baik / Selalu / Lengkap</p>
                 <p>3: Baik / Sering / Cukup Lengkap</p>
                 <p>2: Cukup / Jarang / Kurang Lengkap</p>
                 <p>1: Kurang / Tidak Pernah / Tidak Lengkap</p>
              </div>
              <div className="space-y-1">
                 <p className="font-bold uppercase underline">Predikat Hasil Akhir:</p>
                 <p>86% - 100%: Sangat Baik (A)</p>
                 <p>71% - 85%: Baik (B)</p>
                 <p>55% - 70%: Cukup (C)</p>
                 <p>Dibawah 55%: Kurang (D)</p>
              </div>
           </div>
        </div>

        <div className="mt-8 space-y-4">
           <div className="border-b border-slate-400 pb-1">
              <h3 className="text-sm font-bold uppercase tracking-tighter text-blue-700">Catatan :</h3>
              <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium" />
           </div>
           <div className="border-b border-slate-400 pb-1">
              <h3 className="text-sm font-bold uppercase tracking-tighter text-emerald-700">Tindak Lanjut :</h3>
              <textarea value={tindakLanjut} onChange={e => setTindakLanjut(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium" />
           </div>
        </div>

        <div className="mt-12 grid grid-cols-2 text-sm font-bold tracking-tight text-center">
            <div className="flex flex-col justify-between h-36">
               <p className="uppercase leading-tight">Pengawas / Supervisor</p>
               <div>
                  <p className="underline uppercase font-black text-blue-800">{settings.namaPengawas}</p>
                  <p className="font-mono text-[11px] uppercase mt-1">NIP. {settings.nipPengawas}</p>
               </div>
            </div>
            <div className="flex flex-col justify-between h-36">
               <p className="leading-tight uppercase">Mojokerto, {formatIndonesianDate(selectedTeacher?.tanggalPemb)}<br/>Guru Mata Pelajaran</p>
               <div>
                  <p className="underline uppercase font-black">{selectedTeacher?.namaGuru || '________________'}</p>
                  <p className="font-mono text-[11px] uppercase">NIP. {selectedTeacher?.nip || '................'}</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PenilaianPembelajaran;
