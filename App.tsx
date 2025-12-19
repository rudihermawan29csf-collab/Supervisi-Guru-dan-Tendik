
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
import SettingsView from './components/SettingsView';
import MainDashboardView from './components/MainDashboardView';
import AdminSupervisionView from './components/AdminSupervisionView';
import FollowUpResultsView from './components/FollowUpResultsView';

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
    tindakLanjut: true
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
      const saved = localStorage.getItem('supervisi_settings_v9');
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
  });

  const [records, setRecords] = useState<TeacherRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_records_v9');
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch { return INITIAL_TEACHERS; }
  });

  const [extraRecords, setExtraRecords] = useState<ExtraRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_extra_records_v9');
      return saved ? JSON.parse(saved) : INITIAL_EXTRA;
    } catch { return INITIAL_EXTRA; }
  });

  const [adminRecords, setAdminRecords] = useState<AdminRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_admin_records_v9');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN;
    } catch { return INITIAL_ADMIN; }
  });

  const [instrumentResults, setInstrumentResults] = useState<Record<string, InstrumentResult>>(() => {
    try {
      const saved = localStorage.getItem('supervisi_instrument_results_v9');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('supervisi_settings_v9', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('supervisi_records_v9', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('supervisi_extra_records_v9', JSON.stringify(extraRecords));
  }, [extraRecords]);

  useEffect(() => {
    localStorage.setItem('supervisi_admin_records_v9', JSON.stringify(adminRecords));
  }, [adminRecords]);

  useEffect(() => {
    localStorage.setItem('supervisi_instrument_results_v9', JSON.stringify(instrumentResults));
  }, [instrumentResults]);

  const handleUpdateRecords = useCallback((newRecords: TeacherRecord[]) => {
    setRecords(newRecords);
  }, []);

  const handleSaveInstrument = (teacherId: number, type: string, semester: string, data: InstrumentResult) => {
    const key = `${teacherId}-${type}-${semester}`;
    setInstrumentResults(prev => ({
      ...prev,
      [key]: data
    }));
    
    if (type === 'administrasi' || type === 'pembelajaran') {
       const scoreArray = Object.values(data.scores);
       const total = scoreArray.reduce((a, b) => a + b, 0);
       const max = type === 'administrasi' ? 26 : 76;
       const finalScore = Math.round((total / max) * 100);
       
       setRecords(prev => prev.map(r => {
         if (r.id === teacherId) {
            const updated = type === 'administrasi' ? { ...r, nilaiAdm: finalScore, status: SupervisionStatus.COMPLETED } : { ...r, nilai: finalScore, status: SupervisionStatus.COMPLETED };
            return { ...updated, tindakLanjut: data.tindakLanjut, catatan: data.catatan };
         }
         return r;
       }));
    }
    alert('Data instrumen berhasil disimpan!');
  };

  const handleRefreshDashboard = useCallback(() => {
    const updated = records.map(r => {
      const admKey = `${r.id}-administrasi-${settings.semester}`;
      const pembKey = `${r.id}-pembelajaran-${settings.semester}`;
      let nilaiAdm = r.nilaiAdm;
      let nilai = r.nilai;
      let catatan = r.catatan;
      let tindakLanjut = r.tindakLanjut;

      if (instrumentResults[admKey]) {
        // Fix: Explicitly casting Object.values result to number[] to resolve "unknown" type errors in reduce and arithmetic operations.
        const scores = Object.values(instrumentResults[admKey].scores) as number[];
        const total = scores.reduce((a, b) => a + b, 0);
        nilaiAdm = Math.round((total / 26) * 100);
        catatan = instrumentResults[admKey].catatan || catatan;
        tindakLanjut = instrumentResults[admKey].tindakLanjut || tindakLanjut;
      }

      if (instrumentResults[pembKey]) {
        // Fix: Explicitly casting Object.values result to number[] to resolve "unknown" type errors in reduce and arithmetic operations.
        const scores = Object.values(instrumentResults[pembKey].scores) as number[];
        const total = scores.reduce((a, b) => a + b, 0);
        nilai = Math.round((total / 76) * 100);
      }

      return { ...r, nilaiAdm, nilai, catatan, tindakLanjut };
    });
    setRecords(updated);
    alert('Sinkronisasi data berhasil! Dashboard telah diperbarui dengan nilai terbaru.');
  }, [records, instrumentResults, settings.semester]);

  const handleSaveSingleRecord = (updatedRecord: TeacherRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setSelectedRecord(null);
  };

  const NavItem = ({ view, label, icon }: { view: ViewType, label: string, icon?: React.ReactNode }) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === view ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );

  const SectionHeader = ({ id, label }: { id: string, label: string }) => (
    <button 
      onClick={() => setOpenSections(p => ({...p, [id]: !p[id]}))}
      className="w-full flex items-center justify-between px-4 py-2 mt-4 text-[10px] font-bold text-slate-500 hover:text-slate-300"
    >
      <span>{label}</span>
      <svg className={`w-3 h-3 transition-transform ${openSections[id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-slate-800 text-center">
          <h1 className="text-base font-bold leading-tight">{settings.namaSekolah}</h1>
          <p className="text-[10px] text-blue-400 font-bold mt-1 tracking-wide italic">Sistem Supervisi Akademik</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
          <NavItem view="dashboard" label="Dashboard Utama" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1-0 01-1-1v-6zM10 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1-0 01-1-1V5z" strokeWidth="2"/></svg>} />
          <NavItem view="settings" label="Pengaturan Sistem" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572z" strokeWidth="2"/></svg>} />

          <SectionHeader id="jadwal" label="Jadwal Supervisi" />
          {openSections.jadwal && (
            <div className="space-y-0.5">
              <NavItem view="supervision-admin-guru" label="Administrasi Guru" />
              <NavItem view="supervision" label="Jadwal Pembelajaran Guru" />
              <NavItem view="schedule-admin" label="Supervisi Tendik" />
              <NavItem view="schedule-extra" label="Supervisi Ekstra" />
              <NavItem view="schedule" label="Jadwal Pelajaran Sekolah" />
            </div>
          )}

          <SectionHeader id="instrumenGuru" label="Instrumen Guru" />
          {openSections.instrumenGuru && (
            <div className="space-y-0.5">
              <NavItem view="inst-administrasi" label="Administrasi Pembelajaran" />
              <NavItem view="inst-pelaksanaan" label="Pelaksanaan Pembelajaran" />
              <NavItem view="inst-penilaian" label="Penilaian Pembelajaran" />
              <NavItem view="inst-atp" label="Penelaahan ATP" />
              <NavItem view="inst-modul" label="Telaah Modul Ajar" />
            </div>
          )}

          <SectionHeader id="instrumenTendik" label="Instrumen Tendik" />
          {openSections.instrumenTendik && (
            <div className="space-y-0.5">
              <NavItem view="tendik-sekolah" label="Administrasi Sekolah" />
              <NavItem view="tendik-ketenagaan" label="Administrasi Ketenagaan" />
              <NavItem view="tendik-perlengkapan" label="Administrasi Perlengkapan" />
              <NavItem view="tendik-perpustakaan" label="Administrasi Perpustakaan" />
              <NavItem view="tendik-lab-ipa" label="Laboratorium IPA" />
              <NavItem view="tendik-lab-komputer" label="Laboratorium Komputer" />
              <NavItem view="tendik-kesiswaan" label="Administrasi Kesiswaan" />
              <NavItem view="tendik-ekstra" label="Kegiatan Ekstrakurikuler" />
            </div>
          )}

          <SectionHeader id="tindakLanjut" label="Tindak Lanjut" />
          {openSections.tindakLanjut && (
            <div className="space-y-0.5">
              <NavItem view="follow-up-results" label="Hasil & Tindak Lanjut" />
            </div>
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b h-14 flex items-center justify-between px-6 shrink-0 no-print">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-500 lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2"/></svg>
            </button>
            <h2 className="ml-4 text-xs font-bold text-slate-800 tracking-tight truncate">
              {activeView.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
             <div className="text-right">
                <p className="text-[11px] font-bold text-slate-900 leading-none">{settings.namaKepalaSekolah}</p>
                <p className="text-[10px] text-blue-600 font-medium mt-1">TP {settings.tahunPelajaran} • Semester {settings.semester}</p>
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
            {activeView === 'follow-up-results' && <FollowUpResultsView records={records} settings={settings} onUpdate={handleUpdateRecords} />}
            {activeView.startsWith('tendik-') && <InstrumentTendikView type={activeView.replace('tendik-', '') as any} settings={settings} />}
          </div>
        </div>
      </main>

      {selectedRecord && <SupervisionForm record={selectedRecord} onSave={handleSaveSingleRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
};

export default App;
