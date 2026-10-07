import { NavLink, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="layout">
      <header>
        <h1>Магазин техніки</h1>

        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Головна
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Каталог
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© 2026 Магазин техніки</p>
      </footer>
    </div>
  );
}

export default MainLayout;