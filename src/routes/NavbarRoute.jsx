import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";



const NavbarRoute = ({ children}) => {
  const { loading } = useContext(AuthContext);



  return <>
     {children}
    <Navbar />
  </>;
};

export default NavbarRoute;