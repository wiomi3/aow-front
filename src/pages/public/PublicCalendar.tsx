import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { eventService } from '@/services/events';
import { eventTypeService } from '@/services/event-types';
import { MONTHS_RU, DAYS_OF_WEEK, eventFallsOnDay } from '@/lib/calendar-utils';
import type { EventWithDetailsType } from '../../../schemas';

export default function PublicCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithDetailsType | null>(null);
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
    queryKey: ['public-events', year, month],
    queryFn: () => eventService.getPublicEvents(monthStart, monthEnd),
  });

  const { data: eventTypes = [] } = useQuery({
    queryKey: ['public-event-types'],
    queryFn: eventTypeService.getPublicAll,
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

  const hasActiveFilters = search.trim() !== '' || activeTypeIds.size > 0;

  const clearFilters = () => {
    setSearch('');
    setActiveTypeIds(new Set());
  };

  const handleEventClick = (
    event: EventWithDetailsType,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  return (
    <div className="space-y-6">
      {/* Header and Navigation */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-3xl font-black tracking-tight">
            {MONTHS_RU[month]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="rounded-xl shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {!isCurrentMonth && (
            <Button
              variant="outline"
              onClick={() => {
                const now = new Date();
                setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
              }}
              className="text-primary rounded-xl font-bold shadow-sm"
            >
              Сегодня
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="rounded-xl shadow-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {eventTypes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Фильтр:
            </span>
            {eventTypes.map((type) => {
              const isActive = activeTypeIds.has(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground bg-transparent'
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
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
              >
                <X className="h-3 w-3" />
                Сбросить
              </button>
            )}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="border-border bg-card relative overflow-hidden rounded-2xl border shadow-sm">
        {isLoadingEvents && (
          <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
          </div>
        )}

        {isEventsError && (
          <div className="flex h-40 items-center justify-center">
            <p className="text-destructive text-sm">
              Не удалось загрузить события. Попробуйте обновить страницу.
            </p>
          </div>
        )}

        {!isEventsError && (
          <>
            {/* Day headers */}
            <div className="border-border bg-muted/50 grid grid-cols-7 border-b">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="text-muted-foreground px-2 py-3 text-center text-xs font-bold tracking-widest uppercase sm:px-4"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid auto-rows-[100px] grid-cols-7 sm:auto-rows-[140px]">
              {Array.from({ length: firstDayIndex }, (_, i) => (
                <div
                  key={`pad-${i}`}
                  className="border-border bg-muted/30 border-r border-b"
                />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = isCurrentMonth && today.getDate() === day;

                const dayEvents = filteredEvents.filter((e) =>
                  eventFallsOnDay(e.startAt, year, month, day),
                );

                return (
                  <div
                    key={day}
                    className="group border-border bg-card relative border-r border-b p-1 transition-colors sm:p-2"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-7 sm:w-7 sm:text-sm ${
                        isToday
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      {day}
                    </span>

                    <div className="mt-1 max-h-[60px] space-y-0.5 overflow-y-auto sm:max-h-[85px] sm:space-y-1">
                      {dayEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={(e) => handleEventClick(event, e)}
                          style={{
                            backgroundColor:
                              event.type?.color ?? 'var(--primary)',
                          }}
                          className="w-full truncate rounded px-1.5 py-0.5 text-left text-[9px] font-bold text-white shadow-sm transition-all hover:brightness-90 sm:py-1 sm:text-[10px]"
                        >
                          {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* No results message */}
      {!isLoadingEvents &&
        !isEventsError &&
        hasActiveFilters &&
        filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground text-sm">
              Нет событий, соответствующих фильтрам.
            </p>
            <button
              onClick={clearFilters}
              className="text-primary mt-2 text-sm font-bold hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-[425px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: selectedEvent.type?.color,
                      color: selectedEvent.type?.color,
                    }}
                  >
                    {selectedEvent.type?.name ?? 'Без типа'}
                  </Badge>
                </div>
                <DialogTitle className="text-foreground text-2xl leading-tight font-black">
                  {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                  <div>
                    <p className="text-foreground font-bold">Время</p>
                    <p className="text-muted-foreground">
                      {new Date(selectedEvent.startAt).toLocaleTimeString(
                        'ru-RU',
                        { hour: '2-digit', minute: '2-digit' },
                      )}{' '}
                      —{' '}
                      {new Date(selectedEvent.endAt).toLocaleTimeString(
                        'ru-RU',
                        { hour: '2-digit', minute: '2-digit' },
                      )}
                    </p>
                  </div>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <div className="bg-chart-2 mt-1 h-2 w-2 shrink-0 rounded-full" />
                    <div>
                      <p className="text-foreground font-bold">Место</p>
                      <p className="text-muted-foreground">
                        {selectedEvent.location.name}
                      </p>
                    </div>
                  </div>
                )}
                {selectedEvent.employees &&
                  selectedEvent.employees.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="bg-chart-3 mt-1 h-2 w-2 shrink-0 rounded-full" />
                      <div>
                        <p className="text-foreground font-bold">Участники</p>
                        <ul className="text-muted-foreground space-y-1">
                          {selectedEvent.employees.map((emp) => (
                            <li key={emp.id}>
                              {emp.name}{' '}
                              {emp.employeeType && (
                                <span className="text-muted-foreground/80 text-xs">
                                  ({emp.employeeType.name})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                {selectedEvent.description && (
                  <div className="border-border mt-4 border-t pt-2">
                    <p className="text-foreground mb-1 font-bold">Описание</p>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
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
