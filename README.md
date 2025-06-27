# Dashboard de Gastos - Vue Tailwind

Este proyecto es una aplicación de dashboard para la gestión de gastos personales o familiares, construida con Vue.js 3, Pinia para la gestión de estado, Vue Router para la navegación, y Tailwind CSS para el diseño de la interfaz. Permite a los usuarios registrar transacciones (ingresos y gastos), categorizar gastos, asignar transacciones a miembros, visualizar resúmenes financieros y gráficos, y gestionar datos mediante importación/exportación.

## Tabla de Contenidos

- [Funcionalidades Clave](#funcionalidades-clave)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
  - [Tecnologías Principales](#tecnologías-principales)
  - [Estructura de Carpetas](#estructura-de-carpetas)
  - [Flujo de Datos y Componentes](#flujo-de-datos-y-componentes)
- [Instalación y Uso](#instalación-y-uso)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación](#instalación)
  - [Desarrollo](#desarrollo)
  - [Compilación para Producción](#compilación-para-producción)
- [Componentes Principales](#componentes-principales)
  - [Vistas](#vistas)
  - [Componentes Reutilizables](#componentes-reutilizables)
- [Gestión de Estado (Pinia)](#gestión-de-estado-pinia)
- [Enrutamiento (Vue Router)](#enrutamiento-vue-router)
- [Persistencia de Datos](#persistencia-de-datos)

## Funcionalidades Clave

*   **Gestión de Transacciones (CRUD):** Añadir, listar (con filtros de fecha), editar y eliminar ingresos y gastos.
*   **Gestión de Categorías:** Crear, editar y eliminar categorías para los gastos, con asignación de color personalizado.
*   **Gestión de Miembros:** Añadir, editar y eliminar miembros para asignarles transacciones.
*   **Dashboard Financiero:** Visualización de ingresos totales, gastos totales y balance general.
*   **Visualización de Datos:**
    *   Lista de gastos por categoría con barras de progreso.
    *   Gráficos de dona para gastos por categoría.
    *   Gráficos de barras para gastos por miembro.
*   **Filtrado por Fechas:** Permite acotar los datos mostrados a un rango de fechas específico.
*   **Importación/Exportación de Datos:** Guarda y carga todos los datos de la aplicación (transacciones, miembros, categorías) en formato JSON.
*   **Interfaz Responsiva:** Diseño adaptable a diferentes tamaños de pantalla.
*   **Persistencia Local:** Los datos se guardan en el `localStorage` del navegador.

## Arquitectura del Proyecto

### Tecnologías Principales

*   **Vue.js 3:** Framework progresivo de JavaScript para construir interfaces de usuario. (Composition API)
*   **Pinia:** Librería de gestión de estado para Vue.js, intuitiva y modular.
*   **Vue Router:** Librería oficial de enrutamiento para Vue.js.
*   **Tailwind CSS:** Framework CSS de utilidad primero para un diseño rápido y personalizable.
*   **Chart.js:** Librería para crear gráficos interactivos.
*   **Font Awesome:** Biblioteca de iconos vectoriales.
*   **Vite:** Herramienta de frontend moderna para un desarrollo y compilación rápidos.

### Estructura de Carpetas
```
vue-tailwind-dashboard/
├── public/                     # Archivos estáticos
├── src/
│   ├── assets/                 # CSS global, imágenes, etc.
│   ├── components/             # Componentes reutilizables de Vue
│   │   └── charts/             # Componentes de gráficos
│   ├── router/                 # Configuración de Vue Router (index.js)
│   ├── services/               # Lógica de servicios (localStorageService.js)
│   ├── store/                  # Módulos de Pinia (mainStore.js)
│   ├── utils/                  # Funciones de utilidad (formatters.js)
│   ├── views/                  # Componentes de página (DashboardView, ChartsView, etc.)
│   ├── App.vue                 # Componente raíz
│   ├── main.js                 # Punto de entrada de la aplicación
│   └── style.css               # Estilos globales y configuración de Tailwind
├── .gitignore
├── index.html                  # Plantilla HTML principal
├── package.json                # Dependencias y scripts
├── postcss.config.cjs          # Configuración de PostCSS
├── tailwind.config.js          # Configuración de Tailwind CSS
└── vite.config.js              # Configuración de Vite
```

### Flujo de Datos y Componentes
1.  **`main.js`**: Inicializa Vue, Pinia, Vue Router.
2.  **`App.vue`**: Componente raíz con `AppHeader` y `router-view`.
3.  **Store (`store/mainStore.js`)**: Gestiona el estado global (transacciones, miembros, categorías) usando Pinia. Persiste datos en `localStorage` mediante `localStorageService.js`.
4.  **Router (`router/index.js`)**: Define las rutas y asocia vistas.
5.  **Vistas (`views/`)**: Componentes de página que ensamblan componentes más pequeños.
6.  **Componentes (`components/`)**: Elementos de UI reutilizables que interactúan con el store.

## Instalación y Uso

### Prerrequisitos

*   Node.js (v16.x o superior)
*   npm o Yarn

### Instalación

1.  Clona el repositorio (si aplica) o descarga los archivos.
2.  Navega al directorio del proyecto: `cd vue-tailwind-dashboard`
3.  Instala las dependencias:
    ```bash
    npm install
    # o
    yarn install
    ```

### Desarrollo

Ejecuta el servidor de desarrollo con recarga en caliente:
```bash
npm run dev
# o
yarn dev
```
La aplicación estará disponible generalmente en `http://localhost:5173`.

### Compilación para Producción

Genera una compilación optimizada para producción en la carpeta `dist/`:
```bash
npm run build
# o
yarn build
```
Puedes previsualizar la compilación localmente con `npm run preview` o `yarn preview`.

## Componentes Principales

Una descripción detallada de cada componente se encuentra dentro de su respectivo archivo `.vue`.

### Vistas (`src/views/`)
*   **`DashboardView.vue`**: Muestra el resumen financiero, filtros de fecha, lista de transacciones y gastos por categoría.
*   **`ChartsView.vue`**: Presenta gráficos de gastos por categoría y por miembro.
*   **`MembersView.vue`**: Permite la gestión (CRUD) de miembros.
*   **`CategoriesView.vue`**: Permite la gestión (CRUD) de categorías de gastos.

### Componentes Reutilizables (`src/components/`)
*   **`AppHeader.vue`**: Cabecera de la aplicación con el título y la navegación principal.
*   **`CategoryList.vue`**: Muestra una lista de gastos desglosados por categoría con barras de progreso.
*   **`CategoryManager.vue`**: Formulario y lista para gestionar categorías.
*   **`ConfirmationModal.vue`**: Modal genérico para confirmar acciones.
*   **`DataImportExport.vue`**: Botones para importar y exportar datos.
*   **`DateFilter.vue`**: Inputs para seleccionar el rango de fechas del filtro.
*   **`MemberListManager.vue`**: Formulario y lista para gestionar miembros.
*   **`StatsCard.vue`**: Tarjeta para mostrar estadísticas clave (ingresos, gastos, balance).
*   **`TransactionForm.vue`**: Modal con formulario para añadir/editar transacciones.
*   **`TransactionList.vue`**: Tabla que lista las transacciones, agrupadas por fecha.
*   **`charts/CategoryChart.vue`**: Gráfico de dona para visualizar gastos por categoría.
*   **`charts/MemberChart.vue`**: Gráfico de barras para visualizar gastos por miembro.

## Gestión de Estado (Pinia)

El estado global de la aplicación se maneja con Pinia en `src/store/mainStore.js`. Este store centralizado contiene:

*   **State:** `transactions`, `members`, `categories`, filtros de fecha, y estados de UI para modales.
*   **Getters (Computed):** Valores derivados como `filteredTransactions`, `totalIncome`, `totalExpense`, `balance`, `expensesByCategory`, `expensesByMember`.
*   **Actions:** Funciones para realizar operaciones CRUD sobre el estado, manejar la visibilidad de modales, y procesar la importación/exportación de datos.

Los datos se cargan desde `localStorage` al iniciar y se guardan automáticamente cuando cambian, gracias a los `watchers` en el store que utilizan `localStorageService.js`.

## Enrutamiento (Vue Router)

La navegación se gestiona con Vue Router, configurado en `src/router/index.js`. Define las siguientes rutas:

*   `/`: Dashboard (`DashboardView`)
*   `/charts`: Gráficos (`ChartsView`)
*   `/members`: Gestión de Miembros (`MembersView`)
*   `/categories`: Gestión de Categorías (`CategoriesView`)
*   `/:catchAll(.*)`: Redirecciona a `/` para rutas no encontradas.

## Persistencia de Datos

La aplicación utiliza el `localStorage` del navegador para persistir todos los datos del usuario (transacciones, miembros y categorías). Esto se maneja a través del `localStorageService.js`, que es invocado por el store de Pinia.

**Nota:** Dado que `localStorage` es específico del navegador y del dispositivo, los datos no se sincronizan automáticamente entre diferentes navegadores o dispositivos. La funcionalidad de exportación/importación puede usarse para transferir datos manualmente.
