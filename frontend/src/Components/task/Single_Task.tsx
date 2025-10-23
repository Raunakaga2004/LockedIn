import { CheckBox, CheckBoxOutlineBlank, Delete, Edit } from "@mui/icons-material";
import React from "react";
import EditTaskWindow from "./EditTaskWindow";

type Task = {
  title: string;
  description: string;
  type: string;
  status: string;
  urgent: boolean;
  important: boolean;
};

type SingleTaskProps = {
  id: number;
  task: Task;
};

export default function Single_Task({ id, task }: SingleTaskProps) {
  const [hovered, setHovered] = React.useState(false);
  const [open, setopen] = React.useState(false)

  const handleTaskCheck = ()=>{

  }

  const handleSaveEditedTask = (updatedTask: any) => {
    console.log("Updated Task:", updatedTask);
    // update in backend or global state
  };

  return <div
    key={id}
    className="flex flex-row items-center gap-3"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
    <div onClick={handleTaskCheck}>
      {task.status === "completed" ? <CheckBox /> : <CheckBoxOutlineBlank />}
    </div>

    <div className="relative">
      <div>{task.title}</div>
      {/* {hovered && (
        <div className="">
          {task.description}
        </div>
      )} */}
    </div>

    <Delete />
    <Edit onClick={()=>setopen(true)}/>

    <EditTaskWindow
      open={open}
      onClose={() => setopen(false)}
      onSave={handleSaveEditedTask}
      task={task}
    />
  </div>
}