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

// Alias for compatibility with existing routes
export const EmployeeTypeSchema = employeeTypeResponseSchema;

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
  employeeType: employeeTypeResponseSchema.optional(),
});

export const employeeWithDetailsResponseSchema = employeeResponseSchema.extend({
  employeeType: employeeTypeResponseSchema,
});

export type EmployeeInputDTO = z.infer<typeof employeeInputSchema>;
export type EmployeeResponseDTO = z.infer<typeof employeeResponseSchema>;
export type EmployeeWithDetailsResponseDTO = z.infer<
  typeof employeeWithDetailsResponseSchema
>;

// Alias for compatibility with existing routes
export const EmployeeSchema = employeeResponseSchema;

// ==========================================
// 3. EventType (Тип события)
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

// Alias for compatibility with existing routes
export const EventTypeSchema = eventTypeResponseSchema;

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

// Alias for compatibility with existing routes
export const LocationSchema = locationResponseSchema;

// ==========================================
// 5. AdditionalOrgs (Сторонние организации)
// ==========================================

export const additionalOrgInputSchema = z.object({
  name: z.string().min(2, 'Название организации обязательно').trim(),
  phone: z
    .string()
    .regex(
      /^\+7 \d{3}-\d{3}-\d{2}-\d{2}$/,
      'Формат телефона: +7 xxx-xxx-xx-xx',
    ),
  contactName: z.string().min(2, 'Укажите имя контакта').trim(),
});

export const additionalOrgResponseSchema = additionalOrgInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type AdditionalOrgInputDTO = z.infer<typeof additionalOrgInputSchema>;
export type AdditionalOrgResponseDTO = z.infer<
  typeof additionalOrgResponseSchema
>;

export const AdditionalOrgSchema = additionalOrgResponseSchema;

// ==========================================
// 6. Event (Событие)
// ==========================================

export const eventInputSchema = z
  .object({
    title: z.string().min(3, 'Название события обязательно').trim(),

    description: z.string().nullable().optional(),

    startAt: z.iso.datetime({
      message: 'Ожидается валидная дата начала (ISO 8601)',
    }),
    endAt: z.iso.datetime({
      message: 'Ожидается валидная дата окончания (ISO 8601)',
    }),
    typeId: z.string().uuid('Выберите тип события'),
    locationId: z.string().uuid('Выберите локацию').nullable().optional(),
    employeeIds: z
      .array(z.string().uuid('Некорректный ID сотрудника'))
      .min(1, 'Назначьте как минимум одного сотрудника')
      .optional(),
    additionalOrgIds: z
      .array(z.string().uuid('Некорректный ID организации'))
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startAt);
      const end = new Date(data.endAt);
      return end > start;
    },
    {
      message: 'Дата окончания события должна быть строго позже даты начала',
      path: ['endAt'],
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
  type: eventTypeResponseSchema.optional(),
  location: locationResponseSchema.nullable().optional(),
  employees: z.array(employeeResponseSchema).optional(),
  additionalOrgs: z.array(additionalOrgResponseSchema).optional(),
});

export const eventWithDetailsResponseSchema = eventResponseSchema.extend({
  type: eventTypeResponseSchema,
  location: locationResponseSchema.nullable(),
  employees: z.array(employeeWithDetailsResponseSchema),
  additionalOrgs: z.array(additionalOrgResponseSchema),
});

export type EventInputDTO = z.infer<typeof eventInputSchema>;
export type EventResponseDTO = z.infer<typeof eventResponseSchema>;
export type EventWithDetailsResponseDTO = z.infer<
  typeof eventWithDetailsResponseSchema
>;

export type EventWithDetailsType = EventWithDetailsResponseDTO;

// Alias for compatibility with existing routes
export const EventSchema = eventResponseSchema;
export const EventWithDetailsSchema = eventWithDetailsResponseSchema;
