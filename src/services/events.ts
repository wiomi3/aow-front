import type { EventResponseDTO } from 'schemas';
import apiClient from '../lib/api-client';

export const eventService = {
  getPublicEvents: async (start: string, end: string) => {
    const { data } = await apiClient.get<EventResponseDTO[]>('/events', {
      params: { start, end },
    });
    return data;
  },
  getAdminEvents: async (start: string, end: string) => {
    const { data } = await apiClient.get<EventResponseDTO[]>(
      '/admin/calendar',
      {
        params: { start, end },
      },
    );
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<EventResponseDTO>(
      `/admin/calendar/${id}`,
    );
    return data;
  },
  create: async (event: Omit<Event, 'id'>) => {
    const { data } = await apiClient.post<EventResponseDTO>(
      '/admin/calendar',
      event,
    );
    return data;
  },
  update: async (id: string, event: Partial<Event>) => {
    const { data } = await apiClient.put<EventResponseDTO>(
      `/admin/calendar/${id}`,
      event,
    );
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/admin/calendar/${id}`);
  },
};
