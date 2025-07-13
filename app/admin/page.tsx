"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, Phone, Calendar } from 'lucide-react';
import { obtenerConfirmaciones, isSupabaseConfigured, type Confirmacion } from '@/lib/supabase';

export default function AdminPage() {
  const [confirmaciones, setConfirmaciones] = useState<Confirmacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarConfirmaciones();
  }, []);

  const cargarConfirmaciones = async () => {
    try {
      if (!isSupabaseConfigured()) {
        setError('Supabase no está configurado. Por favor conecta tu proyecto de Supabase.');
        return;
      }
      
      const data = await obtenerConfirmaciones();
      setConfirmaciones(data);
    } catch (err) {
      setError('Error al cargar las confirmaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmacionesSi = confirmaciones.filter(c => c.asistencia === 'si');
  const confirmacionesNo = confirmaciones.filter(c => c.asistencia === 'no');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando confirmaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración - Confirmaciones</h1>
        
        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Confirmaciones</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmaciones.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistirán</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmacionesSi.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Asistirán</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{confirmacionesNo.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de confirmaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Todas las Confirmaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmaciones.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay confirmaciones aún</p>
              ) : (
                confirmaciones.map((confirmacion) => (
                  <div
                    key={confirmacion.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-800">
                          {confirmacion.nombre} {confirmacion.apellido}
                        </h3>
                        <Badge
                          variant={confirmacion.asistencia === 'si' ? 'default' : 'secondary'}
                          className={confirmacion.asistencia === 'si' ? 'bg-green-500' : 'bg-red-500'}
                        >
                          {confirmacion.asistencia === 'si' ? 'Asistirá' : 'No asistirá'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        {confirmacion.telefono && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{confirmacion.telefono}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {confirmacion.created_at 
                              ? new Date(confirmacion.created_at).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Fecha no disponible'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}