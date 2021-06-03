import { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '../utils/client/api-client.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

async function getAuthStatus() {
  try {
    const resp = await apiClient.get('/api/auth-status');
    console.log({ authStatus: resp })

    if (resp?.data?.data?.user)
      return resp.data.data.user;

    return false;
  }
  catch(e) {
    // let it return undefined
  }
}

export function useProvideAuth() {
  const [user, setUser] = useState(null);

  useEffect(async () => {
    setUser(await getAuthStatus());
  }, []);

  // Return the user object and auth methods
  return {
    user,
    setUser,
  };
}

export const useAuth = () => ({
  auth: useContext(AuthContext)
});
