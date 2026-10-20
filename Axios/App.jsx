import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import UserPage from "./src/pages/UserPage";
import UserFormPage from "./src/pages/UserFormPage";

export default function App() {
    return (
        <BrowserRouter>
            <header className="navbar">
                <Link to="/users" className="logo">
                    UserApp
                </Link>

                <nav>
                    <Link to="/users">Користувачі</Link>
                    <Link to="/users/create">Додати</Link>
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<Navigate to="/users" replace />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create" element={<UserFormPage />} />
                <Route path="/users/:id/edit" element={<UserFormPage />} />
                <Route path="/users/:id" element={<UserPage />} />
                <Route path="*" element={<Navigate to="/users" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
