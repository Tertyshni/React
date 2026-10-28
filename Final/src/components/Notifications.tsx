import { useNotifications } from '../context/Notifications';

export function Toasts() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="toasts" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={`toast toast-${n.type}`} role={n.type === 'error' ? 'alert' : 'status'}>
          <span>{n.text}</span>
          <button type="button" onClick={() => dismiss(n.id)} aria-label="Закрити">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
