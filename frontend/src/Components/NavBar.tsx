import { AppBar, Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import ColorModeSelect from "./shared-theme/ColorModeSelect";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { showSuccess } from "../utils/toast";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";

interface NavBarProps {
  isLoggedIn: boolean;
  setIsLoggedIn:(value: boolean) => void;
  username : string
}

export default function NavBar({isLoggedIn, setIsLoggedIn, username} : NavBarProps){
  const navigate = useNavigate();

  const [openMenu, setMenu] = useState(false);

  function handleSignIn(){
    navigate('/signin');
  }

  function toggleMenu(){
    setMenu(!openMenu)
  }

  async function handleSignOut(){
    await axios.post(`${import.meta.env.VITE_URL}/user/signout`, {
      withCredentials : true
    })

    setIsLoggedIn(false);
    showSuccess("Signed Out Successfully!");
  }

  return <AppBar position="static" color="transparent" elevation={0}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Locked In
      </Typography>
      <ColorModeSelect />

      {!isLoggedIn ? 
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleSignIn}>
          Sign In
        </Button> :
        <>
          {/* <Button variant="contained" sx={{ ml: 2 }} onClick={handleSignOut}>
          Sign Out
          </Button> */}

          <div className="flex flex-col">
            <ProfileMenu username={username} handleSignOut={handleSignOut}/>
          </div>
        </>
      }
    </Toolbar>
  </AppBar>
}