
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, UserService } from "../services/UserService";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = async (signal: AbortSignal) => {
        try {
            const data = await UserService.getUsers(signal);
            setUsers(data);
        } catch (error) {
            if (!signal.aborted) {
                setError("Не вдалося завантажити користувачів");
            }
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        loadUsers(controller.signal);

        return () => controller.abort();
    }, []);

    const deleteUser = async (id: number) => {
        if (!window.confirm("Видалити цього користувача?")) return;

        const controller = new AbortController();

        try {
            await UserService.deleteUser(id, controller.signal);
            setUsers(current => current.filter(user => user.id !== id));
        } catch {
            setError("Не вдалося видалити користувача");
        }
    };

    if (loading) return <p className="message">Завантаження...</p>;

    return (
        <main className="container">
            <div className="page-header">
                <div>
                    <h1>Користувачі</h1>
                    <p>Список усіх користувачів</p>
                </div>

                <Link className="button primary" to="/users/create">
                    + Додати користувача
                </Link>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="users-grid">
                {users.map(user => (
                    <article className="user-card" key={user.id}>
                        <div className="avatar">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>

                        <h2>{user.firstName} {user.lastName}</h2>
                        <p>Username: {user.username}</p>
                        <p>Вік: {user.age}</p>

                        <div className="card-actions">
                            <Link className="button primary"
                                to={`/users/${user.id}`}>
                                Переглянути
                            </Link>

                            <Link className="button secondary"
                                to={`/users/${user.id}/edit`}>
                                Редагувати
                            </Link>

                            <button className="button danger"
                                onClick={() => deleteUser(user.id)}>
                                Видалити
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
