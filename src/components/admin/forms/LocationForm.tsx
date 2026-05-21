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
import { type Location } from '@/services/locations';
import {
  locationInputSchema,
  type LocationInputDTO,
} from '../../../../schemas';

interface LocationFormProps {
  initialData?: Location;
  onSubmit: (data: LocationInputDTO) => void;
  isLoading?: boolean;
}

export function LocationForm({
  initialData,
  onSubmit,
  isLoading,
}: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationInputDTO>({
    resolver: zodResolver(locationInputSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Название</FieldLabel>
        <FieldContent>
          <Input
            {...register('name')}
            placeholder="Введите название площадки"
            disabled={isLoading}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Адрес</FieldLabel>
        <FieldContent>
          <Input
            {...register('address')}
            placeholder="Введите адрес площадки"
            disabled={isLoading}
          />
          <FieldError errors={[errors.address]} />
        </FieldContent>
      </Field>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {initialData ? 'Сохранить изменения' : 'Создать площадку'}
        </Button>
      </div>
    </form>
  );
}
