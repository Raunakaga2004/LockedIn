import NavBar from "../NavBar";
import { useState, useEffect } from "react";
import getUser from "../../utils/user";
import PomoTimer from "./PomoTimer";

export default function Pomodoro(){
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
    
    <div className="flex flex-row w-screen">
      {/* main timer */}
      <div className="flex-1">
        <PomoTimer/>
      </div>


      {/* tasks */}
      <div className="flex-1">
        asdasd
      </div>

    </div>

    {/* reports */}

  </>
}

// create a timer similar to pomofocus
// add temporary tasks if not signed in 
// give list of tasks for pomodoro