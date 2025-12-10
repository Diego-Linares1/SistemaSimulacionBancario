# Guía de Conexión Frontend - Backend

## ✅ Cambios Realizados

### 1. **Servicio de Préstamos (`loan.service.ts`)**
- ✅ Importado `HttpHeaders` para manejar tokens
- ✅ Actualizado interfaz `LoanRequest` con todos los campos necesarios
- ✅ Agregado método `addRequest()` para crear solicitudes
- ✅ Configurado `getAllLoans()` con headers de autenticación
- ✅ Agregado método `updateLoanStatus()` para aprobar/rechazar
- ✅ Agregada lógica para enviar token JWT en headers

### 2. **Componente del Formulario (`request-form.component.ts`)**
- ✅ Agregados estados: `loading`, `errorMessage`, `successMessage`
- ✅ Implementada llamada HTTP con `.subscribe()` 
- ✅ Manejo de errores y respuestas del servidor
- ✅ Validación del formulario mejorada

### 3. **Template del Formulario (`request-form.component.html`)**
- ✅ Agregados mensajes de alerta (éxito/error)
- ✅ Botón muestra "Enviando..." mientras se procesa
- ✅ Botón deshabilitado mientras se envía o el formulario es inválido

### 4. **Componente de la Tabla (`request-table.component.ts`)**
- ✅ Actualizado para usar `updateLoanStatus()` correcto
- ✅ Mejorado manejo de errores con mensajes descriptivos
- ✅ Agregado console.log para debugging

## 🚀 Cómo Probar la Conexión

### Paso 1: Asegúrate que el Backend está corriendo
```bash
cd c:\Users\dslm_\Escritorio\MIBANQUITOFINAL\backend
npm run dev
```
Deberías ver en la consola:
```
Server running on port 3000
```

### Paso 2: Asegúrate que PostgreSQL está corriendo
```bash
# En PowerShell (como administrador)
net start PostgreSQL-x64-16  # o tu versión
```

### Paso 3: Corre el Frontend
```bash
cd c:\Users\dslm_\Escritorio\MIBANQUITOFINAL\frontend
ng serve
```
Abre: `http://localhost:4200`

### Paso 4: Prueba el Flujo

#### **Cliente - Crear Solicitud**
1. Navega a `http://localhost:4200/solicitar`
2. Llena el formulario:
   - Nombre: Juan
   - Apellido: Pérez
   - DNI: 12345678
   - Ingreso: 5000
   - Monto: 10000
   - Plazo: 12
3. Haz clic en "Solicitar"
4. Deberías ver: ✅ "¡Solicitud enviada exitosamente!"

#### **Admin - Ver y Aprobar Solicitudes**
1. Necesitas obtener un token primero (o el backend debe permitir acceso sin token para GET)
2. Navega a `http://localhost:4200/admin`
3. Deberías ver las solicitudes en la tabla
4. Haz clic en "Aprobar" o "Rechazar"

## 🔧 Configuración de CORS

El backend ya tiene CORS configurado para aceptar requests desde:
- `http://localhost:4200` (Angular frontend)
- `http://localhost:3000` (Local testing)

Si necesitas cambiar, edita `backend/src/index.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true
}));
```

## 🔐 Autenticación

### Token JWT
- El formulario de cliente NO requiere token
- Los endpoints de admin (GET /loans, PUT /loans/:id) requieren token
- El token se envía en el header: `Authorization: Bearer <token>`

### Login (si implementas)
```typescript
// Ejemplo en auth.service.ts
login(email: string, password: string) {
  return this.http.post('http://localhost:3000/auth/login', {
    email, password
  }).pipe(
    tap(response => {
      localStorage.setItem('token', response.token);
    })
  );
}
```

## 📊 URLs del Backend Disponibles

| Método | URL | Descripción | Auth |
|--------|-----|-------------|------|
| POST | `/loans` | Crear solicitud | ❌ No |
| GET | `/loans` | Obtener todas | ✅ Admin |
| GET | `/loans/:id` | Obtener por ID | ❌ No |
| PUT | `/loans/:id` | Actualizar estado | ✅ Admin |
| DELETE | `/loans/:id` | Eliminar | ✅ Admin |

## 🐛 Troubleshooting

### Error: "Cannot find control with name 'apellido'"
✅ **Solucionado** - El servicio ahora incluye todos los campos

### Error: "No provider for HttpClient"
✅ **Solucionado** - Se agregó `provideHttpClient()` en `app.config.ts`

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"
- **Causa**: Backend no está corriendo en puerto 3000
- **Solución**: Ejecuta `npm run dev` en la carpeta backend

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
- **Causa**: CORS no configurado en el backend
- **Solución**: Backend ya tiene CORS configurado, verifica que esté corriendo

## 📝 Flujo de Datos

```
Frontend (Angular 18)
     ↓
[LoanService.addRequest()]
     ↓
POST http://localhost:3000/loans
     ↓
Backend (Express + Node.js)
     ↓
[loanController.createLoanRequest()]
     ↓
PostgreSQL Database
     ↓
Response JSON
     ↓
[request-form.component.ts subscribe()]
     ↓
Mostrar mensaje de éxito/error
```

## ✨ Próximos Pasos (Opcional)

1. **Implementar Login**: Crear servicio de autenticación
2. **Validaciones avanzadas**: Mostrar errores de validación por campo
3. **Indicador de progreso**: Progress bar mientras se envía
4. **Paginación**: Para la tabla de solicitudes
5. **Búsqueda/Filtro**: Filtrar por estado en la tabla

## 📞 Soporte

Si hay errores:
1. Revisa la consola del navegador (F12)
2. Revisa la consola del servidor backend
3. Verifica que ambos (frontend y backend) están corriendo
4. Comprueba que PostgreSQL está conectada
