import type { EventInputDTO, EventWithDetailsType } from '../../schemas';
import apiClient from '../lib/api-client';

export const eventService = {
  getPublicEvents: async (start: string, end: string) => {
    const { data } = await apiClient.get<EventWithDetailsType[]>('/events', {
      params: { start, end },
    });
    return data;
  },
  getAdminEvents: async (start: string, end: string) => {
    const { data } = await apiClient.get<EventWithDetailsType[]>(
      '/admin/events',
      {
        params: { start, end },
      },
    );
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<EventWithDetailsType>(
      `/admin/events/${id}`,
    );
    return data;
  },
  create: async (event: EventInputDTO) => {
    const { data } = await apiClient.post<EventWithDetailsType>(
      '/admin/events',
      event,
    );
    return data;
  },
  update: async (id: string, event: EventInputDTO) => {
    const { data } = await apiClient.put<EventWithDetailsType>(
      `/admin/events/${id}`,
      event,
    );
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/admin/events/${id}`);
  },
};
