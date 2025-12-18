/**
 * Global TypeScript type definitions for VIATICX Frontend
 */

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: string;
  department?: string;
  position?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'employee' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  companyName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ============================================
// Expense Types
// ============================================

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Expense {
  id: string;
  userId: string;
  companyId: string;
  categoryId?: string;
  projectId?: string;
  description: string;
  amount: number;
  expenseDate: string;
  status: ExpenseStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  expenseId: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface ExpenseFilters {
  status?: ExpenseStatus | '';
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
}

export interface ExpenseStats {
  totalExpenses: number;
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
}

export interface CreateExpenseData {
  categoryId?: string;
  projectId?: string;
  description: string;
  amount: number;
  expenseDate: string;
  notes?: string;
}

// ============================================
// Category & Project Types
// ============================================

export interface ExpenseCategory {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  code?: string;
  maxAmount?: number;
  requiresApproval: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  code?: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}

// ============================================
// Form & UI Types
// ============================================

export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline' | 'secondary';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// ============================================
// Utility Types
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string;

/**
 * Make certain properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make certain properties optional
 */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
