
export interface DataRow {
  [key: string]: any;
}

export interface DataSummary {
  fileName: string;
  columns: string[];
  rowCount: number;
  sampleRows: DataRow[];
  columnStats: {
    [column: string]: {
      type: 'numeric' | 'string' | 'date';
      min?: number;
      max?: number;
      mean?: number;
      uniqueValues?: number;
    };
  };
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface AnalysisState {
  data: DataRow[];
  summary: DataSummary | null;
  isLoading: boolean;
  error: string | null;
}
