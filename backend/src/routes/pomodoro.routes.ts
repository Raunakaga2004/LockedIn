import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { PomodoroSessionSchema } from "../schemas/pomodoro.shema";
import { validateZod } from "../middlewares/validateZod";
import prisma from "../config/prisma";

const router = Router();

//addPomodoro
router.post('/addPomodoro', verifyToken, validateZod(PomodoroSessionSchema), async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const { task_id, start_time, end_time, number_focus, number_long_break, number_short_break, number_of_focus_session_before_longBreak, focus_time, short_break_time, long_break_time, interruption_time, notes } = req.body;

    const data: any = {
      user_id: userId,
    };

    if(task_id){
      data.task_id = task_id
    }

    if(start_time){
      data.start_time = start_time
    }

    if(end_time){
      data.end_time = end_time
    }

    if(number_focus) data.number_focus = number_focus

    if(number_short_break) data.number_short_break = number_short_break

    if(number_long_break) data.number_long_break = number_long_break

    if(focus_time) data.focus_time = focus_time

    if(short_break_time) data.short_break_time = short_break_time

    if(long_break_time) data.long_break_time = long_break_time

    if(number_of_focus_session_before_longBreak) data.number_of_focus_session_before_longBreak = number_of_focus_session_before_longBreak

    if(interruption_time) data.interruption_time = interruption_time

    if(notes) data.notes = notes

    await prisma.pomodoro_Session.create({
      data: data,
    });

    return res.status(200).json({
      message: "Pomodoro Session created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//updatePomodoro // add break time distraction time and study all details in this
router.put('/updatePomodoro', verifyToken, validateZod(PomodoroSessionSchema), async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== 'string'){
      return res.status(400).json({
        message : "enter correct id of pomodoro session"
      })
    }

    const {task_id, start_time, end_time, number_focus, number_long_break, number_short_break, number_of_focus_session_before_longBreak, focus_time, short_break_time, long_break_time, interruption_time, notes } = req.body;

    const data: any = {
      user_id: userId,
    };

    if(task_id){
      data.task_id = task_id
    }

    if(start_time){
      data.start_time = start_time
    }

    if(end_time){
      data.end_time = end_time
    }

    if(number_focus) data.number_focus = number_focus

    if(number_short_break) data.number_short_break = number_short_break

    if(number_long_break) data.number_long_break = number_long_break

    if(focus_time) data.focus_time = focus_time

    if(short_break_time) data.short_break_time = short_break_time

    if(long_break_time) data.long_break_time = long_break_time

    if(number_of_focus_session_before_longBreak) data.number_of_focus_session_before_longBreak = number_of_focus_session_before_longBreak

    if(interruption_time) data.interruption_time = interruption_time

    if(notes) data.notes = notes

    await prisma.pomodoro_Session.update({
      where : {
        id : id
      },
      data: data,
    });

    return res.status(200).json({
      message: "Pomodoro Session updated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//deletePomodoro
router.delete('/deletePomodoro', verifyToken, async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== 'string'){
      return res.status(400).json({
        message : "enter correct id of pomodoro session"
      })
    }

    await prisma.pomodoro_Session.delete({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      message : "Pomodoro Session deleted Successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//getPomodoro
router.get('/getPomodoro', verifyToken, async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== 'string'){
      return res.status(400).json({
        message : "enter correct id of pomodoro session"
      })
    }

    const pomo = await prisma.pomodoro_Session.findFirst({
      where : {
        id : id
      }
    })

    if(pomo?.user_id !== userId){
      return res.status(400).json({
        message : "Incorrect pomo session id"
      })
    }

    return res.status(200).json({
      pomodoro_session : pomo
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//getAllPomodoroOfSameTask
router.get('/getAllPomodoroOfSameTask', verifyToken, async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const taskid = req.query.taskid;

    if(typeof taskid !== 'string'){
      return res.status(400).json({
        message : "enter correct task id for pomodoro session"
      })
    }

    const pomos = await prisma.pomodoro_Session.findMany({
      where : {
        task_id : taskid,
        user_id : userId
      }
    })

    return res.status(200).json({
      pomodoro_sessions : pomos
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//getRecentPomodoro
router.get('/getRecentPomodoro', verifyToken, async (req, res)=>{
  try {
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//getSummaryOfSepecificPomodoro
router.get('/getSummaryOfSepecificPomodoro', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//getSummaryOfSpecificTaskPomodoro
router.get('/getSummaryOfSpecificTaskPomodoro', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//getSummaryOfAllPomodoros
router.get('/getSummaryOfAllPomodoros', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})