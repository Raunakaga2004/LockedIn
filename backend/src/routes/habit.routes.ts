import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { validateZod } from "../middlewares/validateZod";
import { HabitLogSchema, HabitSchema } from "../schemas/habit.schema";
import prisma from "../config/prisma";
import { pickDefined } from "../utils/pick";
import { findOwned, updateOwned, deleteOwned } from "../utils/ownership";

const router = Router();

const HABIT_FIELDS = ["title", "description", "start_date", "end_date", "frequency", "interval"] as const;
const HABIT_LOG_FIELDS = ["habit_id", "date", "notes", "completed"] as const;

// createHabit
router.post("/createHabit", verifyToken, validateZod(HabitSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { title, frequency, days_of_week } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const data: any = pickDefined(req.body, HABIT_FIELDS);
    data.user_id = userId;
    data.days_of_week = frequency === "weekly" ? (days_of_week ?? []) : [];

    await prisma.habit.create({ data });

    return res.status(200).json({
      message: "Habit created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getHabit
router.get("/getHabit", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const habit_id = req.query.id;

    if (typeof habit_id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    const habit = await findOwned(prisma.habit, habit_id, userId);

    if (!habit) {
      return res.status(404).json({
        error: "Habit not found",
      });
    }

    return res.status(200).json({
      habit: habit,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getAllHabit
router.get("/getAllHabit", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const habits = await prisma.habit.findMany({
      where: {
        user_id: userId,
        delete: false,
      },
    });

    return res.status(200).json({
      habits: habits,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// updateHabit
router.put("/updateHabit", verifyToken, validateZod(HabitSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const habit_id = req.query.id;

    if (typeof habit_id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    const { frequency, days_of_week } = req.body;

    const data: any = pickDefined(req.body, HABIT_FIELDS);
    if (frequency !== undefined) {
      data.days_of_week = frequency === "weekly" ? (days_of_week ?? []) : [];
    }

    const { count } = await updateOwned(prisma.habit, habit_id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        error: "Habit not found",
      });
    }

    return res.status(200).json({
      message: "habit updated successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// deleteHabit
router.delete("/deleteHabit", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const habit_id = req.query.id;

    if (typeof habit_id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    // Soft-delete, matching the `delete` flag the rest of the schema uses,
    // and matching the fact that Habit_Log/Time_Blocking rows reference
    // this habit (a hard delete would orphan or FK-violate those).
    const { count } = await updateOwned(prisma.habit, habit_id, userId, {
      delete: true,
    });

    if (count === 0) {
      return res.status(404).json({
        error: "Habit not found",
      });
    }

    return res.status(200).json({
      message: "habit deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// at 12:01 AM we need to add the current habits to log using node-cron

// updateHabitLog
router.put("/updateHabitLog", verifyToken, validateZod(HabitLogSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid habit log id",
      });
    }

    const data = pickDefined(req.body, HABIT_LOG_FIELDS);

    const { count } = await updateOwned(prisma.habit_Log, id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        error: "Habit log not found",
      });
    }

    return res.status(200).json({
      message: "Habit Log updated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// deleteHabitLog
router.delete("/deleteHabitLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid habit log id",
      });
    }

    const { count } = await deleteOwned(prisma.habit_Log, id, userId);

    if (count === 0) {
      return res.status(404).json({
        error: "Habit log not found",
      });
    }

    return res.status(200).json({
      message: "habit log deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// addHabitLog
router.post("/addHabitLog", verifyToken, validateZod(HabitLogSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { habit_id } = req.body;

    if (!habit_id) {
      return res.status(400).json({
        message: "please provide habit id",
      });
    }

    // make sure the habit being logged actually belongs to this user
    const habit = await findOwned(prisma.habit, habit_id, userId);
    if (!habit) {
      return res.status(400).json({
        message: "habit not found",
      });
    }

    const data: any = pickDefined(req.body, HABIT_LOG_FIELDS);
    data.user_id = userId;

    await prisma.habit_Log.create({ data });

    return res.status(200).json({
      message: "Habit Log created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getHabitLog
router.get("/getHabitLog", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid habit log id",
      });
    }

    const habitlog = await findOwned(prisma.habit_Log, id, userId);

    if (!habitlog) {
      return res.status(404).json({
        error: "Habit log not found",
      });
    }

    return res.status(200).json({
      habit_log: habitlog,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getHabitLogs - all logs for one habit
router.get("/getHabitLogs", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const habit_id = req.query.habit_id;

    if (typeof habit_id !== "string") {
      return res.status(400).json({
        error: "Invalid habit id",
      });
    }

    const habit_logs = await prisma.habit_Log.findMany({
      where: {
        habit_id: habit_id,
        user_id: userId,
      },
    });

    return res.status(200).json({
      habit_logs: habit_logs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getAllHabitLogs - every log for this user
router.get("/getAllHabitLogs", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const all_habit_logs = await prisma.habit_Log.findMany({
      where: {
        user_id: userId,
      },
    });

    return res.status(200).json({
      all_habit_logs: all_habit_logs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getHabitSummary
router.get("/getHabitsSummary", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getAllHabitSummary
router.get("/getAllHabitsSummary", verifyToken, async (req, res) => {
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
