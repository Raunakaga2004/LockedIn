import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Dashboard from "./Dashboard";
import Landing from "./Landing";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h2: { fontWeight: 600 },
  },
});

export default function Home() {
  const isLoggedIn = false; // Replace with your actual auth logic

  // useEffect(()=>{
  //   getUser()
  // },[])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoggedIn ? <Dashboard /> : <Landing />}
    </ThemeProvider>
  );
}