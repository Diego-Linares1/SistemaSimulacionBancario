src/
├── app/
│   ├── app.config.ts        # Configuración global (providers, interceptors)
│   ├── app.routes.ts        # Rutas principales (Lazy Loading)
│   │
│   ├── core/                # COSAS ÚNICAS (Singleton)
│   │   ├── auth/            # Servicios de autenticación y Guards
│   │   ├── interceptors/    # Interceptores HTTP funcionales
│   │   ├── services/        # Servicios globales (ej: ApiService, Logger)
│   │   └── models/          # Modelos/Interfaces globales (ej: User, APIResponse)
│   │
│   ├── shared/              # COSAS REUTILIZABLES (Dumb Components)
│   │   ├── components/      # UI pura (Botones, Inputs, Modales)
│   │   ├── directives/      # Directivas de uso general
│   │   ├── pipes/           # Pipes de transformación
│   │   └── utils/           # Funciones helper puras (validadores, formateadores)
│   │
│   ├── layout/              # ESTRUCTURA VISUAL (Shell)
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── footer/
│   │
│   └── features/            # LÓGICA DE NEGOCIO (Smart Components)
│       ├── dashboard/       # Módulo funcional completo (ej: Dashboard)
│       │   ├── dashboard.component.ts
│       │   ├── dashboard.routes.ts
│       │   └── components/  # Componentes exclusivos de este feature
│       │
│       └── products/        # Otro módulo funcional (ej: Productos)
│           ├── product-list/
│           ├── product-detail/
│           ├── services/    # Servicios exclusivos de productos
│           └── product.routes.ts
│
├── assets/                  # Imágenes, fuentes, i18n
└── environments/            # Variables de entorno