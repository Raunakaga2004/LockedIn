import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { validateZod } from "../middlewares/validateZod";
import { HabitSchema, HabitType } from "../schemas/habit.schema";
import { start } from "repl";
import prisma from "../config/prisma";


const router = Router();

// createHabit
router.post('/createHabit',validateZod(HabitSchema), verifyToken, async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const {title, description, start_date, end_date, frequency, interval, days_of_week} = req.body

    const data : any = {
      user_id : userId
    }

    if(frequency !== "weekly"){
      data.days_of_week = [];
    }
    else data.days_of_week = days_of_week ?? [];

    if(title) data.title = title
    else return res.status(400).json({
      message: "Title is required"
    })

    if(description) data.description = description;

    if(start_date) data.start_date = start_date;
    else data.start_date = new Date();

    if(end_date) data.end_date = end_date;

    if(frequency) data.frequency = frequency;
    else data.frequency = "daily"

    if(interval) data.interval = interval;
    await prisma.habit.create({
      data: data,
    });

    return res.status(200).json({
      message: "Habit created successfully",
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// getHabit
router.get('/getHabit', verifyToken, async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const habit_id  = req.query.id;

    if (typeof habit_id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    const habit = await prisma.habit.findUnique({
      where : {
        id : habit_id
      }
    })

    if(habit?.user_id !== userId){
      return res.status(404).json({
        error : "Invalid user habit"
      })
    }

    return res.status(200).json({
      habit : habit
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// getAllHabit
router.get('/getAllHabit', verifyToken, async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const habits = await prisma.habit.findMany({
      where : {
        user_id : userId
      }
    })

    return res.status(200).json({
      habits : habits
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// updateHabit
router.put('/updateHabit', verifyToken, validateZod(HabitSchema), async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const habit_id  = req.query.id;

    if (typeof habit_id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    const {title, description, start_date, end_date, frequency, interval, days_of_week} = req.body

    const data : any = {
      user_id : userId
    }

    if(frequency !== "weekly"){
      data.days_of_week = [];
    }
    else data.days_of_week = days_of_week ?? [];

    if(title) data.title = title
    else return res.status(400).json({
      message: "Title is required"
    })

    if(description) data.description = description;

    if(start_date) data.start_date = start_date;
    else data.start_date = new Date();

    if(end_date) data.end_date = end_date;

    if(frequency) data.frequency = frequency;
    else data.frequency = "daily"

    if(interval) data.interval = interval;

    await prisma.habit.update({
      where : {
        id : habit_id
      },
      data : data
    })

    return res.status(200).json({
      message : "habit updated successfully!"
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// deleteHabit
router.delete('/deleteHabit', verifyToken, async (req, res)=>{
  try {
    const userId = (req as any).user.userId;

    const habit_id  = req.query.id;

    if (typeof habit_id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    await prisma.habit.delete({
      where : {
        id : habit_id
      }
    })

    return res.status(200).json({
      message : "habit deleted successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// at 12:01 AM we need to add the current habits to log using node-cron

// updateHabitLog
router.put('/updateHabitLog', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// deleteHabitLog
router.delete('/deleteHabitLog', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// addHabitLog
router.post('/addHabitLog', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// getHabitLogs
router.get('/getHabitLogs', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// getAllHabitLogs
router.get('/getAllHabitLogs', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// getHabitSummary
router.get('/getHabitsSummary', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// getAllHabitSummary
router.get('/getAllHabitsSummary', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})