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

## Seguridad

### Docker / cabeceras y CSP

- Cabeceras de seguridad (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, CSP, Permissions-Policy) definidas en `netlify.toml`. No duplicar como `<meta>` en `index.html` (se removieron por redundancia).
- CSP `connect-src` apunta al backend `https://argentina-programa-backend.fly.dev`.
- Pendiente (deuda técnica): `script-src` usa `'unsafe-inline'` y `img-src` incluye `https:` amplio; evaluar endurecerlos.

### Autenticación

- JWT almacenado en `sessionStorage` (`AuthService`), enviado por `AuthInterceptor` como `Authorization: Bearer`.
- Expiración hardcodeada a 1h en `AuthService.setToken()` en lugar de leer el claim `exp` del JWT. Pendiente: derivar del token y evaluar cookie `HttpOnly` (requiere cambios en backend).
- `ErrorInterceptor` cierra sesión y redirige ante 401/403.

### Auditoría de dependencias

- Ejecutar `pnpm audit` antes de cada release. Objetivo: 0 vulnerabilidades.
- El workflow `.github/workflows/security.yml` corre en push/PR a `master`/`main` y semanalmente, con `pnpm audit --audit-level=moderate` y **sin** `continue-on-error`, por lo que vulnerabilidades moderadas o superiores rompen el pipeline.
- Renovate (`.renovate.json`) agrupa y auto-fusiona parches/minors de `@angular/*` y `ngx-toastr`.

## Notas para IA

- Overrides en `pnpm.overrides` para mitigar vulnerabilidades de paquetes transitivos: `picomatch >=4.0.4`, `minimatch >=10.0.1`, `@modelcontextprotocol/sdk >=1.26.0`, `tar >=7.5.21`, `rollup >=4.59.0`, `@hono/node-server >=1.19.10`, `hono >=4.13.5`, `immutable >=5.1.5`, `undici >=8.9.0`, `express-rate-limit >=8.2.2`, `fast-uri >=4.1.4`, `qs >=6.16.0`, `ip-address >=10.3.1`, `vite >=7.3.5 <8`, `piscina >=5.2.0`, `esbuild >=0.28.1`, `@babel/core >=7.29.6 <8`, `brace-expansion >=5.0.8`, `nanoid >=3.3.17 <4`, `postcss >=8.5.23`
- Versiones del framework Angular alineadas en `~21.2.24` y Material/CDK en `21.2.14`. Al actualizar, subir todo el conjunto `@angular/*` en bloque.
- Dependencias gestionadas con pnpm (no npm ni yarn)
- Node >=22.12.0 requerido
- Al resolver CVEs, actualizar este archivo si cambian versiones u overrides.