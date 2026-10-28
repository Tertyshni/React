import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="state">
      <h2>404</h2>
      <p>Такої сторінки немає.</p>
      <Link to="/requests">Повернутись до заявок</Link>
    </div>
  );
}
