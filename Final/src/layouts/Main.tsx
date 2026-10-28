import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth';

export function AppLayout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <div className="app-layout">
      <header className="header">
        <nav className="nav">
          <NavLink to="/requests" end className={linkClass}>
            {user?.role === 'operator' ? 'Усі заявки' : 'Мої заявки'}
          </NavLink>
          {user?.role === 'user' && (
            <NavLink to="/requests/new" className={linkClass}>
              Нова заявка
            </NavLink>
          )}
        </nav>
        <div className="user-box">
          <span>
            {user?.name} ({user?.role === 'operator' ? 'оператор' : 'користувач'})
          </span>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            Вийти
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
