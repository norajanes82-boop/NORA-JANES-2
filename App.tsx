
import React, { useState, useEffect } from 'react';
import { Layout, LineChart, Table as TableIcon, ShieldCheck, Zap, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import FileUpload from './components/FileUpload';
import AIChatPanel from './components/AIChatPanel';
import DataDashboard from './components/DataDashboard';
import { DataRow, DataSummary } from './types';
import { createDataSummary } from './utils/dataProcessor';
import { DEFAULT_CSV_DATA } from './data/defaultData';

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual');

  // Load default data on mount
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
      console.error("Gagal memuatkan data lalai:", err);
    }
  }, []);

  const handleDataLoaded = (loadedData: DataRow[], loadedSummary: DataSummary) => {
    setData(loadedData);
    setSummary(loadedSummary);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Zap size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              Analytica
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <ShieldCheck size={14} className="text-emerald-500" /> Secure Data Processing
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Pusat Bantuan
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Analysis & View */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Section */}
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Dashboard Analisis Pintar
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                Sila tanya soalan spesifik kepada Analytica. AI kami mempunyai akses kepada KESEMUA baris data anda.
              </p>
            </div>

            {/* Upload Area */}
            <FileUpload onDataLoaded={handleDataLoaded} />

            {/* Conditional Content: Charts or Table */}
            {summary && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Tab Switcher */}
                <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit">
                  <button 
                    onClick={() => setActiveTab('visual')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === 'visual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <LineChart size={18} /> Visualisasi
                  </button>
                  <button 
                    onClick={() => setActiveTab('table')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <TableIcon size={18} /> Jadual Data
                  </button>
                </div>

                {/* Dashboard Render */}
                <DataDashboard data={data} summary={summary} />
              </div>
            )}
          </div>

          {/* Right Panel: AI Chat Agent */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24">
              <AIChatPanel summary={summary} fullData={data} />
              
              {/* Quick Info */}
              <div className="mt-6 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h5 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <Info size={16} className="text-indigo-600" /> Tips Analisis Penuh
                </h5>
                <ul className="space-y-3 text-xs text-slate-500 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    "Daerah mana yang mempunyai liputan terendah?"
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    "Senaraikan semua daerah bagi negeri Sabah dan jumlah penduduknya."
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    "Bandingkan kepadatan antara Gombak dan Petaling."
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; 2024 Analytica AI. Semua hak terpelihara. Dijana dengan Gemini 3 Pro.
          </p>
          <div className="flex gap-8 text-sm text-slate-400 font-medium">
            <a href="#" className="hover:text-slate-600 transition-colors">Privasi</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terma</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
