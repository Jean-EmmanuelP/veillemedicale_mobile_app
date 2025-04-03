import { useState } from 'react';

// Mock storage pour LynxJS
let mockStorage: { [key: string]: string } = {};

const AUTH_KEY = 'authToken';

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return mockStorage[AUTH_KEY] || null;
    } catch {
      return null;
    }
  });

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    try {
      if (newToken) {
        mockStorage[AUTH_KEY] = newToken;
        console.log('Token stored in mock storage:', newToken);
      } else {
        delete mockStorage[AUTH_KEY];
        console.log('Token removed from mock storage');
      }
    } catch (error) {
      console.warn('Failed to access mock storage:', error);
    }
  };

  // Retourne à la fois le token et les méthodes sous forme d'objet
  return {
    token,
    setToken: updateToken,
    clearToken: () => updateToken(null)
  };
}