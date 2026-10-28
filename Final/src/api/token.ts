import type { Role } from '../types/data';

const TOKEN_KEY = 'accessToken';
const ROLE_KEY = 'userRole';

export const tokenStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRole: () => localStorage.getItem(ROLE_KEY) as Role | null,
  save(token: string, role: Role) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
