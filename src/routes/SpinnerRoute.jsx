import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

const SpinnerRoute = ({ children, delay = 500 }) => {
  const { loading } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    let timer;

    if (!loading) {
      timer = setTimeout(() => {
        setShowSpinner(false);
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [loading, delay]);

  if (loading || showSpinner) {
    return <LoadingScreen />;
  }

  return children;
};

export default SpinnerRoute;