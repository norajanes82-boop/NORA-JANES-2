
import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { parseFile, createDataSummary } from '../utils/dataProcessor';
import { DataRow, DataSummary } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: DataRow[], summary: DataSummary) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setError('Format fail tidak disokong. Sila muat naik fail .csv atau .xlsx');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await parseFile(file);
      const summary = createDataSummary(data, file.name);
      setFileInfo({ 
        name: file.name, 
        size: (file.size / 1024).toFixed(1) + ' KB' 
      });
      onDataLoaded(data, summary);
    } catch (err) {
      setError('Gagal memproses fail. Sila pastikan fail tidak rosak.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const removeFile = () => {
    setFileInfo(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!fileInfo ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
            isDragging ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
          }`}>
            <Upload size={32} />
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-slate-800 text-lg">Muat Naik Data</h3>
            <p className="text-sm text-slate-500 mt-1">Seret dan lepas fail CSV atau Excel anda di sini</p>
          </div>

          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[11px] font-medium text-slate-600">
              <FileText size={12} /> CSV
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[11px] font-medium text-slate-600">
              <FileText size={12} /> XLSX
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          {loading && (
            <div className="absolute inset-0 bg-white/80 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm z-10">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm font-medium text-slate-700">Memproses data anda...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{fileInfo.name}</h4>
              <p className="text-xs text-slate-500">{fileInfo.size} • Berjaya dimuat naik</p>
            </div>
          </div>
          <button 
            onClick={removeFile}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
