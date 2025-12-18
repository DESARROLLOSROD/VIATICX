# 🤝 Guía de Contribución - VIATICX

¡Gracias por tu interés en contribuir a VIATICX! Esta guía te ayudará a empezar.

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Empezar](#cómo-empezar)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Estándares de Código](#estándares-de-código)
5. [Proceso de Desarrollo](#proceso-de-desarrollo)
6. [Testing](#testing)
7. [Commits y Pull Requests](#commits-y-pull-requests)
8. [Reportar Bugs](#reportar-bugs)

---

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta profesional. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

---

## 🚀 Cómo Empezar

### 1. Configurar el Entorno

```bash
# Clonar el repositorio
git clone https://github.com/DESARROLLOSROD/VIATICX.git
cd VIATICX

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# Iniciar con Docker
docker-compose up -d
```

### 2. Crear una Rama

```bash
# Actualizar main
git checkout main
git pull origin main

# Crear rama descriptiva
git checkout -b feature/nombre-feature
# o
git checkout -b fix/nombre-bug
```

---

## 📁 Estructura del Proyecto

```
viaticx/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── modules/      # Módulos de negocio
│   │   ├── common/       # Código compartido
│   │   └── config/       # Configuración
│   └── test/             # Tests
│
├── frontend/             # React App
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── services/     # API clients
│   │   ├── stores/       # Zustand stores
│   │   ├── utils/        # Utilities
│   │   ├── types/        # TypeScript types
│   │   ├── constants/    # Constantes
│   │   └── test/         # Tests
│   └── public/           # Assets estáticos
│
├── database/             # SQL schemas
├── docs/                 # Documentación
└── scripts/              # Scripts de utilidad
```

---

## 💎 Estándares de Código

### TypeScript

#### ✅ DO: Usar tipos fuertes
```typescript
// ✅ Bueno
function createExpense(data: CreateExpenseData): Promise<Expense> {
  // ...
}

// ❌ Malo
function createExpense(data: any): Promise<any> {
  // ...
}
```

#### ✅ DO: Usar interfaces para objetos
```typescript
// ✅ Bueno
interface User {
  id: string;
  name: string;
}

// ❌ Malo
type User = {
  id: any;
  name: any;
}
```

#### ✅ DO: Evitar `any`
```typescript
// ✅ Bueno
function handleError(error: Error): void {
  console.error(error.message);
}

// ❌ Malo
function handleError(error: any): void {
  console.error(error);
}
```

### React

#### ✅ DO: Usar componentes funcionales
```typescript
// ✅ Bueno
const MyComponent: React.FC<Props> = ({ name }) => {
  return <div>{name}</div>;
};

// ❌ Malo
class MyComponent extends React.Component {
  // ...
}
```

#### ✅ DO: Extraer lógica a custom hooks
```typescript
// ✅ Bueno
function useExpenses() {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSES],
    queryFn: expensesService.getExpenses,
  });
}

// ❌ Malo - Lógica en el componente
function MyComponent() {
  const { data } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => fetch('/api/expenses'),
  });
}
```

### Naming Conventions

```typescript
// Variables y funciones: camelCase
const userName = 'John';
function getUserName() {}

// Componentes y clases: PascalCase
class UserService {}
const Button = () => {};

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 1024;
const API_URL = 'https://api.example.com';

// Archivos:
// - Componentes: PascalCase.tsx
// - Utilities: kebab-case.ts
// - Types: kebab-case.types.ts
```

### Imports

```typescript
// Orden de imports
import { useState } from 'react'; // 1. React
import { useQuery } from '@tanstack/react-query'; // 2. Librerías externas
import { Button } from '@/components/ui/Button'; // 3. Componentes internos
import { formatCurrency } from '@/utils'; // 4. Utilities
import { API_CONFIG } from '@/constants'; // 5. Constantes
import type { User } from '@/types'; // 6. Types
import './styles.css'; // 7. Estilos
```

---

## 🔄 Proceso de Desarrollo

### 1. Antes de Codificar

- [ ] Lee la issue completa
- [ ] Pregunta si tienes dudas
- [ ] Revisa el código relacionado
- [ ] Planifica tu solución

### 2. Durante el Desarrollo

```bash
# Ejecutar linting frecuentemente
npm run lint

# Ejecutar tests
npm run test

# Formatear código
npm run format # (si está configurado)
```

### 3. Antes del Commit

- [ ] Código pasa linting sin errores
- [ ] Tests pasan exitosamente
- [ ] Agregaste tests para tu código
- [ ] Actualizaste documentación si es necesario
- [ ] Probaste manualmente la funcionalidad

---

## 🧪 Testing

### Escribir Tests

#### Frontend (Vitest)
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Backend (Jest)
```typescript
import { Test } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ExpensesService],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an expense', async () => {
    const expense = await service.create({...});
    expect(expense).toHaveProperty('id');
  });
});
```

### Ejecutar Tests

```bash
# Frontend
cd frontend
npm run test              # Run tests
npm run test:coverage     # With coverage
npm run test:watch        # Watch mode

# Backend
cd backend
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # With coverage
```

### Coverage Requirements

- Mínimo: 70% de cobertura
- Objetivo: 80%+
- Todos los servicios críticos deben tener 90%+

---

## 📝 Commits y Pull Requests

### Formato de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo, sin cambios de código
- `refactor`: Refactorización
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

#### Ejemplos
```bash
feat(expenses): add expense filtering by date range

fix(auth): resolve token refresh issue on session timeout

docs(readme): update installation instructions

refactor(utils): consolidate format functions

test(expenses): add unit tests for expense service
```

### Pull Requests

#### Título
```
[TIPO] Descripción corta y clara
```

Ejemplos:
- `[FEAT] Agregar panel de aprobaciones`
- `[FIX] Corregir validación de formulario de login`
- `[REFACTOR] Consolidar utilities compartidas`

#### Descripción

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Refactorización
- [ ] Documentación

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado auto-review de mi código
- [ ] He agregado tests que prueban mis cambios
- [ ] Todos los tests pasan exitosamente
- [ ] He actualizado la documentación

## Testing
Describe cómo probaste los cambios

## Screenshots (si aplica)
![descripción](url)

## Issues Relacionadas
Closes #123
```

### Code Review

#### Como Autor
- Responde todos los comentarios
- Haz cambios solicitados rápidamente
- Mantén la conversación profesional

#### Como Reviewer
- Sé constructivo y respetuoso
- Explica el "por qué" de tus sugerencias
- Aprueba cuando esté listo

---

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
## Descripción
Descripción clara del bug

## Pasos para Reproducir
1. Ir a '...'
2. Click en '...'
3. Ver error

## Comportamiento Esperado
Lo que debería suceder

## Comportamiento Actual
Lo que realmente sucede

## Screenshots
Si aplica, agrega screenshots

## Entorno
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Versión: [e.g. 1.0.0]

## Contexto Adicional
Cualquier otro contexto relevante
```

---

## 🎯 Best Practices

### Performance

```typescript
// ✅ DO: Memoize expensive computations
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);

// ✅ DO: Lazy load routes
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// ✅ DO: Use React Query para caching
const { data } = useQuery({
  queryKey: [QUERY_KEYS.EXPENSES],
  queryFn: getExpenses,
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

### Security

```typescript
// ✅ DO: Validate all inputs
export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}

// ✅ DO: Sanitize file uploads
validateUploadedFile(file);

// ❌ DON'T: Store sensitive data in localStorage
// Use httpOnly cookies para tokens
```

### Error Handling

```typescript
// ✅ DO: Handle errors gracefully
try {
  await createExpense(data);
  toast.success('Gasto creado exitosamente');
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error(error.message);
  } else {
    toast.error('Error inesperado. Intenta de nuevo');
    console.error(error);
  }
}
```

---

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la documentación en `/docs`
2. Busca issues similares
3. Pregunta en el canal de desarrollo
4. Crea una issue con la etiqueta `question`

---

## 🙏 Gracias

¡Gracias por contribuir a VIATICX! Tu tiempo y esfuerzo ayudan a hacer este proyecto mejor.

---

**Última actualización**: 18 de Diciembre, 2024
**Versión**: 1.0.0
