import { Routes, Route } from "react-router-dom";
import routeConfig from "./routeConfig";
import PrivateRoute from "./PrivateRoute";
import SpinnerRoute from './SpinnerRoute';
import NavbarRoute from "./NavbarRoute";



const renderRoutes = (routes) =>
  routes.map((route) => {
    let element = route.element;

    if (route.auth) {
      element = <PrivateRoute isPageActive={route.isPageActive} redirectUrl={route?.redirectUrl}>{element}</PrivateRoute>;
    }

    if (route.spinner) {
      element = <SpinnerRoute delay={route.spinnerDelay}>{element}</SpinnerRoute>;
    }

    if(route.navbar){
      element = <NavbarRoute>{element}</NavbarRoute>
    }
    
    


    return (
      <Route
        key={route.path || "index"}
        path={route.path}
        element={element}
        index={route.index}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });

const SiteRoutes = () => {
  return <Routes>{renderRoutes(routeConfig)}</Routes>;
};

export default SiteRoutes;