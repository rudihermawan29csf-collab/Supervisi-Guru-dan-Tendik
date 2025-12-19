
import { TeacherRecord, SupervisionStatus, DaySchedule, TeacherCode } from './types';

export const INITIAL_TEACHERS: TeacherRecord[] = [
  { id: 1, no: 1, hari: '', tanggal: '', namaGuru: 'Dra. Sri Hayati', nip: '19670628 200801 2 006', pangkatGolongan: 'III/d', mataPelajaran: 'Bahasa Indonesia', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 2, no: 2, hari: '', tanggal: '', namaGuru: 'Bakhtiar Rifai, SE', nip: '19800304 200801 1 009', pangkatGolongan: 'III/d', mataPelajaran: 'IPS', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 3, no: 3, hari: '', tanggal: '', namaGuru: 'Akhmad Hariadi, S.Pd', nip: '19751108 200901 1 001', pangkatGolongan: 'III/c', mataPelajaran: 'Bahasa Inggris', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 4, no: 4, hari: '', tanggal: '', namaGuru: 'Moch. Husain Rifai Hamzah, S.Pd.', nip: '19920316 202012 1 011', pangkatGolongan: 'III/b', mataPelajaran: 'PJOK', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 5, no: 5, hari: '', tanggal: '', namaGuru: 'Rudi Hermawan, S.Pd.I', nip: '19891029 202012 1 003', pangkatGolongan: 'III/b', mataPelajaran: 'Pendidikan Agama Islam', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 6, no: 6, hari: '', tanggal: '', namaGuru: 'Okha Devi Anggraini, S.Pd.', nip: '19941002 202012 2 008', pangkatGolongan: 'IX', mataPelajaran: 'BK', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 7, no: 7, hari: '', tanggal: '', namaGuru: 'Eka Hariyati, S. Pd.', nip: '19731129 202421 2 003', pangkatGolongan: 'IX', mataPelajaran: 'PPKn', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 8, no: 8, hari: '', tanggal: '', namaGuru: 'Retno Nawangwulan, S. Pd.', nip: '19850703 202521 2 006', pangkatGolongan: 'IX', mataPelajaran: 'Bahasa Inggris', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 9, no: 9, hari: '', tanggal: '', namaGuru: 'Mikoe Wahyudi Putra, ST., S. Pd.', nip: '19820222 202421 1 004', pangkatGolongan: 'IX', mataPelajaran: 'BK', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 10, no: 10, hari: '', tanggal: '', namaGuru: 'Purnadi, S. Pd.', nip: '19680705 202421 1 001', pangkatGolongan: 'IX', mataPelajaran: 'Matematika', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 11, no: 11, hari: '', tanggal: '', namaGuru: 'Israfin Maria Ulfa, S.Pd', nip: '19850131 202521 2 004', pangkatGolongan: 'IX', mataPelajaran: 'IPS', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 12, no: 12, hari: '', tanggal: '', namaGuru: 'Syadam Budi Satrianto, S.Pd', nip: '-', pangkatGolongan: '-', mataPelajaran: 'Bahasa Jawa', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 13, no: 13, hari: '', tanggal: '', namaGuru: 'Rebby Dwi Prataopu, S.Si', nip: '-', pangkatGolongan: '-', mataPelajaran: 'IPA', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 14, no: 14, hari: '', tanggal: '', namaGuru: 'Fakhita Madury, S.Sn.', nip: '-', pangkatGolongan: '-', mataPelajaran: 'Seni', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 15, no: 15, hari: '', tanggal: '', namaGuru: 'Mukhamad Yunus, S.Pd', nip: '-', pangkatGolongan: '-', mataPelajaran: 'IPA', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
  { id: 16, no: 16, hari: '', tanggal: '', namaGuru: 'Fahmi Wahyuni, S.Pd', nip: '-', pangkatGolongan: '-', mataPelajaran: 'Bahasa Indonesia', kelas: '', jamKe: '', status: SupervisionStatus.PENDING, semester: 'Ganjil' },
];

export const DATA_PTT = [
  {
    no: 1, nama: "Imam Safi'i", jabatan: "PTT", nip: "-", 
    tugas: [
      { label: "1. Koordinator Tenaga Administrasi Sekolah", detail: "1.1. Struktur Organisasi Sekolah" },
      { label: "2. Pelaksana Urusan Administrasi Kepegawaian", detail: "2.1. File Guru dan Karyawan, 2.2. Papan Data ketenagaan" },
      { label: "3. Proktor Kegiatan Evaluasi dan Penilaian", detail: "3.1. Pelaksana Asesmen Kompetensi Minimum, 3.2. Kegiatan Evaluasi dan Penilaian lainnya" },
      { label: "4. Operator PPDB", detail: "4. Melaksanakan kegiatan PPDB (Online) mulai dari persiapan, pelaksanaan, sampai pada pelaporan kegiatan." },
      { label: "5. Operator Dapodik", detail: "5.1. Pelaksana Dapodik, 5.2. Pelaksana E Rapor, 5.3. Pembuat Nomor Induk Siswa" },
      { label: "6. Urusan Mutasi Peserta Didik", detail: "6.1. Penyelesaian Mutasi Siswa, 6.2. Buku Klaper" }
    ]
  },
  {
    no: 2, nama: "Mansyur Rohmad", jabatan: "PTT", nip: "-",
    tugas: [
      { label: "1. Pelaksana Urusan Adm.Humas", detail: "1.1. Buku Absensi GTT/PTT, 1.2. Membantu pelaksanaan kegiatan Humas" },
      { label: "2. Pelaksana Urusan Administrasi Kesiswaan", detail: "2.1. Pengisian Identitas Buku Induk Siswa, 2.2. Pengisian Data Nilai Siswa Ke Buku Induk, 2.3. Penempelan Foto Siswa di Buku Induk, 2.4. Penyelesaian Buku Raport Siswa" },
      { label: "3. Pelaksana Urusan Sarana dan Prasarana", detail: "3.1. Koordinator Perawatan Sarana Sekolah, 3.2. Petugas Perpustakaan" }
    ]
  },
  {
    no: 3, nama: "Rayi Putri Lestari, S.Pd.", jabatan: "PTT", nip: "-",
    tugas: [
      { label: "1. Pelaksana Urusan Adm. Persuratan dan pengarsipan", detail: "1.1. Agenda Surat, 1.2. Penerima Surat/Disposisi, 1.3. Pembuat/Pencetak SPPD, 1.4. Buku Ekspidisi, 1.5. Pengarsipan Surat ( Filling ), 1.6. Buku Tamu Umum, 1.7. Buku Tamu Dinas, 1.8. Buku Notulen Rapat, 1.9. Bel Pelaksanaan PBM, 1.10. Cek List Jurnal Guru Perminggu" },
      { label: "2. Pengelola Urusan KIP/PIP/PKH/KKS", detail: "2. Terlaksananya proses KIP/PIP/PKH/KKS bagi peserta Didik" },
      { label: "3. Pelaksana Urusan Administrasi Kurikulum", detail: "3.1. Arsip Ijazah SD, 3.2. Arsip Ijazah SMP, 3.3. Legalisir Ijazah." },
      { label: "4. Staf Kepegawaian", detail: "4.1. Buku Daftar Urutan Kepangkatan, 4.2. Daftar Tenaga masa Kenaikan Berkala, 4.3. Daftar masa Purna Tugas." }
    ]
  },
  {
    no: 4, nama: "Mochamad Ansori", jabatan: "PTT", nip: "-",
    tugas: [
      { label: "1. Pelaksana Urusan Administrasi Layanan Khusus", detail: "1.1. Kurir persuratan, 1.2. Tugas pelayanan tertentu" },
      { label: "2. Petugas Kebersihan", detail: "2.1. Kebersihan Ruang Guru, 2.2. Kebersihan Ruang TU, 2.3. Kebersihan Semua Toilet Sekolah, 2.4. Kebersihan Lingkungan Sekolah." },
      { label: "3. Penjaga Sekolah", detail: "3.1. Penjaga malam" }
    ]
  }
];

export const SCHEDULE_TEACHERS: TeacherCode[] = [
  { no: 1, nama: 'Dra. Sri Hayati', mapel: 'Bahasa Indonesia', kode: 'BIN-SH' },
  { no: 2, nama: 'Bakhtiar Rifai, SE', mapel: 'IPS', kode: 'IPS-BR' },
  { no: 3, nama: 'Akhmad Hariadi, S.Pd', mapel: 'Bahasa Inggris', kode: 'BIG-AH' },
  { no: 4, nama: 'Moch. Husain Rifai Hamzah, S.Pd.', mapel: 'PJOK', kode: 'PJOK-MH' },
  { no: 5, nama: 'Rudi Hermawan, S.Pd.I', mapel: 'PAI', kode: 'PAI-RH' },
  { no: 6, nama: 'Okha Devi Anggraini, S.Pd.', mapel: 'BK', kode: 'BK-OD' },
  { no: 7, nama: 'Eka Hariyati, S. Pd.', mapel: 'PPKn', kode: 'PKN-EH' },
  { no: 8, nama: 'Retno Nawangwulan, S. Pd.', mapel: 'Bahasa Inggris', kode: 'BIG-RN' },
  { no: 9, nama: 'Mikoe Wahyudi Putra, ST., S. Pd.', mapel: 'BK', kode: 'BK-MW' },
  { no: 10, nama: 'Purnadi, S. Pd.', mapel: 'Matematika', kode: 'MAT-PU' },
  { no: 11, nama: 'Israfin Maria Ulfa, S.Pd', mapel: 'IPS', kode: 'IPS-MU' },
  { no: 12, nama: 'Syadam Budi Satrianto, S.Pd', mapel: 'Bahasa Jawa', kode: 'BAJA-SB' },
  { no: 13, nama: 'Rebby Dwi Prataopu, S.Si', mapel: 'IPA', kode: 'IPA-RB' },
  { no: 14, nama: 'Fakhita Madury, S.Sn.', mapel: 'Seni', kode: 'SENI-FA' },
  { no: 15, nama: 'Mukhamad Yunus, S.Pd', mapel: 'IPA', kode: 'IPA-MY' },
  { no: 16, nama: 'Fahmi Wahyuni, S.Pd', mapel: 'Bahasa Indonesia', kode: 'BIN-FW' },
];

export const TENDIK_RECORDS = [
  { id: 1, nama: 'Rudi Hermawan', bidang: 'Administrasi Sekolah', status: SupervisionStatus.PENDING, nilai: 0 },
  { id: 2, nama: 'Wasta Indah Dwi Astuti', bidang: 'Ketenagaan', status: SupervisionStatus.PENDING, nilai: 0 },
  { id: 3, nama: 'Dra. Sri Hayati', bidang: 'Perlengkapan', status: SupervisionStatus.PENDING, nilai: 0 },
  { id: 4, nama: 'Akhmad Hariadi', bidang: 'Perpustakaan', status: SupervisionStatus.PENDING, nilai: 0 },
];

export const EXTRA_RECORDS = [
  { id: 1, nama: 'Dra. Sri Hayati', ekstra: 'Mading & Jurnalistik', status: SupervisionStatus.PENDING, nilai: 0 },
  { id: 2, nama: 'Eka Hariyati', ekstra: 'PMR/UKS', status: SupervisionStatus.PENDING, nilai: 0 },
  { id: 3, nama: 'Moch. Husain Rifai', ekstra: 'Futsal', status: SupervisionStatus.PENDING, nilai: 0 },
];

export const FULL_SCHEDULE: DaySchedule[] = [
  {
    day: "SENIN",
    rows: [
      { ke: "0", waktu: "06.30-06.45", activity: "Persiapan Upacara Bendera" },
      { ke: "1", waktu: "06.45-07.40", activity: "Upacara Bendera" },
      { ke: "2", waktu: "07.40-08.20", classes: { "VII A": "MAT-MY", "VII B": "BAJA-SB", "VII C": "PJOK-MH", "VIII A": "BIG-RN", "VIII B": "IPS-BR", "VIII C": "PKN-EH", "IX A": "MAT-PU", "IX B": "BIN-SH", "IX C": "IPS-MU" } },
      { ke: "3", waktu: "08.20-09.00", classes: { "VII A": "MAT-MY", "VII B": "BAJA-SB", "VII C": "PJOK-MH", "VIII A": "BIG-RN", "VIII B": "IPS-BR", "VIII C": "PKN-EH", "IX A": "MAT-PU", "IX B": "BIN-SH", "IX C": "IPS-MU" } },
      { ke: "4", waktu: "09.20-10.00", classes: { "VII A": "BIN-FW", "VII B": "IPA-RB", "VII C": "PJOK-MH", "VIII A": "IPA-MY", "VIII B": "BK-MW", "VIII C": "PKN-EH", "IX A": "MAT-PU", "IX B": "BIN-SH", "IX C": "PAI-RH" } },
      { ke: "5", waktu: "10.00-10.40", classes: { "VII A": "BIN-FW", "VII B": "IPA-RB", "VII C": "SENI-FA", "VIII A": "IPA-MY", "VIII B": "BIG-RN", "VIII C": "MAT-PU", "IX A": "BIN-SH", "IX B": "PJOK-MH", "IX C": "PAI-RH" } },
      { ke: "6", waktu: "10.40-11.20", classes: { "VII A": "BIN-FW", "VII B": "IPA-RB", "VII C": "SENI-FA", "VIII A": "IPA-MY", "VIII B": "BIG-RN", "VIII C": "MAT-PU", "IX A": "BIN-SH", "IX B": "PJOK-MH", "IX C": "PAI-RH" } },
      { ke: "7", waktu: "11.50-12.25", classes: { "VII A": "IPS-MU", "VII B": "BIG-AH", "VII C": "MAT-MY", "VIII A": "IPS-BR", "VIII B": "BAJA-SB", "VIII C": "BIG-RN", "IX A": "SENI-FA", "IX B": "PJOK-MH", "IX C": "IPA-RB" } },
      { ke: "8", waktu: "12.25-13.00", classes: { "VII A": "IPS-MU", "VII B": "BIG-AH", "VII C": "MAT-MY", "VIII A": "IPS-BR", "VIII B": "BAJA-SB", "VIII C": "BIG-RN", "IX A": "SENI-FA", "IX B": "BK-OD", "IX C": "IPA-RB" } },
    ]
  },
  {
    day: "SELASA",
    rows: [
      { ke: "0", waktu: "06.30-07.00", activity: "Apel Pagi / Ar-Rahman" },
      { ke: "1", waktu: "07.00-07.40", classes: { "VII A": "SENI-FA", "VII B": "IPS-MU", "VII C": "IPA-RB", "VIII A": "BIN-FW", "VIII B": "PJOK-MH", "VIII C": "IPS-BR", "IX A": "BIG-RN", "IX B": "BAJA-SB", "IX C": "BIN-SH" } },
      { ke: "2", waktu: "07.40-08.20", classes: { "VII A": "SENI-FA", "VII B": "IPS-MU", "VII C": "IPA-RB", "VIII A": "BIN-FW", "VIII B": "PJOK-MH", "VIII C": "IPS-BR", "IX A": "BIG-RN", "IX B": "BAJA-SB", "IX C": "BIN-SH" } },
      { ke: "3", waktu: "08.20-09.00", classes: { "VII A": "PKN-EH", "VII B": "SENI-FA", "VII C": "BK-OD", "VIII A": "BIN-FW", "VIII B": "PJOK-MH", "VIII C": "BK-MW", "IX A": "PAI-RH", "IX B": "BIG-RN", "IX C": "BIN-SH" } },
      { ke: "4", waktu: "09.20-10.00", classes: { "VII A": "PKN-EH", "VII B": "SENI-FA", "VII C": "BIN-FW", "VIII A": "MAT-PU", "VIII B": "BIG-RN", "VIII C": "BAJA-SB", "IX A": "PAI-RH", "IX B": "IPA-RB", "IX C": "PJOK-MH" } },
      { ke: "5", waktu: "10.00-10.40", classes: { "VII A": "PKN-EH", "VII B": "BK-OD", "VII C": "BIN-FW", "VIII A": "MAT-PU", "VIII B": "BIG-RN", "VIII C": "BAJA-SB", "IX A": "PAI-RH", "IX B": "IPA-RB", "IX C": "PJOK-MH" } },
      { ke: "6", waktu: "10.40-11.20", classes: { "VII A": "BK-OD", "VII B": "PKN-EH", "VII C": "BIN-FW", "VIII A": "PAI-RH", "VIII B": "IPA-MY", "VIII C": "BIN-SH", "IX A": "IPA-RB", "IX B": "MAT-PU", "IX C": "PJOK-MH" } },
      { ke: "7", waktu: "11.50-12.25", classes: { "VII A": "IPS-MU", "VII B": "PKN-EH", "VII C": "BAJA-SB", "VIII A": "PAI-RH", "VIII B": "IPA-MY", "VIII C": "BIN-SH", "IX A": "IPA-RB", "IX B": "MAT-PU", "IX C": "BIG-RN" } },
      { ke: "8", waktu: "12.25-13.00", classes: { "VII A": "IPS-MU", "VII B": "PKN-EH", "VII C": "BAJA-SB", "VIII A": "PAI-RH", "VIII B": "IPA-MY", "VIII C": "BIN-SH", "IX A": "BK-OD", "IX B": "MAT-PU", "IX C": "BIG-RN" } },
    ]
  },
  {
    day: "RABU",
    rows: [
      { ke: "0", waktu: "06.30-07.00", activity: "Apel Pagi / Al-Waqi'ah" },
      { ke: "1", waktu: "07.00-07.40", classes: { "VII A": "PJOK-MH", "VII B": "INF-FA", "VII C": "MAT-MY", "VIII A": "BIG-RN", "VIII B": "BIN-SH", "VIII C": "PAI-RH", "IX A": "IPS-MU", "IX B": "IPA-RB", "IX C": "PKN-EH" } },
      { ke: "2", waktu: "07.40-08.20", classes: { "VII A": "PJOK-MH", "VII B": "INF-FA", "VII C": "MAT-MY", "VIII A": "BIG-RN", "VIII B": "BIN-SH", "VIII C": "PAI-RH", "IX A": "IPS-MU", "IX B": "IPA-RB", "IX C": "PKN-EH" } },
      { ke: "3", waktu: "08.20-09.00", classes: { "VII A": "PJOK-MH", "VII B": "INF-FA", "VII C": "MAT-MY", "VIII A": "BK-MW", "VIII B": "BIN-SH", "VIII C": "PAI-RH", "IX A": "IPS-MU", "IX B": "IPA-RB", "IX C": "PKN-EH" } },
      { ke: "4", waktu: "09.20-10.00", classes: { "VII A": "IPA-RB", "VII B": "PJOK-MH", "VII C": "INF-FA", "VIII A": "IPA-MY", "VIII B": "PKN-EH", "VIII C": "INF-RN", "IX A": "INF-AH", "IX B": "PAI-RH", "IX C": "IPS-MU" } },
      { ke: "5", waktu: "10.00-10.40", classes: { "VII A": "IPA-RB", "VII B": "PJOK-MH", "VII C": "INF-FA", "VIII A": "IPA-MY", "VIII B": "PKN-EH", "VIII C": "INF-RN", "IX A": "INF-AH", "IX B": "PAI-RH", "IX C": "IPS-MU" } },
      { ke: "6", waktu: "10.40-11.20", classes: { "VII A": "IPA-RB", "VII B": "PJOK-MH", "VII C": "INF-FA", "VIII A": "BIN-FW", "VIII B": "PKN-EH", "VIII C": "INF-RN", "IX A": "INF-AH", "IX B": "PAI-RH", "IX C": "BIN-SH" } },
      { ke: "7", waktu: "11.50-12.25", classes: { "VII A": "BIG-AH", "VII B": "IPA-RB", "VII C": "IPS-MU", "VIII A": "BIN-FW", "VIII B": "IPA-MY", "VIII C": "SENI-FA", "IX A": "MAT-PU", "IX B": "BIG-RN", "IX C": "BIN-SH" } },
      { ke: "8", waktu: "12.25-13.00", classes: { "VII A": "BIG-AH", "VII B": "IPA-RB", "VII C": "IPS-MU", "VIII A": "BIN-FW", "VIII B": "IPA-MY", "VIII C": "SENI-FA", "IX A": "MAT-PU", "IX B": "BIG-RN", "IX C": "BIN-SH" } },
    ]
  },
  {
    day: "KAMIS",
    rows: [
      { ke: "0", waktu: "06.30-07.00", activity: "Apel Pagi / Istighotsah" },
      { ke: "1", waktu: "07.00-07.40", classes: { "VII A": "INF-FA", "VII B": "BIN-FW", "VII C": "IPA-RB", "VIII A": "PKN-EH", "VIII B": "PAI-RH", "VIII C": "PJOK-MH", "IX A": "BIG-RN", "IX B": "INF-AH", "IX C": "MAT-PU" } },
      { ke: "2", waktu: "07.40-08.20", classes: { "VII A": "INF-FA", "VII B": "BIN-FW", "VII C": "IPA-RB", "VIII A": "PKN-EH", "VIII B": "PAI-RH", "VIII C": "PJOK-MH", "IX A": "BIG-RN", "IX B": "INF-AH", "IX C": "MAT-PU" } },
      { ke: "3", waktu: "08.20-09.00", classes: { "VII A": "INF-FA", "VII B": "BIN-FW", "VII C": "IPA-RB", "VIII A": "PKN-EH", "VIII B": "PAI-RH", "VIII C": "PJOK-MH", "IX A": "IPS-MU", "IX B": "INF-AH", "IX C": "MAT-PU" } },
      { ke: "4", waktu: "09.20-10.00", classes: { "VII A": "PAI-RH", "VII B": "MAT-MY", "VII C": "IPS-MU", "VIII A": "PJOK-MH", "VIII B": "BIN-SH", "VIII C": "MAT-PU", "IX A": "IPA-RB", "IX B": "PKN-EH", "IX C": "SENI-FA" } },
      { ke: "5", waktu: "10.00-10.40", classes: { "VII A": "PAI-RH", "VII B": "MAT-MY", "VII C": "IPS-MU", "VIII A": "PJOK-MH", "VIII B": "BIN-SH", "VIII C": "MAT-PU", "IX A": "IPA-RB", "IX B": "PKN-EH", "IX C": "SENI-FA" } },
      { ke: "6", waktu: "10.40-11.20", classes: { "VII A": "PAI-RH", "VII B": "MAT-MY", "VII C": "BIN-FW", "VIII A": "PJOK-MH", "VIII B": "BIN-SH", "VIII C": "MAT-PU", "IX A": "IPA-RB", "IX B": "PKN-EH", "IX C": "BK-OD" } },
      { ke: "7", waktu: "11.50-12.25", classes: { "VII A": "IPA-RB", "VII B": "BIG-AH", "VII C": "BIN-FW", "VIII A": "IPS-BR", "VIII B": "SENI-FA", "VIII C": "IPA-MY", "IX A": "BIN-SH", "IX B": "MAT-PU", "IX C": "BIG-RN" } },
      { ke: "8", waktu: "12.25-13.00", classes: { "VII A": "IPA-RB", "VII B": "BIG-AH", "VII C": "BIN-FW", "VIII A": "IPS-BR", "VIII B": "SENI-FA", "VIII C": "IPA-MY", "IX A": "BIN-SH", "IX B": "MAT-PU", "IX C": "BIG-RN" } },
    ]
  },
  {
    day: "JUM'AT",
    rows: [
      { ke: "0", waktu: "06.30-07.00", activity: "Apel Pagi / Yasin" },
      { ke: "1", waktu: "07.00-07.40", classes: { "VII A": "BAJA-SB", "VII B": "PAI-RH", "VII C": "PKN-EH", "VIII A": "INF-RN", "VIII B": "MAT-PU", "VIII C": "IPA-MY", "IX A": "PJOK-MH", "IX B": "BIN-SH", "IX C": "INF-AH" } },
      { ke: "2", waktu: "07.40-08.20", classes: { "VII A": "BAJA-SB", "VII B": "PAI-RH", "VII C": "PKN-EH", "VIII A": "INF-RN", "VIII B": "MAT-PU", "VIII C": "IPA-MY", "IX A": "PJOK-MH", "IX B": "BIN-SH", "IX C": "INF-AH" } },
      { ke: "3", waktu: "08.20-09.00", classes: { "VII A": "BIN-FW", "VII B": "PAI-RH", "VII C": "PKN-EH", "VIII A": "INF-RN", "VIII B": "MAT-PU", "VIII C": "IPA-MY", "IX A": "PJOK-MH", "IX B": "BIN-SH", "IX C": "INF-AH" } },
      { ke: "4", waktu: "09.20-10.00", classes: { "VII A": "BIN-FW", "VII B": "MAT-MY", "VII C": "BIG-AH", "VIII A": "BAJA-SB", "VIII B": "IPS-BR", "VIII C": "BIG-RN", "IX A": "BIN-SH", "IX B": "IPS-MU", "IX C": "MAT-PU" } },
      { ke: "5", waktu: "10.00-10.40", classes: { "VII A": "BIN-FW", "VII B": "MAT-MY", "VII C": "BIG-AH", "VIII A": "BAJA-SB", "VIII B": "IPS-BR", "VIII C": "BIG-RN", "IX A": "BIN-SH", "IX B": "IPS-MU", "IX C": "MAT-PU" } },
    ]
  },
  {
    day: "SABTU",
    rows: [
      { ke: "0", waktu: "06.30-07.00", activity: "Apel Pagi / Asma'ul Husna & Juz Amma" },
      { ke: "1", waktu: "07.00-07.40", activity: "Sabtu Sehat Jiwa Raga" },
      { ke: "2", waktu: "07.40-08.20", classes: { "VII A": "BIG-AH", "VII B": "BIN-FW", "VII C": "PAI-RH", "VIII A": "SENI-FA", "VIII B": "MAT-PU", "VIII C": "BIN-SH", "IX A": "BAJA-SB", "IX B": "BIG-RN", "IX C": "IPA-RB" } },
      { ke: "3", waktu: "08.20-09.00", classes: { "VII A": "BIG-AH", "VII B": "BIN-FW", "VII C": "PAI-RH", "VIII A": "SENI-FA", "VIII B": "MAT-PU", "VIII C": "BIN-SH", "IX A": "BAJA-SB", "IX B": "IPS-MU", "IX C": "IPA-RB" } },
      { ke: "4", waktu: "09.20-10.00", classes: { "VII A": "MAT-MY", "VII B": "BIN-FW", "VII C": "PAI-RH", "VIII A": "MAT-PU", "VIII B": "INF-RN", "VIII C": "BIN-SH", "IX A": "PKN-EH", "IX B": "IPS-MU", "IX C": "IPA-RB" } },
      { ke: "5", waktu: "10.00-10.40", classes: { "VII A": "MAT-MY", "VII B": "IPS-MU", "VII C": "BIG-AH", "VIII A": "MAT-PU", "VIII B": "INF-RN", "VIII C": "IPS-BR", "IX A": "PKN-EH", "IX B": "SENI-FA", "IX C": "BAJA-SB" } },
      { ke: "6", waktu: "10.40-11.20", classes: { "VII A": "MAT-MY", "VII B": "IPS-MU", "VII C": "BIG-AH", "VIII A": "MAT-PU", "VIII B": "INF-RN", "VIII C": "IPS-BR", "IX A": "PKN-EH", "IX B": "SENI-FA", "IX C": "BAJA-SB" } },
    ]
  }
];

export const CLASS_LIST = ["VII A", "VII B", "VII C", "VIII A", "VIII B", "VIII C", "IX A", "IX B", "IX C"];
