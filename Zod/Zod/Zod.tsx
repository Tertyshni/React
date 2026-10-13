
import { useState } from "react";
import { z } from "zod";
import "./Zod.css";

const loginSchema = z.object({
  email: z.string().email("Неправильна пошта"),
  password: z.string().min(6, "Мінімум 6 символів")
});

const registerSchema = z.object({
  name: z.string().min(2, "Введіть ім'я"),
  email: z.string().email("Неправильна пошта"),
  password: z.string().min(6, "Мінімум 6 символів")
});

const profileSchema = z.object({
  name: z.string().min(2, "Введіть ім'я"),
  age: z.coerce.number().min(18, "Мінімум 18 років").max(65, "Максимум 65 років"),
  language: z.enum(["JavaScript", "Python", "C#"])
});

const ratingSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().optional().refine(
    (text) => !text || text.length >= 5,
    "Мінімум 5 символів"
  )
});

function App() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function check(schema: z.ZodType, data: object) {
    const result = schema.safeParse(data);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((error) => {
        newErrors[String(error.path[0])] = error.message;
      });
    }

    setErrors(newErrors);

    if (result.success) {
      alert("Дані правильні!");
    }
  }

  return (
    <div className="container">
      <h1>Форми з Zod</h1>

      <form onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        check(loginSchema, {
          email: data.get("email"),
          password: data.get("password")
        });
      }}>
        <h2>Вхід</h2>
        <input name="email" placeholder="Email"
          onChange={() => setErrors({ ...errors, email: "" })} />
        <p>{errors.email}</p>

        <input name="password" type="password" placeholder="Пароль"
          onChange={() => setErrors({ ...errors, password: "" })} />
        <p>{errors.password}</p>

        <button>Увійти</button>
      </form>

      <form onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        check(registerSchema, {
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password")
        });
      }}>
        <h2>Реєстрація</h2>
        <input name="name" placeholder="Ім'я"
          onChange={() => setErrors({ ...errors, name: "" })} />
        <p>{errors.name}</p>

        <input name="email" placeholder="Email"
          onChange={() => setErrors({ ...errors, email: "" })} />
        <p>{errors.email}</p>

        <input name="password" type="password" placeholder="Пароль"
          onChange={() => setErrors({ ...errors, password: "" })} />
        <p>{errors.password}</p>

        <button>Зареєструватися</button>
      </form>

      <form onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        check(profileSchema, {
          name: data.get("name"),
          age: data.get("age"),
          language: data.get("language")
        });
      }}>
        <h2>Профіль розробника</h2>
        <input name="name" placeholder="Ім'я"
          onChange={() => setErrors({ ...errors, name: "" })} />
        <p>{errors.name}</p>

        <input name="age" type="number" placeholder="Вік"
          onChange={() => setErrors({ ...errors, age: "" })} />
        <p>{errors.age}</p>

        <select name="language">
          <option>JavaScript</option>
          <option>Python</option>
          <option>C#</option>
        </select>

        <button>Зберегти</button>
      </form>

      <form onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        check(ratingSchema, {
          rating: data.get("rating"),
          comment: data.get("comment")
        });
      }}>
        <h2>Оцінювання матеріалу</h2>
        <select name="rating">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <textarea name="comment" placeholder="Коментар (необов'язково)"
          onChange={() => setErrors({ ...errors, comment: "" })} />
        <p>{errors.comment}</p>

        <button>Оцінити</button>
      </form>
    </div>
  );
}

export default App;
