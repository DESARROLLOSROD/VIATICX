# GUÍA DE PUSH MANUAL A GITHUB

El proyecto VIATICX está completamente creado y con commit inicial hecho.
Debido a restricciones de red, aquí están los pasos para hacer el push manual:

## Opción 1: Subir desde tu máquina local

### Paso 1: Descargar el proyecto
Descarga el archivo `viaticx-proyecto-completo.tar.gz` que está disponible.

### Paso 2: Extraer el proyecto
```bash
tar -xzf viaticx-proyecto-completo.tar.gz
cd viaticx
```

### Paso 3: Push a GitHub
```bash
# Verificar el remote (ya está configurado)
git remote -v

# Hacer push (te pedirá autenticación)
git push -u origin main
```

### Si necesitas autenticación:
```bash
# Opción A: Con tu usuario y token
git push https://TU_USUARIO:TU_TOKEN@github.com/DESARROLLOSROD/VIATICX.git main

# Opción B: Configurar credenciales globalmente
git config --global credential.helper store
git push -u origin main
# (Te pedirá usuario y token una vez)
```

---

## Opción 2: Clonar y copiar archivos

### Paso 1: Clonar el repositorio vacío
```bash
git clone https://github.com/DESARROLLOSROD/VIATICX.git
cd VIATICX
```

### Paso 2: Copiar los archivos del proyecto
Extrae `viaticx-proyecto-completo.tar.gz` y copia todo el contenido a la carpeta VIATICX

### Paso 3: Commit y push
```bash
git add .
git commit -m "feat: proyecto inicial VIATICX MVP

- Estructura completa del proyecto (monorepo)
- Backend NestJS con TypeORM y PostgreSQL
- Frontend React con TypeScript y Tailwind
- Docker Compose para desarrollo
- Documentación técnica completa
- Esquema de base de datos
- Historias de usuario
- Scripts de inicio rápido"

git push origin main
```

---

## Verificar que todo subió correctamente

Una vez hecho el push, verifica en GitHub que tienes:

✅ README.md principal
✅ Carpeta `backend/` con NestJS
✅ Carpeta `frontend/` con React
✅ Carpeta `database/` con schema.sql
✅ Carpeta `docs/` con documentación
✅ docker-compose.yml
✅ 42 archivos en total

---

## Siguiente paso: Iniciar el proyecto

```bash
# Opción 1: Con Docker (recomendado)
./scripts/start.sh

# Opción 2: Manual
# Terminal 1 - Base de datos
docker-compose up db

# Terminal 2 - Backend
cd backend
npm install
npm run start:dev

# Terminal 3 - Frontend
cd frontend
npm install
npm run dev
```

---

## URLs una vez iniciado

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs (Swagger): http://localhost:3001/api-docs
- PostgreSQL: localhost:5432

---

## Notas importantes

- El proyecto está **100% funcional** para comenzar desarrollo
- Revisa los README.md de backend y frontend para más detalles
- La documentación técnica está en `docs/`
- El esquema de base de datos está en `database/schema.sql`

---

## Problemas comunes

### Puerto ocupado
```bash
# Ver qué está usando el puerto
lsof -i :3000  # o :3001

# Matar proceso
kill -9 PID
```

### Base de datos no conecta
```bash
# Verificar que el contenedor esté corriendo
docker-compose ps

# Ver logs
docker-compose logs db
```

### Dependencias faltantes
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

---

¡Proyecto listo para comenzar el desarrollo! 🚀
