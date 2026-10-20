
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { User, UserData, UserService } from "../services/UserService";

const emptyForm: UserData = {
    firstName: "",
    lastName: "",
    age: 18,
    username: ""
};

export default function UserFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editing = Boolean(id);

    const [form, setForm] = useState<UserData>(emptyForm);
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        UserService.getUserById(Number(id), controller.signal)
            .then((user: User) => {
                setForm({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    username: user.username
                });
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setError("Не вдалося завантажити користувача");
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [id]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setForm(current => ({
            ...current,
            [name]: name === "age" ? Number(value) : value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        const controller = new AbortController();

        try {
            if (editing && id) {
                await UserService.updateUser(Number(id), form, controller.signal);
            } else {
                await UserService.addUser(form, controller.signal);
            }

            navigate("/users");
        } catch {
            setError("Не вдалося зберегти користувача");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="message">Завантаження...</p>;

    return (
        <main className="container">
            <div className="form-card">
                <h1>{editing ? "Редагувати користувача" : "Новий користувач"}</h1>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">Ім'я</label>
                    <input
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="lastName">Прізвище</label>
                    <input
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="age">Вік</label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        min="1"
                        max="120"
                        value={form.age}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <div className="card-actions">
                        <button
                            className="button primary"
                            type="submit"
                            disabled={saving}
                        >
                            {saving ? "Збереження..." : "Зберегти"}
                        </button>

                        <Link className="button secondary" to="/users">
                            Скасувати
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
