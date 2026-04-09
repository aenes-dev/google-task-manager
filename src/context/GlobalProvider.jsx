import { ThemeProvider } from "./ThemaContext";
import { AuthProvider } from "./AuthContext";
import { CalendarProvider } from "./CalendarContext";




const GlobalProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CalendarProvider>
        {children}
        </CalendarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default GlobalProvider;