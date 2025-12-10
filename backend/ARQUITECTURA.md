# 🏗️ Arquitectura del Backend - MiBanquito

## 📐 Diagrama de Arquitectura (3 Capas + Stub)

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA PRESENTACIÓN                        │
│                    (Express Routes)                         │
│  /auth/login  /loans  /loans/:id  /loans/:id               │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    CAPA APLICACIÓN                          │
│                    (Controllers)                            │
│  authController     loanController                          │
│  - login()         - createLoanRequest()                    │
│  - register()      - getAllLoanRequests()                   │
│                    - getLoanRequestById()                   │
│                    - updateLoanRequest()                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────┬──────────────────────┐
│        CAPA DE SERVICIOS             │   SERVICIOS EXTERNOS │
│     (Business Logic)                 │     (STUBS)          │
│                                      │                      │
│ interestService                      │ creditCheckService   │
│ - calcularInteresCompuesto()         │ - checkCredit()      │
│                                      │                      │
│ validationService                    │ (Simula API externa) │
│ - validarMonto()                     │ Score: 0-1000        │
│                                      │ Categoría: A,B,C     │
│ encryptionService                    │                      │
│ - encryptDNI()                       │                      │
│ - decryptDNI()                       │                      │
└───────────────────────┬──────────────┴──────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    CAPA DATA                                │
│                (Database/PostgreSQL)                        │
│                                                             │
│  TABLA USUARIOS          │  TABLA SOLICITUDES              │
│  ├─ id                   │  ├─ id                          │
│  ├─ nombre               │  ├─ nombre                      │
│  ├─ username             │  ├─ apellido                    │
│  ├─ password_hash        │  ├─ dni_encriptado             │
│  ├─ role                 │  ├─ ingreso                     │
│  └─ timestamps           │  ├─ monto                       │
│                          │  ├─ plazo                       │
│                          │  ├─ categoria_credito           │
│                          │  ├─ score_credito               │
│                          │  ├─ saldo_final                 │
│                          │  ├─ revision_manual             │
│                          │  ├─ estado                      │
│                          │  └─ timestamps                  │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Solicitud de Préstamo

```
1. CLIENTE ENVÍA FORMULARIO
   ├─ nombre, apellido, dni, ingreso, monto, plazo
   │
2. CONTROLADOR (loanController.createLoanRequest)
   ├─ Valida campos requeridos
   │
3. SERVICIO DE VALIDACIÓN
   ├─ validarMonto(monto, ingreso)
   ├─ Retorna: {valido, revision_manual}
   │
4. SERVICIO DE CREDIT CHECK (STUB)
   ├─ checkCredit(dni)
   ├─ Retorna: {score, categoria, estado}
   │
5. SERVICIO DE INTERÉS
   ├─ calcularInteresCompuesto(monto, plazo, categoria)
   ├─ Retorna: {saldo_final, tasa_interes}
   │
6. UTILIDAD DE CIFRADO
   ├─ encryptDNI(dni)
   ├─ Almacena DNI cifrado en BD
   │
7. BASE DE DATOS
   ├─ INSERT solicitudes
   ├─ Retorna solicitud con ID
   │
8. RESPUESTA AL CLIENTE
   └─ {mensaje, solicitud, interes_total}
```

## 🔐 Seguridad Implementada

### SEC-01: Cifrado de DNI
- **Método**: AES (Advanced Encryption Standard)
- **Librería**: crypto-js
- **Dónde**: En la columna `dni_encriptado` de solicitudes
- **Flujo**: DNI → encryptDNI() → BD → decryptDNI() → DNI original

### Autenticación
- **Método**: JWT (JSON Web Tokens)
- **Hash de Contraseñas**: bcryptjs (10 rounds)
- **Expiración**: 24 horas

### Headers de Seguridad
- **Helmet**: Protección contra vulnerabilidades comunes
- **CORS**: Restricción a orígenes específicos
- **Validación**: Entrada validada en todos los endpoints

## 📊 Casos de Prueba

### UT-01: Interés Compuesto
```javascript
// Fórmula: Saldo_Final = Monto × (1 + r)^n
Ejemplo: 1000 × (1.01)^12 = 1126.83

Tasas según categoría:
- A: 1% mensual
- B: 2% mensual
- C: 3.5% mensual
```

### UT-02: Validación de Montos
```javascript
monto <= 5 × ingreso      → APROBADO AUTOMÁTICO
5 × ingreso < monto <= 10 × ingreso  → REVISIÓN MANUAL
monto > 10 × ingreso      → RECHAZADO
```

### SEC-01: Cifrado
```javascript
DNI: "12345678"
Cifrado: "U2FsdGVkX1..."
Descifrado: "12345678" ✓
```

### STUB-01: Credit Check
```javascript
DNI: "12345678" → Score: 850, Categoría: A
DNI: "87654321" → Score: 650, Categoría: B
DNI: "11111111" → Score: 400, Categoría: C
DNI: "XXXXXXXX" → Random (0-1000)
```

## 📈 Resultados de Tests

```
Test Suites: 4 passed, 4 total
Tests:       22 passed, 22 total
- UT-01: 5 tests ✓
- UT-02: 7 tests ✓
- SEC-01: 5 tests ✓
- STUB-01: 5 tests ✓
```

## 🚀 Endpoints Disponibles

### Autenticación
```
POST /auth/login
Body: { username, password }

POST /auth/register
Body: { nombre, username, password, role }
```

### Solicitudes
```
POST /loans
Body: { nombre, apellido, dni, ingreso, monto, plazo }
Response: { solicitud, interes_total, tasa_interes }

GET /loans (admin)
Auth: Bearer JWT_TOKEN
Response: [{ solicitud1 }, { solicitud2 }, ...]

GET /loans/:id
Response: { solicitud }

PUT /loans/:id (admin)
Auth: Bearer JWT_TOKEN
Body: { estado, motivo_rechazo }
```

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Express.js |
| BD | PostgreSQL |
| Auth | JWT + bcryptjs |
| Seguridad | Helmet + CORS |
| Cifrado | Crypto-JS |
| Testing | Jest |
| Dev | Nodemon |

## 📚 Archivos Clave

```
src/
├── index.js                 # Servidor principal
├── initDB.js               # Inicializador de BD
├── config/
│   └── database.js         # Pool de conexiones
├── controllers/
│   ├── authController.js   # Login/Registro
│   └── loanController.js   # CRUD Solicitudes
├── services/
│   ├── interestService.js  # Cálculo de interés
│   ├── validationService.js # Validación de montos
│   └── creditCheckService.js # Stub de credit check
├── middleware/
│   └── auth.js             # JWT + Roles
├── routes/
│   ├── authRoutes.js       # Rutas de auth
│   └── loanRoutes.js       # Rutas de solicitudes
└── utils/
    └── encryption.js       # Cifrado AES
```

---

**Estado**: ✅ Completo y Testeado
**Última actualización**: 9 de Diciembre de 2025
