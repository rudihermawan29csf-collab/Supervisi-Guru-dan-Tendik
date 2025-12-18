
import React from 'react';
import { AppSettings } from '../types';

const GENAP_DATA = [
  { no: 1, nama: 'Dra. Sri Hayati', nip: '19670628 200801 2 006', hari: 'Rabu', tgl: '21 Februari 2026', pukul: '10.00 - 11.00', ekstra: 'Mading dan jurnalistik', tempat: 'R. Kelas IX A', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 2, nama: 'Eka Hariyati, s.pd.', nip: '-', hari: 'Rabu', tgl: '21 Februari 2026', pukul: '11.00 - 12.00', ekstra: 'Pembina PMR/UKS', tempat: 'R. Kelas IX B', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 3, nama: 'Moch. Husain Rifai Hamzah, s.pd.', nip: '19920316 202012 1 011', hari: 'Kamis', tgl: '22 Februari 2026', pukul: '11.00 - 12.30', ekstra: 'Pembina Futsal', tempat: 'R. Kelas VIII B', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 4, nama: 'Fery Agus Pujianto', nip: '-', hari: "Jum'at", tgl: '23 Februari 2026', pukul: '11.00 - 12.30', ekstra: 'Pembina Pramuka', tempat: 'R. Kelas VIII C', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 5, nama: 'Rudi Hermawan, s.pd.i', nip: '19891029 202012 1 003', hari: 'Sabtu', tgl: '24 Februari 2026', pukul: '11.00 - 12.30', ekstra: "Pembina Gemajuza/Baca Tulis Al Qur'an", tempat: 'Musholla', supervisor: 'Didik Sulistyo, M.M.Pd.' },
];

const GANJIL_DATA = [
  { no: 1, nama: 'Dra. Sri Hayati', nip: '19670628 200801 2 006', hari: 'Senin', tgl: '23 Oktober 2025', pukul: '10.00 - 11.00', ekstra: 'Mading dan jurnalistik', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 2, nama: 'Rudi Hermawan, s.pd.i', nip: '19891029 202012 1 003', hari: 'Selasa', tgl: '24 Oktober 2025', pukul: '11.00 - 12.30', ekstra: "Pembina Gemajuza/Baca Tulis Al Qur'an", tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 3, nama: 'Eka Hariyati, s.pd.', nip: '-', hari: 'Rabu', tgl: '25 Oktober 2025', pukul: '11.00 - 12.00', ekstra: 'Pembina PMR/UKS', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 4, nama: 'Fery Agus Pujianto', nip: '-', hari: 'Kamis', tgl: '26 Oktober 2025', pukul: '11.00 - 12.30', ekstra: 'Pembina Pramuka', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.' },
  { no: 5, nama: 'Moch. Husain Rifai Hamzah, s.pd.', nip: '19920316 202012 1 011', hari: 'Kamis', tgl: '26 Oktober 2025', pukul: '11.00 - 12.30', ekstra: 'Pembina Futsal', tempat: 'Ruang Kepala Sekolah', supervisor: 'Didik Sulistyo, M.M.Pd.' },
];

const ScheduleExtraView: React.FC<{ settings: AppSettings, setSettings: (s: AppSettings) => void }> = ({ settings, setSettings }) => {
  const activeSemester = settings.semester;
  const activeData = activeSemester === 'Ganjil' ? GANJIL_DATA : GENAP_DATA;

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

  const exportWord = () => {
    const tableHtml = document.getElementById('extra-table-content')?.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Jadwal Ekstra</title><style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 5px; text-align: left; font-size: 10pt; }</style></head><body>";
    const footer = "</body></html>";
    const blob = new Blob([header + "<h1>Jadwal Ekstrakurikuler " + activeSemester + "</h1>" + tableHtml + footer], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_Ekstra_${activeSemester}.doc`;
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

  const handleSave = () => {
    alert('Perubahan jadwal ekstra berhasil disimpan!');
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
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-indigo-700">Simpan Perubahan</button>
          <button onClick={exportPDF} className="px-3 py-2 bg-red-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-red-700">PDF</button>
          <button onClick={exportWord} className="px-3 py-2 bg-blue-800 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-blue-900">Word</button>
          <button onClick={exportExcel} className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] shadow-md transition-all hover:bg-emerald-700">Excel (.xls)</button>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {activeData.map((d) => (
                <tr key={d.no} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-center font-bold border border-slate-100">{d.no}</td>
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
                </tr>
              ))}
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
    </div>
  );
};

export default ScheduleExtraView;
