
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { db } from "../db/connection.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
const protectedRouter = Router();

// Student and higher roles
protectedRouter.get(
  "/student/dashboard",
  authenticate,
  authorize("student", "instructor", "admin"),
  (req, res) => {
    res.json({
      message: "Welcome to the student dashboard",
      user: (req as typeof req & {
        user?: { userId: number; role: string };
      }).user,
    });
  },
);

// Instructor and admin only
protectedRouter.get(
  "/instructor/courses",
  authenticate,
  authorize("instructor", "admin"),
  (_req, res) => {
    res.json({
      message: "Instructor courses endpoint",
      courses: [],
    });
  },
);

// Admin only
protectedRouter.delete(
  "/admin/users/:id",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: `Admin access verified for user ${req.params.id}`,
      note: "User deletion will be connected to the database in a later step.",
    });
  },
);

protectedRouter.delete(
  "/admin/users/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({
        message: "Invalid user ID",
      });
      return;
    }

    try {
      const existingUser = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (existingUser.length === 0) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }

      await db
        .delete(usersTable)
        .where(eq(usersTable.id, userId));

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
);


export default protectedRouter;
