"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Toaster } from '@/components/ui/sonner';
import { insertarConfirmacion, isSupabaseConfigured } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Heart, IdCard, MapPin, Phone, Sparkles, User, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  asistencia: 'si' | 'no' | '';
  cedula: string;
}

export default function QuinceaneraInvitation() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    asistencia: '',
    cedula: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar si Supabase está configurado
    if (!isSupabaseConfigured()) {
      toast.error('No se pudo conectar a la base de datos.');
      return;
    }

    if (!formData.nombre || !formData.apellido || !formData.asistencia) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.asistencia === 'si' && (!formData.telefono || !formData.cedula)) {
      toast.error('Por favor debes proporcionar un teléfono de contacto y cédula si confirmas tu asistencia.');
      return;
    }

    //validate if a real phone number is provided
    const phoneRegex = /^\+?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    if (formData.telefono && !phoneRegex.test(formData.telefono)) {
      toast.error('Por favor ingresa un número de teléfono válido.');
      return;
    }

    const cedulaRegex = /^[0-9]{1,8}$/;
    if (formData.cedula && !cedulaRegex.test(formData.cedula)) {
      toast.error('Por favor ingresa una cédula válida (8 dígitos).');
      return;
    }

    setIsSubmitting(true);

    const cleanTelefono = formData.telefono.replace(/\D/g, '');
    const cleanCedula = formData.cedula.replace(/\D/g, '');

    try {
      await insertarConfirmacion({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: cleanTelefono,
        asistencia: formData.asistencia as 'si' | 'no',
        cedula: cleanCedula
      });

      setIsSubmitted(true);
      toast.success('¡Confirmación enviada exitosamente!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      if (errorMessage.includes('Supabase no está configurado')) {
        toast.error('Por favor conecta tu proyecto de Supabase usando el botón "Connect to Supabase" en la parte superior.');
      } else {
        toast.error('Error al enviar la confirmación. Inténtalo nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setIsSubmitted(false);
    setFormData({ nombre: '', apellido: '', telefono: '', asistencia: '', cedula: '' });
  };

  return (
    <div className="h-screen  relative bg-[#F7D0E2]">
      <Toaster position="top-center" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-[#4D1730] rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-20 w-16 h-16 bg-[#A26682] rounded-full blur-xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-[#4D1730] rounded-full blur-xl"
        animate={{
          y: [0, -25, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <AnimatePresence mode="wait">
        {!showForm && !isSubmitted && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <motion.div
              className="flex-1 flex items-center justify-center relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-center max-w-4xl mx-auto px-6 py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-8"
                >
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 text-[#4D1730]" />
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-[#A26682] to-[#4D1730] bg-clip-text text-transparent"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Mis XV Años
                </motion.h1>

                <motion.p
                  className="text-2xl md:text-3xl font-light text-gray-700 mb-4"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  Juli
                </motion.p>

                <motion.p
                  className="text-lg text-gray-600 mb-12"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  Te invito a celebrar conmigo este momento tan especial
                </motion.p>

                {/* Event Details */}
                <motion.div
                  className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-12 px-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                >
                  {[
                    {
                      icon: <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                      title: "6 de Septiembre",
                      subtitle: "2025",
                      gradient: "from-[#F7D0E2] to-[#4D1730]",
                    },
                    {
                      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                      title: "Salón Champagne",
                      subtitle: "Yatay 1436",
                      subtitle2: "11800 Montevideo",
                      gradient: "from-[#F7D0E2] to-[#4D1730]",
                    },
                    {
                      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                      title: "09:00 PM",
                      subtitle: "Hora de comienzo",
                      title2: "9:00 PM",
                      subtitle2: "Horario",
                      gradient: "from-[#F7D0E2] to-[#4D1730]",
                    },
                  ].map((card, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ type: "spring", stiffness: 250 }}
                    >
                      <Card className="border-neutral-200 shadow-xl bg-white/80 backdrop-blur-sm rounded-xl">
                        <CardContent className="p-6 md:p-8 text-center">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${card.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {card.icon}
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{card.title}</h3>
                          <p className="text-sm sm:text-base text-gray-600">{card.subtitle}</p>
                          {card.subtitle2 && !card.title2 && (
                            <p className="text-sm sm:text-base text-gray-600">{card.subtitle2}</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  className='my-4'
                >
                  <p>
                    Colectivo - Prex 1640160
                  </p>
                  <p className='font-bold'>
                    Vestimenta formal
                  </p>
                  <p>
                    Código de color prohibido, rosa
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  <Button
                    onClick={() => setShowForm(true)}
                    disabled={formData.asistencia === 'si' && (!formData.telefono.trim() || !formData.cedula.trim())}
                    className="bg-gradient-to-r from-[#A26682] to-[#4D1730] hover:from-[#A26682] hover:to-[#4D1730] text-white font-semibold py-4 px-12 rounded-full shadow-2xl text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-3xl disabled:bg-muted-foreground"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Confirmar Asistencia
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showForm && !isSubmitted && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="h-full flex items-center justify-center p-6"
          >
            <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardHeader className="text-center bg-gradient-to-r from-[#A26682] to-[#4D1730] text-white rounded-t-lg relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                    className="absolute left-4 top-4 text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">Confirma tu Asistencia</CardTitle>
                  <CardDescription className="text-pink-100">
                    Por favor confirma si podrás acompañarme
                  </CardDescription>
                </CardHeader>
              </motion.div>

              <CardContent className="p-8">
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="nombre" className="text-sm font-semibold text-gray-700">
                        Nombre *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="nombre"
                          type="text"
                          placeholder="Tu nombre"
                          value={formData.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          className="pl-10 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="apellido" className="text-sm font-semibold text-gray-700">
                        Apellido *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="apellido"
                          type="text"
                          placeholder="Tu apellido"
                          value={formData.apellido}
                          onChange={(e) => handleInputChange('apellido', e.target.value)}
                          className="pl-10 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label className="text-sm font-semibold text-gray-700">
                      ¿Confirmas tu asistencia? *
                    </Label>
                    <RadioGroup
                      value={formData.asistencia}
                      onValueChange={(value) => handleInputChange('asistencia', value as 'si' | 'no')}
                      className="grid grid-cols-1 gap-4"
                    >
                      <motion.div
                        className="flex items-center space-x-3 p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioGroupItem value="si" id="si" className="text-pink-500" />
                        <Label htmlFor="si" className="cursor-pointer font-medium text-lg">
                          ¡Sí, estaré ahí! 🎉
                        </Label>
                      </motion.div>
                      <motion.div
                        className="flex items-center space-x-3 p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="cursor-pointer font-medium text-lg">
                          No podré asistir 😔
                        </Label>
                      </motion.div>
                    </RadioGroup>
                  </motion.div>

                  <AnimatePresence>
                    {formData.asistencia === 'si' && (
                      <>
                        <motion.div
                          className="space-y-2"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Label htmlFor="telefono" className="text-sm font-semibold text-gray-700">
                            Teléfono de contacto (adulto responsable) *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="telefono"
                              type="tel"
                              placeholder="Ej: +598 99 999 999"
                              value={formData.telefono}
                              onChange={(e) => handleInputChange('telefono', e.target.value)}
                              className="pl-10 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          className="space-y-2"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Label htmlFor="telefono" className="text-sm font-semibold text-gray-700">
                            Cédula de identdad *
                          </Label>
                          <div className="relative">
                            <IdCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="cedula"
                              type="text"
                              maxLength={8}
                              placeholder="Ej: 12345678"
                              value={formData.cedula}
                              onChange={(e) => handleInputChange('cedula', e.target.value)}
                              className="pl-10 border-gray-300 focus:border-pink-400 focus:ring-pink-400"
                            />
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#A26682] to-[#4D1730] hover:from-[#A26682] hover:to-[#4D1730] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </motion.div>
                      ) : (
                        'Enviar Confirmación'
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isSubmitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="h-full flex items-center justify-center p-6"
          >
            <Card className="max-w-md mx-auto text-center border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-[#A26682] to-[#4D1730] rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold text-gray-800 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  ¡Gracias por confirmar!
                </motion.h2>

                <motion.p
                  className="text-gray-600 mb-8 text-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Tu respuesta ha sido registrada.
                  {formData.asistencia === 'si' ? ' ¡Nos vemos en la celebración!' : ' Lamentamos que no puedas acompañarnos.'}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-[#A26682] text-[#4D1730] hover:bg-[#A26682]/10 px-8 py-3 rounded-full"
                  >
                    Volver al menú
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}