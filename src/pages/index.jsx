import HtmlHead from '../components/HtmlHead';
import AppBar from '../components/AppBar';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import routes from '../config/spa-routes'

export default function AppIndex() {
  console.log({ routes })

  return (<>
    <HtmlHead />

    <Router>
      <AppBar />
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