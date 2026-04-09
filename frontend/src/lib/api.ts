const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

type RequestOptions = {
  method?: string;
  body?: unknown;
  params?: Record<string, string>;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = options;
  
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) => 
    request<T>(endpoint, { method: 'GET', params }),
  
  post: <T>(endpoint: string, body: unknown) => 
    request<T>(endpoint, { method: 'POST', body }),
  
  patch: <T>(endpoint: string, body: unknown) => 
    request<T>(endpoint, { method: 'PATCH', body }),
  
  delete: <T>(endpoint: string) => 
    request<T>(endpoint, { method: 'DELETE' }),
};

export const apiClient = {
  auth: {
    login: (email: string, password: string) => 
      api.post<{ token: string; user: User }>('/auth/login', { email, password }),
    register: (data: { email: string; password: string; name: string }) =>
      api.post<{ token: string; user: User }>('/auth/register', data),
    me: () => api.get<User>('/auth/me'),
  },
  bookings: {
    list: (params?: { startDate?: string; endDate?: string; status?: string }) =>
      api.get<Booking[]>('/bookings', params),
    get: (id: string) => api.get<Booking>(`/bookings/${id}`),
    create: (data: CreateBookingInput) => 
      api.post<{ bookings: Booking[] }>('/bookings', data).then(res => res.bookings),
    update: (id: string, data: Partial<Booking>) => api.patch<Booking>(`/bookings/${id}`, data),
    delete: (id: string) => api.delete<void>(`/bookings/${id}`),
    confirm: (id: string, data: { amount: number; date: string }) =>
      api.post<{ booking: Booking; income: Income }>(`/bookings/${id}/confirm`, data),
    complete: (id: string, data?: { actualEndTime?: string; extraAmount?: number }) =>
      api.post<{ booking: Booking; income?: Income }>(`/bookings/${id}/complete`, data || {}),
    checkAvailability: (params: { date: string; startTime: string; endTime: string; excludeBookingId?: string }) =>
      api.get<{ available: boolean; conflicts?: Booking[] }>('/bookings/check-availability', params),
  },
  clients: {
    list: () => api.get<Client[]>('/clients'),
    get: (id: string) => api.get<Client>(`/clients/${id}`),
    getBookings: (id: string) => api.get<Booking[]>(`/clients/${id}/bookings`),
    create: (data: CreateClientInput) => api.post<Client>('/clients', data),
    update: (id: string, data: Partial<Client>) => api.patch<Client>(`/clients/${id}`, data),
    delete: (id: string) => api.delete<void>(`/clients/${id}`),
  },
  incomes: {
    list: (params?: { startDate?: string; endDate?: string }) =>
      api.get<Income[]>('/incomes', params),
    create: (data: { amount: number; description?: string; date: string; bookingId?: string }) =>
      api.post<Income>('/incomes', data),
    update: (id: string, data: Partial<Income>) => api.patch<Income>(`/incomes/${id}`, data),
    delete: (id: string) => api.delete<void>(`/incomes/${id}`),
  },
  expenses: {
    list: (params?: { dueDateStart?: string; dueDateEnd?: string; paymentStatus?: string }) =>
      api.get<Expense[]>('/expenses', params),
    create: (data: CreateExpenseInput) => api.post<Expense>('/expenses', data),
    update: (id: string, data: Partial<Expense>) => api.patch<Expense>(`/expenses/${id}`, data),
    delete: (id: string) => api.delete<void>(`/expenses/${id}`),
  },
  categories: {
    list: () => api.get<Category[]>('/categories'),
  },
  tariffs: {
    get: () => api.get<{ tariffs: typeof TARIFFS; lastUpdated: string }>('/tariffs'),
  },
  dashboard: {
    metrics: (period: 'week' | 'month' | 'year' | 'custom', startDate?: string, endDate?: string) => {
      const params: Record<string, string> = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      return api.get<DashboardMetrics>('/dashboard/metrics', params);
    },
  },
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'collaborator';
};

export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
};

export type CreateClientInput = Omit<Client, 'id' | 'createdAt'>;

export type Booking = {
  id: string;
  clientId: string;
  client?: Client;
  startTime: string;
  endTime: string;
  actualEndTime?: string;
  serviceType: 'rehearsal' | 'class';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isHolidayRate: boolean;
  baseAmount: string;
  extraAmount: string;
  notes?: string;
  createdAt: string;
};

export type CreateBookingInput = {
  clientId: string;
  dates: string[];
  startTime: string;
  endTime: string;
  serviceType: 'rehearsal' | 'class';
  isRecurring?: boolean;
  notes?: string;
};

export type Income = {
  id: string;
  amount: string;
  bookingId?: string;
  description?: string;
  date: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  amount: string;
  categoryId?: string;
  category?: Category;
  description?: string;
  dueDate: string;
  paymentDate?: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  recurrenceType: 'none' | 'weekly' | 'monthly' | 'yearly';
  receiptUrl?: string;
  createdAt: string;
};

export type CreateExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'category'>;

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
};

export type DashboardMetrics = {
  period: { start: string; end: string };
  metrics: {
    occupancyRate: number;
    totalHoursBooked: number;
    totalHoursAvailable: number;
    totalIncomes: number;
    totalExpenses: number;
    netProfit: number;
    pendingExpenses: number;
    averagePerBooking: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
  };
  comparison: {
    vsLastPeriod: {
      incomes: number;
      expenses: number;
      occupancy: number;
    };
  };
};

export const TARIFFS = {
  rehearsal: { weekday: 17000, weekend_holiday: 18000 },
  class: { weekday: 19000, weekend_holiday: 20000 },
} as const;
