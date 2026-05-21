import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { signIn } from '../lib/auth-client';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.email('Некорректный адрес почты'),
  password: z.string().min(1, 'Пароль обязателен'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    const { error: signInError } = await signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: '/admin',
    });

    if (signInError) {
      toast.error(signInError.message || 'Неверная почта или пароль');
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-2xl transition-all hover:shadow-primary/20">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          Вход
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Доступ к управлению календарем
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="ml-1 text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Электронная почта
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="name@example.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="ml-1 text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="ml-1 flex justify-between text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Пароль
          </label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && (
            <p className="ml-1 text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-3">
              <svg
                className="h-5 w-5 animate-spin text-primary-foreground"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Авторизация...
            </span>
          ) : (
            'Войти'
          )}
        </button>
      </form>
    </div>
  );
}
