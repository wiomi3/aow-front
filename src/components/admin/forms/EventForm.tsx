import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, isValid } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { EventTypeResponseDTO, EventInputDTO, EventResponseDTO } from '../../../../schemas';
import type { Location } from '@/services/locations';
import type { Employee } from '@/services/employees';

const eventFormSchema = z
  .object({
    title: z.string().min(3, 'Название должно содержать минимум 3 символа').trim(),
    description: z.string().optional(),
    startAt: z.string().min(1, 'Укажите дату начала'),
    endAt: z.string().min(1, 'Укажите дату окончания'),
    typeId: z.string().min(1, 'Выберите тип события'),
    locationId: z.string().optional(),
    employeeIds: z.array(z.string()).min(1, 'Назначьте хотя бы одного сотрудника'),
  })
  .refine(
    (data) => !data.startAt || !data.endAt || new Date(data.endAt) > new Date(data.startAt),
    { message: 'Дата окончания должна быть позже даты начала', path: ['endAt'] },
  );

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  initialData?: EventResponseDTO;
  eventTypes: EventTypeResponseDTO[];
  locations: Location[];
  employees: Employee[];
  onSubmit: (data: EventInputDTO) => void;
  isLoading?: boolean;
  defaultDate?: string;
  onDelete?: () => void;
}

// Converts a UTC ISO string to a datetime-local value in the browser's local timezone.
const toDatetimeLocal = (iso: string): string => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function DateTimePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const dateObj = value ? new Date(value) : undefined;
  const isValidDate = dateObj && isValid(dateObj);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const timeStr = value && value.includes('T') ? value.split('T')[1] : '00:00';
    onChange(`${dateStr}T${timeStr}`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    if (!timeStr) return;
    const dateStr =
      value && value.includes('T')
        ? value.split('T')[0]
        : format(new Date(), 'yyyy-MM-dd');
    onChange(`${dateStr}T${timeStr}`);
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'flex-1 justify-start text-left font-normal px-3',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isValidDate ? (
              format(dateObj, 'd MMM yyyy', { locale: ru })
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={isValidDate ? dateObj : undefined}
            onSelect={(date) => handleDateSelect(date as Date | undefined)}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={value && value.includes('T') ? value.split('T')[1] : ''}
        onChange={handleTimeChange}
        disabled={disabled}
        className="w-[90px]"
      />
    </div>
  );
}

export function EventForm({
  initialData,
  eventTypes,
  locations,
  employees,
  onSubmit,
  isLoading,
  defaultDate,
  onDelete,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      startAt: initialData?.startAt
        ? toDatetimeLocal(initialData.startAt)
        : defaultDate
          ? `${defaultDate}T09:00`
          : '',
      endAt: initialData?.endAt
        ? toDatetimeLocal(initialData.endAt)
        : defaultDate
          ? `${defaultDate}T10:00`
          : '',
      typeId: initialData?.typeId ?? '',
      locationId: initialData?.locationId ?? '',
      employeeIds: initialData?.employees?.map((e) => e.id) ?? [],
    },
  });

  const handleFormSubmit = (values: EventFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description || null,
      startAt: new Date(values.startAt).toISOString(),
      endAt: new Date(values.endAt).toISOString(),
      typeId: values.typeId,
      locationId: values.locationId || null,
      employeeIds: values.employeeIds,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Название</FieldLabel>
        <FieldContent>
          <Input
            {...register('title')}
            placeholder="Название мероприятия"
            disabled={isLoading}
          />
          <FieldError errors={[errors.title]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Начало</FieldLabel>
          <FieldContent>
            <Controller
              name="startAt"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
            <FieldError errors={[errors.startAt]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Конец</FieldLabel>
          <FieldContent>
            <Controller
              name="endAt"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
            <FieldError errors={[errors.endAt]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Тип события</FieldLabel>
          <FieldContent>
            <Controller
              name="typeId"
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
                    {eventTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: t.color }}
                          />
                          {t.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.typeId]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Локация</FieldLabel>
          <FieldContent>
            <Controller
              name="locationId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || 'none'}
                  onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Не указана" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Не указана</SelectItem>
                    {locations.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Описание</FieldLabel>
        <FieldContent>
          <Textarea
            {...register('description')}
            placeholder="Описание мероприятия (необязательно)"
            disabled={isLoading}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Сотрудники</FieldLabel>
        <FieldContent>
          <Controller
            name="employeeIds"
            control={control}
            render={({ field }) => (
              <div className="max-h-40 overflow-y-auto rounded-lg border border-border p-3 space-y-2">
                {employees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет доступных сотрудников</p>
                ) : (
                  employees.map((emp) => {
                    const checked = field.value.includes(emp.id);
                    return (
                      <div key={emp.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`emp-${emp.id}`}
                          checked={checked}
                          onCheckedChange={(c) => {
                            if (c) {
                              field.onChange([...field.value, emp.id]);
                            } else {
                              field.onChange(
                                field.value.filter((id: string) => id !== emp.id),
                              );
                            }
                          }}
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor={`emp-${emp.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {emp.name}
                        </Label>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          />
          {errors.employeeIds?.message && (
            <p className="text-sm text-destructive">{errors.employeeIds.message}</p>
          )}
        </FieldContent>
      </Field>

      <div className="flex justify-between pt-4">
        {onDelete ? (
          <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
            Удалить
          </Button>
        ) : (
          <div />
        )}
        <Button type="submit" disabled={isLoading}>
          {initialData ? 'Сохранить изменения' : 'Создать мероприятие'}
        </Button>
      </div>
    </form>
  );
}
