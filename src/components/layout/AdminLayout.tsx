import { Link, Outlet } from '@tanstack/react-router';

export function AdminLayout() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-foreground text-3xl font-black tracking-tight">
          Админ-панель
        </h1>
        <nav className="bg-muted flex flex-wrap items-center gap-1 rounded-lg p-1">
          <Link
            to="/admin/calendar"
            className="hover:bg-background [&.active]:bg-background [&.active]:text-primary rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:shadow-sm [&.active]:shadow-sm"
          >
            Календарь мероприятий
          </Link>
          <Link
            to="/admin/locations"
            className="hover:bg-background [&.active]:bg-background [&.active]:text-primary rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:shadow-sm [&.active]:shadow-sm"
          >
            Площадки
          </Link>
          <Link
            to="/admin/event-types"
            className="hover:bg-background [&.active]:bg-background [&.active]:text-primary rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:shadow-sm [&.active]:shadow-sm"
          >
            Типы мероприятий
          </Link>
          <Link
            to="/admin/employees"
            className="hover:bg-background [&.active]:bg-background [&.active]:text-primary rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:shadow-sm [&.active]:shadow-sm"
          >
            Сотрудники
          </Link>
          <Link
            to="/admin/additional-orgs"
            className="hover:bg-background [&.active]:bg-background [&.active]:text-primary rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:shadow-sm [&.active]:shadow-sm"
          >
            Сторонние организации
          </Link>
        </nav>
      </div>
      <div className="border-border bg-card min-h-100 rounded-2xl border p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
