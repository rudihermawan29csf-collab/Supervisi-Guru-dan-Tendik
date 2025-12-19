
import React, { useState, useMemo } from 'react';
import { AppSettings, AdminRecord, TeacherRecord } from '../types';
import { DATA_PTT } from '../constants';

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  adminRecords: AdminRecord[];
  setAdminRecords: (recs: AdminRecord[]) => void;
  teacherRecords: TeacherRecord[];
}

const ScheduleAdminView: React.FC<Props> = ({ settings, setSettings, adminRecords, setAdminRecords, teacherRecords }) => {
  const activeSemester = settings.semester;
  const filteredData = useMemo(() => adminRecords.filter(r => r.semester === activeSemester), [adminRecords, activeSemester]);

  // Selection candidate names - prioritize Staff TU (PTT) but merge with existing default records (like PJOK teacher for Lab IPA)
  const candidateNames = useMemo(() => {
    // Start with PTT data
    const pttNames = DATA_PTT.map(r => ({ name: r.nama, nip: r.nip || '-' }));
    
    // Add teachers who are specifically referenced in the default admin schedule (like Lab managers)
    const teachersHoldingExtra = teacherRecords
      .filter(t => adminRecords.some(ar => ar.nama === t.namaGuru))
      .map(t => ({ name: t.namaGuru, nip: t.nip || '-' }));
    
    const combined = [...pttNames, ...teachersHoldingExtra];
    const uniqueMap = new Map();
    combined.forEach(item => {
      if (!uniqueMap.has(item.name)) {
        uniqueMap.set(item.name, item.nip);
      }
    });
    
    return Array.from(uniqueMap.entries()).map(([name, nip]) => ({ name, nip })).sort((a, b) => a.name.localeCompare(b.name));
  }, [teacherRecords, adminRecords]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<AdminRecord, 'id' | 'semester'>>({
    nama: '',
    nip: '',
    hari: '',
    tgl: '',
    pukul: '',
    kegiatan: '',
    tempat: '',
    supervisor: 'Didik Sulistyo, M.M.Pd.'
  });

  const handleOpenModal = (record?: AdminRecord) => {
    if (record) {
      setEditingId(record.id);
      setFormData({
        nama: record.nama,
        nip: record.nip,
        hari: record.hari,
        tgl: record.tgl,
        pukul: record.pukul,
        kegiatan: record.kegiatan,
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
        kegiatan: '',
        tempat: '',
        supervisor: 'Didik Sulistyo, M.M.Pd.'
      });
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const selected = candidateNames.find(c => c.name === name);
    setFormData({
      ...formData,
      nama: name,
      nip: selected ? selected.nip : '-'
    });
  };

  const handleSaveRecord = () => {
    if (editingId !== null) {
      setAdminRecords(adminRecords.map(r => r.id === editingId ? { ...formData, id: r.id, semester: r.semester } : r));
    } else {
      const nextId = adminRecords.length > 0 ? Math.max(...adminRecords.map(r => r.id)) + 1 : 1;
      setAdminRecords([...adminRecords, { ...formData, id: nextId, semester: activeSemester }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal tendik ini?')) {
      setAdminRecords(adminRecords.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const tableElement = document.getElementById('tendik-table-content-real');
    if (!tableElement) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid windowtext; padding: 5px; }</style></head><body>`;
    const tableHtml = tableElement.outerHTML;
    const footer = `</body></html>`;
    const blob = new Blob([header + tableHtml + footer], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_Tendik_${activeSemester}.xls`;
    link.click();
  };

  const exportWord = () => {
    const tableHtml = document.getElementById('tendik-table-content')?.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Jadwal Tendik</title><style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 5px; text-align: left; font-size: 10pt; }</style></head><body>";
    const footer = "</body></html>";
    const blob = new Blob([header + "<h1>Jadwal Supervisi Tendik " + activeSemester + "</h1>" + tableHtml + footer], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_Tendik_${activeSemester}.doc`;
    link.click();
  };

  const exportPDF = () => {
    const element = document.getElementById('tendik-export-content');
    const opt = {
      margin: 10,
      filename: `Jadwal_Tendik_${activeSemester}.pdf`,
      jsPDF: { orientation: 'landscape' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const handleFinalSave = () => {
    alert('Data supervisi tendik berhasil disimpan!');
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 no-print px-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Supervisi Tendik</h2>
          <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner mt-2 inline-flex">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Ganjil' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Genap' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-emerald-700">+ Tambah Jadwal</button>
          <button onClick={handleFinalSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-indigo-700">Simpan Data</button>
          <button onClick={exportPDF} className="px-3 py-2 bg-red-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-red-700">PDF</button>
          <button onClick={exportWord} className="px-3 py-2 bg-blue-800 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-blue-900">Word</button>
          <button onClick={exportExcel} className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-emerald-700">Excel (.xls)</button>
        </div>
      </div>

      <section id="tendik-export-content" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b bg-emerald-600 text-white text-center">
          <h2 className="text-xl font-bold">Jadwal Supervisi Administrasi Tendik</h2>
          <p className="text-sm font-medium opacity-90 mt-1">{settings.namaSekolah} ({activeSemester} {settings.tahunPelajaran})</p>
        </div>
        <div className="overflow-x-auto" id="tendik-table-content">
          <table id="tendik-table-content-real" className="w-full text-xs border border-slate-800 border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-4 border border-slate-700">No</th>
                <th className="px-6 py-4 border border-slate-700 text-left">Nama Pembina / Petugas</th>
                <th className="px-4 py-4 border border-slate-700">Hari / Tanggal</th>
                <th className="px-4 py-4 border border-slate-700">Pukul</th>
                <th className="px-6 py-4 border border-slate-700 text-left">Kegiatan</th>
                <th className="px-4 py-4 border border-slate-700">Tempat</th>
                <th className="px-4 py-4 border border-slate-700 text-left">Supervisor</th>
                <th className="px-4 py-4 border border-slate-700 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {filteredData.length > 0 ? filteredData.map((d, i) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-center font-bold border border-slate-100">{i + 1}</td>
                  <td className="px-6 py-4 border border-slate-100">
                    <div className="font-bold text-slate-800">{d.nama}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">NIP. {d.nip}</div>
                  </td>
                  <td className="px-4 py-4 text-center border border-slate-100">
                    <div className="font-bold text-emerald-600">{d.hari}</div>
                    <div className="text-[10px] text-slate-500">{d.tgl}</div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700 border border-slate-100">{d.pukul}</td>
                  <td className="px-6 py-4 font-medium italic text-slate-700 border border-slate-100">{d.kegiatan}</td>
                  <td className="px-4 py-4 text-center text-slate-600 border border-slate-100">{d.tempat}</td>
                  <td className="px-4 py-4 text-left font-bold text-slate-900 border border-slate-100">{d.supervisor}</td>
                  <td className="px-4 py-4 text-center no-print border border-slate-100">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => handleOpenModal(d)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400 italic">Belum ada jadwal tendik.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-5 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingId ? 'Edit Jadwal Tendik' : 'Tambah Jadwal Tendik'}</h3>
              <button onClick={() => setIsModalOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">NAMA PETUGAS</label>
                  <select 
                    value={formData.nama} 
                    onChange={e => handleNameChange(e.target.value)} 
                    className="w-full px-4 py-2 bg-slate-50 border rounded-xl outline-none text-xs font-bold transition-all focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Pilih Staf TU (PTT) --</option>
                    {candidateNames.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div><label className="block text-[10px] font-bold text-slate-400 mb-1">NIP</label><input type="text" value={formData.nip} readOnly className="w-full px-4 py-2 bg-slate-100 border rounded-xl outline-none text-xs text-slate-500 font-mono" /></div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 mb-1">HARI</label>
                   <select value={formData.hari} onChange={e => setFormData({...formData, hari: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs">
                     <option value="">Pilih Hari</option>{['Senin','Selasa','Rabu','Kamis',"Jum'at",'Sabtu'].map(h => <option key={h} value={h}>{h}</option>)}
                   </select>
                </div>
                <div><label className="block text-[10px] font-bold text-slate-400 mb-1">TANGGAL</label><input type="text" value={formData.tgl} onChange={e => setFormData({...formData, tgl: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs" placeholder="Contoh: 27 Oktober 2025" /></div>
                <div><label className="block text-[10px] font-bold text-slate-400 mb-1">PUKUL</label><input type="text" value={formData.pukul} onChange={e => setFormData({...formData, pukul: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs" placeholder="Contoh: 07.30 - 08.30" /></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-slate-400 mb-1">KEGIATAN</label><input type="text" value={formData.kegiatan} onChange={e => setFormData({...formData, kegiatan: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs italic" placeholder="Contoh: Administrasi Sekolah" /></div>
                <div><label className="block text-[10px] font-bold text-slate-400 mb-1">TEMPAT</label><input type="text" value={formData.tempat} onChange={e => setFormData({...formData, tempat: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs" placeholder="Contoh: Kantor TU" /></div>
                <div><label className="block text-[10px] font-bold text-slate-400 mb-1">SUPERVISOR</label><input type="text" value={formData.supervisor} onChange={e => setFormData({...formData, supervisor: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs font-bold" /></div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border rounded-2xl text-xs font-bold text-slate-600">Batal</button>
              <button onClick={handleSaveRecord} className="flex-1 py-3 bg-emerald-600 rounded-2xl text-xs font-bold text-white">Simpan Jadwal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAdminView;
