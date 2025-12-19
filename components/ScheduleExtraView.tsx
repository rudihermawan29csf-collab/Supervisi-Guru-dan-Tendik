
import React, { useState, useMemo } from 'react';
import { AppSettings, ExtraRecord, TeacherRecord } from '../types';

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  extraRecords: ExtraRecord[];
  setExtraRecords: (recs: ExtraRecord[]) => void;
  teacherRecords: TeacherRecord[];
}

const DEFAULT_EXTRA_TEMPLATES = [
  { nama: 'Fahmi Wahyuni, S.Pd', nip: '-', ekstra: 'OSN Bahasa Indonesia', pukul: '10.00 - 11.00', tempat: 'Ruang Kepala Sekolah' },
  { nama: 'Rudi Hermawan, S.Pd.I', nip: '19891029 202012 1 003', ekstra: 'TBTQ', pukul: '11.00 - 12.30', tempat: 'Ruang Kepala Sekolah' },
  { nama: 'Eka Hariyati, s.pd.', nip: '-', ekstra: 'Pembina PMR/UKS', pukul: '11.00 - 12.00', tempat: 'Ruang Kepala Sekolah' },
  { nama: 'Fery Agus Pujianto', nip: '-', ekstra: 'Pembina Pramuka', pukul: '11.00 - 12.30', tempat: 'Ruang Kepala Sekolah' },
  { nama: 'Moch. Husain Rifai Hamzah, s.pd.', nip: '19920316 202012 1 011', ekstra: 'Pembina Futsal', pukul: '11.00 - 12.30', tempat: 'Ruang Kepala Sekolah' },
  { nama: 'Fakhita Madury, S.Sn.', nip: '-', ekstra: 'Seni', pukul: '11.00 - 12.00', tempat: 'Ruang Kelas' },
  { nama: 'Rebby Dwi Prataopu, S.Si', nip: '-', ekstra: 'OSN IPA', pukul: '09.00 - 10.30', tempat: 'Laboratorium IPA' },
  { nama: 'Mukhamad Yunus, S.Pd', nip: '-', ekstra: 'OSN Matematika', pukul: '11.00 - 12.00', tempat: 'Ruang Kelas' },
  { nama: 'Retno Nawangwulan, S. Pd.', nip: '19850703 202521 2 006', ekstra: 'English Club', pukul: '12.00 - 13.30', tempat: 'Ruang Kelas' },
];

const ScheduleExtraView: React.FC<Props> = ({ settings, setSettings, extraRecords, setExtraRecords, teacherRecords }) => {
  const activeSemester = settings.semester;
  const filteredData = useMemo(() => extraRecords.filter(r => r.semester === activeSemester), [extraRecords, activeSemester]);

  // Derived teacher list for the dropdown
  const teacherList = useMemo(() => {
    // Fix: Explicitly type 'names' as string[] to avoid 'unknown' type inference issues
    const names: string[] = Array.from(new Set(teacherRecords.map(r => r.namaGuru))).sort() as string[];
    // Fix: Explicitly type the list to resolve "unknown" type incompatibility in callback
    const list: { name: string; nip: string }[] = names.map((name: string) => {
      const record = teacherRecords.find(r => r.namaGuru === name);
      return { name, nip: record?.nip || '-' };
    });
    // Add Fery Agus Pujianto if not in main list
    if (!names.includes('Fery Agus Pujianto')) {
      list.push({ name: 'Fery Agus Pujianto', nip: '-' });
    }
    // Fix: Using inferred types for sort parameters to avoid type mismatch with the array elements
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [teacherRecords]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ExtraRecord, 'id' | 'semester'>>({
    nama: '',
    nip: '',
    hari: '',
    tgl: '',
    pukul: '',
    ekstra: '',
    tempat: '',
    supervisor: settings.namaKepalaSekolah
  });

  const handleOpenModal = (record?: ExtraRecord) => {
    if (record) {
      setEditingId(record.id);
      setFormData({
        nama: record.nama,
        nip: record.nip,
        hari: record.hari,
        tgl: record.tgl,
        pukul: record.pukul,
        ekstra: record.ekstra,
        tempat: record.tempat,
        supervisor: record.supervisor
      });
    } else {
      setEditingId(null);
      setFormData({
        nama: '',
        nip: '',
        hari: '',
        tgl: '',
        pukul: '',
        ekstra: '',
        tempat: '',
        supervisor: settings.namaKepalaSekolah
      });
    }
    setIsModalOpen(true);
  };

  const handleTeacherSelect = (name: string) => {
    const selected = teacherList.find(t => t.name === name);
    setFormData({
      ...formData,
      nama: name,
      nip: selected?.nip || '-'
    });
  };

  const handleGenerateExtra = () => {
    const range = activeSemester === 'Ganjil' ? settings.rangeExtraGanjil : settings.rangeExtraGenap;
    if (!range?.from) { alert('Tentukan rentang tanggal di Pengaturan!'); return; }
    
    const startDate = new Date(range.from);
    const endDate = new Date(range.to);
    let currentDate = new Date(startDate);
    
    const otherSemesterRecords = extraRecords.filter(r => r.semester !== activeSemester);
    const generated: ExtraRecord[] = DEFAULT_EXTRA_TEMPLATES.map((tpl, index) => {
      // Logic for dates: assign sequentially but skip Sunday
      if (currentDate.getDay() === 0) currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate > endDate) currentDate = new Date(startDate);
      
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const dayNameStr = dayNames[currentDate.getDay()];
      const tglStr = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      
      const res = {
        id: index + 1 + (otherSemesterRecords.length > 0 ? Math.max(...otherSemesterRecords.map(o => o.id)) : 0),
        nama: tpl.nama,
        nip: tpl.nip,
        hari: dayNameStr,
        tgl: tglStr,
        pukul: tpl.pukul,
        ekstra: tpl.ekstra,
        tempat: tpl.tempat,
        supervisor: settings.namaKepalaSekolah,
        semester: activeSemester
      };
      
      currentDate.setDate(currentDate.getDate() + 1);
      return res;
    });

    setExtraRecords([...otherSemesterRecords, ...generated]);
    alert(`Berhasil membuat ${generated.length} jadwal supervisi ekstra secara otomatis!`);
  };

  const handleSaveRecord = () => {
    if (editingId !== null) {
      const updated = extraRecords.map(r => r.id === editingId ? { ...formData, id: r.id, semester: r.semester } : r);
      setExtraRecords(updated);
    } else {
      const nextId = extraRecords.length > 0 ? Math.max(...extraRecords.map(r => r.id)) + 1 : 1;
      const newRecord: ExtraRecord = { ...formData, id: nextId, semester: activeSemester };
      setExtraRecords([...extraRecords, newRecord]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setExtraRecords(extraRecords.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const tableElement = document.getElementById('extra-table-content-real');
    if (!tableElement) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid windowtext; padding: 5px; }</style></head><body>`;
    const tableHtml = tableElement.outerHTML;
    const footer = `</body></html>`;
    const blob = new Blob([header + tableHtml + footer], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_Ekstra_${activeSemester}.xls`;
    link.click();
  };

  const exportPDF = () => {
    const element = document.getElementById('extra-export-content');
    const opt = {
      margin: 10,
      filename: `Jadwal_Ekstra_${activeSemester}.pdf`,
      jsPDF: { orientation: 'landscape' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 no-print px-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Supervisi Ekstra</h2>
          <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner mt-2 inline-flex">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Ganjil' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Genap' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Genap</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleGenerateExtra} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-indigo-700">Otomatis</button>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-blue-700">+ Tambah</button>
          <button onClick={exportPDF} className="px-3 py-2 bg-red-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-red-700">PDF</button>
          <button onClick={exportExcel} className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-emerald-700">Excel</button>
        </div>
      </div>

      <section id="extra-export-content" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b bg-blue-600 text-white text-center">
          <h2 className="text-xl font-bold">Jadwal Supervisi Kegiatan Ekstrakurikuler</h2>
          <p className="text-sm font-medium opacity-90 mt-1">{settings.namaSekolah} ({activeSemester} {settings.tahunPelajaran})</p>
        </div>
        <div className="overflow-x-auto" id="extra-table-content">
          <table id="extra-table-content-real" className="w-full text-xs border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-4 border border-slate-700">No</th>
                <th className="px-6 py-4 border border-slate-700 text-left">Nama Pembina / Petugas</th>
                <th className="px-4 py-4 border border-slate-700">Hari / Tanggal</th>
                <th className="px-4 py-4 border border-slate-700">Pukul</th>
                <th className="px-6 py-4 border border-slate-700 text-left">Ekstrakurikuler</th>
                <th className="px-4 py-4 border border-slate-700">Tempat</th>
                <th className="px-4 py-4 border border-slate-700 text-left">Supervisor</th>
                <th className="px-4 py-4 border border-slate-700 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {filteredData.length > 0 ? filteredData.map((d, i) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center font-bold border border-slate-100">{i + 1}</td>
                  <td className="px-6 py-4 border border-slate-100">
                    <div className="font-bold text-slate-800 leading-tight">{d.nama}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 opacity-75">NIP. {d.nip}</div>
                  </td>
                  <td className="px-4 py-4 text-center border border-slate-100">
                    <div className="font-bold text-blue-600 leading-tight">{d.hari}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{d.tgl}</div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700 border border-slate-100">{d.pukul}</td>
                  <td className="px-6 py-4 font-medium italic text-slate-700 border border-slate-100">{d.ekstra}</td>
                  <td className="px-4 py-4 text-center text-slate-600 border border-slate-100">{d.tempat}</td>
                  <td className="px-4 py-4 text-left font-bold text-slate-900 border border-slate-100">{d.supervisor}</td>
                  <td className="px-4 py-4 text-center no-print border border-slate-100">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => handleOpenModal(d)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400 italic font-medium">Belum ada jadwal untuk semester ini. Klik "Otomatis" untuk membuat jadwal default.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-12 p-10 flex justify-between items-start text-xs font-bold tracking-tight hidden print:flex">
            <div className="text-center w-64">
               <p className="mb-20 opacity-75">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
               <p className="underline">{settings.namaKepalaSekolah}</p>
               <p className="font-mono text-[10px] mt-1">NIP. {settings.nipKepalaSekolah}</p>
            </div>
            <div className="text-center w-64">
               <p className="mb-20 opacity-75">Mojokerto, .....................<br/>Supervisor / Petugas</p>
               <p className="underline">................................................</p>
               <p className="font-mono text-[10px] mt-1">NIP. ................................................</p>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col scale-in-center">
            <div className="px-6 py-5 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingId ? 'Edit Jadwal Ekstra' : 'Tambah Jadwal Ekstra'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Nama Pembina</label>
                  <select 
                    value={formData.nama} 
                    onChange={e => handleTeacherSelect(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold transition-all"
                  >
                    <option value="">-- Pilih Pembina --</option>
                    {teacherList.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">NIP (Otomatis)</label>
                  <input type="text" value={formData.nip} readOnly className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none text-xs font-mono text-slate-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Hari</label>
                  <select value={formData.hari} onChange={e => setFormData({...formData, hari: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold">
                    <option value="">Pilih Hari</option>
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'].map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Tanggal</label>
                  <input type="text" value={formData.tgl} onChange={e => setFormData({...formData, tgl: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs" placeholder="23 Oktober 2025" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Pukul</label>
                  <input type="text" value={formData.pukul} onChange={e => setFormData({...formData, pukul: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-black" placeholder="10.00 - 11.00" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Nama Ekstrakurikuler</label>
                  <input type="text" value={formData.ekstra} onChange={e => setFormData({...formData, ekstra: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs italic font-medium" placeholder="Contoh: Mading & Jurnalistik" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Tempat</label>
                  <input type="text" value={formData.tempat} onChange={e => setFormData({...formData, tempat: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs" placeholder="Ruang Kelas..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Supervisor</label>
                  <input type="text" value={formData.supervisor} onChange={e => setFormData({...formData, supervisor: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">Batal</button>
              <button onClick={handleSaveRecord} className="flex-1 py-3 bg-blue-600 rounded-2xl text-xs font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleExtraView;
