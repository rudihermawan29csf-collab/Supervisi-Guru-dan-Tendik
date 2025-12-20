
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
import PostObservationView from './components/PostObservationView';
import ObservationResultsView from './components/ObservationResultsView';
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

// Import New Generic Document Components
import ProgramDocView from './components/ProgramDocView';
import LaporanDocView from './components/LaporanDocView';

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
    perencanaan: true,
    jadwal: false,
    instrumen: false,
    tindakLanjutMain: true,
    laporanMain: true
  });

  const [selectedRecord, setSelectedRecord] = useState<TeacherRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaults: AppSettings = {
      namaKepalaSekolah: 'Didik Sulistyo, M.M.Pd.',
      nipKepalaSekolah: '19660518 198901 1 002',
      namaPengawas: 'LILIK HARIATI, S.Pd., M.Pd',
      nipPengawas: '196203091984032013',
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
      'administrasi': 26, 'pembelajaran': 76, 'penilaian': 36, 'atp': 24, 'modul': 48, 'hasil-observasi': 70
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
  };

  const handleRefreshDashboard = useCallback(() => {
    alert('Sinkronisasi data berhasil!');
  }, []);

  const handleSaveSingleRecord = (updatedRecord: TeacherRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setSelectedRecord(null);
  };

  const NavItem = ({ view, label, icon, activeColor = 'bg-blue-600' }: { view: ViewType, label: string, icon?: React.ReactNode, activeColor?: string }) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center justify-start text-left px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${activeView === view ? `${activeColor} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
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
          <p className="text-[10px] text-blue-400 font-black mt-1 tracking-widest italic uppercase">Supervisi Pro</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-hide">
          <NavItem view="dashboard" label="Dashboard" activeColor="bg-indigo-600" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 v2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6zM10 5a1 1 0 011-1h2a1 v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5z" strokeWidth="2"/></svg>} />
          
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="perencanaan" label="1. Program Kerja" color="text-indigo-400" />
            {openSections.perencanaan && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="prog-akademik" label="Program Supervisi Akademik" activeColor="bg-indigo-600" />
                <NavItem view="prog-tendik" label="Program Supervisi Tendik" activeColor="bg-indigo-600" />
                <NavItem view="prog-extra" label="Program Supervisi Ekstra" activeColor="bg-indigo-600" />
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="jadwal" label="2. Jadwal & Instrumen" color="text-blue-400" />
            {openSections.jadwal && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="supervision-admin-guru" label="Jadwal Administrasi Guru" activeColor="bg-blue-600" />
                <NavItem view="supervision" label="Jadwal Pembelajaran Guru" activeColor="bg-blue-600" />
                <NavItem view="schedule-admin" label="Jadwal Supervisi Tendik" activeColor="bg-blue-600" />
                <NavItem view="schedule-extra" label="Jadwal Supervisi Ekstra" activeColor="bg-blue-600" />
                <NavItem view="inst-administrasi" label="Instrumen Administrasi" activeColor="bg-emerald-600" />
                <NavItem view="inst-pelaksanaan" label="Instrumen Pelaksanaan" activeColor="bg-emerald-600" />
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="tindakLanjutMain" label="3. Program Tindak Lanjut" color="text-amber-400" />
            {openSections.tindakLanjutMain && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="ptl-akademik" label="PTL Akademik (Guru)" activeColor="bg-amber-600" />
                <NavItem view="ptl-tendik" label="PTL Tendik" activeColor="bg-amber-600" />
                <NavItem view="ptl-extra" label="PTL Ekstrakurikuler" activeColor="bg-amber-600" />
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="laporanMain" label="4. Laporan Akhir" color="text-rose-400" />
            {openSections.laporanMain && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="lap-akademik" label="Laporan Supervisi Akademik" activeColor="bg-rose-600" />
                <NavItem view="lap-tendik" label="Laporan Supervisi Tendik" activeColor="bg-rose-600" />
                <NavItem view="lap-extra" label="Laporan Supervisi Ekstra" activeColor="bg-rose-600" />
              </div>
            )}
          </div>

          <NavItem view="settings" label="Pengaturan" activeColor="bg-slate-700" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572z" strokeWidth="2"/></svg>} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b h-14 flex items-center justify-between px-6 shrink-0 no-print">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-500 lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2"/></svg>
            </button>
            <h2 className="ml-4 text-[10px] font-black text-slate-800 tracking-tight truncate uppercase">
              Administrator • {settings.tahunPelajaran} • SMST {settings.semester}
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeView === 'dashboard' && <MainDashboardView records={records} settings={settings} />}
            {activeView === 'settings' && <SettingsView settings={settings} setSettings={setSettings} records={records} setRecords={handleUpdateRecords} />}
            
            {/* 1-3. PROGRAM VIEWS */}
            {activeView === 'prog-akademik' && <ProgramDocView type="akademik" settings={settings} records={records} />}
            {activeView === 'prog-tendik' && <ProgramDocView type="tendik" settings={settings} adminRecords={adminRecords} />}
            {activeView === 'prog-extra' && <ProgramDocView type="extra" settings={settings} extraRecords={extraRecords} />}

            {/* JADWAL & INSTRUMEN (EXISTING) */}
            {activeView === 'supervision-admin-guru' && <AdminSupervisionView records={records} onUpdateRecords={handleUpdateRecords} settings={settings} onSelect={setSelectedRecord} setSettings={setSettings} />}
            {activeView === 'supervision' && <SupervisionView records={records} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSelect={setSelectedRecord} onUpdateRecords={handleUpdateRecords} settings={settings} setSettings={setSettings} />}
            {activeView === 'schedule-extra' && <ScheduleExtraView settings={settings} setSettings={setSettings} extraRecords={extraRecords} setExtraRecords={setExtraRecords} teacherRecords={records} />}
            {activeView === 'schedule-admin' && <ScheduleAdminView settings={settings} setSettings={setSettings} adminRecords={adminRecords} setAdminRecords={setAdminRecords} teacherRecords={records} />}
            {activeView === 'inst-administrasi' && <AdministrasiPembelajaran settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-pelaksanaan' && <PelaksanaanPembelajaran settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}

            {/* 4-6. TINDAK LANJUT VIEWS */}
            {activeView === 'ptl-akademik' && <ProgramTindakLanjutView settings={settings} records={records} setSettings={setSettings} />}
            {activeView === 'ptl-tendik' && <TendikResultsView adminRecords={adminRecords} settings={settings} instrumentResults={instrumentResults} setSettings={setSettings} />}
            {activeView === 'ptl-extra' && <ExtraResultsView extraRecords={extraRecords} settings={settings} instrumentResults={instrumentResults} setSettings={setSettings} />}

            {/* 7-9. LAPORAN VIEWS */}
            {activeView === 'lap-akademik' && <LaporanDocView type="akademik" settings={settings} records={records} />}
            {activeView === 'lap-tendik' && <LaporanDocView type="tendik" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} />}
            {activeView === 'lap-extra' && <LaporanDocView type="extra" settings={settings} extraRecords={extraRecords} instrumentResults={instrumentResults} />}
          </div>
        </div>
      </main>

      {selectedRecord && <SupervisionForm record={selectedRecord} onSave={handleSaveSingleRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
};

export default App;
