import axios from 'axios';
import type { ApiErrorDto } from '../types/data';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorDto>(error)) {
    if (!error.response) {
      return 'Проблема з мережею. Перевірте з’єднання і спробуйте ще раз.';
    }
    if (error.response.status >= 500) {
      return error.response.data?.message ?? 'Помилка сервера. Спробуйте пізніше.';
    }
    return error.response.data?.message ?? 'Щось пішло не так.';
  }
  return 'Невідома помилка.';
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });
