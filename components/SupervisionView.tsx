
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

const SupervisionView: React.FC<SupervisionViewProps> = ({ records, searchQuery, onUpdateRecords, settings }) => {
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
    if (!range || !range.from || !range.to) {
      alert("Harap atur rentang tanggal supervisi di menu 'Pengaturan' terlebih dahulu!");
      return;
    }

    const startDate = new Date(range.from);
    const endDate = new Date(range.to);
    let currentDate = new Date(startDate);
    
    const currentSemesterRecords = records.filter(r => r.semester === activeSemester);
    const otherSemesterRecords = records.filter(r => r.semester !== activeSemester);
    
    const generated: TeacherRecord[] = currentSemesterRecords.map((teacher) => {
      const teacherData = SCHEDULE_TEACHERS.find(t => t.nama === teacher.namaGuru);
      const teacherInitials = teacherData?.kode || '';
      
      let foundSlot = false;
      let safetyCounter = 0; // Prevent infinite loop if range is extremely weird

      while (!foundSlot && safetyCounter < 365) {
        // Jika sudah melewati endDate, putar balik ke startDate (Cycle mode)
        if (currentDate > endDate) {
          currentDate = new Date(startDate);
        }

        if (currentDate.getDay() !== 0) { // Bukan Minggu
          const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
          const dayNameStr = dayNames[currentDate.getDay()];
          const daySched = FULL_SCHEDULE.find(s => s.day.toUpperCase() === dayNameStr.toUpperCase());
          
          if (daySched) {
            for (const row of daySched.rows) {
              if (row.classes) {
                const teachingEntry = Object.entries(row.classes as Record<string, string>).find(([_, code]) => code === teacherInitials);
                if (teachingEntry) {
                  const [className] = teachingEntry;
                  foundSlot = true;
                  const dateStr = currentDate.toISOString().split('T')[0];
                  const res = { 
                    ...teacher, 
                    tanggalPemb: dateStr, 
                    hari: dayNameStr, 
                    kelas: className, 
                    jamKe: String(row.ke), 
                    status: SupervisionStatus.PENDING 
                  };
                  // Advance for the next teacher
                  currentDate.setDate(currentDate.getDate() + 1);
                  return res;
                }
              }
            }
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
        safetyCounter++;
      }
      return { ...teacher };
    });

    onUpdateRecords([...otherSemesterRecords, ...generated]);
    alert(`Jadwal semester ${activeSemester} berhasil disusun ulang secara otomatis!`);
  };

  const exportPDF = () => {
    const element = document.getElementById('supervision-export-content');
    // @ts-ignore
    html2pdf().from(element).save(`Jadwal_Supervisi_PBM_${activeSemester}.pdf`);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center no-print">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Jadwal Pelaksanaan Supervisi</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SMPN 3 PACET • {activeSemester}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerateSchedule} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all hover:bg-blue-700">Otomasi Jadwal</button>
          <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-all hover:bg-red-700">PDF</button>
        </div>
      </div>

      <div id="supervision-export-content" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-8 font-serif">
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
           <h1 className="text-xl font-black uppercase tracking-tight">Jadwal Pelaksanaan Supervisi Akademik (PBM)</h1>
           <h2 className="text-md font-bold uppercase">{settings.namaSekolah}</h2>
           <p className="text-[10px] font-bold mt-1 italic uppercase tracking-widest opacity-75">Tahun Pelajaran {settings.tahunPelajaran} • Semester {activeSemester}</p>
        </div>

        <table className="w-full text-left border-collapse border border-slate-800">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-center font-black">
              <th className="px-2 py-4 border border-slate-800 text-[11px] w-10">No</th>
              <th className="px-4 py-4 border border-slate-800 text-[11px] w-32">Hari</th>
              <th className="px-6 py-4 border border-slate-800 text-[11px] w-48">Tanggal</th>
              <th className="px-6 py-4 border border-slate-800 text-[11px] text-left">Nama Guru</th>
              <th className="px-6 py-4 border border-slate-800 text-[11px] text-left">Mata Pelajaran</th>
              <th className="px-4 py-4 border border-slate-800 text-[11px] w-24">Kelas</th>
              <th className="px-4 py-4 border border-slate-800 text-[11px] w-16">Jam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {filteredRecords.length > 0 ? filteredRecords.map((r, i) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-2 py-4 text-center border border-slate-800 font-bold text-slate-400">{i + 1}</td>
                <td className="px-4 py-4 text-center border border-slate-800 font-black text-slate-800 uppercase tracking-tighter">{r.hari || '-'}</td>
                <td className="px-6 py-4 text-center border border-slate-800 font-bold text-slate-700">{formatIndonesianDate(r.tanggalPemb || '')}</td>
                <td className="px-6 py-4 border border-slate-800 font-black text-slate-900 uppercase leading-none">{r.namaGuru}</td>
                <td className="px-6 py-4 border border-slate-800 italic text-blue-700 font-medium">{r.mataPelajaran}</td>
                <td className="px-4 py-4 text-center border border-slate-800 font-black text-slate-700">{r.kelas || '-'}</td>
                <td className="px-4 py-4 text-center border border-slate-800 font-bold text-slate-900">{r.jamKe || '-'}</td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="text-center py-20 italic text-slate-400 border border-slate-800 uppercase tracking-widest">Jadwal belum tersedia. Klik "Otomasi Jadwal" untuk mengisi data.</td></tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 flex justify-between items-start text-xs font-bold uppercase tracking-tight px-4">
          <div className="text-center w-64">
             <p className="mb-20 uppercase">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
             <p className="font-black underline">{settings.namaKepalaSekolah}</p>
             <p className="text-[10px] font-mono tracking-tighter">NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-center w-64">
             <p className="mb-20 uppercase">Mojokerto, .....................<br/>Supervisor / Petugas</p>
             <p className="underline font-black">................................................</p>
             <p className="text-[10px] font-mono tracking-tighter">NIP. ................................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisionView;
