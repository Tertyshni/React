import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/Auth';
import { useAddComment, useChangeStatus, useHistory, useRequest } from '../hooks/requests';
import { useCategories, usePriorities, useStatuses } from '../hooks/dictionaries';
import { PriorityBadge, StatusBadge } from '../components/StatusBadges';
import { formatDate, getErrorMessage } from '../utils/helpers';
import type { RequestDto } from '../types/data';

const commentSchema = z.object({
  text: z.string().trim().min(3, 'Коментар занадто короткий'),
});
type CommentFormValues = z.infer<typeof commentSchema>;

export function RequestDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { user } = useAuth();

  const requestQuery = useRequest(id);
  const historyQuery = useHistory(id);
  const { data: statuses } = useStatuses();
  const { data: categories } = useCategories();
  const { data: priorities } = usePriorities();

  if (requestQuery.isLoading) {
    return <p className="state">Завантажуємо заявку...</p>;
  }

  if (requestQuery.isError || !requestQuery.data) {
    return (
      <div className="state state-error" role="alert">
        <p>Не вдалося відкрити заявку: {getErrorMessage(requestQuery.error)}</p>
        <Link to="/requests">← До списку заявок</Link>
      </div>
    );
  }

  const request = requestQuery.data;
  const categoryName = categories?.find((c) => c.id === request.categoryId)?.name ?? '...';

  return (
    <section className="details">
      <Link to="/requests">← До списку заявок</Link>
      <h2>
        {request.subject} <small>#{request.id}</small>
      </h2>

      <div className="meta">
        <StatusBadge statusId={request.statusId} statuses={statuses} />
        <PriorityBadge priorityId={request.priorityId} priorities={priorities} />
        <span>{categoryName}</span>
        <span>Створено: {formatDate(request.createdAt)}</span>
      </div>

      <p className="description">{request.description}</p>

      <div className="box">
        <h3>Контактні дані</h3>
        <p>{request.contact.name}</p>
        <p>{request.contact.email}</p>
        <p>{request.contact.phone}</p>
      </div>

      {user?.role === 'operator' && <OperatorPanel request={request} />}

      <div className="box">
        <h3>Коментарі операторів</h3>
        {request.comments.length === 0 ? (
          <p className="muted">Коментарів поки немає.</p>
        ) : (
          <ul className="list">
            {request.comments.map((c) => (
              <li key={c.id}>
                <strong>{c.authorName}</strong> <span className="muted">{formatDate(c.createdAt)}</span>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="box">
        <h3>Історія статусів</h3>
        {historyQuery.isLoading && <p className="muted">Завантажуємо історію...</p>}
        {historyQuery.isError && <p className="error">Історію завантажити не вдалося.</p>}
        {historyQuery.isSuccess && historyQuery.data.length === 0 && (
          <p className="muted">Статус ще не змінювався.</p>
        )}
        {historyQuery.isSuccess && historyQuery.data.length > 0 && (
          <ul className="list">
            {historyQuery.data.map((h) => (
              <li key={h.id}>
                {h.fromStatusId ? (
                  <StatusBadge statusId={h.fromStatusId} statuses={statuses} />
                ) : (
                  <span className="muted">—</span>
                )}{' '}
                → <StatusBadge statusId={h.toStatusId} statuses={statuses} />{' '}
                <span className="muted">
                  {h.changedByName}, {formatDate(h.changedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function OperatorPanel({ request }: { request: RequestDto }) {
  const { data: statuses } = useStatuses();
  const statusMutation = useChangeStatus(request.id);
  const commentMutation = useAddComment(request.id);
  const [selectedStatus, setSelectedStatus] = useState(request.statusId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  const onComment = (values: CommentFormValues) => {
    commentMutation.mutate(values.text, { onSuccess: () => reset() });
  };

  const unchanged = selectedStatus === request.statusId;

  return (
    <div className="box operator-panel">
      <h3>Робота оператора</h3>

      <div className="row-inline">
        <label>
          Статус:{' '}
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {statuses?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn"
          disabled={unchanged || statusMutation.isPending}
          onClick={() => statusMutation.mutate(selectedStatus)}
        >
          {statusMutation.isPending ? 'Зберігаємо...' : 'Змінити статус'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onComment)} noValidate className="form-inline">
        <label className="field">
          <span>Новий коментар</span>
          <textarea rows={3} {...register('text')} />
          {errors.text && <span className="error">{errors.text.message}</span>}
        </label>
        <button type="submit" className="btn" disabled={commentMutation.isPending}>
          {commentMutation.isPending ? 'Додаємо...' : 'Додати коментар'}
        </button>
      </form>
    </div>
  );
}
