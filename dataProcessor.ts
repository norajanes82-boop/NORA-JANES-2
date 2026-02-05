
import * as XLSX from 'xlsx';
import { DataRow, DataSummary } from './types';

export const parseFile = async (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as DataRow[];
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};

export const createDataSummary = (data: DataRow[], fileName: string): DataSummary => {
  if (data.length === 0) throw new Error("Data kosong");

  const columns = Object.keys(data[0]);
  const rowCount = data.length;
  const sampleRows = data.slice(0, 3);
  const columnStats: DataSummary['columnStats'] = {};

  columns.forEach((col) => {
    const values = data.map(row => row[col]).filter(val => val !== undefined && val !== null);
    const isNumeric = values.every(val => !isNaN(Number(val)));

    if (isNumeric && values.length > 0) {
      const numValues = values.map(v => Number(v));
      columnStats[col] = {
        type: 'numeric',
        min: Math.min(...numValues),
        max: Math.max(...numValues),
        mean: numValues.reduce((a, b) => a + b, 0) / numValues.length,
        uniqueValues: new Set(values).size
      };
    } else {
      columnStats[col] = {
        type: 'string',
        uniqueValues: new Set(values).size
      };
    }
  });

  return { fileName, columns, rowCount, sampleRows, columnStats };
};
