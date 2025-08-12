import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";


const router = Router();

// createHabit
router.post('/createHabit', verifyToken, async (req, res)=>{
  try {
  
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
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

// updateHabit
router.put('/updateHabit', verifyToken, async (req, res)=>{
  try {
  
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