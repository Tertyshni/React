import type {
  CategoryDto,
  CommentDto,
  HistoryItemDto,
  PriorityDto,
  RequestDto,
  StatusDto,
  UserDto,
} from '../types/data';


export interface DbUser extends UserDto {
  password: string;
}

interface Db {
  users: DbUser[];
  categories: CategoryDto[];
  priorities: PriorityDto[];
  statuses: StatusDto[];
  requests: RequestDto[];
  history: HistoryItemDto[];
}

const makeInitialDb = (): Db => ({
  users: [
    { id: 'u1', email: 'user@example.com', password: 'user123', name: 'Іван Петренко', role: 'user' },
    { id: 'u2', email: 'operator@example.com', password: 'operator123', name: 'Марія Оператор', role: 'operator' },
    { id: 'u3', email: 'olena@example.com', password: 'olena123', name: 'Олена Коваль', role: 'user' },
  ],
  categories: [
    { id: 'c1', name: 'Технічна проблема' },
    { id: 'c2', name: 'Оплата і рахунки' },
    { id: 'c3', name: 'Загальне питання' },
  ],
  priorities: [
    { id: 'p1', name: 'Низький', weight: 1 },
    { id: 'p2', name: 'Середній', weight: 2 },
    { id: 'p3', name: 'Високий', weight: 3 },
  ],
  statuses: [
    { id: 's1', name: 'Нова' },
    { id: 's2', name: 'В роботі' },
    { id: 's3', name: 'Очікує відповіді' },
    { id: 's4', name: 'Закрита' },
  ],
  requests: [
    {
      id: 'r1',
      subject: 'Не працює інтернет',
      description: 'З ранку немає з’єднання, роутер перезавантажував — не допомогло.',
      categoryId: 'c1',
      priorityId: 'p3',
      statusId: 's2',
      createdAt: '2026-10-20T08:30:00.000Z',
      authorId: 'u1',
      contact: { name: 'Іван Петренко', email: 'user@example.com', phone: '+380501112233' },
      comments: [],
    },
    {
      id: 'r2',
      subject: 'Питання по рахунку за жовтень',
      description: 'В рахунку з’явилась сума, якої я не розумію. Можна розшифровку?',
      categoryId: 'c2',
      priorityId: 'p2',
      statusId: 's3',
      createdAt: '2026-10-21T10:15:00.000Z',
      authorId: 'u1',
      contact: { name: 'Іван Петренко', email: 'user@example.com', phone: '+380501112233' },
      comments: [],
    },
    {
      id: 'r3',
      subject: 'Як змінити тариф?',
      description: 'Хочу перейти на дешевший тариф, підкажіть, як це зробити.',
      categoryId: 'c3',
      priorityId: 'p1',
      statusId: 's1',
      createdAt: '2026-10-23T14:00:00.000Z',
      authorId: 'u1',
      contact: { name: 'Іван Петренко', email: 'user@example.com', phone: '+380501112233' },
      comments: [],
    },
    {
      id: 'r4',
      subject: 'Помилка при вході в кабінет',
      description: 'Пише "невірний пароль", хоча я точно його не змінював.',
      categoryId: 'c1',
      priorityId: 'p2',
      statusId: 's4',
      createdAt: '2026-10-15T09:00:00.000Z',
      authorId: 'u3',
      contact: { name: 'Олена Коваль', email: 'olena@example.com', phone: '+380671234567' },
      comments: [],
    },
    {
      id: 'r5',
      subject: 'Подвійне списання коштів',
      description: 'З картки списали гроші двічі за одну послугу.',
      categoryId: 'c2',
      priorityId: 'p3',
      statusId: 's1',
      createdAt: '2026-10-25T18:20:00.000Z',
      authorId: 'u3',
      contact: { name: 'Олена Коваль', email: 'olena@example.com', phone: '+380671234567' },
      comments: [],
    },
  ],
  history: [
    {
      id: 'h1',
      requestId: 'r1',
      fromStatusId: 's1',
      toStatusId: 's2',
      changedByName: 'Марія Оператор',
      changedAt: '2026-10-20T09:00:00.000Z',
    },
    {
      id: 'h2',
      requestId: 'r4',
      fromStatusId: 's1',
      toStatusId: 's4',
      changedByName: 'Марія Оператор',
      changedAt: '2026-10-16T11:00:00.000Z',
    },
    {
      id: 'h3',
      requestId: 'r2',
      fromStatusId: 's2',
      toStatusId: 's3',
      changedByName: 'Марія Оператор',
      changedAt: '2026-10-22T12:00:00.000Z',
    },
  ],
});

const initialComments: CommentDto[] = [
  {
    id: 'cm1',
    requestId: 'r1',
    authorId: 'u2',
    authorName: 'Марія Оператор',
    text: 'Бачимо аварію на лінії, бригада вже виїхала.',
    createdAt: '2026-10-20T09:05:00.000Z',
  },
  {
    id: 'cm2',
    requestId: 'r2',
    authorId: 'u2',
    authorName: 'Марія Оператор',
    text: 'Надішліть, будь ласка, номер договору — розшифрую рахунок.',
    createdAt: '2026-10-22T12:05:00.000Z',
  },
];

const withComments = (db: Db): Db => ({
  ...db,
  requests: db.requests.map((r) => ({
    ...r,
    comments: initialComments.filter((c) => c.requestId === r.id),
  })),
});

export const db: Db = withComments(makeInitialDb());

export function resetDb() {
  Object.assign(db, withComments(makeInitialDb()));
}

let counter = 100;
export const nextId = (prefix: string) => `${prefix}${++counter}`;
