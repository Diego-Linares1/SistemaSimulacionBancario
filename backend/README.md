# Backend - MiBanquito API

API de gestión de solicitudes de préstamos con arquitectura de 3 capas + servicio externo simulado.

## 📋 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuración de DB
│   ├── controllers/       # Controladores (lógica de aplicación)
│   ├── services/         # Servicios de negocio
│   ├── middleware/       # Middlewares (auth, etc)
│   ├── routes/           # Definición de rutas
│   ├── utils/            # Utilidades (cifrado, etc)
│   ├── index.js          # Servidor principal
│   └── initDB.js         # Script de inicialización de BD
├── tests/                # Tests unitarios
├── .env                  # Variables de entorno
└── package.json
```

## 🚀 Instalación y Setup

### 1. Requisitos Previos
- Node.js 16+
- PostgreSQL 12+
- npm

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Configuración de Base de Datos
Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mibanquito
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Inicializar Base de Datos
```bash
npm run init-db
```

Este comando:
- Crea las tablas necesarias
- Inserta usuarios por defecto:
  - **Admin**: username=`admin`, password=`admin123`
  - **Cliente**: username=`cliente`, password=`cliente123`

### 5. Iniciar Servidor
```bash
# Producción
npm start

# Desarrollo (con hot reload)
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🧪 Pruebas

### Ejecutar Tests
```bash
# Todos los tests
npm test

# Watch mode
npm run test:watch

# Con cobertura
npm run test:coverage
```

### Casos de Prueba

#### UT-01: Cálculo de Interés Compuesto
- Categoría A (1% mensual)
- Categoría B (2% mensual)
- Categoría C (3.5% mensual)

#### UT-02: Validación de Montos
- Monto <= 5x ingreso (aprobado automático)
- Monto entre 5x y 10x (revisión manual)
- Monto > 10x (rechazado)

#### SEC-01: Cifrado de DNI
- DNI cifrado con AES
- No accesible en texto plano
- Descifrado correctamente con clave

#### STUB-01: Credit Check
- DNI 12345678 → Categoría A
- DNI 87654321 → Categoría B
- DNI 11111111 → Categoría C

## 📡 Endpoints

### Autenticación
```
POST /auth/login
POST /auth/register
```

### Solicitudes de Préstamo
```
POST   /loans                 # Crear solicitud
GET    /loans                 # Listar todas (admin)
GET    /loans/:id             # Obtener una solicitud
PUT    /loans/:id             # Actualizar estado (admin)
```

### Health Check
```
GET /health
```

## 🔒 Seguridad

- ✅ JWT para autenticación
- ✅ Bcryptjs para hash de contraseñas
- ✅ Cifrado AES para datos sensibles (DNI)
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Validación de entrada

## 📊 Arquitectura

### 3 Capas
1. **Controladores**: Manejan requests/responses
2. **Servicios**: Lógica de negocio
3. **Database**: Persistencia de datos

### Servicios Externos Simulados
- **CreditCheckService**: Valida crédito por DNI
- **InterestService**: Calcula intereses
- **ValidationService**: Valida montos

## 📝 Ejemplo de Uso

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Crear Solicitud
```bash
curl -X POST http://localhost:3000/loans \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Juan",
    "apellido":"Pérez",
    "dni":"12345678",
    "ingreso":3000,
    "monto":10000,
    "plazo":12
  }'
```

### 3. Obtener Solicitudes (como admin)
```bash
curl -X GET http://localhost:3000/loans \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛠️ Variables de Entorno

```env
PORT=3000                                    # Puerto del servidor
DB_HOST=localhost                           # Host de PostgreSQL
DB_PORT=5432                               # Puerto de PostgreSQL
DB_NAME=mibanquito                          # Nombre de la BD
DB_USER=postgres                            # Usuario de BD
DB_PASSWORD=postgres                        # Contraseña de BD
JWT_SECRET=your_jwt_secret_key              # Clave secreta JWT
ENCRYPTION_KEY=32_char_encryption_key       # Clave de cifrado AES
NODE_ENV=development                        # Ambiente
```

## 📚 Referencias

- [Express.js Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)

## 📄 Licencia

ISC
