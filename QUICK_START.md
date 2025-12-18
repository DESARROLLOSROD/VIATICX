# ⚡ VIATICX - Inicio Rápido

**Versión**: 1.1.0 (Mejorada)
**Última actualización**: 18 de Diciembre, 2024

---

## 🚀 Inicio en 5 Minutos

### 1. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/DESARROLLOSROD/VIATICX.git
cd VIATICX

# Copiar archivo de entorno
cp .env.development .env
```

### 2. Generar Secrets Seguros

```bash
# Generar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copiar el resultado y pegarlo en .env como JWT_SECRET

# Generar REFRESH_TOKEN_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copiar el resultado y pegarlo en .env como REFRESH_TOKEN_SECRET
```

### 3. Editar .env

Abrir `.env` y reemplazar:
```env
# CAMBIAR ESTOS VALORES:
JWT_SECRET=<pegar_secret_generado_aquí>
REFRESH_TOKEN_SECRET=<pegar_secret_generado_aquí>
POSTGRES_PASSWORD=tu_password_seguro_aquí
```

### 4. Iniciar con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

### 5. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

---

## 📋 Primeros Pasos

### Crear Primera Cuenta

1. Ir a http://localhost:3000/register
2. Llenar formulario:
   - Nombre de empresa
   - Tu nombre y apellido
   - Email
   - Contraseña (min 8 caracteres, mayúscula, número, carácter especial)
3. Click "Registrar"

### Login

1. Ir a http://localhost:3000/login
2. Ingresar credenciales
3. Explorar el dashboard

---

## 🛠️ Comandos Útiles

### Docker
```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar servicios
docker-compose restart

# Limpiar todo (¡cuidado!)
docker-compose down -v
```

### Desarrollo Local (sin Docker)

#### Backend
```bash
cd backend
npm install
npm run start:dev
# API en http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# App en http://localhost:3000
```

### Testing
```bash
# Frontend
cd frontend
npm run test
npm run test:coverage

# Backend
cd backend
npm run test
npm run test:cov
```

### Linting
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

---

## 🎯 Funcionalidades Disponibles

### ✅ Implementadas
- [x] Registro e inicio de sesión
- [x] Dashboard con estadísticas
- [x] Crear gastos
- [x] Listar gastos con filtros
- [x] Eliminar gastos
- [x] Formato de moneda (MXN)
- [x] Validaciones completas

### 🔄 En Progreso
- [ ] Ver detalle de gasto
- [ ] Editar gasto
- [ ] Panel de aprobaciones (admin)
- [ ] Upload de archivos
- [ ] OCR de facturas

### ⏳ Próximamente
- [ ] Reportes y exportación
- [ ] Categorías personalizadas
- [ ] Proyectos/centros de costo
- [ ] Notificaciones
- [ ] App móvil

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Reiniciar base de datos
docker-compose restart db

# Ver logs de la base de datos
docker-compose logs db
```

### Error: "Port 3000 already in use"
```bash
# Opción 1: Cambiar puerto en .env
FRONTEND_PORT=3002

# Opción 2: Matar proceso que usa el puerto
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "JWT_SECRET must be set"
```bash
# Asegúrate de tener .env con JWT_SECRET configurado
# Ver paso 2 arriba para generar
```

### Frontend no carga
```bash
# Verificar que el comando sea correcto
docker-compose logs frontend

# Debería usar 'npm run dev', no 'npm start'
# Esto está corregido en el docker-compose.yml mejorado
```

---

## 📚 Documentación

### Documentos Principales
- [`README.md`](README.md) - Documentación completa del proyecto
- [`MEJORAS_IMPLEMENTADAS.md`](MEJORAS_IMPLEMENTADAS.md) - Detalles técnicos de mejoras
- [`CONTRIBUTING.md`](CONTRIBUTING.md) - Guía de contribución
- [`RESUMEN_FINAL.md`](RESUMEN_FINAL.md) - Resumen ejecutivo

### Documentos Técnicos
- [`docs/arquitectura_tecnica.md`](docs/arquitectura_tecnica.md) - Arquitectura
- [`docs/historias_usuario.md`](docs/historias_usuario.md) - Historias de usuario
- [`database/schema.sql`](database/schema.sql) - Schema de base de datos

---

## 🔧 Configuración Avanzada

### Variables de Entorno Importantes

```env
# Base de Datos
POSTGRES_DB=viaticx
POSTGRES_USER=viaticx_user
POSTGRES_PASSWORD=<tu_password>

# JWT
JWT_SECRET=<64_caracteres_aleatorios>
REFRESH_TOKEN_SECRET=<64_caracteres_aleatorios>
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5

# Archivos
MAX_FILE_SIZE=10485760  # 10MB en bytes

# Logging
LOG_LEVEL=info  # error, warn, info, debug

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Puertos Personalizados

Editar en `.env`:
```env
BACKEND_PORT=3001
FRONTEND_PORT=3000
```

---

## 🎓 Recursos de Aprendizaje

### Stack Tecnológico
- [NestJS](https://docs.nestjs.com/) - Backend framework
- [React](https://react.dev/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing
- [Docker](https://docs.docker.com/) - Containerization

### Herramientas
- [React Query](https://tanstack.com/query/latest) - Server state
- [Zustand](https://zustand-demo.pmnd.rs/) - Client state
- [React Hook Form](https://react-hook-form.com/) - Forms
- [Zod](https://zod.dev/) - Validation

---

## 💡 Tips

### Desarrollo
- Usa el linting antes de commit: `npm run lint`
- Ejecuta tests regularmente: `npm run test`
- Revisa los logs con: `docker-compose logs -f`

### Performance
- El lazy loading ya está configurado ✅
- React Query cachea automáticamente ✅
- Las rutas se cargan bajo demanda ✅

### Seguridad
- ⚠️ NUNCA commitear el archivo `.env`
- ⚠️ NUNCA usar passwords por defecto en producción
- ⚠️ Generar siempre secrets aleatorios para JWT

---

## 🆘 Soporte

### Reportar Bugs
- [GitHub Issues](https://github.com/DESARROLLOSROD/VIATICX/issues)

### Documentación
- Ver carpeta `/docs` para más detalles
- Leer `CONTRIBUTING.md` antes de contribuir

### Contacto
- Email: soporte@viaticx.com

---

## ✅ Checklist de Inicio

Antes de empezar a desarrollar:

- [ ] `.env` configurado con secrets únicos
- [ ] Docker corriendo (`docker --version`)
- [ ] Docker Compose corriendo (`docker-compose --version`)
- [ ] Node.js 20.x instalado (`node --version`)
- [ ] Servicios iniciados (`docker-compose ps` muestra todos "Up")
- [ ] Frontend accesible en http://localhost:3000
- [ ] Backend accesible en http://localhost:3001
- [ ] Documentación leída (al menos README.md)

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu instalación de VIATICX está **lista para desarrollo**.

**Próximo paso**: Leer [`CONTRIBUTING.md`](CONTRIBUTING.md) para entender el flujo de trabajo.

---

**¿Problemas?** Revisa la sección de [Solución de Problemas](#-solución-de-problemas) o crea un [issue en GitHub](https://github.com/DESARROLLOSROD/VIATICX/issues).

**Versión**: 1.1.0 (Mejorada)
**Última actualización**: 18 de Diciembre, 2024
