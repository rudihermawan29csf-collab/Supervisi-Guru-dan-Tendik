
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
    kesimpulan: "Sangat Memuaskan. Pengelolaan administrasi sangat tertib, dokumen lengkap, and disusun sesuai dengan standar operasional sekolah.",
    saran: "Pertahankan konsistensi kinerja and mulailah mengembangkan sistem digitalisasi arsip untuk efisiensi jangka panjang."
  };
  if (score >= 76) return {
    kesimpulan: "Baik. Sebagian besar komponen administrasi tersedia and tertata, namun ada beberapa detail kecil yang perlu diperbarui.",
    saran: "Lakukan pengecekan berkala terhadap masa berlaku dokumen and lengkapi rincian tugas yang masih bersifat umum."
  };
  if (score >= 60) return {
    kesimpulan: "Cukup. Administrasi dasar sudah ada, tetapi sistem pengarsipan and kelengkapan pendukung masih perlu banyak perbaikan.",
    saran: "Segera lengkapi dokumen yang kurang dalam waktu 1 minggu and mintalah bimbingan teknis dari koordinator tata usaha."
  };
  return {
    kesimpulan: "Kurang. Banyak komponen administrasi penting yang tidak tersedia atau tidak terawat dengan baik.",
    saran: "Diperlukan pembinaan intensif oleh Kepala Sekolah and penataan ulang seluruh sistem administrasi di bidang ini."
  };
};

const SEKOLAH_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Program Kerja Sekolah' },
  { no: '2', label: 'Kalender Pendidikan' },
  { no: '3', label: 'Jadwal Kegiatan Pertahun' },
  { no: '4', label: 'Administrasi Umum/ Surat menyurat', isHeader: true },
  { no: 'a', label: 'Agenda', isSub: true },
  { no: 'b', label: 'Buku Ekspedisi', isSub: true },
  { no: 'c', label: 'Pengarsipan (Filing)', isSub: true },
  { no: 'd', label: 'Buku Tamu umum', isSub: true },
  { no: 'e', label: 'Buku Tamu Pembinaan', isSub: true },
  { no: 'f', label: 'Notulen Rapat', isSub: true },
  { no: '5', label: 'Struktur Organisasi' },
  { no: '6', label: 'Pembagian Tugas and Uraiannya' },
  { no: '7', label: 'Papan Data Ketenagaan and Kesiswaan' },
  { no: '8', label: 'Program PKG and PKB' },
  { no: '9', label: 'Rapat Kerja Awal Tahun Ajaran' },
  { no: '10', label: 'Laporan Bulanan, Tengah Tahunan, and Tahunan' },
  { no: '11', label: 'Nomor Induk Sekolah (NIS)' },
  { no: '12', label: 'Ijin Operasional' },
  { no: '13', label: 'Kelembagaan', isHeader: true },
  { no: 'a', label: 'Akte Pendirian', isSub: true },
  { no: 'b', label: 'NPSN', isSub: true },
  { no: 'c', label: 'Program Kerja Sekolah', isSub: true },
];

const KETENAGAAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Kepala Sekolah', isHeader: true },
  { no: 'a', label: 'Biodata', isSub: true },
  { no: 'b', label: 'Program Kerja Kepala Sekolah', isSub: true },
  { no: 'c', label: 'Buku Agenda Kepala Sekolah', isSub: true },
  { no: 'd', label: 'Jadwal Supervisi Kelas', isSub: true },
  { no: 'e', label: 'Pelaksanaan Supervisi Kelas', isSub: true },
  { no: 'f', label: 'PPK Guru and Pegawai', isSub: true },
  { no: 'g', label: 'PAK Tahunan', isSub: true },
  { no: 'h', label: 'PKKS/PKG', isSub: true },
  { no: '2', label: 'Guru', isHeader: true },
  { no: 'a', label: 'Biodata', isSub: true },
  { no: 'b', label: 'Buku Agenda Guru', isSub: true },
  { no: 'c', label: 'Presensi Guru', isSub: true },
  { no: 'd', label: 'Kesesuain Tugas and SK', isSub: true },
  { no: 'e', label: 'Kelebihan Guru per Mata Pelajaran', isSub: true },
  { no: 'f', label: 'Kekurangan', isSub: true },
  { no: '3', label: 'Tata Usaha', isHeader: true },
  { no: 'a', label: 'Daftar Presensi', isSub: true },
  { no: 'b', label: 'Pembagian Tugas', isSub: true },
  { no: 'c', label: 'Rincian Tugas', isSub: true },
  { no: 'd', label: 'Catatan Hasil Pekerjaan/ Jurnal', isSub: true },
  { no: '4', label: 'Buku Induk Pegawai' },
  { no: '5', label: 'File', isHeader: true },
  { no: 'a', label: 'Kepala Sekolah', isSub: true },
  { no: 'b', label: 'Guru', isSub: true },
  { no: 'c', label: 'Pegawai', isSub: true },
];

const PERLENGKAPAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Pemilikan Gedung', isHeader: true },
  { no: 'a', label: 'Milik Sendiri', isSub: true },
  { no: 'b', label: 'Sewa', isSub: true },
  { no: 'c', label: 'Menumpang', isSub: true },
  { no: '2', label: 'Buku Induk Barang Inventaris' },
  { no: '3', label: 'Buku Golongan Barang Inventaris' },
  { no: '4', label: 'Daftar Barang Inventaris Kelas/ Ruang' },
  { no: '5', label: 'Buku Barang Inventaris' },
  { no: '6', label: 'Buku Pembelian Barang' },
  { no: '7', label: 'Buku Penerimaan Barang' },
  { no: '8', label: 'Buku/ Kartu Stok Barang' },
  { no: '9', label: 'Kartu Pemeliharaan' },
  { no: '10', label: 'Penghapusan Barang' },
  { no: '11', label: 'Nomor Inventaris' },
  { no: '12', label: 'Barang Inventaris', isHeader: true },
  { no: 'a', label: 'Dipakai Sendiri', isSub: true },
  { no: 'b', label: 'Dipakai Bersama', isSub: true },
  { no: '13', label: 'Laporan' },
];

const PERPUSTAKAAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Ruang Perpustakaan' },
  { no: '2', label: 'Pengelola' },
  { no: '3', label: 'Program Kerja' },
  { no: '4', label: 'Perlengkapan', isHeader: true },
  { no: 'a', label: 'Buku Induk Perpustakaan', isSub: true },
  { no: 'b', label: 'Klasifikasi Buku', isSub: true },
  { no: 'c', label: 'Katalog', isSub: true },
  { no: 'd', label: 'Kartu Peminjam', isSub: true },
  { no: 'e', label: 'Buku Peminjam', isSub: true },
  { no: 'f', label: 'Daftar Pengunjung', isSub: true },
  { no: 'g', label: 'Kartu Buku', isSub: true },
  { no: '5', label: 'Tempat Penyimpanan', isHeader: true },
  { no: 'a', label: 'Lemari', isSub: true },
  { no: 'b', label: 'Rak', isSub: true },
  { no: 'c', label: 'Meja Baca + Kursi', isSub: true },
  { no: '6', label: 'Pemeliharaan', isHeader: true },
  { no: 'a', label: 'Ruang', isSub: true },
  { no: 'b', label: 'Buku', isSub: true },
  { no: 'c', label: 'Kebersihan', isSub: true },
  { no: '7', label: 'Tata Tertib' },
  { no: '8', label: 'Laporan' },
];

const LAB_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Ruang Laboratorium' },
  { no: '2', label: 'Pengelola Laboratorium (Laboran)' },
  { no: '3', label: 'Jadwal Penggunaan' },
  { no: '4', label: 'Tata Tertib' },
  { no: '5', label: 'Daftar Bahan' },
  { no: '6', label: 'Daftar Alat' },
  { no: '7', label: 'Daftar Hasil Praktikum' },
  { no: '8', label: 'Penempatan Alat and Bahan' },
  { no: '9', label: 'Pemeliharaan Lab and alat' },
  { no: '10', label: 'Alat Pemadam Kebakaran' },
  { no: '11', label: 'Tersedianya Alat PPPK' },
];

const KESISWAAN_ITEMS: ConfigItem[] = [
  { no: '1', label: 'Buku Induk' },
  { no: '2', label: 'Buku Klaper' },
  { no: '3', label: 'Buku Mutasi' },
  { no: '4', label: 'Daftar Hadir Siswa' },
  { no: '5', label: 'Tata Tertib' },
  { no: '6', label: 'Buku Kelas/ Legger' },
  { no: '7', label: 'Papan Absen Kelas' },
  { no: '8', label: 'Daftar kelas' },
  { no: '9', label: 'O S I S', isHeader: true },
  { no: 'a', label: 'Struktur Organisasi', isSub: true },
  { no: 'b', label: 'Pengurus', isSub: true },
  { no: 'c', label: 'Program', isSub: true },
  { no: 'd', label: 'Pelaksanaan', isSub: true },
  { no: 'e', label: 'Laporan Dokumentasi Prestasi Siswa', isSub: true },
  { no: '10', label: 'Prestasi Siswa', isHeader: true },
  { no: 'a', label: 'Bea Siswa', isSub: true },
  { no: 'b', label: 'Bidang Studi/ O.R/ Seni Budaya/Lain2', isSub: true },
  { no: 'c', label: '................................................', isSub: true },
  { no: 'd', label: '................................................', isSub: true },
  { no: '11', label: 'Daftar (Daftar Peserta UN)' },
  { no: '12', label: 'Dokumen Penyerahan STTB' },
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
    if (type === 'perlengkapan') return PERLENGKAPAN_ITEMS;
    if (type === 'perpustakaan') return PERPUSTAKAAN_ITEMS;
    if (type === 'kesiswaan') return KESISWAAN_ITEMS;
    if (type === 'lab-ipa' || type === 'lab-komputer') return LAB_ITEMS;
    return SEKOLAH_ITEMS;
  }, [type]);

  const scheduleData = useMemo(() => {
    return adminRecords.find(r => {
      if (r.semester !== activeSemester) return false;
      const activity = r.kegiatan.toLowerCase();
      // Perbaikan logika pencocokan agar lebih fleksibel terhadap kata kunci "IPA", "Komputer", dll.
      if (type === 'lab-ipa') return activity.includes('laboratorium ipa') || (activity.includes('lab') && activity.includes('ipa'));
      if (type === 'lab-komputer') return activity.includes('laboratorium komputer') || (activity.includes('lab') && activity.includes('komputer'));
      if (type === 'sekolah') return activity.includes('administrasi sekolah');
      if (type === 'kesiswaan') return activity.includes('kesiswaan');
      if (type === 'ketenagaan') return activity.includes('ketenagaan');
      if (type === 'perlengkapan') return activity.includes('perlengkapan');
      if (type === 'perpustakaan') return activity.includes('perpustakaan');
      
      // Fix: Casting 'type' to string because TypeScript's exhaustiveness check makes it 'never' here.
      return activity.includes((type as string).replace('-', ' ').toLowerCase());
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
    setRemarks(p => ({ ...p, [idx]: val === 1 ? "Tersedia" : "Belum Tersedia" }));
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
    alert(`Hasil supervisi tendik berhasil disimpan!`);
  };

  const title = useMemo(() => {
    if (type === 'ketenagaan') return 'SUPERVISI ADMINISTRASI KETENAGAAN';
    if (type === 'perlengkapan') return 'SUPERVISI ADMINISTRASI PERLENGKAPAN';
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

      <div id="tendik-instr-export" className="bg-white shadow-xl border border-slate-300 p-10 max-w-5xl mx-auto text-gray-900 animate-fadeIn mb-20">
        <div className="text-center mb-8 border-b-4 border-double border-slate-900 pb-2">
            <h1 className="text-xl font-black uppercase tracking-widest leading-none">{title}</h1>
            <h2 className="text-lg font-bold uppercase mt-1">SEMESTER {activeSemester.toUpperCase()} *)</h2>
            <p className="text-xs font-bold uppercase tracking-tight">TAHUN PELAJARAN {settings.tahunPelajaran}</p>
        </div>

        <div className="grid grid-cols-1 gap-y-0.5 text-xs font-bold mb-8 max-w-2xl">
             <div className="flex"><span className="w-32">Nama Sekolah</span><span>: {settings.namaSekolah}</span></div>
             <div className="flex"><span className="w-32">Alamat Sekolah</span><span>: Jl. Tirta Wening Ds. Kembangbelor</span></div>
             <div className="flex"><span className="w-32">Hari / Tanggal</span><span className="text-blue-700">: {scheduleData ? `${scheduleData.hari}, ${scheduleData.tgl}` : '..............................'}</span></div>
             <div className="flex"><span className="w-32">Nama Petugas</span><span className="text-blue-700">: {scheduleData?.nama || '..............................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-10">NO</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">KEGIATAN</th>
              <th colSpan={2} className="border-2 border-slate-900 p-1">JAWABAN</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 w-16">NILAI</th>
              <th rowSpan={2} className="border-2 border-slate-900 p-2 text-left">KETERANGAN</th>
            </tr>
            <tr className="bg-slate-50 font-bold text-center">
              <th className="border-2 border-slate-900 p-1 w-16 text-[9px]">YA/ADA</th>
              <th className="border-2 border-slate-900 p-1 w-16 text-[9px]">TIDAK</th>
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
               <td colSpan={2} className="border-2 border-slate-900 p-2 text-center uppercase tracking-widest">JUMLAH / RATA-RATA</td>
               <td colSpan={2} className="border-2 border-slate-900 p-2 text-center bg-blue-50">{stats.totalScore}</td>
               <td className="border-2 border-slate-900 p-2 text-center bg-blue-100">{(stats.average * 100).toFixed(0)}%</td>
               <td className="border-2 border-slate-900 p-2 text-center uppercase text-[9px] bg-slate-50 italic">
                  {stats.average >= 0.91 ? 'SANGAT BAIK' : stats.average >= 0.76 ? 'BAIK' : stats.average >= 0.60 ? 'CUKUP' : 'KURANG'}
               </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 space-y-4">
             <div className="border-b border-slate-400 pb-1">
                <h3 className="text-sm font-bold uppercase tracking-tight text-blue-700">KESIMPULAN :</h3>
                <textarea value={kesimpulan} onChange={e => setKesimpulan(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium" />
             </div>
             <div className="border-b border-slate-400 pb-1">
                <h3 className="text-sm font-bold uppercase tracking-tight text-emerald-700">SARAN :</h3>
                <textarea value={saran} onChange={e => setSaran(e.target.value)} rows={2} className="w-full bg-transparent outline-none text-sm italic py-1 font-medium" />
             </div>
        </div>

        <div className="mt-12 grid grid-cols-2 text-sm font-bold tracking-tight text-center">
              <div className="flex flex-col justify-between h-36">
                 <p className="uppercase leading-tight">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
                 <div><p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p><p className="font-mono text-xs uppercase">NIP. {settings.nipKepalaSekolah}</p></div>
              </div>
              <div className="flex flex-col justify-between h-36">
                 <p className="leading-tight">Mojokerto, <span className="text-blue-700">{scheduleData?.tgl || '.....................'}</span><br/>Petugas,</p>
                 <div><p className="underline uppercase font-black text-blue-700">{scheduleData?.nama || '................................................'}</p><p className="font-mono text-xs uppercase text-blue-700">NIP. {scheduleData?.nip || '................................................'}</p></div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentTendikView;
