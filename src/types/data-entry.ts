export interface DataEntry {
  id: string;
  title: string;
  description?: string;
  data: Record<string, any>;
  categoryId?: string;
  tags: string[];
  status: DataEntryStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  companyId: string;
}

export type DataEntryStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export interface DataCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  fields: DataField[];
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataField {
  id: string;
  name: string;
  label: string;
  type: DataFieldType;
  required: boolean;
  defaultValue?: any;
  validation?: DataFieldValidation;
  options?: DataFieldOption[];
  description?: string;
  order: number;
}

export type DataFieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'url' 
  | 'date' 
  | 'datetime' 
  | 'select' 
  | 'multiselect' 
  | 'checkbox' 
  | 'radio' 
  | 'file' 
  | 'image';

export interface DataFieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customRules?: string[];
}

export interface DataFieldOption {
  value: string;
  label: string;
  color?: string;
}

export interface ImportSession {
  id: string;
  filename: string;
  fileType: ImportFileType;
  fileSize: number;
  status: ImportStatus;
  progress: number;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  errors: ImportError[];
  mapping?: Record<string, string>;
  preview?: any[];
  createdBy: string;
  companyId: string;
  createdAt: Date;
  completedAt?: Date;
}

export type ImportFileType = 'excel' | 'csv' | 'word' | 'json';
export type ImportStatus = 'uploading' | 'processing' | 'mapping' | 'importing' | 'completed' | 'failed' | 'cancelled';

export interface ImportError {
  row: number;
  column?: string;
  message: string;
  type: 'validation' | 'format' | 'required' | 'duplicate';
  severity: 'error' | 'warning';
}

export interface ImportMapping {
  sourceField: string;
  targetField: string;
  dataType: DataFieldType;
  transformation?: string;
}

export interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf' | 'json';
  fields: string[];
  filters?: Record<string, any>;
  dateRange?: {
    from: Date;
    to: Date;
  };
  includeHeaders: boolean;
  includeMetadata: boolean;
}

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  status?: DataEntryStatus;
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  createdBy?: string;
  customFilters?: Record<string, any>;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
}

export interface DataEntryResponse {
  data: DataEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: SearchFilters;
}

export interface BulkOperation {
  action: 'update' | 'delete' | 'export' | 'approve' | 'reject';
  entryIds: string[];
  data?: Record<string, any>;
  options?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  userEmail: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  companyId: string;
  createdAt: Date;
}