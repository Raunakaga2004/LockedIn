import { Router } from "express";

//middleware
import { verifyToken } from "../middlewares/verifyToken";
import { validateZod } from "../middlewares/validateZod";

//zod schema
import { TagSchema } from "../schemas/tag.schema";
import prisma from "../config/prisma";
import { pickDefined } from "../utils/pick";
import { findOwned, updateOwned } from "../utils/ownership";

const router = Router();

const TAG_FIELDS = ["tag_name", "description", "color_code"] as const;

router.post("/createTag", verifyToken, validateZod(TagSchema), async (req, res) => {
  try {
    const { tag_name, description, color_code } = req.body;

    if (!tag_name) {
      return res.status(400).json({ error: "tag_name is required" });
    }

    const userId = req.user!.userId;

    await prisma.tag.create({
      data: {
        user_id: userId,
        tag_name,
        description,
        color_code,
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
});

router.delete("/deleteTag", verifyToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const tagId = req.query.tag_id;

    if (typeof tagId !== "string") {
      return res.status(400).json({
        error: "Invalid tag id",
      });
    }

    const { count } = await updateOwned(prisma.tag, tagId, userId, {
      delete: true,
    });

    if (count === 0) {
      return res.status(404).json({
        error: "Tag not found",
      });
    }

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
    const tagId = req.query.tag_id;
    const userId = req.user!.userId;

    if (typeof tagId !== "string") {
      return res.status(400).json({
        error: "Invalid tag id",
      });
    }

    const existing = await findOwned(prisma.tag, tagId, userId, { delete: false });

    if (!existing) {
      return res.status(404).json({
        error: "Tag not found",
      });
    }

    const data = pickDefined(req.body, TAG_FIELDS);

    await prisma.tag.update({
      where: { id: tagId },
      data,
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
});

router.get("/getTagById", verifyToken, async (req, res) => {
  try {
    const tagId = req.query.tag_id;
    const userId = req.user!.userId;

    if (typeof tagId !== "string") {
      return res.status(400).json({
        error: "Invalid tag id",
      });
    }

    const tag = await findOwned(prisma.tag, tagId, userId, { delete: false });

    if (!tag) {
      return res.status(404).json({
        error: "Tag not found",
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
    const userId = req.user!.userId;

    const tags = await prisma.tag.findMany({
      where: {
        user_id: userId,
        delete: false,
      },
    });

    return res.status(200).json({
      tags: tags,
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
    const userId = req.user!.userId;

    if (typeof searchTerm !== "string") {
      return res.status(400).json({
        error: "Invalid search term",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        user_id: userId,
        delete: false,
        tag_name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });

    return res.status(200).json({
      tags: tags,
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
    const userId = req.user!.userId;

    if (typeof color_code !== "string") {
      return res.status(400).json({
        error: "Invalid color code",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        user_id: userId,
        delete: false,
        color_code,
      },
    });

    return res.status(200).json({
      tags: tags,
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
    const userId = req.user!.userId;

    if (!req.query.timestamp || Number.isNaN(timestamp)) {
      return res.status(400).json({
        error: "Invalid timestamp",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        user_id: userId,
        delete: false,
        created_At: new Date(timestamp),
      },
    });

    return res.status(200).json({
      tags: tags,
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
    const userId = req.user!.userId;

    if (!req.query.timestamp || Number.isNaN(timestamp)) {
      return res.status(400).json({
        error: "Invalid timestamp",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        user_id: userId,
        delete: false,
        updated_At: new Date(timestamp),
      },
    });

    return res.status(200).json({
      tags: tags,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error!",
    });
  }
});

export default router;
