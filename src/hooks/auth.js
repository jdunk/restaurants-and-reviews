import { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '../utils/client/api-client.js';
import history from '../utils/client/history';
import { useHistory, useLocation } from 'react-router-dom';

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
    const authUser = await getAuthStatus();
    setUser(authUser);

    if (history.location.pathname === '/') {
      if (authUser) {
        history.push('/restaurants');
      }
      else {
        history.push('/login');
      }
    }
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
