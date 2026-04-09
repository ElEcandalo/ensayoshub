import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/tariffs';

type Period = 'week' | 'month' | 'year';

export function Dashboard() {
  const [period, setPeriod] = useState<Period>('month');
  const { data, isLoading } = useDashboard(period);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg ${
                period === p ? 'bg-slate-800 text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ocupación"
          value={metrics ? `${Math.round(metrics.occupancyRate * 100)}%` : '-'}
          subtitle={metrics ? `${metrics.totalHoursBooked}h de ${metrics.totalHoursAvailable}h` : ''}
          color="blue"
        />
        <MetricCard
          title="Ingresos"
          value={metrics ? formatCurrency(metrics.totalIncomes) : '-'}
          subtitle={`${metrics?.completedBookings || 0} reservas`}
          color="green"
        />
        <MetricCard
          title="Gastos"
          value={metrics ? formatCurrency(metrics.totalExpenses) : '-'}
          subtitle={metrics?.pendingExpenses ? `Pendiente: ${formatCurrency(metrics.pendingExpenses)}` : ''}
          color="red"
        />
        <MetricCard
          title="Ganancia Neta"
          value={metrics ? formatCurrency(metrics.netProfit) : '-'}
          subtitle={metrics?.netProfit ? (metrics.netProfit > 0 ? 'Positiva' : 'Negativa') : ''}
          color={metrics?.netProfit && metrics.netProfit > 0 ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Resumen</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reservas</span>
              <span className="font-medium">{metrics?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completadas</span>
              <span className="font-medium text-green-600">{metrics?.completedBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Canceladas</span>
              <span className="font-medium text-red-600">{metrics?.cancelledBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Promedio por Reserva</span>
              <span className="font-medium">{metrics ? formatCurrency(metrics.averagePerBooking) : '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Comparativa</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">vs Período Anterior</span>
              <span className="text-sm text-gray-500">{data?.period?.start} - {data?.period?.end}</span>
            </div>
            {data?.comparison && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos</span>
                  <span className={`font-medium ${(data.comparison.vsLastPeriod.incomes || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(data.comparison.vsLastPeriod.incomes * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gastos</span>
                  <span className={`font-medium ${(data.comparison.vsLastPeriod.expenses || 0) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(data.comparison.vsLastPeriod.expenses * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ocupación</span>
                  <span className={`font-medium ${(data.comparison.vsLastPeriod.occupancy || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(data.comparison.vsLastPeriod.occupancy * 100).toFixed(1)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, color }: {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'red' | 'yellow';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-800',
    green: 'bg-green-50 text-green-800',
    red: 'bg-red-50 text-red-800',
    yellow: 'bg-yellow-50 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${colors[color].split(' ')[1].replace('bg-', 'text-')}`}>
        {value}
      </p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
