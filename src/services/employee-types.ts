import apiClient from '../lib/api-client';
import type {
  EmployeeTypeInputDTO,
  EmployeeTypeResponseDTO,
} from '../../schemas';

export const employeeTypeService = {
  getAll: async () => {
    const { data } = await apiClient.get<EmployeeTypeResponseDTO[]>(
      '/admin/employee-types',
    );
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<EmployeeTypeResponseDTO>(
      `/admin/employee-types/${id}`,
    );
    return data;
  },
  create: async (employeeType: EmployeeTypeInputDTO) => {
    const { data } = await apiClient.post<EmployeeTypeResponseDTO>(
      '/admin/employee-types',
      employeeType,
    );
    return data;
  },
  update: async (id: string, employeeType: EmployeeTypeInputDTO) => {
    const { data } = await apiClient.put<EmployeeTypeResponseDTO>(
      `/admin/employee-types/${id}`,
      employeeType,
    );
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/admin/employee-types/${id}`);
  },
};

export type { EmployeeTypeResponseDTO as EmployeeType };
