
import React from 'react';
import { AppSettings } from '../types';

const GENAP_DATA = [
  { no: 1, nama: 'Rudi Hermawan, s.pd.i', nip: '19891029 202012 1 003', hari: 'Rabu', tgl: '21 Februari 2026', pukul: '08.00 - 09.00', kegiatan: 'Administrasi Sekolah', tempat: 'Kantor Tata Usaha', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 2, nama: 'Wasta Indah Dwi Astuti, s.pd.', nip: '-', hari: 'Rabu', tgl: '21 Februari 2026', pukul: '10.30 - 11.30', kegiatan: 'Administrasi Ketenagaan', tempat: 'Kantor Tata Usaha', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 3, nama: 'Dra. Sri Hayati', nip: '19670628 200801 2 006', hari: 'Kamis', tgl: '22 Februari 2026', pukul: '08.00 - 10.00', kegiatan: 'Administrasi Perlengkapan / sarpras', tempat: 'Ruang Guru', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 4, nama: 'Akhmad Hariadi, s.pd', nip: '19751108 200901 1 001', hari: 'Jumat\'', tgl: '23 Februari 2026', pukul: '08.00 - 10.00', kegiatan: 'Administrasi Perpustakaan', tempat: 'Ruang Perpustakaan', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 5, nama: 'Dwi Kurniawan, s.pd.', nip: '19760319 200701 1 005', hari: 'Sabtu', tgl: '24 Februari 2026', pukul: '08.00 - 09.00', kegiatan: 'Laboratorium IPA', tempat: 'Ruang Lab. IPA', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 6, nama: 'Dwi Kurniawan, s.pd.', nip: '19760319 200701 1 005', hari: 'Sabtu', tgl: '24 Februari 2026', pukul: '10.30 - 11.30', kegiatan: 'Laboratorium Komputer', tempat: 'Ruang Lab. Komputer', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 7, nama: 'Moch. Husain Rifai Hamzah, s.pd.', nip: '19920316 202012 1 011', hari: 'Senin', tgl: '26 Februari 2026', pukul: '08.00 - 10.00', kegiatan: 'Administrasi Kesiswaan', tempat: 'Ruang OSIS', supervisor: 'Didik Sulistyo, M.M.Pd.' },
];

const GANJIL_DATA = [
  { no: 1, nama: 'Rudi Hermawan, s.pd.i', nip: '19891029 202012 1 003', hari: 'Jumat\'', tgl: '27 Oktober 2025', pukul: '07.30 - 08.30', kegiatan: 'Administrasi Sekolah', tempat: 'Kantor Tata Usaha', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 2, nama: 'Wasta Indah Dwi Astuti, s.pd.', nip: '-', hari: 'Jumat\'', tgl: '27 Oktober 2025', pukul: '08.30 - 09.30', kegiatan: 'Administrasi Kesiswaan', tempat: 'Ruang OSIS', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 3, nama: 'Dra. Sri Hayati', nip: '19670628 200801 2 006', hari: 'Sabtu', tgl: '28 Oktober 2025', pukul: '07.30 - 08.30', kegiatan: 'Administrasi Ketenagaan', tempat: 'Kantor Tata Usaha', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 4, nama: 'Akhmad Hariadi, s.pd', nip: '19751108 200901 1 001', hari: 'Sabtu', tgl: '28 Oktober 2025', pukul: '08.30 - 09.30', kegiatan: 'Administrasi Perlengkapan / sarpras', tempat: 'Ruang Guru', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 5, nama: 'Dwi Kurniawan, s.pd.', nip: '19760319 200701 1 005', hari: 'Sabtu', tgl: '28 Oktober 2025', pukul: '10.00 - 11.00', kegiatan: 'Laboratorium Komputer', tempat: 'Ruang Lab. Komputer', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 6, nama: 'Dwi Kurniawan, s.pd.', nip: '19760319 200701 1 005', hari: 'Senin', tgl: '30 Oktober 2025', pukul: '07.30 - 08.30', kegiatan: 'Administrasi Perpustakaan', tempat: 'Ruang Perpustakaan', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 7, nama: 'Moch. Husain Rifai Hamzah, s.pd.', nip: '19920316 202012 1 011', hari: 'Senin', tgl: '30 Oktober 2025', pukul: '08.30 - 09.30', kegiatan: 'Laboratorium IPA', tempat: 'Ruang Lab. IPA', supervisor: 'Didik Sulistyo, M.M.Pd.' },
];

const ScheduleAdminView: React.FC<{ settings: AppSettings, setSettings: (s: AppSettings) => void }> = ({ settings, setSettings }) => {
  const activeSemester = settings.semester;
  const activeData = activeSemester === 'Ganjil' ? GANJIL_DATA : GENAP_DATA;

  const exportExcel = () => {
    const tableElement = document.getElementById('tendik-table');
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
    const tableHtml = document.getElementById('tendik-table')?.outerHTML;
    const blob = new Blob(['\ufeff', `<h1>Jadwal Tendik ${activeSemester}</h1>` + tableHtml], { type: 'application/msword' });
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

  const handleSave = () => {
    alert('Perubahan jadwal tendik disimpan!');
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 no-print px-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Jadwal Supervisi Tendik</h2>
          <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner mt-2 inline-flex">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Ganjil' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeSemester === 'Genap' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-indigo-700">Simpan Perubahan</button>
          <button onClick={exportPDF} className="px-3 py-2 bg-red-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-red-700">PDF</button>
          <button onClick={exportWord} className="px-3 py-2 bg-blue-800 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-blue-900">Word</button>
          <button onClick={exportExcel} className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-emerald-700">Excel (.xls)</button>
        </div>
      </div>

      <section id="tendik-export-content" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b bg-emerald-600 text-white text-center">
          <h2 className="text-xl font-bold">Jadwal Supervisi Administrasi Tendik</h2>
          <p className="text-xs font-medium opacity-90 mt-1">{settings.namaSekolah} ({activeSemester} {settings.tahunPelajaran})</p>
        </div>
        <div className="overflow-x-auto">
          <table id="tendik-table" className="w-full text-xs border border-slate-800 border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-4 border border-slate-700">No</th>
                <th className="px-6 py-4 border border-slate-700 text-left">Nama Pembina / Petugas</th>
                <th className="px-4 py-4 border border-slate-700">Hari / Tanggal</th>
                <th className="px-4 py-4 border border-slate-700">Pukul</th>
                <th className="px-6 py-4 border border-slate-700 text-left">Kegiatan</th>
                <th className="px-4 py-4 border border-slate-700">Tempat</th>
                <th className="px-4 py-4 border border-slate-700 text-left">Supervisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {activeData.map((d) => (
                <tr key={d.no} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-center font-bold border border-slate-100">{d.no}</td>
                  <td className="px-6 py-4 border border-slate-100">
                    <div className="font-bold text-slate-800">{d.nama}</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIP. {d.nip}</div>
                  </td>
                  <td className="px-4 py-4 text-center border border-slate-100">
                    <div className="font-bold text-emerald-600">{d.hari}</div>
                    <div className="text-[10px] text-slate-500">{d.tgl}</div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700 border border-slate-100">{d.pukul}</td>
                  <td className="px-6 py-4 font-medium italic text-slate-700 border border-slate-100">{d.kegiatan}</td>
                  <td className="px-4 py-4 text-center text-slate-600 border border-slate-100">{d.tempat}</td>
                  <td className="px-4 py-4 text-left font-bold text-slate-900 border border-slate-100">{d.supervisor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ScheduleAdminView;
