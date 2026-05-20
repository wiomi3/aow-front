import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminCalendar() {
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            Календарь мероприятий
          </h2>
          <p className="text-gray-500">
            Управление расписанием и создание новых событий.
          </p>
        </div>
        <Button className="gap-2 rounded-xl font-bold shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Plus className="h-4 w-4" /> Добавить событие
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b bg-gray-50/50">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-center text-xs font-bold tracking-widest text-gray-400 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid auto-rows-[150px] grid-cols-7">
          {calendarDays.map((day) => (
            <div
              key={day}
              className="group relative cursor-pointer border-r border-b p-2 transition-colors hover:bg-gray-50"
            >
              <span className="text-sm font-semibold text-gray-400">{day}</span>

              <div className="absolute inset-0 flex items-center justify-center bg-white/20 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                  <Plus className="h-4 w-4" />
                </div>
              </div>

              {/* Event chips would go here */}
              {day === 20 && (
                <div className="mt-1 space-y-1">
                  <div className="truncate rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                    Концерт группы "Ария"
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
