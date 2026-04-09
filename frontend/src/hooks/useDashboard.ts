import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useDashboard(period: 'week' | 'month' | 'year' | 'custom' = 'month', startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['dashboard', period, startDate, endDate],
    queryFn: () => apiClient.dashboard.metrics(period, startDate, endDate),
  });
}
