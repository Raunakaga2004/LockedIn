import { AppBar, Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import ColorModeSelect from "./shared-theme/ColorModeSelect";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { showError, showSuccess } from "../utils/toast";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { TroubleshootOutlined } from "@mui/icons-material";

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
    axios.post(`${import.meta.env.VITE_URL}/user/signout`,{},{
      withCredentials : true
    }).then(()=>{
      setIsLoggedIn(false);
      showSuccess("Signed Out Successfully!");
    }).catch((e)=>{
      showError(e)
    })
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