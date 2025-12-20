
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

interface ATPItem { id: number; label: string; }
interface ATPGroup { category: string; title: string; items: ATPItem[]; }

const formatIndonesianDate = (dateStr?: string) => {
  if (!dateStr) return '..............................';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getAutoFeedback = (percentage: number) => {
  if (percentage >= 91) return {
    catatan: "ATP disusun dengan sangat sistematis, alur tujuan pembelajaran linear and mencakup seluruh elemen CP.",
    tindakLanjut: "Pertahankan kualitas perumusan ATP and pastikan ketersediaan sumber belajar pendukung yang relevan."
  };
  if (percentage >= 81) return {
    catatan: "ATP sudah memenuhi standar teknis, namun sinkronisasi antar elemen kompetensi perlu sedikit diperhalus.",
    tindakLanjut: "Review kembali bagian kriteria variasi tujuan untuk memastikan tantangan belajar yang lebih merata bagi siswa."
  };
  if (percentage >= 71) return {
    catatan: "ATP sudah mencakup identitas CP, namun urutan penguasaan kompetensi dari mudah ke sulit belum terlihat jelas.",
    tindakLanjut: "Lakukan restrukturisasi alur tujuan agar lebih logis and memudahkan transisi antar materi ajar."
  };
  return {
    catatan: "ATP belum menggambarkan alur pembelajaran yang utuh and elemen Profil Pelajar Pancasila belum terintegrasi.",
    tindakLanjut: "Revisi total dokumen ATP dengan bimbingan dari tim kurikulum atau pengawas sekolah."
  };
};

const ATP_GROUPS: ATPGroup[] = [
  { category: "A", title: "Identitas ATP", items: [{ id: 0, label: "Mencantumkan: nama sekolah, mata pelajaran, Kelas, Semester dan CP." }] },
  { category: "B", title: "Peta Kompetensi dan Tujuan", items: [ { id: 1, label: "Peta Kompetensi sesuai fase usia / pembelajaran" }, { id: 2, label: "Capaian Pembelajaran" }, { id: 3, label: "Tujuan Pembelajaran" } ] },
  { category: "C", title: "Komponen ATP", items: [ { id: 4, label: "ATP mencakup komponen kompetensi" }, { id: 5, label: "ATP mencakup komponen konten" }, { id: 6, label: "ATP mencakup komponen variasi" } ] },
  { category: "D", title: "Kriteria ATP", items: [ { id: 7, label: "Menggambarkan urutan pengembangan kompetensi yang harus dikuasai" }, { id: 8, label: "Alur tujuan pembelajaran linear dari awal hingga akhir fase" }, { id: 9, label: "Alur tujuan menggambarkan tahapan perkembangan antarfase/jenjang" }, { id: 10, label: "Identifikasi elemen Profil Pelajar Pancasila sesuai tujuan" }, { id: 11, label: "Alur Tujuan Pembelajaran secara keseluruhan" } ] }
];

interface Props {
  settings: AppSettings; setSettings: (s: AppSettings) => void; records: TeacherRecord[]; instrumentResults: Record<string, InstrumentResult>; onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const PenelaahanATP: React.FC<Props> = ({ settings, setSettings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<number, number>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [catatan, setCatatan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores).filter(v => typeof v === 'number') as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const maxScore = 24; 
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
      setCatatan(feedback.catatan); setTindakLanjut(feedback.tindakLanjut);
    }
  }, [stats.percentage]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-atp-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores as any || {}); setRemarks(saved.remarks || {}); setCatatan(saved.catatan || ''); setTindakLanjut(saved.tindakLanjut || '');
      } else {
        setScores({}); setRemarks({}); setCatatan(''); setTindakLanjut('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const handleScoreChange = (id: number, val: number) => { 
    setScores(prev => ({ ...prev, [id]: val })); 
    let autoRem = "";
    if (val === 2) autoRem = "Lengkap & Sesuai";
    else if (val === 1) autoRem = "Ada, Tidak Sesuai";
    else autoRem = "Tidak Ada";
    setRemarks(prev => ({ ...prev, [id]: autoRem }));
  };

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'atp', settings.semester, { scores, remarks, catatan, tindakLanjut });
    alert('Hasil penelaahan ATP berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none">
          <option value="">-- Pilih Guru --</option>
          {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
        </select>
        <button onClick={handleSave} disabled={!selectedTeacher} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg">Simpan Hasil</button>
      </div>

      <div className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-8 border-b-4 border-double border-slate-900 pb-2 font-black uppercase">
          <h1 className="leading-none text-lg">Instrumen Supervisi Akademik (Kurikulum Merdeka)</h1>
          <h2 className="text-xl tracking-widest mt-1">Penelaahan Alur Tujuan Pembelajaran</h2>
        </div>

        <div className="grid grid-cols-1 gap-y-1 text-sm font-bold mb-8">
           <div className="flex items-start"><span className="w-40">Nama Sekolah</span><span className="mr-4">:</span><span className="uppercase">{settings.namaSekolah}</span></div>
           <div className="flex items-start"><span className="w-40">Nama Guru</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.namaGuru || '...................'}</span></div>
           <div className="flex items-start"><span className="w-40">Mata Pelajaran</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.mataPelajaran || '...................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[11px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">No</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">Komponen/ Indikator</th>
              <th colSpan={3} className="border-2 border-slate-900 p-1">Penilaian</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-40 text-left">Keterangan</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center">
              <th className="border-2 border-slate-900 p-1 w-20">Sesuai (2)</th>
              <th className="border-2 border-slate-900 p-1 w-20">Tidak Sesuai (1)</th>
              <th className="border-2 border-slate-900 p-1 w-16 text-[9px]">Tidak (0)</th>
            </tr>
          </thead>
          <tbody>
            {ATP_GROUPS.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                <tr className="bg-slate-50 font-black"><td className="border-2 border-slate-900 p-2 text-center">{group.category}.</td><td colSpan={5} className="border-2 border-slate-900 p-2 uppercase">{group.title}</td></tr>
                {group.items.map((item, iIdx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="border-2 border-slate-900 p-2 text-center font-bold">{iIdx + 1}</td><td className="border-2 border-slate-900 p-2">{item.label}</td>
                    {[2, 1, 0].map(val => (
                      <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print font-bold" onClick={() => handleScoreChange(item.id, val)}>
                        <div className={`w-4 h-4 mx-auto border border-slate-900 flex items-center justify-center ${scores[item.id] === val ? 'bg-slate-800 text-white' : 'bg-white'}`}>{scores[item.id] === val && "v"}</div>
                      </td>
                    ))}
                    {[2, 1, 0].map(val => <td key={`p-${val}`} className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === val ? 'v' : ''}</td>)}
                    <td className="border-2 border-slate-900 p-1 italic text-[10px]">{remarks[item.id]}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="bg-slate-100 font-black">
              <td colSpan={2} className="border-2 border-slate-900 p-2 text-right uppercase">Skor Total / Persentase / Kriteria</td>
              <td colSpan={3} className="border-2 border-slate-900 p-2 text-center text-blue-700">{stats.totalScore} / 24</td>
              <td className="border-2 border-slate-900 bg-emerald-50 text-emerald-800 text-center uppercase tracking-widest">{stats.percentage}% - {stats.kriteria}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-2 border-slate-900 p-4 bg-slate-50">
           <h3 className="text-xs font-black uppercase mb-2 underline">Rubrik Telaah ATP:</h3>
           <div className="grid grid-cols-2 gap-4 text-[10px] leading-tight">
              <div className="space-y-1">
                 <p className="font-bold underline uppercase">Skor:</p>
                 <p>• Skor 2 : Komponen lengkap and alur sangat logis.</p>
                 <p>• Skor 1 : Komponen ada namun urutan kurang sistematis.</p>
                 <p>• Skor 0 : Komponen tidak ada atau tidak relevan.</p>
              </div>
              <div className="space-y-1">
                 <p className="font-bold underline uppercase">Ambang Kriteria:</p>
                 <p>91% - 100% : Sangat Baik (Dokumen Model)</p>
                 <p>Dibawah 71% : Kurang (Perlu Revisi Total)</p>
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
               <p className="uppercase leading-tight">Guru yang di Supervisi</p>
               <div>
                  <p className="underline uppercase font-black">{selectedTeacher?.namaGuru || '..........'}</p>
                  <p className="font-mono text-[11px] uppercase mt-1">NIP. {selectedTeacher?.nip || '..........'}</p>
               </div>
            </div>
            <div className="flex flex-col justify-between h-36">
               <p className="leading-tight uppercase">Mojokerto, {formatIndonesianDate(selectedTeacher?.tanggalAdm)}<br/>Kepala {settings.namaSekolah}</p>
               <div>
                  <p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p>
                  <p className="font-mono text-[11px] uppercase mt-1">NIP. {settings.nipKepalaSekolah}</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PenelaahanATP;
