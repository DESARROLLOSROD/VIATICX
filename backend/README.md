# VIATICX Backend

API REST con NestJS para el sistema de gestión de gastos y viáticos.

## Stack Tecnológico

- Node.js 20.x LTS
- NestJS 10.x
- TypeORM
- PostgreSQL 16
- JWT Authentication
- Swagger/OpenAPI

## Instalación

```bash
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`
2. Configurar variables de entorno
3. Asegurar que PostgreSQL esté corriendo

## Desarrollo

```bash
npm run start:dev
```

API disponible en: http://localhost:3001
Documentación: http://localhost:3001/api-docs

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Build

```bash
npm run build
npm run start:prod
```
