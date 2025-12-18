
import React from 'react';
import { TeacherRecord, SupervisionStatus } from '../types';

interface DashboardProps {
  records: TeacherRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const total = records.length;
  const completed = records.filter(r => r.status === SupervisionStatus.COMPLETED).length;
  const pending = records.filter(r => r.status === SupervisionStatus.PENDING).length;
  const rescheduled = records.filter(r => r.status === SupervisionStatus.RESCHEDULED).length;

  const stats = [
    { label: 'Total Guru', value: total, color: 'bg-blue-500', textColor: 'text-blue-600' },
    { label: 'Terlaksana', value: completed, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { label: 'Belum Terlaksana', value: pending, color: 'bg-slate-400', textColor: 'text-slate-600' },
    { label: 'Dijadwal Ulang', value: rescheduled, color: 'bg-amber-500', textColor: 'text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center transition-all hover:shadow-md">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
          <span className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</span>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full ${stat.color}`} 
              style={{ width: `${(stat.value / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
