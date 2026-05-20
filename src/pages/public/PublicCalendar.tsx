import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Mock data for UI development
const mockEvents = [
  {
    id: '1',
    title: 'Концерт группы "Ария"',
    startAt: '2026-05-20T19:00:00Z',
    endAt: '2026-05-20T22:00:00Z',
    location: 'Главная сцена',
    type: { name: 'Концерт', color: '#3b82f6' },
    description: 'Легендарный рок-концерт в самом сердце города.',
  },
  {
    id: '2',
    title: 'Выставка современного искусства',
    startAt: '2026-05-21T10:00:00Z',
    endAt: '2026-05-21T18:00:00Z',
    location: 'Галерея "Свет"',
    type: { name: 'Выставка', color: '#10b981' },
    description: 'Работы молодых художников со всей страны.',
  },
];

export default function PublicCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight text-gray-900">
          Май 2026
        </h2>
        <div className="flex gap-2">
          {/* Controls for month switching would go here */}
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-gray-50/50">
          {daysOfWeek.map((day) => (
            <div key={day} className="px-4 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((day) => (
            <div key={day} className="border-r border-b p-2 hover:bg-gray-50 transition-colors relative">
              <span className="text-sm font-semibold text-gray-400">{day}</span>
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                {mockEvents
                  .filter((e) => new Date(e.startAt).getDate() === day)
                  .map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      style={{ backgroundColor: event.type.color }}
                      className="w-full text-left px-2 py-1 rounded text-[10px] font-bold text-white truncate hover:brightness-90 transition-all shadow-sm"
                    >
                      {event.title}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" style={{ borderColor: selectedEvent.type.color, color: selectedEvent.type.color }}>
                    {selectedEvent.type.name}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-black leading-tight">
                  {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">Время</p>
                    <p className="text-gray-500">
                      {new Date(selectedEvent.startAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedEvent.endAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">Место</p>
                    <p className="text-gray-500">{selectedEvent.location}</p>
                  </div>
                </div>
                {selectedEvent.description && (
                  <div className="pt-2 border-t mt-4">
                    <p className="font-bold text-gray-900 mb-1">Описание</p>
                    <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
