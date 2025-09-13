import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

import prisma from "../config/prisma";
import { validateZod } from "../middlewares/validateZod";
import { WorkoutExerciseLogSchema, WorkoutPlanExerciseSchema, WorkoutPlanSchema, WorkoutSessionLogSchema } from "../schemas/workout.schema";

const router = Router();

// create workout plan
router.get("/addWorkoutPlan", verifyToken, validateZod(WorkoutPlanSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const {title, description} = req.body;

    const data : any = {};

    if(title) data.title = title;

    if(description) data.description = description;
    
    await prisma.workout_Plan.create({
      data : data
    })

    return res.status(200).json({
      message : "Workout Plan created Successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// delete workout plan
router.get("/deleteWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    await prisma.workout_Plan.delete({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      message : "Deleted Successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get workout plan
router.get("/getWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    const workoutPlan = prisma.workout_Plan.findUnique({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      workoutPlan
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get all workout plan
router.get("/getAllWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const workoutPlans = await prisma.workout_Plan.findMany({
      where : {
        user_id : userId
      }
    })

    return res.status(200).json({
      workoutPlans
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update workout plan (also add workout plan exercises)
router.get("/updateWorkoutPlan", verifyToken, validateZod(WorkoutPlanSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    const {title, description} = req.body;

    const data : any = {}

    if(title) data.title = title;

    if(description) data.description = description;

    await prisma.workout_Plan.update({
      where : {
        id : id
      },
      data : data
    })

    return res.status(200).json({
      message : "workout plan updated successfully!"
    })
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// add exercises to workout plan
router.get("/addExercise", verifyToken, validateZod(WorkoutPlanExerciseSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const {workout_plan_id, exercise_name, description, order, notes} = req.body;

    const data : any = {};

    if(!workout_plan_id){
      return res.status(400).json({
        message : "workout plan not found"
      })
    }
    else{
      const workout_plan = await prisma.workout_Plan.findUnique({
        where : {
          id : workout_plan_id
        }
      })

      if(!workout_plan || workout_plan?.user_id !== userId){
        return res.status(400).json({
          message : "workout plan not found"
        })
      }

      data.workout_plan_id = workout_plan_id
    }

    if(exercise_name) data.exercise_name = exercise_name

    if(description) data.description = description

    if(order) data.order = order

    if(notes) data.notes = notes

    await prisma.workout_Plan_Exercise.create({
      data : data
    })

    return res.status(200).json({
      message : "workout plan exercise added."
    })
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// delete exercise to workout plan
router.get("/deleteExercise", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "please correct id"
      })
    }

    await prisma.workout_Plan_Exercise.delete({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      message : "workout plan exercise deleted successfully"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update exercise to workout plan
router.get("/updateExercise", verifyToken, validateZod(WorkoutPlanExerciseSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "please correct id"
      })
    }

    const {workout_plan_id, exercise_name, description, order, notes} = req.body;

    const data : any = {};

    if(!workout_plan_id){
      return res.status(400).json({
        message : "workout plan not found"
      })
    }
    else{
      const workout_plan = await prisma.workout_Plan.findUnique({
        where : {
          id : workout_plan_id
        }
      })

      if(!workout_plan || workout_plan?.user_id !== userId){
        return res.status(400).json({
          message : "workout plan not found"
        })
      }

      data.workout_plan_id = workout_plan_id
    }

    if(exercise_name) data.exercise_name = exercise_name

    if(description) data.description = description

    if(order) data.order = order

    if(notes) data.notes = notes

    await prisma.workout_Plan_Exercise.update({
      where : {
        id : id
      },
      data : data
    })

    return res.status(200).json({
      message : "workout plan exercise updated."
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get particular exercise
router.get("/getExercise", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "please correct id"
      })
    }

    const exercise = await prisma.workout_Plan_Exercise.findUnique({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      exercise
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get exercise to workout plan
router.get("/getExerciseOfWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const workout_plan_id = req.query.id;

    if(typeof workout_plan_id !== "string"){
      return res.status(400).json({
        message : "please correct id"
      })
    }

    if(!workout_plan_id){
      return res.status(400).json({
        message : "workout plan not found"
      })
    }
    else{
      const workout_plan = await prisma.workout_Plan.findUnique({
        where : {
          id : workout_plan_id
        }
      })

      if(!workout_plan || workout_plan?.user_id !== userId){
        return res.status(400).json({
          message : "workout plan not found"
        })
      }
    }

    const exercises = await prisma.workout_Plan_Exercise.findMany({
      where : {
        workout_plan_id : workout_plan_id,
        user_id : userId
      }
    })

    return res.status(200).json({
      exercises
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get all exercises
router.get("/getAllExercises", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const exercises = await prisma.workout_Plan_Exercise.findMany({
      where : {
        user_id : userId
      }
    })

    return res.status(200).json({
      exercises
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// add workout session log
router.get("/addWorkoutSessionLog", verifyToken, validateZod(WorkoutSessionLogSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    
    const {workout_plan_id, notes, start_time, end_time} = req.body;

    const data : any = {};
    
    data.user_id = userId

    if(workout_plan_id) data.workout_plan_id = workout_plan_id

    if(notes) data.notes = notes

    if(start_time) data.start_time = start_time

    if(end_time) data.end_time = end_time


    await prisma.workout_Session_Log.create({
      data : data
    })

    return res.status(200).json({
      message : "Workout Session log added Successfully!"
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update workout session log
router.get("/updateWorkoutSessionLog", verifyToken, validateZod(WorkoutSessionLogSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    const {workout_plan_id, notes, start_time, end_time} = req.body;

    const data : any = {};

    if(workout_plan_id) data.workout_plan_id = workout_plan_id

    if(notes) data.notes = notes

    if(start_time) data.start_time = start_time

    if(end_time) data.end_time = end_time

    await prisma.workout_Session_Log.update({
      where : {
        id : id
      },
      data : data
    })

    return res.status(200).json({
      message : "workout session log updated successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// read workout session log
router.get("/getWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    const workoutSessionLog = await prisma.workout_Session_Log.findUnique({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      workoutSessionLog
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// read workout session log of particular workout
router.get("/getAllWorkoutSessionLogOfWorkout", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.body.id; // workout plan id

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    const workoutSessionLogs = await prisma.workout_Session_Log.findMany({
      where : {
        workout_plan_id : id,
        user_id : userId
      }
    })

    return res.status(200).json({
      workoutSessionLogs
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// read all workout session log
router.get("/getAllWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const workoutSessionLogs = await prisma.workout_Session_Log.findMany({
      where : {
        user_id : userId
      }
    })

    return res.status(200).json({
      workoutSessionLogs
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// delete workout session log
router.get("/deleteWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.userId

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    await prisma.workout_Session_Log.delete({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      message : "session log deleted successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// add workout exercise log
router.get("/addWorkoutExerciseLog", verifyToken, validateZod(WorkoutExerciseLogSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const {workout_session_log_id, workout_plan_exercise_id, set, reps, rest, start_time, end_time, max_weight, notes} = req.body;

    const data : any = {};

    data.user_id = userId;

    if(workout_session_log_id) data.workout_session_log_id = workout_session_log_id

    if(workout_plan_exercise_id) data.workout_plan_exercise_id = workout_plan_exercise_id

    if(set) data.set = set

    if(reps) data.rep = reps

    if(rest) data.rest = rest

    if(start_time) data.start_time = start_time

    if(end_time) data.end_time = end_time

    if(max_weight) data.max_weight = max_weight

    if(notes) data.notes = notes

    await prisma.workout_Exercise_Log.create({
      data : data
    })

    return res.status(200).json({
      message : "workout exercise log created successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update workout exercise log
router.get("/updateWorkoutExerciseLog", verifyToken, validateZod(WorkoutExerciseLogSchema), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.userId

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    const {workout_session_log_id, workout_plan_exercise_id, set, reps, rest, start_time, end_time, max_weight, notes} = req.body;

    const data : any = {};

    if(workout_session_log_id) data.workout_session_log_id = workout_session_log_id

    if(workout_plan_exercise_id) data.workout_plan_exercise_id = workout_plan_exercise_id

    if(set) data.set = set

    if(reps) data.rep = reps

    if(rest) data.rest = rest

    if(start_time) data.start_time = start_time

    if(end_time) data.end_time = end_time

    if(max_weight) data.max_weight = max_weight

    if(notes) data.notes = notes

    await prisma.workout_Exercise_Log.update({
      where : {
        id : id
      },
      data : data
    })

    return res.status(200).json({
      message : "workout exercise log updated successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// delete workout exercise log
router.get("/deleteWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.userId

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    await prisma.workout_Exercise_Log.delete({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      message : "deleted log successfully!"
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// read workout exercise log
router.get("/getWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.userId

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    const exerciselog = await prisma.workout_Exercise_Log.findUnique({
      where : {
        id : id
      }
    })

    return res.status(200).json({
      exerciselog
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get all workout session log containing all exercises

router.get("/getAllWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.userId // workout session log id

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    const exerciseLogs = await prisma.workout_Exercise_Log.findMany({
      where : {
        workout_session_log_id : id,
        user_id : userId
      }
    })


    return res.status(200).json({
      exerciseLogs
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});


// read all workout exercise log 
router.get("/getAllWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.userId

    if(typeof id !== "string"){
      return res.status(400).json({
        message : "provide valid id"
      })
    }

    const exerciseLogs = await prisma.workout_Exercise_Log.findMany({
      where : {
        user_id : userId
      }
    })


    return res.status(200).json({
      exerciseLogs
    })
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get workout session summary
router.get("/getWorkoutSessionSummary", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get workout plan summary
router.get("/getWorkoutPlanSummary", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get exercise log summary
router.get("/getExerciseLogSummary", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get all summary
router.get("/getAllSummary", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});