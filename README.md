# VIATICX 💼

Sistema de gestión de gastos y viáticos empresariales - Plataforma SaaS B2B

![Status](https://img.shields.io/badge/status-MVP%20Development-yellow)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## 🚀 Descripción

VIATICX es una plataforma moderna para la gestión de gastos corporativos que permite a las empresas:

- ✅ Capturar gastos con fotografías de tickets/facturas
- ✅ OCR automático para extracción de datos
- ✅ Flujos de aprobación configurable
- ✅ Reportes y exportación a Excel/CSV
- ✅ Multiempresa con roles diferenciados
- ✅ Control fiscal y contable

---

## 📋 Características del MVP

### Para Empleados
- Registro y captura de gastos
- Adjuntar imágenes de comprobantes
- Seguimiento de estado de solicitudes
- Historial de gastos

### Para Administradores
- Aprobación/rechazo de gastos
- Reportes y dashboards
- Gestión de usuarios
- Configuración de categorías y proyectos
- Exportación a sistemas contables

### Tecnología
- **Frontend**: React 18 + Tailwind CSS + TypeScript
- **Backend**: Node.js + NestJS + TypeORM
- **Base de Datos**: PostgreSQL 16
- **Infraestructura**: Docker + Nginx + Cloudflare

---

## 🏗️ Estructura del Proyecto

```
viaticx/
├── backend/          # API REST con NestJS
├── frontend/         # Aplicación React
├── database/         # Schemas y migrations
├── docs/             # Documentación técnica
├── scripts/          # Scripts de utilidad
├── docker-compose.yml
└── README.md
```

---

## 🚦 Inicio Rápido

### Prerrequisitos
- Node.js 20.x LTS
- Docker & Docker Compose
- PostgreSQL 16 (o usar Docker)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/DESARROLLOSROD/VIATICX.git
cd VIATICX
```

### 2. Configurar variables de entorno

#### Backend
```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales
```

#### Frontend
```bash
cd frontend
cp .env.example .env
# Configurar URL del API
```

### 3. Levantar con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f

# La aplicación estará disponible en:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - PostgreSQL: localhost:5432
```

### 4. Inicializar Base de Datos

```bash
# Ejecutar schema inicial
docker-compose exec db psql -U viaticx_user -d viaticx -f /docker-entrypoint-initdb.d/schema.sql

# O manualmente:
cd database
psql -h localhost -U viaticx_user -d viaticx -f schema.sql
```

### 5. Desarrollo Local (sin Docker)

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

---

## 📚 Documentación

- [Arquitectura Técnica](docs/arquitectura_tecnica.md)
- [Esquema de Base de Datos](docs/database_schema.sql)
- [Historias de Usuario](docs/historias_usuario.md)
- [API Documentation](http://localhost:3001/api-docs) (Swagger)

---

## 🧪 Testing

### Backend
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage
```

### Frontend
```bash
cd frontend
npm run test
npm run test:coverage
```

---

## 📦 Deploy a Producción

### Con Docker
```bash
# Build de imágenes de producción
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Manual
Ver guía completa en: [docs/deploy.md](docs/deploy.md)

---

## 🔐 Seguridad

- Autenticación JWT con tokens de refresh
- RBAC (Role-Based Access Control)
- Encriptación de contraseñas con bcrypt
- Validación de entrada en todas las capas
- Rate limiting en endpoints críticos
- HTTPS obligatorio en producción
- Sanitización de archivos subidos

---

## 🗺️ Roadmap

### MVP (v1.0) ✅ En Desarrollo
- [x] Autenticación y usuarios
- [x] Gestión de gastos
- [x] Aprobaciones
- [x] Reportes básicos
- [x] Exportación Excel/CSV
- [ ] Testing completo
- [ ] Deploy a producción

### Post-MVP (v1.1+)
- [ ] App móvil nativa
- [ ] Integración bancaria
- [ ] WhatsApp bot para captura
- [ ] IA antifraude
- [ ] Timbrado CFDI automático
- [ ] Integración Aspel/Contpaqi
- [ ] Dashboard financiero avanzado

---

## 👥 Equipo

- **Product Owner**: [Nombre]
- **Tech Lead**: [Nombre]
- **Backend Developer**: [Nombre]
- **Frontend Developer**: [Nombre]

---

## 📄 Licencia

Proprietary - Todos los derechos reservados © 2024 VIATICX

---

## 🆘 Soporte

Para reportar bugs o solicitar features:
- **Issues**: [GitHub Issues](https://github.com/DESARROLLOSROD/VIATICX/issues)
- **Email**: soporte@viaticx.com
- **Docs**: [Documentación completa](docs/)

---

## 📈 Status del Proyecto

- **Última actualización**: Diciembre 2024
- **Versión actual**: 1.0.0-alpha
- **Estado**: Desarrollo del MVP
- **Coverage**: TBD
- **Deployment**: Development

---

**Hecho con ❤️ para empresas mexicanas y latinoamericanas**
