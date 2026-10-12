
import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import jwt from "jsonwebtoken";

type Role = "student" | "instructor" | "admin";

export interface AuthRequest extends Request {
  authUser?: {
    userId: number;
    role: Role;
  };
}

export const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Access token is required",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    res.status(401).json({
      message: "Invalid authentication token",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "number" ||
      !["student", "instructor", "admin"].includes(
        String(decoded.role),
      )
    ) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
      return;
    }

    (req as AuthRequest).authUser = {
      userId: decoded.userId,
      role: decoded.role as Role,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
