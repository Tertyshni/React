import { delay, http, HttpResponse } from 'msw';
import { db, nextId } from './data';
import type {
  AddCommentDto,
  ChangeStatusDto,
  CommentDto,
  CreateRequestDto,
  HistoryItemDto,
  LoginRequestDto,
  RequestDto,
} from '../types/data';

const API = '/api';

const makeToken = (userId: string) => `token-${userId}`;

function getCurrentUser(request: Request) {
  const header = request.headers.get('Authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.replace('Bearer ', '');
  return db.users.find((u) => makeToken(u.id) === token) ?? null;
}

const unauthorized = () =>
  HttpResponse.json({ message: 'Потрібна авторизація' }, { status: 401 });
const forbidden = () =>
  HttpResponse.json({ message: 'Недостатньо прав' }, { status: 403 });
const notFound = () =>
  HttpResponse.json({ message: 'Заявку не знайдено' }, { status: 404 });

export const handlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginRequestDto;
    const user = db.users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) {
      return HttpResponse.json({ message: 'Невірний email або пароль' }, { status: 401 });
    }
    const { password: _password, ...safeUser } = user;
    return HttpResponse.json({ accessToken: makeToken(user.id), user: safeUser });
  }),

  http.get(`${API}/auth/me`, ({ request }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    const { password: _password, ...safeUser } = user;
    return HttpResponse.json(safeUser);
  }),

  http.get(`${API}/requests/my`, async ({ request }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    await delay(900);
    return HttpResponse.json(db.requests.filter((r) => r.authorId === user.id));
  }),

  http.get(`${API}/requests`, async ({ request }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'operator') return forbidden();
    await delay(900);
    return HttpResponse.json(db.requests);
  }),

  http.get(`${API}/requests/:id`, async ({ request, params }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    await delay(300);
    const found = db.requests.find((r) => r.id === params.id);
    if (!found) return notFound();
    if (user.role === 'user' && found.authorId !== user.id) return forbidden();
    return HttpResponse.json(found);
  }),

  http.post(`${API}/requests`, async ({ request }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    const body = (await request.json()) as CreateRequestDto;

    if (body.subject.includes('500')) {
      await delay(500);
      return HttpResponse.json({ message: 'Внутрішня помилка сервера' }, { status: 500 });
    }
    if (body.subject.toLowerCase().includes('network')) {
      return HttpResponse.error();
    }

    await delay(600);
    const created: RequestDto = {
      id: nextId('r'),
      subject: body.subject,
      description: body.description,
      categoryId: body.categoryId,
      priorityId: body.priorityId,
      statusId: 's1', 
      createdAt: new Date().toISOString(),
      authorId: user.id,
      contact: body.contact,
      comments: [],
    };
    db.requests = [created, ...db.requests];
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${API}/requests/:id/status`, async ({ request, params }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'operator') return forbidden();
    const body = (await request.json()) as ChangeStatusDto;

    const found = db.requests.find((r) => r.id === params.id);
    if (!found) return notFound();
    if (!db.statuses.some((s) => s.id === body.statusId)) {
      return HttpResponse.json({ message: 'Невідомий статус' }, { status: 400 });
    }
    if (found.statusId === 's4' && body.statusId === 's1') {
      return HttpResponse.json(
        { message: 'Закриту заявку не можна повернути в статус "Нова"' },
        { status: 500 },
      );
    }

    await delay(400);
    const record: HistoryItemDto = {
      id: nextId('h'),
      requestId: found.id,
      fromStatusId: found.statusId,
      toStatusId: body.statusId,
      changedByName: user.name,
      changedAt: new Date().toISOString(),
    };
    const updated: RequestDto = { ...found, statusId: body.statusId };
    db.requests = db.requests.map((r) => (r.id === found.id ? updated : r));
    db.history = [...db.history, record];
    return HttpResponse.json(updated);
  }),

  http.post(`${API}/requests/:id/comments`, async ({ request, params }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'operator') return forbidden();
    const body = (await request.json()) as AddCommentDto;

    const found = db.requests.find((r) => r.id === params.id);
    if (!found) return notFound();

    await delay(300);
    const comment: CommentDto = {
      id: nextId('cm'),
      requestId: found.id,
      authorId: user.id,
      authorName: user.name,
      text: body.text,
      createdAt: new Date().toISOString(),
    };
    const updated: RequestDto = { ...found, comments: [...found.comments, comment] };
    db.requests = db.requests.map((r) => (r.id === found.id ? updated : r));
    return HttpResponse.json(comment, { status: 201 });
  }),

  http.get(`${API}/requests/:id/history`, async ({ request, params }) => {
    const user = getCurrentUser(request);
    if (!user) return unauthorized();
    await delay(200);
    const found = db.requests.find((r) => r.id === params.id);
    if (!found) return notFound();
    if (user.role === 'user' && found.authorId !== user.id) return forbidden();
    return HttpResponse.json(db.history.filter((h) => h.requestId === params.id));
  }),

  http.get(`${API}/categories`, ({ request }) => {
    if (!getCurrentUser(request)) return unauthorized();
    return HttpResponse.json(db.categories);
  }),
  http.get(`${API}/priorities`, ({ request }) => {
    if (!getCurrentUser(request)) return unauthorized();
    return HttpResponse.json(db.priorities);
  }),
  http.get(`${API}/request-statuses`, ({ request }) => {
    if (!getCurrentUser(request)) return unauthorized();
    return HttpResponse.json(db.statuses);
  }),
];
