import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Dashboard from "./Dashboard";
import Landing from "./Landing";
import getUser from "../utils/user";
import { useEffect, useState } from "react";

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
  const [user, setUser] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    async function fetch(){
      const res = await getUser()
      console.log(res);

      if(res.user){
        setUser(res.user.username)
        setIsLoggedIn(true);
      }
    }
    fetch();
  },[])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoggedIn ? <Dashboard /> : <Landing />}
    </ThemeProvider>
  );
}