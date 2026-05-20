import apiClient from '../lib/api-client';
import type { EventTypeInputDTO, EventTypeResponseDTO } from '../../schemas';

export const eventTypeService = {
  getAll: async () => {
    const { data } =
      await apiClient.get<EventTypeResponseDTO[]>('/admin/event-types');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<EventTypeResponseDTO>(
      `/admin/event-types/${id}`,
    );
    return data;
  },
  create: async (eventType: EventTypeInputDTO) => {
    const { data } = await apiClient.post<EventTypeResponseDTO>(
      '/admin/event-types',
      eventType,
    );
    return data;
  },
  update: async (id: string, eventType: EventTypeInputDTO) => {
    const { data } = await apiClient.put<EventTypeResponseDTO>(
      `/admin/event-types/${id}`,
      eventType,
    );
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/admin/event-types/${id}`);
  },
};

export type { EventTypeResponseDTO as EventType };
