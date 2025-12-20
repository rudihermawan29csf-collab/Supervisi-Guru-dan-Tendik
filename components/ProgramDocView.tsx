
import React from 'react';
import { AppSettings, TeacherRecord, AdminRecord, ExtraRecord } from '../types';

interface Props {
  type: 'akademik' | 'tendik' | 'extra';
  settings: AppSettings;
  records?: TeacherRecord[];
  adminRecords?: AdminRecord[];
  extraRecords?: ExtraRecord[];
}

const ProgramDocView: React.FC<Props> = ({ type, settings, records, adminRecords, extraRecords }) => {
  const exportPDF = () => {
    const element = document.getElementById('program-doc-export');
    // @ts-ignore
    html2pdf().from(element).save(`Program_Supervisi_${type}_${settings.semester}.pdf`);
  };

  const title = type === 'akademik' ? 'PROGRAM SUPERVISI AKADEMIK (GURU)' : 
                type === 'tendik' ? 'PROGRAM SUPERVISI TENAGA KEPENDIDIKAN' : 
                'PROGRAM SUPERVISI KEGIATAN EKSTRAKURIKULER';

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex justify-end no-print">
        <button onClick={exportPDF} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg flex items-center transition-all hover:bg-indigo-700">
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/></svg>
           Download Program (PDF)
        </button>
      </div>

      <div id="program-doc-export" className="bg-white shadow-xl border border-slate-300 p-16 max-w-5xl mx-auto text-gray-900 font-serif leading-relaxed">
        <div className="text-center mb-10 border-b-4 border-double border-slate-900 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-tight">{title}</h1>
          <h2 className="text-xl font-bold uppercase mt-1">{settings.namaSekolah}</h2>
          <p className="text-sm font-bold mt-1 italic">Tahun Pelajaran {settings.tahunPelajaran} • Semester {settings.semester}</p>
        </div>

        <section className="mb-8">
           <h3 className="font-bold border-b mb-2 uppercase text-sm tracking-widest">I. Pendahuluan</h3>
           <p className="text-[12px] text-justify">Program supervisi ini disusun sebagai acuan dalam pelaksanaan pemantauan, pembinaan, dan evaluasi kinerja guna meningkatkan kualitas layanan pendidikan di {settings.namaSekolah}. Fokus utama adalah pada standarisasi administrasi dan optimalisasi pelaksanaan tugas pokok masing-masing unit kerja.</p>
        </section>

        <section className="mb-8">
           <h3 className="font-bold border-b mb-2 uppercase text-sm tracking-widest">II. Dasar Hukum</h3>
           <ul className="text-[11px] list-decimal pl-5 space-y-1">
              <li>Permendiknas No. 13 Tahun 2007 tentang Standar Kepala Sekolah/Madrasah.</li>
              <li>Permendikbud No. 15 Tahun 2018 tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas Sekolah.</li>
              <li>Kurikulum Operasional Satuan Pendidikan (KOSP) {settings.namaSekolah}.</li>
           </ul>
        </section>

        <section className="mb-8">
           <h3 className="font-bold border-b mb-2 uppercase text-sm tracking-widest">III. Jadwal Pelaksanaan</h3>
           <table className="w-full border-collapse border border-slate-800 text-[10px]">
              <thead>
                 <tr className="bg-slate-50 uppercase">
                    <th className="border border-slate-800 p-2 w-10 text-center">No</th>
                    <th className="border border-slate-800 p-2 text-left">Nama / Bidang</th>
                    <th className="border border-slate-800 p-2 text-center">Hari / Tanggal</th>
                    <th className="border border-slate-800 p-2 text-center">Sasaran</th>
                 </tr>
              </thead>
              <tbody>
                 {type === 'akademik' && records?.filter(r => r.semester === settings.semester).map((r, i) => (
                    <tr key={r.id}>
                       <td className="border border-slate-800 p-2 text-center">{i+1}</td>
                       <td className="border border-slate-800 p-2 font-bold">{r.namaGuru}</td>
                       <td className="border border-slate-800 p-2 text-center">{r.hari || '-'}, {r.tanggalPemb || r.tanggalAdm || '-'}</td>
                       <td className="border border-slate-800 p-2 text-center">{r.mataPelajaran}</td>
                    </tr>
                 ))}
                 {type === 'tendik' && adminRecords?.filter(r => r.semester === settings.semester).map((r, i) => (
                    <tr key={r.id}>
                       <td className="border border-slate-800 p-2 text-center">{i+1}</td>
                       <td className="border border-slate-800 p-2 font-bold">{r.nama}</td>
                       <td className="border border-slate-800 p-2 text-center">{r.hari}, {r.tgl}</td>
                       <td className="border border-slate-800 p-2 text-center">{r.kegiatan}</td>
                    </tr>
                 ))}
                 {type === 'extra' && extraRecords?.filter(r => r.semester === settings.semester).map((r, i) => (
                    <tr key={r.id}>
                       <td className="border border-slate-800 p-2 text-center">{i+1}</td>
                       <td className="border border-slate-800 p-2 font-bold">{r.nama}</td>
                       <td className="border border-slate-800 p-2 text-center">{r.hari}, {r.tgl}</td>
                       <td className="border border-slate-800 p-2 text-center">{r.ekstra}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </section>

        <div className="mt-20 grid grid-cols-2 text-sm font-bold text-center leading-relaxed">
            <div>
               <p className="mb-24 uppercase">Menyetujui,<br/>Pengawas Sekolah</p>
               <p className="underline uppercase font-black">{settings.namaPengawas}</p>
               <p className="text-xs uppercase">NIP. {settings.nipPengawas}</p>
            </div>
            <div>
               <p className="mb-24">Mojokerto, ......................<br/>Kepala {settings.namaSekolah}</p>
               <p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p>
               <p className="text-xs uppercase">NIP. {settings.nipKepalaSekolah}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDocView;
