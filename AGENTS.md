# AGENTS.md - Portfolio Argentina Programa Frontend

## Descripción del Proyecto

Portfolio personal web desarrollado con Angular 21 como parte del programa "Argentina Programa". Presenta información profesional con tema oscuro y efectos glassmorphism.

## Stack Tecnológico

- **Framework**: Angular 21
- **UI Components**: Angular Material + Angular CDK
- **Estilos**: CSS3 con Design Tokens, Bootstrap 5
- **HTTP**: RxJS + HttpClient
- **Notificaciones**: ngx-toastr
- **Lenguaje**: TypeScript 5.9
- **Gestor de paquetes**: pnpm

## Comandos Principales

```bash
pnpm start        # Iniciar servidor dev en http://localhost:4200
pnpm build        # Construir para producción
pnpm ng serve     # Alias para start
```

## Estructura de Directorios

```
src/
├── app/
│   ├── componentes/        # Componentes de UI (bar-nav, persona, experiencia, estudios, proyectos, skill, footer)
│   ├── dialogs/            # Modales de edición con Angular Material
│   ├── interceptors/       # Interceptores HTTP (auth JWT)
│   ├── models/             # Interfaces TypeScript
│   ├── servicios/          # Servicios HTTP (AuthService, PersonaService, etc.)
│   └── shared/             # Utilidades compartidas
├── assets/                 # Imágenes y recursos estáticos
├── environments/           # Configuración dev/prod
├── design-tokens.css       # Variables CSS del sistema de diseño
└── styles.css              # Estilos globales
```

## Convenciones

- **Componentes**: Naming con kebab-case (ej: `bar-nav/`, `experiencia/`)
- **Servicios**: Sufijo `Service` (ej: `ExperienciaService`)
- **Modelos/Interfaces**: Archivos en carpeta `models/`
- **CSS Tokens**: Prefijo `--color-` para colores, `--spacing-` para espaciado
- **Notificaciones**: Usar `ngx-toastr` para alerts

## Sistema de Diseño

Paleta principal:
- Primary: `#6366f1` (índigo)
- Accent: `#22d3ee` (cyan)
- Background: `#0f172a`
- Secondary BG: `#1e293b`

## Backend

Se conecta a un backend Spring Boot via API REST:
- Endpoints: `/api/persona`, `/api/experiencia`, `/api/estudios`, `/api/proyectos`, `/api/skills`
- Autenticación: JWT con interceptor `AuthInterceptor`

## Configuración de Entornos

- `src/environments/environment.ts` - Desarrollo
- `src/environments/environment.prod.ts` - Producción

## Notas para IA

- Override de `esbuild >=0.28.1` en `pnpm.overrides` para vulnerabilidad
- Dependencias gestionadas con pnpm (no npm ni yarn)
- Node >=22.12.0 requerido