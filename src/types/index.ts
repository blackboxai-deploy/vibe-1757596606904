// Core type definitions for the data entry system

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'manager' | 'data-entry' | 'viewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    browser: boolean;
    importComplete: boolean;
    systemUpdates: boolean;
  };
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  settings: CompanySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySettings {
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    favicon?: string;
  };
  dataEntry: {
    autoSave: boolean;
    validationLevel: 'strict' | 'moderate' | 'flexible';
    allowBulkOperations: boolean;
    maxFileSize: number; // in MB
  };
  import: {
    allowedFormats: string[];
    maxRowsPerImport: number;
    requireApproval: boolean;
    autoProcessing: boolean;
  };
  security: {
    sessionTimeout: number; // in minutes
    requireTwoFactor: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
    };
  };
}

export interface DataEntry {
  id: string;
  companyId: string;
  userId: string;
  categoryId?: string;
  data: Record<string, any>;
  metadata: {
    source: 'manual' | 'import';
    importId?: string;
    version: number;
    tags: string[];
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface DataCategory {
  id: string;
  name: string;
  description?: string;
  schema: DataFieldSchema[];
  companyId: string;
  createdAt: Date;
}

export interface DataFieldSchema {
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'url' | 'select' | 'multiselect' | 'boolean' | 'file';
  required: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    options?: string[];
  };
  label: string;
  placeholder?: string;
  helpText?: string;
}

export interface ImportSession {
  id: string;
  userId: string;
  companyId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: 'uploading' | 'processing' | 'mapping' | 'importing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  errorCount: number;
  errors: ImportError[];
  mapping?: Record<string, string>;
  previewData?: any[];
  createdAt: Date;
  completedAt?: Date;
}

export interface ImportError {
  row: number;
  column?: string;
  message: string;
  severity: 'error' | 'warning';
  data?: any;
}

export interface AuditLog {
  id: string;
  userId: string;
  companyId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}

export interface DashboardStats {
  totalEntries: number;
  entriesThisMonth: number;
  pendingApprovals: number;
  recentImports: number;
  userActivity: {
    date: string;
    count: number;
  }[];
  topCategories: {
    name: string;
    count: number;
  }[];
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  borderRadius: number;
}

// Authentication types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}