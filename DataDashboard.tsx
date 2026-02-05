
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Database, TrendingUp, Users, Hash, FileSpreadsheet } from 'lucide-react';
import { DataRow, DataSummary } from '../types';

interface DataDashboardProps {
  data: DataRow[];
  summary: DataSummary | null;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DataDashboard: React.FC<DataDashboardProps> = ({ data, summary }) => {
  if (!summary) return null;

  // Simple logic to find best columns for charts
  // Fix: Use Object.keys to iterate and index into summary.columnStats to fix 'unknown' type error
  const numericCols = Object.keys(summary.columnStats)
    .filter((col) => summary.columnStats[col].type === 'numeric');
    
  // Fix: Use Object.keys to iterate and index into summary.columnStats to fix 'unknown' type error
  const stringCols = Object.keys(summary.columnStats)
    .filter((col) => summary.columnStats[col].type === 'string');

  const chartData = data.slice(0, 10); // Show first 10 for visual relevance

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Database size={20} />} 
          label="Jumlah Baris" 
          value={summary.rowCount.toLocaleString()} 
          color="indigo"
        />
        <StatCard 
          icon={<Hash size={20} />} 
          label="Lajur Data" 
          value={summary.columns.length} 
          color="emerald"
        />
        <StatCard 
          icon={<FileSpreadsheet size={20} />} 
          label="Lajur Teks" 
          value={stringCols.length} 
          color="amber"
        />
        <StatCard 
          icon={<TrendingUp size={20} />} 
          label="Lajur Numerik" 
          value={numericCols.length} 
          color="rose"
        />
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        {numericCols.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              Analisis Visual: {numericCols[0]}
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey={stringCols[0] || summary.columns[0]} 
                    fontSize={10} 
                    tick={{fill: '#64748b'}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    fontSize={10} 
                    tick={{fill: '#64748b'}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey={numericCols[0]} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pie Chart / Distribution */}
        {stringCols.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              Taburan: {stringCols[0]} (Top 5)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getTopOccurrences(data, stringCols[0])}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getTopOccurrences(data, stringCols[0]).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {getTopOccurrences(data, stringCols[0]).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[10px] text-slate-500 font-medium truncate max-w-[80px]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-800">Pratonton Data (10 Baris Pertama)</h4>
          <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
            Table View
          </span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                {summary.columns.map((col) => (
                  <th key={col} className="px-6 py-4">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice(0, 10).map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  {summary.columns.map((col) => (
                    <td key={col} className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {row[col]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
    </div>
  );
};

const getTopOccurrences = (data: DataRow[], col: string) => {
  const counts: { [key: string]: number } = {};
  data.forEach(row => {
    const val = String(row[col]);
    counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

export default DataDashboard;
