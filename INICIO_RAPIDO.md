# 🚀 INICIO RÁPIDO - VIATICX MVP

## ✅ Estado del Proyecto

**Backend y Frontend FUNCIONANDO** 🎉

Características implementadas:
- ✅ Autenticación JWT completa
- ✅ Registro de usuarios y empresas
- ✅ Login con manejo de sesiones
- ✅ CRUD de gastos completo
- ✅ Aprobación/Rechazo de gastos
- ✅ Filtros y paginación
- ✅ Estadísticas
- ✅ Guards de seguridad (JWT, Roles)
- ✅ Frontend React con TypeScript
- ✅ Rutas protegidas
- ✅ Dashboard básico

---

## 📋 Requisitos

- Node.js 20.x LTS
- Docker y Docker Compose
- Git

---

## 🏃 Opción 1: Inicio con Docker (Recomendado)

### 1. Clonar/Extraer el proyecto
```bash
# Si descargaste el tar.gz
tar -xzf viaticx-proyecto-completo.tar.gz
cd viaticx

# O si clonaste de GitHub
git clone https://github.com/DESARROLLOSROD/VIATICX.git
cd VIATICX
```

### 2. Configurar variables de entorno
```bash
# Backend
cd backend
cp .env.example .env
# Editar .env si es necesario (las credenciales por defecto funcionan)

# Frontend  
cd ../frontend
cp .env.example .env
cd ..
```

### 3. Levantar servicios con Docker
```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 4. Esperar que los servicios estén listos
```bash
# Verificar que todo esté corriendo
docker-compose ps

# Debería mostrar:
# - viaticx_db (PostgreSQL)
# - viaticx_redis
# - viaticx_backend
# - viaticx_frontend
```

### 5. Inicializar la base de datos
```bash
# Ejecutar el schema (solo la primera vez)
docker-compose exec db psql -U viaticx_user -d viaticx -f /docker-entrypoint-initdb.d/schema.sql
```

### 6. ¡Listo! Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api-docs

---

## 🔧 Opción 2: Desarrollo Local (Sin Docker)

### 1. Iniciar PostgreSQL
```bash
# Opción A: Con Docker solo para PostgreSQL
docker-compose up db -d

# Opción B: PostgreSQL local
# Asegúrate de tener PostgreSQL 16 instalado
# Crear base de datos 'viaticx'
```

### 2. Backend
```bash
cd backend

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
# Editar DATABASE_URL si es necesario

# Ejecutar migrations/schema
npm run typeorm migration:run
# O ejecutar manualmente: psql -U viaticx_user -d viaticx -f ../database/schema.sql

# Iniciar servidor de desarrollo
npm run start:dev

# Backend corriendo en http://localhost:3001
```

### 3. Frontend
```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev

# Frontend corriendo en http://localhost:3000
```

---

## 🧪 Probar la Aplicación

### 1. Registrar una empresa
```bash
# Ir a http://localhost:3000

# Click en "Registrar Nueva Empresa"
# Llenar el formulario:
- Email: admin@miempresa.com
- Contraseña: Password123!
- Nombre: Admin
- Apellido: Demo
- Empresa: Mi Empresa SA
```

### 2. Login
```bash
# Usar las credenciales que acabas de crear
- Email: admin@miempresa.com
- Contraseña: Password123!
```

### 3. Dashboard
```bash
# Después del login, verás el dashboard
# Usuario actual y rol se muestran arriba a la derecha
```

---

## 📊 API Endpoints Disponibles

### Autenticación
```
POST   /api/v1/auth/register  - Registrar empresa y admin
POST   /api/v1/auth/login     - Iniciar sesión
POST   /api/v1/auth/refresh   - Refrescar token
GET    /api/v1/auth/me        - Info usuario actual
```

### Gastos
```
GET    /api/v1/expenses           - Listar gastos
POST   /api/v1/expenses           - Crear gasto
GET    /api/v1/expenses/:id       - Ver detalle
PATCH  /api/v1/expenses/:id       - Actualizar gasto
DELETE /api/v1/expenses/:id       - Eliminar (cancelar)
GET    /api/v1/expenses/pending   - Gastos pendientes (admin)
GET    /api/v1/expenses/stats     - Estadísticas (admin)
POST   /api/v1/expenses/:id/approve - Aprobar (admin)
POST   /api/v1/expenses/:id/reject  - Rechazar (admin)
```

### Ver documentación completa
```
http://localhost:3001/api-docs
```

---

## 🐛 Solución de Problemas

### Puerto ocupado
```bash
# Ver qué proceso usa el puerto
lsof -i :3000  # o :3001

# Matar proceso
kill -9 PID
```

### Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps db

# Ver logs
docker-compose logs db

# Reiniciar
docker-compose restart db
```

### Frontend no conecta con Backend
```bash
# Verificar variables de entorno
cat frontend/.env
# Debe tener: VITE_API_URL=http://localhost:3001/api/v1

# Verificar que backend esté corriendo
curl http://localhost:3001/api/v1
# Debe responder con health check
```

### Error de CORS
```bash
# Verificar ALLOWED_ORIGINS en backend/.env
# Debe incluir: http://localhost:3000
```

---

## 📝 Comandos Útiles

### Docker
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar todos los servicios
docker-compose restart

# Detener todo
docker-compose down

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

### Backend
```bash
# Tests
npm run test

# Lint
npm run lint

# Build para producción
npm run build
```

### Frontend
```bash
# Tests
npm run test

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 🗂️ Estructura del Proyecto

```
viaticx/
├── backend/               # API NestJS
│   ├── src/
│   │   ├── modules/      # Módulos de negocio
│   │   ├── common/       # Guards, decorators
│   │   ├── config/       # Configuración
│   │   └── main.ts       # Entry point
│   └── package.json
├── frontend/             # App React
│   ├── src/
│   │   ├── pages/        # Páginas
│   │   ├── services/     # API clients
│   │   ├── stores/       # Zustand stores
│   │   └── App.tsx       # App principal
│   └── package.json
├── database/             # SQL schemas
├── docs/                 # Documentación
└── docker-compose.yml    # Orquestación
```

---

## 🎯 Siguientes Pasos

1. **Página de Registro** - Ya funciona el endpoint, falta crear la UI
2. **Lista de Gastos** - Crear página con tabla y filtros
3. **Formulario de Crear Gasto** - Con upload de imagen
4. **Panel de Aprobaciones** - Para admins
5. **Dashboard con métricas** - Gráficas y stats

Ver `docs/historias_usuario.md` para el plan completo.

---

## 📚 Documentación Adicional

- [Arquitectura Técnica](docs/arquitectura_tecnica.md)
- [Historias de Usuario](docs/historias_usuario.md)
- [Esquema de Base de Datos](database/schema.sql)

---

## ✅ Verificación de Funcionamiento

Si todo está bien, deberías poder:

1. ✅ Registrar una nueva empresa
2. ✅ Hacer login
3. ✅ Ver el dashboard
4. ✅ Cerrar sesión
5. ✅ Acceder a la API docs en `/api-docs`
6. ✅ Ver los logs sin errores

---

**¡El MVP está FUNCIONANDO! 🚀**

Cualquier problema, revisar:
- Logs de Docker: `docker-compose logs -f`
- Documentación en `/docs`
- API docs: http://localhost:3001/api-docs
