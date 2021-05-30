import IndexPage from '../spa-pages/IndexPage.jsx'
import LogInPage from '../spa-pages/LogInPage.jsx'
import SignUpPage from '../spa-pages/SignUpPage.jsx'
import RestaurantsPage from '../spa-pages/RestaurantsPage.jsx'

const Empty = function() { return (<>empty page</>); }

const routes = [
  {
    path: "/signup",
    component: SignUpPage,
  },
  {
    path: "/login",
    component: LogInPage,
  },
  {
    path: "/restaurants",
    component: RestaurantsPage,
  },
  {
    path: "/users",
    component: Empty,
    routes: [
      {
        path: "/users/bus",
        component: Empty
      },
      {
        path: "/tacos/cart",
        component: Empty
      }
    ]
  },
  {
    path: "/",
    component: IndexPage,
  },
];

export default routes;