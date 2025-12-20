
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, InstrumentResult, AdminRecord } from '../types';

type TendikType = 'sekolah' | 'ketenagaan' | 'perlengkapan' | 'perpustakaan' | 'lab-ipa' | 'lab-komputer' | 'kesiswaan';

interface ConfigItem {
  no?: string;
  label: string;
  isHeader?: boolean;
  type?: 'bckt' | 'yatidak' | 'sekolah-row';
}

const TENDIK_CONFIG: Record<string, { title: string, items: ConfigItem[] }> = {
  'sekolah': { title: 'Administrasi Sekolah', items: [{ no: '1', label: 'Program Kerja Sekolah', type: 'sekolah-row' }, { no: '2', label: 'Kalender Pendidikan', type: 'sekolah-row' }] },
  'kesiswaan': { title: 'Administrasi Kesiswaan', items: [{ no: '1', label: 'Buku Induk', type: 'sekolah-row' }, { no: '2', label: 'Buku Klaper', type: 'sekolah-row' }] },
  // ... maps the others as needed
};

interface Props {
  type: TendikType;
  settings: AppSettings;
  adminRecords: AdminRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (key: string, data: InstrumentResult) => void;
  setSettings: (s: AppSettings) => void;
}

const getAutoTendikText = (avg: number) => {
  if (avg >= 0.9) return { k: "Sistem administrasi sangat baik, rapi dan terdokumentasi sempurna.", s: "Pertahankan dan tingkatkan kualitas pelayanan." };
  if (avg >= 0.8) return { k: "Administrasi sudah baik, hanya perlu penyempurnaan pada detail pengarsipan.", s: "Lakukan pengecekan berkala setiap bulan." };
  if (avg >= 0.7) return { k: "Cukup, masih terdapat beberapa dokumen yang belum diperbarui.", s: "Segera lengkapi buku inventaris/klaper dalam 1 bulan." };
  return { k: "Administrasi kurang rapi, banyak dokumen penting belum tersedia.", s: "Perbaikan total sistem administrasi di bawah bimbingan Kepala TU." };
};

const InstrumentTendikView: React.FC<Props> = ({ type, settings, adminRecords, instrumentResults, onSave, setSettings }) => {
  const config = TENDIK_CONFIG[type] || { title: `Supervisi ${type}`, items: [] };
  const activeSemester = settings.semester;
  const storageKey = `tendik-${type}-${activeSemester}`;

  const scheduleData = useMemo(() => {
    return adminRecords.find(r => r.semester === activeSemester && r.kegiatan.toLowerCase().includes(type.toLowerCase()));
  }, [adminRecords, activeSemester, type]);

  const [scores, setScores] = useState<Record<number, string>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  useEffect(() => {
    const saved = instrumentResults[storageKey];
    if (saved) {
      setScores(saved.scores as any);
      setRemarks(saved.remarks);
    }
  }, [storageKey, instrumentResults]);

  const calculateAverage = () => {
    // Fix: Explicitly cast v as string to resolve unknown type error when calling parseFloat.
    const vals = Object.values(scores).map(v => parseFloat(v as string)).filter(v => !isNaN(v));
    return vals.length === 0 ? 0 : (vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const stats = useMemo(() => getAutoTendikText(calculateAverage()), [scores]);

  const handleSave = () => {
    onSave(storageKey, { scores, remarks, catatan: stats.k, tindakLanjut: stats.s });
    alert(`Data disimpan!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-fadeIn max-w-5xl mx-auto mb-10">
      <div className="flex justify-between items-center mb-6 no-print">
         <h2 className="text-sm font-bold uppercase">{config.title}</h2>
         <button onClick={handleSave} className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[9px] uppercase">Simpan</button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-1 text-[11px] font-bold uppercase">
         <div className="flex"><span className="w-32">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
         <div className="flex"><span className="w-32">Petugas</span><span>: {scheduleData?.nama || '-'}</span></div>
         <div className="flex"><span className="w-32">NIP Petugas</span><span>: {scheduleData?.nip || '-'}</span></div>
         <div className="flex"><span className="w-32">Hari / Tanggal</span><span>: {scheduleData ? `${scheduleData.hari}, ${scheduleData.tgl}` : '-'}</span></div>
      </div>

      <table className="w-full border-collapse border border-slate-800 text-[10px] mb-8">
        <thead className="bg-slate-50 uppercase">
          <tr>
            <th className="border border-slate-800 p-2 w-10">No</th>
            <th className="border border-slate-800 p-2 text-left">Kegiatan</th>
            <th className="border border-slate-800 p-2 w-16">Ada</th>
            <th className="border border-slate-800 p-2 w-16">Tidak</th>
          </tr>
        </thead>
        <tbody>
          {config.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
              <td className="border border-slate-800 p-2">{item.label}</td>
              <td className="border border-slate-800 p-2 text-center"><input type="radio" checked={scores[idx] === '1'} onChange={() => setScores(p => ({...p, [idx]: '1'}))} /></td>
              <td className="border border-slate-800 p-2 text-center"><input type="radio" checked={scores[idx] === '0'} onChange={() => setScores(p => ({...p, [idx]: '0'}))} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 space-y-4 text-[11px] font-bold uppercase">
         <div className="border-b-2 border-dotted border-slate-400 pb-1">
            KESIMPULAN : <span className="font-normal italic lowercase">{stats.k}</span>
         </div>
         <div className="border-b-2 border-dotted border-slate-400 pb-1">
            SARAN : <span className="font-normal italic lowercase">{stats.s}</span>
         </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-20 text-[10px] uppercase font-bold text-center">
        <div className="space-y-16">
          <p>Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
          <p className="underline">{settings.namaKepalaSekolah}</p>
        </div>
        <div className="space-y-16">
          <p>Mojokerto, {scheduleData?.tgl || '....................'}<br/>Petugas</p>
          <p className="underline">{scheduleData?.nama || '................................................'}</p>
        </div>
      </div>
    </div>
  );
};

export default InstrumentTendikView;
