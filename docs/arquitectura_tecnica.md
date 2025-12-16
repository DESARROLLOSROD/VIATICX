# VIATICX - Arquitectura Técnica Detallada
## MVP Version 1.0

---

## 1. Visión General de la Arquitectura

### 1.1 Patrón Arquitectónico
**Arquitectura de 3 capas (Three-Tier Architecture)**
- **Capa de Presentación**: React + Tailwind CSS
- **Capa de Lógica de Negocio**: Node.js + NestJS (API REST)
- **Capa de Datos**: PostgreSQL

### 1.2 Principios de Diseño
- **Separación de responsabilidades**: Cada capa tiene un propósito claro
- **Modularidad**: Módulos independientes y reutilizables
- **Escalabilidad horizontal**: Capacidad de agregar más instancias
- **Seguridad por capas**: Autenticación, autorización y validación en cada nivel
- **Stateless API**: Sin estado en el servidor para facilitar escalado

---

## 2. Arquitectura del Frontend

### 2.1 Stack Tecnológico
```
React 18.x
├── Tailwind CSS 3.x (Estilos)
├── React Router v6 (Navegación)
├── Axios (HTTP Client)
├── React Query / TanStack Query (Estado del servidor)
├── Zustand o Context API (Estado global)
├── React Hook Form (Formularios)
├── Zod (Validación)
├── date-fns (Manejo de fechas)
└── Recharts (Gráficas y reportes)
```

### 2.2 Estructura de Carpetas
```
src/
├── assets/              # Imágenes, iconos, archivos estáticos
├── components/          # Componentes reutilizables
│   ├── common/         # Botones, inputs, modales
│   ├── expense/        # Componentes específicos de gastos
│   ├── layout/         # Header, Sidebar, Footer
│   └── forms/          # Formularios complejos
├── pages/              # Vistas principales (rutas)
│   ├── auth/          # Login, registro
│   ├── dashboard/     # Dashboard principal
│   ├── expenses/      # Gestión de gastos
│   ├── reports/       # Reportes
│   └── admin/         # Panel de administración
├── hooks/              # Custom hooks
├── services/           # Llamadas a API
├── stores/             # Estado global (Zustand)
├── utils/              # Funciones auxiliares
├── types/              # TypeScript types/interfaces
├── config/             # Configuraciones
└── App.tsx             # Componente raíz
```

### 2.3 Componentes Clave

#### ExpenseForm
```typescript
interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  initialData?: Expense;
  mode: 'create' | 'edit';
}

// Características:
// - Captura de imagen con preview
// - OCR automático al subir imagen
// - Validación en tiempo real
// - Campos: fecha, monto, categoría, proyecto, descripción
```

#### ExpenseList
```typescript
// Tabla de gastos con:
// - Filtros por fecha, estado, categoría
// - Paginación
// - Acciones (ver, editar, eliminar)
// - Indicadores visuales de estado
```

#### ApprovalPanel
```typescript
// Panel de aprobaciones para administradores:
// - Lista de gastos pendientes
// - Vista previa de recibo
// - Botones aprobar/rechazar
// - Campo de comentarios
```

### 2.4 Rutas de la Aplicación

```typescript
// Public Routes
/login
/register
/forgot-password

// Protected Routes (Empleado)
/dashboard
/expenses
/expenses/new
/expenses/:id
/profile

// Protected Routes (Administrador)
/admin/dashboard
/admin/expenses/pending
/admin/reports
/admin/users
/admin/categories
/admin/projects
/admin/settings

// Protected Routes (Super Admin)
/super-admin/companies
/super-admin/billing
```

### 2.5 Gestión de Estado

#### Estado Global (Zustand)
```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}

// uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}
```

#### Estado del Servidor (React Query)
```typescript
// useExpenses.ts
const useExpenses = (filters: ExpenseFilters) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseService.getExpenses(filters)
  });
};

// useMutateExpense.ts
const useCreateExpense = () => {
  return useMutation({
    mutationFn: expenseService.createExpense,
    onSuccess: () => queryClient.invalidateQueries(['expenses'])
  });
};
```

---

## 3. Arquitectura del Backend

### 3.1 Stack Tecnológico
```
Node.js 20.x LTS
└── NestJS 10.x
    ├── TypeORM (ORM)
    ├── Passport + JWT (Autenticación)
    ├── class-validator (Validación)
    ├── class-transformer (Transformación)
    ├── multer (Upload de archivos)
    ├── tesseract.js (OCR)
    ├── ExcelJS (Exportación Excel)
    └── Winston (Logging)
```

### 3.2 Estructura de Módulos NestJS

```
src/
├── main.ts                      # Entry point
├── app.module.ts                # Módulo raíz
├── common/                      # Código compartido
│   ├── decorators/             # Custom decorators
│   ├── filters/                # Exception filters
│   ├── guards/                 # Auth guards
│   ├── interceptors/           # Interceptors
│   └── pipes/                  # Validation pipes
├── config/                      # Configuración
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
├── modules/
│   ├── auth/                   # Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   ├── users/                  # Gestión de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── user.entity.ts
│   │   └── dto/
│   ├── companies/              # Multiempresa
│   ├── expenses/               # Gastos (núcleo)
│   │   ├── expenses.controller.ts
│   │   ├── expenses.service.ts
│   │   ├── expense.entity.ts
│   │   ├── dto/
│   │   └── expenses.repository.ts
│   ├── categories/             # Categorías
│   ├── projects/               # Proyectos
│   ├── approvals/              # Aprobaciones
│   ├── reports/                # Reportes
│   ├── exports/                # Exportación
│   ├── attachments/            # Archivos
│   └── ocr/                    # Procesamiento OCR
└── database/
    ├── migrations/
    └── seeds/
```

### 3.3 Entidades TypeORM (Ejemplos)

#### Expense Entity
```typescript
@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  expenseDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'MXN' })
  currency: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  merchantName: string;

  @Column({ default: 'pending' })
  status: ExpenseStatus; // pending, approved, rejected

  @Column({ default: false })
  hasReceipt: boolean;

  @Column({ default: false })
  exported: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ExpenseAttachment, attachment => attachment.expense)
  attachments: ExpenseAttachment[];
}
```

### 3.4 DTOs (Data Transfer Objects)

```typescript
// create-expense.dto.ts
export class CreateExpenseDto {
  @IsDate()
  @Type(() => Date)
  expenseDate: Date;

  @IsNumber()
  @IsPositive()
  @Max(999999999.99)
  amount: number;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  merchantName?: string;
}
```

### 3.5 API Endpoints

```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

GET    /api/v1/expenses
POST   /api/v1/expenses
GET    /api/v1/expenses/:id
PUT    /api/v1/expenses/:id
DELETE /api/v1/expenses/:id
POST   /api/v1/expenses/:id/attachments
GET    /api/v1/expenses/:id/attachments/:attachmentId

POST   /api/v1/expenses/:id/approve
POST   /api/v1/expenses/:id/reject
GET    /api/v1/expenses/pending

GET    /api/v1/categories
POST   /api/v1/categories
PUT    /api/v1/categories/:id
DELETE /api/v1/categories/:id

GET    /api/v1/projects
POST   /api/v1/projects
PUT    /api/v1/projects/:id

GET    /api/v1/reports/summary
GET    /api/v1/reports/by-category
GET    /api/v1/reports/by-user
POST   /api/v1/reports/export

GET    /api/v1/users
POST   /api/v1/users
PUT    /api/v1/users/:id
GET    /api/v1/users/me

GET    /api/v1/companies
POST   /api/v1/companies (super admin)
PUT    /api/v1/companies/:id
```

### 3.6 Guards y Middleware

#### JWT Auth Guard
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Token inválido');
    }
    return user;
  }
}
```

#### Roles Guard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get('roles', context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.role === role);
  }
}
```

### 3.7 Servicios Clave

#### OCR Service
```typescript
@Injectable()
export class OcrService {
  async processReceipt(imageBuffer: Buffer): Promise<OcrResult> {
    // Utiliza Tesseract.js para extraer texto
    const result = await recognize(imageBuffer, 'spa+eng');
    
    return {
      text: result.text,
      amount: this.extractAmount(result.text),
      date: this.extractDate(result.text),
      vendor: this.extractVendor(result.text),
      confidence: result.confidence
    };
  }
}
```

#### Export Service
```typescript
@Injectable()
export class ExportService {
  async exportToExcel(expenses: Expense[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Gastos');
    
    worksheet.columns = [
      { header: 'Fecha', key: 'date' },
      { header: 'Empleado', key: 'employee' },
      { header: 'Categoría', key: 'category' },
      { header: 'Monto', key: 'amount' },
      { header: 'Descripción', key: 'description' }
    ];
    
    expenses.forEach(expense => {
      worksheet.addRow({
        date: expense.expenseDate,
        employee: expense.user.fullName,
        category: expense.category?.name,
        amount: expense.amount,
        description: expense.description
      });
    });
    
    return await workbook.xlsx.writeBuffer();
  }
}
```

---

## 4. Base de Datos

### 4.1 Diseño Normalizado
- **3NF (Tercera Forma Normal)** para evitar redundancia
- Uso de UUIDs como primary keys para seguridad
- Índices en campos de búsqueda frecuente
- Foreign keys con ON DELETE CASCADE donde aplica

### 4.2 Estrategia de Particionamiento (Futuro)
```sql
-- Cuando crezca la data, particionar expenses por fecha
CREATE TABLE expenses_2025_q1 PARTITION OF expenses
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
```

### 4.3 Respaldos
- **Backups automáticos diarios**: Full backup 2:00 AM
- **Point-in-time recovery**: WAL archiving habilitado
- **Retención**: 30 días de backups

---

## 5. Infraestructura y Despliegue

### 5.1 Arquitectura de Contenedores

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=https://api.viaticx.com
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/viaticx
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=viaticx
      - POSTGRES_USER=viaticx_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

### 5.2 Configuración de Nginx

```nginx
upstream backend {
    server backend:3001;
}

upstream frontend {
    server frontend:80;
}

server {
    listen 80;
    server_name viaticx.com www.viaticx.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name viaticx.com www.viaticx.com;

    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }
}
```

### 5.3 Variables de Entorno

```bash
# Backend (.env)
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@db:5432/viaticx
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
ALLOWED_ORIGINS=https://viaticx.com,https://www.viaticx.com
AWS_S3_BUCKET=viaticx-receipts (futuro)
MAX_FILE_SIZE=10485760 # 10MB

# Frontend (.env)
REACT_APP_API_URL=https://api.viaticx.com
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

### 5.4 Cloudflare Setup
- **DNS**: Proxied through Cloudflare
- **SSL**: Full (strict)
- **Cache**: Cache static assets, bypass API
- **DDoS Protection**: Activado
- **Rate Limiting**: 100 requests/min por IP en endpoints sensibles

---

## 6. Seguridad

### 6.1 Autenticación y Autorización

#### JWT Token Flow
```
1. Login → Backend valida credenciales
2. Backend genera Access Token (15 min) + Refresh Token (7 días)
3. Frontend guarda tokens en httpOnly cookies
4. Cada request incluye Access Token en header
5. Al expirar Access Token, usar Refresh Token para renovar
```

#### Estructura del JWT Payload
```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;
  role: string;       // employee, admin, super_admin
  companyId: string;
  iat: number;
  exp: number;
}
```

### 6.2 RBAC (Role-Based Access Control)

```typescript
enum Role {
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Permisos por rol
const permissions = {
  employee: [
    'expense:create',
    'expense:read:own',
    'expense:update:own',
    'expense:delete:own'
  ],
  admin: [
    ...permissions.employee,
    'expense:read:all',
    'expense:approve',
    'expense:reject',
    'user:read',
    'user:create',
    'report:read'
  ],
  super_admin: [
    ...permissions.admin,
    'company:create',
    'company:update',
    'company:delete',
    'user:delete'
  ]
};
```

### 6.3 Validación de Entrada

```typescript
// Todas las entradas pasan por:
1. class-validator (DTO validation)
2. Sanitización de strings (XSS prevention)
3. Whitelist de campos permitidos
4. Rate limiting por endpoint
```

### 6.4 Seguridad de Archivos

```typescript
// Validación de uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Renombrar archivos con UUID
const filename = `${uuid()}.${extension}`;

// Escaneo de virus (futuro)
// await clamav.scanFile(file);
```

### 6.5 Protección contra Ataques Comunes

- **SQL Injection**: TypeORM prepared statements
- **XSS**: Sanitización de inputs, Content Security Policy
- **CSRF**: SameSite cookies, CSRF tokens
- **Rate Limiting**: 100 req/min por IP
- **Brute Force**: Bloqueo tras 5 intentos fallidos (15 min)

---

## 7. Rendimiento y Escalabilidad

### 7.1 Estrategias de Caching

```typescript
// Redis Cache Strategy
@Injectable()
export class CacheService {
  // Cache de categorías (cambian poco)
  async getCategories(companyId: string) {
    const cacheKey = `categories:${companyId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) return JSON.parse(cached);
    
    const categories = await this.db.categories.find({ companyId });
    await redis.setex(cacheKey, 3600, JSON.stringify(categories));
    
    return categories;
  }
}
```

### 7.2 Optimización de Queries

```typescript
// Eager loading para evitar N+1
const expenses = await this.expenseRepository.find({
  relations: ['user', 'category', 'project', 'attachments'],
  where: { companyId },
  order: { expenseDate: 'DESC' },
  take: 50
});

// Índices en columnas de búsqueda frecuente
@Index(['companyId', 'status'])
@Index(['userId', 'expenseDate'])
```

### 7.3 Paginación

```typescript
// Cursor-based pagination
interface PaginationDto {
  limit: number;
  cursor?: string; // último ID visto
}

async getExpenses(pagination: PaginationDto) {
  const query = this.expenseRepository
    .createQueryBuilder('expense')
    .where('expense.id > :cursor', { cursor: pagination.cursor || '0' })
    .orderBy('expense.id', 'ASC')
    .take(pagination.limit + 1);
    
  const expenses = await query.getMany();
  const hasMore = expenses.length > pagination.limit;
  
  return {
    data: expenses.slice(0, pagination.limit),
    cursor: expenses[expenses.length - 1]?.id,
    hasMore
  };
}
```

### 7.4 Compresión y CDN

```typescript
// Gzip en responses
app.use(compression());

// Imágenes optimizadas
// - Resize automático a max 1920x1080
// - Conversión a WebP
// - Servir desde CDN (futuro)
```

---

## 8. Monitoreo y Logging

### 8.1 Logging con Winston

```typescript
// logger.service.ts
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Logs estructurados
logger.info('Expense created', {
  userId: user.id,
  expenseId: expense.id,
  amount: expense.amount,
  timestamp: new Date()
});
```

### 8.2 Métricas Clave

```typescript
// Prometheus metrics (futuro)
- Requests por segundo
- Tiempo de respuesta por endpoint
- Rate de errores
- Gastos creados/aprobados por día
- Usuarios activos
```

### 8.3 Health Checks

```typescript
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    const dbHealth = await this.checkDatabase();
    const redisHealth = await this.checkRedis();
    
    return {
      status: 'ok',
      timestamp: new Date(),
      database: dbHealth,
      redis: redisHealth,
      uptime: process.uptime()
    };
  }
}
```

---

## 9. Testing Strategy

### 9.1 Niveles de Testing

```
1. Unit Tests (Jest)
   - Servicios
   - Utilidades
   - Helpers

2. Integration Tests
   - Controllers + Services
   - Database operations
   - API endpoints

3. E2E Tests (Playwright/Cypress)
   - Flujos críticos de usuario
   - Creación de gasto
   - Aprobación
   - Exportación
```

### 9.2 Ejemplo de Test

```typescript
describe('ExpenseService', () => {
  it('should create expense with attachment', async () => {
    const dto: CreateExpenseDto = {
      expenseDate: new Date(),
      amount: 500,
      description: 'Comida de cliente',
      categoryId: 'cat-123'
    };
    
    const result = await service.create(dto, mockUser, mockFile);
    
    expect(result.id).toBeDefined();
    expect(result.hasReceipt).toBe(true);
    expect(result.attachments).toHaveLength(1);
  });
});
```

---

## 10. Plan de Implementación del MVP

### Fase 1: Setup Inicial (Semana 1)
- ✓ Configurar repositorio Git
- ✓ Setup Docker y docker-compose
- ✓ Crear esquema de base de datos
- ✓ Configurar NestJS con módulos básicos
- ✓ Setup React + Tailwind

### Fase 2: Autenticación y Usuarios (Semana 1-2)
- Implementar JWT auth
- CRUD de usuarios
- Sistema de roles
- Login/Register UI

### Fase 3: Gestión de Gastos (Semana 2-3)
- CRUD de gastos
- Upload de imágenes
- OCR básico
- Formulario de gasto
- Lista de gastos

### Fase 4: Aprobaciones (Semana 3)
- Flujo de aprobación
- Notificaciones
- Panel de aprobaciones
- Historial

### Fase 5: Reportes y Exportación (Semana 4)
- Reportes básicos
- Exportación Excel/CSV
- Dashboard con métricas

### Fase 6: Testing y Deploy (Semana 4)
- Tests unitarios críticos
- Tests E2E de flujos principales
- Deploy en VPS
- Configurar Cloudflare
- Monitoreo básico

---

## 11. Mejoras Post-MVP (No Incluidas)

### Prioridad Alta
1. **App móvil nativa** (React Native)
2. **Integración bancaria** (Sincronización automática)
3. **WhatsApp bot** para captura rápida
4. **IA antifraude** (detección de duplicados, anomalías)

### Prioridad Media
5. **Timbrado CFDI automático**
6. **Integración con Aspel/Contpaqi**
7. **Dashboard financiero avanzado**
8. **Flujos de aprobación multi-nivel**

### Prioridad Baja
9. **Reportes predictivos con ML**
10. **Geolocalización de gastos**
11. **Reconocimiento de facturas XML**

---

## 12. Estimación de Costos Operacionales (Mensual)

```
VPS (4GB RAM, 2 vCPU): $20-40 USD
PostgreSQL storage (20GB): $5 USD
Cloudflare Pro: $20 USD
Dominio: $1 USD
Backups: $10 USD
Total: ~$60-80 USD/mes

(Para primeros 100 usuarios)
```

---

## 13. Conclusiones y Recomendaciones

### Fortalezas de la Arquitectura
✓ **Escalable**: Fácil agregar más instancias
✓ **Mantenible**: Código modular y bien organizado
✓ **Segura**: Múltiples capas de seguridad
✓ **Moderna**: Stack actualizado y bien soportado

### Riesgos Técnicos
⚠ **OCR accuracy**: Calidad de extracción depende de la imagen
⚠ **Escalado de storage**: Muchas imágenes = mayor costo
⚠ **Complejidad de multiempresa**: Aislamiento de datos crítico

### Recomendaciones Finales
1. **Empezar simple**: MVP mínimo, iterar rápido
2. **Monitorear desde día 1**: Logs y métricas tempranas
3. **Automatizar testing**: CI/CD desde el inicio
4. **Documentar decisiones**: ADRs (Architecture Decision Records)
5. **Feedback temprano**: Beta testers desde semana 2

---

**Versión**: 1.0  
**Fecha**: Diciembre 2024  
**Autor**: Arquitectura VIATICX
