import HtmlHead from '../components/HtmlHead';
import AppBar from '../components/AppBar';
import AppSnackbar from '../components/AppSnackbar';
import history from '../utils/client/history';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import routes from '../config/spa-routes'

export default function AppIndex() {
  console.log({ routes })

  return (<>
    <HtmlHead />

    <Router history={history}>
      <AppBar />
      <AppSnackbar />

      <Switch>
        {
          routes.map((route, i) => {
            return <RouteWithSubRoutes key={route.path} {...route} />
          })
        }
      </Switch>

    </Router>
  </>
  );
}

function RouteWithSubRoutes(route) {
  console.log({ route })
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}