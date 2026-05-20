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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { eventTypeService, type EventType } from '@/services/event-types';
import { EventTypeForm } from '@/components/admin/forms/EventTypeForm';
import { toast } from 'sonner';
import type { EventTypeInputDTO } from '../../../schemas';

export default function AdminEventTypes() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<EventType | null>(null);

  const { data: types = [], isLoading } = useQuery({
    queryKey: ['event-types'],
    queryFn: eventTypeService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: eventTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      setIsDialogOpen(false);
      toast.success('Тип события создан');
    },
    onError: () => toast.error('Ошибка при создании типа события'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventTypeInputDTO }) =>
      eventTypeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      setIsDialogOpen(false);
      setEditingType(null);
      toast.success('Тип события обновлен');
    },
    onError: () => toast.error('Ошибка при обновлении типа события'),
  });

  const deleteMutation = useMutation({
    mutationFn: eventTypeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      toast.success('Тип события удален');
    },
    onError: () => toast.error('Ошибка при удалении типа события'),
  });

  const handleEdit = (type: EventType) => {
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingType(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тип события?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: EventTypeInputDTO) => {
    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            Типы событий
          </h2>
          <p className="text-gray-500">
            Категории и цветовое кодирование для календаря.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="gap-2 rounded-xl font-bold shadow-xl shadow-blue-100"
        >
          <Plus className="h-4 w-4" /> Добавить тип
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType
                ? 'Редактировать тип события'
                : 'Добавить тип события'}
            </DialogTitle>
          </DialogHeader>
          <EventTypeForm
            initialData={editingType || undefined}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-xs font-bold tracking-wider uppercase">
                Название
              </TableHead>
              <TableHead className="text-xs font-bold tracking-wider uppercase">
                Цвет
              </TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider uppercase">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : types.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <TableRow
                  key={type.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <TableCell>
                    <Tag className="h-4 w-4 text-gray-400" />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-2 font-bold"
                      style={{ borderColor: type.color, color: type.color }}
                    >
                      {type.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full shadow-sm"
                        style={{ backgroundColor: type.color }}
                      />
                      <code className="text-xs text-gray-400 uppercase">
                        {type.color}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(type)}
                        className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(type.id)}
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
      </div>
    </div>
  );
}
