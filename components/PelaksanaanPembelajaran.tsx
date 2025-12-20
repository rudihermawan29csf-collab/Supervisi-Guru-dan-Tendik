
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

interface SubItem { id: number; label: string; }
interface AspectGroup { no: string; title: string; items: SubItem[]; }
interface Section { category: string; title: string; groups: AspectGroup[]; }

const formatIndonesianDate = (dateStr?: string) => {
  if (!dateStr) return '..............................';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getAutoFeedback = (percentage: number) => {
  if (percentage >= 91) return {
    catatan: "Pembelajaran berlangsung sangat inspiratif. Guru menguasai kelas dengan sangat baik dan mampu menghidupkan suasana belajar yang aktif.",
    tindakLanjut: "Teruslah berinovasi dalam penggunaan media digital dan manfaatkan platform belajar modern untuk memperkaya interaksi siswa."
  };
  if (percentage >= 81) return {
    catatan: "Guru telah melaksanakan langkah-langkah pembelajaran dengan runut. Motivasi dan apersepsi sudah diberikan secara relevan.",
    tindakLanjut: "Perdalam teknik bertanya tingkat tinggi (Higher Order Thinking) untuk merangsang daya kritis siswa lebih dalam lagi."
  };
  if (percentage >= 71) return {
    catatan: "Kegiatan pembelajaran cukup efektif, namun manajemen waktu pada kegiatan inti perlu diperbaiki agar porsi diskusi siswa lebih besar.",
    tindakLanjut: "Lakukan simulasi pengajaran bersama rekan sejawat (Peer Coaching) khusus untuk teknik pengelolaan kelompok kecil."
  };
  return {
    catatan: "Pembelajaran masih didominasi oleh metode ceramah satu arah. Keterlibatan siswa dalam proses eksplorasi materi masih rendah.",
    tindakLanjut: "Wajib mengikuti pendampingan khusus (klinis) mengenai model-model pembelajaran kooperatif and student-centered learning."
  };
};

const SECTIONS: Section[] = [
  {
    category: "A", title: "Kegiatan Pendahuluan",
    groups: [
      { no: "1", title: "Orientasi", items: [ { id: 1, label: "Guru menyiapkan fisik dan psikis peserta didik dengan menyapa dan memberi salam." }, { id: 2, label: "Guru menyampaikan rencana kegiatan baik, individual, kerja kelompok, dan melakukan observasi." } ] },
      { no: "2", title: "Motivasi", items: [ { id: 3, label: "Guru mengajukan pertanyaan yang menantang untuk memotivasi Peserta Didik." }, { id: 4, label: "Guru menyampaikan manfaat materi pembelajaran" } ] },
      { no: "3", title: "Apersepsi", items: [ { id: 5, label: "Guru menyampaikan kompetensi yang akan dicapai peserta didik" }, { id: 6, label: "Guru mengaitkan materi dengan materi pembelajaran sebelumnya" }, { id: 7, label: "Guru mendemonstrasikan sesuatu yang terkait dengan materi pembelajaran" } ] }
    ]
  },
  {
    category: "B", title: "Kegiatan Inti",
    groups: [
      { no: "1", title: "Penguasaan materi pembelajaran", items: [ { id: 8, label: "Guru menyesuaikan materi dengan tujuan pembelajaran." }, { id: 9, label: "Guru mengkaitkan materi dengan pengetahuan lain yang relevan, perkembangan iptek dan kehidupan nyata" }, { id: 10, label: "Guru menyajikan pembahasan materi pembelajaran dengan tepat." }, { id: 11, label: "Guru menyajikan materi secara sistematis (mudah ke sulit, dari konkrit ke abstrak)" } ] },
      { no: "2", title: "Penerapan strategi pembelajaran", items: [ { id: 12, label: "Guru melaksanakan pembelajaran sesuai dengan kompetensi yang akan dicapai." }, { id: 13, label: "Guru menumbuhkan partisipasi aktif peserta didik dalam mengajukan pertanyaan" }, { id: 14, label: "Guru menumbuhkan partisipasi aktif peserta didik dalam mengemukakan pendapat" }, { id: 15, label: "Guru mengembangkan keterampilan peserta didik sesuai dengan materi ajar" }, { id: 16, label: "Guru melaksanakan pembelajaran yang bersifat kontekstual" }, { id: 17, label: "Guru melaksanakan pembelajaran sesuai dengan alokasi waktu yang direncanakan" } ] },
      { no: "3", title: "Kecakapan Abad 21 (4C)", items: [ { id: 18, label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Creativity" }, { id: 19, label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Critical Thinking" }, { id: 20, label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Communication" }, { id: 21, label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Collaboration" } ] },
      { no: "4", title: "Manajemen kelas", items: [ { id: 22, label: "Terciptanya suasana kelas yang kondusif untuk proses belajar mengajar." }, { id: 23, label: "Terlaksananya penerapan prinsip disiplin positif dalam menegakkan aturan kelas." } ] },
      { no: "5", title: "Pemanfaatan sumber belajar", items: [ { id: 24, label: "Guru menunjukkan keterampilan dalam penggunaan sumber belajar yang bervariasi." }, { id: 25, label: "Guru menunjukkan keterampilan dalam penggunaan media pembelajaran" }, { id: 26, label: "Guru melibatkan peserta didik dalam pemanfaatan sumber belajar" }, { id: 27, label: "Guru melibatkan peserta didik dalam pemanfaatan media pembelajaran" }, { id: 28, label: "Menghasilkan kesan yang menarik" } ] },
      { no: "6", title: "Penggunaan Bahasa", items: [ { id: 29, label: "Menggunakan bahasa lisan secara jelas dan lancar" }, { id: 30, label: "Menggunakan bahasa tulis yang baik dan benar" } ] }
    ]
  },
  {
    category: "C", title: "Kegiatan Penutup",
    groups: [
      { no: "1", title: "Rangkuman, refleksi, dan tindak lanjut", items: [ { id: 31, label: "Guru memfasilitasi dan membimbing peserta didik merangkum materi pelajaran." }, { id: 32, label: "Guru menunjukkan aktivitas belajar yang bertujuan meningkatkan pengetahuan mengajar." }, { id: 33, label: "Guru mengevaluasi dan merefleksikan praktik pengajaran dari sisi dampaknya terhadap belajar murid." }, { id: 34, label: "Terlaksananya penerapan cara, bahan, dan/atau pendekatan baru dalam praktik pengajaran." }, { id: 35, label: "Guru melaksanakan tindak lanjut dengan arahan kegiatan berikutnya." } ] },
      { no: "2", title: "Penilaian Hasil Belajar", items: [ { id: 36, label: "Guru melaksanakan Penilaian Sikap melalui observasi" }, { id: 37, label: "Guru melaksanakan Penilaian Pengetahuan melalui tes lisan, tulisan" }, { id: 38, label: "Guru melaksanakan Penilaian Keterampilan; kinerja, projek, atau produk" } ] }
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

const PelaksanaanPembelajaran: React.FC<Props> = ({ settings, setSettings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<number, number>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [catatan, setCatatan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores).filter(v => typeof v === 'number') as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const maxScore = 76; 
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
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
      const key = `${selectedTeacherId}-pembelajaran-${settings.semester}`;
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
    if (val === 2) autoRem = "Sesuai Skenario";
    else if (val === 1) autoRem = "Kurang Optimal";
    else autoRem = "Tidak Dilakukan";
    setRemarks(prev => ({ ...prev, [id]: autoRem }));
  };

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'pembelajaran', settings.semester, { scores, remarks, catatan, tindakLanjut });
    alert('Hasil supervisi pelaksanaan berhasil disimpan!');
  };

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

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
        <div className="text-center mb-8 border-b-4 border-double border-slate-900 pb-2">
          <h1 className="text-lg font-black uppercase tracking-tight leading-none">Instrumen Supervisi Akademik (Kurikulum Merdeka)</h1>
          <h2 className="text-xl font-bold uppercase tracking-widest mt-1">Supervisi Pelaksanaan Pembelajaran</h2>
        </div>

        <div className="grid grid-cols-1 gap-y-1 text-sm font-bold mb-8">
           <div className="flex items-start"><span className="w-40">Nama Sekolah</span><span className="mr-4">:</span><span className="uppercase">{settings.namaSekolah}</span></div>
           <div className="flex items-start"><span className="w-40">Nama Guru</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.namaGuru || '...................'}</span></div>
           <div className="flex items-start"><span className="w-40">Mata Pelajaran</span><span className="mr-4">:</span><span className="uppercase">{selectedTeacher?.mataPelajaran || '...................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">No</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">Aspek Pelaksanaan Pembelajaran</th>
              <th colSpan={2} className="border-2 border-slate-900 p-1">Ya</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-1 w-16 text-[9px]">Tidak (0)</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-40 text-left">Catatan</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center">
              <th className="border-2 border-slate-900 p-1 w-16 text-[9px]">Sesuai (2)</th>
              <th className="border-2 border-slate-900 p-1 w-16 text-[9px]">Kurang (1)</th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section, sIdx) => (
              <React.Fragment key={sIdx}>
                <tr className="bg-slate-100 font-black">
                  <td className="border-2 border-slate-900 p-2 text-center">{section.category}.</td>
                  <td colSpan={5} className="border-2 border-slate-900 p-2 uppercase">{section.title}</td>
                </tr>
                {section.groups.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    <tr className="bg-slate-50 font-bold italic">
                      <td className="border-2 border-slate-900 p-2 text-center">{group.no}.</td>
                      <td colSpan={5} className="border-2 border-slate-900 p-2">{group.title}</td>
                    </tr>
                    {group.items.map((item, iIdx) => (
                      <tr key={item.id} className="hover:bg-slate-50 align-top">
                        <td className="border-2 border-slate-900"></td>
                        <td className="border-2 border-slate-900 p-2 pl-4">{alphabet[iIdx]}. {item.label}</td>
                        {[2, 1, 0].map(val => (
                          <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(item.id, val)}>
                            <div className={`w-4 h-4 mx-auto border border-slate-900 flex items-center justify-center ${scores[item.id] === val ? 'bg-slate-800 text-white font-black' : 'bg-white'}`}>{scores[item.id] === val && "v"}</div>
                          </td>
                        ))}
                        {[2, 1, 0].map(val => <td key={`p-${val}`} className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === val ? 'v' : ''}</td>)}
                        <td className="border-2 border-slate-900 p-1 italic text-[9px]">{remarks[item.id]}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <tr className="bg-slate-100 font-black">
              <td colSpan={2} className="border-2 border-slate-900 p-2 text-right uppercase">Skor Total / Persentase / Kriteria</td>
              <td colSpan={3} className="border-2 border-slate-900 p-2 text-center text-blue-700">{stats.totalScore} / 76</td>
              <td className="border-2 border-slate-900 bg-emerald-50 text-emerald-800 text-center uppercase tracking-widest">{stats.percentage}% - {stats.kriteria}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-2 border-slate-900 p-4 bg-slate-50">
           <h3 className="text-xs font-black uppercase mb-2 underline">Rubrik Penilaian Observasi:</h3>
           <div className="grid grid-cols-2 gap-4 text-[10px] leading-tight">
              <div className="space-y-1">
                 <p className="font-bold underline uppercase">Kriteria Skor:</p>
                 <p>• Skor 2 : Tindakan guru sangat efektif and sesuai skenario modul.</p>
                 <p>• Skor 1 : Tindakan guru dilakukan namun kurang optimal.</p>
                 <p>• Skor 0 : Tindakan guru tidak dilakukan/tidak terlihat.</p>
              </div>
              <div className="space-y-1">
                 <p className="font-bold underline uppercase">Kriteria Persentase:</p>
                 <p>91% - 100%: Sangat Baik (Kualitas Tinggi)</p>
                 <p>81% - 90%: Baik (Kualitas Memadai)</p>
                 <p>71% - 80%: Cukup (Butuh Perbaikan Ringan)</p>
                 <p>Dibawah 71%: Kurang (Butuh Pendampingan Khusus)</p>
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
                  <p className="underline uppercase font-black">{selectedTeacher?.namaGuru || '................'}</p>
                  <p className="font-mono text-[11px] uppercase">NIP. {selectedTeacher?.nip || '................'}</p>
               </div>
            </div>
            <div className="flex flex-col justify-between h-36">
               <p className="leading-tight uppercase">Mojokerto, {formatIndonesianDate(selectedTeacher?.tanggalPemb)}<br/>Kepala {settings.namaSekolah}</p>
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

export default PelaksanaanPembelajaran;
