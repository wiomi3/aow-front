import apiClient from '../lib/api-client';
import type {
  AdditionalOrgInputDTO,
  AdditionalOrgResponseDTO,
} from '../../schemas';

export const additionalOrgService = {
  getAll: async () => {
    const { data } = await apiClient.get<AdditionalOrgResponseDTO[]>(
      '/admin/additional-orgs',
    );
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<AdditionalOrgResponseDTO>(
      `/admin/additional-orgs/${id}`,
    );
    return data;
  },
  create: async (additionalOrg: AdditionalOrgInputDTO) => {
    const { data } = await apiClient.post<AdditionalOrgResponseDTO>(
      '/admin/additional-orgs',
      additionalOrg,
    );
    return data;
  },
  update: async (id: string, additionalOrg: AdditionalOrgInputDTO) => {
    const { data } = await apiClient.put<AdditionalOrgResponseDTO>(
      `/admin/additional-orgs/${id}`,
      additionalOrg,
    );
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/admin/additional-orgs/${id}`);
  },
};

export type { AdditionalOrgResponseDTO as AdditionalOrg };
