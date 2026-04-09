import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useBookings } from '@/hooks/useBookings';
import { BookingModal } from '@/components/booking/BookingModal';
import type { Booking } from '@/lib/api';

const locales = { 'es': es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const statusColors: Record<string, string> = {
  pending: '#facc15',
  confirmed: '#22c55e',
  completed: '#94a3b8',
  cancelled: '#ef4444',
};

export function Agenda() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.WEEK);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const { data: bookings = [], isLoading } = useBookings({
    startDate: format(date, 'yyyy-MM'),
  });

  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.client?.name || 'Cliente'} - ${booking.serviceType === 'rehearsal' ? 'Ensayo' : 'Clase'}`,
    start: new Date(booking.startTime),
    end: new Date(booking.endTime),
    resource: booking,
  }));

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: { resource: Booking }) => {
    setSelectedBooking(event.resource);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const eventStyleGetter = (event: { resource: Booking }) => {
    const booking = event.resource;
    return {
      style: {
        backgroundColor: statusColors[booking.status] || '#94a3b8',
        borderRadius: '4px',
        color: 'white',
        border: 'none',
        fontSize: '12px',
      },
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Agenda</h1>
        <button
          onClick={() => {
            setSelectedSlot({ start: new Date(), end: new Date() });
            setSelectedBooking(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          + Nueva Reserva
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4" style={{ height: 'calc(100vh - 220px)' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={date}
            view={view}
            onNavigate={setDate}
            onView={setView}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            messages={{
              today: 'Hoy',
              previous: 'Ant',
              next: 'Sig',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
            }}
          />
        </div>
      )}

      <BookingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        initialDate={selectedSlot?.start}
      />
    </div>
  );
}
