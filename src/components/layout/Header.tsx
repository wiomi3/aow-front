import { Link } from '@tanstack/react-router';
import { useSession, authClient } from '../../lib/auth-client';

export function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-blue-600">
          AOW Календарь
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {session && (
            <Link
              to="/admin"
              className="hover:text-blue-600 [&.active]:font-bold [&.active]:text-blue-600"
            >
              Админ-панель
            </Link>
          )}
        </nav>
      </div>

      <div>
        {isPending ? (
          <div className="h-8 w-20 animate-pulse rounded bg-gray-100" />
        ) : session ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-gray-700 sm:inline">
              {session.user.name}
            </span>
            <button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = '/';
                    },
                  },
                })
              }
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Выйти
            </button>
          </div>
        ) : (
          <Link
            to="/admin/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700"
          >
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
