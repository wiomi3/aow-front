import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? '') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Произошла непредвиденная ошибка';

    switch (status) {
      case 401:
        // Unauthorized - session might have expired
        // Don't toast for login page errors as they are handled locally
        if (!window.location.pathname.includes('/admin/login')) {
          toast.error('Сессия истекла. Пожалуйста, войдите снова.');
          // Optional: redirect to login
          // window.location.href = '/admin/login';
        }
        break;
      case 403:
        toast.error('У вас недостаточно прав для этого действия');
        break;
      case 409:
        toast.error('Конфликт данных: ' + message);
        break;
      case 422:
        toast.error('Ошибка валидации: ' + message);
        break;
      case 500:
        toast.error('Ошибка сервера. Попробуйте позже.');
        break;
      default:
        if (error.code === 'ECONNABORTED') {
          toast.error('Время ожидания запроса истекло');
        } else if (!error.response) {
          toast.error('Нет соединения с сервером');
        } else {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
