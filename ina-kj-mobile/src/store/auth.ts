import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import {
  authApi,
  setTokens,
  clearTokens,
  type User,
} from '../api/client';

type AuthState = {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: {
    phone: string;
    password: string;
    fullName: string;
    role: 'farmer' | 'buyer';
    location?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const USER_KEY = 'ina_kj_user';

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(USER_KEY);
      if (raw) {
        const user = JSON.parse(raw) as User;
        set({ user });
        // Optional: refresh profile from API
        try {
          const { user: fresh } = await authApi.me();
          set({ user: fresh });
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(fresh));
        } catch {
          // token expired — clear
          await clearTokens();
          await SecureStore.deleteItemAsync(USER_KEY);
          set({ user: null });
        }
      }
    } finally {
      set({ hydrated: true });
    }
  },

  login: async (phone, password) => {
    set({ loading: true });
    try {
      const { user, accessToken, refreshToken } = await authApi.login(
        phone,
        password
      );
      await setTokens(accessToken, refreshToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user });
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const { user, accessToken, refreshToken } = await authApi.register(data);
      await setTokens(accessToken, refreshToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await clearTokens();
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ user: null });
  },
}));
