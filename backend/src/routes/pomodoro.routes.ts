import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";


const router = Router();

//addPomodoro
router.post('/addPomodoro', verifyToken, async (req, res)=>{
  try {
  
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
})

//updatePomodoro // add break time distraction time and study all details in this
router.put('/updatePomodoro', verifyToken, async (req, res)=>{
  try {
  
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