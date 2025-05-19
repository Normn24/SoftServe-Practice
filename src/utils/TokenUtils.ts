const TOKEN_KEY = 'token';

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setTokenToLocalStorage = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeTokenFromLocalStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};