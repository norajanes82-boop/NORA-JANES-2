
import React, { useState, useEffect } from 'react';
import { LineChart, Table as TableIcon, ShieldCheck, Zap, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import FileUpload from './FileUpload';
import AIChatPanel from './AIChatPanel';
import DataDashboard from './DataDashboard';
import { DataRow, DataSummary } from './types';
import { createDataSummary } from './dataProcessor';
import { DEFAULT_CSV_DATA } from './data/defaultData';

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual');

  useEffect(() => {
    try {
      const workbook = XLSX.read(DEFAULT_CSV_DATA, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as DataRow[];
      const defaultSummary = createDataSummary(jsonData, "data_penduduk_malaysia.csv");
      setData(jsonData);
      setSummary(defaultSummary);
    } catch (err) {
      console.error("Gagal muat data default:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Zap size={18} /></div>
          <span className="text-xl font-bold text-indigo-600">Analytica</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <ShieldCheck size={14} className="text-emerald-500" /> Keselamatan Data Terjamin
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Analisis Pintar</h1>
            <p className="text-slate-500 mt-2 text-lg">AI Analytica kini mempunyai akses kepada KESEMUA baris data anda.</p>
          </div>

          <FileUpload onDataLoaded={(d, s) => { setData(d); setSummary(s); }} />

          {summary && (
            <div className="space-y-6">
              <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit">
                <button onClick={() => setActiveTab('visual')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'visual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Visualisasi</button>
                <button onClick={() => setActiveTab('table')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Jadual Data</button>
              </div>
              <DataDashboard data={data} summary={summary} />
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24">
            <AIChatPanel summary={summary} fullData={data} />
            <div className="mt-6 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h5 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><Info size={16} className="text-indigo-600" /> Cerapan Data Penuh</h5>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>• "Senaraikan 5 daerah paling padat di Malaysia."</li>
                <li>• "Berapakah jumlah penduduk IR bagi negeri Melaka?"</li>
                <li>• "Daerah mana yang mempunyai luas_perlu tertinggi?"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
