import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

import prisma from "../config/prisma";
import { validateZod } from "../middlewares/validateZod";
import { WorkoutExerciseLogSchema, WorkoutPlanExerciseSchema, WorkoutPlanSchema, WorkoutSessionLogSchema } from "../schemas/workout.schema";
import { pickDefined } from "../utils/pick";
import { findOwned, updateOwned, deleteOwned } from "../utils/ownership";

const router = Router();

const PLAN_FIELDS = ["title", "description"] as const;
const EXERCISE_FIELDS = ["exercise_name", "description", "order", "notes"] as const;
const SESSION_LOG_FIELDS = ["workout_plan_id", "notes", "start_time", "end_time"] as const;
const EXERCISE_LOG_FIELDS = [
  "workout_session_log_id",
  "workout_plan_exercise_id",
  "set",
  "reps",
  "rest",
  "start_time",
  "end_time",
  "max_weight",
  "notes",
] as const;

// ---- Workout Plan ----

router.post("/addWorkoutPlan", verifyToken, validateZod(WorkoutPlanSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const data: any = pickDefined(req.body, PLAN_FIELDS);
    data.user_id = userId;

    await prisma.workout_Plan.create({ data });

    return res.status(200).json({
      message: "Workout Plan created Successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.delete("/deleteWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid workout plan id",
      });
    }

    const { count } = await updateOwned(prisma.workout_Plan, id, userId, {
      delete: true,
    });

    if (count === 0) {
      return res.status(404).json({
        message: "workout plan not found",
      });
    }

    return res.status(200).json({
      message: "Deleted Successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid workout plan id",
      });
    }

    const workoutPlan = await findOwned(prisma.workout_Plan, id, userId, { delete: false });

    if (!workoutPlan) {
      return res.status(404).json({
        message: "workout plan not found",
      });
    }

    return res.status(200).json({
      workoutPlan,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const workoutPlans = await prisma.workout_Plan.findMany({
      where: {
        user_id: userId,
        delete: false,
      },
    });

    return res.status(200).json({
      workoutPlans,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateWorkoutPlan", verifyToken, validateZod(WorkoutPlanSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid workout plan id",
      });
    }

    const data = pickDefined(req.body, PLAN_FIELDS);

    const { count } = await updateOwned(prisma.workout_Plan, id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        message: "workout plan not found",
      });
    }

    return res.status(200).json({
      message: "workout plan updated successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// ---- Workout Plan Exercises ----

router.post("/addExercise", verifyToken, validateZod(WorkoutPlanExerciseSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { workout_plan_id } = req.body;

    if (!workout_plan_id) {
      return res.status(400).json({
        message: "workout_plan_id is required",
      });
    }

    const workout_plan = await findOwned(prisma.workout_Plan, workout_plan_id, userId, { delete: false });
    if (!workout_plan) {
      return res.status(400).json({
        message: "workout plan not found",
      });
    }

    const data: any = pickDefined(req.body, EXERCISE_FIELDS);
    data.user_id = userId;
    data.workout_plan_id = workout_plan_id;

    await prisma.workout_Plan_Exercise.create({ data });

    return res.status(200).json({
      message: "workout plan exercise added.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.delete("/deleteExercise", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "please provide a valid id",
      });
    }

    const { count } = await updateOwned(prisma.workout_Plan_Exercise, id, userId, {
      delete: true,
    });

    if (count === 0) {
      return res.status(404).json({
        message: "exercise not found",
      });
    }

    return res.status(200).json({
      message: "workout plan exercise deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateExercise", verifyToken, validateZod(WorkoutPlanExerciseSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "please provide a valid id",
      });
    }

    const { workout_plan_id } = req.body;

    // if moving the exercise to a different plan, make sure that plan is
    // also owned by this user
    if (workout_plan_id) {
      const workout_plan = await findOwned(prisma.workout_Plan, workout_plan_id, userId, { delete: false });
      if (!workout_plan) {
        return res.status(400).json({
          message: "workout plan not found",
        });
      }
    }

    const data = pickDefined(req.body, [...EXERCISE_FIELDS, "workout_plan_id"] as const);

    const { count } = await updateOwned(prisma.workout_Plan_Exercise, id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        message: "exercise not found",
      });
    }

    return res.status(200).json({
      message: "workout plan exercise updated.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getExercise", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "please provide a valid id",
      });
    }

    const exercise = await findOwned(prisma.workout_Plan_Exercise, id, userId, { delete: false });

    if (!exercise) {
      return res.status(404).json({
        message: "exercise not found",
      });
    }

    return res.status(200).json({
      exercise,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getExerciseOfWorkoutPlan", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const workout_plan_id = req.query.id;

    if (typeof workout_plan_id !== "string") {
      return res.status(400).json({
        message: "please provide a valid id",
      });
    }

    const workout_plan = await findOwned(prisma.workout_Plan, workout_plan_id, userId, { delete: false });
    if (!workout_plan) {
      return res.status(400).json({
        message: "workout plan not found",
      });
    }

    const exercises = await prisma.workout_Plan_Exercise.findMany({
      where: {
        workout_plan_id: workout_plan_id,
        user_id: userId,
        delete: false,
      },
    });

    return res.status(200).json({
      exercises,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllExercises", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const exercises = await prisma.workout_Plan_Exercise.findMany({
      where: {
        user_id: userId,
        delete: false,
      },
    });

    return res.status(200).json({
      exercises,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// ---- Workout Session Log ----

router.post("/addWorkoutSessionLog", verifyToken, validateZod(WorkoutSessionLogSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { workout_plan_id } = req.body;

    if (workout_plan_id) {
      const workout_plan = await findOwned(prisma.workout_Plan, workout_plan_id, userId, { delete: false });
      if (!workout_plan) {
        return res.status(400).json({
          message: "workout plan not found",
        });
      }
    }

    const data: any = pickDefined(req.body, SESSION_LOG_FIELDS);
    data.user_id = userId;

    await prisma.workout_Session_Log.create({ data });

    return res.status(200).json({
      message: "Workout Session log added Successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateWorkoutSessionLog", verifyToken, validateZod(WorkoutSessionLogSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const data = pickDefined(req.body, SESSION_LOG_FIELDS);

    const { count } = await updateOwned(prisma.workout_Session_Log, id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        message: "workout session log not found",
      });
    }

    return res.status(200).json({
      message: "workout session log updated successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const workoutSessionLog = await findOwned(prisma.workout_Session_Log, id, userId);

    if (!workoutSessionLog) {
      return res.status(404).json({
        message: "workout session log not found",
      });
    }

    return res.status(200).json({
      workoutSessionLog,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllWorkoutSessionLogOfWorkout", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id; // workout plan id

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const workoutSessionLogs = await prisma.workout_Session_Log.findMany({
      where: {
        workout_plan_id: id,
        user_id: userId,
      },
    });

    return res.status(200).json({
      workoutSessionLogs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const workoutSessionLogs = await prisma.workout_Session_Log.findMany({
      where: {
        user_id: userId,
      },
    });

    return res.status(200).json({
      workoutSessionLogs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.delete("/deleteWorkoutSessionLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const { count } = await deleteOwned(prisma.workout_Session_Log, id, userId);

    if (count === 0) {
      return res.status(404).json({
        message: "workout session log not found",
      });
    }

    return res.status(200).json({
      message: "session log deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// ---- Workout Exercise Log ----

router.post("/addWorkoutExerciseLog", verifyToken, validateZod(WorkoutExerciseLogSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { workout_session_log_id, workout_plan_exercise_id } = req.body;

    if (workout_session_log_id) {
      const log = await findOwned(prisma.workout_Session_Log, workout_session_log_id, userId);
      if (!log) {
        return res.status(400).json({ message: "workout session log not found" });
      }
    }

    if (workout_plan_exercise_id) {
      const exercise = await findOwned(prisma.workout_Plan_Exercise, workout_plan_exercise_id, userId, { delete: false });
      if (!exercise) {
        return res.status(400).json({ message: "exercise not found" });
      }
    }

    const data: any = pickDefined(req.body, EXERCISE_LOG_FIELDS);
    data.user_id = userId;

    await prisma.workout_Exercise_Log.create({ data });

    return res.status(200).json({
      message: "workout exercise log created successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateWorkoutExerciseLog", verifyToken, validateZod(WorkoutExerciseLogSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const data = pickDefined(req.body, EXERCISE_LOG_FIELDS);

    const { count } = await updateOwned(prisma.workout_Exercise_Log, id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        message: "exercise log not found",
      });
    }

    return res.status(200).json({
      message: "workout exercise log updated successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.delete("/deleteWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const { count } = await deleteOwned(prisma.workout_Exercise_Log, id, userId);

    if (count === 0) {
      return res.status(404).json({
        message: "exercise log not found",
      });
    }

    return res.status(200).json({
      message: "deleted log successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const exerciselog = await findOwned(prisma.workout_Exercise_Log, id, userId);

    if (!exerciselog) {
      return res.status(404).json({
        message: "exercise log not found",
      });
    }

    return res.status(200).json({
      exerciselog,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// all exercise logs for one workout session
router.get("/getWorkoutExerciseLogsOfSession", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id; // workout session log id

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "provide valid id",
      });
    }

    const exerciseLogs = await prisma.workout_Exercise_Log.findMany({
      where: {
        workout_session_log_id: id,
        user_id: userId,
      },
    });

    return res.status(200).json({
      exerciseLogs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// every exercise log for this user
router.get("/getAllWorkoutExerciseLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const exerciseLogs = await prisma.workout_Exercise_Log.findMany({
      where: {
        user_id: userId,
      },
    });

    return res.status(200).json({
      exerciseLogs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// ---- Summaries (not implemented yet) ----

router.get("/getWorkoutSessionSummary", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getWorkoutPlanSummary", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getExerciseLogSummary", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllSummary", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

export default router;
