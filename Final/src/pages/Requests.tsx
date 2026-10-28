import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { useAllRequests, useMyRequests } from '../hooks/requests';
import { useCategories, usePriorities, useStatuses } from '../hooks/dictionaries';
import { PriorityBadge, StatusBadge } from '../components/StatusBadges';
import { formatDate, getErrorMessage } from '../utils/helpers';

export function RequestsPage() {
  const { user } = useAuth();
  const isOperator = user?.role === 'operator';

  const myQuery = useMyRequests(!isOperator);
  const allQuery = useAllRequests(isOperator);
  const query = isOperator ? allQuery : myQuery;

  const { data: statuses } = useStatuses();
  const { data: categories } = useCategories();
  const { data: priorities } = usePriorities();

  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') ?? '';

  const onFilterChange = (value: string) => {
    if (value) {
      setSearchParams({ status: value });
    } else {
      setSearchParams({});
    }
  };

  const filtered = useMemo(() => {
    const list = query.data ?? [];
    return statusFilter ? list.filter((r) => r.statusId === statusFilter) : list;
  }, [query.data, statusFilter]);

  return (
    <section>
      <div className="page-head">
        <h2>{isOperator ? 'Усі заявки' : 'Мої заявки'}</h2>
        <label className="filter">
          <span>Статус:</span>
          <select value={statusFilter} onChange={(e) => onFilterChange(e.target.value)}>
            <option value="">Усі</option>
            {statuses?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {query.isLoading && <p className="state">Завантажуємо заявки...</p>}

      {query.isError && (
        <div className="state state-error" role="alert">
          <p>Не вдалося завантажити заявки: {getErrorMessage(query.error)}</p>
          <button type="button" className="btn" onClick={() => query.refetch()}>
            Спробувати ще раз
          </button>
        </div>
      )}

      {query.isSuccess && filtered.length === 0 && (
        <p className="state">
          Заявок не знайдено.{' '}
          {!isOperator && !statusFilter && <Link to="/requests/new">Створити першу</Link>}
        </p>
      )}

      {query.isSuccess && filtered.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Тема</th>
              <th>Категорія</th>
              <th>Пріоритет</th>
              <th>Статус</th>
              <th>Створено</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  <Link to={`/requests/${r.id}`}>{r.subject}</Link>
                </td>
                <td>{categories?.find((c) => c.id === r.categoryId)?.name ?? '...'}</td>
                <td>
                  <PriorityBadge priorityId={r.priorityId} priorities={priorities} />
                </td>
                <td>
                  <StatusBadge statusId={r.statusId} statuses={statuses} />
                </td>
                <td>{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
