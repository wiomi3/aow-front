import { z } from 'zod';

// ==========================================
// 1. EmployeeType (Тип сотрудника)
// ==========================================

export const employeeTypeInputSchema = z.object({
  name: z.string().min(2, 'Название должно содержать минимум 2 символа').trim(),
});

export const employeeTypeResponseSchema = employeeTypeInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type EmployeeTypeInputDTO = z.infer<typeof employeeTypeInputSchema>;
export type EmployeeTypeResponseDTO = z.infer<
  typeof employeeTypeResponseSchema
>;

// ==========================================
// 2. Employee (Сотрудник)
// ==========================================

export const employeeInputSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').trim(),
  employeeTypeId: z.string().uuid('Некорректный ID типа сотрудника'),
});

export const employeeResponseSchema = employeeInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  // Опционально: можно добавить вложенный тип, если сервер будет возвращать его через include: { employeeType: true }
  // employeeType: employeeTypeResponseSchema.optional(),
});

export type EmployeeInputDTO = z.infer<typeof employeeInputSchema>;
export type EmployeeResponseDTO = z.infer<typeof employeeResponseSchema>;

// ==========================================
// 3. EventType (Тип мероприятия)
// ==========================================

export const eventTypeInputSchema = z.object({
  name: z.string().min(2, 'Название обязательно').trim(),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Требуется валидный HEX-код (например, #FF5733)',
    ),
});

export const eventTypeResponseSchema = eventTypeInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type EventTypeInputDTO = z.infer<typeof eventTypeInputSchema>;
export type EventTypeResponseDTO = z.infer<typeof eventTypeResponseSchema>;

// ==========================================
// 4. Location (Площадка/Локация)
// ==========================================

export const locationInputSchema = z.object({
  name: z.string().min(2, 'Название локации обязательно').trim(),
  address: z.string().min(5, 'Укажите полный адрес').trim(),
});

export const locationResponseSchema = locationInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type LocationInputDTO = z.infer<typeof locationInputSchema>;
export type LocationResponseDTO = z.infer<typeof locationResponseSchema>;

// ==========================================
// 5. Event (Событие)
// ==========================================

export const eventInputSchema = z
  .object({
    title: z.string().min(3, 'Название мероприятия обязательно').trim(),
    description: z.string().nullable().optional(),
    startAt: z.iso.datetime({
      message: 'Ожидается валидная дата начала (ISO 8601)',
    }),
    endAt: z.iso.datetime({
      message: 'Ожидается валидная дата окончания (ISO 8601)',
    }),
    typeId: z.string().uuid('Выберите тип мероприятия'),
    locationId: z.string().uuid('Выберите локацию').nullable().optional(),
    // Для связи "Многие-ко-Многим" (сотрудники на мероприятии) передаем массив ID
    employeeIds: z
      .array(z.string().uuid('Некорректный ID сотрудника'))
      .min(1, 'Назначьте как минимум одного сотрудника'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startAt);
      const end = new Date(data.endAt);
      return end > start;
    },
    {
      message:
        'Дата окончания мероприятия должна быть строго позже даты начала',
      path: ['endAt'], // Эта ошибка автоматически привяжется к полю endAt в react-hook-form
    },
  );

export const eventResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  typeId: z.string().uuid(),
  locationId: z.string().uuid().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  // При GET-запросах (когда нужен include связанных данных для отрисовки карточек)
  type: eventTypeResponseSchema.optional(),
  location: locationResponseSchema.nullable().optional(),
  employees: z.array(employeeResponseSchema).optional(),
});

export const employeeWithDetailsResponseSchema = employeeResponseSchema.extend({
  employeeType: employeeTypeResponseSchema,
});

export type EmployeeWithDetailsResponseDTO = z.infer<
  typeof employeeWithDetailsResponseSchema
>;

export const eventWithDetailsResponseSchema = eventResponseSchema.extend({
  type: eventTypeResponseSchema,
  location: locationResponseSchema.nullable(),
  employees: z.array(employeeWithDetailsResponseSchema),
});
export type EventWithDetailsResponseDTO = z.infer<
  typeof eventWithDetailsResponseSchema
>;
export const EventWithDetailsSchema = eventWithDetailsResponseSchema;
export type EventWithDetailsType = z.infer<typeof EventWithDetailsSchema>;

export type EventInputDTO = z.infer<typeof eventInputSchema>;
export type EventResponseDTO = z.infer<typeof eventResponseSchema>;
