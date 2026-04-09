import { useState } from 'react';
import { format } from 'date-fns';
import { useIncomes, useDeleteIncome } from '@/hooks/useIncomes';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency } from '@/lib/tariffs';

export function Incomes() {
  const { data: incomes = [], isLoading } = useIncomes();
  const deleteIncome = useDeleteIncome();
  const [filter, setFilter] = useState<'all' | '7days' | '30days' | 'month'>('month');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; income: typeof incomes[0] | null }>({ open: false, income: null });

  const filteredIncomes = incomes.filter((income) => {
    const date = new Date(income.date);
    const now = new Date();
    
    if (filter === 'all') return true;
    if (filter === '7days') return date >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (filter === '30days') return date >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (filter === 'month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const total = filteredIncomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Ingresos</h1>
        <div className="flex gap-2">
          {(['all', '7days', '30days', 'month'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f ? 'bg-slate-800 text-white' : 'bg-white border'
              }`}
            >
              {f === 'all' ? 'Todos' : f === '7days' ? '7 días' : f === '30days' ? '30 días' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total en período:</span>
          <span className="text-2xl font-bold text-green-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIncomes.map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {format(new Date(income.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{income.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-green-600">
                    {formatCurrency(parseFloat(income.amount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setDeleteDialog({ open: true, income })}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {filteredIncomes.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No hay ingresos registrados
                  </td>
                </tr>
              )}
            </tbody>
            </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title="Eliminar Ingreso"
        message={`¿Estás seguro de eliminar este ingreso de ${formatCurrency(parseFloat(deleteDialog.income?.amount || '0'))}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={async () => {
          if (deleteDialog.income) {
            await deleteIncome.mutateAsync(deleteDialog.income.id);
          }
          setDeleteDialog({ open: false, income: null });
        }}
        onCancel={() => setDeleteDialog({ open: false, income: null })}
        isDestructive
      />
    </div>
  );
}
