import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSession, authClient } from '../../lib/auth-client';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear();
          navigate({ to: '/' });
        },
      },
    });
  };

  return (
    <header className="bg-background flex h-16 items-center justify-between border-b px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-primary text-xl font-bold tracking-tight">
          AOW Календарь
        </Link>
        <ThemeToggle />
      </div>
      <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
        {session && (
          <Link
            to="/admin"
            className="hover:text-primary [&.active]:text-primary [&.active]:font-bold"
          >
            Админ-панель
          </Link>
        )}
      </nav>
      <div>
        {isPending ? (
          <div className="bg-muted h-8 w-20 animate-pulse rounded" />
        ) : session ? (
          <div className="flex items-center gap-4">
            <span className="text-foreground hidden text-sm font-medium sm:inline">
              {session.user.name}
            </span>
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:bg-muted rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              Выйти
            </button>
          </div>
        ) : (
          <Link
            to="/admin/login"
            className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-bold shadow-md transition-all"
          >
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
