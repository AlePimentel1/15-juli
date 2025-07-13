/*
  # Crear tabla de confirmaciones para quinceañera

  1. Nueva Tabla
    - `confirmaciones`
      - `id` (uuid, primary key)
      - `nombre` (text, required)
      - `apellido` (text, required) 
      - `telefono` (text, opcional)
      - `asistencia` (text, required - 'si' o 'no')
      - `created_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en tabla `confirmaciones`
    - Permitir inserción pública para el formulario
    - Permitir lectura solo para usuarios autenticados
*/

CREATE TABLE IF NOT EXISTS confirmaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  apellido text NOT NULL,
  telefono text,
  asistencia text NOT NULL CHECK (asistencia IN ('si', 'no')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE confirmaciones ENABLE ROW LEVEL SECURITY;

-- Política para permitir que cualquiera pueda insertar confirmaciones
CREATE POLICY "Permitir inserción pública de confirmaciones"
  ON confirmaciones
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para que usuarios autenticados puedan leer confirmaciones
CREATE POLICY "Usuarios autenticados pueden leer confirmaciones"
  ON confirmaciones
  FOR SELECT
  TO authenticated
  USING (true);