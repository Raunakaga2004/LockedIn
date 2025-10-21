import NavBar from "../NavBar";
import { useState, useEffect } from "react";
import getUser from "../../utils/user";
import PomoTimer from "./PomoTimer";
import { Check, CheckBox, CheckCircleOutline, CheckCircleOutlineTwoTone, CircleOutlined, CloudCircleOutlined, Delete, OutlinedFlag } from "@mui/icons-material";

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
    
    {/* <div>
      Pomodoro
    </div> */}

    <div className="flex flex-row w-screen gap-2 mx-6">
      {/* main timer */}
      <div>
        <PomoTimer/>
      </div>


      {/* tasks */}
      {/* highlight the ongoing task */}
      <div className="bg-slate-200 min-w-[40%] flex flex-col justify-between">
        <div>Tasks</div>

        <div className=" p-2 h-full">
          {/* Temp  Task */}
          <div className="bg-slate-400 flex flex-row justify-between px-2 py-1">
            <div>0/5</div>
            <div className="w-full text-center">Task name</div>
            
            {true ? <CheckCircleOutline/> : <CircleOutlined/>}
            <Delete/>
            
          </div>
        </div>

        <button className="bg-blue-400 m-2 rounded-md p-2">Add Task</button>
      </div>

    </div>

    {/* reports */}

    <div className="text-center w-screen">
      Reports
    </div>

  </>
}

// create a timer similar to pomofocus
// add temporary tasks if not signed in 
// give list of tasks for pomodoro