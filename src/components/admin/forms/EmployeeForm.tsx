import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Employee } from '@/services/employees';
import { type EmployeeType } from '@/services/employee-types';
import { employeeInputSchema, type EmployeeInputDTO } from '../../../../schemas';

interface EmployeeFormProps {
  initialData?: Employee;
  employeeTypes: EmployeeType[];
  onSubmit: (data: EmployeeInputDTO) => void;
  isLoading?: boolean;
}

export function EmployeeForm({
  initialData,
  employeeTypes,
  onSubmit,
  isLoading,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeInputDTO>({
    resolver: zodResolver(employeeInputSchema),
    defaultValues: {
      name: initialData?.name || '',
      employeeTypeId: initialData?.employeeTypeId || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>ФИО</FieldLabel>
        <FieldContent>
          <Input
            {...register('name')}
            placeholder="Введите ФИО сотрудника"
            disabled={isLoading}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Тип сотрудника</FieldLabel>
        <FieldContent>
          <Controller
            name="employeeTypeId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {employeeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.employeeTypeId]} />
        </FieldContent>
      </Field>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {initialData ? 'Сохранить изменения' : 'Добавить сотрудника'}
        </Button>
      </div>
    </form>
  );
}
