import { useState, useCallback, createContext, useContext } from 'react';

export const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const snackbar = useProvideSnackbar();
  return (
    <SnackbarContext.Provider value={snackbar}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useProvideSnackbar() {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    autoHideDuration: 3000,
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
  });

  const trigger = useCallback((props) => {
    setSnackbar({
      ...snackbar,
      isOpen: true,
      ...props
    });
  }, [snackbar]);

  // Return the user object and auth methods
  return {
    trigger,
    snackbar,
    setSnackbar,
    messageTypes: {
      403: `You don't have permission to do that.`,
      500: `An unknown error occurred.`,
    }
  };
}

export const useSnackbar = () => useContext(SnackbarContext);
