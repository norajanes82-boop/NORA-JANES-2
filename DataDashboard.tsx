
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, TrendingUp, Hash, FileSpreadsheet } from 'lucide-react';
import { DataRow, DataSummary } from './types';

interface DataDashboardProps {
  data: DataRow[];
  summary: DataSummary | null;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DataDashboard: React.FC<DataDashboardProps> = ({ data, summary }) => {
  if (!summary) return null;

  const numericCols = Object.keys(summary.columnStats).filter(col => summary.columnStats[col].type === 'numeric');
  const stringCols = Object.keys(summary.columnStats).filter(col => summary.columnStats[col].type === 'string');
  const chartData = data.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Database size={18} />} label="Jumlah Baris" value={summary.rowCount} color="indigo" />
        <StatCard icon={<Hash size={18} />} label="Lajur Data" value={summary.columns.length} color="emerald" />
        <StatCard icon={<FileSpreadsheet size={18} />} label="Lajur Teks" value={stringCols.length} color="amber" />
        <StatCard icon={<TrendingUp size={18} />} label="Lajur Numerik" value={numericCols.length} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Visualisasi: {numericCols[0] || 'Data'}</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={stringCols[0] || summary.columns[0]} fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey={numericCols[0]} fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Ringkasan Taburan</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-left text-slate-400"><th>Lajur</th><th>Jenis</th><th>Unik</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {summary.columns.map(col => (
                  <tr key={col}><td className="py-2 font-medium">{col}</td><td>{summary.columnStats[col].type}</td><td>{summary.columnStats[col].uniqueValues}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-${color}-50 text-${color}-600`}>{icon}</div>
    <p className="text-xs text-slate-500 font-medium">{label}</p>
    <h3 className="text-xl font-bold text-slate-800">{value.toLocaleString()}</h3>
  </div>
);

export default DataDashboard;
