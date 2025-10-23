import { useEffect, useState, type SetStateAction } from "react";
import NavBar from "../NavBar";
import getUser from "../../utils/user";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank, Delete, Edit } from "@mui/icons-material";
import tasks from "./temptask";
import Single_Task from "./Single_Task";
import AddTaskWindow from "./AddTaskWindow";


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

      {value === 'option1' ? 
      <div className="flex flex-row justify-between">
          {/* normal view */}

        <div className="bg-slate-200 w-full h-full">
          {/* task component */}
          <button onClick={()=>setopen(true)}>+</button>

          <div>
            {/* task 1 */}
            {tasks.tasks.map((task, id) => 
              <Single_Task key={id} task={task} id={id}/>
            )}
          </div>
        </div>

        <div>
          {/* report component */}
          reports
        </div>

      </div> : 
      <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6 h-full w-full">
        {/* Eisenhower matrix view */}
        <div className="bg-slate-200">
          {/* important and urgent */}

          <button>+</button>
        </div>
        <div className="bg-slate-200">
          {/* important and not urgent */}

          <button>+</button>
        </div>
        <div className="bg-slate-200">
          {/* npt important and urgent */}

          <button>+</button>
        </div>
        <div className="bg-slate-200">
          {/* not important and not urgent */}

          <button>+</button>
        </div>
      </div>}

      <AddTaskWindow
        open={open}
        onClose={() => setopen(false)}
        onSave={handleSaveTask}
      />
    </div>
  </>
}