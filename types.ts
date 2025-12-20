
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
  scores: Record<number, number | string>;
  remarks: Record<number, string>;
  catatan?: string;
  tindakLanjut?: string;
  materi?: string;
  kelasSemester?: string;
  answers?: Record<number, string>; // Untuk pertanyaan post-observasi
  kesanUmum?: string;
  saran?: string;
  // Untuk menyimpan status centang di tab Tindak Lanjut Action
  actions?: {
    contoh: boolean;
    tanyaJawab: boolean;
    diskusi: boolean;
    konsultasi: boolean;
    pelatihan: boolean;
  };
}

export interface AppSettings {
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaPengawas: string;
  nipPengawas: string;
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
  tanggal: string; // Legacy / Default
  tanggalAdm?: string; // Tanggal supervisi administrasi
  tanggalPemb?: string; // Tanggal supervisi pembelajaran
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
  nilaiPenilaian?: number;
  nilaiATP?: number;
  nilaiModul?: number;
  catatan?: string;
  tindakLanjut?: string; 
  realisasi?: string;     
  saran?: string;
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
  | 'inst-ekstra'
  | 'inst-post-observasi'
  | 'inst-hasil-observasi'
  | 'tendik-sekolah'
  | 'tendik-ketenagaan'
  | 'tendik-perlengkapan'
  | 'tendik-perpustakaan'
  | 'tendik-lab-ipa'
  | 'tendik-lab-komputer'
  | 'tendik-kesiswaan'
  | 'results-administrasi'
  | 'results-learning'
  | 'results-penilaian'
  | 'results-atp'
  | 'results-modul'
  | 'results-analysis'
  | 'results-log'
  | 'results-recap'
  | 'results-followup-program'
  | 'results-followup-action'
  | 'results-tendik'
  | 'results-extra'
  // NEW VIEW TYPES
  | 'prog-akademik'
  | 'prog-tendik'
  | 'prog-extra'
  | 'ptl-akademik'
  | 'ptl-tendik'
  | 'ptl-extra'
  | 'lap-akademik'
  | 'lap-tendik'
  | 'lap-extra';

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
