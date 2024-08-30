async function updateSequence(queryInterface, table) {
  try {
    await queryInterface.sequelize.query(`
      DO $$
      DECLARE
        max_id integer;
      BEGIN
        -- Obtener el máximo ID de la tabla
        SELECT MAX(id) INTO max_id FROM ${table};
        
        -- Actualizar la secuencia 'table_id_seq' para que comience desde el siguiente número después del máximo ID
        IF max_id IS NOT NULL THEN
          EXECUTE 'ALTER SEQUENCE ${table}_id_seq RESTART WITH ' || (max_id + 1);
        END IF;
      END $$;
    `);
    console.log(`Secuencia actualizada correctamente para la tabla: ${table}.`);
  } catch (error) {
    console.error(
      `Error al actualizar la secuencia de la tabla: ${table}.`,
      error,
    );
  }
}

module.exports = updateSequence;
