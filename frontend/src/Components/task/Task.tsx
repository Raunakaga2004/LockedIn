import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import getUser from "../../utils/user";

export default function Task(){
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
  return <>
    <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={user}/>
    hi this is task window
  </>
}