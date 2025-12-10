/**
 * SCRIPT PARA INICIALIZAR LA BASE DE DATOS
 */

const pool = require('./config/database');
const bcrypt = require('bcryptjs');

const initDB = async () => {
  try {
    console.log('🔧 Inicializando base de datos...');

    // Crear tabla de usuarios
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('cliente', 'analista', 'admin')) DEFAULT 'cliente',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Crear tabla de solicitudes
    const createLoansTable = `
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
    `;

    // Ejecutar creación de tablas
    await pool.query(createUsersTable);
    await pool.query(createLoansTable);

    console.log('✅ Tablas creadas exitosamente');

    // Verificar si existen usuarios por defecto
    const userCheck = await pool.query('SELECT COUNT(*) FROM usuarios');
    const userCount = parseInt(userCheck.rows[0].count);

    if (userCount === 0) {
      console.log('📝 Creando usuarios por defecto...');

      // Crear usuario admin
      const adminPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO usuarios (nombre, username, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Admin', 'admin', adminPassword, 'admin']
      );

      // Crear usuario analista
      const analistaPassword = await bcrypt.hash('analista123', 10);
      await pool.query(
        'INSERT INTO usuarios (nombre, username, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Analista', 'analista', analistaPassword, 'analista']
      );

      // Crear usuario cliente
      const clientPassword = await bcrypt.hash('cliente123', 10);
      await pool.query(
        'INSERT INTO usuarios (nombre, username, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Cliente', 'cliente', clientPassword, 'cliente']
      );

      console.log('✅ Usuarios por defecto creados');
      console.log('👤 Admin: username=admin, password=admin123');
      console.log('👤 Analista: username=analista, password=analista123');
      console.log('👤 Cliente: username=cliente, password=cliente123');
    }

    console.log('✨ Base de datos inicializada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

initDB();
