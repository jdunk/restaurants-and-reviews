import IndexPage from '../spa-pages/IndexPage.jsx'
import LogInPage from '../spa-pages/LogInPage.jsx'
import SignUpPage from '../spa-pages/SignUpPage.jsx'
import RestaurantsPage from '../spa-pages/RestaurantsPage.jsx'

const Empty = function() { return (<>empty page</>); }

const routes = [
  {
    path: "/login",
    label: "Log In",
    component: LogInPage,
  },
  {
    path: "/signup",
    label: "Sign Up",
    component: SignUpPage,
  },
  {
    path: "/restaurants",
    label: "Restaurants",
    component: RestaurantsPage,
  },
  {
    path: "/users",
    label: "Users",
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
  { // Needs to be last!
    path: "/",
    label: "Home",
    component: IndexPage,
  },
];

export default routes;