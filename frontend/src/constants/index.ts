/**
 * Global constants for VIATICX Frontend
 */

// ============================================
// API Configuration
// ============================================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// ============================================
// Application Configuration
// ============================================

export const APP_CONFIG = {
  NAME: 'VIATICX',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
} as const;

// ============================================
// Pagination
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// ============================================
// File Upload
// ============================================

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],
} as const;

// ============================================
// Validation Rules
// ============================================

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999999.99,
  },
} as const;

// ============================================
// UI Constants
// ============================================

export const UI = {
  TOAST_DURATION: 4000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
} as const;

// ============================================
// Status Labels
// ============================================

export const EXPENSE_STATUS_LABELS = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
} as const;

export const EXPENSE_STATUS_COLORS = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  cancelled: 'default',
} as const;

export const USER_ROLE_LABELS = {
  employee: 'Empleado',
  admin: 'Administrador',
  super_admin: 'Super Administrador',
} as const;

// ============================================
// Routes
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  EXPENSES_NEW: '/expenses/new',
  EXPENSES_DETAIL: '/expenses/:id',
  EXPENSES_EDIT: '/expenses/:id/edit',
  APPROVALS: '/approvals',
  CATEGORIES: '/categories',
  PROJECTS: '/projects',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// ============================================
// Local Storage Keys
// ============================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// ============================================
// Query Keys (React Query)
// ============================================

export const QUERY_KEYS = {
  EXPENSES: 'expenses',
  EXPENSE: 'expense',
  EXPENSE_STATS: 'expense-stats',
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  PROJECTS: 'projects',
  PROJECT: 'project',
  USER: 'user',
  USERS: 'users',
  COMPANY: 'company',
} as const;

// ============================================
// Date Formats
// ============================================

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_LONG: 'dd MMMM yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  GENERIC: 'Ocurrió un error inesperado',
  NETWORK: 'Error de conexión. Verifica tu conexión a internet',
  UNAUTHORIZED: 'No autorizado. Por favor inicia sesión',
  FORBIDDEN: 'No tienes permisos para realizar esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION: 'Por favor verifica los datos ingresados',
  SERVER: 'Error del servidor. Intenta de nuevo más tarde',
} as const;
