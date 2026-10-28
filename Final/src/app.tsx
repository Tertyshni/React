import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from './layouts/Public';
import { AppLayout } from './layouts/Main';
import { ProtectedRoute } from './components/PrivateRoute';
import { Toasts } from './components/Notifications';
import { LoginPage } from './pages/Login';
import { RequestsPage } from './pages/Requests';
import { NewRequestPage } from './pages/NewRequest';
import { RequestDetailsPage } from './pages/RequestDetails';
import { NotFoundPage } from './pages/NotFound';

export function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/requests" element={<RequestsPage />} />
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute roles={['user']}>
                <NewRequestPage />
              </ProtectedRoute>
            }
          />
          <Route path="/requests/:id" element={<RequestDetailsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/requests" replace />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
      <Toasts />
    </>
  );
}
