# VIATICX - Historias de Usuario Técnicas
## MVP - Desglose Completo

---

## Módulo 1: Autenticación y Usuarios

### US-001: Registro de Usuario
**Como** nuevo usuario  
**Quiero** registrarme en la plataforma  
**Para** comenzar a gestionar gastos

**Criterios de Aceptación:**
- [ ] Formulario con: email, contraseña, nombre, apellido
- [ ] Validación de email único
- [ ] Password mínimo 8 caracteres (1 mayúscula, 1 número, 1 especial)
- [ ] Confirmación por email (futuro, no MVP)
- [ ] Asignación automática a empresa por dominio de email

**Tareas Técnicas:**
- [ ] Crear DTO de registro con validaciones
- [ ] Implementar servicio de hash de contraseñas (bcrypt)
- [ ] Endpoint POST /api/v1/auth/register
- [ ] Componente RegisterForm en React
- [ ] Validación frontend con react-hook-form + zod

**Estimación:** 8 horas  
**Prioridad:** Alta  
**Dependencias:** Base de datos configurada

---

### US-002: Login de Usuario
**Como** usuario registrado  
**Quiero** iniciar sesión  
**Para** acceder a mi cuenta

**Criterios de Aceptación:**
- [ ] Login con email y contraseña
- [ ] Generación de JWT token (15 min) + refresh token (7 días)
- [ ] Tokens guardados en httpOnly cookies
- [ ] Redirección a dashboard tras login exitoso
- [ ] Mensaje de error claro en credenciales incorrectas
- [ ] Bloqueo tras 5 intentos fallidos (15 min)

**Tareas Técnicas:**
- [ ] Implementar JwtStrategy en NestJS
- [ ] Crear AuthService con método validateUser
- [ ] Endpoint POST /api/v1/auth/login
- [ ] Endpoint POST /api/v1/auth/refresh
- [ ] LoginForm component
- [ ] AuthContext/Store en frontend
- [ ] Interceptor para agregar token a requests

**Estimación:** 10 horas  
**Prioridad:** Alta  
**Dependencias:** US-001

---

### US-003: Gestión de Roles
**Como** sistema  
**Quiero** diferenciar roles de usuarios  
**Para** controlar accesos

**Criterios de Aceptación:**
- [ ] 3 roles: employee, admin, super_admin
- [ ] Permisos específicos por rol
- [ ] Guard que valide rol en endpoints protegidos
- [ ] UI diferente según rol

**Tareas Técnicas:**
- [ ] Crear RolesGuard
- [ ] Decorator @Roles(['admin'])
- [ ] Enum Role en types
- [ ] Middleware de autorización
- [ ] Protected routes en React Router
- [ ] Componente condicional según rol

**Estimación:** 6 horas  
**Prioridad:** Alta  
**Dependencias:** US-002

---

### US-004: Perfil de Usuario
**Como** usuario  
**Quiero** ver y editar mi perfil  
**Para** mantener mi información actualizada

**Criterios de Aceptación:**
- [ ] Ver: nombre, email, departamento, puesto
- [ ] Editar: nombre, teléfono, foto (futuro)
- [ ] Cambiar contraseña
- [ ] Validación de contraseña actual

**Tareas Técnicas:**
- [ ] GET /api/v1/users/me
- [ ] PUT /api/v1/users/me
- [ ] PUT /api/v1/users/me/password
- [ ] Página de perfil
- [ ] Formulario de edición

**Estimación:** 5 horas  
**Prioridad:** Media  
**Dependencias:** US-002

---

## Módulo 2: Gestión de Gastos (Core)

### US-005: Crear Gasto con Imagen
**Como** empleado  
**Quiero** crear un gasto subiendo foto del ticket  
**Para** no capturar datos manualmente

**Criterios de Aceptación:**
- [ ] Formulario con campos: fecha, monto, categoría, proyecto, descripción
- [ ] Upload de imagen obligatorio (max 10MB)
- [ ] Preview de imagen antes de enviar
- [ ] Validación: monto > 0, descripción mínimo 10 caracteres
- [ ] OCR automático tras subir imagen
- [ ] Campos pre-llenados con datos del OCR (editables)
- [ ] Guardar en estado "pending"

**Tareas Técnicas:**
Backend:
- [ ] POST /api/v1/expenses
- [ ] POST /api/v1/expenses/attachments (multipart/form-data)
- [ ] Multer configurado para uploads
- [ ] Validar tipo de archivo (jpg, png, pdf)
- [ ] Guardar archivo en /uploads/{companyId}/{userId}/
- [ ] Integrar servicio OCR (tesseract.js)
- [ ] Extraer: monto, fecha, proveedor del texto OCR

Frontend:
- [ ] ExpenseForm component
- [ ] Input file con drag & drop
- [ ] Preview de imagen
- [ ] Loading state durante OCR
- [ ] Toast de éxito/error
- [ ] Redirección a lista tras crear

**Estimación:** 16 horas  
**Prioridad:** Crítica  
**Dependencias:** US-003

---

### US-006: Listar Mis Gastos
**Como** empleado  
**Quiero** ver todos mis gastos  
**Para** dar seguimiento a mis solicitudes

**Criterios de Aceptación:**
- [ ] Tabla con: fecha, monto, categoría, estado, acciones
- [ ] Filtros: rango de fechas, estado, categoría
- [ ] Ordenamiento por fecha (desc por defecto)
- [ ] Paginación (50 por página)
- [ ] Badges de color según estado
- [ ] Click en fila para ver detalle

**Tareas Técnicas:**
Backend:
- [ ] GET /api/v1/expenses?page=1&limit=50&status=pending&startDate=...
- [ ] Query builder con filtros dinámicos
- [ ] Eager loading de relaciones (category, project)

Frontend:
- [ ] ExpenseList component
- [ ] ExpenseTable component
- [ ] Filtros con inputs controlados
- [ ] useExpenses hook (React Query)
- [ ] Paginación component
- [ ] Status badge component

**Estimación:** 12 horas  
**Prioridad:** Alta  
**Dependencias:** US-005

---

### US-007: Ver Detalle de Gasto
**Como** usuario  
**Quiero** ver el detalle completo de un gasto  
**Para** revisar toda la información

**Criterios de Aceptación:**
- [ ] Mostrar todos los campos del gasto
- [ ] Ver imagen del ticket en tamaño completo
- [ ] Ver historial de aprobaciones
- [ ] Ver datos del OCR
- [ ] Botón de editar (solo si pending y es mi gasto)

**Tareas Técnicas:**
- [ ] GET /api/v1/expenses/:id
- [ ] Página ExpenseDetail
- [ ] Modal de imagen fullscreen
- [ ] Timeline de aprobaciones
- [ ] Conditional rendering según permisos

**Estimación:** 8 horas  
**Prioridad:** Alta  
**Dependencias:** US-006

---

### US-008: Editar Gasto Pendiente
**Como** empleado  
**Quiero** editar un gasto pendiente  
**Para** corregir errores antes de aprobación

**Criterios de Aceptación:**
- [ ] Solo editable si estado = "pending"
- [ ] Solo el dueño del gasto puede editar
- [ ] Formulario pre-llenado con datos actuales
- [ ] Puede cambiar imagen
- [ ] Re-ejecutar OCR si cambia imagen

**Tareas Técnicas:**
- [ ] PUT /api/v1/expenses/:id
- [ ] Validar ownership en backend
- [ ] ExpenseEditForm component (reutilizar ExpenseForm)
- [ ] Modo "edit" en formulario

**Estimación:** 6 horas  
**Prioridad:** Media  
**Dependencias:** US-007

---

### US-009: Eliminar Gasto
**Como** empleado  
**Quiero** eliminar un gasto pendiente  
**Para** descartar solicitudes incorrectas

**Criterios de Aceptación:**
- [ ] Solo si estado = "pending"
- [ ] Solo el dueño puede eliminar
- [ ] Confirmación antes de eliminar
- [ ] Eliminar archivo adjunto del servidor

**Tareas Técnicas:**
- [ ] DELETE /api/v1/expenses/:id
- [ ] Soft delete (status = "cancelled")
- [ ] Borrar archivos físicos
- [ ] Modal de confirmación
- [ ] Actualizar lista tras eliminar

**Estimación:** 4 horas  
**Prioridad:** Baja  
**Dependencias:** US-006

---

## Módulo 3: Aprobaciones

### US-010: Ver Gastos Pendientes de Aprobación
**Como** administrador  
**Quiero** ver todos los gastos pendientes  
**Para** aprobarlos o rechazarlos

**Criterios de Aceptación:**
- [ ] Solo visible para admins
- [ ] Lista filtrable por empleado, fecha, monto
- [ ] Ordenar por monto (mayor a menor)
- [ ] Mostrar total de gastos pendientes
- [ ] Click para ver detalle

**Tareas Técnicas:**
- [ ] GET /api/v1/expenses/pending (con @Roles(['admin']))
- [ ] ApprovalPanel component
- [ ] PendingExpenseList component
- [ ] Summary card con totales
- [ ] Ruta protegida /admin/approvals

**Estimación:** 8 horas  
**Prioridad:** Alta  
**Dependencias:** US-003

---

### US-011: Aprobar Gasto
**Como** administrador  
**Quiero** aprobar un gasto  
**Para** autorizar el reembolso

**Criterios de Aceptación:**
- [ ] Botón "Aprobar" en detalle de gasto
- [ ] Opcional: agregar comentarios
- [ ] Cambiar estado a "approved"
- [ ] Registrar aprobador y fecha
- [ ] Notificación al empleado (futuro)

**Tareas Técnicas:**
- [ ] POST /api/v1/expenses/:id/approve
- [ ] DTO: { comments?: string }
- [ ] Guardar en tabla expense_approvals
- [ ] Actualizar expense.status
- [ ] Modal de confirmación con textarea
- [ ] Botón con loading state

**Estimación:** 6 horas  
**Prioridad:** Crítica  
**Dependencias:** US-010

---

### US-012: Rechazar Gasto
**Como** administrador  
**Quiero** rechazar un gasto  
**Para** evitar pagos incorrectos

**Criterios de Aceptación:**
- [ ] Botón "Rechazar"
- [ ] Comentario obligatorio explicando motivo
- [ ] Cambiar estado a "rejected"
- [ ] No editable tras rechazo
- [ ] Notificación al empleado

**Tareas Técnicas:**
- [ ] POST /api/v1/expenses/:id/reject
- [ ] DTO: { reason: string } (requerido)
- [ ] Validar que reason no esté vacío
- [ ] Guardar en expense_approvals
- [ ] Modal con textarea obligatorio
- [ ] Deshabilitar botón si textarea vacío

**Estimación:** 5 horas  
**Prioridad:** Alta  
**Dependencias:** US-010

---

### US-013: Historial de Aprobaciones
**Como** usuario  
**Quiero** ver el historial de aprobaciones  
**Para** saber quién y cuándo aprobó/rechazó

**Criterios de Aceptación:**
- [ ] Timeline con todas las acciones
- [ ] Mostrar: usuario, acción, fecha, comentarios
- [ ] Ordenado cronológicamente

**Tareas Técnicas:**
- [ ] Incluir approvals en GET /api/v1/expenses/:id
- [ ] ApprovalTimeline component
- [ ] Íconos según tipo de acción
- [ ] Formato de fechas relativas (hace 2 horas)

**Estimación:** 4 horas  
**Prioridad:** Media  
**Dependencias:** US-011, US-012

---

## Módulo 4: Categorías y Proyectos

### US-014: CRUD de Categorías
**Como** administrador  
**Quiero** gestionar categorías de gastos  
**Para** organizar los gastos

**Criterios de Aceptación:**
- [ ] Listar categorías activas
- [ ] Crear nueva categoría
- [ ] Editar categoría existente
- [ ] Desactivar categoría (no eliminar)
- [ ] Categorías tienen: nombre, código, límite de monto

**Tareas Técnicas:**
- [ ] GET /api/v1/categories
- [ ] POST /api/v1/categories
- [ ] PUT /api/v1/categories/:id
- [ ] DELETE /api/v1/categories/:id (soft delete)
- [ ] CategoriesPage
- [ ] CategoryForm modal
- [ ] CategoryList table

**Estimación:** 10 horas  
**Prioridad:** Alta  
**Dependencias:** US-003

---

### US-015: CRUD de Proyectos
**Como** administrador  
**Quiero** gestionar proyectos  
**Para** asignar gastos a centros de costo

**Criterios de Aceptación:**
- [ ] Similar a categorías
- [ ] Campos: nombre, código, presupuesto, gerente
- [ ] Estados: active, completed, cancelled

**Tareas Técnicas:**
- [ ] Endpoints CRUD /api/v1/projects
- [ ] ProjectsPage
- [ ] ProjectForm modal

**Estimación:** 10 horas  
**Prioridad:** Media  
**Dependencias:** US-014

---

## Módulo 5: Reportes y Exportación

### US-016: Dashboard con Métricas
**Como** administrador  
**Quiero** ver un dashboard con métricas  
**Para** tener visibilidad del gasto

**Criterios de Aceptación:**
- [ ] Cards con: total gastado mes actual, gastos pendientes, gastos aprobados
- [ ] Gráfica de gastos por categoría (pie chart)
- [ ] Gráfica de gastos por mes (bar chart)
- [ ] Top 5 empleados con más gastos

**Tareas Técnicas:**
- [ ] GET /api/v1/reports/summary?month=11&year=2024
- [ ] Dashboard page
- [ ] SummaryCards component
- [ ] Charts con Recharts
- [ ] useReportSummary hook

**Estimación:** 12 horas  
**Prioridad:** Alta  
**Dependencias:** US-006

---

### US-017: Reporte de Gastos por Periodo
**Como** finanzas  
**Quiero** ver reporte de gastos en un periodo  
**Para** análisis contable

**Criterios de Aceptación:**
- [ ] Filtros: fecha inicio, fecha fin, estado, categoría, empleado
- [ ] Tabla con todos los gastos del periodo
- [ ] Total general al final
- [ ] Exportable a Excel/CSV

**Tareas Técnicas:**
- [ ] GET /api/v1/reports/expenses?startDate=...&endDate=...
- [ ] ReportsPage
- [ ] ReportFilters component
- [ ] ReportTable component

**Estimación:** 8 horas  
**Prioridad:** Alta  
**Dependencias:** US-016

---

### US-018: Exportar a Excel
**Como** finanzas  
**Quiero** exportar gastos a Excel  
**Para** integrar con sistema contable

**Criterios de Aceptación:**
- [ ] Botón "Exportar a Excel"
- [ ] Descarga archivo .xlsx
- [ ] Columnas: fecha, empleado, categoría, proyecto, monto, estado
- [ ] Formato: números con 2 decimales, fechas DD/MM/YYYY
- [ ] Incluir hoja de resumen

**Tareas Técnicas:**
- [ ] POST /api/v1/reports/export (con filtros en body)
- [ ] ExportService con ExcelJS
- [ ] Generar workbook con 2 sheets: detalles + resumen
- [ ] Botón de descarga
- [ ] Loading spinner durante generación

**Estimación:** 10 horas  
**Prioridad:** Crítica  
**Dependencias:** US-017

---

### US-019: Exportar a CSV
**Como** usuario  
**Quiero** exportar a CSV  
**Para** análisis rápido en Excel

**Criterios de Aceptación:**
- [ ] Similar a Excel pero formato CSV
- [ ] Encoding UTF-8
- [ ] Separador: coma

**Tareas Técnicas:**
- [ ] Reutilizar endpoint de exportación con param format=csv
- [ ] Generar CSV desde array de datos
- [ ] Headers correctos (text/csv)

**Estimación:** 3 horas  
**Prioridad:** Media  
**Dependencias:** US-018

---

## Módulo 6: Gestión de Usuarios (Admin)

### US-020: Listar Usuarios de la Empresa
**Como** administrador  
**Quiero** ver todos los usuarios  
**Para** gestionar el equipo

**Criterios de Aceptación:**
- [ ] Tabla con usuarios de mi empresa
- [ ] Mostrar: nombre, email, rol, departamento, estado
- [ ] Filtrar por rol, estado
- [ ] Acciones: editar, desactivar

**Tareas Técnicas:**
- [ ] GET /api/v1/users (filtrado por companyId automático)
- [ ] UsersPage
- [ ] UserList table
- [ ] Filtros de rol y estado

**Estimación:** 8 horas  
**Prioridad:** Media  
**Dependencias:** US-003

---

### US-021: Crear Usuario
**Como** administrador  
**Quiero** crear usuarios  
**Para** dar acceso al sistema

**Criterios de Aceptación:**
- [ ] Formulario: email, nombre, apellido, rol, departamento
- [ ] Validar email único dentro de la empresa
- [ ] Generar contraseña temporal
- [ ] Enviar email con credenciales (futuro)

**Tareas Técnicas:**
- [ ] POST /api/v1/users
- [ ] UserForm modal
- [ ] Generar password aleatorio
- [ ] Toast de éxito con password

**Estimación:** 6 horas  
**Prioridad:** Media  
**Dependencias:** US-020

---

### US-022: Editar Usuario
**Como** administrador  
**Quiero** editar datos de usuario  
**Para** actualizar información

**Criterios de Aceptación:**
- [ ] Editar: nombre, rol, departamento, puesto
- [ ] No editar email (es el identificador)
- [ ] Validar permisos (admin no puede editar super_admin)

**Tareas Técnicas:**
- [ ] PUT /api/v1/users/:id
- [ ] Guard que valide jerarquía de roles
- [ ] UserEditForm modal

**Estimación:** 5 horas  
**Prioridad:** Baja  
**Dependencias:** US-021

---

### US-023: Desactivar Usuario
**Como** administrador  
**Quiero** desactivar usuarios  
**Para** revocar acceso sin perder historial

**Criterios de Aceptación:**
- [ ] Botón "Desactivar"
- [ ] Usuario no puede hacer login
- [ ] Gastos previos siguen visibles
- [ ] Se puede reactivar

**Tareas Técnicas:**
- [ ] PUT /api/v1/users/:id/deactivate
- [ ] Cambiar user.status = 'inactive'
- [ ] Validar en login que status = 'active'
- [ ] Toggle button activo/inactivo

**Estimación:** 3 horas  
**Prioridad:** Baja  
**Dependencias:** US-020

---

## Módulo 7: Configuración de Empresa

### US-024: Ver Configuración de Empresa
**Como** super admin  
**Quiero** ver datos de la empresa  
**Para** validar información

**Criterios de Aceptación:**
- [ ] Ver: nombre, RFC, dirección, plan
- [ ] Ver límites: max usuarios, max storage

**Tareas Técnicas:**
- [ ] GET /api/v1/companies/me
- [ ] CompanySettingsPage
- [ ] Solo accesible por super_admin

**Estimación:** 4 horas  
**Prioridad:** Baja  
**Dependencias:** US-003

---

### US-025: Editar Configuración
**Como** super admin  
**Quiero** editar datos de la empresa  
**Para** mantener información actualizada

**Criterios de Aceptación:**
- [ ] Editar: nombre legal, dirección, teléfono
- [ ] No editar RFC ni plan (requiere soporte)

**Tareas Técnicas:**
- [ ] PUT /api/v1/companies/me
- [ ] CompanyEditForm

**Estimación:** 4 horas  
**Prioridad:** Baja  
**Dependencias:** US-024

---

## Módulo 8: Infraestructura y DevOps

### US-026: Setup de Proyecto
**Como** desarrollador  
**Quiero** tener el proyecto configurado  
**Para** comenzar a desarrollar

**Tareas:**
- [ ] Inicializar repos Git (backend, frontend, monorepo)
- [ ] Setup Docker Compose
- [ ] Configurar NestJS con módulos base
- [ ] Setup React + Vite + Tailwind
- [ ] Configurar ESLint + Prettier
- [ ] Variables de entorno (.env.example)

**Estimación:** 6 horas  
**Prioridad:** Crítica  
**Dependencias:** Ninguna

---

### US-027: Base de Datos
**Como** desarrollador  
**Quiero** tener la BD configurada  
**Para** persistir datos

**Tareas:**
- [ ] Ejecutar schema.sql
- [ ] Configurar TypeORM
- [ ] Crear migrations iniciales
- [ ] Seed de datos demo
- [ ] Setup pg_admin (opcional)

**Estimación:** 4 horas  
**Prioridad:** Crítica  
**Dependencias:** US-026

---

### US-028: Deploy a Producción
**Como** equipo  
**Quiero** tener el MVP en producción  
**Para** que usuarios prueben

**Tareas:**
- [ ] Contratar VPS
- [ ] Instalar Docker en servidor
- [ ] Configurar Nginx
- [ ] SSL con Certbot
- [ ] Configurar Cloudflare
- [ ] Deploy de contenedores
- [ ] Configurar backups automáticos
- [ ] Setup monitoring básico

**Estimación:** 8 horas  
**Prioridad:** Alta  
**Dependencias:** Todas las US anteriores

---

## Resumen de Estimaciones

### Por Módulo
```
1. Autenticación y Usuarios:        29 horas
2. Gestión de Gastos (Core):        46 horas
3. Aprobaciones:                     23 horas
4. Categorías y Proyectos:           20 horas
5. Reportes y Exportación:           33 horas
6. Gestión de Usuarios (Admin):      22 horas
7. Configuración de Empresa:          8 horas
8. Infraestructura y DevOps:         18 horas
----------------------------------------
TOTAL:                              199 horas
```

### Con Buffer del 30% (realista)
```
TOTAL REALISTA: ~260 horas
```

### Estimación por Desarrollador
- **1 desarrollador full-stack**: 6-7 semanas
- **2 desarrolladores (1 backend, 1 frontend)**: 4-5 semanas
- **3 desarrolladores**: 3-4 semanas

---

## Priorización para MVP Mínimo Viable

### Sprint 1 (Crítico - 2 semanas)
- US-001 a US-003: Auth y roles
- US-005: Crear gasto con imagen
- US-006: Listar gastos
- US-026, US-027: Setup

### Sprint 2 (Esencial - 2 semanas)
- US-010 a US-012: Aprobaciones
- US-014: Categorías
- US-018: Exportar Excel

### Sprint 3 (Importante - 1-2 semanas)
- US-016: Dashboard
- US-017: Reportes
- US-020, US-021: Gestión usuarios
- US-028: Deploy

### Sprint 4 (Pulido - 1 semana)
- US-007 a US-009: Detalle, editar, eliminar
- US-004: Perfil
- US-013: Historial
- Testing y fixes

---

## Definición de "Done"

Una historia está completa cuando:
- ✓ Código implementado y testeado
- ✓ Tests unitarios (mínimo happy path)
- ✓ Documentación API (Swagger/OpenAPI)
- ✓ UI responsive en mobile y desktop
- ✓ Validaciones frontend y backend
- ✓ Manejo de errores apropiado
- ✓ Code review aprobado
- ✓ Merged a develop branch

---

**Documento vivo**: Actualizar según avance y cambios del proyecto
