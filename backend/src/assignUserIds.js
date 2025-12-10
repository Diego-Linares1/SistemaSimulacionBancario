/**
 * Script para asignar user_id a solicitudes existentes
 */
require('dotenv').config();
const pool = require('./config/database');

const assignUserIds = async () => {
  try {
    console.log('🔧 Asignando user_id a solicitudes existentes...');

    // Obtener el ID del usuario cliente
    const clienteResult = await pool.query(
      'SELECT id FROM usuarios WHERE username = $1',
      ['cliente']
    );

    if (clienteResult.rows.length === 0) {
      console.log('❌ No se encontró el usuario "cliente"');
      process.exit(1);
    }

    const clienteId = clienteResult.rows[0].id;
    console.log(`✅ Usuario cliente encontrado con ID: ${clienteId}`);

    // Actualizar todas las solicitudes sin user_id
    const updateResult = await pool.query(
      'UPDATE solicitudes SET user_id = $1 WHERE user_id IS NULL RETURNING id',
      [clienteId]
    );

    console.log(`✅ ${updateResult.rowCount} solicitudes actualizadas`);

    // Verificar el resultado
    const verifyResult = await pool.query(
      'SELECT id, nombre, apellido, user_id FROM solicitudes LIMIT 5'
    );

    console.log('\n📋 Primeras 5 solicitudes:');
    verifyResult.rows.forEach(row => {
      console.log(`  - ID: ${row.id}, Nombre: ${row.nombre} ${row.apellido}, User ID: ${row.user_id}`);
    });

    // Contar solicitudes por usuario
    const countResult = await pool.query(
      'SELECT user_id, COUNT(*) as total FROM solicitudes GROUP BY user_id'
    );

    console.log('\n📊 Solicitudes por usuario:');
    countResult.rows.forEach(row => {
      console.log(`  - User ID ${row.user_id}: ${row.total} solicitudes`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

assignUserIds();
