# Portfolio Argentina Programa - Frontend

Aplicación web frontend de portfolio personal desarrollada con Angular como parte del programa "Argentina Programa". Presenta una interfaz moderna con tema oscuro y efectos glassmorphism para mostrar información profesional, experiencia laboral, estudios, proyectos y habilidades técnicas.

## ✨ Características

- **Diseño Moderno**: Interfaz con tema oscuro, gradientes y efectos de glassmorphism
- **Single Page Application**: Navegación fluida sin recargas de página
- **Autenticación JWT**: Sistema de login seguro para edición del contenido
- **Diseño Responsive**: Adaptable a dispositivos móviles, tablets y desktop
- **Diálogos de Edición**: Modales para agregar y editar contenido (usando Angular Material)
- **Sistema de Design Tokens**: Variables CSS organizadas para consistencia visual

## 🚀 Tecnologías Utilizadas

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Angular 21 |
| **UI Components** | Angular Material + Angular CDK |
| **Estilos** | CSS3 con Design Tokens, Bootstrap 5 |
| **HTTP Client** | RxJS + HttpClient de Angular |
| **Notificaciones** | ngx-toastr |
| **Lenguaje** | TypeScript 5.9 |

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── componentes/           # Componentes de la aplicación
│   │   ├── bar-nav/           # Barra de navegación
│   │   ├── persona/           # Sección de información personal
│   │   ├── experiencia/       # Sección de experiencia laboral
│   │   ├── estudios/          # Sección de educación
│   │   ├── proyectos/         # Sección de proyectos
│   │   ├── skill/             # Sección de habilidades
│   │   └── footer/            # Pie de página
│   ├── dialogs/               # Diálogos modales de edición
│   ├── interceptors/          # Interceptores HTTP (Auth)
│   ├── models/                # Modelos e interfaces TypeScript
│   ├── servicios/             # Servicios para comunicación con API
│   └── shared/                # Componentes y utilidades compartidas
├── assets/                    # Imágenes, iconos y recursos estáticos
├── environments/              # Configuración de entornos (dev/prod)
├── design-tokens.css          # Variables CSS del sistema de diseño
└── styles.css                 # Estilos globales
```

## 📋 Secciones del Portfolio

1. **Persona**: Información personal, foto de perfil y descripción profesional
2. **Experiencia**: Historial laboral con cargos, empresas y fechas
3. **Estudios**: Formación académica y certificaciones
4. **Proyectos**: Portfolio de proyectos realizados con imágenes y descripciones
5. **Skills**: Habilidades técnicas con indicadores de nivel

## 🛠️ Instalación y Ejecución

### Requisitos Previos

- Node.js 18+ instalado
- npm o pnpm como gestor de paquetes

### Pasos para ejecutar

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd Argentina-Programa-Frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200/`

4. **Construir para producción**:
   ```bash
   npm run build
   ```
   Los archivos de producción se generarán en el directorio `dist/`

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de **Design Tokens** para mantener consistencia visual:

### Paleta de Colores

| Token | Color | Uso |
|-------|-------|-----|
| `--color-primary` | #6366f1 | Color principal (índigo) |
| `--color-accent` | #22d3ee | Color de acento (cyan) |
| `--color-bg-primary` | #0f172a | Fondo principal |
| `--color-bg-secondary` | #1e293b | Fondo secundario |

### Efectos Visuales

- **Glassmorphism**: Cards con efecto de vidrio esmerilado
- **Gradientes**: Transiciones suaves entre colores primarios
- **Glow Effects**: Resplandores sutiles en elementos interactivos

## 🔗 Conexión con Backend

La aplicación se conecta al backend de Spring Boot mediante servicios HTTP:

- `AuthService`: Autenticación y gestión de tokens JWT
- `PersonaService`: Datos del perfil personal
- `ExperienciaService`: Experiencia laboral
- `EstudiosService`: Información académica
- `ProyectoService`: Proyectos del portfolio
- `SkillService`: Habilidades técnicas

## 📱 Responsive Design

La aplicación está optimizada para diferentes tamaños de pantalla:

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 📄 Licencia

Este proyecto fue desarrollado como parte del programa educativo "Argentina Programa".

---

⭐ Desarrollado con Angular 21 y mucho ☕
