
export enum SupervisionStatus {
  PENDING = 'Belum Terlaksana',
  COMPLETED = 'Terlaksana',
  RESCHEDULED = 'Dijadwal Ulang'
}

export interface DateRange {
  from: string;
  to: string;
}

export interface InstrumentResult {
  scores: Record<number, number>;
  remarks: Record<number, string>;
  catatan?: string;
  tindakLanjut?: string;
  materi?: string;
  kelasSemester?: string;
}

export interface AppSettings {
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunPelajaran: string;
  semester: 'Ganjil' | 'Genap';
  namaSekolah: string;
  tanggalCetak: string;
  supervisors: string[];
  rangeAdmGuruGanjil: DateRange;
  rangeAdmGuruGenap: DateRange;
  rangePembelajaranGuru: DateRange;
  rangePembelajaranGuruGenap: DateRange;
  rangeTendikGanjil: DateRange;
  rangeTendikGenap: DateRange;
  rangeExtraGanjil: DateRange;
  rangeExtraGenap: DateRange;
}

export interface TeacherRecord {
  id: number;
  no: number;
  hari: string;
  tanggal: string;
  namaGuru: string;
  nip?: string;
  pangkatGolongan?: string;
  mataPelajaran: string;
  kelas: string;
  jamKe: string;
  status: SupervisionStatus;
  semester: 'Ganjil' | 'Genap'; 
  pukul?: string; 
  pewawancara?: string;
  tempat?: string;
  nilai?: number; 
  nilaiAdm?: number; 
  catatan?: string;
  tindakLanjut?: string; 
  realisasi?: string;     
  feedbackAI?: string;
}

export interface ExtraRecord {
  id: number;
  nama: string;
  nip: string;
  hari: string;
  tgl: string;
  pukul: string;
  ekstra: string;
  tempat: string;
  supervisor: string;
  semester: 'Ganjil' | 'Genap';
}

export interface AdminRecord {
  id: number;
  nama: string;
  nip: string;
  hari: string;
  tgl: string;
  pukul: string;
  kegiatan: string;
  tempat: string;
  supervisor: string;
  semester: 'Ganjil' | 'Genap';
}

export type ViewType = 
  | 'dashboard'
  | 'settings'
  | 'supervision-admin-guru' 
  | 'supervision' 
  | 'schedule-extra'
  | 'schedule-admin'
  | 'schedule' 
  | 'inst-administrasi' 
  | 'inst-penilaian' 
  | 'inst-pelaksanaan' 
  | 'inst-atp' 
  | 'inst-modul'
  | 'tendik-sekolah'
  | 'tendik-ketenagaan'
  | 'tendik-perlengkapan'
  | 'tendik-perpustakaan'
  | 'tendik-lab-ipa'
  | 'tendik-lab-komputer'
  | 'tendik-kesiswaan'
  | 'tendik-ekstra'
  | 'follow-up-results';

export interface ScheduleRow {
  ke: string;
  waktu: string;
  activity?: string;
  classes?: Record<string, string>;
}

export interface DaySchedule {
  day: string;
  rows: ScheduleRow[];
}

export interface TeacherCode {
  no: number;
  nama: string;
  mapel: string;
  kode: string;
  tugas?: string;
}
