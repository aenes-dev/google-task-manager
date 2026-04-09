import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ClipLoader } from "react-spinners";
import { auth } from "../firebase/config";


const PrivateRoute = ({ children, redirectUrl = '/', isPageActive = false }) => {
  const { user, loading } = useContext(AuthContext);
   const location = useLocation();
  



if (!user) {
  if (!user && isPageActive){
         <Navigate to={redirectUrl} replace />;
        return children;
  }
    return <Navigate to={redirectUrl} replace />;
  }  

  return children;
};

export default PrivateRoute;