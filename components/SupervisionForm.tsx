
import React, { useState, useEffect, useMemo } from 'react';
import { TeacherRecord, SupervisionStatus } from '../types';
import { generateSupervisionFeedback } from '../services/geminiService';
import { FULL_SCHEDULE, SCHEDULE_TEACHERS } from '../constants';

interface SupervisionFormProps {
  record: TeacherRecord;
  onSave: (updatedRecord: TeacherRecord) => void;
  onClose: () => void;
}

const SupervisionForm: React.FC<SupervisionFormProps> = ({ record, onSave, onClose }) => {
  const [formData, setFormData] = useState<TeacherRecord>(record);
  const [loadingAI, setLoadingAI] = useState(false);

  // Helper to get teacher's identifying suffix (e.g., 'SH', 'AH')
  const teacherInitials = useMemo(() => {
    return SCHEDULE_TEACHERS.find(t => t.nama === record.namaGuru)?.kode || '';
  }, [record.namaGuru]);

  // Handle automatic day detection from date
  useEffect(() => {
    if (formData.tanggal) {
      const date = new Date(formData.tanggal);
      const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
      const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      
      setFormData(prev => ({ 
        ...prev, 
        hari: capitalizedDay
      }));
    }
  }, [formData.tanggal]);

  // Get available classes for this teacher on this day
  const availableClasses = useMemo(() => {
    if (!formData.hari) return [];
    const daySchedule = FULL_SCHEDULE.find(d => d.day.toUpperCase() === formData.hari.toUpperCase());
    if (!daySchedule) return [];

    const classesSet = new Set<string>();
    daySchedule.rows.forEach(row => {
      if (row.classes) {
        Object.entries(row.classes).forEach(([className, code]) => {
          if (code.endsWith(teacherInitials)) {
            classesSet.add(className);
          }
        });
      }
    });
    return Array.from(classesSet).sort();
  }, [formData.hari, teacherInitials]);

  const availablePeriods = useMemo(() => {
    if (!formData.hari || !formData.kelas) return [];
    const daySchedule = FULL_SCHEDULE.find(d => d.day.toUpperCase() === formData.hari.toUpperCase());
    if (!daySchedule) return [];

    return daySchedule.rows
      .filter(row => row.classes && row.classes[formData.kelas]?.endsWith(teacherInitials))
      .map(row => row.ke);
  }, [formData.hari, formData.kelas, teacherInitials]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'nilai' ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleGetAIFeedback = async () => {
    setLoadingAI(true);
    const feedback = await generateSupervisionFeedback(formData);
    setFormData(prev => ({ ...prev, feedbackAI: feedback }));
    setLoadingAI(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">Update Supervisi: {record.namaGuru}</h2>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1 self-start">ID: {teacherInitials}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Tanggal Observasi</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Hari (Otomatis)</label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-black italic">{formData.hari || '-'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Skor / Nilai (0-100)</label>
              <input type="number" name="nilai" min="0" max="100" value={formData.nilai || ''} onChange={handleChange} placeholder="0-100" className="w-full px-4 py-2 border border-blue-300 rounded-xl outline-none font-black text-blue-600 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Kelas</label>
              <select name="kelas" value={formData.kelas} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none">
                <option value="">Pilih</option>
                {availableClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Jam Ke-</label>
              <select name="jamKe" value={formData.jamKe} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none">
                <option value="">Pilih</option>
                {availablePeriods.map(p => <option key={p} value={p}>Ke-{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Status Pelaksanaan</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none font-bold">
              <option value={SupervisionStatus.PENDING}>Belum Terlaksana</option>
              <option value={SupervisionStatus.COMPLETED}>Terlaksana</option>
              <option value={SupervisionStatus.RESCHEDULED}>Dijadwal Ulang</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tighter">Catatan Supervisor</label>
            <textarea name="catatan" rows={3} value={formData.catatan} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none resize-none"></textarea>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-tighter">Saran Observasi AI (Gemini)</h3>
              <button type="button" onClick={handleGetAIFeedback} disabled={loadingAI} className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full uppercase font-black tracking-widest">{loadingAI ? 'Proses...' : 'Generate'}</button>
            </div>
            <p className="text-xs text-blue-700 italic">{formData.feedbackAI || 'Gunakan AI untuk mendapatkan saran poin observasi.'}</p>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-xl font-bold">Batal</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Simpan</button>
        </div>
      </div>
    </div>
  );
};

export default SupervisionForm;
