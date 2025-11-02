<div align="center">

# 🏦 Webapp Créditos PYMES

### Sistema de gestión de créditos para pequeñas y medianas empresas

---

</div>

## 📋 Requisitos previos

Asegúrate de tener instalado:

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | v18 o superior |
| npm         | incluido con Node |

---

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/CreditosPYMES-NCG27/webapp-creditos-pymes.git

# Navegar al directorio
cd webapp-creditos-pymes

# Instalar dependencias
npm install
```

### ⚙️ Configuración del entorno

Antes de ejecutar la aplicación, crea un archivo **.env** en la raíz del proyecto con el siguiente contenido (usa las credenciales de tu proyecto en Supabase):

```bash
# .env
VITE_SUPABASE_URL=URL-SUPABASE
VITE_SUPABASE_ANON_KEY=Publishable-key
```

> 💡 Puedes usar el archivo `.env.example` incluido en el repositorio como plantilla.

Luego, inicia el servidor de desarrollo:

```bash
# Ejecutar en modo desarrollo
npm run dev
```

---

## 📦 Dependencias principales

Este proyecto utiliza **Vite + React** como base, más:

| Dependencia | Propósito |
|-------------|-----------|
| **Bootstrap** | Estilos responsivos y componentes UI |
| **@popperjs/core** | Soporte para componentes interactivos de Bootstrap |
| **react-router-dom** | Sistema de enrutamiento para la aplicación |

---

## 📁 Estructura del proyecto

```
proyecto/
│
├── 📂 public/              # Archivos públicos estáticos
│
└── 📂 src/
    ├── 📂 assets/          # Imágenes, íconos, etc.
    ├── 📂 components/      # Componentes globales reutilizables
    ├── 📂 features/        # Módulos y features específicos de la aplicación
    ├── 📂 pages/           # Páginas que componen las rutas de la aplicación
    ├── 📂 routes/          # Configuración del sistema de rutas
    ├── 📂 styles/          # Estilos globales y variables CSS
    │
    ├── App.jsx             # Componente raíz
    └── main.jsx            # Punto de entrada de la aplicación
```

### 📋 Carpetas opcionales

Las siguientes carpetas se pueden agregar dentro de `src/`:

- `hooks/` - Custom hooks globales  
- `context/` - Contextos de React  
- `store/` - Gestión de estado global  
- `utils/` - Funciones helper y utilidades  
- `data/` - Data mock y constantes  
- `auth/` - Lógica de autenticación  
- ...

> Cada desarrollador las incorpora según los requisitos del proyecto.

---

<div align="center">

**Desarrollado con ❤️ por el equipo NCG27**

</div>