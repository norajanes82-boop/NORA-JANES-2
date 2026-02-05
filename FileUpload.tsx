
import React, { useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { parseFile, createDataSummary } from './dataProcessor';
import { DataRow, DataSummary } from './types';

interface FileUploadProps {
  onDataLoaded: (data: DataRow[], summary: DataSummary) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await parseFile(file);
      const summary = createDataSummary(data, file.name);
      setFileInfo({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });
      onDataLoaded(data, summary);
    } catch (err) {
      setError('Gagal memproses fail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!fileInfo ? (
        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-white hover:border-indigo-400 transition-all flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center"><Upload size={24} /></div>
          <div className="text-center">
            <h3 className="font-semibold text-slate-800">Muat Naik Fail Baru</h3>
            <p className="text-sm text-slate-500">Klik untuk pilih fail CSV atau Excel</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} accept=".csv, .xlsx" className="hidden" />
          {loading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse text-indigo-600 font-bold">Memuatkan...</div>}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
            <div><h4 className="font-bold text-slate-800">{fileInfo.name}</h4><p className="text-xs text-slate-500">{fileInfo.size} dimuat naik</p></div>
          </div>
          <button onClick={() => setFileInfo(null)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
        </div>
      )}
      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2"><AlertCircle size={16} />{error}</div>}
    </div>
  );
};

export default FileUpload;
