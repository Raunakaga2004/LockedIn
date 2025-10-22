import { useEffect, useState, type SetStateAction } from "react";
import NavBar from "../NavBar";
import getUser from "../../utils/user";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CheckBox, Delete, Edit } from "@mui/icons-material";

export default function Task(){
  const [user, setUser] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [noramalView, setView] = useState(true)
  const [value, setValue] = useState('option1');

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

        <div className="bg-slate-300 w-full h-full">
          {/* task component */}
          <button>+</button>

          <div>
            {/* task 1 */}
            <div className="flex flex-row">
              <CheckBox/>
              <div>task name</div>
              <Edit/>
              <Delete/>
            </div>
          </div>
        </div>

        <div>
          {/* report component */}
          reports
        </div>

      </div> : 
      <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6 h-full w-full">
        {/* Eisenhower matrix view */}
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>}
    </div>
  </>
}