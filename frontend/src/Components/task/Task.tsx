import { useEffect, useState, type SetStateAction } from "react";
import NavBar from "../NavBar";
import getUser from "../../utils/user";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank, Delete, Edit } from "@mui/icons-material";
import tasks from "./temptask";
import Single_Task from "./Single_Task";
import AddTaskWindow from "./AddTaskWindow";
import EisenhowerMatrixView from "./EisenhowerMatrixView";
import NormalView from "./NormalView";


export default function Task(){
  const [user, setUser] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [noramalView, setView] = useState(true)
  const [value, setValue] = useState('option1');

  const [open, setopen] = useState(false);

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

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setValue(event.target.value);
  };

  function handleSaveTask(taskData: any): void {
    console.log("task saved")
  }

  return <>
    <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={user}/>
    <div className="h-full w-full">
      <div className="flex flex-row justify-end">
        {/* contains heading and view setting */}

        {/* make it dropdown */}
         <FormControl>
          <InputLabel id="dropdown-label">Change View</InputLabel>
          <Select
            labelId="dropdown-label"
            id="dropdown"
            value={value}
            label="View Settinfg"
            onChange={handleChange}
          >
            <MenuItem value="option1">Normal View</MenuItem>
            <MenuItem value="option2">Eisenhower Matrix View</MenuItem>
          </Select>
        </FormControl>
      </div>

      <button onClick={() => setopen(true)}>Add Task</button>

      {value === 'option1' ? 
      <NormalView/> 
      : 
      <EisenhowerMatrixView/>}

      <AddTaskWindow
        open={open}
        onClose={() => setopen(false)}
        onSave={handleSaveTask}
      />
    </div>
  </>
}