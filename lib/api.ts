import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Declare global type for app start time
declare global {
  var __APP_START_TIME__: number | undefined;
}

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error('Please set EXPO_PUBLIC_API_URL in your .env file');
}

const axiosClient = axios.create({
  baseURL,
});

// Cache token in memory to avoid repeated SecureStore calls
let cachedToken: string | null = null;
let tokenCacheTime: number = 0;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Track if native modules are ready (set by app after initialization)
let nativeModulesReady = false;
export const setNativeModulesReady = (ready: boolean) => {
  nativeModulesReady = ready;
};

axiosClient.interceptors.request.use(async (request) => {
  // CRITICAL: Don't call SecureStore if native modules aren't ready
  // This prevents NSException conversion crashes during app initialization
  // Also add a startup delay to be extra safe
  const startupDelay = 10000; // 10 seconds after app start
  const appStartTime = global.__APP_START_TIME__ || 0;
  const timeSinceStart = Date.now() - appStartTime;

  if (!nativeModulesReady || timeSinceStart < startupDelay) {
    // Use cached token if available, otherwise proceed without token
    if (cachedToken) {
      request.headers.Authorization = `Bearer ${cachedToken}`;
    }
    return request;
  }

  try {
    // Use cached token if still valid
    const now = Date.now();
    if (cachedToken && now < tokenCacheTime) {
      request.headers.Authorization = `Bearer ${cachedToken}`;
      return request;
    }

    // Get fresh token from SecureStore
    const token = await SecureStore.getItemAsync('access');
    if (token) {
      cachedToken = token;
      tokenCacheTime = now + TOKEN_CACHE_DURATION;
      request.headers.Authorization = `Bearer ${token}`;
    } else {
      // Clear cache if no token
      cachedToken = null;
      tokenCacheTime = 0;
    }
  } catch (error) {
    // Silently fail - don't log to avoid triggering error conversion
    // Use cached token if available
    if (cachedToken) {
      request.headers.Authorization = `Bearer ${cachedToken}`;
    }
    // Continue without token - the API will handle authentication errors
  }
  return request;
});

export { axiosClient };
