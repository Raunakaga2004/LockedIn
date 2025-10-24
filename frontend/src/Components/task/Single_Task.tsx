import React, { useEffect } from "react";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Delete,
  Edit,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import EditTaskWindow from "./EditTaskWindow";

import axios from 'axios'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

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
  const [open, setOpen] = React.useState(false);

  const [check, setcheck] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false);


  useEffect(()=>{
    function fetch()
    {
      if(task.status === 'completed') setcheck(true)
      else setcheck(false)
    }

    fetch();
  }, [])

  const handleTaskCheck = async () => {
    try{
      // await axios.put(`${import.meta.env.VITE_URL}/`)

      setcheck(!check)
    }
    catch(e){
      console.error(e)
    }
  };

  const handleSaveEditedTask = (updatedTask: any) => {
    console.log("Updated Task:", updatedTask);
  };


  return (
    <div
      key={id}
      className="group flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-all"
    >
      <div onClick={handleTaskCheck} className="cursor-pointer active:scale-60 transition-transform">
        {check ? (
          <CheckBox className="text-green-600" />
        ) : (
          <CheckBoxOutlineBlank className="text-gray-400" />
        )}
      </div>

      <Tooltip
        title={
          <span className="text-sm font-normal text-white p-2">{task.description}</span>
        }
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "#1f2937", 
              color: "#fff",
              fontSize: "0.875rem",
            },
          },
          arrow: {
            sx: {
              color: "#1f2937",
            },
          },
        }}
      >
        <div className="cursor-pointer font-medium text-gray-800">
          {task.title}
        </div>
      </Tooltip>

      <Delete onClick={() => setDeleteOpen(true)} className="cursor-pointer hover:text-red-600 opacity-0 group-hover:opacity-100" />
      <Edit onClick={() => setOpen(true)} className="cursor-pointer hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <DeleteConfirmationComponent
        deleteOpen = {deleteOpen}
        setDeleteOpen = {setDeleteOpen}
        task = {task}
      />
      <EditTaskWindow
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveEditedTask}
        task={task}
      />
    </div>
  );
}

type TaskType = "quick_task" | "daily" | "monthly" | "yearly";

type TaskReference = {
  id?: string;
  title: string;
  description?: string;
  type?: TaskType | string; // fix it later (it should not be string)
  status: string;
  urgent?: boolean;
  important?: boolean;
  recurrence_id?: string;
  expected_pomodoro?: number;
  actual_pomodoro?: number;
  tags?: string;
};


type deleteWindowProps = {
  task : TaskReference,
  deleteOpen : boolean,
  setDeleteOpen : (arg0: boolean)=>void
}

function DeleteConfirmationComponent({deleteOpen, setDeleteOpen, task} : deleteWindowProps){
  return <>
    <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
      <DialogTitle className="font-bold text-lg">Confirm Delete</DialogTitle>
      <DialogContent>
        <div className="py-2 text-gray-700">
          Are you sure you want to delete <span className="font-semibold">{task.title}</span>?
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              // await axios.delete(`${import.meta.env.VITE_URL}/task/${id}`);
              setDeleteOpen(false);
            } catch (e) {
              console.error(e);
            }
          }}
          color="error"
          variant="contained"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </>
}
