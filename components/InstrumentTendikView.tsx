
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, InstrumentResult, AdminRecord } from '../types';

type TendikType = 'sekolah' | 'ketenagaan' | 'perlengkapan' | 'perpustakaan' | 'lab-ipa' | 'lab-komputer' | 'kesiswaan';

interface ConfigItem {
  no: string;
  label: string;
  isSub?: boolean;
  isHeader?: boolean;
}

const getAutoFeedback = (average: number) => {
  const score = average * 100;
  if (score >= 91) return {
    kesimpulan: "Sangat Memuaskan. Pengelolaan administrasi sangat tertib, dokumen lengkap, dan disusun sesuai dengan standar operasional sekolah.",
    saran: "Pertahankan konsistensi kinerja dan mulailah mengembangkan sistem digitalisasi arsip untuk efisiensi jangka panjang."
  };
  if (score >= 76) return {
    kesimpulan: "Baik. Sebagian besar komponen administrasi tersedia dan tertata, namun ada beberapa detail kecil yang perlu diperbarui.",
    saran: "Lakukan pengecekan berkala terhadap masa berlaku dokumen dan lengkapi rincian tugas yang masih bersifat umum."
  };
  if (score >= 60) return {
    kesimpulan: "Cukup. Administrasi dasar sudah ada, tetapi sistem pengarsipan dan kelengkapan pendukung masih perlu banyak perbaikan.",
    saran: "Segera lengkapi dokumen yang kurang dalam waktu 1 minggu dan mintalah bimbingan teknis dari koordinator tata usaha."
  };
  return {
    kesimpulan: "Kurang. Banyak komponen administrasi penting yang tidak tersedia atau tidak terawat dengan baik.",
    saran: "Diperlukan pembinaan intensif oleh Kepala Sekolah dan penataan ulang seluruh sistem administrasi di bidang ini."
  };
};

const SEKOLAH_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Program Kerja Sekolah (RKS/RKAS)' },
  { no: '2', label: 'Kalender Pendidikan' },
  { no: '3', label: 'Struktur Organisasi Sekolah' },
  { no: '4', label: 'Pembagian Tugas Guru dan Tenaga Kependidikan' },
  { no: '5', label: 'Peraturan Akademik' },
  { no: '6', label: 'Administrasi Umum/ Surat Menyurat', isHeader: true },
  { no: 'a', label: 'Buku Agenda Masuk & Keluar', isSub: true },
  { no: 'b', label: 'Buku Ekspedisi', isSub: true },
  { no: 'c', label: 'Sistem Pengarsipan (Filing)', isSub: true },
  { no: 'd', label: 'Buku Tamu (Umum/Instansi/Pembinaan)', isSub: true },
  { no: '7', label: 'Papan Data (Ketenagaan/Kesiswaan/Sarpras)' },
  { no: '8', label: 'Laporan Bulanan/Tahunan' },
];

const KETENAGAAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Buku Induk Pegawai' },
  { no: '2', label: 'Daftar Urut Kepangkatan (DUK)' },
  { no: '3', label: 'File Dokumen (SK CPNS/PNS/Gaji Berkala)' },
  { no: '4', label: 'Daftar Presensi Guru dan Pegawai' },
  { no: '5', label: 'Data Sertifikasi Guru' },
  { no: '6', label: 'Uraian Tugas Pendidik & Tenaga Kependidikan' },
  { no: '7', label: 'Data Diklat/Pelatihan Pegawai' },
  { no: '8', label: 'Sistem Penilaian Kinerja (PKG/SKP)' },
];

const PERLENGKAPAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Buku Induk Barang Inventaris' },
  { no: '2', label: 'Buku Golongan Barang Inventaris' },
  { no: '3', label: 'Buku Catatan Non Inventaris' },
  { no: '4', label: 'Daftar Inventaris Ruangan (DIR)' },
  { no: '5', label: 'Buku Penerimaan & Pengeluaran Barang' },
  { no: '6', label: 'Kartu Stok Barang' },
  { no: '7', label: 'Dokumen Penghapusan Barang' },
  { no: '8', label: 'Program Perawatan/Pemeliharaan Sarpras' },
];

const PERPUSTAKAAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Program Kerja Perpustakaan' },
  { no: '2', label: 'Buku Induk Perpustakaan' },
  { no: '3', label: 'Sistem Klasifikasi Buku (DDC)' },
  { no: '4', label: 'Katalog Buku (Manual/Digital)' },
  { no: '5', label: 'Buku Pengunjung & Peminjam' },
  { no: '6', label: 'Kartu Anggota & Kartu Buku' },
  { no: '7', label: 'Laporan Statistik Perpustakaan' },
  { no: '8', label: 'Tata Tertib Perpustakaan' },
];

const LAB_IPA_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Program Kerja Laboratorium IPA' },
  { no: '2', label: 'Jadwal Penggunaan Laboratorium' },
  { no: '3', label: 'Buku Inventaris Alat & Bahan' },
  { no: '4', label: 'Daftar Alat/Bahan Pecah Belah & Habis Pakai' },
  { no: '5', label: 'Buku Catatan Kegiatan Praktikum' },
  { no: '6', label: 'Tata Tertib Laboratorium' },
  { no: '7', label: 'Alat Pemadam Api Ringan (APAR) & P3K' },
  { no: '8', label: 'Laporan Kerusakan Alat' },
];

const LAB_KOMPUTER_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Program Kerja Lab Komputer' },
  { no: '2', label: 'Jadwal Penggunaan Ruang Komputer' },
  { no: '3', label: 'Buku Inventaris Komputer & Periferal' },
  { no: '4', label: 'Log Book Pemakaian Komputer' },
  { no: '5', label: 'Kartu Riwayat Perawatan PC/Laptop' },
  { no: '6', label: 'Daftar Software & Lisensi' },
  { no: '7', label: 'Tata Tertib Penggunaan IT' },
  { no: '8', label: 'Laporan Kondisi Jaringan (LAN/Wifi)' },
];

const KESISWAAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Buku Induk Siswa (Digital/Cetak)' },
  { no: '2', label: 'Buku Klaper' },
  { no: '3', label: 'Buku Mutasi Siswa' },
  { no: '4', label: 'Data Statistik Siswa' },
  { no: '5', label: 'Dokumen PPDB' },
  { no: '6', label: 'Program Ekstrakurikuler & OSIS' },
  { no: '7', label: 'Buku Catatan Prestasi Siswa' },
  { no: '8', label: 'Buku Absensi Kelas' },
  { no: '9', label: 'Dokumen Penelusuran Tamatan' },
];

interface Props {
  type: TendikType;
  settings: AppSettings;
  adminRecords: AdminRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (key: string, data: InstrumentResult) => void;
  setSettings: (s: AppSettings) => void;
}

const InstrumentTendikView: React.FC<Props> = ({ type, settings, adminRecords, instrumentResults, onSave, setSettings }) => {
  const activeSemester = settings.semester;
  const storageKey = `tendik-${type}-${activeSemester}`;

  const currentItems = useMemo(() => {
    if (type === 'ketenagaan') return KETENAGAAN_ITEMS;
    if (type === 'perpustakaan') return PERPUSTAKAAN_ITEMS;
    if (type === 'perlengkapan') return PERLENGKAPAN_ITEMS;
    if (type === 'lab-ipa') return LAB_IPA_ITEMS;
    if (type === 'lab-komputer') return LAB_KOMPUTER_ITEMS;
    if (type === 'kesiswaan') return KESISWAAN_ITEMS;
    return SEKOLAH_ITEMS;
  }, [type]);

  const scheduleData = useMemo(() => {
    return adminRecords.find(r => {
      if (r.semester !== activeSemester) return false;
      const activity = r.kegiatan.toLowerCase();
      if (type === 'lab-ipa' && activity.includes('ipa')) return true;
      if (type === 'lab-komputer' && activity.includes('komp')) return true;
      if (type === 'perpustakaan' && activity.includes('perpustakaan')) return true;
      if (type === 'ketenagaan' && activity.includes('ketenagaan')) return true;
      if (type === 'perlengkapan' && (activity.includes('perlengkapan') || activity.includes('sarpras'))) return true;
      if (type === 'sekolah' && activity.includes('sekolah')) return true;
      if (type === 'kesiswaan' && activity.includes('kesiswaan')) return true;
      return false;
    });
  }, [adminRecords, activeSemester, type]);

  const [scores, setScores] = useState<Record<number, number>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [kesimpulan, setKesimpulan] = useState('');
  const [saran, setSaran] = useState('');

  useEffect(() => {
    const saved = instrumentResults[storageKey];
    if (saved) {
      setScores(saved.scores as any || {});
      setRemarks(saved.remarks || {});
      setKesimpulan(saved.catatan || '');
      setSaran(saved.tindakLanjut || '');
    } else {
      setScores({});
      setRemarks({});
      setKesimpulan('');
      setSaran('');
    }
  }, [storageKey, instrumentResults]);

  const stats = useMemo(() => {
    const scoreValues = Object.values(scores).filter(v => typeof v === 'number') as number[];
    const totalScore = scoreValues.reduce((sum, s) => sum + s, 0);
    const count = currentItems.filter(item => !item.isHeader).length;
    const average = count > 0 ? (totalScore / count) : 0;
    return { totalScore, count, average };
  }, [scores, currentItems]);

  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      const feedback = getAutoFeedback(stats.average);
      setKesimpulan(feedback.kesimpulan);
      setSaran(feedback.saran);
    }
  }, [stats.average]);

  const handleScoreChange = (idx: number, val: number) => {
    setScores(p => ({ ...p, [idx]: val }));
    setRemarks(p => ({ ...p, [idx]: val === 1 ? "Lengkap/Tersedia" : "Belum Tersedia" }));
  };

  const exportPDF = () => {
    const element = document.getElementById('tendik-instr-export');
    // @ts-ignore
    html2pdf().from(element).save(`Tendik_${type}_${settings.semester}.pdf`);
  };

  const handleSave = () => {
    onSave(storageKey, { 
      scores, 
      remarks, 
      catatan: kesimpulan, 
      tindakLanjut: saran 
    });
    alert(`Hasil supervisi ${type} berhasil disimpan!`);
  };

  const title = useMemo(() => {
    if (type === 'ketenagaan') return 'SUPERVISI ADMINISTRASI KETENAGAAN';
    if (type === 'perlengkapan') return 'SUPERVISI ADMINISTRASI PERLENGKAPAN / SARPRAS';
    if (type === 'perpustakaan') return 'SUPERVISI ADMINISTRASI PERPUSTAKAAN';
    if (type === 'lab-ipa') return 'SUPERVISI LABORATORIUM IPA';
    if (type === 'lab-komputer') return 'SUPERVISI LABORATORIUM KOMPUTER';
    if (type === 'kesiswaan') return 'SUPERVISI ADMINISTRASI KESISWAAN';
    return 'SUPERVISI ADMINISTRASI SEKOLAH';
  }, [type]);

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${settings.semester === 'Ganjil' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>Semester Ganjil</button>
           <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${settings.semester === 'Genap' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>Semester Genap</button>
        </div>
        <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
            <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg ml-2">Simpan Hasil</button>
        </div>
      </div>

      <div id="tendik-instr-export" className="bg-white shadow-xl border border-slate-300 p-10 max-w-5xl mx-auto text-gray-900 font-serif mb-20">
        <div className="text-center mb-8 border-b-4 border-double border-slate-900 pb-2">
            <h1 className="text-xl font-black uppercase tracking-widest leading-none">{title}</h1>
            <h2 className="text-lg font-bold uppercase mt-1">SEMESTER {activeSemester.toUpperCase()} *)</h2>
            <p className="text-xs font-bold uppercase tracking-tight">TAHUN PELAJARAN {settings.tahunPelajaran}</p>
        </div>

        <div className="grid grid-cols-1 gap-y-0.5 text-xs font-bold mb-8 max-w-2xl">
             <div className="flex"><span className="w-40">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
             <div className="flex"><span className="w-40">Alamat Sekolah</span><span>: Jl. Tirta Wening Ds. Kembangbelor</span></div>
             <div className="flex"><span className="w-40">Hari / Tanggal</span><span className="text-blue-700">: {scheduleData ? `${scheduleData.hari}, ${scheduleData.tgl}` : '..............................'}</span></div>
             <div className="flex"><span className="w-40">Nama Petugas</span><span className="text-blue-700 uppercase">: {scheduleData?.nama || '..............................'}</span></div>
             <div className="flex"><span className="w-40">NIP Petugas</span><span className="text-blue-700">: {scheduleData?.nip || '..............................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">NO</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">KOMPONEN KEGIATAN</th>
              <th colSpan={2} className="border-2 border-slate-900 p-1">JAWABAN</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-16">SKOR</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">KETERANGAN</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center">
              <th className="border-2 border-slate-900 p-1 w-16 text-[9px]">ADA (1)</th>
              <th className="border-2 border-slate-900 p-1 w-16 text-[9px]">TIDAK (0)</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx} className={`${item.isHeader ? 'bg-slate-50' : ''}`}>
                <td className="border-2 border-slate-900 p-2 text-center font-bold">{!item.isSub ? item.no : ''}</td>
                <td className={`border-2 border-slate-900 p-2 ${item.isSub ? 'pl-8 italic' : 'font-bold'}`}>{item.isSub ? `${item.no}. ${item.label}` : item.label}</td>
                {item.isHeader ? (
                  <><td className="border-2 border-slate-900 bg-slate-300"></td><td className="border-2 border-slate-900 bg-slate-300"></td><td className="border-2 border-slate-900 bg-slate-300"></td><td className="border-2 border-slate-900 bg-slate-300"></td></>
                ) : (
                  <>
                    <td className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(idx, 1)}>
                      <div className={`w-5 h-5 mx-auto border border-slate-900 flex items-center justify-center ${scores[idx] === 1 ? 'bg-slate-800 text-white font-black' : 'bg-white'}`}>{scores[idx] === 1 && "v"}</div>
                    </td>
                    <td className="border-2 border-slate-900 p-1 text-center cursor-pointer no-print" onClick={() => handleScoreChange(idx, 0)}>
                      <div className={`w-5 h-5 mx-auto border border-slate-900 flex items-center justify-center ${scores[idx] === 0 ? 'bg-slate-800 text-white font-black' : 'bg-white'}`}>{scores[idx] === 0 && "v"}</div>
                    </td>
                    <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-black">{scores[idx] === 1 ? 'v' : ''}</td>
                    <td className="border-2 border-slate-900 p-1 text-center hidden print:table-cell font-black">{scores[idx] === 0 ? 'v' : ''}</td>
                    <td className="border-2 border-slate-900 p-2 text-center font-black">{scores[idx] !== undefined ? scores[idx] : ''}</td>
                    <td className="border-2 border-slate-900 p-1 italic text-[9px]">{remarks[idx]}</td>
                  </>
                )}
              </tr>
            ))}
            <tr className="bg-slate-100 font-black">
               <td colSpan={2} className="border-2 border-slate-900 p-2 text-center uppercase tracking-widest">HASIL KETERCAPAIAN (%)</td>
               <td colSpan={2} className="border-2 border-slate-900 p-2 text-center bg-blue-50">{stats.totalScore}</td>
               <td className="border-2 border-slate-900 p-2 text-center bg-blue-100 font-black text-lg">{(stats.average * 100).toFixed(0)}%</td>
               <td className="border-2 border-slate-900 p-2 text-center uppercase text-[9px] bg-slate-50 italic font-black">
                  {stats.average >= 0.91 ? 'SANGAT BAIK' : stats.average >= 0.76 ? 'BAIK' : stats.average >= 0.60 ? 'CUKUP' : 'KURANG'}
               </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 space-y-4">
             <div className="border-b border-slate-400 pb-1">
                <h3 className="text-sm font-bold uppercase tracking-tight text-blue-700">KESIMPULAN HASIL SUPERVISI :</h3>
                <textarea value={kesimpulan} onChange={e => setKesimpulan(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium leading-relaxed" />
             </div>
             <div className="border-b border-slate-400 pb-1">
                <h3 className="text-sm font-bold uppercase tracking-tight text-emerald-700">SARAN TINDAK LANJUT :</h3>
                <textarea value={saran} onChange={e => setSaran(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium leading-relaxed" />
             </div>
        </div>

        <div className="mt-12 grid grid-cols-2 text-sm font-bold tracking-tight text-center">
              <div className="flex flex-col justify-between h-36">
                 <p className="uppercase leading-tight">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
                 <div><p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p><p className="font-mono text-xs uppercase">NIP. {settings.nipKepalaSekolah}</p></div>
              </div>
              <div className="flex flex-col justify-between h-36">
                 <p className="leading-tight">Mojokerto, <span className="text-blue-700">{scheduleData?.tgl || '.....................'}</span><br/>Petugas Supervisor,</p>
                 <div><p className="underline uppercase font-black">................................................</p><p className="font-mono text-xs uppercase">NIP. ................................................</p></div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentTendikView;
