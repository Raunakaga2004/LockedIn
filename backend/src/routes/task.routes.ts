import { Router } from "express";
import prisma from "../config/prisma";

// middleware
import { verifyToken } from "../middlewares/verifyToken";
import { validateZod, validateZodQuery } from "../middlewares/validateZod";

// zod schema
import { RecurrenceSchema, TaskFilterSchema, TaskSchema } from "../schemas/task.schema";

// utils
import { pickDefined } from "../utils/pick";
import { findOwned, updateOwned } from "../utils/ownership";

const router = Router();

const TASK_FIELDS = ["title", "description", "type", "status", "urgent", "important", "expected_pomodoro"] as const;
const RECURRENCE_FIELDS = ["frequency", "interval", "start_date", "end_date", "exceptions"] as const;

router.post("/createTask", verifyToken, validateZod(TaskSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!req.body.title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const data: any = pickDefined(req.body, TASK_FIELDS);
    data.user_id = userId;

    await prisma.task.create({ data });

    return res.status(200).json({
      message: "Task created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.delete("/deleteTask", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    // Task is soft-deleted (a `delete` flag), not removed from the table.
    const { count } = await updateOwned(prisma.task, id, userId, {
      delete: true,
    });

    if (count === 0) {
      return res.status(404).json({
        error: "Task doesn't exist!",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateTask", verifyToken, validateZod(TaskSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    const data = pickDefined(req.body, TASK_FIELDS);

    const { count } = await updateOwned(prisma.task, id, userId, data);

    if (count === 0) {
      return res.status(404).json({
        message: "task not found",
      });
    }

    return res.status(200).json({
      message: "task updated",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getTaskById", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    const task = await findOwned(prisma.task, id, userId);

    if (!task) {
      return res.status(404).json({
        message: "task not found",
      });
    }

    return res.status(200).json({
      task: task,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateTaskStatus", verifyToken, validateZod(TaskSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    if (!req.body.status) {
      return res.status(400).json({
        error: "status is required",
      });
    }

    const { count } = await updateOwned(prisma.task, id, userId, {
      status: req.body.status,
    });

    if (count === 0) {
      return res.status(404).json({
        message: "task not found",
      });
    }

    return res.status(200).json({
      message: "task status updated",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// get tasks by filter - this is a GET, so filters travel as query params,
// not a request body (browsers/axios don't reliably send a body on GET).
router.get("/getTasks", verifyToken, validateZodQuery(TaskFilterSchema), async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { status, urgent, important, type, search_name, tag_id } = res.locals.query;

    const where: any = {
      user_id: userId,
      delete: false,
    };

    if (search_name) {
      where.title = {
        contains: search_name,
        mode: "insensitive",
      };
    }
    if (type) where.type = type;
    if (status) where.status = status;
    if (urgent !== undefined) where.urgent = urgent;
    if (important !== undefined) where.important = important;
    if (tag_id) {
      where.task_tag = { some: { tag_id } };
    }

    const tasks = await prisma.task.findMany({ where });

    return res.status(200).json({
      tasks: tasks,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.post("/addRecurrence", verifyToken, validateZod(RecurrenceSchema), async (req, res) => {
  try {
    const { base_task_id, days_of_week, frequency } = req.body;

    const userId = req.user!.userId;

    if (typeof base_task_id !== "string") {
      return res.status(400).json({ error: "base_task_id is required" });
    }

    // check the task really exists, belongs to this user, and isn't deleted
    const task = await findOwned(prisma.task, base_task_id, userId, { delete: false });

    if (!task) {
      return res.status(400).json({
        error: "Task not found or is deleted",
      });
    }

    const data: any = pickDefined(req.body, RECURRENCE_FIELDS);
    data.base_task_id = base_task_id;

    if (frequency === "weekly" && days_of_week) {
      data.days_of_week = days_of_week;
    }

    await prisma.recurrence.create({ data });

    return res.status(200).json({
      message: "Recurrence created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getRecurrenceDetails", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const recurrenceId = req.query.recId;

    if (typeof recurrenceId !== "string") {
      return res.status(400).json({
        error: "Invalid recurrence id",
      });
    }

    const recurrence = await findOwned(prisma.recurrence, recurrenceId, userId, { delete: false });

    if (!recurrence) {
      return res.status(404).json({
        error: "Recurrence not found",
      });
    }

    return res.status(200).json({
      recurrence: recurrence,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllRecurrenceDetails", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const recurrences = await prisma.recurrence.findMany({
      where: {
        user_id: userId,
        delete: false,
      },
    });

    return res.status(200).json({
      recurrences: recurrences,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateRecurrence", verifyToken, validateZod(RecurrenceSchema), async (req, res) => {
  try {
    const { days_of_week, frequency } = req.body;
    const recId = req.query.recId;

    const userId = req.user!.userId;

    if (typeof recId !== "string") {
      return res.status(400).json({
        error: "Invalid recurrence id",
      });
    }

    // check it exists, belongs to this user, isn't deleted, and its base
    // task hasn't itself been deleted
    const recurrence = await findOwned(prisma.recurrence, recId, userId, { delete: false });

    if (!recurrence) {
      return res.status(400).json({
        error: "Recurrence not found!",
      });
    }

    const task = await prisma.task.findFirst({
      where: { id: recurrence.base_task_id, user_id: userId, delete: false },
    });

    if (!task) {
      return res.status(400).json({
        error: "Task not found or is deleted",
      });
    }

    const data: any = pickDefined(req.body, RECURRENCE_FIELDS);

    if (frequency === "weekly" && days_of_week) {
      data.days_of_week = days_of_week;
    }

    await prisma.recurrence.update({
      where: { id: recId },
      data,
    });

    return res.status(200).json({
      message: "Recurrence updated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.delete("/deleteRecurrence", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const recurrenceId = req.query.recId;

    if (typeof recurrenceId !== "string") {
      return res.status(400).json({
        error: "Invalid recurrence id",
      });
    }

    const { count } = await updateOwned(prisma.recurrence, recurrenceId, userId, {
      delete: true,
    });

    if (count === 0) {
      return res.status(404).json({
        error: "Recurrence not found",
      });
    }

    return res.status(200).json({
      message: "Recurrence deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getEisenhowerTasks - urgent/important quadrant view
router.get("/getEisenhowerTasks", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
        delete: false,
        OR: [{ urgent: true }, { important: true }],
      },
    });

    return res.status(200).json({
      tasks: tasks,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// reports endpoints - not implemented yet

router.get("/getTaskSummary", verifyToken, async (req, res) => {
  try {
    return res.status(501).json({ error: "Not implemented" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllTaskSummary", verifyToken, async (req, res) => {
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
