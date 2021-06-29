import IndexPage from '../spa-pages/IndexPage.jsx'
import LogInPage from '../spa-pages/LogInPage.jsx'
import SignUpPage from '../spa-pages/SignUpPage.jsx'
import RestaurantsPage from '../spa-pages/RestaurantsPage.jsx'
import RestaurantPage from '../spa-pages/RestaurantPage.jsx'
import UsersPage from '../spa-pages/UsersPage.jsx'

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
    path: "/restaurants/:slug",
    label: "Restaurant",
    component: RestaurantPage,
  },
  {
    path: "/restaurants",
    label: "Restaurants",
    component: RestaurantsPage,
  },
  {
    path: "/users",
    label: "Users",
    component: UsersPage,
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