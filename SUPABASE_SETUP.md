# 🚀 VIATICX - Configuración con Supabase

**Fecha**: 18 de Diciembre, 2024

---

## ✅ Configuración Completada

Tu proyecto VIATICX ha sido configurado exitosamente para usar **Supabase** como base de datos PostgreSQL.

### Cambios Realizados:

1. ✅ **Archivo `.env` creado** con:
   - Conexión a Supabase PostgreSQL
   - JWT secrets generados de forma segura
   - Todas las variables de entorno necesarias

2. ✅ **Backend actualizado** ([app.module.ts](backend/src/app.module.ts:28-46)):
   - Detección automática de Supabase
   - SSL habilitado automáticamente para conexiones Supabase
   - Configuración TypeORM optimizada

3. ✅ **Docker Compose actualizado** ([docker-compose.yml](docker-compose.yml:4-25)):
   - PostgreSQL local comentado (usando Supabase)
   - Backend configurado para conectarse a Supabase
   - Variables de entorno actualizadas

---

## 📝 Próximos Pasos

### 1. Inicializar el Schema en Supabase

Debes ejecutar el schema SQL en tu base de datos Supabase:

**Opción A: Usando Supabase Dashboard (Recomendado)**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Click en "SQL Editor" en el menú lateral
4. Abre el archivo [`database/schema.sql`](database/schema.sql)
5. Copia todo el contenido
6. Pégalo en el SQL Editor de Supabase
7. Click en "Run" o presiona `Ctrl + Enter`

**Opción B: Usando psql desde línea de comandos**

```bash
# Instalar psql si no lo tienes
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql-client

# Conectar y ejecutar el schema
psql "postgresql://postgres:Dro90030/1C1@db.xlffamkpldrhhcfloywc.supabase.co:5432/postgres" -f database/schema.sql
```

### 2. Iniciar Docker Desktop

Antes de ejecutar la aplicación, asegúrate de que Docker Desktop esté corriendo:

**Windows:**
- Abre Docker Desktop desde el menú de inicio
- Espera a que el ícono muestre "Docker Desktop is running"

**Mac:**
- Abre Docker Desktop desde Applications
- Espera a que aparezca el ícono en la barra superior

**Linux:**
- `sudo systemctl start docker`

### 3. Iniciar la Aplicación

```bash
# Iniciar Redis (para caching)
docker-compose up redis -d

# Esperar 10 segundos para que Redis esté listo

# Iniciar Backend (se conectará a Supabase)
docker-compose up backend -d

# Iniciar Frontend
docker-compose up frontend -d

# Ver logs en tiempo real
docker-compose logs -f backend
```

### 4. Verificar la Conexión

```bash
# Ver logs del backend para verificar conexión
docker-compose logs backend

# Deberías ver algo como:
# [Nest] INFO TypeOrmModule dependencies initialized +XXXms
# [Nest] INFO Mapped {/api/v1/..., GET} route +XXXms
```

Si hay errores de conexión, revisa:
- Que Supabase esté activo
- Que el schema SQL haya sido ejecutado
- Que las credenciales en `.env` sean correctas

### 5. Acceder a la Aplicación

Una vez iniciados todos los servicios:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

---

## 🔐 Credenciales Configuradas

### Base de Datos Supabase
```
Host: db.xlffamkpldrhhcfloywc.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: Dro90030/1C1
SSL: Enabled (automático)
```

### JWT Secrets (Generados)
```
JWT_SECRET: 5d5a02d08680b47022fd755941bb4c96dce92c83d6af4257dfc364495b7bf061dce43acf00de40cd5871c5069fa2db0516176c3f3883c94e2ce0e039626718d7

REFRESH_TOKEN_SECRET: 7e62cec0d153b5ff6e69c05e0d74f7fc257c860a388bfbe4609b1b97e33fe8d0e0a85206f9ec345eac11729b1f4e1543eecdb63ed8246f464627193556ee30e9
```

⚠️ **IMPORTANTE**: Estos secrets están en el archivo `.env` que NO debe ser commiteado a Git. El `.gitignore` ya está configurado para ignorarlo.

---

## 🧪 Probar la Conexión (Opcional)

Si quieres probar la conexión a Supabase antes de iniciar la app completa:

**Opción 1: Node.js Script**

Crea un archivo `test-db.js`:

```javascript
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Dro90030/1C1@db.xlffamkpldrhhcfloywc.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Conexión exitosa a Supabase');

    const res = await client.query('SELECT NOW()');
    console.log('⏰ Timestamp del servidor:', res.rows[0].now);

    await client.end();
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }
}

testConnection();
```

Ejecutar:
```bash
npm install pg
node test-db.js
```

**Opción 2: psql directo**

```bash
psql "postgresql://postgres:Dro90030/1C1@db.xlffamkpldrhhcfloywc.supabase.co:5432/postgres?sslmode=require"

# Luego ejecuta:
SELECT NOW();
\dt  -- Ver tablas
\q   -- Salir
```

---

## 📊 Monitoreo de Supabase

Puedes monitorear tu base de datos desde el Dashboard de Supabase:

1. **Database**: Ver tablas, ejecutar queries
2. **Table Editor**: Editar datos visualmente
3. **SQL Editor**: Ejecutar SQL
4. **Database Logs**: Ver logs de conexiones y queries
5. **Reports**: Estadísticas de uso

Dashboard: https://supabase.com/dashboard/project/xlffamkpldrhhcfloywc

---

## 🚨 Solución de Problemas

### Error: "SSL connection required"

**Solución**: Ya está configurado automáticamente en [app.module.ts](backend/src/app.module.ts:41-42). Si persiste, verifica que estés usando la última versión del código.

### Error: "password authentication failed"

**Solución**: Verifica que la contraseña en `.env` sea exactamente: `Dro90030/1C1`

### Error: "relation does not exist"

**Solución**: Ejecuta el schema SQL en Supabase (ver paso 1 arriba).

### Error: "too many connections"

**Solución**:
- Supabase FREE tier tiene límite de conexiones
- Cierra conexiones no usadas
- Considera usar connection pooling (ya configurado en TypeORM)

### Backend no conecta

Revisa los logs:
```bash
docker-compose logs backend | grep -i error
docker-compose logs backend | grep -i database
```

---

## 📈 Límites de Supabase FREE Tier

- **Database Size**: 500 MB
- **Bandwidth**: 5 GB/mes
- **Connections**: 100 simultáneas
- **API Requests**: 500,000/mes

Para proyectos en producción, considera upgrade a Pro ($25/mes).

---

## 🔄 Volver a PostgreSQL Local (Opcional)

Si en algún momento quieres volver a usar PostgreSQL local:

1. Edita [docker-compose.yml](docker-compose.yml:4-25)
2. Descomenta la sección `db:`
3. Descomenta `db: condition: service_healthy` en backend
4. Actualiza `.env`:
   ```env
   DATABASE_URL=postgresql://viaticx_user:viaticx_dev_password_2024_CHANGE_ME@db:5432/viaticx
   ```
5. Reinicia servicios:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

## ✅ Checklist Final

Antes de continuar con el desarrollo:

- [ ] Schema SQL ejecutado en Supabase
- [ ] Docker Desktop corriendo
- [ ] Redis iniciado (`docker-compose ps` muestra "Up")
- [ ] Backend iniciado y conectado a Supabase
- [ ] Frontend iniciado
- [ ] http://localhost:3000 accesible
- [ ] http://localhost:3001 accesible
- [ ] Puedes crear una cuenta de prueba

---

## 📚 Próximos Pasos de Desarrollo

Una vez que la conexión esté funcionando:

1. **Testing**: Ejecutar tests con `npm run test`
2. **Integrar Guards**: ThrottlerGuard, LoggingInterceptor
3. **Completar UI**: ExpenseDetailPage, EditExpensePage
4. **Despliegue**:
   - Frontend → Vercel
   - Backend → Railway
   - Database → Supabase (ya configurado)

---

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa esta guía completa
2. Revisa los logs: `docker-compose logs -f`
3. Verifica Dashboard de Supabase
4. Crea un issue en GitHub con los logs

---

**¡Todo listo para empezar a desarrollar! 🎉**

Configurado con ❤️ para VIATICX
