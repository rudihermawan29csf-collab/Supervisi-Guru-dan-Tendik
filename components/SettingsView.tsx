
import React, { useState, useCallback } from 'react';
import { AppSettings, DateRange, TeacherRecord, SupervisionStatus } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  records: TeacherRecord[];
  setRecords: (records: TeacherRecord[]) => void;
}

type SettingTab = 'identitas' | 'database' | 'tugas-tu';

const ScheduleRangeInput: React.FC<{ 
  label: string, 
  rangeKeyGanjil: keyof AppSettings, 
  rangeKeyGenap: keyof AppSettings,
  settings: AppSettings,
  onDateChange: (key: keyof AppSettings, field: keyof DateRange, value: string) => void
}> = ({ label, rangeKeyGanjil, rangeKeyGenap, settings, onDateChange }) => (
  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
    <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center">
      <div className="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></div>
      {label}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-blue-600">Semester Ganjil</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400">Tanggal Mulai</label>
            <input 
              type="date" 
              value={(settings[rangeKeyGanjil] as DateRange)?.from || ''} 
              onChange={e => onDateChange(rangeKeyGanjil, 'from', e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400">Tanggal Selesai</label>
            <input 
              type="date" 
              value={(settings[rangeKeyGanjil] as DateRange)?.to || ''} 
              onChange={e => onDateChange(rangeKeyGanjil, 'to', e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-emerald-600">Semester Genap</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400">Tanggal Mulai</label>
            <input 
              type="date" 
              value={(settings[rangeKeyGenap] as DateRange)?.from || ''} 
              onChange={e => onDateChange(rangeKeyGenap, 'from', e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400">Tanggal Selesai</label>
            <input 
              type="date" 
              value={(settings[rangeKeyGenap] as DateRange)?.to || ''} 
              onChange={e => onDateChange(rangeKeyGenap, 'to', e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TugasTambahanTU = ({ onSave }: { onSave: () => void }) => {
  const dataPTT = [
    {
      no: 1, nama: "Imam Safi'i", jabatan: "PTT", 
      tugas: [
        { label: "Koordinator Tenaga Administrasi Sekolah", detail: "Struktur Organisasi Sekolah" },
        { label: "Pelaksana Urusan Administrasi Kepegawaian", detail: "File Guru dan Karyawan, Papan Data Ketenagaan" },
        { label: "Proktor Kegiatan Evaluasi dan Penilaian", detail: "Pelaksana Asesmen Kompetensi Minimum, Kegiatan Evaluasi lainnya" },
        { label: "Operator PPDB", detail: "Melaksanakan kegiatan PPDB Online" },
        { label: "Operator Dapodik", detail: "Pelaksana Dapodik, E-Rapor, Pembuat Nomor Induk Siswa" },
        { label: "Urusan Mutasi Peserta Didik", detail: "Penyelesaian Mutasi Siswa, Buku Klaper" }
      ]
    },
    {
      no: 2, nama: "Mansyur Rohmad", jabatan: "PTT",
      tugas: [
        { label: "Pelaksana Urusan Administrasi Humas", detail: "Buku Absensi GTT/PTT, Membantu pelaksanaan kegiatan Humas" },
        { label: "Pelaksana Urusan Administrasi Kesiswaan", detail: "Pengisian Identitas Buku Induk, Data Nilai, Penempelan Foto, Raport" },
        { label: "Pelaksana Urusan Sarana dan Prasarana", detail: "Koordinator Perawatan Sarana Sekolah, Petugas Perpustakaan" }
      ]
    },
    {
      no: 3, nama: "Rayi Putri Lestari, S.Pd.", jabatan: "PTT",
      tugas: [
        { label: "Administrasi Persuratan dan Pengarsipan", detail: "Agenda, Penerima Surat, SPPD, Ekspedisi, Filing, Buku Tamu, Bel PBM, Jurnal Guru" },
        { label: "Pengelola Urusan KIP/PIP/PKH", detail: "Terlaksananya proses PIP bagi peserta didik" },
        { label: "Administrasi Kurikulum", detail: "Arsip Ijazah, Legalisir Ijazah" },
        { label: "Staf Kepegawaian", detail: "Buku DUK, Kenaikan Berkala, Masa Purna Tugas" }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
      <div className="p-6 border-b bg-slate-50 flex justify-between items-center no-print">
         <div>
            <h3 className="font-bold text-slate-800">Pembagian Tugas Tenaga Administrasi Sekolah</h3>
            <p className="text-[11px] text-slate-500 mt-1">Tahun Pelajaran 2025/2026 • SMPN 3 Pacet</p>
         </div>
         <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-slate-800 transition-all">Cetak Daftar</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px]">
              <th className="px-4 py-4 border border-slate-800 text-center w-12">No</th>
              <th className="px-6 py-4 border border-slate-800 w-56">Nama / NIP</th>
              <th className="px-4 py-4 border border-slate-800 text-center w-20">Jabatan</th>
              <th className="px-6 py-4 border border-slate-800">Tugas Tambahan</th>
              <th className="px-6 py-4 border border-slate-800">Rincian Tugas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {dataPTT.map((person) => (
              <React.Fragment key={person.no}>
                {person.tugas.map((t, idx) => (
                  <tr key={`${person.no}-${idx}`} className="hover:bg-slate-50 transition-colors">
                    {idx === 0 && (
                      <>
                        <td rowSpan={person.tugas.length} className="px-4 py-4 text-center font-bold text-slate-400 align-top border border-slate-100">{person.no}</td>
                        <td rowSpan={person.tugas.length} className="px-6 py-4 align-top border border-slate-100">
                          <div className="font-bold text-slate-900 leading-tight">{person.nama}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-1">NIP. -</div>
                        </td>
                        <td rowSpan={person.tugas.length} className="px-4 py-4 text-center font-bold text-blue-600 align-top border border-slate-100">{person.jabatan}</td>
                      </>
                    )}
                    <td className="px-6 py-3 text-slate-700 border border-slate-100">
                       <span className="text-blue-500 mr-2">{idx + 1}.</span> {t.label}
                    </td>
                    <td className="px-6 py-3 text-slate-500 italic border border-slate-100">
                       {t.detail}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-slate-50 border-t flex justify-end no-print">
        <button 
          onClick={onSave}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-lg hover:bg-slate-800 transition-all flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings, records, setRecords }) => {
  const [activeTab, setActiveTab] = useState<SettingTab>('identitas');
  const [newTeacher, setNewTeacher] = useState({ name: '', nip: '', pangkat: '', subject: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleGlobalSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Perubahan berhasil disimpan!');
    }, 600);
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  }, [settings, setSettings]);

  const handleDateChange = useCallback((key: keyof AppSettings, field: keyof DateRange, value: string) => {
    const currentRange = (settings[key] as DateRange) || { from: '', to: '' };
    setSettings({
      ...settings,
      [key]: { ...currentRange, [field]: value }
    });
  }, [settings, setSettings]);

  const addTeacher = () => {
    if (!newTeacher.name || !newTeacher.subject) return;
    const newId = Math.max(0, ...records.map(r => r.id)) + 1;
    const teacher: TeacherRecord = {
      id: newId,
      no: records.length + 1,
      namaGuru: newTeacher.name,
      nip: newTeacher.nip,
      pangkatGolongan: newTeacher.pangkat,
      mataPelajaran: newTeacher.subject,
      hari: '',
      tanggal: '',
      kelas: '',
      jamKe: '',
      status: SupervisionStatus.PENDING,
      semester: settings.semester
    };
    setRecords([...records, teacher]);
    setNewTeacher({ name: '', nip: '', pangkat: '', subject: '' });
  };

  const deleteTeacher = (id: number) => {
    if (confirm('Hapus guru ini?')) {
      const filtered = records.filter(r => r.id !== id).map((r, i) => ({ ...r, no: i + 1 }));
      setRecords(filtered);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 pb-20">
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm space-x-1 no-print">
        <button 
          onClick={() => setActiveTab('identitas')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-[11px] font-bold transition-all ${activeTab === 'identitas' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Identitas & Jadwal
        </button>
        <button 
          onClick={() => setActiveTab('database')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-[11px] font-bold transition-all ${activeTab === 'database' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Database Guru
        </button>
        <button 
          onClick={() => setActiveTab('tugas-tu')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-[11px] font-bold transition-all ${activeTab === 'tugas-tu' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Tugas Tambahan TU
        </button>
      </div>

      {activeTab === 'identitas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b bg-slate-50">
              <h2 className="text-xs font-bold text-slate-800">Identitas Sekolah</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500">Nama Sekolah</label>
                <input type="text" name="namaSekolah" value={settings.namaSekolah} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500">Tahun Pelajaran</label>
                <input type="text" name="tahunPelajaran" value={settings.tahunPelajaran} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500">Nama Kepala Sekolah</label>
                <input type="text" name="namaKepalaSekolah" value={settings.namaKepalaSekolah} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500">NIP Kepala Sekolah</label>
                <input type="text" name="nipKepalaSekolah" value={settings.nipKepalaSekolah} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b bg-slate-50">
              <h2 className="text-xs font-bold text-slate-800">Rentang Waktu Supervisi</h2>
            </div>
            <div className="p-8 space-y-6">
              <ScheduleRangeInput 
                label="Supervisi Administrasi Guru" 
                rangeKeyGanjil="rangeAdmGuruGanjil" 
                rangeKeyGenap="rangeAdmGuruGenap" 
                settings={settings}
                onDateChange={handleDateChange}
              />
              <ScheduleRangeInput 
                label="Supervisi Pembelajaran Guru" 
                rangeKeyGanjil="rangePembelajaranGuru" 
                rangeKeyGenap="rangePembelajaranGuruGenap" 
                settings={settings}
                onDateChange={handleDateChange}
              />
              <ScheduleRangeInput 
                label="Supervisi Tenaga Kependidikan" 
                rangeKeyGanjil="rangeTendikGanjil" 
                rangeKeyGenap="rangeTendikGenap" 
                settings={settings}
                onDateChange={handleDateChange}
              />
              <ScheduleRangeInput 
                label="Supervisi Ekstrakurikuler" 
                rangeKeyGanjil="rangeExtraGanjil" 
                rangeKeyGenap="rangeExtraGenap" 
                settings={settings}
                onDateChange={handleDateChange}
              />
            </div>
            <div className="p-8 bg-slate-50 border-t flex justify-end no-print">
              <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg hover:bg-blue-700 transition-all flex items-center disabled:opacity-50"
              >
                <svg className={`w-4 h-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isSaving ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  )}
                </svg>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-800">Database Guru</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200 no-print">
                <input type="text" placeholder="Nama Lengkap" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl outline-none text-xs font-medium" />
                <input type="text" placeholder="NIP" value={newTeacher.nip} onChange={e => setNewTeacher({...newTeacher, nip: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl outline-none text-xs font-medium" />
                <input type="text" placeholder="Pangkat/Gol" value={newTeacher.pangkat} onChange={e => setNewTeacher({...newTeacher, pangkat: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl outline-none text-xs font-medium" />
                <input type="text" placeholder="Mapel" value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl outline-none text-xs font-medium" />
                <button onClick={addTeacher} className="bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md py-2">+ Guru</button>
              </div>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900 text-white text-[11px]">
                    <tr>
                      <th className="px-4 py-4 font-bold w-12 border border-slate-800">No</th>
                      <th className="px-4 py-4 font-bold border border-slate-800">Nama Guru</th>
                      <th className="px-4 py-4 font-bold border border-slate-800">NIP</th>
                      <th className="px-4 py-4 font-bold border border-slate-800 w-24">Pangkat</th>
                      <th className="px-4 py-4 font-bold border border-slate-800">Mata Pelajaran</th>
                      <th className="px-4 py-4 font-bold text-right no-print border border-slate-800 w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {records.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-4 font-bold text-slate-800">{r.namaGuru}</td>
                        <td className="px-4 py-4 font-mono text-slate-600">{r.nip || '-'}</td>
                        <td className="px-4 py-4 text-slate-600 font-medium">{r.pangkatGolongan || '-'}</td>
                        <td className="px-4 py-4 text-slate-500 font-medium italic">{r.mataPelajaran}</td>
                        <td className="px-4 py-4 text-right no-print">
                          <button onClick={() => deleteTeacher(r.id)} className="text-red-400 hover:text-red-600 font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-red-50 transition-all">
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t flex justify-end no-print">
              <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg hover:bg-indigo-700 transition-all flex items-center disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tugas-tu' && <TugasTambahanTU onSave={handleGlobalSave} />}
    </div>
  );
};

export default SettingsView;
