
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const SECTIONS = [
  { group: "A. Kegiatan Pendahuluan", items: [
    { label: "Guru menyiapkan fisik dan psikis pesertadidik dengan menyapa dan memberi salam.", id: 0 },
    { label: "Guru menyampaikan rencana kegiatan baik, individual, kerja kelompok, and melakukan observasi.", id: 1 },
    { label: "Guru mengajukan pertanyaan yang menantang untuk memotivasi Peserta Didik.", id: 2 },
    { label: "Guru menyampaikan manfaat materi pembelajaran", id: 3 },
    { label: "Guru menyampaikan kompetensi yang akan dicapai peserta didik", id: 4 },
    { label: "Guru mengaitkan materi dengan materi pembelajaran sebelumnya", id: 5 },
    { label: "Guru mendemonstrasikan sesuatu yang terkait dengan materi pembelajaran", id: 6 }
  ]},
  { group: "B. Kegiatan Inti", items: [
    { label: "Guru menyesuaikan materi dengan tujuan pembelajaran.", id: 7 },
    { label: "Guru mengkaitkan materi dengan pengetahuan lain yang relevan, perkembangan iptek dan kehidupan nyata", id: 8 },
    { label: "Guru menyajikan pembahasan materi pembelajaran dengan tepat.", id: 9 },
    { label: "Guru menyajikan materi secara sistematis (mudah kesulit, dari konkrit ke abstrak)", id: 10 },
    { label: "Guru melaksanakan pembelajaran sesuaidengan kompetensi yang akan dicapai.", id: 11 },
    { label: "Guru melaksanakan pembelajaran yang menumbuhkan partisipasi aktif peserta didik dalam mengajukan pertanyaan", id: 12 },
    { label: "Guru melaksanakan pembelajaran yang menumbuhkan partisipasi aktif peserta didik dalam mengemukakan pendapat", id: 13 },
    { label: "Guru melaksanakan pembelajaran yang mengembangkan keterampilan peserta didik sesuai dengan materi ajar", id: 14 },
    { label: "Guru melaksanakan pembelajaran yang bersifat kontekstual", id: 15 },
    { label: "Guru melaksanakan pembelajaran sesuaidengan alokasi waktu yang direncanakan", id: 16 },
    { label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Creativity peserta didik", id: 17 },
    { label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Critical Thinking peserta didik", id: 18 },
    { label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Communication peserta didik", id: 19 },
    { label: "Guru melaksanakan pembelajaran yang mengasah kemampuan Collaboration peserta didik", id: 20 },
    { label: "Terciptanya suasana kelas yang kondusif untuk proses belajar mengajar.", id: 21 },
    { label: "Terlaksananya penerapan prinsip disiplin positif dalam menegakkan aturan kelas.", id: 22 },
    { label: "Guru menunjukkan keterampilan dalam penggunaan sumber belajar yang bervariasi.", id: 23 },
    { label: "Guru menunjukkan keterampilan dalam penggunaan media pembelajaran", id: 24 },
    { label: "Guru melibatkan peserta didik dalam pemanfaatan sumber belajar", id: 25 },
    { label: "Guru melibatkan peserta didik dalam pemanfaatan media pembelajaran", id: 26 },
    { label: "Menghasilkan kesan yang menarik", id: 27 },
    { label: "Menggunakan bahasa lisan secara jelas dan lancar", id: 28 },
    { label: "Menggunakan bahasa tulis yang baik dan benar", id: 29 }
  ]},
  { group: "C. Kegiatan Penutup", items: [
    { label: "Guru memfasilitasi dan membimbing pesertadidik merangkum materi pelajaran.", id: 30 },
    { label: "Guru menunjukkan aktivitas belajar yang bertujuan meningkatkan pengetahuan dan keterampilan mengajar.", id: 31 },
    { label: "Guru menunjukkan aktivitas untuk mengevaluasi dan merefleksikan praktik pengajaran.", id: 32 },
    { label: "Terlaksananya penerapan cara, bahan, and/atau pendekatan baru.", id: 33 },
    { label: "Guru melaksanakan tindak lanjut dengan memberikan arahan kegiatan berikutnya.", id: 34 },
    { label: "Guru melaksanakan Penilaian Sikap melalui observasi", id: 35 },
    { label: "Guru melaksanakan Penilaian Pengetahuan melalui tes lisan, tulisan", id: 36 },
    { label: "Guru melaksanakan Penilaian Keterampilan (Kinerja, Projek, Produk, Portofolio)", id: 37 }
  ]}
];

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const PelaksanaanPembelajaran: React.FC<Props> = ({ settings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [materi, setMateri] = useState('');
  
  const [scores, setScores] = useState<Record<number, number>>(
    Array.from({ length: 38 }).reduce((acc: any, _, idx) => ({ ...acc, [idx]: 0 }), {} as any) as Record<number, number>
  );

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-pembelajaran-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores);
        setMateri(saved.materi || '');
      } else {
        setScores(Array.from({ length: 38 }).reduce((acc: any, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));
        setMateri('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const stats = useMemo(() => {
    const totalScore = (Object.values(scores) as number[]).reduce((sum, s) => sum + s, 0);
    const maxScore = 76; 
    const percentage = (totalScore / maxScore) * 100;
    
    let kriteria = 'Kurang';
    if (percentage >= 91) kriteria = 'Sangat Baik';
    else if (percentage >= 81) kriteria = 'Baik';
    else if (percentage >= 71) kriteria = 'Cukup';

    return { totalScore, percentage: percentage.toFixed(2), kriteria };
  }, [scores]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'pembelajaran', settings.semester, {
      scores,
      remarks: {},
      materi
    });
  };

  const exportPDF = () => {
    const element = document.getElementById('pelaksanaan-area');
    // @ts-ignore
    html2pdf().from(element).save(`Pelaksanaan_${selectedTeacher?.namaGuru}.pdf`);
  };

  const exportExcel = () => {
    if (!selectedTeacher) return;
    const headers = "No,Aspek yang Diamati,Skor";
    let rows = "";
    SECTIONS.forEach(s => {
      rows += `\n"${s.group}",,\n`;
      s.items.forEach((item, i) => {
        rows += `${i+1},"${item.label}",${scores[item.id]}\n`;
      });
    });
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Pelaksanaan_${selectedTeacher.namaGuru}.csv`;
    link.click();
  };

  const exportWord = () => {
    const element = document.getElementById('pelaksanaan-area');
    const blob = new Blob(['\ufeff', element?.outerHTML || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Pelaksanaan_${selectedTeacher?.namaGuru}.doc`;
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
          <label className="text-xs font-black text-slate-500 uppercase">Nama Guru:</label>
          <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-emerald-600 outline-none">
            <option value="">-- Pilih Nama Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} disabled={!selectedTeacher} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
          <button onClick={exportExcel} disabled={!selectedTeacher} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Excel</button>
          <button onClick={exportWord} disabled={!selectedTeacher} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-black text-[9px] uppercase shadow">Word</button>
          <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-1.5 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Simpan</button>
        </div>
      </div>

      <div id="pelaksanaan-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <h1 className="text-center text-lg font-black text-slate-900 uppercase border-b-2 border-slate-900 pb-2 mb-4">Instrumen Supervisi Pelaksanaan Pembelajaran</h1>
        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8 italic">Tahun Pelajaran {settings.tahunPelajaran}</p>
        
        <div className="grid grid-cols-2 gap-6 text-[10px] uppercase font-bold mb-8">
          <div className="space-y-2">
             <div className="flex"><span className="w-24 text-slate-500">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
             <div className="flex"><span className="w-24 text-slate-500">Nama Guru</span><span className="font-black text-slate-900">: {selectedTeacher?.namaGuru || '-'}</span></div>
             <div className="flex"><span className="w-24 text-slate-500">Mata Pelajaran</span><span>: {selectedTeacher?.mataPelajaran || '-'}</span></div>
          </div>
          <div className="space-y-2">
             <div className="flex"><span className="w-24 text-slate-500">Hari / Tgl</span><span className="text-emerald-700">: {selectedTeacher?.hari ? `${selectedTeacher.hari}, ${selectedTeacher.tanggal}` : '-'}</span></div>
             <div className="flex"><span className="w-24 text-slate-500">Topik / Tema</span><input value={materi} onChange={e => setMateri(e.target.value)} className="bg-transparent border-b border-slate-200 no-print flex-1" /></div>
          </div>
        </div>

        <table className="w-full border-collapse text-[9px] mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center">
              <th rowSpan={2} className="px-1 py-2 border border-slate-700 w-8">No</th>
              <th rowSpan={2} className="px-4 py-2 border border-slate-700 text-left">Aspek yang Diamati</th>
              <th colSpan={3} className="px-1 py-1 border border-slate-700">Skor</th>
              <th rowSpan={2} className="px-4 py-2 border border-slate-700 text-left">Catatan</th>
            </tr>
            <tr className="bg-slate-800 text-[7px]">
              <th className="border border-slate-700 px-1">2</th>
              <th className="border border-slate-700 px-1">1</th>
              <th className="border border-slate-700 px-1">0</th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section, sIdx) => (
              <React.Fragment key={sIdx}>
                <tr className="bg-slate-100 font-bold uppercase"><td colSpan={6} className="px-4 py-1 border border-slate-200 text-[8px] text-slate-500">{section.group}</td></tr>
                {section.items.map((item, iIdx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-1 py-1 border border-slate-200 text-center font-bold text-slate-400">{iIdx + 1}</td>
                    <td className="px-4 py-1 border border-slate-200">{item.label}</td>
                    {[2, 1, 0].map(v => (
                      <td key={v} className="px-1 py-1 border border-slate-200 text-center"><input type="radio" checked={scores[item.id] === v} onChange={() => setScores(p => ({...p, [item.id]: v}))} /></td>
                    ))}
                    <td className="px-2 py-1 border border-slate-200"></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="bg-slate-50 font-black">
              <td colSpan={2} className="px-4 py-3 border border-slate-200 text-right uppercase">Skor Akhir: {stats.totalScore} / {stats.percentage}%</td>
              <td colSpan={4} className="px-4 py-3 border border-slate-200 text-center text-emerald-700 uppercase italic">Kriteria: {stats.kriteria}</td>
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

export default PelaksanaanPembelajaran;
