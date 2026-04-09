import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClients, useCreateClient } from '@/hooks/useClients';
import { useCreateBooking, useUpdateBooking, useConfirmBooking, useCompleteBooking, useDeleteBooking } from '@/hooks/useBookings';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { getTariff, formatCurrency } from '@/lib/tariffs';
import type { Booking, Client } from '@/lib/api';

const bookingSchema = z.object({
  clientId: z.string().min(1, 'Cliente requerido'),
  dates: z.array(z.string()).min(1, 'Al menos una fecha requerida'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida'),
  serviceType: z.enum(['rehearsal', 'class']),
  notes: z.string().optional(),
}).refine(
  (data) => {
    const [startH, startM] = data.startTime.split(':').map(Number);
    const [endH, endM] = data.endTime.split(':').map(Number);
    return (endH * 60 + endM) > (startH * 60 + startM);
  },
  { message: 'La hora de fin debe ser posterior a la de inicio' }
);

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  booking?: Booking | null;
  initialDate?: Date;
}

export function BookingModal({ open, onClose, booking, initialDate }: BookingModalProps) {
  const { data: clients = [] } = useClients();
  const createClient = useCreateClient();
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();
  const confirmBooking = useConfirmBooking();
  const completeBooking = useCompleteBooking();
  const deleteBooking = useDeleteBooking();

  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: 'rehearsal',
      dates: [],
      startTime: '14:00',
      endTime: '16:00',
    },
  });

  useEffect(() => {
    if (open) {
      if (booking) {
        reset({
          clientId: booking.clientId,
          dates: [format(new Date(booking.startTime), 'yyyy-MM-dd')],
          startTime: format(new Date(booking.startTime), 'HH:mm'),
          endTime: format(new Date(booking.endTime), 'HH:mm'),
          serviceType: booking.serviceType,
          notes: booking.notes,
        });
        setSelectedDates([format(new Date(booking.startTime), 'yyyy-MM-dd')]);
      } else {
        const defaultDate = initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
        reset({
          clientId: '',
          dates: [defaultDate],
          startTime: '14:00',
          endTime: '16:00',
          serviceType: 'rehearsal',
          notes: '',
        });
        setSelectedDates([defaultDate]);
        setIsRecurring(false);
      }
    }
  }, [open, booking, initialDate, reset]);

  const serviceType = watch('serviceType');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const calculateAmount = () => {
    if (!startTime || !endTime || !serviceType || selectedDates.length === 0) return 0;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const hours = (endH - startH) + (endM - startM) / 60;
    
    const firstDate = selectedDates[0];
    const isWeekend = firstDate ? 
      new Date(firstDate).getDay() === 0 || new Date(firstDate).getDay() === 6 : false;
    
    return selectedDates.length * hours * getTariff(serviceType, isWeekend);
  };

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;
    await createClient.mutateAsync({ name: newClientName.trim() });
    setShowNewClient(false);
    setNewClientName('');
  };

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true);
    try {
      const payload = {
        clientId: data.clientId,
        dates: selectedDates,
        startTime: data.startTime,
        endTime: data.endTime,
        serviceType: data.serviceType,
        notes: data.notes,
      };

      console.log('Payload:', JSON.stringify(payload));

      if (booking) {
        await updateBooking.mutateAsync({ 
          id: booking.id, 
          data: { 
            startTime: `${selectedDates[0]}T${data.startTime}:00`,
            endTime: `${selectedDates[0]}T${data.endTime}:00`,
            serviceType: data.serviceType,
            notes: data.notes,
          } 
        });
      } else {
        await createBooking.mutateAsync(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!booking || !confirmAmount) return;
    setIsSubmitting(true);
    try {
      await confirmBooking.mutateAsync({
        id: booking.id,
        data: { amount: parseFloat(confirmAmount), date: format(new Date(), 'yyyy-MM-dd') },
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!booking) return;
    setIsSubmitting(true);
    try {
      await completeBooking.mutateAsync({ id: booking.id });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!booking) return;
    setIsSubmitting(true);
    try {
      await deleteBooking.mutateAsync(booking.id);
      onClose();
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {booking ? 'Editar Reserva' : 'Nueva Reserva'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {booking ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{booking.client?.name || 'Cliente'}</p>
              <p className="text-sm text-gray-600">
                {format(new Date(booking.startTime), 'dd/MM/yyyy HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
              </p>
              <p className="text-sm">
                {booking.serviceType === 'rehearsal' ? 'Ensayo' : 'Clase'} - {formatCurrency(parseFloat(booking.baseAmount))}
              </p>
              <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status === 'pending' ? 'Pendiente' :
                 booking.status === 'confirmed' ? 'Confirmado' :
                 booking.status === 'completed' ? 'Completado' : 'Cancelado'}
              </span>
            </div>

            {booking.status === 'pending' && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Confirmar Reserva</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Monto de seña"
                    value={confirmAmount}
                    onChange={(e) => setConfirmAmount(e.target.value)}
                    className="flex-1 rounded border px-3 py-2"
                  />
                  <button
                    onClick={handleConfirm}
                    disabled={isSubmitting || !confirmAmount}
                    className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {booking.status === 'confirmed' && (
              <div className="border-t pt-4">
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Completar Reserva
                </button>
              </div>
            )}

            <div className="border-t pt-4">
              <button
                onClick={handleCancel}
                disabled={isSubmitting || booking.status === 'cancelled'}
                className="w-full px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
              >
                Cancelar Reserva
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente *</label>
              <div className="flex gap-2">
                <select
                  {...register('clientId')}
                  className="flex-1 rounded border border-gray-300 px-3 py-2"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewClient(!showNewClient)}
                  className="px-3 py-2 border rounded hover:bg-gray-50"
                >
                  + Nuevo
                </button>
              </div>
              {showNewClient && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="flex-1 rounded border border-gray-300 px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleCreateClient}
                    className="px-3 py-2 bg-slate-800 text-white rounded"
                  >
                    Crear
                  </button>
                </div>
              )}
              {errors.clientId && <p className="text-red-600 text-sm mt-1">{errors.clientId.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Fechas *</label>
                <label className="flex items-center text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => {
                      setIsRecurring(e.target.checked);
                      if (!e.target.checked) {
                        setSelectedDates([format(new Date(), 'yyyy-MM-dd')]);
                      }
                    }}
                    className="mr-2"
                  />
                  Multiple fechas
                </label>
              </div>
              
              {isRecurring ? (
                <div className="space-y-2">
                  <input
                    type="date"
                    onChange={(e) => {
                      if (e.target.value && !selectedDates.includes(e.target.value)) {
                        setSelectedDates([...selectedDates, e.target.value].sort());
                      }
                    }}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date) => (
                      <span
                        key={date}
                        className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-sm"
                      >
                        {format(new Date(date), 'dd/MM')}
                        <button
                          type="button"
                          onClick={() => setSelectedDates(selectedDates.filter(d => d !== date))}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {selectedDates.length > 0 && (
                    <p className="text-sm text-slate-500">{selectedDates.length} fecha(s) seleccionada(s)</p>
                  )}
                </div>
              ) : (
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedDates([e.target.value]);
                    }
                  }}
                  value={selectedDates[0] || ''}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                />
              )}
              {errors.dates && <p className="text-red-600 text-sm mt-1">{errors.dates.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                {...register('serviceType')}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              >
                <option value="rehearsal">Ensayo</option>
                <option value="class">Clase</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora Inicio *</label>
                <input
                  type="time"
                  {...register('startTime')}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora Fin *</label>
                <input
                  type="time"
                  {...register('endTime')}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            {errors.startTime && <p className="text-red-600 text-sm">{errors.startTime.message}</p>}
            {errors.endTime && <p className="text-red-600 text-sm">{errors.endTime.message}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700">Notas</label>
              <textarea
                {...register('notes')}
                rows={2}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Monto estimado: <span className="font-bold">{formatCurrency(calculateAmount())}</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : booking ? 'Actualizar' : 'Crear Reserva'}
              </button>
            </div>
          </form>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Cancelar Reserva"
        message={`¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.`}
        confirmLabel="Cancelar Reserva"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isDestructive
      />
    </div>
  );
}
