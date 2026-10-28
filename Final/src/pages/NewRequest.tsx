import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories, usePriorities } from '../hooks/dictionaries';
import { useCreateRequest } from '../hooks/requests';
import { useAuth } from '../context/Auth';

const requestSchema = z.object({
  subject: z.string().min(5, 'Тема має бути мінімум 5 символів').max(100, 'Тема задовга'),
  description: z.string().min(10, 'Опишіть проблему детальніше (мінімум 10 символів)'),
  categoryId: z.string().min(1, 'Оберіть категорію'),
  priorityId: z.string().min(1, 'Оберіть пріоритет'),
  contactName: z.string().min(2, 'Вкажіть ім’я'),
  contactEmail: z.string().min(1, 'Вкажіть email').email('Некоректний email'),
  contactPhone: z
    .string()
    .regex(/^\+?\d{10,13}$/, 'Телефон у форматі +380501234567'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export function NewRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { data: priorities } = usePriorities();

  const createMutation = useCreateRequest((created) => navigate(`/requests/${created.id}`));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      subject: '',
      description: '',
      categoryId: '',
      priorityId: '',
      contactName: user?.name ?? '',
      contactEmail: user?.email ?? '',
      contactPhone: '',
    },
  });

  const onSubmit = (values: RequestFormValues) => {
    createMutation.mutate({
      subject: values.subject,
      description: values.description,
      categoryId: values.categoryId,
      priorityId: values.priorityId,
      contact: {
        name: values.contactName,
        email: values.contactEmail,
        phone: values.contactPhone,
      },
    });
  };

  const sending = createMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="form form-wide">
      <h2>Нова заявка</h2>

      <label className="field">
        <span>Тема</span>
        <input type="text" {...register('subject')} />
        {errors.subject && <span className="error">{errors.subject.message}</span>}
      </label>

      <label className="field">
        <span>Опис</span>
        <textarea rows={5} {...register('description')} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </label>

      <div className="row">
        <label className="field">
          <span>Категорія</span>
          <select {...register('categoryId')}>
            <option value="">— оберіть —</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="error">{errors.categoryId.message}</span>}
        </label>

        <label className="field">
          <span>Пріоритет</span>
          <select {...register('priorityId')}>
            <option value="">— оберіть —</option>
            {priorities?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.priorityId && <span className="error">{errors.priorityId.message}</span>}
        </label>
      </div>

      <h3>Контактні дані</h3>

      <label className="field">
        <span>Ім’я</span>
        <input type="text" {...register('contactName')} />
        {errors.contactName && <span className="error">{errors.contactName.message}</span>}
      </label>

      <div className="row">
        <label className="field">
          <span>Email</span>
          <input type="email" {...register('contactEmail')} />
          {errors.contactEmail && <span className="error">{errors.contactEmail.message}</span>}
        </label>

        <label className="field">
          <span>Телефон</span>
          <input type="tel" placeholder="+380501234567" {...register('contactPhone')} />
          {errors.contactPhone && <span className="error">{errors.contactPhone.message}</span>}
        </label>
      </div>

      <button type="submit" className="btn" disabled={sending}>
        {sending ? 'Надсилаємо...' : 'Створити заявку'}
      </button>

      <p className="hint">
        Для демо помилок: тема зі словом «500» дасть помилку сервера, зі словом «network» — мережеву помилку.
      </p>
    </form>
  );
}
