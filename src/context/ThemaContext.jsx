import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark" ? true : false);
  const [autoTheme, setAutoTheme] = useState(localStorage.getItem("autoTheme") === "true" ? true : false);


  const applyAutoTheme = () => {
    const hour = new Date().getHours();

    if (hour >= 7 && hour < 19) {
      setDark(false);
      localStorage.setItem("theme", "light");
    } else {
      setDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    if (autoTheme) {
      applyAutoTheme();

      const interval = setInterval(() => {
        applyAutoTheme();
      }, 60000); 

      return () => clearInterval(interval);
    }
  }, []);


  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const toggleTheme = () => {
    if (!autoTheme) {
      setDark(prev => !prev);
    }
  };

  const toggleAutoTheme = () => {
    setAutoTheme(prev => !prev);
  };

  useEffect(()=>{
 if(dark){
  localStorage.setItem("theme", "dark");
 } else {
  localStorage.setItem("theme", "light");
 }

 if(autoTheme){
  localStorage.setItem("autoTheme", "true");
 } else {
  localStorage.setItem("autoTheme", "false");
 }

  },[dark, autoTheme])

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleTheme,
        autoTheme,
        toggleAutoTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};