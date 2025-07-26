import { Router } from "express";

//middleware
import { verifyToken } from "../middlewares/verifyToken";
import { validateZod } from "../middlewares/validateZod";

//zod schema
import { TagSchema } from "../schemas/tag.schema";
import prisma from "../config/prisma";
import { type } from "node:os";

const router = Router();

router.post("/createTag",validateZod(TagSchema),verifyToken,async (req, res) => {
    try {
      const { tag_name, description, color_code } = req.body;

      const userId = (req as any).user.userId;

      await prisma.tag.create({
        data: {
          user_id: userId,
          tag_name: tag_name,
          description: description,
          color_code: color_code,
        },
      });

      return res.status(200).json({
        message: "Tag created successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: "Internal Server Error!",
      });
    }
  }
);

router.delete("/deleteTag", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const tagId = req.query.tag_id;

    if (typeof tagId !== "string") {
      return res.status(400).json({
        error: "Invalid tag id",
      });
    }

    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    });

    if (!tag || tag.user_id != userId) {
      return res.status(404).json({
        error: "Tag not found",
      });
    }

    await prisma.tag.update({
      where: {
        id: tagId,
      },
      data: {
        delete: true,
      },
    });

    return res.status(200).json({
      message: "Tag deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.put("/updateTag", verifyToken, validateZod(TagSchema), async (req, res) => {
    try {
      const { tag_name, description, color_code } = req.body;

      const tagId = req.query.tag_id;

      const userId = (req as any).user.userId;

      if (!tagId || typeof tagId !== "string") {
        return res.status(400).json({
          error: "Invalid tag id",
        });
      }

      const tag = await prisma.tag.findUnique({
        where: {
          id: tagId,
        },
      });

      if (tag?.delete === true) {
        return res.status(400).json({
          error: "Tag is deleted",
        });
      }

      if (!tag || tag.user_id != userId) {
        return res.status(404).json({
          error: "Tag not found",
        });
      }

      const updatedData: any = {};

      if (tag_name === undefined) {
        updatedData.tag_name = tag.tag_name;
      } else updatedData.tag_name = tag_name;

      if (description === undefined) {
        updatedData.description = tag.description;
      } else updatedData.description = description;

      if (color_code === undefined) {
        updatedData.color_code = tag.color_code;
      } else updatedData.color_code = color_code;

      await prisma.tag.update({
        where: {
          id: tagId,
        },
        data: updatedData,
      });

      return res.status(200).json({
        message: "Tag updated successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: "Internal Server Error!",
      });
    }
  }
);

router.get("/getTagById", verifyToken, async (req, res) => {
  try {
    const tagId = req.query.tag_id;

    const userId = (req as any).user.userId;

    if (typeof tagId !== "string") {
      return res.status(400).json({
        error: "Invalid tag id",
      });
    }

    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    });

    if (!tag || tag.user_id != userId) {
      return res.status(404).json({
        error: "Tag not found",
      });
    }

    if (tag?.delete === true) {
      return res.status(400).json({
        error: "Tag is deleted",
      });
    }

    return res.status(200).json({
      tag: tag,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getAllTags", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.user_id;

    const tags = await prisma.tag.findMany({
      where: {
        user_id: userId,
      },
    });

    const updatedTags = tags.filter((tag) => !tag.delete);

    return res.status(200).json({
      tags: updatedTags,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getTagByName", verifyToken, async (req, res) => {
  try {
    const searchTerm = req.query?.search;

    const userId = (req as any).user.userId;

    if (typeof searchTerm !== "string") {
      return res.status(400).json({
        error: "Invalid search term",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        tag_name: {
          contains: searchTerm, // check if this term matches the tag_name or contains it
          mode: "insensitive", // for case-insensitive
        },
      },
    });

    const updatedTags = tags.filter(
      (tag) => !tag.delete && tag.user_id === userId
    );

    return res.status(200).json({
      tags: updatedTags,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getTagByColorCode", verifyToken, async (req, res) => {
  try {
    // need to add %23 for '#' in query
    const color_code = req.query.color;

    const userId = (req as any).user.userId;

    if (typeof color_code !== "string") {
      return res.status(400).json({
        error: "Invalid color code",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        color_code: color_code,
      },
    });

    const updatedTags = tags.filter(
      (tag) => !tag.delete && tag.user_id === userId
    );

    return res.status(200).json({
      tags: updatedTags,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getTagByCreatedDate", verifyToken, async (req, res) => {
  try {
    // send timestamp by query
    const timestamp = Number(req.query.timestamp);

    const userId = (req as any).user.userId;

    if (typeof timestamp !== "number") {
      return res.status(400).json({
        error: "Invalid timestamp",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        created_At: new Date(timestamp),
      },
    });

    const updatedTags = tags.filter(
      (tag) => !tag.delete && tag.user_id === userId
    );

    return res.status(200).json({
      tags: updatedTags,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

router.get("/getTagByUpdatedDate", verifyToken, async (req, res) => {
  try {
    // send timestamp by query
    const timestamp = Number(req.query.timestamp);
    const userId = (req as any).user.userId;

    if (typeof timestamp !== "number") {
      return res.status(400).json({
        error: "Invalid timestamp",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        updated_At: new Date(timestamp),
      },
    });

    const updatedTags = tags.filter(
      (tag) => !tag.delete && tag.user_id === userId
    );

    return res.status(200).json({
      tags: updatedTags,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

export default router;
