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
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import type { EmployeeInputDTO, EmployeeTypeInputDTO } from '../../../schemas';

export default function AdminEmployees() {
  const queryClient = useQueryClient();
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingType, setEditingType] = useState<EmployeeType | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [employeeTypeToDelete, setEmployeeTypeToDelete] = useState<
    string | null
  >(null);

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
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при добавлении сотрудника');
    },
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
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при обновлении сотрудника');
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: employeeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Сотрудник удален');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при удалении сотрудника');
    },
  });

  // Type Mutations
  const createTypeMutation = useMutation({
    mutationFn: employeeTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
      setIsTypeDialogOpen(false);
      toast.success('Тип сотрудника создан');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при создании типа сотрудника');
    },
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
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при обновлении типа сотрудника');
    },
  });

  const deleteTypeMutation = useMutation({
    mutationFn: employeeTypeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-types'] });
      toast.success('Тип сотрудника удален');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при удалении типа сотрудника');
    },
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

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      deleteEmployeeMutation.mutate(employeeToDelete);
      setEmployeeToDelete(null);
    }
  };

  const confirmDeleteType = () => {
    if (employeeTypeToDelete) {
      deleteTypeMutation.mutate(employeeTypeToDelete);
      setEmployeeTypeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-3xl font-black tracking-tight">
            Персонал
          </h2>
          <p className="text-muted-foreground">
            Управление сотрудниками и их типами.
          </p>
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
            className="shadow-primary/20 gap-2 rounded-xl font-bold shadow-xl"
          >
            <Plus className="h-4 w-4" /> Добавить сотрудника
          </Button>
        </div>
      </div>

      <Dialog
        open={isEmployeeDialogOpen}
        onOpenChange={(open) => {
          setIsEmployeeDialogOpen(open);
          if (!open) setEditingEmployee(null);
        }}
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

      <Dialog
        open={isTypeDialogOpen}
        onOpenChange={(open) => {
          setIsTypeDialogOpen(open);
          if (!open) setEditingType(null);
        }}
      >
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
        <TabsList className="bg-muted rounded-xl p-1">
          <TabsTrigger
            value="employees"
            className="data-[state=active]:bg-card data-[state=active]:text-primary rounded-lg px-4 py-2 font-bold data-[state=active]:shadow-sm"
          >
            Сотрудники
          </TabsTrigger>
          <TabsTrigger
            value="types"
            className="data-[state=active]:bg-card data-[state=active]:text-primary rounded-lg px-4 py-2 font-bold data-[state=active]:shadow-sm"
          >
            Типы
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="employees"
          className="bg-card overflow-hidden rounded-2xl border shadow-sm"
        >
          <Table>
            <TableHeader className="bg-muted/50">
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
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                        <User className="text-primary h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-bold">
                      {emp.name}
                    </TableCell>
                    <TableCell>
                      <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-bold uppercase">
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
                          className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEmployeeToDelete(emp.id)}
                          className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-lg"
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
          className="bg-card overflow-hidden rounded-2xl border shadow-sm"
        >
          <Table>
            <TableHeader className="bg-muted/50">
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
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <Users className="text-muted-foreground h-4 w-4" />
                    </TableCell>
                    <TableCell className="text-foreground font-bold">
                      {type.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditType(type)}
                          className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEmployeeTypeToDelete(type.id)}
                          className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-lg"
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

      <ConfirmDialog
        open={!!employeeToDelete}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}
        title="Удалить сотрудника?"
        onConfirm={confirmDeleteEmployee}
        isPending={deleteEmployeeMutation.isPending}
      />

      <ConfirmDialog
        open={!!employeeTypeToDelete}
        onOpenChange={(open) => !open && setEmployeeTypeToDelete(null)}
        title="Удалить тип сотрудника?"
        onConfirm={confirmDeleteType}
        isPending={deleteTypeMutation.isPending}
      />
    </div>
  );
}
