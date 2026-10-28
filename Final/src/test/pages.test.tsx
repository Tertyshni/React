import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from './render';

async function loginAs(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Пароль'), password);
  await user.click(screen.getByRole('button', { name: 'Увійти' }));
  return user;
}

describe('форма входу', () => {
  it('автоматично ставить фокус на email', () => {
    renderApp('/login');
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('показує помилки валідації', async () => {
    renderApp('/login');
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Увійти' }));
    expect(await screen.findByText('Введіть email')).toBeInTheDocument();
    expect(screen.getByText(/не коротший за 6/)).toBeInTheDocument();
  });

  it('показує помилку при невірному паролі', async () => {
    renderApp('/login');
    await loginAs('user@example.com', 'wrong-password');
    expect(await screen.findByText(/Не вдалося увійти/)).toBeInTheDocument();
  });
});

describe('маршрути і ролі', () => {
  it('неавторизованого з /requests перекидає на /login', async () => {
    renderApp('/requests');
    expect(await screen.findByRole('heading', { name: 'Вхід' })).toBeInTheDocument();
  });

  it('невідомий маршрут веде на 404', async () => {
    renderApp('/щось-таке');
    expect(await screen.findByText('Такої сторінки немає.')).toBeInTheDocument();
  });

  it('користувач після входу бачить свої заявки', async () => {
    renderApp('/login');
    await loginAs('user@example.com', 'user123');

    expect(await screen.findByRole('heading', { name: 'Мої заявки' })).toBeInTheDocument();
    expect(await screen.findByText('Не працює інтернет')).toBeInTheDocument();
    expect(screen.queryByText('Подвійне списання коштів')).not.toBeInTheDocument();
  });

  it('оператор після входу бачить усі заявки', async () => {
    renderApp('/login');
    await loginAs('operator@example.com', 'operator123');

    expect(await screen.findByRole('heading', { name: 'Усі заявки' })).toBeInTheDocument();
    expect(await screen.findByText('Подвійне списання коштів')).toBeInTheDocument();
    expect(screen.getByText('Не працює інтернет')).toBeInTheDocument();
  });

  it('оператор може змінити статус заявки', async () => {
    renderApp('/login');
    const user = await loginAs('operator@example.com', 'operator123');

    await user.click(await screen.findByText('Як змінити тариф?'));
    expect(await screen.findByRole('heading', { name: /Як змінити тариф/ })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/Статус:/), 's2');
    await user.click(screen.getByRole('button', { name: 'Змінити статус' }));

    expect(await screen.findByText('Статус заявки змінено')).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText(/Марія Оператор,/).length).toBeGreaterThan(0));
  });
});

describe('створення заявки', () => {
  it('показує помилки форми, а після успіху відкриває картку', async () => {
    renderApp('/login');
    const user = await loginAs('user@example.com', 'user123');

    await user.click(await screen.findByRole('link', { name: 'Нова заявка' }));
    await user.click(await screen.findByRole('button', { name: 'Створити заявку' }));
    expect(await screen.findByText('Тема має бути мінімум 5 символів')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Тема/), 'Тестова заявка');
    await user.type(screen.getByLabelText(/^Опис/), 'Це опис тестової заявки');
    await user.selectOptions(screen.getByLabelText(/^Категорія/), 'c1');
    await user.selectOptions(screen.getByLabelText(/^Пріоритет/), 'p2');
    await user.type(screen.getByLabelText(/^Телефон/), '+380501234567');
    await user.click(screen.getByRole('button', { name: 'Створити заявку' }));

    expect(await screen.findByText('Заявку створено')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Тестова заявка/ })).toBeInTheDocument();
  });

  it('при помилці сервера показує повідомлення про помилку', async () => {
    renderApp('/login');
    const user = await loginAs('user@example.com', 'user123');

    await user.click(await screen.findByRole('link', { name: 'Нова заявка' }));
    await user.type(await screen.findByLabelText('Тема'), 'Збій 500 тест');
    await user.type(screen.getByLabelText('Опис'), 'Це опис тестової заявки');
    await user.selectOptions(await screen.findByLabelText('Категорія'), 'c1');
    await user.selectOptions(screen.getByLabelText('Пріоритет'), 'p2');
    await user.type(screen.getByLabelText('Телефон'), '+380501234567');
    await user.click(screen.getByRole('button', { name: 'Створити заявку' }));

    expect(await screen.findByText(/Не вдалося створити заявку/)).toBeInTheDocument();
  });
});
