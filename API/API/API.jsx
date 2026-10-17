import { useState, useEffect } from "react";
import { z } from "zod";
import "./API.css";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="container">
      <h1>React API</h1>

      <div className="menu">
        <button onClick={() => setPage("login")}>
          Авторизація
        </button>

        <button onClick={() => setPage("product")}>
          Новий товар
        </button>

        <button onClick={() => setPage("profile")}>
          Профіль
        </button>
      </div>

      {page === "login" && <Login />}
      {page === "product" && <Product />}
      {page === "profile" && <Profile />}
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://dummyjson.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            expiresInMins: 30,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Помилка авторизації");
      }

      localStorage.setItem("token", data.accessToken);
      setMessage("Ви успішно увійшли!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Авторизація</h2>

      <form onSubmit={login}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Завантаження..." : "Увійти"}
        </button>
      </form>

      <p>{message}</p>
      <small>Тест: emilys / emilyspass</small>
    </section>
  );
}

const productSchema = z.object({
  title: z.string().trim().min(3, "Мінімум 3 символи"),
  price: z.coerce.number().positive("Ціна має бути більшою за 0"),
  category: z.string().trim().min(2, "Вкажіть категорію"),
  description: z.string().trim().min(10, "Мінімум 10 символів"),
});

function Product() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function addProduct(e) {
    e.preventDefault();
    setMessage("");

    const result = productSchema.safeParse({
      title,
      price,
      category,
      description,
    });

    if (!result.success) {
      const newErrors = {};

      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });

      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(
        "https://dummyjson.com/products/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.data),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не вдалося додати товар");
      }

      setMessage(`Товар "${data.title}" успішно додано!`);

      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Додавання товару</h2>

      <form onSubmit={addProduct}>
        <input
          placeholder="Назва товару"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error">{errors.title}</p>}

        <input
          type="number"
          min="0"
          step="any"
          placeholder="Ціна"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p className="error">{errors.price}</p>}

        <input
          placeholder="Категорія"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        {errors.category && (
          <p className="error">{errors.category}</p>
        )}

        <textarea
          placeholder="Опис товару"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="error">{errors.description}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Завантаження..." : "Додати товар"}
        </button>
      </form>

      <p>{message}</p>
    </section>
  );
}

function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [original, setOriginal] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getProfile() {
      try {
        const response = await fetch(
          "https://dummyjson.com/users/1"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Не вдалося завантажити профіль");
        }

        const user = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
        };

        setProfile(user);
        setOriginal(user);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  function changeProfile(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  }

  const changed =
    original !== null &&
    JSON.stringify(profile) !== JSON.stringify(original);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://dummyjson.com/users/1",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не вдалося зберегти зміни");
      }

      setOriginal({ ...profile });
      setMessage("Профіль успішно оновлено!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Завантаження профілю...</p>;
  }

  return (
    <section>
      <h2>Редагування профілю</h2>

      <form onSubmit={saveProfile}>
        <input
          name="firstName"
          placeholder="Ім'я"
          value={profile.firstName}
          onChange={changeProfile}
          required
        />

        <input
          name="lastName"
          placeholder="Прізвище"
          value={profile.lastName}
          onChange={changeProfile}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={changeProfile}
          required
        />

        <button
          type="submit"
          disabled={!changed || saving}
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>
      </form>

      <p>{message}</p>
    </section>
  );
}
