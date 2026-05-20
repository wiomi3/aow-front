import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'События',
      value: '12',
      icon: Calendar,
      description: 'Запланировано на этот месяц',
    },
    {
      title: 'Площадки',
      value: '4',
      icon: MapPin,
      description: 'Активные локации',
    },
    {
      title: 'Типы событий',
      value: '6',
      icon: Tag,
      description: 'Категории мероприятий',
    },
    {
      title: 'Сотрудники',
      value: '18',
      icon: Users,
      description: 'Задействованный персонал',
    },
  ];

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-gray-900">
          Панель управления
        </h2>
        <p className="text-gray-500">
          Обзор текущего состояния системы и быстрый доступ к разделам.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="rounded-2xl border-gray-100 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold tracking-wider text-gray-400 uppercase">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-gray-900">
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-blue-100 p-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Добро пожаловать в админ-панель
          </h3>
          <p className="max-w-sm text-sm text-gray-500">
            Выберите раздел в верхнем меню для управления расписанием
            мероприятий, редактирования площадок или списка сотрудников.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
