import { createContext, useReducer, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, error: null, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false, error: null }; 
    case "ERROR":
      return { ...state, error: action.payload, loading: false, user: null };
    case "LOADING":
      return { ...state, loading: true, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    dispatch({ type: "LOADING" });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          accessToken: accessToken,
        })
      );

      dispatch({ type: "LOGIN", payload: user });

    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  const logout = async () => {
    dispatch({ type: "LOADING" });
    try {
      await signOut(auth);
      
      localStorage.removeItem("user");
      localStorage.removeItem("google_token"); 

      dispatch({ type: "LOGOUT" });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};