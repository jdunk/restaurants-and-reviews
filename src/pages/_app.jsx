import '../styles/globals.css'
import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ProvideAuth } from '../hooks/auth';

function MyApp({ Component, pageProps }) {
  return (
    <div suppressHydrationWarning>
      <CssBaseline />
      <ProvideAuth>
        {typeof window === 'undefined' ? null : <Component {...pageProps} />}
      </ProvideAuth>
    </div>
  )
}

export default MyApp
