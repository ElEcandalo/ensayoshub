import { useState } from 'react';
import { format } from 'date-fns';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, useClientBookings } from '@/hooks/useClients';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Client } from '@/lib/api';

export function Clients() {
  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; client: Client | null }>({ open: false, client: null });
  const [viewBookingsClient, setViewBookingsClient] = useState<Client | null>(null);
  const { data: clientBookings = [] } = useClientBookings(viewBookingsClient?.id || '');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const openCreate = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setIsModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      notes: client.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      await updateClient.mutateAsync({ id: editingClient.id, data: formData });
    } else {
      await createClient.mutateAsync(formData);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          + Nuevo Cliente
        </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notas</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.phone || '-'}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{client.notes || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setViewBookingsClient(client)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Ver Reservas
                    </button>
                    <button
                      onClick={() => openEdit(client)}
                      className="text-slate-600 hover:text-slate-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ open: true, client })}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay clientes registrados
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
              {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                />
              </div>
              <div className="flex justify-end gap-3">
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
                  {editingClient ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title="Eliminar Cliente"
        message={`¿Estás seguro de eliminar a "${deleteDialog.client?.name}"? Esta acción eliminará todas sus reservas asociadas.`}
        confirmLabel="Eliminar"
        onConfirm={async () => {
          if (deleteDialog.client) {
            await deleteClient.mutateAsync(deleteDialog.client.id);
          }
          setDeleteDialog({ open: false, client: null });
        }}
        onCancel={() => setDeleteDialog({ open: false, client: null })}
        isDestructive
      />

      {viewBookingsClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reservas de {viewBookingsClient.name}</h2>
              <button
                onClick={() => setViewBookingsClient(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            {clientBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay reservas para este cliente</p>
            ) : (
              <div className="space-y-3">
                {clientBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {format(new Date(booking.startTime), 'dd/MM/yyyy')} - {format(new Date(booking.startTime), 'HH:mm')} a {format(new Date(booking.endTime), 'HH:mm')}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                        {' '}{booking.serviceType === 'rehearsal' ? 'Ensayo' : 'Clase'}
                      </p>
                    </div>
                    <p className="font-semibold">${booking.baseAmount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
