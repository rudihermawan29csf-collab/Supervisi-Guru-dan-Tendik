
import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_TEACHERS } from './constants';
import { TeacherRecord, ViewType, AppSettings, SupervisionStatus, InstrumentResult, ExtraRecord, AdminRecord } from './types';
import SupervisionView from './components/SupervisionView';
import ScheduleView from './components/ScheduleView';
import ScheduleExtraView from './components/ScheduleExtraView';
import ScheduleAdminView from './components/ScheduleAdminView';
import SupervisionForm from './components/SupervisionForm';
import AdministrasiPembelajaran from './components/AdministrasiPembelajaran';
import PenilaianPembelajaran from './components/PenilaianPembelajaran';
import PelaksanaanPembelajaran from './components/PelaksanaanPembelajaran';
import PenelaahanATP from './components/PenelaahanATP';
import TelaahModulAjar from './components/TelaahModulAjar';
import InstrumentTendikView from './components/InstrumentTendikView';
import InstrumentExtraView from './components/InstrumentExtraView';
import SettingsView from './components/SettingsView';
import MainDashboardView from './components/MainDashboardView';
import AdminSupervisionView from './components/AdminSupervisionView';
import AdminResultsView from './components/AdminResultsView';
import GenericResultsView from './components/FollowUpResultsView';
import TendikResultsView from './components/TendikResultsView';
import ExtraResultsView from './components/ExtraResultsView';
import LearningAnalysisView from './components/LearningAnalysisView';
import SupervisionLogView from './components/SupervisionLogView';
import SupervisionRecapView from './components/SupervisionRecapView';
import ProgramTindakLanjutView from './components/ProgramTindakLanjutView';
import FollowUpActionView from './components/FollowUpActionView';

const INITIAL_EXTRA: ExtraRecord[] = [
  { id: 1, nama: 'Fahmi Wahyuni, S.Pd', nip: '-', hari: 'Senin', tgl: '23 Oktober 2025', pukul: '10.00 - 11.00', ekstra: 'OSN Bahasa Indonesia', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 2, nama: 'Rudi Hermawan, S.Pd.I', nip: '19891029 202012 1 003', hari: 'Selasa', tgl: '24 Oktober 2025', pukul: '11.00 - 12.30', ekstra: 'TBTQ', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 3, nama: 'Eka Hariyati, s.pd.', nip: '-', hari: 'Rabu', tgl: '25 Oktober 2025', pukul: '11.00 - 12.00', ekstra: 'Pembina PMR/UKS', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 4, nama: 'Fery Agus Pujianto', nip: '-', hari: 'Kamis', tgl: '26 Oktober 2025', pukul: '11.00 - 12.30', ekstra: 'Pembina Pramuka', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 5, nama: 'Moch. Husain Rifai Hamzah, s.pd.', nip: '19920316 202012 1 011', hari: 'Kamis', tgl: '26 Oktober 2025', pukul: '11.00 - 12.30', ekstra: 'Pembina Futsal', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 6, nama: 'Fakhita Madury, S.Sn.', nip: '-', hari: "Jum'at", tgl: '27 Oktober 2025', pukul: '11.00 - 12.00', ekstra: 'Seni', tempat: 'Ruang Kelas', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 7, nama: 'Rebby Dwi Prataopu, S.Si', nip: '-', hari: 'Sabtu', tgl: '28 Oktober 2025', pukul: '09.00 - 10.30', ekstra: 'OSN IPA', tempat: 'Laboratorium IPA', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 8, nama: 'Mukhamad Yunus, S.Pd', nip: '-', hari: 'Senin', tgl: '30 Oktober 2025', pukul: '11.00 - 12.00', ekstra: 'OSN Matematika', tempat: 'Ruang Kelas', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 9, nama: 'Retno Nawangwulan, S. Pd.', nip: '19850703 202521 2 006', hari: 'Senin', tgl: '30 Oktober 2025', pukul: '12.00 - 13.30', ekstra: 'English Club', tempat: 'Ruang Kelas', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
];

const INITIAL_ADMIN: AdminRecord[] = [
  { id: 1, nama: "Imam Safi'i", nip: '-', hari: "Jum'at", tgl: '27 Oktober 2025', pukul: '07.30 - 08.30', kegiatan: 'Administrasi Sekolah', tempat: 'Kantor Tata Usaha', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 2, nama: "Imam Safi'i", nip: '-', hari: "Jum'at", tgl: '27 Oktober 2025', pukul: '08.30 - 09.30', kegiatan: 'Administrasi Kesiswaan', tempat: 'Ruang OSIS', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 3, nama: 'Rayi Putri Lestari, S.Pd.', nip: '-', hari: 'Sabtu', tgl: '28 Oktober 2025', pukul: '07.30 - 08.30', kegiatan: 'Administrasi Ketenagaan', tempat: 'Kantor Tata Usaha', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 4, nama: 'Mansyur Rohmad', nip: '-', hari: 'Sabtu', tgl: '28 Oktober 2025', pukul: '08.30 - 09.30', kegiatan: 'Administrasi Perlengkapan / sarpras', tempat: 'Ruang Guru', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 5, nama: 'Mansyur Rohmad', nip: '-', hari: 'Sabtu', tgl: '28 Oktober 2025', pukul: '10.00 - 11.00', kegiatan: 'Laboratorium Komputer', tempat: 'Ruang Lab. Komputer', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 6, nama: 'Mochamad Ansori', nip: '-', hari: 'Senin', tgl: '30 Oktober 2025', pukul: '07.30 - 08.30', kegiatan: 'Administrasi Perpustakaan', tempat: 'Ruang Perpustakaan', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
  { id: 7, nama: 'Moch. Husain Rifai Hamzah, s.pd.', nip: '19920316 202012 1 011', hari: 'Senin', tgl: '30 Oktober 2025', pukul: '08.30 - 09.30', kegiatan: 'Laboratorium IPA', tempat: 'Ruang Lab. IPA', supervisor: 'Didik Sulistyo, M.M.Pd.', semester: 'Ganjil' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    jadwal: true,
    instrumenGuru: true,
    instrumenTendik: true,
    instrumenExtra: true,
    tindakLanjut: true,
    tindakLanjutTendik: true,
    tindakLanjutExtra: true
  });

  const [selectedRecord, setSelectedRecord] = useState<TeacherRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaults: AppSettings = {
      namaKepalaSekolah: 'Didik Sulistyo, M.M.Pd.',
      nipKepalaSekolah: '19660518 198901 1 002',
      tahunPelajaran: '2025/2026',
      semester: 'Ganjil',
      namaSekolah: 'SMPN 3 Pacet',
      tanggalCetak: '2025-07-14',
      supervisors: ['', '', ''],
      rangeAdmGuruGanjil: { from: '2025-09-01', to: '2025-09-15' },
      rangeAdmGuruGenap: { from: '2026-01-15', to: '2026-01-31' },
      rangePembelajaranGuru: { from: '2025-09-16', to: '2025-10-15' },
      rangePembelajaranGuruGenap: { from: '2026-02-01', to: '2026-02-28' },
      rangeTendikGanjil: { from: '2025-10-16', to: '2025-10-23' },
      rangeTendikGenap: { from: '2026-03-01', to: '2026-03-16' },
      rangeExtraGanjil: { from: '2025-10-24', to: '2025-10-31' },
      rangeExtraGenap: { from: '2026-03-17', to: '2026-03-30' }
    };
    try {
      const saved = localStorage.getItem('supervisi_settings_v10');
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
  });

  const [records, setRecords] = useState<TeacherRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_records_v10');
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch { return INITIAL_TEACHERS; }
  });

  const [extraRecords, setExtraRecords] = useState<ExtraRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_extra_records_v10');
      return saved ? JSON.parse(saved) : INITIAL_EXTRA;
    } catch { return INITIAL_EXTRA; }
  });

  const [adminRecords, setAdminRecords] = useState<AdminRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_admin_records_v10');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN;
    } catch { return INITIAL_ADMIN; }
  });

  const [instrumentResults, setInstrumentResults] = useState<Record<string, InstrumentResult>>(() => {
    try {
      const saved = localStorage.getItem('supervisi_instrument_results_v10');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem('supervisi_settings_v10', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('supervisi_records_v10', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('supervisi_extra_records_v10', JSON.stringify(extraRecords)); }, [extraRecords]);
  useEffect(() => { localStorage.setItem('supervisi_admin_records_v10', JSON.stringify(adminRecords)); }, [adminRecords]);
  useEffect(() => { localStorage.setItem('supervisi_instrument_results_v10', JSON.stringify(instrumentResults)); }, [instrumentResults]);

  const handleUpdateRecords = useCallback((newRecords: TeacherRecord[]) => {
    setRecords(newRecords);
  }, []);

  const handleSaveInstrument = (teacherId: number, type: string, semester: string, data: InstrumentResult) => {
    const key = `${teacherId}-${type}-${semester}`;
    setInstrumentResults(prev => ({ ...prev, [key]: data }));
    
    const maxScores: Record<string, number> = {
      'administrasi': 26,
      'pembelajaran': 76,
      'penilaian': 36,
      'atp': 24,
      'modul': 48,
      'sekolah': 100,
      'ketenagaan': 100,
      'perlengkapan': 100,
      'perpustakaan': 100,
      'lab-ipa': 100,
      'lab-komputer': 100,
      'kesiswaan': 100
    };

    const scoreArray = Object.values(data.scores).filter(v => typeof v === 'number') as number[];
    const total = scoreArray.reduce((a, b) => a + b, 0);
    const max = maxScores[type] || 100;
    const finalScore = Math.round((total / max) * 100);
    
    setRecords(prev => prev.map(r => {
      if (r.id === teacherId) {
        let updated = { ...r, status: SupervisionStatus.COMPLETED, catatan: data.catatan, tindakLanjut: data.tindakLanjut };
        if (type === 'administrasi') updated.nilaiAdm = finalScore;
        else if (type === 'pembelajaran') updated.nilai = finalScore;
        else if (type === 'penilaian') updated.nilaiPenilaian = finalScore;
        else if (type === 'atp') updated.nilaiATP = finalScore;
        else if (type === 'modul') updated.nilaiModul = finalScore;
        return updated;
      }
      return r;
    }));
    alert('Data instrumen berhasil disimpan!');
  };

  const handleRefreshDashboard = useCallback(() => {
    const updated = records.map(r => {
      const semester = settings.semester;
      const getVal = (type: string, max: number) => {
        const key = `${r.id}-${type}-${semester}`;
        if (instrumentResults[key]) {
          const scores = Object.values(instrumentResults[key].scores).filter(v => typeof v === 'number') as number[];
          return Math.round((scores.reduce((a, b) => a + b, 0) / max) * 100);
        }
        return null;
      };

      const nAdm = getVal('administrasi', 26);
      const nPemb = getVal('pembelajaran', 76);
      const nPen = getVal('penilaian', 36);
      const nAtp = getVal('atp', 24);
      const nMod = getVal('modul', 48);

      return {
        ...r,
        nilaiAdm: nAdm !== null ? nAdm : r.nilaiAdm,
        nilai: nPemb !== null ? nPemb : r.nilai,
        nilaiPenilaian: nPen !== null ? nPen : r.nilaiPenilaian,
        nilaiATP: nAtp !== null ? nAtp : r.nilaiATP,
        nilaiModul: nMod !== null ? nMod : r.nilaiModul
      };
    });
    setRecords(updated);
    alert('Sinkronisasi data berhasil!');
  }, [records, instrumentResults, settings.semester]);

  const handleSaveSingleRecord = (updatedRecord: TeacherRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setSelectedRecord(null);
  };

  const NavItem = ({ view, label, icon, activeColor = 'bg-blue-600' }: { view: ViewType, label: string, icon?: React.ReactNode, activeColor?: string }) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center justify-start text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === view ? `${activeColor} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      {icon && <span className="mr-3 shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );

  const SectionHeader = ({ id, label, color = 'text-slate-500' }: { id: string, label: string, color?: string }) => (
    <button 
      onClick={() => setOpenSections(p => ({...p, [id]: !p[id]}))}
      className={`w-full flex items-center justify-between text-left px-4 py-2 mt-4 text-[10px] font-black uppercase tracking-widest ${color} hover:text-white transition-colors`}
    >
      <span className="truncate mr-2">{label}</span>
      <svg className={`w-3 h-3 shrink-0 transition-transform duration-300 ${openSections[id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-slate-800 text-center bg-slate-950/50">
          <h1 className="text-base font-black leading-tight text-white tracking-tight">{settings.namaSekolah}</h1>
          <p className="text-[10px] text-blue-400 font-black mt-1 tracking-widest italic uppercase">Supervisi Akademik</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-hide">
          <NavItem view="dashboard" label="Dashboard Utama" activeColor="bg-indigo-600" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 v2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1-0 01-1-1v-6zM10 5a1 1 0 011-1h2a1 v2a1 1 0 01-1 1h-2a1 1-0 01-1-1V5z" strokeWidth="2"/></svg>} />
          <NavItem view="settings" label="Pengaturan Sistem" activeColor="bg-zinc-600" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572z" strokeWidth="2"/></svg>} />

          <div className="bg-blue-900/20 rounded-2xl border border-blue-500/10 overflow-hidden pb-1">
            <SectionHeader id="jadwal" label="Jadwal Supervisi" color="text-blue-400" />
            {openSections.jadwal && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="supervision-admin-guru" label="Administrasi Guru" activeColor="bg-blue-600" />
                <NavItem view="supervision" label="Jadwal Pembelajaran Guru" activeColor="bg-blue-600" />
                <NavItem view="schedule-admin" label="Supervisi Tendik" activeColor="bg-blue-600" />
                <NavItem view="schedule-extra" label="Supervisi Ekstra" activeColor="bg-blue-600" />
                <NavItem view="schedule" label="Jadwal Pelajaran Sekolah" activeColor="bg-blue-600" />
              </div>
            )}
          </div>

          <div className="bg-emerald-900/20 rounded-2xl border border-emerald-500/10 overflow-hidden pb-1">
            <SectionHeader id="instrumenGuru" label="Instrumen Guru" color="text-emerald-400" />
            {openSections.instrumenGuru && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="inst-administrasi" label="Administrasi Pembelajaran" activeColor="bg-emerald-600" />
                <NavItem view="inst-pelaksanaan" label="Pelaksanaan Pembelajaran" activeColor="bg-emerald-600" />
                <NavItem view="inst-penilaian" label="Penilaian Pembelajaran" activeColor="bg-emerald-600" />
                <NavItem view="inst-atp" label="Penelaahan ATP" activeColor="bg-emerald-600" />
                <NavItem view="inst-modul" label="Telaah Modul Ajar" activeColor="bg-emerald-600" />
              </div>
            )}
          </div>

          <div className="bg-orange-900/20 rounded-2xl border border-orange-500/10 overflow-hidden pb-1">
            <SectionHeader id="instrumenTendik" label="Instrumen Tendik" color="text-orange-400" />
            {openSections.instrumenTendik && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="tendik-sekolah" label="Administrasi Sekolah" activeColor="bg-orange-600" />
                <NavItem view="tendik-ketenagaan" label="Administrasi Ketenagaan" activeColor="bg-orange-600" />
                <NavItem view="tendik-perlengkapan" label="Administrasi Perlengkapan" activeColor="bg-orange-600" />
                <NavItem view="tendik-perpustakaan" label="Administrasi Perpustakaan" activeColor="bg-orange-600" />
                <NavItem view="tendik-lab-ipa" label="Laboratorium IPA" activeColor="bg-orange-600" />
                <NavItem view="tendik-lab-komputer" label="Laboratorium Komputer" activeColor="bg-orange-600" />
                <NavItem view="tendik-kesiswaan" label="Administrasi Kesiswaan" activeColor="bg-orange-600" />
              </div>
            )}
          </div>

          <div className="bg-purple-900/20 rounded-2xl border border-purple-500/10 overflow-hidden pb-1">
            <SectionHeader id="instrumenExtra" label="Instrumen Ekstrakurikuler" color="text-purple-400" />
            {openSections.instrumenExtra && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="inst-ekstra" label="Kegiatan Ekstrakurikuler" activeColor="bg-purple-600" />
              </div>
            )}
          </div>

          <div className="bg-rose-900/20 rounded-2xl border border-rose-500/10 overflow-hidden pb-1">
            <SectionHeader id="tindakLanjut" label="Hasil Supervisi Guru" color="text-rose-400" />
            {openSections.tindakLanjut && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="results-recap" label="Rekap Supervisi Akademik" activeColor="bg-rose-600" />
                <NavItem view="results-followup-program" label="Program Tindak Lanjut" activeColor="bg-rose-600" />
                <NavItem view="results-followup-action" label="Tindak Lanjut Action" activeColor="bg-rose-600" />
                <NavItem view="results-administrasi" label="Hasil Supervisi Administrasi" activeColor="bg-rose-600" />
                <NavItem view="results-learning" label="Hasil Supervisi Pembelajaran" activeColor="bg-rose-600" />
                <NavItem view="results-penilaian" label="Hasil Penilaian Pembelajaran" activeColor="bg-rose-600" />
                <NavItem view="results-atp" label="Hasil Penelaahan ATP" activeColor="bg-rose-600" />
                <NavItem view="results-modul" label="Hasil Telaah Modul Ajar" activeColor="bg-rose-600" />
                <NavItem view="results-analysis" label="Analisis Hasil Supervisi" activeColor="bg-rose-600" />
                <NavItem view="results-log" label="Catatan Pelaksanaan" activeColor="bg-rose-600" />
              </div>
            )}
          </div>

          <div className="bg-cyan-900/20 rounded-2xl border border-cyan-500/10 overflow-hidden pb-1">
            <SectionHeader id="tindakLanjutTendik" label="Hasil Supervisi Tendik" color="text-cyan-400" />
            {openSections.tindakLanjutTendik && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="results-tendik" label="Hasil Supervisi Tendik Terpadu" activeColor="bg-cyan-600" />
              </div>
            )}
          </div>

          <div className="bg-purple-900/20 rounded-2xl border border-purple-500/10 overflow-hidden pb-1">
            <SectionHeader id="tindakLanjutExtra" label="Hasil Supervisi Ekstra" color="text-purple-400" />
            {openSections.tindakLanjutExtra && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="results-extra" label="Hasil Supervisi Ekstrakurikuler" activeColor="bg-purple-600" />
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b h-14 flex items-center justify-between px-6 shrink-0 no-print">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-500 lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2"/></svg>
            </button>
            <h2 className="ml-4 text-xs font-black text-slate-800 tracking-tight truncate uppercase">
              {activeView.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
             <div className="text-right">
                <p className="text-[11px] font-black text-slate-900 leading-none uppercase">{settings.namaKepalaSekolah}</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase">TP {settings.tahunPelajaran} • SMST {settings.semester}</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin">
          <div className="max-w-6xl mx-auto">
            {activeView === 'dashboard' && <MainDashboardView records={records} settings={settings} onRefresh={handleRefreshDashboard} />}
            {activeView === 'settings' && <SettingsView settings={settings} setSettings={setSettings} records={records} setRecords={handleUpdateRecords} />}
            {activeView === 'supervision-admin-guru' && <AdminSupervisionView records={records} onUpdateRecords={handleUpdateRecords} settings={settings} onSelect={setSelectedRecord} setSettings={setSettings} />}
            {activeView === 'supervision' && <SupervisionView records={records} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSelect={setSelectedRecord} onUpdateRecords={handleUpdateRecords} settings={settings} setSettings={setSettings} />}
            {activeView === 'schedule-extra' && <ScheduleExtraView settings={settings} setSettings={setSettings} extraRecords={extraRecords} setExtraRecords={setExtraRecords} teacherRecords={records} />}
            {activeView === 'schedule-admin' && <ScheduleAdminView settings={settings} setSettings={setSettings} adminRecords={adminRecords} setAdminRecords={setAdminRecords} teacherRecords={records} />}
            {activeView === 'schedule' && <ScheduleView settings={settings} />}
            {activeView === 'inst-administrasi' && <AdministrasiPembelajaran settings={settings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-penilaian' && <PenilaianPembelajaran settings={settings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-pelaksanaan' && <PelaksanaanPembelajaran settings={settings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-atp' && <PenelaahanATP settings={settings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-modul' && <TelaahModulAjar settings={settings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-ekstra' && <InstrumentExtraView settings={settings} extraRecords={extraRecords} instrumentResults={instrumentResults} onSave={(key, data) => setInstrumentResults(prev => ({...prev, [key]: data}))} />}
            
            {activeView === 'results-recap' && <SupervisionRecapView settings={settings} records={records} setSettings={setSettings} />}
            {activeView === 'results-followup-program' && <ProgramTindakLanjutView settings={settings} records={records} setSettings={setSettings} />}
            {activeView === 'results-followup-action' && <FollowUpActionView settings={settings} records={records} setSettings={setSettings} instrumentResults={instrumentResults} onSaveAction={(teacherId, actions) => {
              const key = `${teacherId}-followup-actions-${settings.semester}`;
              setInstrumentResults(prev => ({ ...prev, [key]: { scores: {}, remarks: {}, actions } }));
            }} />}

            {activeView === 'results-administrasi' && <AdminResultsView records={records} settings={settings} onUpdate={handleUpdateRecords} onRefresh={handleRefreshDashboard} setSettings={setSettings} />}
            {activeView === 'results-learning' && <GenericResultsView title="Hasil Supervisi Pembelajaran" type="pembelajaran" scoreKey="nilai" maxScore={76} records={records} settings={settings} onUpdate={handleUpdateRecords} onRefresh={handleRefreshDashboard} setSettings={setSettings} />}
            {activeView === 'results-penilaian' && <GenericResultsView title="Hasil Penilaian Pembelajaran" type="penilaian" scoreKey="nilaiPenilaian" maxScore={36} records={records} settings={settings} onUpdate={handleUpdateRecords} onRefresh={handleRefreshDashboard} setSettings={setSettings} />}
            {activeView === 'results-atp' && <GenericResultsView title="Hasil Penelaahan ATP" type="atp" scoreKey="nilaiATP" maxScore={24} records={records} settings={settings} onUpdate={handleUpdateRecords} onRefresh={handleRefreshDashboard} setSettings={setSettings} />}
            {activeView === 'results-modul' && <GenericResultsView title="Hasil Telaah Modul Ajar" type="modul" scoreKey="nilaiModul" maxScore={48} records={records} settings={settings} onUpdate={handleUpdateRecords} onRefresh={handleRefreshDashboard} setSettings={setSettings} />}
            {activeView === 'results-analysis' && <LearningAnalysisView settings={settings} records={records} instrumentResults={instrumentResults} setSettings={setSettings} />}
            {activeView === 'results-log' && <SupervisionLogView settings={settings} records={records} instrumentResults={instrumentResults} setSettings={setSettings} />}
            
            {activeView === 'results-tendik' && <TendikResultsView adminRecords={adminRecords} settings={settings} instrumentResults={instrumentResults} setSettings={setSettings} />}
            {activeView === 'results-extra' && <ExtraResultsView extraRecords={extraRecords} settings={settings} instrumentResults={instrumentResults} setSettings={setSettings} />}

            {activeView.startsWith('tendik-') && <InstrumentTendikView type={activeView.replace('tendik-', '') as any} settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={(key, data) => setInstrumentResults(prev => ({...prev, [key]: data}))} setSettings={setSettings} />}
          </div>
        </div>
      </main>

      {selectedRecord && <SupervisionForm record={selectedRecord} onSave={handleSaveSingleRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
};

export default App;
