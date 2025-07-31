import { createClient } from '@supabase/supabase-js';

// Verificar si las variables de entorno están configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Solo crear el cliente si las variables están disponibles
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Función para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

export interface Confirmacion {
  id?: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  asistencia: 'si' | 'no';
  created_at?: string;
  cedula?: string;
}

export async function insertarConfirmacion(confirmacion: Omit<Confirmacion, 'id' | 'created_at'>) {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Por favor conecta tu proyecto de Supabase.');
  }

  const existingConfirmation = await supabase
    .from('confirmaciones')
    .select('cedula')
    .eq('cedula', confirmacion.cedula)
    .single();

  if (existingConfirmation.data) {
    throw new Error('Ya existe una confirmación con esta cédula.');
  }

  const { data, error } = await supabase
    .from('confirmaciones')
    .insert([confirmacion])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}