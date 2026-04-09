import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const DAYS = [
  { key: 'weekday', label: 'Días Laborables', days: 'Lunes a Jueves', rate: 'weekday' as const },
  { key: 'weekend', label: 'Fines de Semana', days: 'Viernes, Sábado y Domingo', rate: 'weekend_holiday' as const },
  { key: 'holiday', label: 'Feriados', days: 'Días feriados', rate: 'weekend_holiday' as const },
];

const SERVICE_TYPES = [
  { key: 'rehearsal', label: 'Ensayo', icon: '🎸' },
  { key: 'class', label: 'Clase', icon: '🎹' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function Tariffs() {
  const { data, isLoading } = useQuery({
    queryKey: ['tariffs'],
    queryFn: () => apiClient.tariffs.get(),
  });

  const tariffs = data?.tariffs;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tarifas</h1>
        <p className="text-gray-500">Precios por hora según el tipo de servicio y día</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {SERVICE_TYPES.map((service) => (
          <div key={service.key} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{service.icon}</span>
              <h2 className="text-xl font-semibold">{service.label}</h2>
            </div>
            
            <div className="space-y-3">
              {DAYS.map((day) => (
                <div key={day.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{day.label}</p>
                    <p className="text-sm text-gray-500">{day.days}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">
                      {formatCurrency(tariffs?.[service.key as keyof 'rehearsal' | 'class']?.[day.rate] || 0)}
                    </p>
                    <p className="text-xs text-gray-500">por hora</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Información</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Los precios se aplican automáticamente al crear reservas</li>
          <li>• Los días fines de semana y feriados tienen un recargo</li>
          <li>• Las clases tienen un precio superior por hora</li>
          <li>• Última actualización: {data?.lastUpdated || 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
}