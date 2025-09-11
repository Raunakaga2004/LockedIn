import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

import prisma from "../config/prisma";

const router = Router();

// create workout plan
router.get("/addWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;


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

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update workout plan (also add workout plan exercises)
router.get("/updateWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// add exercises to workout plan
router.get("/addExercise", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
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

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update exercise to workout plan
router.get("/updateExercise", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
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

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// add workout session log
router.get("/addWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update workout session log
router.get("/updateWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
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

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// add workout exercise log
router.get("/addWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// update workout exercise log
router.get("/updateWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
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
router.get("/getHabit", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});