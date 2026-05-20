import { Link, Outlet } from '@tanstack/react-router';

export function AdminLayout() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Админ-панель
        </h1>
        <nav className="flex flex-wrap items-center gap-1 rounded-lg bg-gray-100 p-1">
          <Link
            to="/admin/calendar"
            className="rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:bg-white hover:shadow-sm [&.active]:bg-white [&.active]:text-blue-600 [&.active]:shadow-sm"
          >
            Календарь
          </Link>
          <Link
            to="/admin/locations"
            className="rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:bg-white hover:shadow-sm [&.active]:bg-white [&.active]:text-blue-600 [&.active]:shadow-sm"
          >
            Площадки
          </Link>
          <Link
            to="/admin/event-types"
            className="rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:bg-white hover:shadow-sm [&.active]:bg-white [&.active]:text-blue-600 [&.active]:shadow-sm"
          >
            Типы
          </Link>
          <Link
            to="/admin/employees"
            className="rounded-md px-3 py-1.5 text-xs font-bold transition-all hover:bg-white hover:shadow-sm [&.active]:bg-white [&.active]:text-blue-600 [&.active]:shadow-sm"
          >
            Сотрудники
          </Link>
        </nav>
      </div>
      <div className="min-h-100 rounded-2xl border bg-white p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
