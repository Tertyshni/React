import { describe, expect, it } from 'vitest';
import { authApi, requestsApi } from '../api/routes';
import { tokenStorage } from '../api/token';


describe('mock API', () => {
  it('повертає 401 для захищеного endpoint без токена', async () => {
    await expect(requestsApi.getMy()).rejects.toMatchObject({ response: { status: 401 } });
  });

  it('логін працює і /auth/me повертає користувача', async () => {
    const { accessToken, user } = await authApi.login({
      email: 'user@example.com',
      password: 'user123',
    });
    tokenStorage.save(accessToken, user.role);
    const me = await authApi.me();
    expect(me.email).toBe('user@example.com');
    expect(me.role).toBe('user');
  });

  it('користувач бачить тільки свої заявки', async () => {
    const { accessToken, user } = await authApi.login({ email: 'user@example.com', password: 'user123' });
    tokenStorage.save(accessToken, user.role);
    const list = await requestsApi.getMy();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((r) => r.authorId === user.id)).toBe(true);
  });

  it('користувач не може отримати загальний список (403)', async () => {
    const { accessToken, user } = await authApi.login({ email: 'user@example.com', password: 'user123' });
    tokenStorage.save(accessToken, user.role);
    await expect(requestsApi.getAll()).rejects.toMatchObject({ response: { status: 403 } });
  });

  it('оператор змінює статус і в історії з’являється запис', async () => {
    const { accessToken, user } = await authApi.login({
      email: 'operator@example.com',
      password: 'operator123',
    });
    tokenStorage.save(accessToken, user.role);

    const before = await requestsApi.getHistory('r3');
    await requestsApi.changeStatus('r3', { statusId: 's2' });
    const after = await requestsApi.getHistory('r3');

    expect(after.length).toBe(before.length + 1);
    expect((await requestsApi.getById('r3')).statusId).toBe('s2');
  });

  it('тема зі словом 500 дає серверну помилку', async () => {
    const { accessToken, user } = await authApi.login({ email: 'user@example.com', password: 'user123' });
    tokenStorage.save(accessToken, user.role);
    await expect(
      requestsApi.create({
        subject: 'Тест 500',
        description: 'Опис заявки для тесту',
        categoryId: 'c1',
        priorityId: 'p1',
        contact: { name: 'Тест', email: 'a@b.com', phone: '+380501234567' },
      }),
    ).rejects.toMatchObject({ response: { status: 500 } });
  });
});
