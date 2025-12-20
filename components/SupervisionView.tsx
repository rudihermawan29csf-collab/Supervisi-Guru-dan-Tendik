
import React, { useMemo } from 'react';
import { TeacherRecord, SupervisionStatus, AppSettings } from '../types';
import { FULL_SCHEDULE, SCHEDULE_TEACHERS } from '../constants';

interface SupervisionViewProps {
  records: TeacherRecord[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelect: (record: TeacherRecord) => void;
  onUpdateRecords: (records: TeacherRecord[]) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

const formatIndonesianDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const SupervisionView: React.FC<SupervisionViewProps> = ({ records, searchQuery, setSearchQuery, onSelect, onUpdateRecords, settings, setSettings }) => {
  const activeSemester = settings.semester;

  const filteredRecords = useMemo(() => {
    return records
      .filter(r => r.semester === activeSemester)
      .filter(record => 
        record.namaGuru.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (!a.tanggalPemb) return 1;
        if (!b.tanggalPemb) return -1;
        return new Date(a.tanggalPemb).getTime() - new Date(b.tanggalPemb).getTime();
      });
  }, [records, searchQuery, activeSemester]);

  const handleGenerateSchedule = () => {
    const range = activeSemester === 'Ganjil' ? settings.rangePembelajaranGuru : settings.rangePembelajaranGuruGenap;
    const startDate = new Date(range.from);
    const endDate = new Date(range.to);
    let currentDate = new Date(startDate);
    
    // We want to keep existing records but update their tanggalPemb
    const otherSemesterRecords = records.filter(r => r.semester !== activeSemester);
    const currentSemesterRecords = records.filter(r => r.semester === activeSemester);
    
    const generated: TeacherRecord[] = currentSemesterRecords.map((teacher, index) => {
      let foundSlot = false;
      let iterations = 0;
      const teacherInitials = SCHEDULE_TEACHERS.find(t => t.nama === teacher.namaGuru)?.kode || '';
      
      let targetDate = new Date(currentDate);

      while (targetDate <= endDate && !foundSlot && iterations < 31) {
        if (targetDate.getDay() !== 0) { // Bukan Minggu
          const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
          const dayNameStr = dayNames[targetDate.getDay()];
          const daySched = FULL_SCHEDULE.find(s => s.day.toUpperCase() === dayNameStr.toUpperCase());
          
          if (daySched) {
            for (const row of daySched.rows) {
              if (row.classes) {
                const teachingEntry = Object.entries(row.classes).find(([_, code]) => code.endsWith(teacherInitials));
                if (teachingEntry) {
                  const [className] = teachingEntry;
                  foundSlot = true;
                  const dateStr = targetDate.toISOString().split('T')[0];
                  // Move global currentDate forward for next teacher
                  currentDate = new Date(targetDate);
                  currentDate.setDate(currentDate.getDate() + 1);
                  
                  return { 
                    ...teacher, 
                    tanggalPemb: dateStr, 
                    hari: dayNameStr, 
                    kelas: className, 
                    jamKe: row.ke, 
                    status: SupervisionStatus.PENDING 
                  };
                }
              }
            }
          }
        }
        targetDate.setDate(targetDate.getDate() + 1);
        iterations++;
      }
      return { ...teacher, status: SupervisionStatus.PENDING };
    });

    onUpdateRecords([...otherSemesterRecords, ...generated]);
    alert(`Jadwal pembelajaran semester ${activeSemester} berhasil digenerate!`);
  };

  const exportExcel = () => {
    const tableElement = document.getElementById('supervision-table-real');
    if (!tableElement) return;
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>table { border-collapse: collapse; } th, td { border: 0.5pt solid windowtext; padding: 5px; }</style></head><body>`;
    const tableHtml = tableElement.outerHTML;
    const footer = `</body></html>`;
    const blob = new Blob([header + tableHtml + footer], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_Pembelajaran_${activeSemester}.xls`;
    link.click();
  };

  const exportWord = () => {
    const content = document.getElementById('supervision-export-content')?.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 5px; font-size: 10pt; } .text-center { text-align: center; } .font-bold { font-weight: bold; }</style></head><body>";
    const footer = "</body></html>";
    const blob = new Blob([header + content + footer], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_Pembelajaran_${activeSemester}.doc`;
    link.click();
  };

  const exportPDF = () => {
    const element = document.getElementById('supervision-export-content');
    const opt = { 
      margin: 10, 
      filename: `Jadwal_Pembelajaran_${activeSemester}.pdf`, 
      jsPDF: { orientation: 'landscape' } 
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const handleSave = () => {
    onUpdateRecords([...records]);
    alert('Data jadwal pembelajaran berhasil disimpan!');
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 no-print px-2">
        <div className="flex items-center gap-4">
           <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Jadwal Pembelajaran Guru</h2>
           <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Ganjil' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Genap' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Genap</button>
           </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[9px] uppercase shadow-md transition-all hover:bg-indigo-700">Simpan Perubahan</button>
          <button onClick={handleGenerateSchedule} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-[9px] uppercase shadow-md transition-all hover:bg-blue-700">Generate Jadwal</button>
          <div className="h-6 w-px bg-slate-300 mx-1"></div>
          <button onClick={exportPDF} className="px-3 py-2 bg-red-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-md transition-all hover:bg-red-700">PDF</button>
          <button onClick={exportWord} className="px-3 py-2 bg-blue-800 text-white rounded-lg font-bold text-[9px] uppercase shadow-md transition-all hover:bg-blue-900">Word</button>
          <button onClick={exportExcel} className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-bold text-[9px] uppercase shadow-md transition-all hover:bg-emerald-700">Excel (.xls)</button>
        </div>
      </div>

      <div id="supervision-export-content" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:p-0">
        <div className="p-8 text-center border-b-2 border-slate-900 mb-6 font-bold uppercase">
           <h1 className="text-xl">Jadwal Supervisi Pembelajaran Guru ({settings.semester})</h1>
           <h2 className="text-lg">{settings.namaSekolah}</h2>
           <p className="text-xs mt-1 opacity-75">Tahun Pelajaran {settings.tahunPelajaran}</p>
        </div>
        <div className="p-6">
          <table id="supervision-table-real" className="w-full text-left border-collapse border border-slate-800">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-center">
                <th className="px-4 py-4 text-[11px] font-bold border border-slate-800">No</th>
                <th className="px-6 py-4 text-[11px] font-bold border border-slate-800">Hari, Tanggal</th>
                <th className="px-6 py-4 text-[11px] font-bold border border-slate-800 text-left">Nama Guru</th>
                <th className="px-6 py-4 text-[11px] font-bold border border-slate-800 text-left">Mata Pelajaran</th>
                <th className="px-4 py-4 text-[11px] font-bold border border-slate-800">Kelas</th>
                <th className="px-4 py-4 text-[11px] font-bold border border-slate-800">Jam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredRecords.length > 0 ? filteredRecords.map((r, i) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-center border border-slate-800 font-bold">{i + 1}</td>
                  <td className="px-6 py-3 font-bold text-slate-700 border border-slate-800">{r.hari}, {formatIndonesianDate(r.tanggalPemb || '')}</td>
                  <td className="px-6 py-3 font-bold text-slate-900 border border-slate-800">{r.namaGuru}</td>
                  <td className="px-6 py-3 text-blue-700 italic border border-slate-800">{r.mataPelajaran}</td>
                  <td className="px-4 py-3 text-slate-700 border border-slate-800 text-center font-bold">{r.kelas || '-'}</td>
                  <td className="px-4 py-3 text-center border border-slate-800 font-bold text-slate-900">{r.jamKe || '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center py-10 italic text-slate-400 border border-slate-800 uppercase">Jadwal belum tersedia.</td></tr>
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
    </div>
  );
};

export default SupervisionView;
