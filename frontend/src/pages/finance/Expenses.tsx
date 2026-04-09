import { useState } from 'react';
import { format } from 'date-fns';
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency } from '@/lib/tariffs';
import type { Expense } from '@/lib/api';

export function Expenses() {
  const { data: expenses = [], isLoading } = useExpenses();
  const { data: categories = [] } = useCategories();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; expense: Expense | null }>({ open: false, expense: null });
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    description: '',
    dueDate: '',
    paymentDate: '',
    recurrenceType: 'none' as const,
  });

  const filteredExpenses = expenses.filter((e) => {
    if (filter === 'all') return true;
    return e.paymentStatus === filter;
  });

  const totalPending = expenses.filter(e => e.paymentStatus === 'pending').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const totalPaid = expenses.filter(e => e.paymentStatus === 'paid').reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const getCategoryName = (id?: string) => categories.find(c => c.id === id)?.name || '-';

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  };

  const openCreate = () => {
    setEditingExpense(null);
    setFormData({ amount: '', categoryId: '', description: '', dueDate: '', paymentDate: '', recurrenceType: 'none' });
    setIsModalOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount,
      categoryId: expense.categoryId || '',
      description: expense.description || '',
      dueDate: expense.dueDate,
      paymentDate: expense.paymentDate || '',
      recurrenceType: expense.recurrenceType,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId || undefined,
      description: formData.description,
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      paymentStatus: formData.paymentDate ? 'paid' as const : 'pending' as const,
      recurrenceType: formData.recurrenceType,
    };

    if (editingExpense) {
      await updateExpense.mutateAsync({ id: editingExpense.id, data: payload });
    } else {
      await createExpense.mutateAsync(payload);
    }
    
    setIsModalOpen(false);
  };

  const markAsPaid = async (expense: Expense) => {
    await updateExpense.mutateAsync({
      id: expense.id,
      data: {
        ...expense,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentStatus: 'paid',
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gastos</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          + Nuevo Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pagados</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPending + totalPaid)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'paid', 'overdue'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f ? 'bg-slate-800 text-white' : 'bg-white border'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'paid' ? 'Pagados' : 'Vencidos'}
          </button>
        ))}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Venc.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {format(new Date(expense.dueDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {getCategoryName(expense.categoryId)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{expense.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[expense.paymentStatus]}`}>
                      {expense.paymentStatus === 'pending' ? 'Pendiente' : expense.paymentStatus === 'paid' ? 'Pagado' : 'Vencido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-red-600">
                    {formatCurrency(parseFloat(expense.amount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {expense.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => markAsPaid(expense)}
                        className="text-green-600 hover:text-green-800 mr-3"
                      >
                        Marcar Pagado
                      </button>
                    )}
                    <button onClick={() => openEdit(expense)} className="text-slate-600 hover:text-slate-900 mr-3">
                      Editar
                    </button>
                    <button 
                      onClick={() => setDeleteDialog({ open: true, expense })} 
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay gastos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                >
                  <option value="">Seleccionar...</option>
                  {categories.filter(c => c.type === 'expense').map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Vencimiento *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Pago</label>
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recurrencia</label>
                <select
                  value={formData.recurrenceType}
                  onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                >
                  <option value="none">Una vez</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  {editingExpense ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title="Eliminar Gasto"
        message={`¿Estás seguro de eliminar este gasto de ${formatCurrency(parseFloat(deleteDialog.expense?.amount || '0'))}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={async () => {
          if (deleteDialog.expense) {
            await deleteExpense.mutateAsync(deleteDialog.expense.id);
          }
          setDeleteDialog({ open: false, expense: null });
        }}
        onCancel={() => setDeleteDialog({ open: false, expense: null })}
        isDestructive
      />
    </div>
  );
}
