
import React, { useState, useEffect, useMemo } from 'react';
import { AppSettings, InstrumentResult, ExtraRecord } from '../types';

interface ExtraItem {
  id: string;
  label: string;
  type: 'BCKT' | 'YATIDAK';
  isHeader?: boolean;
}

const ITEMS: ExtraItem[] = [
  { id: '1a', label: '- Pembuatan Program Kegiatan', type: 'BCKT' },
  { id: '1b', label: '- Konsep Perencanaan dan pelaksanaan', type: 'BCKT' },
  { id: '2h1', label: 'Pendahuluan', type: 'BCKT', isHeader: true },
  { id: '2a', label: '- Apersepsi', type: 'BCKT' },
  { id: '2b', label: '- Motivasi', type: 'BCKT' },
  { id: '2c', label: '- Menyampaikan tujuan/ target', type: 'BCKT' },
  { id: '2h2', label: 'Pelaksanaan Lapangan/ Penyampaian', type: 'BCKT', isHeader: true },
  { id: '2d', label: '- Presensi kehadiran Siswa', type: 'BCKT' },
  { id: '2e', label: '- Kemampuan menyampaikan materi', type: 'BCKT' },
  { id: '2f', label: '- Kemampuan Pembimbingan', type: 'BCKT' },
  { id: '2g', label: '- Kemampuan Pengelolaan lapangan/', type: 'BCKT' },
  { id: '2h', label: '- Rewarding', type: 'BCKT' },
  { id: '2h3', label: 'Penutup', type: 'BCKT', isHeader: true },
  { id: '2i', label: '- Pemberian penguatan motivasi', type: 'BCKT' },
  { id: '2j', label: '- Pemberian pemantapan dan evaluasi', type: 'BCKT' },
  { id: '2k', label: '- Sesuai skenario/ konsep', type: 'YATIDAK' },
  { id: '2l', label: '- Sesuai alokasi waktu yang tersedia', type: 'YATIDAK' },
  { id: '2m', label: '- Menggunakan media/ permodelan/ aplikasi', type: 'YATIDAK' },
  { id: '2n', label: '- Siswa Antusias', type: 'YATIDAK' },
  { id: '2o', label: '- Cenderung terpusat pada siswa', type: 'YATIDAK' },
  { id: '2p', label: '- Cenderung Terpusat pada Guru', type: 'YATIDAK' },
  { id: '3a', label: '- Konstruktivisme', type: 'BCKT' },
  { id: '3b', label: '- Inquiry', type: 'BCKT' },
  { id: '3c', label: '- Bertanya', type: 'BCKT' },
  { id: '3d', label: '- Permodelan', type: 'BCKT' },
  { id: '3e', label: '- Masyarakat Belajar', type: 'BCKT' },
  { id: '3f', label: '- Refleksi', type: 'BCKT' },
  { id: '3g', label: '- Penilaian Otentik', type: 'BCKT' }
];

const getAutoExtraCatatan = (percentage: number) => {
  if (percentage >= 91) return "Sangat Baik. Pembina menunjukkan dedikasi tinggi, program kerja sangat terukur, dan antusiasme siswa sangat luar biasa.";
  if (percentage >= 76) return "Baik. Pelaksanaan kegiatan ekstrakurikuler sudah berjalan sesuai jadwal dan tujuan, namun perlu pengayaan variasi metode.";
  if (percentage >= 60) return "Cukup. Pembinaan sudah dilakukan, namun administrasi dan koordinasi lapangan perlu ditingkatkan agar lebih efektif.";
  return "Kurang. Diperlukan peninjauan ulang terhadap program kerja dan metode pembimbingan agar minat siswa tetap terjaga.";
};

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  extraRecords: ExtraRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (key: string, data: InstrumentResult) => void;
}

const InstrumentExtraView: React.FC<Props> = ({ settings, setSettings, extraRecords, instrumentResults, onSave }) => {
  const activeSemester = settings.semester;
  const [selectedExtraId, setSelectedExtraId] = useState<number | ''>('');
  const [scores, setScores] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [catatan, setCatatan] = useState('');

  const selectedRecord = useMemo(() => 
    extraRecords.find(r => r.id === selectedExtraId), 
    [selectedExtraId, extraRecords]
  );

  const storageKey = selectedExtraId ? `extra-${selectedExtraId}-${activeSemester}` : '';

  useEffect(() => {
    if (storageKey && instrumentResults[storageKey]) {
      const saved = instrumentResults[storageKey];
      setScores(saved.scores as any || {});
      setRemarks(saved.remarks as any || {});
      setCatatan(saved.catatan || '');
    } else {
      setScores({});
      setRemarks({});
      setCatatan('');
    }
  }, [storageKey, instrumentResults]);

  const stats = useMemo(() => {
    const vals = Object.values(scores).map(v => {
      if (v === 'B') return 3;
      if (v === 'C') return 2;
      if (v === 'K') return 1;
      if (v === 'T') return 0;
      if (v === 'YA') return 3;
      if (v === 'TIDAK') return 0;
      return 0;
    });
    const total = vals.reduce((a, b) => a + b, 0);
    const max = 3 * ITEMS.filter(i => !i.isHeader).length;
    const perc = max > 0 ? Math.round((total / max) * 100) : 0;
    return { perc, total, max };
  }, [scores]);

  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      setCatatan(getAutoExtraCatatan(stats.perc));
    }
  }, [stats.perc]);

  const handleScoreChange = (id: string, val: string) => {
    setScores(prev => ({ ...prev, [id]: val }));
    let autoRem = "";
    if (val === 'B') autoRem = "Sangat Memuaskan";
    else if (val === 'C') autoRem = "Cukup Memadai";
    else if (val === 'K') autoRem = "Perlu Perbaikan";
    else if (val === 'T') autoRem = "Tidak Terlihat";
    else if (val === 'YA') autoRem = "Terlaksana";
    else if (val === 'TIDAK') autoRem = "Belum Terlaksana";
    setRemarks(prev => ({ ...prev, [id]: autoRem }));
  };

  const handleSave = () => {
    if (!selectedExtraId) return alert('Pilih Pembina terlebih dahulu!');
    onSave(storageKey, { 
      scores: scores as any, 
      remarks: remarks as any, 
      catatan 
    });
    alert('Hasil supervisi ekstrakurikuler berhasil disimpan!');
  };

  const exportPDF = () => {
    const element = document.getElementById('extra-instr-export');
    // @ts-ignore
    html2pdf().from(element).save(`Extra_${selectedRecord?.nama || 'Pembina'}_${settings.semester}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <select 
            value={selectedExtraId} 
            onChange={e => setSelectedExtraId(Number(e.target.value))} 
            className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none"
          >
            <option value="">-- Pilih Pembina --</option>
            {extraRecords.filter(r => r.semester === activeSemester).map(r => (
              <option key={r.id} value={r.id}>{r.nama} ({r.ekstra})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
            <button onClick={handleSave} disabled={!selectedExtraId} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg ml-2">Simpan Hasil</button>
        </div>
      </div>

      <div id="extra-instr-export" className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-6 border-b-4 border-double border-slate-900 pb-2">
          <h1 className="text-xl font-black uppercase tracking-widest leading-none">Instrumen Supervisi Ekstrakurikuler</h1>
          <p className="text-sm font-bold mt-1 uppercase tracking-tighter">Semester {settings.semester.toUpperCase()} • Tahun Pelajaran {settings.tahunPelajaran}</p>
        </div>

        <div className="grid grid-cols-1 gap-y-0.5 text-xs font-bold mb-6 max-w-2xl">
           <div className="flex"><span className="w-32">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
           <div className="flex"><span className="w-32">Alamat Sekolah</span><span>: Jl. Tirta Wening Ds. Kembangbelor</span></div>
           <div className="flex"><span className="w-32">Hari / Tanggal</span><span className="text-blue-700">: {selectedRecord ? `${selectedRecord.hari}, ${selectedRecord.tgl}` : '..............................'}</span></div>
           <div className="flex"><span className="w-32">Pembina</span><span className="text-blue-700">: {selectedRecord?.nama || '..............................'}</span></div>
           <div className="flex"><span className="w-32">Ekstrakurikuler</span><span className="text-blue-700 uppercase">: {selectedRecord?.ekstra || '..............................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-1 w-8">NO</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left uppercase">Aspek yang Diamati</th>
              <th colSpan={4} className="border-2 border-slate-900 p-1">Penilaian</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-32 text-left">Keterangan</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center">
              <th className="border-2 border-slate-900 p-1 w-10">B</th>
              <th className="border-2 border-slate-900 p-1 w-10">C</th>
              <th className="border-2 border-slate-900 p-1 w-10">K</th>
              <th className="border-2 border-slate-900 p-1 w-10">T</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-slate-100 font-black"><td className="border-2 border-slate-900 p-2 text-center">1</td><td colSpan={5} className="border-2 border-slate-900 p-2 uppercase">Persiapan</td></tr>
            {ITEMS.slice(0, 2).map(item => (
              <tr key={item.id}>
                <td className="border-2 border-slate-900"></td>
                <td className="border-2 border-slate-900 p-2 pl-4">{item.label}</td>
                {['B', 'C', 'K', 'T'].map(val => (
                  <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(item.id, val)}>
                     <div className={`w-5 h-5 mx-auto border border-slate-900 flex items-center justify-center ${scores[item.id] === val ? 'bg-slate-800 text-white font-black' : 'bg-white'}`}>{scores[item.id] === val && "v"}</div>
                  </td>
                ))}
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'B' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'C' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'K' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'T' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 italic text-[9px]">{remarks[item.id]}</td>
              </tr>
            ))}

            <tr className="bg-slate-100 font-black"><td className="border-2 border-slate-900 p-2 text-center">2</td><td colSpan={5} className="border-2 border-slate-900 p-2 uppercase">Pelaksanaan</td></tr>
            {ITEMS.slice(2, 21).map((item) => {
               if (item.isHeader) return <tr key={item.id} className="bg-slate-50 font-bold italic"><td className="border-2 border-slate-900"></td><td colSpan={5} className="border-2 border-slate-900 p-1 pl-4 underline">{item.label}</td></tr>;
               return (
                 <tr key={item.id}>
                   <td className="border-2 border-slate-900"></td>
                   <td className="border-2 border-slate-900 p-2 pl-4">{item.label}</td>
                   {item.type === 'YATIDAK' ? (
                     <>
                        <td colSpan={2} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(item.id, 'YA')}>
                          <div className={`px-2 py-0.5 border rounded flex justify-between items-center text-[8px] font-black ${scores[item.id] === 'YA' ? 'bg-slate-800 text-white' : 'bg-white'}`}><span>YA</span> {scores[item.id] === 'YA' && "v"}</div>
                        </td>
                        <td colSpan={2} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(item.id, 'TIDAK')}>
                          <div className={`px-2 py-0.5 border rounded flex justify-between items-center text-[8px] font-black ${scores[item.id] === 'TIDAK' ? 'bg-slate-800 text-white' : 'bg-white'}`}><span>TIDAK</span> {scores[item.id] === 'TIDAK' && "v"}</div>
                        </td>
                        <td colSpan={2} className="border-2 border-slate-900 p-1 hidden print:table-cell text-[8px] font-bold"><div className="flex justify-between"><span>YA</span>{scores[item.id]==='YA'?"v":""}</div></td>
                        <td colSpan={2} className="border-2 border-slate-900 p-1 hidden print:table-cell text-[8px] font-bold"><div className="flex justify-between"><span>TIDAK</span>{scores[item.id]==='TIDAK'?"v":""}</div></td>
                     </>
                   ) : (
                     ['B', 'C', 'K', 'T'].map(val => (
                        <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(item.id, val)}>
                          <div className={`w-4 h-4 mx-auto border border-slate-900 flex items-center justify-center ${scores[item.id] === val ? 'bg-slate-800 text-white' : 'bg-white'}`}>{scores[item.id] === val && "v"}</div>
                        </td>
                     ))
                   )}
                   {item.type !== 'YATIDAK' && (
                     <>
                        <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'B' ? 'v' : ''}</td>
                        <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'C' ? 'v' : ''}</td>
                        <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'K' ? 'v' : ''}</td>
                        <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'T' ? 'v' : ''}</td>
                     </>
                   )}
                   <td className="border-2 border-slate-900 p-1 italic text-[9px]">{remarks[item.id]}</td>
                 </tr>
               );
            })}

            <tr className="bg-slate-100 font-black"><td className="border-2 border-slate-900 p-2 text-center">3</td><td colSpan={5} className="border-2 border-slate-900 p-2 uppercase">Indikator CTL</td></tr>
            {ITEMS.slice(21).map(item => (
              <tr key={item.id}>
                <td className="border-2 border-slate-900"></td>
                <td className="border-2 border-slate-900 p-2 pl-4">{item.label}</td>
                {['B', 'C', 'K', 'T'].map(val => (
                  <td key={val} className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(item.id, val)}>
                    <div className={`w-4 h-4 mx-auto border border-slate-900 flex items-center justify-center ${scores[item.id] === val ? 'bg-slate-800 text-white' : 'bg-white'}`}>{scores[item.id] === val && "v"}</div>
                  </td>
                ))}
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'B' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'C' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'K' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-bold">{scores[item.id] === 'T' ? 'v' : ''}</td>
                <td className="border-2 border-slate-900 p-1 italic text-[9px]">{remarks[item.id]}</td>
              </tr>
            ))}
            <tr className="bg-slate-900 text-white font-black"><td colSpan={2} className="p-2 text-right uppercase italic">Ketercapaian Skor (%)</td><td colSpan={4} className="text-center bg-blue-700">{stats.perc}%</td><td className="text-center uppercase text-[9px] tracking-widest">{stats.perc >= 91 ? "Sangat Baik" : stats.perc >= 76 ? "Baik" : "Cukup"}</td></tr>
          </tbody>
        </table>

        <div className="mt-6 border-b-2 border-slate-400 pb-1">
           <h3 className="text-sm font-bold uppercase tracking-tighter text-purple-700">Catatan Pelaksanaan :</h3>
           <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={3} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium" placeholder="Otomatis terisi berdasarkan skor..." />
        </div>

        <div className="mt-12 grid grid-cols-3 text-xs font-bold tracking-tight text-center leading-tight">
            <div className="flex flex-col justify-between h-32">
               <p className="uppercase leading-tight">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
               <div><p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p><p className="font-mono text-[10px] uppercase">NIP. {settings.nipKepalaSekolah}</p></div>
            </div>
            <div className="flex flex-col justify-between h-32">
               <p className="uppercase pt-4">Supervisor</p>
               <div><p className="border-b border-slate-800 mx-auto w-40 h-5"></p><p className="font-mono text-[10px] uppercase">NIP. ....................................</p></div>
            </div>
            <div className="flex flex-col justify-between h-32">
               <p className="uppercase leading-tight">Mojokerto, {selectedRecord?.tgl || '.....................'}<br/>Pembina Ekstrakurikuler</p>
               <div><p className="underline uppercase font-black">{selectedRecord?.nama || '...................'}</p><p className="font-mono text-[10px] uppercase">NIP. {selectedRecord?.nip || '...................'}</p></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentExtraView;
