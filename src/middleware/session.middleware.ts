
import type {
  Request,
  Response,
  NextFunction,
} from "express";

export function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.status(401).json({
    message: "Please log in to access this resource",
  });
}
