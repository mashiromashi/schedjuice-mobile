import { create } from 'zustand';
import { getItemAsync } from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTokenValidity } from './token-utils';
import { accountType } from '@/types/user';
import { setNativeModulesReady as setAPINativeModulesReady } from '@/lib/api';

interface AuthState {
  isAuthenticated: boolean;
  user: accountType | null;
  isLoading: boolean;
  nativeModulesReady: boolean;

  markNativeReady: () => void;
  checkAuthState: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  nativeModulesReady: false,

  markNativeReady: () => {
    set({ nativeModulesReady: true, isLoading: false });
    setAPINativeModulesReady(true);
  },

  checkAuthState: async () => {
    const { nativeModulesReady } = get();

    if (!nativeModulesReady) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      let isTokenValid = false;
      try {
        isTokenValid = await Promise.resolve(checkTokenValidity()).catch(() => false);
      } catch {
        isTokenValid = false;
      }

      if (!isTokenValid) {
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      let token: string | null = null;
      try {
        token = await Promise.resolve(getItemAsync('access')).catch(() => null);
      } catch {
        token = null;
      }

      if (!token) {
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      let userData: accountType | null = null;
      try {
        const accountData = await AsyncStorage.getItem('account');
        if (accountData) {
          userData = JSON.parse(accountData);
        }
      } catch {
        userData = null;
      }

      if (token.trim() && userData) {
        set({ isAuthenticated: true, user: userData });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const { logout: authLogout } = await import('./index');
    await authLogout();
    set({ isAuthenticated: false, user: null });
  },
}));
