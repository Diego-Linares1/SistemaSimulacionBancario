# 🗄️ Guía de Setup PostgreSQL para MiBanquito

## Opción 1: Usando PostgreSQL Instalado Localmente

### En Windows
1. Descarga PostgreSQL desde https://www.postgresql.org/download/windows/
2. Instala con las opciones por defecto
3. Durante la instalación, establece contraseña para usuario `postgres`
4. Abre pgAdmin (interfaz gráfica)
5. Crea una nueva base de datos llamada `mibanquito`

### En macOS
```bash
# Con Homebrew
brew install postgresql@15
brew services start postgresql@15

# Acceder a PostgreSQL
psql postgres
```

### En Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql
```

## Opción 2: Usando Docker (Recomendado)

```bash
# Crear y ejecutar contenedor PostgreSQL
docker run --name mibanquito-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mibanquito \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:15
```

## Verificación de Conexión

### Usando psql (Command Line)
```bash
psql -h localhost -U postgres -d mibanquito
# Ingresa contraseña: postgres
```

### Usando pgAdmin (GUI)
1. Abre pgAdmin
2. Right-click en "Servers" → Register → Server
3. Configura:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: mibanquito

## Información de Conexión

- **Host**: localhost
- **Port**: 5432
- **Database**: mibanquito
- **User**: postgres
- **Password**: postgres

## Script SQL para Crear Tablas

Ejecuta este script en PostgreSQL para crear las tablas necesarias:

```sql
-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('cliente', 'analista', 'admin')) DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni_encriptado VARCHAR(255) NOT NULL,
  ingreso DECIMAL(10, 2) NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  plazo INTEGER NOT NULL,
  categoria_credito VARCHAR(1),
  score_credito INTEGER,
  saldo_final DECIMAL(12, 2),
  revision_manual BOOLEAN DEFAULT FALSE,
  estado VARCHAR(30) CHECK (estado IN ('APROBADA', 'RECHAZADA', 'PENDIENTE')) DEFAULT 'PENDIENTE',
  motivo_rechazo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Insertar Usuarios por Defecto

Después de crear las tablas, puedes insertar usuarios de prueba (nota: las contraseñas deben estar hasheadas con bcryptjs en producción):

```sql
-- Usuario Admin
INSERT INTO usuarios (nombre, username, password_hash, role) 
VALUES ('Admin', 'admin', '$2a$10$...', 'admin123');

-- Usuario Analista
INSERT INTO usuarios (nombre, username, password_hash, role) 
VALUES ('Analista', 'analista', '$2a$10$...', 'analista123');

-- Usuario Cliente
INSERT INTO usuarios (nombre, username, password_hash, role) 
VALUES ('Cliente', 'cliente', '$2a$10$...', 'cliente123');
```

**Nota**: Es preferible usar `npm run init-db` que automatiza este proceso e inserta usuarios con contraseñas correctamente hasheadas.

## Próximos Pasos

Una vez que PostgreSQL esté corriendo:

```bash
# Regresa al directorio del backend
cd backend

# Instala dependencias
npm install

# Inicializa las tablas de la BD
npm run init-db

# Inicia el servidor
npm run dev
```

## Troubleshooting

### Error: "ECONNREFUSED"
- Verifica que PostgreSQL esté corriendo
- Confirma el host/port en .env

### Error: "Role 'postgres' does not exist"
- Crea el usuario: `createuser -s postgres`

### Error: "Database 'mibanquito' does not exist"
- El script `npm run init-db` crea la BD automáticamente

## Verificar Datos Después de Init

```bash
psql -h localhost -U postgres -d mibanquito

-- Ver usuarios creados
SELECT * FROM usuarios;

-- Ver solicitudes
SELECT * FROM solicitudes;

-- Salir
\q
```

---

¿Necesitas ayuda? Consulta el README.md principal.
