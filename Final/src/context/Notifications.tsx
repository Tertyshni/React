import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';


export type NotificationType = 'success' | 'error';

interface Notification {
  id: number;
  type: NotificationType;
  text: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  notifySuccess: (text: string) => void;
  notifyError: (text: string) => void;
  dismiss: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

let nextId = 1;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const push = useCallback(
    (type: NotificationType, text: string) => {
      const id = nextId++;
      setNotifications((prev) => [...prev, { id, type, text }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const notifySuccess = useCallback((text: string) => push('success', text), [push]);
  const notifyError = useCallback((text: string) => push('error', text), [push]);

  return (
    <NotificationContext.Provider value={{ notifications, notifySuccess, notifyError, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications треба викликати всередині NotificationProvider');
  return ctx;
}
