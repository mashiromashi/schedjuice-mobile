import { getItemAsync } from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    // If token can't be decoded, consider it expired
    return true;
  }
}

export async function checkTokenValidity(): Promise<boolean> {
  try {
    const token = await getItemAsync('access');
    if (!token || token.trim() === '') {
      return false;
    }
    return !isTokenExpired(token);
  } catch (error) {
    // Silently fail - don't log to avoid triggering error conversion during GC
    // This prevents NSException from being converted to JS error during GC cycles
    return false;
  }
}

export function getTokenExpirationTime(token: string): Date | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
}