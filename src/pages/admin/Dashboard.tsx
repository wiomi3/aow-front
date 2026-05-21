import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { eventService } from '@/services/events';
import { locationService } from '@/services/locations';
import { eventTypeService } from '@/services/event-types';
import { employeeService } from '@/services/employees';

export default function AdminDashboard() {
  const { year, month, monthStart, monthEnd } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return {
      year: y,
      month: m,
      monthStart: new Date(y, m, 1).toISOString(),
      monthEnd: new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString(),
    };
  }, []);

  const { data: events = [] } = useQuery({
    queryKey: ['admin-events', year, month],
    queryFn: () => eventService.getAdminEvents(monthStart, monthEnd),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: locationService.getAll,
  });

  const { data: eventTypes = [] } = useQuery({
    queryKey: ['event-types'],
    queryFn: eventTypeService.getAll,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  const stats = [
    {
      title: 'События',
      value: events.length.toString(),
      icon: Calendar,
      description: 'Запланировано на этот месяц',
    },
    {
      title: 'Площадки',
      value: locations.length.toString(),
      icon: MapPin,
      description: 'Активные локации',
    },
    {
      title: 'Типы событий',
      value: eventTypes.length.toString(),
      icon: Tag,
      description: 'Категории мероприятий',
    },
    {
      title: 'Сотрудники',
      value: employees.length.toString(),
      icon: Users,
      description: 'Задействованный персонал',
    },
  ];

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="space-y-2">
        <h2 className="text-foreground text-3xl font-black tracking-tight">
          Панель управления
        </h2>
        <p className="text-muted-foreground">
          Обзор текущего состояния системы и быстрый доступ к разделам.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-border rounded-2xl shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                {stat.title}
              </CardTitle>
              <stat.icon className="text-primary h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-foreground text-2xl font-black">
                {stat.value}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-muted/30 rounded-3xl border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-primary/10 mb-4 rounded-full p-4">
            <Calendar className="text-primary h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-bold">
            Добро пожаловать в админ-панель
          </h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            Выберите раздел в верхнем меню для управления расписанием
            мероприятий, редактирования площадок или списка сотрудников.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
