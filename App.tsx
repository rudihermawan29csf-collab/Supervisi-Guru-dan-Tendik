
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
import TendikResultsView from './components/TendikResultsView';
import ExtraResultsView from './components/ExtraResultsView';
import ProgramTindakLanjutView from './components/ProgramTindakLanjutView';
import FollowUpActionView from './components/FollowUpActionView';
import LearningAnalysisView from './components/LearningAnalysisView';
import SupervisionLogView from './components/SupervisionLogView';
import SupervisionRecapView from './components/SupervisionRecapView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    program: true,
    jadwal: true,
    instrumen: true,
    instrumenTendik: true,
    tindakLanjutMain: true,
    laporanRekap: true
  });

  const [selectedRecord, setSelectedRecord] = useState<TeacherRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaults: AppSettings = {
      namaSekolah: 'SMPN 3 Pacet',
      namaAdministrator: 'Administrator',
      nipAdministrator: '-',
      tahunPelajaran: '2025/2026',
      semester: 'Ganjil',
      namaKepalaSekolah: 'Didik Sulistyo, M.M.Pd.',
      nipKepalaSekolah: '19660518 198901 1 002',
      namaPengawas: 'LILIK HARIATI, S.Pd., M.Pd',
      nipPengawas: '196203091984032013',
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
      const saved = localStorage.getItem('supervisi_settings_final_v10');
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
  });

  const [records, setRecords] = useState<TeacherRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_records_final_v10');
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch { return INITIAL_TEACHERS; }
  });

  const [extraRecords, setExtraRecords] = useState<ExtraRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_extra_records_final_v10');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [adminRecords, setAdminRecords] = useState<AdminRecord[]>(() => {
    try {
      const saved = localStorage.getItem('supervisi_admin_records_final_v10');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [instrumentResults, setInstrumentResults] = useState<Record<string, InstrumentResult>>(() => {
    try {
      const saved = localStorage.getItem('supervisi_instrument_results_final_v10');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem('supervisi_settings_final_v10', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('supervisi_records_final_v10', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('supervisi_extra_records_final_v10', JSON.stringify(extraRecords)); }, [extraRecords]);
  useEffect(() => { localStorage.setItem('supervisi_admin_records_final_v10', JSON.stringify(adminRecords)); }, [adminRecords]);
  useEffect(() => { localStorage.setItem('supervisi_instrument_results_final_v10', JSON.stringify(instrumentResults)); }, [instrumentResults]);

  const handleUpdateRecords = useCallback((newRecords: TeacherRecord[]) => {
    setRecords(newRecords);
  }, []);

  const handleSaveInstrument = (teacherId: number, type: string, semester: string, data: InstrumentResult) => {
    const key = `${teacherId}-${type}-${semester}`;
    setInstrumentResults(prev => ({ ...prev, [key]: data }));
    
    if (['pembelajaran', 'administrasi', 'atp', 'modul', 'penilaian'].includes(type)) {
      setRecords(prev => prev.map(r => {
        if (r.id === teacherId) {
          const scoreValues = Object.values(data.scores).filter(v => typeof v === 'number') as number[];
          const sum = scoreValues.reduce((a, b) => a + b, 0);
          const total = scoreValues.length > 0 ? Math.round((sum / (scoreValues.length * 2)) * 100) : 0;
          
          const updated = { ...r, status: SupervisionStatus.COMPLETED };
          if (type === 'administrasi') updated.nilaiAdm = total;
          if (type === 'pembelajaran') updated.nilai = total;
          if (type === 'atp') updated.nilaiATP = total;
          if (type === 'modul') updated.nilaiModul = total;
          if (type === 'penilaian') updated.nilaiPenilaian = total;
          return updated;
        }
        return r;
      }));
    }
  };

  const handleSaveAction = (teacherId: number, actions: any) => {
    const key = `${teacherId}-followup-actions-${settings.semester}`;
    setInstrumentResults(prev => ({ ...prev, [key]: { scores: {}, remarks: {}, actions } }));
  };

  const handleSaveTendikInstrument = (key: string, data: InstrumentResult) => {
    setInstrumentResults(prev => ({ ...prev, [key]: data }));
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
      {/* Dynamic Sidebar with transition */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 transform lg:relative ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-0'} flex flex-col overflow-hidden`}>
        <div className="p-6 border-b border-slate-800 text-center bg-slate-950/50 relative">
          <h1 className="text-base font-black leading-tight text-white tracking-tight uppercase whitespace-nowrap">{settings.namaSekolah}</h1>
          <p className="text-[10px] text-blue-400 font-black mt-1 tracking-widest italic uppercase whitespace-nowrap">Supervisi Pro</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-hide">
          <NavItem view="dashboard" label="Dashboard Utama" activeColor="bg-indigo-600" />
          
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="program" label="1. Program & Jadwal" color="text-indigo-400" />
            {openSections.program && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="schedule" label="Jadwal Sekolah" activeColor="bg-indigo-600" />
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="jadwal" label="2. Jadwal Supervisi" color="text-blue-400" />
            {openSections.jadwal && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="supervision-admin-guru" label="Jadwal Adm. Guru" activeColor="bg-blue-600" />
                <NavItem view="supervision" label="Jadwal PBM Guru" activeColor="bg-blue-600" />
                <NavItem view="schedule-admin" label="Jadwal Tendik" activeColor="bg-blue-600" />
                <NavItem view="schedule-extra" label="Jadwal Ekstra" activeColor="bg-blue-600" />
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="instrumen" label="3. Instrumen Guru" color="text-emerald-400" />
            {openSections.instrumen && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="inst-atp" label="Telaah ATP" activeColor="bg-emerald-600" />
                <NavItem view="inst-modul" label="Telaah Modul Ajar" activeColor="bg-emerald-600" />
                <NavItem view="inst-administrasi" label="Adm. Pembelajaran" activeColor="bg-emerald-600" />
                <NavItem view="inst-pelaksanaan" label="Pelaksanaan Pemb." activeColor="bg-emerald-600" />
                <NavItem view="inst-penilaian" label="Penilaian Pemb." activeColor="bg-emerald-600" />
                <NavItem view="inst-hasil-observasi" label="Hasil Observasi" activeColor="bg-emerald-600" />
                <NavItem view="inst-post-observasi" label="Pasca Observasi" activeColor="bg-emerald-600" />
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="instrumenTendik" label="4. Instrumen Tendik" color="text-teal-400" />
            {openSections.instrumenTendik && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="tendik-sekolah" label="Adm. Sekolah" activeColor="bg-teal-600" />
                <NavItem view="tendik-ketenagaan" label="Adm. Ketenagaan" activeColor="bg-teal-600" />
                <NavItem view="tendik-perlengkapan" label="Adm. Sarpras" activeColor="bg-teal-600" />
                <NavItem view="tendik-perpustakaan" label="Adm. Perpustakaan" activeColor="bg-teal-600" />
                <NavItem view="tendik-lab-ipa" label="Lab. IPA" activeColor="bg-teal-600" />
                <NavItem view="tendik-lab-komputer" label="Lab. Komputer" activeColor="bg-teal-600" />
                <NavItem view="tendik-kesiswaan" label="Adm. Kesiswaan" activeColor="bg-teal-600" />
                <NavItem view="inst-ekstra" label="Ekstrakurikuler" activeColor="bg-teal-600" />
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden pb-1">
            <SectionHeader id="laporanRekap" label="6. Rekap & Hasil Guru" color="text-rose-400" />
            {openSections.laporanRekap && (
              <div className="px-1 space-y-0.5 animate-slideDown">
                <NavItem view="lap-analisis-pbm" label="Analisis Hasil PBM" activeColor="bg-rose-600" />
                <NavItem view="lap-catatan-pbm" label="Catatan Pelaksanaan" activeColor="bg-rose-600" />
                <NavItem view="lap-rekap-akademik" label="Rekap Akademik" activeColor="bg-rose-600" />
                <NavItem view="lap-ptl-akademik" label="Program Tindak Lanjut" activeColor="bg-rose-600" />
                <NavItem view="lap-action-akademik" label="Tindak Lanjut Action" activeColor="bg-rose-600" />
              </div>
            )}
          </div>

          <NavItem view="settings" label="Pengaturan" activeColor="bg-slate-700" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b h-14 flex items-center justify-between px-6 shrink-0 no-print">
          <div className="flex items-center">
            {/* Unified Sidebar Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
            >
              {isSidebarOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
            <h2 className="ml-4 text-sm font-black text-slate-800 uppercase truncate">Manajemen Supervisi SMPN 3 Pacet</h2>
          </div>
          <div className="flex flex-col items-end shrink-0 ml-2">
             <span className="text-[11px] font-black uppercase text-slate-800">Administrator</span>
             <span className="text-[9px] font-bold text-blue-600 uppercase">TP {settings.tahunPelajaran} • {settings.semester}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeView === 'dashboard' && <MainDashboardView records={records} settings={settings} />}
            {activeView === 'settings' && <SettingsView settings={settings} setSettings={setSettings} records={records} setRecords={handleUpdateRecords} />}
            
            {/* JADWAL */}
            {activeView === 'supervision' && <SupervisionView records={records} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSelect={setSelectedRecord} onUpdateRecords={handleUpdateRecords} settings={settings} setSettings={setSettings} />}
            {activeView === 'schedule' && <ScheduleView settings={settings} />}
            {activeView === 'supervision-admin-guru' && <AdminSupervisionView records={records} onUpdateRecords={handleUpdateRecords} settings={settings} onSelect={setSelectedRecord} setSettings={setSettings} />}
            {activeView === 'schedule-extra' && <ScheduleExtraView settings={settings} setSettings={setSettings} extraRecords={extraRecords} setExtraRecords={setExtraRecords} teacherRecords={records} />}
            {activeView === 'schedule-admin' && <ScheduleAdminView settings={settings} setSettings={setSettings} adminRecords={adminRecords} setAdminRecords={setAdminRecords} teacherRecords={records} />}

            {/* INSTRUMEN GURU */}
            {activeView === 'inst-atp' && <PenelaahanATP settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-modul' && <TelaahModulAjar settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-administrasi' && <AdministrasiPembelajaran settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-pelaksanaan' && <PelaksanaanPembelajaran settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-penilaian' && <PenilaianPembelajaran settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-hasil-observasi' && <ObservationResultsView settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}
            {activeView === 'inst-post-observasi' && <PostObservationView settings={settings} setSettings={setSettings} records={records} instrumentResults={instrumentResults} onSave={handleSaveInstrument} />}

            {/* INSTRUMEN TENDIK */}
            {activeView === 'tendik-sekolah' && <InstrumentTendikView type="sekolah" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} setSettings={setSettings} />}
            {activeView === 'tendik-ketenagaan' && <InstrumentTendikView type="ketenagaan" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} setSettings={setSettings} />}
            {activeView === 'tendik-perlengkapan' && <InstrumentTendikView type="perlengkapan" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} setSettings={setSettings} />}
            {activeView === 'tendik-perpustakaan' && <InstrumentTendikView type="perpustakaan" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} setSettings={setSettings} />}
            {activeView === 'tendik-lab-ipa' && <InstrumentTendikView type="lab-ipa" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} setSettings={setSettings} />}
            {activeView === 'tendik-lab-komputer' && <InstrumentTendikView type="lab-komputer" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} setSettings={setSettings} />}
            {activeView === 'tendik-kesiswaan' && <InstrumentTendikView type="kesiswaan" settings={settings} adminRecords={adminRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} setSettings={setSettings} />}
            {activeView === 'inst-ekstra' && <InstrumentExtraView settings={settings} setSettings={setSettings} extraRecords={extraRecords} instrumentResults={instrumentResults} onSave={handleSaveTendikInstrument} />}

            {/* LAPORAN & REKAP AKADEMIK */}
            {activeView === 'lap-analisis-pbm' && <LearningAnalysisView settings={settings} records={records} instrumentResults={instrumentResults} setSettings={setSettings} />}
            {activeView === 'lap-catatan-pbm' && <SupervisionLogView settings={settings} records={records} instrumentResults={instrumentResults} setSettings={setSettings} />}
            {activeView === 'lap-rekap-akademik' && <SupervisionRecapView settings={settings} records={records} setSettings={setSettings} />}
            {activeView === 'lap-ptl-akademik' && <ProgramTindakLanjutView settings={settings} records={records} setSettings={setSettings} />}
            {activeView === 'lap-action-akademik' && <FollowUpActionView settings={settings} records={records} setSettings={setSettings} instrumentResults={instrumentResults} onSaveAction={handleSaveAction} />}
            
            {/* TINDAK LANJUT TENDIK & EXTRA */}
            {activeView === 'ptl-tendik' && <TendikResultsView adminRecords={adminRecords} settings={settings} instrumentResults={instrumentResults} setSettings={setSettings} />}
            {activeView === 'ptl-extra' && <ExtraResultsView extraRecords={extraRecords} settings={settings} instrumentResults={instrumentResults} setSettings={setSettings} />}
          </div>
        </div>
      </main>

      {selectedRecord && (
        <SupervisionForm 
          record={selectedRecord} 
          onSave={(updated) => { setRecords(prev => prev.map(r => r.id === updated.id ? updated : r)); setSelectedRecord(null); }} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}
    </div>
  );
};

export default App;
