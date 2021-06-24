import '../styles/globals.css'
import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProvider } from '../hooks/auth';
import { SnackbarProvider } from '../hooks/snackbar';
import { createMuiTheme } from '@material-ui/core/styles';
import { grey, blue } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: blue[600],
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <div suppressHydrationWarning>
      <CssBaseline />
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
              {typeof window === 'undefined' ? null : <Component {...pageProps} />}
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  )
}

export default MyApp
