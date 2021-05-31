import { useState, useEffect, createContext, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../utils/client/api-client.js';

export const AuthContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

async function getAuthStatus() {
  const resp = await apiClient.get('/api/auth-status');
  console.log({ authStatus: resp })

  if (resp.data.data?.user)
    return resp.data.data.user;

  return false;
}

export function useProvideAuth() {
  const [user, setUser] = useState(null);
  const logIn = (email, password) => {
  };
  const signUp = (email, password) => {
  };
  const logOut = () => {
  };

  useEffect(async () => {
    setUser(await getAuthStatus());
  }, []);

  // Return the user object and auth methods
  return {
    user,
    setUser,
    logIn,
    signUp,
    logOut,
  };
}

export const useAuth = (req, resp) => ({
  auth: useContext(AuthContext)
});
