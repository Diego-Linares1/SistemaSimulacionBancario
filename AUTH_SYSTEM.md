# Sistema de Autenticación - MiBanco

## ✅ Implementado

Se ha agregado un sistema completo de autenticación con:

### 1. **Servicio de Autenticación** (`auth.service.ts`) 
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Logout
- ✅ Gestión de tokens JWT
- ✅ Almacenamiento en localStorage

### 2. **Guards de Rutas** (`auth.guard.ts`)
- ✅ `authGuard`: Protege rutas autenticadas
- ✅ `adminGuard`: Protege rutas solo para admins

### 3. **Componente de Login** (`login.component.ts`)
- ✅ Formulario reactivo con validaciones
- ✅ Toggle entre Login y Registro
- ✅ Selección de rol (Cliente/Admin)
- ✅ Redirección según rol

### 4. **Header Actualizado**
- ✅ Muestra email del usuario conectado
- ✅ Botón de Cerrar Sesión
- ✅ Navegación dinámica según rol
- ✅ Link activo en navegación

## 🔐 Credenciales de Prueba

### Cliente
- Email: `cliente@example.com`
- Contraseña: `123456`
- Rol: Cliente

### Admin
- Email: `admin@example.com`
- Contraseña: `123456`
- Rol: Admin

## 🚀 Flujo de Funcionamiento

1. **Usuario llega a la app** → Redirigido a `/login`
2. **Login/Registro** → Se validan credenciales en el backend
3. **Backend devuelve token JWT** → Se guarda en localStorage
4. **Según el rol:**
   - **Cliente** → Redirigido a `/solicitar` (formulario de préstamo)
   - **Admin** → Redirigido a `/admin` (tabla de solicitudes)
5. **Token se envía en headers** de peticiones autenticadas
6. **Logout** → Se limpia localStorage y redirige a `/login`

## 📊 Rutas Protegidas

| Ruta | Protección | Acceso |
|------|-----------|--------|
| `/login` | ❌ No | Todos |
| `/solicitar` | ✅ Sí (cliente) | Solo clientes |
| `/admin` | ✅ Sí (admin) | Solo admins |

## 🔄 Flujo de Tokens

```
1. POST /auth/login
   ├─ Backend valida credenciales
   ├─ Genera JWT token
   └─ Devuelve { token, user }

2. Frontend guarda token en localStorage
   └─ `Authorization: Bearer <token>`

3. Peticiones posteriores incluyen token
   ├─ GET /loans (admin)
   └─ PUT /loans/:id (admin)

4. Backend valifica token
   ├─ Si es válido → Procesa solicitud
   └─ Si es inválido → Error 401
```

## 💾 Datos Almacenados

En `localStorage`:
- `token`: JWT token para autenticación
- `user`: Objeto con email, id, role

```javascript
// Ejemplo
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "user-123",
    email: "cliente@example.com",
    role: "client"
  }
}
```

## 🧪 Pruebas

### 1. Registrarse como nuevo cliente
```
1. Click en "¿No tienes cuenta? Regístrate"
2. Llenar formulario:
   - Email: nuevocliente@example.com
   - Contraseña: 123456
   - Tipo: Cliente
3. Hacer click en "Registrarse"
4. Deberías ir al formulario de solicitud
```

### 2. Login como admin
```
1. Click en "¿Ya tienes cuenta? Inicia sesión"
2. Ingresar:
   - Email: admin@example.com
   - Contraseña: 123456
3. Hacer click en "Iniciar Sesión"
4. Deberías ver la tabla de solicitudes
```

### 3. Protección de rutas
```
1. Intenta ir a /admin siendo cliente
2. Serás redirigido a /login
3. Intenta ir a /admin sin autenticación
4. Serás redirigido a /login
```

## 🐛 Troubleshooting

### Error: "Cannot find control with name: 'role'"
- Sólo aparece cuando `!isLogin` (en registro)
- Es correcto, el input está condicional

### Error: "401 Unauthorized"
- Token expiró
- Credenciales inválidas
- Solución: Hacer logout y login nuevamente

### Token no se envía
- Verificar que localStorage tiene el token
- Revisar en DevTools → Application → Storage

## 🔗 Integración con Backend

El backend debe tener implementados:
- ✅ POST /auth/login
- ✅ POST /auth/register
- ✅ Middleware de verificación de JWT
- ✅ CORS configurado
- ✅ Validación de roles

## 📝 Próximos Pasos (Opcional)

1. **Refresh Token**: Renovar JWT automáticamente
2. **Recuperación de Contraseña**: Enviar email de reset
3. **2FA**: Autenticación de dos factores
4. **Social Login**: Google, GitHub, etc.
5. **Session Timeout**: Cerrar sesión por inactividad
