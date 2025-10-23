import { Router } from "express";
import prisma from "../config/prisma";

// middleware
import { verifyToken } from "../middlewares/verifyToken";
import { validateZod } from "../middlewares/validateZod";

// zod schema
import { RecurrenceSchema, TaskSchema } from "../schemas/task.schema";
import fa from "zod/v4/locales/fa.cjs";

const router = Router();

router.post(
  "/createTask",
  verifyToken,
  validateZod(TaskSchema),
  async (req, res) => {
    try {
      const userId = (req as any).user.userId;

      const {
        title,
        description,
        type,
        status,
        urgent,
        important,
        expected_pomodoro,
      } = req.body;

      const data: any = {};

      data.title = title;

      if (description) {
        data.description = description;
      }

      if (type) {
        // dont give 'quick task'
        data.type = type;
      }

      if (status) {
        data.status = status;
      }

      if (urgent) {
        data.urgent = urgent;
      }

      if (important) {
        data.important = important;
      }

      if (expected_pomodoro) {
        data.expected_pomodoro = expected_pomodoro;
      }

      data.user_id = userId;

      await prisma.task.create({
        data: data,
      });

      return res.status(200).json({
        message: "Task created successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: "Internal Server Error!",
      });
    }
  }
);

router.delete("/deleteTask", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    if (task?.user_id !== userId) {
      return res.status(400).json({
        error: "Task doesn't exist!",
      });
    }

    await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        delete: true,
      },
    });

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

router.put(
  "/updateTask",
  verifyToken,
  validateZod(TaskSchema),
  async (req, res) => {
    try {
      const userId = (req as any).user.userId;

      const {
        title,
        description,
        type,
        status,
        urgent,
        important,
        expected_pomodoro,
      } = req.body;

      const data: any = {};

      if (title) {
        data.title = title;
      }
      if (description) {
        data.description = description;
      }
      if (type) {
        // dont give 'quick task'
        data.type = type;
      }
      if (status) {
        data.status = status;
      }
      if (urgent) {
        data.urgent = urgent;
      }
      if (important) {
        data.important = important;
      }
      if (expected_pomodoro) {
        data.expected_pomodoro = expected_pomodoro;
      }

      const id = req.query.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          error: "Invalid task id",
        });
      }

      const task = await prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task || task.user_id !== userId) {
        return res.status(400).json({
          message: "task not found",
        });
      }

      await prisma.task.update({
        where: {
          id: id,
        },
        data: data,
      });

      return res.status(200).json({
        message: "task updated",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: "Internal Server Error!",
      });
    }
  }
);

router.get("/getTaskById", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const id = req.query.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!task || task.user_id !== userId) {
      return res.status(400).json({
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

router.put(
  "/updateTaskStatus",
  validateZod(TaskSchema),
  verifyToken,
  async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const id = req.query.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          error: "Invalid task id",
        });
      }

      const task = await prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task || task.user_id !== userId) {
        return res.status(400).json({
          message: "task not found",
        });
      }

      await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          status: req.body.status,
        },
      });

      return res.status(200).json({
        message: "task status updated",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: "Internal Server Error!",
      });
    }
  }
);

//get tasks by filter
router.get(
  "/getTasks", verifyToken, validateZod(TaskSchema), async (req, res) => {
    try {
      const userId = (req as any).user.userId;

      const {
        tag,
        status,
        urgent,
        important,
        type,
        search_name,
        repeat,
        created_At,
        updated_At,
      } = req.body;

      const data: any = {};

      if (search_name) {
        data.title = {
          contains: search_name,
          mode: "insensitive",
        };
      }
      if (type) {
        // dont give 'quick task'
        data.type = type;
      }
      if (status) {
        data.status = status;
      }
      if (urgent) {
        data.urgent = urgent;
      }
      if (important) {
        data.important = important;
      }
      if (repeat) {
        data.repeat = repeat;
      }
      if (created_At) {
        data.created_At = created_At;
      }
      if (updated_At) {
        data.updated_At = updated_At;
      }
      
      data.delete = false

      data.user_id = userId;

      const tasks = await prisma.task.findMany({
        where: data,
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
  }
);

router.post("/addRecurrence", verifyToken, validateZod(RecurrenceSchema), async (req, res) => {
  try {
    const { base_task_id, frequency, interval, days_of_week, start_date, end_date, exceptions } = req.body;

    const userId = (req as any).user.userId;

    // check if task really exist and is not deleted
    const task = await prisma.task.findUnique({
      where: {
        id : base_task_id
      }
    })

    if(!task || task.user_id !== userId || task.delete){
      return res.status(400).json({
        error: "Task not found or is deleted",
      })
    }

    const data : any = {};

    data.base_task_id = base_task_id;
    if(frequency){
      data.frequency = frequency
    }

    if(frequency === 'weekly' && days_of_week){
      data.days_of_week = days_of_week
    }
    
    if(interval){
      data.interval = interval
    }

    if(start_date){
      data.start_date = start_date
    }

    if(end_date){
      data.end_date = end_date
    }

    if(exceptions){
      data.exceptions = exceptions
    }

    // create recurrence 
    await prisma.recurrence.create({
      data : data
    })

    return res.status(200).json({
      message: "Recurrence created successfully",
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getRecurrenceDetails
router.get("/getRecurrenceDetails", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const recurrenceId = req.query.recId;

    if(typeof recurrenceId !== 'string'){
      return res.status(400).json({
        error: "Invalid recurrence id",
      })
    }

    const recurrence = await prisma.recurrence.findUnique({
      where : {
        id : recurrenceId
      }
    })

    if(!recurrence || recurrence.user_id !== userId || recurrence.delete){
      return res.status(404).json({
        error: "Recurrence not found",
      })
    }

    return res.status(200).json({
      recurrence : recurrence
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllRecurrenceDetails", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const recurrences = await prisma.recurrence.findMany({
      where: {
        user_id: userId,
        delete : false
      }
    })

    return res.status(200).json({
      recurrences: recurrences
    })

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// updateRecurrence
router.put("/updateRecurrence", verifyToken, validateZod(RecurrenceSchema), async (req, res) => {
  try {
    const {recId, frequency, interval, days_of_week, start_date, end_date, exceptions } = req.body;

    const userId = (req as any).user.userId;

    // check if task really exist and is not deleted
    const recurrence = await prisma.recurrence.findUnique({
      where : {
        id : recId
      }
    })

    if(!recurrence || recurrence.user_id != userId || recurrence.delete){
      return res.status(400).json({
        error: "Recurrence not found!"
      })
    }

    const task = await prisma.task.findUnique({
      where: {
        id : recurrence.base_task_id
      }
    })

    if(!task || task.user_id !== userId || task.delete){
      return res.status(400).json({
        error: "Task not found or is deleted",
      })
    }

    const data : any = {};

    if(frequency){
      data.frequency = frequency
    }

    if(frequency === 'weekly' && days_of_week){
      data.days_of_week = days_of_week
    }
    
    if(interval){
      data.interval = interval
    }

    if(start_date){
      data.start_date = start_date
    }

    if(end_date){
      data.end_date = end_date
    }

    if(exceptions){
      data.exceptions = exceptions
    }

    // create recurrence 
    await prisma.recurrence.update({
      where : {
        id : recId
      },
      data : data
    })

    return res.status(200).json({
      message: "Recurrence created successfully",
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// deleteRecurrence
router.delete("/deleteRecurrence", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const recurrenceId = req.query.recId;

    if(typeof recurrenceId !== 'string'){
      return res.status(400).json({
        error: "Invalid recurrence id",
      })
    }

    const recurrence = await prisma.recurrence.findUnique({
      where : {
        id : recurrenceId
      }
    })

    if(!recurrence || recurrence.user_id !== userId || recurrence.delete){
      return res.status(404).json({
        error: "Recurrence not found",
      })
    }

    await prisma.recurrence.update({
      where: {
        id: recurrenceId
      },
      data : {
        delete : true
      }
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

// getEisenhowerTasks
router.get("/getEisenhowerTasks", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
        urgent: true || false,
        important: true || false,
        delete : false
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


// reports endpoints

router.get("/getTaskSummary", verifyToken, async (req, res) => {
  try {

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllTaskSummary", verifyToken, async (req, res) => {
  try {

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

export default router;
