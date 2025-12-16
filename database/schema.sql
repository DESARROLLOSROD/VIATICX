-- ============================================
-- VIATICX - Esquema de Base de Datos (PostgreSQL)
-- MVP Version 1.0
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. EMPRESAS Y USUARIOS
-- ============================================

-- Tabla de empresas (multiempresa)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) UNIQUE,
    legal_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    plan_type VARCHAR(50) DEFAULT 'trial', -- trial, basic, premium, enterprise
    max_users INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    employee_number VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL, -- employee, admin, super_admin
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, email)
);

-- Índices para usuarios
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. CONFIGURACIÓN Y CATÁLOGOS
-- ============================================

-- Categorías de gastos
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(20), -- código contable
    max_amount DECIMAL(12, 2), -- límite opcional por categoría
    requires_approval BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);

CREATE INDEX idx_categories_company ON expense_categories(company_id);

-- Proyectos (centros de costo)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    budget DECIMAL(15, 2),
    start_date DATE,
    end_date DATE,
    manager_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, code)
);

CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_manager ON projects(manager_id);

-- Políticas de gasto
CREATE TABLE expense_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    max_daily_amount DECIMAL(12, 2),
    max_single_expense DECIMAL(12, 2),
    requires_receipt BOOLEAN DEFAULT true,
    auto_approve_under DECIMAL(12, 2), -- auto-aprobar gastos menores a X
    approval_levels INTEGER DEFAULT 1, -- niveles de aprobación requeridos
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. GASTOS Y VIÁTICOS
-- ============================================

-- Tabla principal de gastos
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id),
    project_id UUID REFERENCES projects(id),
    
    -- Datos del gasto
    expense_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'MXN',
    description TEXT NOT NULL,
    merchant_name VARCHAR(200), -- nombre del proveedor/comercio
    payment_method VARCHAR(50), -- efectivo, tarjeta, transferencia
    
    -- Datos fiscales
    invoice_folio VARCHAR(100), -- folio fiscal UUID del CFDI
    rfc_vendor VARCHAR(13),
    is_tax_deductible BOOLEAN DEFAULT false,
    
    -- Control de aprobación
    status VARCHAR(30) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    approval_notes TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_reason TEXT,
    
    -- Procesamiento
    exported BOOLEAN DEFAULT false,
    exported_at TIMESTAMP,
    exported_by UUID REFERENCES users(id),
    batch_number VARCHAR(50),
    
    -- OCR y evidencia
    has_receipt BOOLEAN DEFAULT false,
    ocr_processed BOOLEAN DEFAULT false,
    ocr_confidence DECIMAL(5, 2), -- 0-100
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_amount CHECK (amount > 0 AND amount < 999999999.99)
);

-- Índices para expenses
CREATE INDEX idx_expenses_company ON expenses(company_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_expenses_exported ON expenses(exported);

-- Archivos adjuntos (recibos/tickets)
CREATE TABLE expense_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER, -- bytes
    mime_type VARCHAR(100),
    file_type VARCHAR(20), -- receipt, invoice, other
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Datos OCR extraídos
    ocr_raw_text TEXT,
    ocr_amount DECIMAL(12, 2),
    ocr_date DATE,
    ocr_vendor VARCHAR(200),
    ocr_processed_at TIMESTAMP
);

CREATE INDEX idx_attachments_expense ON expense_attachments(expense_id);

-- ============================================
-- 4. FLUJO DE APROBACIONES
-- ============================================

-- Historial de aprobaciones
CREATE TABLE expense_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    level INTEGER DEFAULT 1, -- nivel de aprobación (1, 2, 3...)
    action VARCHAR(20) NOT NULL, -- approved, rejected, pending
    comments TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approvals_expense ON expense_approvals(expense_id);
CREATE INDEX idx_approvals_approver ON expense_approvals(approver_id);

-- Configuración de aprobadores por usuario
CREATE TABLE approval_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    level INTEGER DEFAULT 1,
    amount_threshold DECIMAL(12, 2), -- se aplica si el gasto supera este monto
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_routes_user ON approval_routes(user_id);
CREATE INDEX idx_routes_approver ON approval_routes(approver_id);

-- ============================================
-- 5. REPORTES Y EXPORTACIÓN
-- ============================================

-- Lotes de exportación
CREATE TABLE export_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    batch_number VARCHAR(50) NOT NULL UNIQUE,
    exported_by UUID NOT NULL REFERENCES users(id),
    export_format VARCHAR(20), -- excel, csv, pdf
    start_date DATE,
    end_date DATE,
    total_expenses INTEGER,
    total_amount DECIMAL(15, 2),
    file_path VARCHAR(500),
    exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_batches_company ON export_batches(company_id);
CREATE INDEX idx_batches_date ON export_batches(exported_at);

-- ============================================
-- 6. AUDITORÍA Y LOGS
-- ============================================

-- Logs de actividad
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(50), -- expense, user, company, etc.
    entity_id UUID,
    action VARCHAR(50), -- create, update, delete, approve, reject, export
    details JSONB, -- información adicional en formato JSON
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_company ON activity_logs(company_id);
CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_logs_date ON activity_logs(created_at);

-- ============================================
-- 7. SESIONES Y TOKENS
-- ============================================

-- Tokens de sesión (JWT refresh tokens)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT false
);

CREATE INDEX idx_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_tokens_expires ON refresh_tokens(expires_at);

-- ============================================
-- 8. TRIGGERS Y FUNCIONES
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas relevantes
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON expense_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. VISTAS ÚTILES
-- ============================================

-- Vista de gastos con información completa
CREATE VIEW v_expenses_full AS
SELECT 
    e.id,
    e.expense_date,
    e.amount,
    e.currency,
    e.description,
    e.status,
    e.merchant_name,
    e.payment_method,
    u.first_name || ' ' || u.last_name AS employee_name,
    u.email AS employee_email,
    u.department,
    c.name AS category_name,
    p.name AS project_name,
    p.code AS project_code,
    comp.name AS company_name,
    e.has_receipt,
    e.exported,
    e.created_at,
    approver.first_name || ' ' || approver.last_name AS approved_by_name,
    e.approved_at
FROM expenses e
JOIN users u ON e.user_id = u.id
JOIN companies comp ON e.company_id = comp.id
LEFT JOIN expense_categories c ON e.category_id = c.id
LEFT JOIN projects p ON e.project_id = p.id
LEFT JOIN users approver ON e.approved_by = approver.id;

-- Vista de resumen de gastos por usuario
CREATE VIEW v_expense_summary_by_user AS
SELECT 
    u.id AS user_id,
    u.first_name || ' ' || u.last_name AS employee_name,
    u.company_id,
    COUNT(e.id) AS total_expenses,
    SUM(CASE WHEN e.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
    SUM(CASE WHEN e.status = 'approved' THEN 1 ELSE 0 END) AS approved_count,
    SUM(CASE WHEN e.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_count,
    SUM(CASE WHEN e.status = 'approved' THEN e.amount ELSE 0 END) AS total_approved_amount,
    SUM(e.amount) AS total_amount
FROM users u
LEFT JOIN expenses e ON u.id = e.user_id
GROUP BY u.id, u.first_name, u.last_name, u.company_id;

-- ============================================
-- 10. DATOS DE EJEMPLO (SEED)
-- ============================================

-- Insertar empresa demo
INSERT INTO companies (id, name, rfc, legal_name, plan_type, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Empresa Demo SA de CV', 'EDE123456789', 'Empresa Demo Sociedad Anónima de Capital Variable', 'premium', 'active');

-- Insertar usuarios demo
INSERT INTO users (id, company_id, email, password_hash, first_name, last_name, role, status) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'admin@demo.com', '$2b$10$HASH_PLACEHOLDER', 'Admin', 'Demo', 'admin', 'active'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'empleado@demo.com', '$2b$10$HASH_PLACEHOLDER', 'Juan', 'Pérez', 'employee', 'active');

-- Insertar categorías demo
INSERT INTO expense_categories (company_id, name, description, code) VALUES
('11111111-1111-1111-1111-111111111111', 'Transporte', 'Gastos de transporte y traslados', 'TRA-001'),
('11111111-1111-1111-1111-111111111111', 'Alimentación', 'Comidas y alimentos', 'ALI-001'),
('11111111-1111-1111-1111-111111111111', 'Hospedaje', 'Hoteles y alojamiento', 'HOS-001'),
('11111111-1111-1111-1111-111111111111', 'Combustible', 'Gasolina y diesel', 'COM-001'),
('11111111-1111-1111-1111-111111111111', 'Material de oficina', 'Papelería y suministros', 'MAT-001');

-- ============================================
-- COMENTARIOS Y NOTAS
-- ============================================

COMMENT ON TABLE companies IS 'Empresas cliente del sistema multiempresa';
COMMENT ON TABLE users IS 'Usuarios del sistema con roles diferenciados';
COMMENT ON TABLE expenses IS 'Gastos y viáticos registrados por empleados';
COMMENT ON TABLE expense_categories IS 'Catálogo de categorías de gastos por empresa';
COMMENT ON TABLE projects IS 'Proyectos o centros de costo';
COMMENT ON TABLE expense_attachments IS 'Archivos adjuntos (recibos, facturas)';
COMMENT ON TABLE expense_approvals IS 'Historial de aprobaciones y rechazos';
COMMENT ON TABLE activity_logs IS 'Registro de auditoría de todas las acciones';

-- FIN DEL ESQUEMA
