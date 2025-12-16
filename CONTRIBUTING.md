# Contribuyendo a VIATICX

¡Gracias por tu interés en contribuir a VIATICX!

## Proceso de Desarrollo

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/mi-feature`
3. **Commit** tus cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/mi-feature`
5. **Abre un Pull Request**

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formateo, sin cambios de código
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Mantenimiento

Ejemplos:
```
feat: agregar módulo de aprobaciones
fix: corregir validación de monto en gastos
docs: actualizar README con instrucciones de deploy
```

## Estándares de Código

### Backend (NestJS)
- Usar TypeScript
- Seguir las guías de estilo de NestJS
- Escribir tests unitarios
- Documentar endpoints con Swagger

### Frontend (React)
- Usar TypeScript
- Componentes funcionales con Hooks
- Tailwind CSS para estilos
- Evitar componentes de más de 200 líneas

## Testing

Antes de hacer commit, asegúrate de que:
- Los tests pasen: `npm run test`
- El código compile: `npm run build`
- No haya errores de linting: `npm run lint`

## Pull Request Guidelines

- Descripción clara de los cambios
- Referencia al issue relacionado
- Screenshots para cambios de UI
- Tests que cubran los nuevos cambios

## Preguntas

Si tienes dudas, abre un issue o contacta al equipo.
