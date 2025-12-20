
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings, TeacherRecord, InstrumentResult } from '../types';

const QUESTIONS = [
  "Bagaimana pendapat Saudara setelah menyajikan pelajaran ini?",
  "Apakah proses pembelajaran sudah sesuai dengan yang direncanakan?",
  "Dapatkah Saudara menceritakan hal-hal yang dirasakan memuaskan dalam proses pembelajaran tadi?",
  "Bagaimana perkiraan Saudara mengenai ketercapaian tujuan pembelajaran?",
  "Apa yang menjadi kesulitan siswa?",
  "Apa yang menjadi kesulitan Saudara dalam menyajikan materi ini?",
  "Adakah alternatif lain untuk mengatasi kesulitan Saudara?",
  "Dengan demikian, apa yang akan Saudara lakukan untuk pertemuan berikutnya?"
];

interface Props {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  records: TeacherRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (teacherId: number, type: string, semester: string, data: InstrumentResult) => void;
}

const PostObservationView: React.FC<Props> = ({ settings, setSettings, records, instrumentResults, onSave }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [kesanUmum, setKesanUmum] = useState('');
  const [saran, setSaran] = useState('');

  const selectedTeacher = useMemo(() => records.find(t => t.id === selectedTeacherId), [selectedTeacherId, records]);

  useEffect(() => {
    if (selectedTeacherId !== '') {
      const key = `${selectedTeacherId}-post-observasi-${settings.semester}`;
      const saved = instrumentResults[key];
      if (saved) {
        setAnswers(saved.answers || {});
        setKesanUmum(saved.kesanUmum || '');
        setSaran(saved.saran || '');
      } else {
        setAnswers({});
        setKesanUmum('');
        setSaran('');
      }
    }
  }, [selectedTeacherId, settings.semester, instrumentResults]);

  const handleSave = () => {
    if (selectedTeacherId === '') return alert('Pilih guru terlebih dahulu');
    onSave(selectedTeacherId, 'post-observasi', settings.semester, {
      scores: {},
      remarks: {},
      answers,
      kesanUmum,
      saran
    });
    alert('Daftar pertanyaan post-observasi berhasil disimpan!');
  };

  const exportPDF = () => {
    const element = document.getElementById('post-obs-export');
    const opt = { margin: 10, filename: `PostObservasi_${selectedTeacher?.namaGuru || 'Guru'}_${settings.semester}.pdf`, jsPDF: { orientation: 'portrait' } };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const exportWord = () => {
    const html = document.getElementById('post-obs-export')?.innerHTML;
    const blob = new Blob(['\ufeff', html || ''], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `PostObservasi_${selectedTeacher?.namaGuru || 'Guru'}_${settings.semester}.doc`;
    link.click();
  };

  const exportExcel = () => {
    const html = document.getElementById('post-obs-export')?.innerHTML;
    const blob = new Blob(['\ufeff', html || ''], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `PostObservasi_${selectedTeacher?.namaGuru || 'Guru'}_${settings.semester}.xls`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <select 
            value={selectedTeacherId} 
            onChange={(e) => setSelectedTeacherId(Number(e.target.value))} 
            className="px-4 py-2 border rounded-xl font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Pilih Guru --</option>
            {records.map(t => <option key={t.id} value={t.id}>{t.namaGuru}</option>)}
          </select>
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setSettings({...settings, semester: 'Ganjil'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${settings.semester === 'Ganjil' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Ganjil</button>
             <button onClick={() => setSettings({...settings, semester: 'Genap'})} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${settings.semester === 'Genap' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Genap</button>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase shadow">PDF</button>
            <button onClick={exportWord} className="px-4 py-2 bg-blue-800 text-white rounded-lg font-black text-[9px] uppercase shadow">Word</button>
            <button onClick={exportExcel} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase shadow">Excel</button>
            <button onClick={handleSave} disabled={!selectedTeacher} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg ml-2">Simpan Jawaban</button>
        </div>
      </div>

      <div id="post-obs-export" className="bg-white shadow-xl border border-slate-300 p-12 max-w-5xl mx-auto text-gray-900 print:shadow-none print:border-none print:p-0 font-serif">
        <div className="text-center mb-8 border-b-2 border-slate-900 pb-2">
          <h1 className="text-xl font-black uppercase tracking-tight">Daftar Pertanyaan Setelah Observasi</h1>
          <p className="text-sm font-bold mt-1">Semester {settings.semester.toUpperCase()} • {settings.namaSekolah}</p>
        </div>

        <div className="mb-4 text-sm font-bold flex flex-col gap-1">
           <div className="flex"><span className="w-32">Nama Guru</span><span className="mr-2">:</span><span className="uppercase">{selectedTeacher?.namaGuru || '............................'}</span></div>
           <div className="flex"><span className="w-32">Mata Pelajaran</span><span className="mr-2">:</span><span className="uppercase">{selectedTeacher?.mataPelajaran || '............................'}</span></div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900 text-[11px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center">
              <th className="border-2 border-slate-900 p-2 w-10">No</th>
              <th className="border-2 border-slate-900 p-2 text-left">Pertanyaan</th>
              <th className="border-2 border-slate-900 p-2 text-left w-1/2">Jawaban</th>
            </tr>
          </thead>
          <tbody>
            {QUESTIONS.map((q, idx) => (
              <tr key={idx} className="hover:bg-slate-50 align-top">
                <td className="border-2 border-slate-900 p-2 text-center font-bold">{idx + 1}.</td>
                <td className="border-2 border-slate-900 p-2 font-medium">{q}</td>
                <td className="border-2 border-slate-900 p-1">
                  <textarea 
                    value={answers[idx] || ''} 
                    onChange={e => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                    className="w-full bg-transparent outline-none italic no-print min-h-[60px]" 
                    placeholder="..."
                  />
                  <div className="hidden print:block italic min-h-[40px] whitespace-pre-wrap">{answers[idx] || '........................................................................................................................'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 space-y-6">
          <div className="border-b border-slate-400 pb-1">
            <h3 className="text-sm font-bold uppercase tracking-tighter">Kesan Umum :</h3>
            <textarea 
              value={kesanUmum} 
              onChange={e => setKesanUmum(e.target.value)} 
              rows={3} 
              className="w-full bg-transparent outline-none text-sm italic py-1 no-print" 
              placeholder="..."
            ></textarea>
            <div className="hidden print:block text-sm italic min-h-[80px]">{kesanUmum || '................................................................................................................................'}</div>
          </div>

          <div className="border-b border-slate-400 pb-1">
            <h3 className="text-sm font-bold uppercase tracking-tighter">Saran :</h3>
            <textarea 
              value={saran} 
              onChange={e => setSaran(e.target.value)} 
              rows={3} 
              className="w-full bg-transparent outline-none text-sm italic py-1 no-print" 
              placeholder="..."
            ></textarea>
            <div className="hidden print:block text-sm italic min-h-[80px]">{saran || '................................................................................................................................'}</div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 text-sm font-bold tracking-tight text-center leading-relaxed">
            <div className="space-y-20">
               <p className="uppercase">Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
               <div>
                  <p className="underline uppercase font-black">{settings.namaKepalaSekolah}</p>
                  <p className="font-mono text-xs uppercase">NIP. {settings.nipKepalaSekolah}</p>
               </div>
            </div>
            <div className="space-y-20">
               <p className="">Mojokerto, ......................<br/>Supervisor,</p>
               <div>
                  <p className="border-b border-slate-900 mx-auto w-48 font-bold">............................................</p>
                  <p className="font-mono text-xs uppercase">NIP. ............................................</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostObservationView;
