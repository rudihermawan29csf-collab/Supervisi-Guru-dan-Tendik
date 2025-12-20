
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, InstrumentResult, AdminRecord } from '../types';

type TendikType = 'sekolah' | 'ketenagaan' | 'perlengkapan' | 'perpustakaan' | 'lab-ipa' | 'lab-komputer' | 'kesiswaan';

interface ConfigItem {
  no?: string;
  label: string;
  isHeader?: boolean;
}

const TENDIK_CONFIG: Record<TendikType, { title: string, items: ConfigItem[] }> = {
  'sekolah': { 
    title: 'Administrasi Sekolah', 
    items: [
      { label: 'Program Kerja Sekolah' }, { label: 'Kalender Pendidikan' }, { label: 'Rencana Kerja Tahunan' },
      { label: 'Rencana Kerja Jangka Menengah' }, { label: 'Struktur Organisasi' }, { label: 'Buku Tamu Dinas' },
      { label: 'Buku Tamu Umum' }, { label: 'Papan Data' }, { label: 'Buku Notulen Rapat' }, { label: 'Buku Ekspedisi' }
    ] 
  },
  'kesiswaan': { 
    title: 'Administrasi Kesiswaan', 
    items: [
      { label: 'Buku Induk Siswa' }, { label: 'Buku Klaper' }, { label: 'Buku Mutasi Siswa' },
      { label: 'Absensi Siswa' }, { label: 'Daftar Calon Siswa Baru' }, { label: 'Buku Prestasi Siswa' },
      { label: 'Buku Leger' }, { label: 'Buku Raport' }
    ] 
  },
  'ketenagaan': { 
    title: 'Administrasi Ketenagaan', 
    items: [
      { label: 'Buku Induk Pegawai' }, { label: 'Daftar Urut Kepangkatan (DUK)' }, { label: 'File Data Guru & Pegawai' },
      { label: 'Papan Data Ketenagaan' }, { label: 'Daftar Hadir Guru & Pegawai' }, { label: 'Buku Pembinaan' }
    ] 
  },
  'perlengkapan': { 
    title: 'Administrasi Perlengkapan / Sarpras', 
    items: [
      { label: 'Buku Inventaris Barang' }, { label: 'Buku Golongan Inventaris' }, { label: 'Buku Catatan Barang Non Inventaris' },
      { label: 'KIB A (Tanah)' }, { label: 'KIB B (Peralatan & Mesin)' }, { label: 'KIB C (Bangunan)' },
      { label: 'Daftar Inventaris Ruang' }, { label: 'Laporan Triwulan Mutasi Barang' }
    ] 
  },
  'perpustakaan': { 
    title: 'Administrasi Perpustakaan', 
    items: [
      { label: 'Buku Induk Perpustakaan' }, { label: 'Buku Pengunjung' }, { label: 'Buku Peminjam' },
      { label: 'Kartu Anggota' }, { label: 'Katalog Perpustakaan' }, { label: 'Laporan Bulanan' }
    ] 
  },
  'lab-ipa': { 
    title: 'Laboratorium IPA', 
    items: [
      { label: 'Buku Inventaris Alat' }, { label: 'Buku Inventaris Bahan' }, { label: 'Jadwal Penggunaan Lab' },
      { label: 'Buku Catatan Praktikum' }, { label: 'Buku Kerusakan Alat' }, { label: 'Tata Tertib Lab IPA' }
    ] 
  },
  'lab-komputer': { 
    title: 'Laboratorium Komputer', 
    items: [
      { label: 'Buku Inventaris Komputer' }, { label: 'Kartu Perawatan Komputer' }, { label: 'Jadwal Penggunaan Lab Komputer' },
      { label: 'Daftar Pengunjung Lab' }, { label: 'Buku Catatan Masalah' }, { label: 'Tata Tertib Lab Komputer' }
    ] 
  }
};

interface Props {
  type: TendikType;
  settings: AppSettings;
  adminRecords: AdminRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (key: string, data: InstrumentResult) => void;
  setSettings: (s: AppSettings) => void;
}

const getAutoTendikText = (percentage: number) => {
  if (percentage >= 90) return { k: "Sistem administrasi sangat baik, rapi dan terdokumentasi sempurna.", s: "Pertahankan dan tingkatkan kualitas pelayanan." };
  if (percentage >= 80) return { k: "Administrasi sudah baik, hanya perlu penyempurnaan pada detail pengarsipan.", s: "Lakukan pengecekan berkala setiap bulan." };
  if (percentage >= 70) return { k: "Cukup, masih terdapat beberapa dokumen yang belum diperbarui.", s: "Segera lengkapi dokumen yang kurang dalam 1 bulan." };
  return { k: "Administrasi kurang rapi, banyak dokumen penting belum tersedia.", s: "Perbaikan total sistem administrasi di bawah bimbingan Kepala TU." };
};

const InstrumentTendikView: React.FC<Props> = ({ type, settings, adminRecords, instrumentResults, onSave, setSettings }) => {
  const config = TENDIK_CONFIG[type];
  const activeSemester = settings.semester;
  const storageKey = `tendik-${type}-${activeSemester}`;

  const scheduleData = useMemo(() => {
    return adminRecords.find(r => r.semester === activeSemester && 
      (r.kegiatan.toLowerCase().includes(type.replace('-',' ').toLowerCase()) || 
       r.kegiatan.toLowerCase().includes(config.title.toLowerCase())));
  }, [adminRecords, activeSemester, type]);

  const [scores, setScores] = useState<Record<number, string>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  useEffect(() => {
    const saved = instrumentResults[storageKey];
    if (saved) {
      setScores(saved.scores as any);
      setRemarks(saved.remarks);
    } else {
      setScores({});
      setRemarks({});
    }
  }, [storageKey, instrumentResults]);

  const stats = useMemo(() => {
    const vals = Object.values(scores).filter(v => v === '1');
    const totalCount = config.items.length;
    const percentage = totalCount > 0 ? Math.round((vals.length / totalCount) * 100) : 0;
    const auto = getAutoTendikText(percentage);
    return { count: vals.length, total: totalCount, percentage, ...auto };
  }, [scores, config]);

  const handleSave = () => {
    onSave(storageKey, { 
      scores, 
      remarks, 
      catatan: stats.k, 
      tindakLanjut: stats.s 
    });
    alert(`Data supervisi ${config.title} disimpan!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-fadeIn max-w-5xl mx-auto mb-10">
      <div className="flex justify-between items-center mb-6 no-print">
         <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Instrumen Supervisi Tendik</h2>
         <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg hover:bg-indigo-700">Simpan Hasil</button>
      </div>

      <div className="text-center mb-10 border-b-2 border-slate-900 pb-4">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">{config.title}</h1>
          <p className="text-xs font-bold text-slate-500 uppercase italic">Tahun Pelajaran {settings.tahunPelajaran}</p>
      </div>

      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-bold uppercase">
         <div className="space-y-1">
            <div className="flex"><span className="w-32 text-slate-500">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Petugas / PTT</span><span>: {scheduleData?.nama || '................................'}</span></div>
         </div>
         <div className="space-y-1">
            <div className="flex"><span className="w-32 text-slate-500">NIP Petugas</span><span>: {scheduleData?.nip || '-'}</span></div>
            <div className="flex"><span className="w-32 text-slate-500">Hari / Tanggal</span><span>: {scheduleData ? `${scheduleData.hari}, ${scheduleData.tgl}` : '................................'}</span></div>
         </div>
      </div>

      <table className="w-full border-collapse border border-slate-800 text-[10px] mb-8">
        <thead>
          <tr className="bg-slate-900 text-white uppercase">
            <th className="border border-slate-800 p-2 w-10">No</th>
            <th className="border border-slate-800 p-2 text-left">Komponen / Sub Komponen</th>
            <th className="border border-slate-800 p-2 w-20">Ada (1)</th>
            <th className="border border-slate-800 p-2 w-20">Tidak (0)</th>
            <th className="border border-slate-800 p-2 text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {config.items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="border border-slate-800 p-2 text-center font-bold text-slate-400">{idx + 1}</td>
              <td className="border border-slate-800 p-2 font-medium">{item.label}</td>
              <td className="border border-slate-800 p-2 text-center">
                <input type="radio" checked={scores[idx] === '1'} onChange={() => setScores(p => ({...p, [idx]: '1'}))} />
              </td>
              <td className="border border-slate-800 p-2 text-center">
                <input type="radio" checked={scores[idx] === '0'} onChange={() => setScores(p => ({...p, [idx]: '0'}))} />
              </td>
              <td className="border border-slate-800 p-2">
                <input type="text" value={remarks[idx] || ''} onChange={(e) => setRemarks(p => ({...p, [idx]: e.target.value}))} className="w-full bg-transparent outline-none italic" placeholder="..." />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabel Ringkasan Nilai Tendik */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg border">
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Item Tersedia</p>
               <p className="text-2xl font-black text-slate-800">{stats.count}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Komponen</p>
               <p className="text-2xl font-black text-slate-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-600 rounded-lg shadow-lg">
               <p className="text-[10px] font-black text-indigo-100 uppercase mb-1">Kelengkapan (%)</p>
               <p className="text-2xl font-black text-white">{stats.percentage}%</p>
            </div>
          </div>
      </div>

      <div className="mt-4 space-y-4 text-[11px] font-bold uppercase tracking-tight">
         <div className="border-b-2 border-dotted border-slate-400 pb-1">
            KESIMPULAN : <span className="font-normal italic lowercase text-slate-600">{stats.k}</span>
         </div>
         <div className="border-b-2 border-dotted border-slate-400 pb-1">
            SARAN : <span className="font-normal italic lowercase text-slate-600">{stats.s}</span>
         </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-20 text-[10px] uppercase font-bold text-center">
        <div className="space-y-16">
          <p>Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
          <p className="underline font-black">{settings.namaKepalaSekolah}</p>
          <p className="font-mono text-[9px] mt-1 uppercase">NIP. {settings.nipKepalaSekolah}</p>
        </div>
        <div className="space-y-16">
          <p>Mojokerto, {scheduleData?.tgl || '....................'}<br/>Petugas / Staf TU</p>
          <p className="underline font-black">{scheduleData?.nama || '................................................'}</p>
          <p className="font-mono text-[9px] mt-1 uppercase">NIP. {scheduleData?.nip || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default InstrumentTendikView;
