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
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { locationService, type Location } from '@/services/locations';
import { LocationForm } from '@/components/admin/forms/LocationForm';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import type { LocationInputDTO } from '../../../schemas';

export default function AdminLocations() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: locationService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: locationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsDialogOpen(false);
      toast.success('Площадка создана');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при создании площадки');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LocationInputDTO }) =>
      locationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsDialogOpen(false);
      setEditingLocation(null);
      toast.success('Площадка обновлена');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при обновлении площадки');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: locationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Площадка удалена');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при удалении площадки');
    },
  });

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingLocation(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLocationToDelete(id);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteMutation.mutate(locationToDelete);
      setLocationToDelete(null);
    }
  };

  const handleSubmit = (data: LocationInputDTO) => {
    if (editingLocation) {
      updateMutation.mutate({ id: editingLocation.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Площадки
          </h2>
          <p className="text-muted-foreground">
            Список всех доступных локаций для проведения мероприятий.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="gap-2 rounded-xl font-bold shadow-xl shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Добавить площадку
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingLocation(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? 'Редактировать площадку' : 'Добавить площадку'}
            </DialogTitle>
          </DialogHeader>
          <LocationForm
            initialData={editingLocation || undefined}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-xs font-bold tracking-wider uppercase">
                Название
              </TableHead>
              <TableHead className="text-xs font-bold tracking-wider uppercase">
                Адрес
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
            ) : locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => (
                <TableRow
                  key={location.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <MapPin className="h-4 w-4 text-primary" />
                  </TableCell>
                  <TableCell className="font-bold text-foreground">
                    {location.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {location.address}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(location)}
                        className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(location.id)}
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
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

      <ConfirmDialog
        open={!!locationToDelete}
        onOpenChange={(open) => !open && setLocationToDelete(null)}
        title="Удалить площадку?"
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
