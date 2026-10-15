import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().trim().min(3, "Мінімум 3 символи"),
  email: z.string().email("Неправильний email"),
  birthday: z.string().refine((date) => {
    if (!date) return false;

    const birth = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age >= 18;
  }, "Вам повинно бути 18 років"),
  account: z.string(),
  company: z.string(),
  role: z.string(),
  otherRole: z.string(),
  newsletter: z.boolean(),
  frequency: z.string(),
}).superRefine((data, ctx) => {
  if (data.account === "Бізнес" && !data.company.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["company"],
      message: "Введіть назву компанії",
    });
  }

  if (data.role === "Інше" && !data.otherRole.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["otherRole"],
      message: "Вкажіть свою роль",
    });
  }
});

export default function Zod() {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      birthday: "",
      account: "Персональний",
      company: "",
      role: "Розробник",
      otherRole: "",
      newsletter: false,
      frequency: "Щотижня",
    },
  });

  const data = watch();

  const onSubmit = (data) => {
    alert("Профіль успішно збережено!");
    console.log(data);
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Редагування профілю</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Повне ім'я</label>
          <input {...register("name")} placeholder="Ваше ім'я" />
          <p>{errors.name?.message}</p>

          <label>Email</label>
          <input {...register("email")} type="email" placeholder="example@gmail.com" />
          <p>{errors.email?.message}</p>

          <label>Дата народження</label>
          <input {...register("birthday")} type="date" max={new Date().toISOString().split("T")[0]} />
          <p>{errors.birthday?.message}</p>

          <label>Тип акаунту</label>
          <select {...register("account")}>
            <option>Персональний</option>
            <option>Бізнес</option>
          </select>

          {data.account === "Бізнес" && (
            <>
              <label>Назва компанії</label>
              <input {...register("company")} placeholder="Назва компанії" />
              <p>{errors.company?.message}</p>
            </>
          )}

          <label>Роль</label>
          <select {...register("role")}>
            <option>Розробник</option>
            <option>Дизайнер</option>
            <option>Менеджер</option>
            <option>Інше</option>
          </select>

          {data.role === "Інше" && (
            <>
              <label>Ваша роль</label>
              <input {...register("otherRole")} placeholder="Вкажіть роль" />
              <p>{errors.otherRole?.message}</p>
            </>
          )}

          <label className="check">
            <input type="checkbox" {...register("newsletter")} />
            Отримувати розсилку
          </label>

          {data.newsletter && (
            <>
              <label>Частота розсилки</label>
              <select {...register("frequency")}>
                <option>Щодня</option>
                <option>Щотижня</option>
              </select>
            </>
          )}

          <button type="submit" disabled={!isValid}>
            Зберегти
          </button>

          <button type="button" className="reset" onClick={() => reset()}>
            Скинути
          </button>
        </form>
      </div>

      <div className="preview">
        <h2>Live Preview</h2>
        <p><b>Ім'я:</b> {data.name || "—"}</p>
        <p><b>Email:</b> {data.email || "—"}</p>
        <p><b>Дата народження:</b> {data.birthday || "—"}</p>
        <p><b>Тип акаунту:</b> {data.account}</p>

        {data.account === "Бізнес" && (
          <p><b>Компанія:</b> {data.company || "—"}</p>
        )}

        <p>
          <b>Роль:</b>{" "}
          {data.role === "Інше"
            ? data.otherRole || "Інше"
            : data.role}
        </p>

        <p>
          <b>Розсилка:</b> {data.newsletter ? "Так" : "Ні"}
        </p>

        {data.newsletter && (
          <p><b>Частота:</b> {data.frequency}</p>
        )}

        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}