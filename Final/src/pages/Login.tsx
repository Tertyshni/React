import { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/Auth';
import { useNotifications } from '../context/Notifications';
import { getErrorMessage } from '../utils/helpers';

const loginSchema = z.object({
  email: z.string().min(1, 'Введіть email').email('Некоректний email'),
  password: z.string().min(6, 'Пароль має бути не коротший за 6 символів'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { user, login } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const emailRef = useRef<HTMLInputElement | null>(null);
  const { ref: emailFormRef, ...emailField } = register('email');

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  if (user) {
    return <Navigate to="/requests" replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const me = await login(values.email, values.password);
      notifySuccess(`Вітаємо, ${me.name}!`);
      navigate('/requests', { replace: true });
    } catch (error) {
      notifyError(`Не вдалося увійти: ${getErrorMessage(error)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
      <h2>Вхід</h2>

      <label className="field">
        <span>Email</span>
        <input
          type="email"
          autoComplete="username"
          {...emailField}
          ref={(el) => {
            emailFormRef(el);
            emailRef.current = el;
          }}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>

      <label className="field">
        <span>Пароль</span>
        <input type="password" autoComplete="current-password" {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </label>

      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Входимо...' : 'Увійти'}
      </button>

      <p className="hint">
        Тестові акаунти: user@example.com / user123, operator@example.com / operator123
      </p>
    </form>
  );
}
