import { User } from '@/types/user';

const USERS_KEY = 'allUsers';
const CURRENT_USER_KEY = 'user';

export const authService = {
  login(email: string, password: string): User | null {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const user = users[email];
    if (user?.password === password) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  register(user: User, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[user.email]) return false;
    users[user.email] = { ...user, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  findPassword(email: string): string | null {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    return users[email]?.password || null;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
};
