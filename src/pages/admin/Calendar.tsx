import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import { eventService } from '@/services/events';
import { eventTypeService } from '@/services/event-types';
import { locationService } from '@/services/locations';
import { employeeService } from '@/services/employees';
import { EventForm } from '@/components/admin/forms/EventForm';
import { toast } from 'sonner';
import { MONTHS_RU, DAYS_OF_WEEK, eventFallsOnDay } from '@/lib/calendar-utils';
import type { EventResponseDTO, EventInputDTO } from '../../../schemas';

export default function AdminCalendar() {
  const queryClient = useQueryClient();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventResponseDTO | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTypeIds, setActiveTypeIds] = useState<Set<string>>(new Set());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthStart = useMemo(
    () => new Date(year, month, 1).toISOString(),
    [year, month],
  );
  const monthEnd = useMemo(
    () => new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString(),
    [year, month],
  );

  const {
    data: events = [],
    isLoading: isLoadingEvents,
    isError: isEventsError,
  } = useQuery({
    queryKey: ['admin-events', year, month],
    queryFn: () => eventService.getAdminEvents(monthStart, monthEnd),
  });

  const { data: eventTypes = [] } = useQuery({
    queryKey: ['event-types'],
    queryFn: eventTypeService.getAll,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: locationService.getAll,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  // Filtered events for the whole month
  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesSearch = q === '' || e.title.toLowerCase().includes(q);
      const matchesType =
        activeTypeIds.size === 0 ||
        (e.type != null && activeTypeIds.has(e.type.id));
      return matchesSearch && matchesType;
    });
  }, [events, search, activeTypeIds]);

  const createMutation = useMutation({
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events', year, month] });
      handleDialogClose();
      toast.success('Мероприятие создано');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при создании мероприятия');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventInputDTO }) =>
      eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events', year, month] });
      handleDialogClose();
      toast.success('Мероприятие обновлено');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при обновлении мероприятия');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: eventService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events', year, month] });
      handleDialogClose();
      toast.success('Мероприятие удалено');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Ошибка при удалении мероприятия');
    },
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const toggleType = (id: string) => {
    setActiveTypeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTypeIds(new Set());
  };

  const hasActiveFilters = search.trim() !== '' || activeTypeIds.size > 0;

  const handleDayClick = (day: number) => {
    setEditingEvent(null);
    setSelectedDay(day);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: EventResponseDTO, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDay(null);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setSelectedDay(null);
  };

  const handleSubmit = (data: EventInputDTO) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const defaultDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Календарь мероприятий
          </h2>
          <p className="text-muted-foreground">
            Управление расписанием и создание новых событий.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null);
            setSelectedDay(null);
            setIsDialogOpen(true);
          }}
          className="gap-2 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4 w-4" /> Добавить событие
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="rounded-xl hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-foreground">
            {MONTHS_RU[month]} {year}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={() => {
                const now = new Date();
                setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Сегодня
            </button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="rounded-xl hover:bg-muted"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {eventTypes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Фильтр:
            </span>
            {eventTypes.map((type) => {
              const isActive = activeTypeIds.has(type.id);
              return (
                <button
                  key={type.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleType(type.id);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: type.color, borderColor: type.color }
                      : { borderColor: type.color + '80' }
                  }
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: isActive ? 'white' : type.color }}
                  />
                  {type.name}
                </button>
              );
            })}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Сбросить
              </button>
            )}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {isLoadingEvents && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        )}

        {isEventsError && (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-destructive">
              Не удалось загрузить события. Попробуйте обновить страницу.
            </p>
          </div>
        )}

        {!isEventsError && (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/50">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="px-4 py-3 text-center text-xs font-bold tracking-widest text-muted-foreground uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid auto-rows-[140px] grid-cols-7">
              {/* Empty offset cells */}
              {Array.from({ length: firstDayIndex }, (_, i) => (
                <div key={`pad-${i}`} className="border-r border-b border-border bg-muted/30" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = isCurrentMonth && today.getDate() === day;

                const dayEvents = filteredEvents.filter((e) =>
                  eventFallsOnDay(e.startAt, year, month, day),
                );

                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className="group relative cursor-pointer border-r border-b border-border p-2 transition-colors hover:bg-primary/5"
                  >
                    {/* Day number */}
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                        isToday
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      {day}
                    </span>

                    {/* Events */}
                    <div className="mt-1 max-h-21.5 space-y-0.5 overflow-y-auto">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => handleEditEvent(event, e)}
                          className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[10px] leading-tight font-bold text-white transition-opacity hover:opacity-90"
                          style={{
                            backgroundColor: event.type?.color ?? 'var(--primary)',
                          }}
                        >
                          <span className="flex-1 truncate">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Редактировать мероприятие' : 'Новое мероприятие'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={editingEvent ?? undefined}
            eventTypes={eventTypes}
            locations={locations}
            employees={employees}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            defaultDate={defaultDateStr}
            onDelete={
              editingEvent
                ? () => handleDeleteEvent(editingEvent.id)
                : undefined
            }
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!eventToDelete}
        onOpenChange={(open) => !open && setEventToDelete(null)}
        title="Удалить мероприятие?"
        description="Это действие нельзя будет отменить."
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
