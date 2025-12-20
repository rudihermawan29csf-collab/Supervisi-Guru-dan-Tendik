
import React, { useMemo, useState, useEffect } from 'react';
import { TeacherRecord, SupervisionStatus, AppSettings } from '../types';

interface AdminSupervisionViewProps {
  records: TeacherRecord[];
  onUpdateRecords: (records: TeacherRecord[]) => void;
  settings: AppSettings;
  onSelect: (record: TeacherRecord) => void;
  setSettings: (settings: AppSettings) => void;
}

const formatIndonesianDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
};

const AdminSupervisionView: React.FC<AdminSupervisionViewProps> = ({ records, onUpdateRecords, settings, onSelect, setSettings }) => {
  const activeSemester = settings.semester;
  
  const [sup1, setSup1] = useState(settings.namaKepalaSekolah);
  const [sup2, setSup2] = useState(settings.supervisors?.[1] || '');
  const [assignedToSup1, setAssignedToSup1] = useState<number[]>([]);
  const [assignedToSup2, setAssignedToSup2] = useState<number[]>([]);
  const [tempat1, setTempat1] = useState('Ruang Kepala Sekolah');
  const [tempat2, setTempat2] = useState('Ruang Guru');

  useEffect(() => {
    setSup1(settings.namaKepalaSekolah);
  }, [settings.namaKepalaSekolah]);

  const teacherList = useMemo(() => {
    const names = Array.from(new Set(records.map(r => r.namaGuru))).sort();
    return names;
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .sort((a, b) => {
        if (!a.tanggalAdm) return 1;
        if (!b.tanggalAdm) return -1;
        return new Date(a.tanggalAdm).getTime() - new Date(b.tanggalAdm).getTime();
      });
  }, [records, activeSemester]);

  const toggleAssignment = (teacherId: number, supervisorNum: 1 | 2) => {
    if (supervisorNum === 1) {
      setAssignedToSup1(prev => prev.includes(teacherId) ? prev.filter(id => id !== teacherId) : [...prev, teacherId]);
      setAssignedToSup2(prev => prev.filter(id => id !== teacherId));
    } else {
      setAssignedToSup2(prev => prev.includes(teacherId) ? prev.filter(id => id !== teacherId) : [...prev, teacherId]);
      setAssignedToSup1(prev => prev.filter(id => id !== teacherId));
    }
  };

  const handleGenerateAdmin = () => {
    const range = activeSemester === 'Ganjil' ? settings.rangeAdmGuruGanjil : settings.rangeAdmGuruGenap;
    if (!range?.from) { alert('Tentukan rentang tanggal di Pengaturan!'); return; }
    const startDate = new Date(range.from);
    const endDate = new Date(range.to);
    let currentDate = new Date(startDate);
    
    const otherSemesterRecords = records.filter(r => r.semester !== activeSemester);
    const updated = records.filter(r => r.semester === activeSemester).map((teacher, index) => {
      if (currentDate.getDay() === 0) currentDate.setDate(currentDate.getDate() + 1); 
      if (currentDate > endDate) currentDate = new Date(startDate);
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const dayNameStr = dayNames[currentDate.getDay()];
      let supervisor = assignedToSup1.includes(teacher.id) ? sup1 : (assignedToSup2.includes(teacher.id) ? sup2 : sup1);
      let loc = assignedToSup1.includes(teacher.id) ? tempat1 : (assignedToSup2.includes(teacher.id) ? tempat2 : tempat1);
      
      const res = { 
        ...teacher, 
        no: index + 1, 
        tanggalAdm: currentDate.toISOString().split('T')[0], 
        hari: dayNameStr, 
        pukul: '08.00 - 09.30', 
        pewawancara: supervisor, 
        tempat: loc, 
        status: SupervisionStatus.PENDING 
      };
      currentDate.setDate(currentDate.getDate() + 1);
      return res;
    });
    onUpdateRecords([...otherSemesterRecords, ...updated]);
    setSettings({ ...settings, supervisors: [sup1, sup2] });
    alert('Jadwal Administrasi Guru berhasil diperbarui!');
  };

  const handleSaveAll = () => {
    onUpdateRecords([...records]);
    alert('Seluruh perubahan data administrasi berhasil disimpan!');
  };

  const exportPDF = () => {
    const element = document.getElementById('admin-supervision-export');
    const opt = { 
      margin: 10, 
      filename: `Jadwal_Adm_Guru_${activeSemester}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, y: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } 
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const exportExcel = () => {
    const tableElement = document.getElementById('admin-table-export');
    if (!tableElement) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid windowtext; padding: 5px; }</style></head><body>`;
    const tableHtml = tableElement.outerHTML;
    const footer = `</body></html>`;
    const blob = new Blob([header + tableHtml + footer], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_Adm_Guru_${activeSemester}.xls`;
    link.click();
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 no-print space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-bold text-slate-800">Konfigurasi Petugas Supervisi (Administrasi)</h2>
          <div className="flex gap-2">
            <button onClick={handleSaveAll} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-sm transition-all hover:bg-indigo-700">Simpan Perubahan</button>
            <button onClick={handleGenerateAdmin} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-sm transition-all hover:bg-blue-700">Generate Jadwal</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div>
              <label className="block text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-wider">Supervisor 1 (Otomatis)</label>
              <div className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm">{sup1}</div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-2 italic uppercase">Daftar Guru untuk S1:</label>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {records.filter(r => r.semester === activeSemester && !assignedToSup2.includes(r.id)).map(teacher => (
                  <label key={teacher.id} className={`flex items-center p-2 rounded-lg cursor-pointer transition-all border ${assignedToSup1.includes(teacher.id) ? 'bg-blue-100 border-blue-200' : 'hover:bg-white border-transparent hover:border-blue-100'}`}>
                    <input type="checkbox" checked={assignedToSup1.includes(teacher.id)} onChange={() => toggleAssignment(teacher.id, 1)} className="w-4 h-4 text-blue-600 rounded border-blue-300 focus:ring-blue-500" />
                    <span className="ml-3 text-[11px] font-medium text-slate-700">{teacher.namaGuru}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <div>
              <label className="block text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">Supervisor 2</label>
              <select value={sup2} onChange={e => setSup2(e.target.value)} className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-xl outline-none text-xs font-bold text-slate-700 transition-all focus:ring-2 focus:ring-emerald-500">
                <option value="">-- Pilih Supervisor 2 --</option>
                {teacherList.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-2 italic uppercase">Daftar Guru untuk S2:</label>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {records.filter(r => r.semester === activeSemester && !assignedToSup1.includes(r.id)).map(teacher => (
                  <label key={teacher.id} className={`flex items-center p-2 rounded-lg cursor-pointer transition-all border ${assignedToSup2.includes(teacher.id) ? 'bg-emerald-100 border-emerald-200' : 'hover:bg-white border-transparent hover:border-emerald-100'}`}>
                    <input type="checkbox" checked={assignedToSup2.includes(teacher.id)} onChange={() => toggleAssignment(teacher.id, 2)} className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500" />
                    <span className="ml-3 text-[11px] font-medium text-slate-700">{teacher.namaGuru}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <input type="text" value={tempat1} onChange={e => setTempat1(e.target.value)} placeholder="Tempat S1" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          <input type="text" value={tempat2} onChange={e => setTempat2(e.target.value)} placeholder="Tempat S2" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
        </div>
      </div>

      <div className="flex justify-end gap-2 no-print px-2">
        <button onClick={exportPDF} className="px-6 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-md flex items-center transition-all hover:bg-red-700">
           <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"/></svg>
           Download PDF
        </button>
        <button onClick={exportExcel} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase shadow-md flex items-center transition-all hover:bg-emerald-700">Excel (.xls)</button>
      </div>

      <div id="admin-supervision-export" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-10 print:p-0" style={{ margin: 0 }}>
        <div className="text-center border-b-2 border-slate-900 mb-6 pb-2">
           <h1 className="text-xl font-bold uppercase tracking-tight">Jadwal Supervisi Administrasi Guru ({settings.semester})</h1>
           <h2 className="text-lg font-bold uppercase">{settings.namaSekolah}</h2>
           <p className="text-xs font-bold mt-1 italic uppercase opacity-75">Tahun Pelajaran {settings.tahunPelajaran}</p>
        </div>
        <table id="admin-table-export" className="w-full text-left border-collapse table-auto border border-slate-800">
          <thead>
            <tr className="bg-slate-100 text-center uppercase">
              <th className="px-2 py-3 text-[11px] font-bold border border-slate-800">No</th>
              <th className="px-4 py-3 text-[11px] font-bold border border-slate-800">Hari, Tanggal</th>
              <th className="px-2 py-3 text-[11px] font-bold border border-slate-800">Pukul</th>
              <th className="px-4 py-3 text-[11px] font-bold border border-slate-800">Nama Guru</th>
              <th className="px-4 py-3 text-[11px] font-bold border border-slate-800">Mata Pelajaran</th>
              <th className="px-4 py-3 text-[11px] font-bold border border-slate-800">Pewawancara</th>
              <th className="px-4 py-3 text-[11px] font-bold border border-slate-800">Tempat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {filteredRecords.length > 0 ? filteredRecords.map((r, i) => (
              <tr key={r.id}>
                <td className="px-2 py-3 font-bold text-center border border-slate-800">{i + 1}</td>
                <td className="px-4 py-3 border border-slate-800 font-bold">{r.hari}, {formatIndonesianDate(r.tanggalAdm || '')}</td>
                <td className="px-2 py-3 text-center border border-slate-800 font-bold">{r.pukul || '-'}</td>
                <td className="px-4 py-3 border border-slate-800 font-bold text-slate-800" title={r.namaGuru}>
                   {toTitleCase(r.namaGuru)}
                </td>
                <td className="px-4 py-3 border border-slate-800 italic">{r.mataPelajaran}</td>
                <td className="px-4 py-3 border border-slate-800 font-bold">{r.pewawancara || '-'}</td>
                <td className="px-4 py-3 border border-slate-800">{r.tempat || '-'}</td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="text-center py-10 italic border border-slate-800 text-slate-400">Jadwal belum digenerate atau tidak tersedia untuk semester ini.</td></tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between items-start text-xs font-bold uppercase tracking-tight">
          <div className="text-center w-64">
             <p className="mb-20 uppercase opacity-75">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="underline font-black">{settings.namaKepalaSekolah}</p>
             <p className="font-mono text-[10px] mt-1 uppercase">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20 uppercase opacity-75">Mojokerto, .....................<br/>Supervisor / Petugas</p>
             <p className="underline font-black">................................................</p>
             <p className="font-mono text-[10px] mt-1 uppercase">NIP. ................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupervisionView;
