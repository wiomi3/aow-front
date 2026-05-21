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
import { type AdditionalOrg } from '@/services/additional-orgs';
import {
  additionalOrgInputSchema,
  type AdditionalOrgInputDTO,
} from '../../../../schemas';

interface AdditionalOrgFormProps {
  initialData?: AdditionalOrg;
  onSubmit: (data: AdditionalOrgInputDTO) => void;
  isLoading?: boolean;
}

const formatPhoneNumber = (value: string) => {
  if (!value) return '+7 ';
  
  // Keep only digits, but ignore the leading 7 if it's already there
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('7')) {
    digits = digits.slice(1);
  }
  
  // Limit to 10 digits (the part after +7)
  digits = digits.slice(0, 10);
  
  let result = '+7 ';
  if (digits.length > 0) {
    result += digits.slice(0, 3);
  }
  if (digits.length > 3) {
    result += '-' + digits.slice(3, 6);
  }
  if (digits.length > 6) {
    result += '-' + digits.slice(6, 8);
  }
  if (digits.length > 8) {
    result += '-' + digits.slice(8, 10);
  }
  
  return result;
};

export function AdditionalOrgForm({
  initialData,
  onSubmit,
  isLoading,
}: AdditionalOrgFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdditionalOrgInputDTO>({
    resolver: zodResolver(additionalOrgInputSchema),
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '+7 ',
      contactName: initialData?.contactName || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Название организации</FieldLabel>
        <FieldContent>
          <Input
            {...register('name')}
            placeholder="Введите название организации"
            disabled={isLoading}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Контактное лицо</FieldLabel>
        <FieldContent>
          <Input
            {...register('contactName')}
            placeholder="Введите имя контактного лица"
            disabled={isLoading}
          />
          <FieldError errors={[errors.contactName]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Телефон</FieldLabel>
        <FieldContent>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  field.onChange(formatted);
                }}
                placeholder="+7 xxx-xxx-xx-xx"
                disabled={isLoading}
              />
            )}
          />
          <FieldError errors={[errors.phone]} />
        </FieldContent>
      </Field>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {initialData ? 'Сохранить изменения' : 'Добавить организацию'}
        </Button>
      </div>
    </form>
  );
}
