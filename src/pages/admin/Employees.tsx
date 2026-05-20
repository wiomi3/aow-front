import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, User, Users } from 'lucide-react';
import { employeeService, type Employee } from '@/services/employees';
import {
  employeeTypeService,
  type EmployeeType,
} from '@/services/employee-types';
import { EmployeeForm } from '@/components/admin/forms/EmployeeForm';
import { EmployeeTypeForm } from '@/components/admin/forms/EmployeeTypeForm';
import { toast } from 'sonner';
import type { EmployeeInputDTO, EmployeeTypeInputDTO } from '../../../schemas';

export default function AdminEmployees() {
  const queryClient = useQueryClient();
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingType, setEditingType] = useState<EmployeeType | null>(null);

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  const { data: employeeTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['employee-types'],
    queryFn: employeeTypeService.getAll,
  });

  // Employee Mutations
  const createEmployeeMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsEmployeeDialogOpen(false);
      toast.success('Сотрудник добавлен');
    },
    onError: () => toast.error('Ошибка при добавлении сотрудника'),
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeInputDTO }) =>
      employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsEmployeeDialogOpen(false);
      setEditingEmployee(null);
      toast.success('Сотрудник обновлен');
    },
    onError: () => toast.error('Ошибка при обновлении сотрудника'),
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: employeeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Сотрудник удален');
    },
    onError: () => toast.error('Ошибка при удалении сотрудника'),
  });

  // Type Mutations
  const createTypeMutation = useMutation({
    mutationFn: employeeTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
      setIsTypeDialogOpen(false);
      toast.success('Тип сотрудника создан');
    },
    onError: () => toast.error('Ошибка при создании типа сотрудника'),
  });

  const updateTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeTypeInputDTO }) =>
      employeeTypeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
      setIsTypeDialogOpen(false);
      setEditingType(null);
      toast.success('Тип сотрудника обновлен');
    },
    onError: () => toast.error('Ошибка при обновлении типа сотрудника'),
  });

  const deleteTypeMutation = useMutation({
    mutationFn: employeeTypeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
      toast.success('Тип сотрудника удален');
    },
    onError: () => toast.error('Ошибка при удалении типа сотрудника'),
  });

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsEmployeeDialogOpen(true);
  };

  const handleEditType = (type: EmployeeType) => {
    setEditingType(type);
    setIsTypeDialogOpen(true);
  };

  const handleAddType = () => {
    setEditingType(null);
    setIsTypeDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            Персонал
          </h2>
          <p className="text-gray-500">Управление сотрудниками и их ролями.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddType}
            variant="outline"
            className="gap-2 rounded-xl font-bold"
          >
            <Plus className="h-4 w-4" /> Тип сотрудника
          </Button>
          <Button
            onClick={handleAddEmployee}
            className="gap-2 rounded-xl font-bold shadow-xl shadow-blue-100"
          >
            <Plus className="h-4 w-4" /> Добавить сотрудника
          </Button>
        </div>
      </div>

      <Dialog
        open={isEmployeeDialogOpen}
        onOpenChange={setIsEmployeeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEmployee
                ? 'Редактировать сотрудника'
                : 'Добавить сотрудника'}
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            initialData={editingEmployee || undefined}
            employeeTypes={employeeTypes}
            onSubmit={(data) => {
              if (editingEmployee) {
                updateEmployeeMutation.mutate({ id: editingEmployee.id, data });
              } else {
                createEmployeeMutation.mutate(data);
              }
            }}
            isLoading={
              createEmployeeMutation.isPending ||
              updateEmployeeMutation.isPending
            }
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType
                ? 'Редактировать тип сотрудника'
                : 'Добавить тип сотрудника'}
            </DialogTitle>
          </DialogHeader>
          <EmployeeTypeForm
            initialData={editingType || undefined}
            onSubmit={(data) => {
              if (editingType) {
                updateTypeMutation.mutate({ id: editingType.id, data });
              } else {
                createTypeMutation.mutate(data);
              }
            }}
            isLoading={
              createTypeMutation.isPending || updateTypeMutation.isPending
            }
          />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="rounded-xl bg-gray-100 p-1">
          <TabsTrigger
            value="employees"
            className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Сотрудники
          </TabsTrigger>
          <TabsTrigger
            value="types"
            className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Типы
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="employees"
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        >
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-xs font-bold tracking-wider uppercase">
                  ФИО
                </TableHead>
                <TableHead className="text-xs font-bold tracking-wider uppercase">
                  Тип
                </TableHead>
                <TableHead className="text-right text-xs font-bold tracking-wider uppercase">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingEmployees ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Нет данных
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp) => (
                  <TableRow
                    key={emp.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">
                      {emp.name}
                    </TableCell>
                    <TableCell>
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500 uppercase">
                        {employeeTypes.find((t) => t.id === emp.employeeTypeId)
                          ?.name || 'Неизвестно'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEmployee(emp)}
                          className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (window.confirm('Удалить сотрудника?')) {
                              deleteEmployeeMutation.mutate(emp.id);
                            }
                          }}
                          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent
          value="types"
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
        >
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-xs font-bold tracking-wider uppercase">
                  Название
                </TableHead>
                <TableHead className="text-right text-xs font-bold tracking-wider uppercase">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingTypes ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : employeeTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Нет данных
                  </TableCell>
                </TableRow>
              ) : (
                employeeTypes.map((type) => (
                  <TableRow
                    key={type.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell>
                      <Users className="h-4 w-4 text-gray-400" />
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">
                      {type.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditType(type)}
                          className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (window.confirm('Удалить тип сотрудника?')) {
                              deleteTypeMutation.mutate(type.id);
                            }
                          }}
                          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
