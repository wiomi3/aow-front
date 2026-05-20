import apiClient from '../lib/api-client';
import type { LocationInputDTO, LocationResponseDTO } from '../../schemas';

export const locationService = {
  getAll: async () => {
    const { data } =
      await apiClient.get<LocationResponseDTO[]>('/admin/locations');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<LocationResponseDTO>(
      `/admin/locations/${id}`,
    );
    return data;
  },
  create: async (location: LocationInputDTO) => {
    const { data } = await apiClient.post<LocationResponseDTO>(
      '/admin/locations',
      location,
    );
    return data;
  },
  update: async (id: string, location: LocationInputDTO) => {
    const { data } = await apiClient.put<LocationResponseDTO>(
      `/admin/locations/${id}`,
      location,
    );
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/admin/locations/${id}`);
  },
};

export type { LocationResponseDTO as Location };
