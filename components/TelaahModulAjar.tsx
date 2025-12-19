
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const ITEMS = [
  { group: "A. Identitas Mata Pelajaran", label: "Nama penyusun, institusi, dan tahun disusunnya, kelas, alokasi waktu", id: 0 },
  { group: "B. Kompetensi Awal dan Profil Pelajar Pancasila", label: "Kompetensi Awal", id: 1 },
  { group: "B. Kompetensi Awal dan Profil Pelajar Pancasila", label: "Profil Pelajar Pancasila", id: 2 },
  { group: "C. Sarana dan Prasarana", label: "Kesesuaian penggunaan fasilitas penunjang kegiatan pembelajaran", id: 3 },
  { group: "C. Sarana dan Prasarana", label: "Kesesuaian materi dan sumber bahan ajar lain yang relevan", id: 4 },
  { group: "D. Target Peserta Didik", label: "Penentuan target peserta didik yang jelas", id: 5 },
  { group: "E. Model Pembelajaran", label: "Model pembelajaran tatap muka", id: 6 },
  { group: "E. Model Pembelajaran", label: "Model pembelajaran blended", id: 7 },
  { group: "F. Komponen Pembelajaan", label: "Ketepatan Tujuan Pembelajaran", id: 8 },
  { group: "F. Komponen Pembelajaan", label: "Pemahaman Bermakna", id: 9 },
  { group: "F. Komponen Pembelajaan", label: "Pertanyaan Pemantik", id: 10 },
  { group: "F. Komponen Pembelajaan", label: "Persiapan Pembelajaran", id: 11 },
  { group: "G. Skenario Pembelajaran", label: "Kegiatan pendahuluan: Motivasi dan Apersepsi", id: 12 },
  { group: "G. Skenario Pembelajaran", label: "Memfasilitasi kegiatan siswa untuk mengamati, mendengar dan menyimak", id: 13 },
  { group: "G. Skenario Pembelajaran", label: "Mendorong siswa untuk bertanya apa, mengapa dan bagaimana", id: 14 },
  { group: "G. Skenario Pembelajaran", label: "Membimbing siswa untuk mengumpulkan informasi/ eksplorasi", id: 15 },
  { group: "G. Skenario Pembelajaran", label: "Membimbing siswa untuk menyimpulkan/mensintesa data", id: 16 },
  { group: "G. Skenario Pembelajaran", label: "Memotivasi siswa untuk mengomunikasikan", id: 17 },
  { group: "G. Skenario Pembelajaran", label: "Kegiatan penutup: rangkuman, refleksi, dan tindak lanjut", id: 18 },
  { group: "H. Rancangan Penilaian", label: "Kesesuaian bentuk, tehnik dan instrument dengan tujuan", id: 19 },
  { group: "I. Pembelajaran Remedial", label: "Merumuskan kegiatan remedial sesuai karakteristik", id: 20 },
  { group: "J. Pembelajaran Pengayaan", label: "Merumuskan kegiatan pengayaan sesuai karakteristik", id: 21 },
  { group: "K. Lampiran", label: "Lembar Kerja Peserta Didik (LKPD)", id: 22 },
  { group: "K. Lampiran", label: "Glosarium & Daftar Pustaka", id: 23 }
];

interface Props {
  settings: AppSettings;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const TelaahModulAjar: React.FC<Props> = ({ settings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [kelasSemester, setKelasSemester] = useState('');
  
  const [scores, setScores] = useState<Record<number, number>>(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-modul-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores);
        setKelasSemester(saved.kelasSemester || '');
      } else {
        setScores(ITEMS.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));
        setKelasSemester('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const stats = useMemo(() => {
    const totalScore = (Object.values(scores) as number[]).reduce((sum, s) => sum + s, 0);
    const maxScore = 48; 
    const percentage = (totalScore / maxScore) * 100;
    
    let kriteria = 'Kurang';
    if (percentage >= 91) kriteria = 'Sangat Baik';
    else if (percentage >= 81) kriteria = 'Baik';
    else if (percentage >= 71) kriteria = 'Cukup';

    return { totalScore, percentage: percentage.toFixed(2), kriteria };
  }, [scores]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'modul', settings.semester, {
      scores,
      remarks: {},
      kelasSemester
    });
  };

  const exportPDF = () => {
    const element = document.getElementById('modul-area');
    // @ts-ignore
    html2pdf().from(element).save(`ModulAjar_${selectedTeacher?.namaGuru}.pdf`);
  };

  const exportExcel = () => {
    if (!selectedTeacher) return;
    const headers = "No,Komponen Modul Ajar,Skor";
    const rows = ITEMS.map((item, idx) => `${idx+1},"${item.label}",${scores[idx]}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `ModulAjar_${selectedTeacher.namaGuru}.csv`;
    link.click();
  };

  const exportWord = () => {
    const element = document.getElementById('modul-area');
    const blob = new Blob(['\ufeff', element?.outerHTML || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ModulAjar_${selectedTeacher?.namaGuru}.doc`;
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
          <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-orange-600 outline-none">
            <option value="">-- Pilih Nama Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} disabled={!selectedTeacher} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
          <button onClick={exportExcel} disabled={!selectedTeacher} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Excel</button>
          <button onClick={exportWord} disabled={!selectedTeacher} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-black text-[9px] uppercase shadow">Word</button>
          <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-1.5 bg-orange-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Simpan</button>
        </div>
      </div>

      <div id="modul-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <h1 className="text-center text-lg font-black text-slate-900 uppercase border-b-2 border-slate-900 pb-2 mb-4 leading-tight">Instrumen Supervisi Akademik: Telaah Modul Ajar</h1>
        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8 italic">Tahun Pelajaran {settings.tahunPelajaran}</p>
        
        <div className="grid grid-cols-2 gap-6 text-[10px] uppercase font-bold mb-8">
          <div className="space-y-2">
             <div className="flex"><span className="w-24 text-slate-500">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
             <div className="flex"><span className="w-24 text-slate-500">Nama Guru</span><span className="font-black text-slate-900">: {selectedTeacher?.namaGuru || '-'}</span></div>
          </div>
          <div className="space-y-2">
             <div className="flex"><span className="w-24 text-slate-500">Mata Pelajaran</span><span>: {selectedTeacher?.mataPelajaran || '-'}</span></div>
             <div className="flex"><span className="w-24 text-slate-500">Hari / Tgl</span><span className="text-orange-700">: {selectedTeacher?.hari ? `${selectedTeacher.hari}, ${selectedTeacher.tanggal}` : '-'}</span></div>
          </div>
        </div>

        <table className="w-full border-collapse text-[8px] mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center">
              <th rowSpan={2} className="px-1 py-2 border border-slate-700 w-8">No</th>
              <th rowSpan={2} className="px-4 py-2 border border-slate-700 text-left">Komponen Modul Ajar</th>
              <th colSpan={3} className="px-1 py-1 border border-slate-700">Skor</th>
              <th rowSpan={2} className="px-4 py-2 border border-slate-700 text-left">Catatan</th>
            </tr>
            <tr className="bg-slate-800 text-white text-[7px]">
              <th className="border border-slate-700 px-1">2</th>
              <th className="border border-slate-700 px-1">1</th>
              <th className="border border-slate-700 px-1">0</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, idx) => (
              <React.Fragment key={idx}>
                {(idx === 0 || ITEMS[idx-1].group !== item.group) && (
                  <tr className="bg-slate-100 font-bold uppercase"><td colSpan={6} className="px-4 py-1 border border-slate-200 text-[7px] text-slate-500">{item.group}</td></tr>
                )}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-1 py-1 border border-slate-200 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-1 border border-slate-200">{item.label}</td>
                  {[2, 1, 0].map(v => (
                    <td key={v} className="px-1 py-1 border border-slate-200 text-center"><input type="radio" checked={scores[idx] === v} onChange={() => setScores(p => ({...p, [idx]: v}))} /></td>
                  ))}
                  <td className="px-2 py-1 border border-slate-200"></td>
                </tr>
              </React.Fragment>
            ))}
            <tr className="bg-slate-50 font-black text-slate-900">
              <td colSpan={2} className="px-4 py-3 border border-slate-200 text-right uppercase">Skor: {stats.totalScore} ({stats.percentage}%)</td>
              <td colSpan={4} className="px-4 py-3 border border-slate-200 text-center text-orange-700 uppercase italic">Kriteria: {stats.kriteria}</td>
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

export default TelaahModulAjar;
