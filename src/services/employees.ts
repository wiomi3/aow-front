import apiClient from '../lib/api-client';
import type { EmployeeInputDTO, EmployeeResponseDTO } from '../../schemas';

export const employeeService = {
  getAll: async () => {
    const { data } =
      await apiClient.get<EmployeeResponseDTO[]>('/admin/employees');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<EmployeeResponseDTO>(
      `/admin/employees/${id}`,
    );
    return data;
  },
  create: async (employee: EmployeeInputDTO) => {
    const { data } = await apiClient.post<EmployeeResponseDTO>(
      '/admin/employees',
      employee,
    );
    return data;
  },
  update: async (id: string, employee: EmployeeInputDTO) => {
    const { data } = await apiClient.put<EmployeeResponseDTO>(
      `/admin/employees/${id}`,
      employee,
    );
    return data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/admin/employees/${id}`);
  },
};

export type { EmployeeResponseDTO as Employee };
