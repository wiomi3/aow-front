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
import { Plus, Edit2, Trash2, Building2, Phone, User } from 'lucide-react';
import { additionalOrgService, type AdditionalOrg } from '@/services/additional-orgs';
import { AdditionalOrgForm } from '@/components/admin/forms/AdditionalOrgForm';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import type { AdditionalOrgInputDTO } from '../../../schemas';

export default function AdminAdditionalOrgs() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<AdditionalOrg | null>(null);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);

  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ['additional-orgs'],
    queryFn: additionalOrgService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: additionalOrgService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional-orgs'] });
      setIsDialogOpen(false);
      toast.success('Организация добавлена');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при добавлении организации');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdditionalOrgInputDTO }) =>
      additionalOrgService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional-orgs'] });
      setIsDialogOpen(false);
      setEditingOrg(null);
      toast.success('Данные организации обновлены');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при обновлении организации');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: additionalOrgService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional-orgs'] });
      toast.success('Организация удалена');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при удалении организации');
    },
  });

  const handleEdit = (org: AdditionalOrg) => {
    setEditingOrg(org);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingOrg(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOrgToDelete(id);
  };

  const confirmDelete = () => {
    if (orgToDelete) {
      deleteMutation.mutate(orgToDelete);
      setOrgToDelete(null);
    }
  };

  const handleSubmit = (data: AdditionalOrgInputDTO) => {
    if (editingOrg) {
      updateMutation.mutate({ id: editingOrg.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-3xl font-black tracking-tight">
            Сторонние организации
          </h2>
          <p className="text-muted-foreground">
            Управление внешними подрядчиками и партнерами.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="shadow-primary/20 gap-2 rounded-xl font-bold shadow-xl"
        >
          <Plus className="h-4 w-4" /> Добавить организацию
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingOrg(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOrg
                ? 'Редактировать организацию'
                : 'Добавить организацию'}
            </DialogTitle>
          </DialogHeader>
          <AdditionalOrgForm
            initialData={editingOrg || undefined}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-xs font-bold tracking-wider uppercase">
                Организация
              </TableHead>
              <TableHead className="text-xs font-bold tracking-wider uppercase">
                Контактное лицо
              </TableHead>
              <TableHead className="text-xs font-bold tracking-wider uppercase">
                Телефон
              </TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider uppercase">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : orgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              orgs.map((org) => (
                <TableRow
                  key={org.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <Building2 className="text-muted-foreground h-4 w-4" />
                  </TableCell>
                  <TableCell className="font-bold">
                    {org.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="text-muted-foreground h-3.5 w-3.5" />
                      {org.contactName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground h-3.5 w-3.5" />
                      {org.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(org)}
                        className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(org.id)}
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
      </div>

      <ConfirmDialog
        open={!!orgToDelete}
        onOpenChange={(open) => !open && setOrgToDelete(null)}
        title="Удалить организацию?"
        description="Это действие нельзя будет отменить."
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
