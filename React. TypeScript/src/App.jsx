import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

function Home() {
  return <h2>Головна сторінка. Вітаємо на сайті фільмів!</h2>;
}

function Catalog() {
  return (
    <div>
      <h2>Каталог фільмів</h2>
      <div className="movies">
        <div className="movie">
          <h3>Інтерстеллар</h3>
          <p>Рік: 2014</p>
        </div>
        <div className="movie">
          <h3>Аватар</h3>
          <p>Рік: 2009</p>
        </div>
        <div className="movie">
          <h3>Титанік</h3>
          <p>Рік: 1997</p>
        </div>
      </div>
    </div>
  );
}

function About() {
  return <h2>Цей сайт створений для перегляду каталогу фільмів.</h2>;
}

function ErrorPage() {
  return <h2>Сторінку не знайдено (404)</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Мої фільми</h1>
      </header>

      <div className="container">
        <aside>
          <NavLink to="/" end>Головна</NavLink>
          <NavLink to="/catalog">Каталог</NavLink>
          <NavLink to="/about">Про сайт</NavLink>
          <NavLink to="/error">Помилка</NavLink>
        </aside>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/about" element={<About />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </div>

      <footer>Мої фільми  2026</footer>
    </BrowserRouter>
  );
}

export default App;