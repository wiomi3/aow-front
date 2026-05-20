import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type EmployeeType } from '@/services/employee-types';
import { employeeTypeInputSchema, type EmployeeTypeInputDTO } from '../../../../schemas';

interface EmployeeTypeFormProps {
  initialData?: EmployeeType;
  onSubmit: (data: EmployeeTypeInputDTO) => void;
  isLoading?: boolean;
}

export function EmployeeTypeForm({
  initialData,
  onSubmit,
  isLoading,
}: EmployeeTypeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeTypeInputDTO>({
    resolver: zodResolver(employeeTypeInputSchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Название</FieldLabel>
        <FieldContent>
          <Input
            {...register('name')}
            placeholder="Введите название типа сотрудника (например, Вокалист)"
            disabled={isLoading}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {initialData ? 'Сохранить изменения' : 'Создать тип сотрудника'}
        </Button>
      </div>
    </form>
  );
}
