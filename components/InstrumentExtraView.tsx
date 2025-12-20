
import React, { useState, useEffect, useMemo } from 'react';
import { AppSettings, InstrumentResult, ExtraRecord } from '../types';

const EXTRA_ITEMS = [
  { label: 'Pembuatan Program Kegiatan', type: 'bckt' },
  { label: 'Konsep Perencanaan dan pelaksanaan', type: 'bckt' },
  { label: 'Presensi kehadiran Siswa', type: 'bckt' },
  { label: 'Kemampuan menyampaikan materi', type: 'bckt' }
];

interface Props {
  settings: AppSettings;
  extraRecords: ExtraRecord[];
  instrumentResults: Record<string, InstrumentResult>;
  onSave: (key: string, data: InstrumentResult) => void;
}

const getAutoExtraText = (score: number) => {
  if (score >= 90) return "Pembinaan ekstra sangat inspiratif, siswa aktif berkompetisi.";
  if (score >= 80) return "Pembina konsisten melaksanakan program kerja dengan baik.";
  if (score >= 70) return "Administrasi kehadiran siswa perlu lebih disiplin lagi.";
  return "Perlu peninjauan ulang kurikulum ekstrakurikuler yang dijalankan.";
};

const InstrumentExtraView: React.FC<Props> = ({ settings, extraRecords, instrumentResults, onSave }) => {
  const activeSemester = settings.semester;
  const [selectedExtraId, setSelectedExtraId] = useState<number | ''>('');
  
  const selectedRecord = useMemo(() => 
    extraRecords.find(r => r.id === selectedExtraId && r.semester === activeSemester), 
    [selectedExtraId, extraRecords, activeSemester]
  );

  const storageKey = selectedExtraId ? `extra-${selectedExtraId}-${activeSemester}` : '';
  const [scores, setScores] = useState<Record<number, string>>({});

  useEffect(() => {
    if (storageKey && instrumentResults[storageKey]) {
      setScores(instrumentResults[storageKey].scores as any);
    }
  }, [storageKey, instrumentResults]);

  const calcScore = useMemo(() => {
    const vals = Object.values(scores).map(v => (v === 'B' ? 4 : v === 'C' ? 3 : v === 'K' ? 2 : 1));
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 4)) * 100);
  }, [scores]);

  const catatanOtomatis = useMemo(() => getAutoExtraText(calcScore), [calcScore]);

  const handleSave = () => {
    if (!storageKey) return alert('Pilih Pembina terlebih dahulu!');
    onSave(storageKey, { scores, remarks: {}, catatan: catatanOtomatis });
    alert(`Data disimpan!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-fadeIn max-w-5xl mx-auto mb-10">
      <div className="p-6 border-b bg-slate-50 flex justify-between items-center no-print mb-6">
        <select value={selectedExtraId} onChange={e => setSelectedExtraId(Number(e.target.value))} className="px-4 py-2 border rounded-xl font-bold text-blue-600">
            <option value="">-- Pilih Pembina --</option>
            {extraRecords.filter(r => r.semester === activeSemester).map(r => (
              <option key={r.id} value={r.id}>{r.nama} - {r.ekstra}</option>
            ))}
        </select>
        <button onClick={handleSave} disabled={!selectedExtraId} className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[9px] uppercase">Simpan</button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 text-[10px] font-bold uppercase border-b-2 border-slate-900 pb-4">
         <div className="space-y-1.5">
            <div className="flex"><span className="w-32">Nama Pembina</span><span>: {selectedRecord?.nama || '-'}</span></div>
            <div className="flex"><span className="w-32">NIP</span><span>: {selectedRecord?.nip || '-'}</span></div>
            <div className="flex"><span className="w-32">Ekstrakurikuler</span><span>: {selectedRecord?.ekstra || '-'}</span></div>
         </div>
         <div className="space-y-1.5">
            <div className="flex"><span className="w-32">Hari / Tanggal</span><span>: {selectedRecord?.hari ? `${selectedRecord.hari}, ${selectedRecord.tgl}` : '-'}</span></div>
            <div className="flex"><span className="w-32">Supervisor</span><span>: {selectedRecord?.supervisor || '-'}</span></div>
         </div>
      </div>

      <table className="w-full border-collapse border border-slate-800 text-[10px] mb-8">
        <thead>
          <tr className="bg-slate-50 uppercase">
            <th className="border border-slate-800 p-2">Aspek yang Diamati</th>
            <th className="border border-slate-800 p-2 w-40">Penilaian (B/C/K/T)</th>
          </tr>
        </thead>
        <tbody>
          {EXTRA_ITEMS.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-slate-800 p-2">{item.label}</td>
              <td className="border border-slate-800 p-2 text-center flex justify-center gap-2">
                {['B', 'C', 'K', 'T'].map(val => (
                  <label key={val} className="flex items-center gap-1">
                    <input type="radio" checked={scores[idx] === val} onChange={() => setScores(p => ({...p, [idx]: val}))} /> {val}
                  </label>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-slate-50 p-4 rounded-xl border mb-6 text-[11px] font-bold">
         CATATAN KHUSUS : <span className="font-normal italic lowercase">{catatanOtomatis}</span>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-20 text-[10px] uppercase font-bold text-center">
        <div className="space-y-16">
          <p>Mengetahui,<br/>Kepala {settings.namaSekolah}</p>
          <p className="underline">{settings.namaKepalaSekolah}</p>
        </div>
        <div className="space-y-16">
          <p>Mojokerto, {selectedRecord?.tgl || '........'}<br/>Pembina</p>
          <p className="underline">{selectedRecord?.nama || '................'}</p>
        </div>
      </div>
    </div>
  );
};

export default InstrumentExtraView;
