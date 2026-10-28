import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="public-layout">
      <h1 className="logo">Сервісні заявки</h1>
      <main className="card">
        <Outlet />
      </main>
    </div>
  );
}
