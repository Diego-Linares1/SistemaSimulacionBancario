/**
 * Script para agregar columna user_id a la tabla solicitudes
 */
require('dotenv').config();
const pool = require('./config/database');

const addUserIdColumn = async () => {
  try {
    console.log('🔧 Agregando columna user_id a solicitudes...');

    // Agregar columna user_id
    await pool.query(`
      ALTER TABLE solicitudes 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES usuarios(id)
    `);

    console.log('✅ Columna user_id agregada exitosamente');

    // Verificar columnas
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'solicitudes'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Columnas de la tabla solicitudes:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addUserIdColumn();
