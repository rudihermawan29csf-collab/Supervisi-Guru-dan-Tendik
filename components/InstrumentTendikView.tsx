
import React, { useState, useMemo } from 'react';
import { AppSettings } from '../types';

type TendikType = 'sekolah' | 'ketenagaan' | 'perlengkapan' | 'perpustakaan' | 'lab-ipa' | 'lab-komputer' | 'kesiswaan' | 'ekstra';

const TENDIK_CONFIG: Record<TendikType, { title: string, items: { label: string, isHeader?: boolean }[] }> = {
  'sekolah': { title: 'Supervisi Administrasi Sekolah', items: [{ label: 'Program Kerja Sekolah' }, { label: 'Kalender Pendidikan' }, { label: 'Jadwal Kegiatan Pertahun' }, { label: 'Administrasi Umum', isHeader: true }, { label: 'a. Agenda' }, { label: 'b. Buku Ekspedisi' }] },
  'ketenagaan': { title: 'Supervisi Administrasi Ketenagaan', items: [{ label: 'Kepala Sekolah', isHeader: true }, { label: 'a. Biodata' }, { label: 'b. Program Kerja' }, { label: 'Guru', isHeader: true }, { label: 'a. Biodata' }, { label: 'b. Agenda Guru' }] },
  'perlengkapan': { title: 'Supervisi Administrasi Perlengkapan', items: [{ label: 'Buku Induk Barang' }, { label: 'Daftar Barang Kelas' }, { label: 'Buku Pembelian' }] },
  'perpustakaan': { title: 'Supervisi Administrasi Perpustakaan', items: [{ label: 'Ruang Perpustakaan' }, { label: 'Pengelola' }, { label: 'Klasifikasi Buku' }] },
  'lab-ipa': { title: 'Supervisi Laboratorium IPA', items: [{ label: 'Jadwal Penggunaan' }, { label: 'Tata Tertib' }, { label: 'Daftar Alat' }] },
  'lab-komputer': { title: 'Supervisi Laboratorium Komputer', items: [{ label: 'Jadwal Penggunaan' }, { label: 'Tata Tertib' }, { label: 'Daftar Alat' }] },
  'kesiswaan': { title: 'Supervisi Administrasi Kesiswaan', items: [{ label: 'Buku Induk' }, { label: 'Buku Klaper' }, { label: 'Buku Mutasi' }] },
  'ekstra': { title: 'Supervisi Ekstrakurikuler', items: [{ label: 'PERSIAPAN', isHeader: true }, { label: '- Program Kegiatan' }, { label: 'PELAKSANAAN', isHeader: true }, { label: '- Sesuai Skenario' }] }
};

const InstrumentTendikView: React.FC<{ type: TendikType, settings: AppSettings }> = ({ type, settings }) => {
  const config = TENDIK_CONFIG[type];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<Record<number, number>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [tgl, setTgl] = useState('');
  const [petugasName, setPetugasName] = useState('');

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores) as number[];
    const total = scoreValues.reduce((a, b) => a + b, 0);
    const count = scoreValues.length || 1;
    return { total, avg: (total / count).toFixed(2) };
  }, [scores]);

  const exportPDF = () => {
    const element = document.getElementById('tendik-instrument-area');
    // @ts-ignore
    html2pdf().from(element).save(`${config.title}.pdf`);
  };

  const exportWord = () => {
    const html = document.getElementById('tendik-instrument-area')?.innerHTML;
    const blob = new Blob(['\ufeff', html || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${config.title}.doc`;
    link.click();
  };

  const exportExcel = () => {
    const headers = "No,Kegiatan,Hasil,Nilai,Keterangan";
    const rows = config.items.map((i, idx) => `"${idx+1}","${i.label}","${answers[idx] || '-'}","${scores[idx] || 0}","${remarks[idx] || '-'}"`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${config.title}.csv`;
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fadeIn max-w-5xl mx-auto mb-10">
      <div className="p-6 border-b bg-slate-50 flex justify-between items-center no-print">
        <h2 className="text-sm font-bold uppercase">{config.title}</h2>
        <div className="flex gap-2">
            <button onClick={exportPDF} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase">PDF</button>
            <button onClick={exportWord} className="px-3 py-1.5 bg-blue-800 text-white rounded-lg font-bold text-[9px] uppercase">Word</button>
            <button onClick={exportExcel} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase">Excel</button>
            <button onClick={() => alert('Data instrumen tendik disimpan!')} className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[9px] uppercase">Simpan Perubahan</button>
        </div>
      </div>

      <div id="tendik-instrument-area" className="p-10">
        <h1 className="text-center text-xl font-black uppercase text-slate-900 mb-2 border-b-2 border-slate-900 pb-2">{config.title}</h1>
        <p className="text-center text-[10px] font-bold text-slate-500 mb-8 italic">TP {settings.tahunPelajaran} • Semester {settings.semester}</p>
        
        <table className="w-full border-collapse text-xs mb-8">
          <thead>
            <tr className="bg-slate-900 text-white uppercase">
              <th className="px-3 py-4 border border-slate-700 w-10">No</th>
              <th className="px-6 py-4 border border-slate-700 text-left">Aspek</th>
              <th className="px-4 py-4 border border-slate-700 text-center w-24">Hasil</th>
              <th className="px-4 py-4 border border-slate-700 w-20 text-center">Nilai</th>
              <th className="px-6 py-4 border border-slate-700 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {config.items.map((item, idx) => (
              <tr key={idx} className={item.isHeader ? 'bg-slate-100 font-bold' : ''}>
                <td className="px-3 py-2 border border-slate-200 text-center">{item.isHeader ? '' : idx + 1}</td>
                <td className="px-6 py-2 border border-slate-200">{item.label}</td>
                <td className="px-2 py-2 border border-slate-200 text-center">
                   {!item.isHeader && (
                     <select value={answers[idx] || ''} onChange={e => setAnswers(p => ({...p, [idx]: e.target.value}))} className="bg-transparent font-bold text-xs outline-none no-print">
                       <option value="">-</option><option value="ya">YA</option><option value="tidak">TDK</option>
                     </select>
                   )}
                   <span className="print:inline hidden">{answers[idx] || '-'}</span>
                </td>
                <td className="px-2 py-2 border border-slate-200">
                  {!item.isHeader && <input type="number" value={scores[idx] || ''} onChange={e => setScores(p => ({...p, [idx]: parseInt(e.target.value)}))} className="w-full bg-transparent text-center font-bold no-print" />}
                  <span className="print:inline hidden">{scores[idx] || '-'}</span>
                </td>
                <td className="px-4 py-2 border border-slate-200">
                  <input type="text" value={remarks[idx] || ''} onChange={e => setRemarks(p => ({...p, [idx]: e.target.value}))} className="w-full bg-transparent no-print italic text-[10px]" />
                  <span className="print:inline hidden">{remarks[idx] || '-'}</span>
                </td>
              </tr>
            ))}
            <tr className="bg-slate-900 text-white font-black uppercase">
               <td colSpan={3} className="px-6 py-3 text-right">Skor Rata-Rata</td>
               <td className="text-center">{stats.avg}</td>
               <td></td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-start text-xs mt-10">
          <div className="text-center w-64">
             <p className="mb-20">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline uppercase">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px]">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20">Mojokerto, {new Date(settings.tanggalCetak).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}<br/>Petugas / Supervisor</p>
             <input type="text" value={petugasName} onChange={e => setPetugasName(e.target.value)} placeholder="Nama Petugas" className="w-full text-center font-bold underline bg-transparent no-print uppercase" />
             <p className="font-black underline uppercase hidden print:block">{petugasName || '................................'}</p>
             <p className="text-[10px] italic">NIP. ................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentTendikView;
