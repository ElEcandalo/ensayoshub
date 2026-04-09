import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type Client } from '@/lib/api';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => apiClient.clients.list(),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => apiClient.clients.get(id),
    enabled: !!id,
  });
}

export function useClientBookings(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId, 'bookings'],
    queryFn: () => apiClient.clients.getBookings(clientId),
    enabled: !!clientId,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.clients.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      apiClient.clients.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.clients.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
