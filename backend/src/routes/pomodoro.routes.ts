import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { PomodoroSessionSchema } from "../schemas/pomodoro.shema";
import { validateZod } from "../middlewares/validateZod";
import prisma from "../config/prisma";
import { pickDefined } from "../utils/pick";
import { findOwned, updateOwned, deleteOwned } from "../utils/ownership";

const router = Router();

const POMODORO_FIELDS = [
  "task_id",
  "start_time",
  "end_time",
  "number_focus",
  "number_short_break",
  "number_long_break",
  "focus_time",
  "short_break_time",
  "long_break_time",
  "number_of_focus_session_before_longBreak",
  "interruption_time",
  "notes",
] as const;

//addPomodoro
router.post("/addPomodoro", verifyToken, validateZod(PomodoroSessionSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { task_id } = req.body;

    // if the session is tied to a task, make sure that task belongs to the user
    if (task_id) {
      const task = await findOwned(prisma.task, task_id, userId, { delete: false });
      if (!task) {
        return res.status(400).json({ message: "task not found" });
      }
    }

    const data: any = pickDefined(req.body, POMODORO_FIELDS);
    data.user_id = userId;

    await prisma.pomodoro_Session.create({ data });

    return res.status(200).json({
      message: "Pomodoro Session created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//updatePomodoro
router.put("/updatePomodoro", verifyToken, validateZod(PomodoroSessionSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "enter correct id of pomodoro session",
      });
    }

    const data = pickDefined(req.body, POMODORO_FIELDS);

    const { count } = await updateOwned(prisma.pomodoro_Session, id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        message: "Incorrect pomo session id",
      });
    }

    return res.status(200).json({
      message: "Pomodoro Session updated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//deletePomodoro
router.delete("/deletePomodoro", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "enter correct id of pomodoro session",
      });
    }

    const { count } = await deleteOwned(prisma.pomodoro_Session, id, userId);

    if (count === 0) {
      return res.status(404).json({
        message: "Incorrect pomo session id",
      });
    }

    return res.status(200).json({
      message: "Pomodoro Session deleted Successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//getPomodoro
router.get("/getPomodoro", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "enter correct id of pomodoro session",
      });
    }

    const pomo = await findOwned(prisma.pomodoro_Session, id, userId);

    if (!pomo) {
      return res.status(404).json({
        message: "Incorrect pomo session id",
      });
    }

    return res.status(200).json({
      pomodoro_session: pomo,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//getAllPomodoroOfSameTask
router.get("/getAllPomodoroOfSameTask", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const taskid = req.query.taskid;

    if (typeof taskid !== "string") {
      return res.status(400).json({
        message: "enter correct task id for pomodoro session",
      });
    }

    const pomos = await prisma.pomodoro_Session.findMany({
      where: {
        task_id: taskid,
        user_id: userId,
      },
    });

    return res.status(200).json({
      pomodoro_sessions: pomos,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//getRecentPomodoro
router.get("/getRecentPomodoro", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const pomo = await prisma.pomodoro_Session.findFirst({
      where: { user_id: userId },
      orderBy: { start_time: "desc" },
    });

    return res.status(200).json({
      pomodoro_session: pomo,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//getSummaryOfSepecificPomodoro
router.get("/getSummaryOfSepecificPomodoro", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//getSummaryOfSpecificTaskPomodoro
router.get("/getSummaryOfSpecificTaskPomodoro", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

//getSummaryOfAllPomodoros
router.get("/getSummaryOfAllPomodoros", verifyToken, async (req, res) => {
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
