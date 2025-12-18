
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

const AdministrasiPembelajaran: React.FC<Props> = ({ settings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [catatan, setCatatan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  
  const [scores, setScores] = useState<Record<number, number>>(
    COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any)
  );
  const [remarks, setRemarks] = useState<Record<number, string>>(
    COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: '' }), {} as any)
  );

  const selectedTeacher = useMemo(() => {
    return records.find(t => t.id === selectedTeacherId);
  }, [selectedTeacherId, records]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-administrasi-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setScores(saved.scores);
        setRemarks(saved.remarks);
        setCatatan(saved.catatan || '');
        setTindakLanjut(saved.tindakLanjut || '');
      } else {
        setScores(COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {} as any));
        setRemarks(COMPONENTS_LIST.reduce((acc, _, idx) => ({ ...acc, [idx]: '' }), {} as any));
        setCatatan('');
        setTindakLanjut('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const jamTatapMuka = useMemo(() => {
    if (!selectedTeacher) return 0;
    const teacherCodeObj = SCHEDULE_TEACHERS.find(t => t.nama === selectedTeacher.namaGuru);
    if (!teacherCodeObj) return 0;
    
    const initials = teacherCodeObj.kode;
    let total = 0;
    FULL_SCHEDULE.forEach(day => {
      day.rows.forEach(row => {
        if (row.classes) {
          Object.values(row.classes).forEach(code => {
            if (code.endsWith(initials)) total++;
          });
        }
      });
    });
    return total;
  }, [selectedTeacher]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores) as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const maxScore = 26; 
    const percentage = (totalScore / maxScore) * 100;
    
    let category = 'Kurang';
    if (percentage >= 91) category = 'Sangat Baik';
    else if (percentage >= 81) category = 'Baik';
    else if (percentage >= 71) category = 'Cukup';

    return { totalScore, percentage: percentage.toFixed(2), category };
  }, [scores]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'administrasi', settings.semester, {
      scores,
      remarks,
      catatan,
      tindakLanjut
    });
  };

  const exportExcel = () => {
    if (!selectedTeacher) return;
    const headers = "No,Komponen Administrasi,Skor,Keterangan";
    const rows = COMPONENTS_LIST.map((item, idx) => `${idx+1},"${item}",${scores[idx]},"${remarks[idx]}"`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Adm_Pembelajaran_${selectedTeacher.namaGuru}.csv`;
    link.click();
  };

  const exportWord = () => {
    if (!selectedTeacher) return;
    const element = document.getElementById('instrument-area');
    const blob = new Blob(['\ufeff', element?.outerHTML || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Adm_Pembelajaran_${selectedTeacher.namaGuru}.doc`;
    link.click();
  };

  const exportPDF = () => {
    if (!selectedTeacher) return;
    const element = document.getElementById('instrument-area');
    const opt = {
      margin: 10,
      filename: `Adm_Pembelajaran_${selectedTeacher.namaGuru}.pdf`,
      jsPDF: { orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  // Helper to format date based on supervision date
  const displayDate = useMemo(() => {
    const dateToUse = selectedTeacher?.tanggal || settings.tanggalCetak;
    return new Date(dateToUse).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
  }, [selectedTeacher, settings.tanggalCetak]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-4 no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-black text-slate-500 uppercase">Pilih Guru:</label>
          <select 
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
            className="px-4 py-2 bg-slate-50 border border-blue-200 rounded-xl font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Cari Nama Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportPDF} disabled={!selectedTeacher} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow disabled:opacity-50">PDF</button>
          <button onClick={exportExcel} disabled={!selectedTeacher} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow disabled:opacity-50">Excel</button>
          <button onClick={exportWord} disabled={!selectedTeacher} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-black text-[9px] uppercase shadow disabled:opacity-50">Word</button>
          <button onClick={handleSave} disabled={!selectedTeacher} className="px-5 py-1.5 bg-blue-600 text-white rounded-lg font-black text-[9px] uppercase shadow disabled:opacity-50">Simpan Data</button>
        </div>
      </div>

      <div id="instrument-area" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8">
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-tight">Instrumen Supervisi Akademik (Kurikulum Merdeka)</h1>
          <h2 className="text-lg font-bold text-slate-700 uppercase mt-1">Administrasi Pembelajaran</h2>
          <p className="text-xs font-bold text-slate-500 mt-1 italic uppercase">Tahun Pelajaran {settings.tahunPelajaran}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm mb-8">
          <div className="space-y-2">
            <div className="flex"><span className="w-32 font-bold text-slate-500 uppercase text-[10px]">Nama Guru</span><span className="font-black uppercase">: {selectedTeacher?.namaGuru || '-'}</span></div>
            <div className="flex"><span className="w-32 font-bold text-slate-500 uppercase text-[10px]">Mata Pelajaran</span><span className="font-bold italic uppercase">: {selectedTeacher?.mataPelajaran || '-'}</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex"><span className="w-32 font-bold text-slate-500 uppercase text-[10px]">Hari / Tanggal</span><span className="font-black text-blue-800">: {selectedTeacher?.hari ? `${selectedTeacher.hari}, ${selectedTeacher.tanggal}` : '-'}</span></div>
            <div className="flex"><span className="w-32 font-bold text-slate-500 uppercase text-[10px]">Jam Tatap Muka</span><span className="font-black text-blue-700">: {jamTatapMuka} JP / Minggu</span></div>
          </div>
        </div>

        <table className="w-full border-collapse text-xs mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-[9px]">
              <th rowSpan={2} className="px-2 py-3 border border-slate-700 w-10 text-center">No</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Komponen Administrasi Pembelajaran</th>
              <th colSpan={3} className="px-2 py-2 border border-slate-700 text-center">Kondisi</th>
              <th rowSpan={2} className="px-4 py-3 border border-slate-700 text-left">Keterangan</th>
            </tr>
            <tr className="bg-slate-800 text-[8px] text-center">
              <th className="px-1 py-2 border border-slate-700">0</th>
              <th className="px-1 py-2 border border-slate-700">1</th>
              <th className="px-1 py-2 border border-slate-700">2</th>
            </tr>
          </thead>
          <tbody>
            {COMPONENTS_LIST.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30">
                <td className="px-2 py-2 border border-slate-200 text-center font-bold text-slate-400">{idx + 1}.</td>
                <td className="px-4 py-2 border border-slate-200 font-medium text-slate-800">{item}</td>
                <td className="px-1 py-2 border border-slate-200 text-center">
                  <input type="radio" checked={scores[idx] === 0} onChange={() => setScores(p => ({...p, [idx]: 0}))} />
                </td>
                <td className="px-1 py-2 border border-slate-200 text-center">
                  <input type="radio" checked={scores[idx] === 1} onChange={() => setScores(p => ({...p, [idx]: 1}))} />
                </td>
                <td className="px-1 py-2 border border-slate-200 text-center">
                  <input type="radio" checked={scores[idx] === 2} onChange={() => setScores(p => ({...p, [idx]: 2}))} />
                </td>
                <td className="px-4 py-1 border border-slate-200">
                  <input type="text" value={remarks[idx]} onChange={(e) => setRemarks(p => ({...p, [idx]: e.target.value}))} className="w-full bg-transparent outline-none italic text-slate-500" />
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-black">
              <td colSpan={2} className="px-4 py-3 border border-slate-200 text-right uppercase">Skor Total</td>
              <td colSpan={3} className="px-2 py-3 border border-slate-200 text-center text-blue-700">{stats.totalScore}</td>
              <td className="border border-slate-200 bg-slate-100 text-[10px] text-slate-500 px-4">Max: 26</td>
            </tr>
            <tr className="bg-white font-black italic">
              <td colSpan={2} className="px-4 py-3 border border-slate-200 text-right uppercase">Ketercapaian (%)</td>
              <td colSpan={3} className="px-2 py-3 border border-slate-200 text-center text-emerald-700">{stats.percentage}%</td>
              <td className="border border-slate-200 bg-emerald-50 text-center">
                 <span className="px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter bg-emerald-600 text-white">{stats.category}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Catatan Supervisor</label>
            <textarea rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs italic"></textarea>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tindak Lanjut</label>
            <textarea rows={3} value={tindakLanjut} onChange={(e) => setTindakLanjut(e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs italic"></textarea>
          </div>
        </div>

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

export default AdministrasiPembelajaran;
