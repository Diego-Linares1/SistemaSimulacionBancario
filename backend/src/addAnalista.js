/**
 * Script para agregar el usuario analista
 */
require('dotenv').config();
const pool = require('./config/database');
const bcrypt = require('bcryptjs');

const addAnalista = async () => {
  try {
    console.log('🔧 Verificando usuario analista...');

    // Verificar si el analista ya existe
    const checkResult = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1',
      ['analista']
    );

    if (checkResult.rows.length > 0) {
      console.log('ℹ️ El usuario analista ya existe');
      
      // Mostrar todos los usuarios
      const allUsers = await pool.query('SELECT username, role FROM usuarios ORDER BY role, username');
      console.log('\n📋 Usuarios en el sistema:');
      allUsers.rows.forEach(user => {
        console.log(`  - ${user.username} (${user.role})`);
      });
    } else {
      // Crear el usuario analista
      const analistaPassword = await bcrypt.hash('analista123', 10);
      await pool.query(
        'INSERT INTO usuarios (nombre, username, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Analista', 'analista', analistaPassword, 'analista']
      );
      
      console.log('✅ Usuario analista creado exitosamente');
      console.log('👤 Username: analista');
      console.log('🔑 Password: analista123');
      console.log('👔 Role: analista');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addAnalista();
