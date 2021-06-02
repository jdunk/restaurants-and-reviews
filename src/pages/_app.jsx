import '../styles/globals.css'
import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ProvideAuth } from '../hooks/auth';
import { createMuiTheme } from '@material-ui/core/styles';
import { amber, blue } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: amber[800],
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
      <ProvideAuth>
        <ThemeProvider theme={theme}>
          {typeof window === 'undefined' ? null : <Component {...pageProps} />}
        </ThemeProvider>
      </ProvideAuth>
    </div>
  )
}

export default MyApp
