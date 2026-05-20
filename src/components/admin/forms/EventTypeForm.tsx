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
import { type EventType } from '@/services/event-types';
import { eventTypeInputSchema, type EventTypeInputDTO } from '../../../../schemas';

interface EventTypeFormProps {
  initialData?: EventType;
  onSubmit: (data: EventTypeInputDTO) => void;
  isLoading?: boolean;
}

export function EventTypeForm({
  initialData,
  onSubmit,
  isLoading,
}: EventTypeFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventTypeInputDTO>({
    resolver: zodResolver(eventTypeInputSchema),
    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || '#3b82f6',
    },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Название</FieldLabel>
        <FieldContent>
          <Input
            {...register('name')}
            placeholder="Введите название типа события"
            disabled={isLoading}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Цвет</FieldLabel>
        <FieldContent>
          <div className="flex gap-2">
            <Input
              type="color"
              className="h-10 w-12 cursor-pointer p-1"
              value={selectedColor}
              onChange={(e) => setValue('color', e.target.value)}
              disabled={isLoading}
            />
            <Input
              {...register('color')}
              placeholder="#000000"
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          <FieldError errors={[errors.color]} />
        </FieldContent>
      </Field>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {initialData ? 'Сохранить изменения' : 'Создать тип события'}
        </Button>
      </div>
    </form>
  );
}
